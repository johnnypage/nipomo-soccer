/**
 * Meta Conversions API forwarder for Spond registrations (routes + DB + network).
 * Pure parsing/mapping/hashing lives in ./metaCapi.
 *
 * Why on the server: there is no pixel on Spond's domain, so Meta can't see completed
 * registrations. An admin uploads the weekly Spond Members export here; the SERVER hashes
 * the contact fields (Meta only ever receives SHA-256, never raw PII) and forwards
 * CompleteRegistration events via the Conversions API. The pixel's ad sets can then
 * eventually optimize on real sign-ups instead of just link click-throughs.
 *
 * One event per registered kid; siblings on one parent email each get a unique order_id
 * so Meta keeps them as separate conversions. A dedup ledger (meta_capi_sent) lets the
 * cumulative Members export be re-uploaded weekly without double-counting.
 *
 * Endpoints (admin-auth, Bearer token):
 *   POST /api/admin/meta-capi/preview  - parse + map + dedupe, return summary, send nothing
 *   POST /api/admin/meta-capi/send     - same, then hash + POST to Meta + record in ledger
 *                                        (pass testEventCode to route to Test Events instead)
 */
import type { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { inArray } from "drizzle-orm";
import { db } from "./db";
import { metaCapiSent } from "@shared/schema";
import { requireAuth } from "./auth";
import { parseSpondFile, mapSpondRows, buildEvent } from "./metaCapi";

// Accept either name: Replit saved the secret as META_API_TOKEN; some docs say META_ACCESS_TOKEN.
const META_ACCESS_TOKEN = process.env.META_API_TOKEN || process.env.META_ACCESS_TOKEN || "";
const META_PIXEL_ID = process.env.META_PIXEL_ID || "1509394684211814";
const GRAPH_API = "https://graph.facebook.com/v23.0";

const uploadDir = path.resolve("uploads");
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) =>
      cb(null, `spond-${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/\.(csv|xlsx|xls)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error("Upload a Spond .xlsx or .csv export"));
  },
});

async function alreadySentKeys(keys: string[]): Promise<Set<string>> {
  if (!keys.length) return new Set();
  const existing = await db
    .select({ regKey: metaCapiSent.regKey })
    .from(metaCapiSent)
    .where(inArray(metaCapiSent.regKey, keys));
  return new Set(existing.map((r) => r.regKey));
}

async function postToMeta(events: any[], testEventCode?: string) {
  const body: any = { data: events, access_token: META_ACCESS_TOKEN };
  if (testEventCode) body.test_event_code = testEventCode;
  const res = await fetch(`${GRAPH_API}/${META_PIXEL_ID}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Meta API ${res.status}`);
  return json;
}

export function registerMetaCapiRoutes(app: Express) {
  app.post("/api/admin/meta-capi/preview", (req: Request, res: Response) => {
    if (!requireAuth(req, res)) return;
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const filePath = req.file.path;
      try {
        const rows = await parseSpondFile(filePath);
        const groupFilter = (req.body?.groupFilter || "").trim() || undefined;
        const mapped = mapSpondRows(rows, groupFilter);
        const sent = await alreadySentKeys(mapped.registrations.map((r) => r.regKey));
        const fresh = mapped.registrations.filter((r) => !sent.has(r.regKey));
        res.json({
          rowsInFile: rows.length,
          matchedColumns: mapped.columns,
          droppedNoId: mapped.droppedNoId,
          droppedGroup: mapped.droppedGroup,
          droppedDupeInFile: mapped.droppedDupeInFile,
          alreadySent: mapped.registrations.length - fresh.length,
          newCount: fresh.length,
          sample: fresh.slice(0, 5).map((r) => ({
            name: `${r.firstName} ${r.lastName}`.trim(),
            email: r.email,
            group: r.group,
            eventTime: r.eventTime?.toISOString() ?? null,
          })),
        });
      } catch (e: any) {
        console.error("meta-capi preview error:", e);
        res.status(500).json({ error: e.message || "Preview failed" });
      } finally {
        fs.unlink(filePath, () => {});
      }
    });
  });

  app.post("/api/admin/meta-capi/send", (req: Request, res: Response) => {
    if (!requireAuth(req, res)) return;
    if (!META_ACCESS_TOKEN) return res.status(500).json({ error: "META_ACCESS_TOKEN not configured" });
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const filePath = req.file.path;
      const testEventCode = (req.body?.testEventCode || "").trim() || undefined;
      try {
        const rows = await parseSpondFile(filePath);
        const groupFilter = (req.body?.groupFilter || "").trim() || undefined;
        const mapped = mapSpondRows(rows, groupFilter);
        const sentKeys = await alreadySentKeys(mapped.registrations.map((r) => r.regKey));
        const fresh = mapped.registrations.filter((r) => !sentKeys.has(r.regKey));

        if (!fresh.length) {
          return res.json({ newCount: 0, eventsReceived: 0, alreadySent: mapped.registrations.length, testMode: !!testEventCode, message: "Nothing new to send." });
        }

        let eventsReceived = 0;
        const messages: any[] = [];
        for (let i = 0; i < fresh.length; i += 1000) {
          const batch = fresh.slice(i, i + 1000);
          const result = await postToMeta(batch.map(buildEvent), testEventCode);
          eventsReceived += result?.events_received || 0;
          if (result?.messages?.length) messages.push(...result.messages);
        }

        // Only record in the ledger for a real (non-test) send, so a test run can be re-sent.
        if (!testEventCode) {
          await db.insert(metaCapiSent).values(
            fresh.map((r) => ({
              regKey: r.regKey,
              orderId: r.orderId,
              label: r.email || r.phone,
              eventName: r.eventName,
              eventTime: r.eventTime ?? null,
              status: "sent" as const,
            }))
          ).onConflictDoNothing();
        }

        res.json({
          newCount: fresh.length,
          eventsReceived,
          alreadySent: mapped.registrations.length - fresh.length,
          testMode: !!testEventCode,
          messages,
        });
      } catch (e: any) {
        console.error("meta-capi send error:", e);
        res.status(500).json({ error: e.message || "Send failed" });
      } finally {
        fs.unlink(filePath, () => {});
      }
    });
  });
}
