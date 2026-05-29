# Phase 2: Core Loop - Pattern Map

**Mapped:** 2026-05-29
**Files analyzed:** 18 new/modified files
**Analogs found:** 18 / 18

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `shared/schema.ts` | model | CRUD | `shared/schema.ts` (self -- families/kids/challenges tables) | exact |
| `shared/challengeValidation.ts` | utility | transform | `shared/challengeValidation.ts` (self -- signupSchema, addKidSchema) | exact |
| `server/challengeRoutes.ts` | controller | request-response | `server/challengeRoutes.ts` (self -- POST /api/kids, GET /api/challenges) | exact |
| `client/index.html` | config | -- | `client/index.html` (self -- add script tag) | exact |
| `client/src/App.tsx` | route | request-response | `client/src/App.tsx` (self -- /challenge nest block) | exact |
| `client/src/pages/challenge/index.tsx` | component | request-response | `client/src/pages/challenge/index.tsx` (self -- extend existing page) | exact |
| `client/src/pages/challenge/leaderboard.tsx` | component | request-response | `client/src/pages/challenge/index.tsx` (ChallengeHub page) | role-match |
| `client/src/components/challenge/SubmitButton.tsx` | component | event-driven | `client/src/components/challenge/AddKidForm.tsx` (mutation + inline state) | role-match |
| `client/src/components/challenge/VideoBonusCheckbox.tsx` | component | event-driven | `client/src/components/challenge/SignupForm.tsx` (checkbox + API call) | role-match |
| `client/src/components/challenge/ChallengeCard.tsx` | component | request-response | `client/src/pages/challenge/index.tsx` lines 108-151 (inline card) | exact |
| `client/src/components/challenge/WeekNavigation.tsx` | component | request-response | `client/src/pages/Compare.tsx` (Accordion usage) | role-match |
| `client/src/components/challenge/PastWeekRow.tsx` | component | request-response | `client/src/components/challenge/KidSelector.tsx` (compact info row) | role-match |
| `client/src/components/challenge/LeaderboardHero.tsx` | component | -- | `client/src/pages/challenge/index.tsx` lines 72-74 (dark theme page shell) | partial |
| `client/src/components/challenge/PodiumCard.tsx` | component | -- | `client/src/components/challenge/KidSelector.tsx` (display name + badge) | partial |
| `client/src/components/challenge/PlayerRow.tsx` | component | -- | `client/src/components/challenge/KidSelector.tsx` lines 39-46 (info row) | role-match |
| `client/src/hooks/use-cloudinary.tsx` | hook | event-driven | `client/src/hooks/use-active-kid.tsx` (custom hook with ref/state) | role-match |
| `client/src/hooks/use-submissions.tsx` | hook | request-response | `client/src/hooks/use-auth.tsx` (TanStack Query wrapper hook) | exact |
| `client/src/types/cloudinary.d.ts` | config | -- | None in codebase (new pattern) | no-analog |

## Pattern Assignments

### `shared/schema.ts` (model, CRUD) -- ADD submissions table

**Analog:** `shared/schema.ts` lines 207-263 (families, kids, challenges tables)

**Imports pattern** (lines 1-4):
```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
```

**Table definition pattern** (lines 225-234 -- kids table as closest match for FK-heavy table):
```typescript
export const kids = pgTable("kids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthdate: date("birthdate", { mode: "date" }).notNull(),
  ageTrack: text("age_track").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Insert schema + type exports pattern** (lines 236-241):
```typescript
export const insertKidSchema = createInsertSchema(kids).omit({
  id: true, createdAt: true, ageTrack: true, displayName: true,
});

export type InsertKid = z.infer<typeof insertKidSchema>;
export type Kid = typeof kids.$inferSelect;
```

**Key conventions:**
- PKs: `varchar("id").primaryKey().default(sql\`gen_random_uuid()\`)`
- FKs: `varchar("field_name").notNull().references(() => parentTable.id)`
- Timestamps: `timestamp("created_at").defaultNow().notNull()`
- Text columns: `text("column_name")` for free text, not varchar
- Boolean: `boolean("column_name").notNull().default(false)`
- Insert schemas omit `id` and `createdAt` at minimum

---

### `shared/challengeValidation.ts` (utility, transform) -- ADD submission schemas

**Analog:** `shared/challengeValidation.ts` lines 1-21

**Full file pattern:**
```typescript
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must consent to the privacy notice to continue",
  }),
});

export type SignupRequest = z.infer<typeof signupSchema>;

export const addKidSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be YYYY-MM-DD format"),
});

export type AddKidRequest = z.infer<typeof addKidSchema>;

export const ageTrackEnum = z.enum(["littlekicks", "starter", "advanced"]);

export type AgeTrack = z.infer<typeof ageTrackEnum>;
```

**Key conventions:**
- One `z.object()` per request type with descriptive error messages
- Export both the schema and the inferred type (`type X = z.infer<typeof xSchema>`)
- Enums for constrained string values
- Human-readable validation messages

---

### `server/challengeRoutes.ts` (controller, request-response) -- ADD submission, video bonus, leaderboard, status endpoints

**Analog:** `server/challengeRoutes.ts` lines 1-420 (self)

**Imports pattern** (lines 1-10):
```typescript
import type { Express } from "express";
import { db } from "./db";
import { families, kids, challenges } from "@shared/schema";
import { signupSchema, addKidSchema } from "@shared/challengeValidation";
import { eq, and, gt, desc } from "drizzle-orm";
import { requireFamily } from "./challengeAuth";
import { randomBytes } from "crypto";
import { differenceInYears } from "date-fns";
import sgMail from "@sendgrid/mail";
import { z } from "zod";
```

**Auth-protected POST with validation pattern** (lines 304-337 -- POST /api/kids):
```typescript
app.post("/api/kids", requireFamily, async (req, res) => {
  try {
    const parseResult = addKidSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Please provide first name, last name, and birthdate (YYYY-MM-DD)" });
    }

    const data = parseResult.data;
    // ... business logic ...

    const [kid] = await db.insert(kids).values({
      familyId: req.session.familyId!,
      // ... fields ...
    }).returning();

    res.json(kid);
  } catch (error) {
    console.error("Add kid error:", error);
    res.status(500).json({ error: "Failed to add kid" });
  }
});
```

**Ownership verification pattern** (lines 344-351 -- PATCH /api/kids/:id):
```typescript
// Verify kid belongs to this family (T-02-04)
const [existingKid] = await db.select().from(kids).where(
  and(eq(kids.id, id), eq(kids.familyId, req.session.familyId!))
);

if (!existingKid) {
  return res.status(404).json({ error: "Kid not found" });
}
```

**Public GET endpoint pattern** (lines 410-419 -- GET /api/challenges):
```typescript
app.get("/api/challenges", async (_req, res) => {
  try {
    const allChallenges = await db.select().from(challenges)
      .orderBy(challenges.weekNumber, challenges.ageTrack);
    res.json({ challenges: allChallenges });
  } catch (error) {
    console.error("Challenges error:", error);
    res.status(500).json({ error: "Failed to load challenges" });
  }
});
```

**Error handling pattern:**
- Every handler wrapped in try/catch
- `console.error("Context:", error)` in catch block
- User-friendly error message in JSON response: `{ error: "Human-readable message" }`
- 400 for validation, 401 for auth, 404 for not found, 409 for conflict, 500 for server errors

**Route registration pattern** (lines 144-146):
```typescript
export function registerChallengeRoutes(app: Express) {
  seedChallengesIfEmpty().catch((e) => console.error("Challenge seed error:", e));
  // ... all routes defined inside this function ...
}
```

---

### `client/index.html` (config) -- ADD Cloudinary widget script tag

**Analog:** `client/index.html` lines 1-26

**Script tag insertion point** (line 20 -- existing third-party script pattern):
```html
<script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/84b9f2ed24a9e820aab37939d/c910658671fe956387fe419a3.js");</script>
```

**Convention:** Third-party scripts go in `<head>` before the closing `</head>` tag. The Cloudinary widget script should be added in the same location.

---

### `client/src/App.tsx` (route, request-response) -- ADD /challenge/leaderboard route

**Analog:** `client/src/App.tsx` lines 39-48 (existing /challenge nest)

**Nested route pattern:**
```typescript
<Route path="/challenge" nest>
  <Switch>
    <Route path="/">
      <ChallengeHub />
    </Route>
    <Route path="/signup">
      <ChallengeSignup />
    </Route>
  </Switch>
</Route>
```

**Convention:** New routes within the challenge section are added inside this existing `<Switch>` block. Import at top, `<Route>` inside the Switch.

---

### `client/src/pages/challenge/index.tsx` (component, request-response) -- MODIFY with submit buttons, week nav, video embeds

**Analog:** Self -- `client/src/pages/challenge/index.tsx` lines 1-158

**Page shell pattern** (lines 72-75):
```typescript
return (
  <div className="min-h-screen bg-night">
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-8">
```

**Query + auth gating pattern** (lines 41-58):
```typescript
const { data: challengesData } = useQuery<{ challenges: Challenge[] }>({
  queryKey: ["/api/challenges"],
  queryFn: getQueryFn({ on401: "returnNull" }),
  enabled: isAuthenticated,
});

if (isLoading) {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

if (!isAuthenticated) {
  return <Redirect to="/challenge/signup" />;
}
```

**Challenge card rendering pattern** (lines 108-151):
```typescript
<div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <Calendar className="w-4 h-4 text-gold" />
    <span className="text-gold text-sm font-semibold uppercase tracking-wider">
      Week {currentWeekChallenges[0].weekNumber}
    </span>
  </div>

  {skillChallenge && (
    <div className="mb-4">
      <h2 className="text-warmwhite text-xl font-bold mb-1">
        {skillChallenge.title}
      </h2>
      {skillChallenge.theme && (
        <p className="text-warmwhite/40 text-sm mb-3">{skillChallenge.theme}</p>
      )}
      <p className="text-warmwhite/70">{skillChallenge.description}</p>
    </div>
  )}

  {fitnessChallenge && (
    <div className="border-t border-warmwhite/10 pt-4">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-sm font-semibold">Fitness Bonus</span>
      </div>
      <h3 className="text-warmwhite font-semibold mb-1">
        {fitnessChallenge.title}
      </h3>
      <p className="text-warmwhite/70 text-sm">{fitnessChallenge.description}</p>
    </div>
  )}
</div>
```

---

### `client/src/pages/challenge/leaderboard.tsx` (component, request-response) -- NEW page

**Analog:** `client/src/pages/challenge/index.tsx` (page structure) + `client/src/pages/Compare.tsx` (Framer Motion + data display)

**Page shell pattern** -- same as challenge/index.tsx lines 72-75 (dark theme, Header/Footer)

**TanStack Query for public data pattern** (adapted from challenge/index.tsx lines 41-46):
```typescript
const { data: challengesData } = useQuery<{ challenges: Challenge[] }>({
  queryKey: ["/api/challenges"],
  queryFn: getQueryFn({ on401: "returnNull" }),
  // Note: leaderboard is public, so no `enabled: isAuthenticated` gate
});
```

**Framer Motion animation pattern** (from Compare.tsx lines 30-37):
```typescript
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};
```

**Framer Motion imports** (from Compare.tsx line 2):
```typescript
import { motion, useInView, useScroll, useTransform } from "framer-motion";
```

---

### `client/src/components/challenge/SubmitButton.tsx` (component, event-driven) -- NEW

**Analog:** `client/src/components/challenge/AddKidForm.tsx` lines 43-64 (mutation pattern with loading state)

**Mutation + state pattern:**
```typescript
async function onSubmit(data: FormData) {
  setSubmitting(true);
  try {
    for (const kid of data.kids) {
      await apiRequest("POST", "/api/kids", kid);
    }
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    toast({
      title: `Added ${data.kids.length} kid${data.kids.length > 1 ? "s" : ""} to your account`,
    });
    reset();
    onSuccess?.();
  } catch (err: any) {
    toast({
      title: "Something went wrong",
      description: err.message || "Please try again",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
}
```

**Button states pattern** (AddKidForm lines 148-161):
```typescript
<button
  type="submit"
  disabled={submitting}
  className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
>
  {submitting ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Saving...
    </>
  ) : (
    "Save Kids"
  )}
</button>
```

**Key convention:** Buttons use `bg-crimson text-warmwhite` for primary CTAs, `disabled:opacity-50`, and inline loading spinner with `Loader2` from Lucide.

---

### `client/src/components/challenge/VideoBonusCheckbox.tsx` (component, event-driven) -- NEW

**Analog:** `client/src/components/challenge/SignupForm.tsx` lines 153-168 (checkbox with label and API call)

**Checkbox pattern:**
```typescript
<div className="flex items-start gap-3">
  <input
    type="checkbox"
    id="consent"
    className="mt-1 h-4 w-4 rounded border-warmwhite/30 bg-warmwhite/5 text-crimson focus:ring-gold accent-crimson"
    {...signupForm.register("consentGiven")}
  />
  <label htmlFor="consent" className="text-warmwhite/55 text-sm leading-relaxed">
    By signing up, you consent to your child's first name...
  </label>
</div>
```

**Note:** UI-SPEC calls for Radix Checkbox instead of native `<input type="checkbox">`. The styling pattern (flex row, label text, colors) applies; switch the element to Radix Checkbox.

---

### `client/src/components/challenge/ChallengeCard.tsx` (component, request-response) -- NEW (extract from index.tsx)

**Analog:** `client/src/pages/challenge/index.tsx` lines 108-151 (inline challenge card)

This is a direct extraction of the existing inline card markup into a reusable component. Copy the entire card structure from lines 110-151 of challenge/index.tsx.

**Card container convention:**
```typescript
<div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6">
```

---

### `client/src/components/challenge/WeekNavigation.tsx` (component, request-response) -- NEW

**Analog:** `client/src/pages/Compare.tsx` lines 1-8 (Accordion import + usage pattern)

**Accordion imports:**
```typescript
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
```

**Convention:** Radix Accordion from shadcn for collapsible list items. Each past week is an AccordionItem with a trigger row showing summary and content showing the full challenge card.

---

### `client/src/components/challenge/PodiumCard.tsx` and `PlayerRow.tsx` (component) -- NEW

**Analog:** `client/src/components/challenge/KidSelector.tsx` lines 11-31 (age track badges, display name rendering)

**Age track badge pattern:**
```typescript
const AGE_TRACK_LABELS: Record<string, string> = {
  littlekicks: "Little Kicks",
  starter: "Starter",
  advanced: "Advanced",
};

const AGE_TRACK_STYLES: Record<string, string> = {
  littlekicks: "bg-gold/20 text-gold",
  starter: "bg-crimson/20 text-crimson",
  advanced: "bg-warmwhite/20 text-warmwhite",
};

function AgeTrackBadge({ ageTrack }: { ageTrack: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${AGE_TRACK_STYLES[ageTrack] ?? "bg-warmwhite/10 text-warmwhite/60"}`}
    >
      {AGE_TRACK_LABELS[ageTrack] ?? ageTrack}
    </span>
  );
}
```

**Display name + badge inline layout** (KidSelector lines 40-44):
```typescript
<div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg px-4 py-2.5 flex items-center gap-3">
  <User className="w-4 h-4 text-warmwhite/40" />
  <span className="text-warmwhite font-medium text-sm">{activeKid.displayName}</span>
  <AgeTrackBadge ageTrack={activeKid.ageTrack} />
</div>
```

---

### `client/src/hooks/use-cloudinary.tsx` (hook, event-driven) -- NEW

**Analog:** `client/src/hooks/use-active-kid.tsx` (custom hook with state management)

**Hook structure pattern:**
```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// ... or for simpler hooks without context:
import { useRef, useCallback } from "react";
```

**Convention:** Hooks in `client/src/hooks/` are named `use-*.tsx`. They export a single named function `useXxx()`. Context-based hooks export both a Provider component and a consumer hook.

---

### `client/src/hooks/use-submissions.tsx` (hook, request-response) -- NEW

**Analog:** `client/src/hooks/use-auth.tsx` lines 1-33

**TanStack Query wrapper hook pattern:**
```typescript
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { Family, Kid } from "@shared/schema";

interface AuthData {
  family: Pick<Family, "id" | "email" | "name" | "isRegistered" | "createdAt">;
  kids: Kid[];
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AuthData | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    family: data?.family ?? null,
    kids: data?.kids ?? [],
    isLoading,
    isAuthenticated: !!data?.family,
  };
}
```

**Key conventions:**
- Import `getQueryFn` for queries, `apiRequest` for mutations
- Use `on401: "returnNull"` for auth-optional endpoints
- Use `on401: "throw"` for auth-required endpoints
- `staleTime` set per use case (5 min for auth, 30s recommended for leaderboard)
- Return destructured data with null defaults

**apiRequest pattern** (from queryClient.ts lines 10-24):
```typescript
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}
```

**Convention:** Always use `credentials: "include"` for session cookies. Mutations use `apiRequest()` directly, not through TanStack Query's mutation wrapper (based on existing AddKidForm and SignupForm patterns).

---

## Shared Patterns

### Authentication Middleware
**Source:** `server/challengeAuth.ts` lines 1-8
**Apply to:** POST /api/submissions, POST /api/video-bonus, GET /api/submissions/status
```typescript
import type { Request, Response, NextFunction } from "express";

export function requireFamily(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.familyId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}
```

### Error Handling (Server)
**Source:** `server/challengeRoutes.ts` (consistent across all handlers)
**Apply to:** All new server endpoints
```typescript
// Pattern: every handler in try/catch, console.error with context, user-friendly JSON error
try {
  // ... handler logic ...
} catch (error) {
  console.error("Context description:", error);
  res.status(500).json({ error: "Human-readable failure message" });
}
```

### Validation (Server)
**Source:** `server/challengeRoutes.ts` lines 150-154
**Apply to:** POST /api/submissions, POST /api/video-bonus
```typescript
const parseResult = someSchema.safeParse(req.body);
if (!parseResult.success) {
  return res.status(400).json({ error: "Descriptive validation error" });
}
const data = parseResult.data;
```

### Ownership Verification
**Source:** `server/challengeRoutes.ts` lines 344-351
**Apply to:** All endpoints that operate on a kid (submissions, video bonus, status)
```typescript
const [kid] = await db.select().from(kids).where(
  and(eq(kids.id, kidId), eq(kids.familyId, req.session.familyId!))
);
if (!kid) return res.status(404).json({ error: "Kid not found" });
```

### Dark Theme Card Container
**Source:** `client/src/pages/challenge/index.tsx` line 110
**Apply to:** ChallengeCard, PastWeekRow, PodiumCard, PlayerRow, WeekNavigation
```typescript
<div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6">
```

### Loading Spinner
**Source:** `client/src/pages/challenge/index.tsx` lines 48-53
**Apply to:** Leaderboard page, any loading state
```typescript
<div className="min-h-screen bg-night flex items-center justify-center">
  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
</div>
```

### Query Cache Invalidation After Mutation
**Source:** `client/src/components/challenge/AddKidForm.tsx` line 49
**Apply to:** After submission POST, after video bonus POST
```typescript
await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
// For submissions: invalidate submission status and leaderboard queries
```

### Toast Notifications for Errors
**Source:** `client/src/components/challenge/AddKidForm.tsx` lines 55-59
**Apply to:** SubmitButton error state, VideoBonusCheckbox error state
```typescript
toast({
  title: "Something went wrong",
  description: err.message || "Please try again",
  variant: "destructive",
});
```

### Session TypeScript Declaration
**Source:** `server/index.ts` lines 20-24
**Apply to:** Already declared, no changes needed
```typescript
declare module "express-session" {
  interface SessionData {
    familyId: string;
  }
}
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `client/src/types/cloudinary.d.ts` | config | -- | No TypeScript declaration files for external scripts exist in the codebase. Use RESEARCH.md pattern (CloudinaryWidget, CloudinaryUploadResult, CloudinaryWidgetOptions interfaces + Window augmentation). |

---

## Metadata

**Analog search scope:** `~/Projects/nipomo-soccer-website/` (shared/, server/, client/src/)
**Files scanned:** 15 source files read, 2 grep searches
**Pattern extraction date:** 2026-05-29
