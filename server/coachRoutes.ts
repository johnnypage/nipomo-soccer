import type { Express } from "express";
import { db } from "./db";
import { divisions, coachAssignments, coachApplications } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth } from "./auth";

const AGE_GROUP_MAP: Record<string, string> = {
  "Pre-K": "prek",
  "1st-2nd": "g12",
  "3rd-4th": "g34",
  "5th-6th": "g56",
  "7th-8th": "g78",
  "High School": "hs",
};

const DIVISION_SEED = [
  { ageGroup: "prek", gender: "coed", headCoachesNeeded: 8, sortOrder: 0 },
  { ageGroup: "g12", gender: "girls", headCoachesNeeded: 6, sortOrder: 1 },
  { ageGroup: "g12", gender: "boys", headCoachesNeeded: 6, sortOrder: 2 },
  { ageGroup: "g34", gender: "girls", headCoachesNeeded: 12, sortOrder: 3 },
  { ageGroup: "g34", gender: "boys", headCoachesNeeded: 12, sortOrder: 4 },
  { ageGroup: "g56", gender: "girls", headCoachesNeeded: 8, sortOrder: 5 },
  { ageGroup: "g56", gender: "boys", headCoachesNeeded: 8, sortOrder: 6 },
  { ageGroup: "g78", gender: "girls", headCoachesNeeded: 5, sortOrder: 7 },
  { ageGroup: "g78", gender: "boys", headCoachesNeeded: 5, sortOrder: 8 },
  { ageGroup: "hs", gender: "girls", headCoachesNeeded: 3, sortOrder: 9 },
  { ageGroup: "hs", gender: "boys", headCoachesNeeded: 3, sortOrder: 10 },
];

async function seedDivisionsIfEmpty() {
  const existing = await db.select({ id: divisions.id }).from(divisions).limit(1);
  if (existing.length > 0) return;
  await db.insert(divisions).values(DIVISION_SEED.map((d) => ({ ...d, active: true })));
  console.log("Seeded 11 divisions");
}

export function registerCoachRoutes(app: Express) {
  seedDivisionsIfEmpty().catch((e) => console.error("Division seed error:", e));

  app.get("/api/coaching-board", async (_req, res) => {
    try {
      const allDivisions = await db
        .select()
        .from(divisions)
        .where(eq(divisions.active, true))
        .orderBy(divisions.sortOrder);

      const assignments = await db
        .select()
        .from(coachAssignments)
        .where(eq(coachAssignments.active, true));

      const approvedApps = await db
        .select()
        .from(coachApplications)
        .where(and(eq(coachApplications.status, "approved"), eq(coachApplications.showOnBoard, true)));

      // Coaches with any formal assignment are fully controlled by assignments -- never auto-placed
      const assignedAppIds = new Set(
        assignments.map((a) => a.coachApplicationId).filter(Boolean)
      );
      const assignedNames = new Set(assignments.map((a) => a.displayName.toLowerCase().trim()));

      const unassignedApps = approvedApps.filter(
        (app) => !assignedAppIds.has(app.id) && !assignedNames.has(app.name.toLowerCase().trim())
      );

      const grouped = allDivisions.map((div) => {
        const assignmentCoaches = assignments
          .filter((a) => a.divisionId === div.id)
          .map((a) => ({
            assignmentId: a.id,
            displayName: a.displayName,
            role: a.role as "head" | "assistant",
            headAssignmentId: a.headAssignmentId ?? null,
          }));

        const appCoaches: { assignmentId: string; displayName: string; role: "head" | "assistant"; headAssignmentId: null }[] = [];
        for (const app of unassignedApps) {
          const ageGroupsRaw = app.ageGroups || "";
          const appAgeGroups = ageGroupsRaw.split(",").map((s: string) => s.trim()).map((s: string) => AGE_GROUP_MAP[s]).filter(Boolean);
          if (!appAgeGroups.includes(div.ageGroup)) continue;

          const genderPref = (app.genderPreference || "").toLowerCase();
          const divGender = div.gender;
          if (divGender !== "coed") {
            if (genderPref === "boys" && divGender !== "boys") continue;
            if (genderPref === "girls" && divGender !== "girls") continue;
          }

          const roleRaw = (app.coachingRole || "").toLowerCase();
          const role: "head" | "assistant" = roleRaw.includes("assistant") ? "assistant" : "head";

          appCoaches.push({
            assignmentId: `app-${app.id}-${div.id}`,
            displayName: app.name,
            role,
            headAssignmentId: null,
          });
        }

        return {
          id: div.id,
          ageGroup: div.ageGroup,
          gender: div.gender,
          headCoachesNeeded: div.headCoachesNeeded,
          coaches: [...assignmentCoaches, ...appCoaches],
        };
      });

      res.json({ divisions: grouped });
    } catch (error) {
      console.error("Coaching board error:", error);
      res.status(500).json({ error: "Failed to load coaching board" });
    }
  });

  app.get("/api/admin/coach-applications", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const status = req.query.status as string | undefined;
      const conditions = status ? eq(coachApplications.status, status) : undefined;
      const results = conditions
        ? await db.select().from(coachApplications).where(conditions).orderBy(desc(coachApplications.createdAt))
        : await db.select().from(coachApplications).orderBy(desc(coachApplications.createdAt));
      res.json(results);
    } catch (error) {
      console.error("List applications error:", error);
      res.status(500).json({ error: "Failed to load applications" });
    }
  });

  app.patch("/api/admin/coach-applications/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      await db.update(coachApplications).set({ status }).where(eq(coachApplications.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.get("/api/admin/divisions", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const allDivisions = await db.select().from(divisions).orderBy(divisions.sortOrder);
      const assignments = await db.select().from(coachAssignments).where(eq(coachAssignments.active, true));

      const result = allDivisions.map((div) => {
        const divAssignments = assignments.filter((a) => a.divisionId === div.id);
        return {
          ...div,
          headCount: divAssignments.filter((a) => a.role === "head").length,
          assistantCount: divAssignments.filter((a) => a.role === "assistant").length,
        };
      });
      res.json(result);
    } catch (error) {
      console.error("List divisions error:", error);
      res.status(500).json({ error: "Failed to load divisions" });
    }
  });

  app.patch("/api/admin/divisions/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const { headCoachesNeeded, active } = req.body;
      const updates: Partial<{ headCoachesNeeded: number; active: boolean }> = {};
      if (headCoachesNeeded !== undefined) updates.headCoachesNeeded = headCoachesNeeded;
      if (active !== undefined) updates.active = active;
      await db.update(divisions).set(updates).where(eq(divisions.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Update division error:", error);
      res.status(500).json({ error: "Failed to update division" });
    }
  });

  app.get("/api/admin/coach-assignments", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const results = await db
        .select()
        .from(coachAssignments)
        .where(eq(coachAssignments.active, true))
        .orderBy(coachAssignments.divisionId, coachAssignments.role);
      res.json(results);
    } catch (error) {
      console.error("List assignments error:", error);
      res.status(500).json({ error: "Failed to load assignments" });
    }
  });

  app.post("/api/admin/coach-assignments", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { coachApplicationId, divisionId, role, displayName, headAssignmentId } = req.body;
      if (!divisionId || !role || !displayName) {
        return res.status(400).json({ error: "divisionId, role, and displayName are required" });
      }
      if (!["head", "assistant"].includes(role)) {
        return res.status(400).json({ error: "Role must be head or assistant" });
      }
      const [assignment] = await db.insert(coachAssignments).values({
        coachApplicationId: coachApplicationId || null,
        divisionId,
        role,
        displayName,
        headAssignmentId: role === "assistant" ? (headAssignmentId || null) : null,
        active: true,
      }).returning();
      res.json(assignment);
    } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  app.patch("/api/admin/coach-assignments/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const { headAssignmentId, displayName, coachApplicationId } = req.body;
      const updates: Partial<{
        headAssignmentId: string | null;
        displayName: string;
        coachApplicationId: string | null;
      }> = {};
      if (headAssignmentId !== undefined) updates.headAssignmentId = headAssignmentId ?? null;
      if (displayName !== undefined && displayName.trim()) updates.displayName = displayName.trim();
      if (coachApplicationId !== undefined) updates.coachApplicationId = coachApplicationId || null;
      await db.update(coachAssignments).set(updates).where(eq(coachAssignments.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Update assignment error:", error);
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/admin/coach-assignments/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      await db.update(coachAssignments).set({ active: false }).where(eq(coachAssignments.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete assignment error:", error);
      res.status(500).json({ error: "Failed to remove assignment" });
    }
  });
}
