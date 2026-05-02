import type { Express } from "express";
import { db } from "./db";
import { placementRequests, insertPlacementRequestSchema } from "@shared/schema";
import { eq, desc, and, or, sql } from "drizzle-orm";
import { requireAuth } from "./auth";
import sgMail from "@sendgrid/mail";

const REQUEST_TYPE_LABELS: Record<string, string> = {
  pair_players: "Pair with Another Player",
  request_coach: "Request a Specific Coach",
  schedule_needs: "Schedule Needs",
  coach_request_player: "Coach Requesting Player",
  other: "Something Else",
};

function buildConfirmationEmail(data: typeof placementRequests.$inferSelect) {
  const firstName = data.submitterName.split(" ")[0];
  const typeLabel = REQUEST_TYPE_LABELS[data.requestType] || data.requestType;

  let detailRows = `
    <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Request Type</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${typeLabel}</td></tr>
    <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Player</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.playerName}</td></tr>`;

  if (data.requestType === "pair_players") {
    detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Pair With</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.otherPlayerName}${data.relationship ? ` (${data.relationship})` : ""}</td></tr>`;
  } else if (data.requestType === "request_coach") {
    detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Coach</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.coachName}${data.connectionReason ? ` -- ${data.connectionReason}` : ""}</td></tr>`;
  } else if (data.requestType === "schedule_needs") {
    if (data.availableDays) detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Available Days</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.availableDays}</td></tr>`;
    if (data.unavailableDays) detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Unavailable Days</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.unavailableDays}</td></tr>`;
    if (data.scheduleReason) detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Reason</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.scheduleReason}</td></tr>`;
  } else if (data.requestType === "coach_request_player") {
    if (data.additionalPlayerNames) detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Additional Players</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.additionalPlayerNames}</td></tr>`;
  }

  if (data.notes) {
    detailRows += `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Notes</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.notes.replace(/\n/g, "<br>")}</td></tr>`;
  }

  return {
    to: data.submitterEmail,
    from: "admin@nipomosc.org",
    subject: "Team Placement Request Received -- Nipomo Soccer Club",
    text: `Hi ${firstName}, thanks for submitting a team placement request for ${data.playerName}. We've received it and will review it as we build rosters. We'll do our best to accommodate your request, but we can't guarantee all placements. Questions? Reach us at admin@nipomosc.org. -- Nipomo Soccer Club`,
    html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4ede1; padding:32px 0;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
      <tr><td style="background-color:#8B1D24; padding:24px 32px;">
        <h1 style="color:#F4EDE1; font-size:20px; margin:0;">Nipomo Soccer Club</h1>
        <p style="color:#F4EDE1; opacity:0.8; font-size:14px; margin:4px 0 0;">Team Placement Request Received</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="color:#333; font-size:16px; margin:0 0 16px;">Hi ${firstName},</p>
        <p style="color:#333; font-size:14px; line-height:1.6; margin:0 0 24px;">Thanks for submitting a team placement request. We've received it and will review it as we build rosters.</p>
        <table style="border-collapse:collapse; width:100%;">
          ${detailRows}
        </table>
        <p style="color:#666; font-size:13px; line-height:1.6; margin:24px 0 0; padding:16px; background:#f9f9f6; border-radius:6px;">We'll do our best to accommodate your request, but we can't guarantee all placements. If you have questions, reply to this email or reach us at <a href="mailto:admin@nipomosc.org" style="color:#8B1D24;">admin@nipomosc.org</a>.</p>
      </td></tr>
      <tr><td style="padding:16px 32px; border-top:1px solid #eee; text-align:center;">
        <p style="color:#999; font-size:12px; margin:0;">Nipomo Soccer Club &middot; Nipomo, CA &middot; <a href="https://nipomosc.org" style="color:#8B1D24;">nipomosc.org</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>`.trim(),
  };
}

function buildAdminNotificationEmail(data: typeof placementRequests.$inferSelect) {
  const typeLabel = REQUEST_TYPE_LABELS[data.requestType] || data.requestType;
  return {
    to: "admin@nipomosc.org",
    from: "admin@nipomosc.org",
    replyTo: data.submitterEmail,
    subject: `New Placement Request -- ${data.submitterName} (${typeLabel})`,
    text: `New placement request from ${data.submitterName} (${data.submitterEmail})\nType: ${typeLabel}\nPlayer: ${data.playerName}\n${data.otherPlayerName ? `Pair with: ${data.otherPlayerName}\n` : ""}${data.coachName ? `Coach: ${data.coachName}\n` : ""}${data.notes ? `Notes: ${data.notes}\n` : ""}`,
    html: `
<h2>New Team Placement Request</h2>
<table style="border-collapse:collapse; width:100%; max-width:600px;">
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Submitter</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.submitterName} (${data.submitterRole})</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="padding:8px; border-bottom:1px solid #eee;"><a href="mailto:${data.submitterEmail}">${data.submitterEmail}</a></td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.submitterPhone}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Type</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${typeLabel}</td></tr>
<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Player</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.playerName}</td></tr>
${data.otherPlayerName ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Pair With</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.otherPlayerName}${data.relationship ? ` (${data.relationship})` : ""}</td></tr>` : ""}
${data.coachName ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Coach</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.coachName}</td></tr>` : ""}
${data.availableDays ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Available Days</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.availableDays}</td></tr>` : ""}
${data.unavailableDays ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Unavailable Days</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.unavailableDays}</td></tr>` : ""}
${data.notes ? `<tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Notes</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${data.notes.replace(/\n/g, "<br>")}</td></tr>` : ""}
</table>`.trim(),
  };
}

export function registerPlacementRoutes(app: Express) {
  app.post("/api/placement-request", async (req, res) => {
    try {
      const parseResult = insertPlacementRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Please fill in all required fields" });
      }

      const data = parseResult.data;

      const validTypes = ["pair_players", "request_coach", "schedule_needs", "coach_request_player", "other"];
      if (!validTypes.includes(data.requestType)) {
        return res.status(400).json({ error: "Invalid request type" });
      }

      const validRoles = ["parent", "coach"];
      if (!validRoles.includes(data.submitterRole)) {
        return res.status(400).json({ error: "Invalid submitter role" });
      }

      const [inserted] = await db.insert(placementRequests).values(data).returning();

      try {
        await sgMail.send(buildConfirmationEmail(inserted));
      } catch (emailError: any) {
        console.error("SendGrid error (confirmation):", emailError?.response?.body || emailError);
      }

      try {
        await sgMail.send(buildAdminNotificationEmail(inserted));
      } catch (emailError: any) {
        console.error("SendGrid error (admin notification):", emailError?.response?.body || emailError);
      }

      res.json({ success: true, message: "Request submitted successfully" });
    } catch (error: any) {
      console.error("Placement request error:", error);
      res.status(500).json({ error: "Failed to submit request. Please try again." });
    }
  });

  app.get("/api/admin/placement-requests", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const status = req.query.status as string | undefined;
      const type = req.query.type as string | undefined;
      const conditions = [];
      if (status) conditions.push(eq(placementRequests.status, status));
      if (type) conditions.push(eq(placementRequests.requestType, type));

      const results = conditions.length > 0
        ? await db.select().from(placementRequests).where(and(...conditions)).orderBy(desc(placementRequests.createdAt))
        : await db.select().from(placementRequests).orderBy(desc(placementRequests.createdAt));
      res.json(results);
    } catch (error) {
      console.error("List placement requests error:", error);
      res.status(500).json({ error: "Failed to load requests" });
    }
  });

  app.get("/api/admin/placement-requests/export", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const all = await db.select().from(placementRequests).orderBy(desc(placementRequests.createdAt));

      const csvHeaders = [
        "ID", "Date", "Role", "Submitter Name", "Email", "Phone",
        "Player Name", "Request Type", "Other Player", "Relationship",
        "Coach Name", "Connection Reason", "Available Days", "Unavailable Days",
        "Schedule Reason", "Additional Players", "Notes", "Status", "Admin Notes",
      ];

      const csvEscape = (val: string | null | undefined): string => {
        if (!val) return "";
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const rows = all.map((r) => [
        r.id,
        new Date(r.createdAt).toISOString(),
        r.submitterRole,
        r.submitterName,
        r.submitterEmail,
        r.submitterPhone,
        r.playerName,
        REQUEST_TYPE_LABELS[r.requestType] || r.requestType,
        r.otherPlayerName,
        r.relationship,
        r.coachName,
        r.connectionReason,
        r.availableDays,
        r.unavailableDays,
        r.scheduleReason,
        r.additionalPlayerNames,
        r.notes,
        r.status,
        r.adminNotes,
      ].map(csvEscape).join(","));

      const csv = [csvHeaders.join(","), ...rows].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=placement-requests.csv");
      res.send(csv);
    } catch (error) {
      console.error("Export placement requests error:", error);
      res.status(500).json({ error: "Failed to export requests" });
    }
  });

  app.patch("/api/admin/placement-requests/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const updates: Partial<{ status: string; adminNotes: string }> = {};
      if (status !== undefined) {
        if (!["pending", "approved", "denied"].includes(status)) {
          return res.status(400).json({ error: "Invalid status" });
        }
        updates.status = status;
      }
      if (adminNotes !== undefined) {
        updates.adminNotes = adminNotes;
      }

      await db.update(placementRequests).set(updates).where(eq(placementRequests.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Update placement request error:", error);
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  app.get("/api/admin/placement-requests/:id/related", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const [request] = await db.select().from(placementRequests).where(eq(placementRequests.id, id));
      if (!request) return res.status(404).json({ error: "Request not found" });

      const conditions = [];
      if (request.requestType === "pair_players" && request.otherPlayerName) {
        conditions.push(
          and(
            eq(placementRequests.requestType, "pair_players"),
            sql`lower(${placementRequests.playerName}) = lower(${request.otherPlayerName})`,
            sql`lower(${placementRequests.otherPlayerName}) = lower(${request.playerName})`,
          )
        );
        conditions.push(
          and(
            eq(placementRequests.requestType, "pair_players"),
            sql`lower(${placementRequests.playerName}) = lower(${request.otherPlayerName})`,
          )
        );
      }

      if (conditions.length === 0) {
        return res.json([]);
      }

      const related = await db
        .select()
        .from(placementRequests)
        .where(and(sql`${placementRequests.id} != ${id}`, or(...conditions)));

      res.json(related);
    } catch (error) {
      console.error("Related requests error:", error);
      res.status(500).json({ error: "Failed to find related requests" });
    }
  });
}
