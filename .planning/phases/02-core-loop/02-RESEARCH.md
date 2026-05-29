# Phase 2: Core Loop - Research

**Researched:** 2026-05-29
**Domain:** Video submission pipeline (Cloudinary Upload Widget), points tracking, public leaderboard, Drizzle ORM aggregation queries
**Confidence:** HIGH

## Summary

Phase 2 builds the complete participation cycle: parents view a challenge, upload a video via the Cloudinary Upload Widget, earn points, and see their kids climb a public leaderboard. The technical surface area spans three tiers: (1) browser-side Cloudinary widget integration for direct video upload bypassing the server, (2) Express API endpoints for submission recording with daily-cap enforcement, and (3) SQL aggregation queries powering the leaderboard ranking.

The codebase from Phase 1 provides solid foundations -- `families`, `kids`, and `challenges` tables exist with seeded data, `requireFamily` middleware handles auth, and the challenge hub page has the basic card layout. Phase 2 extends all three layers: schema additions (submissions + video_bonuses tables), new API routes in `challengeRoutes.ts`, and significant client-side work across the challenge hub (submission flow, week navigation) and a new leaderboard page.

The primary technical risk is the Cloudinary Upload Widget integration in React -- it's a global script tag, not an npm package, so the integration requires `window.cloudinary.createUploadWidget()` calls with proper TypeScript declarations. The widget handles file validation, progress, and direct-to-Cloudinary upload natively, which simplifies the client-side work significantly.

**Primary recommendation:** Structure the work as schema + API first, then client-side submission flow, then leaderboard page. The API can be verified independently before wiring up the frontend.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** "Submit Video" buttons appear inline on both the skill challenge card and the fitness bonus card. Each button opens the Cloudinary Upload Widget as a modal overlay.
- **D-02:** After successful upload, the submit button transforms into an inline success state: green checkmark, "+1 point", and the kid's updated total. No page navigation, no confirmation modal.
- **D-03:** When the daily cap is hit (1 skill + 1 fitness per child per day), submit buttons show a disabled/grayed state with "Come back tomorrow!" message and the kid's current point total.
- **D-04:** Server enforces daily cap via the submissions table (query by kid_id + type + submitted_at date). Client reflects the state but enforcement is server-side.
- **D-05:** Honor-system checkbox ("I watched the video (+1 bonus point)") appears directly below the YouTube instructional video embed on the challenge card.
- **D-06:** One video bonus per kid per week. Checkbox disabled once claimed for the current week.
- **D-07:** If a challenge week has no instructional video (videoUrl is null), the video bonus is simply not available that week. No auto-granting. Max points that week drops from 15 to 14.
- **D-08:** Leaderboard at /challenge/leaderboard is public -- no login required. It's a marketing surface.
- **D-09:** Use the existing mockup as loose inspiration, not a pixel-exact reference.
- **D-10:** Age track filtering via Radix Tabs: All | Little Kicks | Starter | Advanced. Default "All". Client-side filtering.
- **D-11:** Top 3 get podium-style visual treatment. Rest is standard ranked list.
- **D-12:** Each row shows: rank, display name (First L.), age track, total points, NSC Player badge. Streak/badges deferred to Phase 3.
- **D-13:** Current week prominent at top. Past weeks in collapsed/scrollable list. Future weeks hidden.
- **D-14:** Late submissions allowed for any past week. Points still count.
- **D-15:** Daily cap (1 skill + 1 fitness per child per day) enforced globally, regardless of which week the submission is for.

### Claude's Discretion
- Cloudinary Upload Widget configuration details (accepted formats, max file size enforcement, mobile styling)
- Submissions table schema (columns, indexes, constraints) following existing Drizzle patterns
- Leaderboard SQL query structure (aggregation, ranking)
- Loading states, error handling, empty states
- Video embed responsive sizing
- Past-week card collapse/expand interaction pattern

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHAL-01 | Challenge hub shows current week's skill challenge with age-track variations | Week navigation pattern, getCurrentWeekNumber utility exists, challenges table has weekStart/weekEnd |
| CHAL-02 | Each week displays instructional video embed (YouTube) per age track | challenges.videoUrl column exists (currently null in seed data), YouTube iframe embed pattern |
| CHAL-03 | Fitness bonus displayed alongside each week's skill challenge | Challenge card already renders skill + fitness from Phase 1, add submit buttons |
| CHAL-04 | Challenge page shows which week is active based on date | getCurrentWeekNumber() already implemented in challenge/index.tsx |
| SUB-01 | Parent can upload video from phone (.mov, .mp4) | Cloudinary Upload Widget with clientAllowedFormats: ["mp4", "mov", "webm"] |
| SUB-02 | Video uploads directly to Cloudinary with progress indicator | Widget handles progress natively; unsigned preset `nsc_challenge` |
| SUB-03 | Parent selects child + challenge type when submitting | activeKid from useActiveKid hook; type inferred from which button they click |
| SUB-04 | Daily cap: max 1 skill + 1 fitness per child per day | Server-side query: count submissions by kid_id + type + date; client reflects state |
| SUB-05 | Confirmation with points awarded after submission | Inline success state per D-02; API returns updated point total |
| SUB-06 | 50MB file size cap with clear error | maxVideoFileSize: 52428800 on widget config; widget shows native error |
| PTS-01 | Each submission earns 1 point (1 point = 1 raffle entry) | submissions.points column defaults to 1 |
| PTS-02 | Video bonus: 1 point per kid per week (honor-system checkbox) | video_bonuses table or submissions row with type="video_bonus" |
| PTS-03 | Points cumulative across all 8 weeks | Leaderboard query: SUM(points) GROUP BY kid_id |
| LDR-01 | Public leaderboard at /challenge/leaderboard | New route in App.tsx, public API endpoint (no auth required) |
| LDR-02 | Filterable by age track | Client-side Radix Tabs filtering on loaded data |
| LDR-03 | Top 3 get podium treatment | PodiumCard component per UI-SPEC |
| LDR-04 | Row shows name, age track, total points, NSC badge | JOIN kids table for displayName, ageTrack, family.isRegistered |
| LDR-05 | NSC Player badge on registered players | families.isRegistered already exists (boolean, admin-set) |
| LDR-06 | First name + last initial only (COPPA) | kids.displayName already formatted as "First L." from Phase 1 |
| PRIV-02 | Leaderboard displays first name + last initial only | Same as LDR-06, use kids.displayName |
| PRIV-03 | Videos not publicly viewable -- admin-only via Cloudinary URLs | Store cloudinary_url in submissions table; never expose in public API responses |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Video upload | Browser (Cloudinary Widget) | -- | Direct browser-to-Cloudinary upload, server never handles file bytes |
| Submission recording | API / Backend | Database | Express validates daily cap, inserts submission, returns point total |
| Daily cap enforcement | API / Backend | Database | Server-side query prevents race conditions; client shows state optimistically |
| Video bonus tracking | API / Backend | Database | Server validates 1-per-kid-per-week constraint |
| Leaderboard data | API / Backend | Database | SQL aggregation query, served as public JSON endpoint |
| Leaderboard display | Browser / Client | -- | React page with client-side age track filtering, TanStack Query polling |
| Challenge week navigation | Browser / Client | -- | Client determines current week from challenge date ranges |
| Privacy enforcement | API / Backend | -- | Public endpoints never return cloudinary_url or full last names |

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Verified |
|---------|---------|---------|----------|
| Cloudinary Upload Widget | v2.0 (script tag) | Direct browser-to-Cloudinary video upload | [CITED: cloudinary.com/documentation/upload_widget] |
| React | 18.3.1 | Frontend UI | [VERIFIED: package.json] |
| Express | 4.21.2 | API routes for submission, leaderboard | [VERIFIED: package.json] |
| Drizzle ORM | 0.39.3 | Schema + queries | [VERIFIED: package.json] |
| TanStack Query | 5.60.5 | Leaderboard data fetching, submission mutations | [VERIFIED: package.json] |
| Framer Motion | 11.18.2 | Submit success animation, leaderboard transitions | [VERIFIED: package.json] |
| date-fns | 3.6.0 | Week date comparisons, submission date logic | [VERIFIED: package.json] |
| Radix Tabs | 1.1.4 | Leaderboard age track filter | [VERIFIED: package.json] |
| Radix Accordion | 1.2.4 | Past week collapse/expand | [VERIFIED: package.json] |
| Radix Checkbox | 1.1.5 | Video bonus honor-system checkbox | [VERIFIED: package.json] |
| Wouter | 3.3.5 | Client-side routing (/challenge/leaderboard) | [VERIFIED: package.json] |
| Zod | 3.24.2 | Submission validation schemas | [VERIFIED: package.json] |

### Cloudinary Upload Widget (Script Tag Integration)

**Script URL:** `https://upload-widget.cloudinary.com/latest/global/all.js` [CITED: cloudinary.com/documentation/upload_widget]

The widget is loaded via a `<script>` tag in `client/index.html`, NOT via an npm package. This is Cloudinary's recommended approach for React. It exposes `window.cloudinary.createUploadWidget()` globally.

**No new npm packages required.** Everything needed is already in package.json.

**Installation:**
```bash
# No npm install needed. Add script tag to client/index.html:
# <script src="https://upload-widget.cloudinary.com/latest/global/all.js" type="text/javascript"></script>
```

## Architecture Patterns

### System Architecture Diagram

```
Parent's Phone Browser
  |
  |-- [Challenge Hub /challenge]
  |     |-- View current week (challenges from /api/challenges)
  |     |-- Select kid (useActiveKid context)
  |     |-- Click "Submit Video" --> Cloudinary Widget opens
  |     |     |
  |     |     |-- Video uploads directly to Cloudinary CDN
  |     |     |     (browser -> Cloudinary, never touches Express)
  |     |     |
  |     |     |-- On success: widget returns { public_id, secure_url, thumbnail_url }
  |     |           |
  |     |           |-- POST /api/submissions --> Express
  |     |                 |-- requireFamily middleware (session auth)
  |     |                 |-- Validate: kid belongs to family
  |     |                 |-- Check daily cap: COUNT submissions for kid+type+date
  |     |                 |-- INSERT into submissions table
  |     |                 |-- Return { points: 1, totalPoints: N }
  |     |
  |     |-- Check "I watched the video" --> POST /api/video-bonus
  |           |-- Validate: 1 per kid per week
  |           |-- INSERT into submissions (type="video_bonus")
  |           |-- Return { points: 1, totalPoints: N }
  |
  |-- [Leaderboard /challenge/leaderboard] (PUBLIC, no auth)
        |-- GET /api/leaderboard
        |     |-- SQL: SELECT kid_id, SUM(points), displayName, ageTrack, isRegistered
        |     |--       FROM submissions JOIN kids JOIN families
        |     |--       GROUP BY kid_id ORDER BY SUM(points) DESC
        |     |-- Returns: ranked list with display names only
        |
        |-- Client-side Radix Tabs filter by age track
        |-- TanStack Query with refetchOnWindowFocus, staleTime: 30s
```

### Recommended Project Structure

New files for Phase 2 (additions to existing structure):

```
shared/
  schema.ts                    # ADD: submissions table
  challengeValidation.ts       # ADD: submission + video bonus schemas

server/
  challengeRoutes.ts           # ADD: POST /api/submissions, POST /api/video-bonus,
                               #      GET /api/leaderboard, GET /api/submissions/status

client/
  index.html                   # ADD: Cloudinary widget script tag
  src/
    pages/challenge/
      index.tsx                # MODIFY: add submit buttons, week navigation, video embeds
      leaderboard.tsx          # NEW: full leaderboard page
    components/challenge/
      SubmitButton.tsx          # NEW: inline submit with states (default/uploading/success/capped)
      VideoBonusCheckbox.tsx    # NEW: honor-system video bonus
      ChallengeCard.tsx         # NEW: full challenge card with track pills, video, submit
      WeekNavigation.tsx        # NEW: current week + past weeks accordion
      PastWeekRow.tsx           # NEW: collapsed row with status indicators
      LeaderboardHero.tsx       # NEW: crimson hero banner
      PodiumCard.tsx            # NEW: top 3 display
      PlayerRow.tsx             # NEW: rank 4+ display
      TrackPill.tsx             # NEW: age track variation display
      PointsDisplay.tsx         # NEW: inline points counter
    hooks/
      use-cloudinary.tsx        # NEW: hook wrapping Cloudinary widget creation
      use-submissions.tsx       # NEW: hook for submission status per kid
    types/
      cloudinary.d.ts           # NEW: TypeScript declarations for window.cloudinary
    App.tsx                     # MODIFY: add /challenge/leaderboard route
```

### Pattern 1: Cloudinary Upload Widget in React

**What:** Load the Cloudinary Upload Widget via script tag, create a React hook that wraps `window.cloudinary.createUploadWidget()`, and handle upload lifecycle events.

**When to use:** Any time a parent clicks "Submit Video" on a challenge card.

**Example:**
```typescript
// Source: Cloudinary Upload Widget docs + React pattern
// client/src/types/cloudinary.d.ts
interface CloudinaryWidget {
  open(): void;
  close(): void;
  destroy(): void;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    thumbnail_url: string;
    resource_type: string;
    bytes: number;
    format: string;
  };
}

interface Window {
  cloudinary: {
    createUploadWidget(
      options: Record<string, unknown>,
      callback: (error: unknown, result: CloudinaryUploadResult) => void
    ): CloudinaryWidget;
  };
}

// client/src/hooks/use-cloudinary.tsx
import { useRef, useCallback } from "react";

interface UseCloudinaryOptions {
  onSuccess: (info: CloudinaryUploadResult["info"]) => void;
  onError?: (error: unknown) => void;
}

export function useCloudinaryUpload({ onSuccess, onError }: UseCloudinaryOptions) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  const openWidget = useCallback(() => {
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "nsc_challenge",
          sources: ["local", "camera"],
          resourceType: "video",
          clientAllowedFormats: ["mp4", "mov", "webm"],
          maxVideoFileSize: 52428800, // 50MB in bytes
          multiple: false,
          maxFiles: 1,
          folder: "challenge-submissions",
          tags: ["summer-challenge"],
          singleUploadAutoClose: true,
        },
        (error: unknown, result: CloudinaryUploadResult) => {
          if (error) {
            onError?.(error);
            return;
          }
          if (result?.event === "success") {
            onSuccess(result.info);
          }
        }
      );
    }
    widgetRef.current.open();
  }, [onSuccess, onError]);

  return { openWidget };
}
```
[CITED: cloudinary.com/documentation/upload_widget, cloudinary.com/documentation/upload_widget_reference]

### Pattern 2: Server-Side Daily Cap Enforcement

**What:** Before inserting a submission, query the submissions table to count how many the kid has already submitted today for that type. Reject if at or over the limit.

**When to use:** POST /api/submissions endpoint.

**Example:**
```typescript
// Source: Drizzle ORM aggregation + codebase patterns
import { eq, and, gte, lt, sql, count } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";

// Inside the POST /api/submissions handler:
const today = new Date();
const dayStart = startOfDay(today);
const dayEnd = endOfDay(today);

const [existing] = await db
  .select({ count: count() })
  .from(submissions)
  .where(
    and(
      eq(submissions.kidId, kidId),
      eq(submissions.type, type), // "skill" or "fitness"
      gte(submissions.submittedAt, dayStart),
      lt(submissions.submittedAt, dayEnd)
    )
  );

if (existing.count >= 1) {
  return res.status(409).json({ error: "Already submitted today. Come back tomorrow!" });
}
```
[VERIFIED: Drizzle ORM docs for count/aggregation, codebase patterns from challengeRoutes.ts]

### Pattern 3: Leaderboard SQL Aggregation

**What:** A single query that joins submissions + kids + families to produce the ranked leaderboard.

**When to use:** GET /api/leaderboard endpoint.

**Example:**
```typescript
// Source: Drizzle ORM docs + codebase patterns
import { sql, eq, desc } from "drizzle-orm";

const leaderboard = await db
  .select({
    kidId: kids.id,
    displayName: kids.displayName,
    ageTrack: kids.ageTrack,
    totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)`,
    isRegistered: families.isRegistered,
  })
  .from(submissions)
  .innerJoin(kids, eq(submissions.kidId, kids.id))
  .innerJoin(families, eq(kids.familyId, families.id))
  .groupBy(kids.id, kids.displayName, kids.ageTrack, families.isRegistered)
  .orderBy(desc(sql`sum(${submissions.points})`));
```
[VERIFIED: Drizzle ORM Context7 docs for aggregation patterns]

### Pattern 4: Submissions Table Schema

**What:** The submissions table stores one row per video upload or video bonus claim.

**Schema design:**
```typescript
// Source: Existing schema.ts patterns + CLAUDE.md spec
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kidId: varchar("kid_id").notNull().references(() => kids.id),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id),
  familyId: varchar("family_id").notNull().references(() => families.id),
  weekNumber: integer("week_number").notNull(),
  type: text("type").notNull(), // "skill" | "fitness" | "video_bonus"
  points: integer("points").notNull().default(1),
  cloudinaryId: text("cloudinary_id"),     // null for video_bonus type
  cloudinaryUrl: text("cloudinary_url"),   // null for video_bonus type
  thumbnailUrl: text("thumbnail_url"),     // null for video_bonus type
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});
```
[VERIFIED: follows existing schema.ts patterns with gen_random_uuid PKs, references, timestamps]

**Key design decisions:**
- Video bonuses stored as submission rows with `type="video_bonus"` and null cloudinary fields -- this keeps the points aggregation simple (just SUM all submissions for a kid)
- `familyId` denormalized for query speed (avoids extra JOIN when checking ownership)
- `challengeId` references the specific age-track challenge row, not just the week number
- `cloudinaryUrl` is NEVER returned in public API responses (PRIV-03)

### Anti-Patterns to Avoid
- **Routing video through Express:** Never accept file uploads on the server. Replit Autoscale has limited memory and cold starts. The Cloudinary widget uploads directly from the browser. [VERIFIED: CLAUDE.md constraints]
- **Client-side daily cap enforcement only:** Always enforce on the server. Two tabs or a race condition can bypass client-side checks. The client shows the state, but the server is the authority. [Decision D-04]
- **Caching leaderboard in Redis:** At 100-200 kids with less than 2,000 submissions, PostgreSQL GROUP BY is instant. Redis adds infrastructure for zero benefit. [VERIFIED: CLAUDE.md architecture decisions]
- **Using next-cloudinary or cloudinary-react npm packages:** These add bundle weight and version coupling. The script tag is Cloudinary's recommended approach and gives direct access to the widget API. [CITED: CLAUDE.md alternatives considered]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Video upload progress UI | Custom progress tracking | Cloudinary Upload Widget native progress | Widget handles progress bars, error states, file validation natively |
| File format validation | Custom MIME type checking | Widget's `clientAllowedFormats` + `resourceType: "video"` | Widget validates client-side before upload starts |
| File size enforcement | Custom file size check | Widget's `maxVideoFileSize: 52428800` | Widget shows native error message, prevents upload |
| Video thumbnail generation | Server-side ffmpeg/sharp | Cloudinary eager transformation `c_limit,w_480,h_480/f_jpg` | Upload preset generates thumbnail automatically on upload |
| Leaderboard ranking logic | Custom ranking algorithm | SQL `ORDER BY SUM(points) DESC` | Database handles ranking, ties, and sorting natively |
| Accordion/collapsible animation | Custom height transitions | Radix Accordion/Collapsible | Handles accessible expand/collapse with native animation |

**Key insight:** The Cloudinary Upload Widget handles the hardest parts of video submission -- file validation, format conversion, progress tracking, mobile camera access, and direct CDN upload. The Express server only needs to record metadata after the fact.

## Common Pitfalls

### Pitfall 1: Cloudinary Widget Not Available on First Render
**What goes wrong:** The Cloudinary script loads asynchronously. If the component tries to call `window.cloudinary.createUploadWidget()` before the script finishes loading, it throws a runtime error.
**Why it happens:** Script tags in `<head>` or at the end of `<body>` may not be loaded when React components mount.
**How to avoid:** Check `window.cloudinary` exists before calling `createUploadWidget`. Use a ref to cache the widget instance. Optionally listen for the script's `onload` event or use a simple polling check.
**Warning signs:** "cloudinary is not defined" errors in the browser console.

### Pitfall 2: Daily Cap Race Condition
**What goes wrong:** Two rapid clicks or two browser tabs could both pass the client-side "not yet submitted" check and hit the server simultaneously, resulting in two accepted submissions.
**Why it happens:** The client checks submission status before sending, but two requests can arrive before either is committed.
**How to avoid:** Server-side enforcement is the authority (D-04). After INSERT, if a unique constraint or count-based check fails, return 409. Consider a unique index on `(kid_id, type, DATE(submitted_at))` for absolute database-level protection.
**Warning signs:** Kids with more than 1 skill or 1 fitness submission on the same day.

### Pitfall 3: Cloudinary Widget Opens But Video Doesn't Register
**What goes wrong:** The video uploads to Cloudinary successfully, but the POST to /api/submissions fails (network issue, session expired, server error). The video exists in Cloudinary but isn't recorded in the database.
**Why it happens:** The upload-to-Cloudinary and record-to-server are separate operations. The widget succeeds but the API call doesn't.
**How to avoid:** Show clear error messaging if the API call fails after upload. Since orphaned Cloudinary uploads are harmless (they use storage but don't affect the app), don't over-engineer. The admin can clean orphaned uploads later if storage becomes tight.
**Warning signs:** Cloudinary usage growing faster than submission count.

### Pitfall 4: Leaderboard Shows Zero for Active Participants
**What goes wrong:** A kid has submitted videos but their total shows as 0 on the leaderboard.
**Why it happens:** The query uses INNER JOIN -- if any join condition fails (e.g., kid_id reference is wrong, challenge_id doesn't match), the row is excluded entirely.
**How to avoid:** Test the leaderboard query with known data. Verify FK relationships are correct. Use `COALESCE(SUM(points), 0)` to handle null sums.
**Warning signs:** Kids appear on the challenge hub with submissions but are missing from the leaderboard.

### Pitfall 5: YouTube Embed Blocked by CSP
**What goes wrong:** YouTube iframes fail to load due to Content Security Policy headers.
**Why it happens:** If the server sets restrictive CSP headers, `youtube.com` or `youtube-nocookie.com` may be blocked.
**How to avoid:** Ensure the CSP `frame-src` directive (if one exists) includes `https://www.youtube.com` and `https://www.youtube-nocookie.com`. Check the current server setup for existing CSP headers.
**Warning signs:** Blank iframe area, browser console errors about frame-src violations.

### Pitfall 6: Submission Status Not Reflecting After Upload
**What goes wrong:** Parent uploads a video, sees success, but the button doesn't update to show the submitted state.
**Why it happens:** TanStack Query cache isn't invalidated after the mutation. The submission status query still returns stale data.
**How to avoid:** After a successful POST /api/submissions mutation, invalidate the relevant query keys: submission status for the active kid, and the leaderboard query. Use `queryClient.invalidateQueries()` in the mutation's `onSuccess`.
**Warning signs:** Parent has to refresh the page to see their submission reflected.

## Code Examples

### Cloudinary Widget Configuration for This Project

```typescript
// Source: Cloudinary Upload Widget Reference + CLAUDE.md spec
const widgetConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: "nsc_challenge",        // Unsigned preset configured in Cloudinary dashboard
  sources: ["local", "camera"],         // Phone gallery + camera. No URL/Dropbox needed.
  resourceType: "video",                // Only accept video files
  clientAllowedFormats: ["mp4", "mov", "webm"],  // iPhone + Android formats
  maxVideoFileSize: 52428800,           // 50MB in bytes
  multiple: false,                      // One video at a time
  maxFiles: 1,
  folder: "challenge-submissions",      // Cloudinary folder
  tags: ["summer-challenge"],           // For admin filtering
  singleUploadAutoClose: true,          // Close widget after single upload
  showUploadMoreButton: false,          // Single upload flow
  // Do NOT use: showPoweredBy (paid accounts only)
};
```
[CITED: cloudinary.com/documentation/upload_widget_reference]

### Submission API Endpoint Pattern

```typescript
// Source: Codebase pattern from challengeRoutes.ts
app.post("/api/submissions", requireFamily, async (req, res) => {
  try {
    const parseResult = submitSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Invalid submission data" });
    }

    const { kidId, challengeId, weekNumber, type, cloudinaryId, cloudinaryUrl, thumbnailUrl } = parseResult.data;

    // Verify kid belongs to this family
    const [kid] = await db.select().from(kids).where(
      and(eq(kids.id, kidId), eq(kids.familyId, req.session.familyId!))
    );
    if (!kid) return res.status(404).json({ error: "Kid not found" });

    // Daily cap check (D-04, D-15)
    const today = new Date();
    const dayStart = startOfDay(today);
    const dayEnd = endOfDay(today);

    const [existing] = await db
      .select({ count: count() })
      .from(submissions)
      .where(and(
        eq(submissions.kidId, kidId),
        eq(submissions.type, type),
        gte(submissions.submittedAt, dayStart),
        lt(submissions.submittedAt, dayEnd)
      ));

    if (existing.count >= 1) {
      return res.status(409).json({ error: "Already submitted today. Come back tomorrow!" });
    }

    // Insert submission
    const [submission] = await db.insert(submissions).values({
      kidId, challengeId, familyId: req.session.familyId!,
      weekNumber, type, points: 1,
      cloudinaryId, cloudinaryUrl, thumbnailUrl,
    }).returning();

    // Get updated total
    const [total] = await db
      .select({ totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)` })
      .from(submissions)
      .where(eq(submissions.kidId, kidId));

    res.json({ success: true, points: 1, totalPoints: total.totalPoints });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Failed to record submission" });
  }
});
```
[VERIFIED: follows exact patterns from existing challengeRoutes.ts]

### Submission Status Endpoint (for client-side state)

```typescript
// GET /api/submissions/status?kidId=xxx
// Returns today's submissions and video bonuses for the active kid
// Used by client to determine which buttons are disabled
app.get("/api/submissions/status", requireFamily, async (req, res) => {
  const kidId = req.query.kidId as string;
  if (!kidId) return res.status(400).json({ error: "kidId required" });

  // Verify kid belongs to family
  const [kid] = await db.select().from(kids).where(
    and(eq(kids.id, kidId), eq(kids.familyId, req.session.familyId!))
  );
  if (!kid) return res.status(404).json({ error: "Kid not found" });

  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  // Today's submissions by type
  const todaySubmissions = await db.select({
    type: submissions.type,
    weekNumber: submissions.weekNumber,
  }).from(submissions).where(and(
    eq(submissions.kidId, kidId),
    gte(submissions.submittedAt, dayStart),
    lt(submissions.submittedAt, dayEnd),
  ));

  // All submissions for this kid (for past week status indicators)
  const allSubmissions = await db.select({
    weekNumber: submissions.weekNumber,
    type: submissions.type,
  }).from(submissions).where(eq(submissions.kidId, kidId));

  // Total points
  const [total] = await db
    .select({ totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)` })
    .from(submissions)
    .where(eq(submissions.kidId, kidId));

  res.json({
    todaySubmissions,
    allSubmissions,
    totalPoints: total.totalPoints,
  });
});
```

### Leaderboard Route in Wouter (Nested)

```typescript
// Source: Wouter docs for nested routing + existing App.tsx pattern
// In App.tsx, the /challenge route already uses nest:
<Route path="/challenge" nest>
  <Switch>
    <Route path="/">
      <ChallengeHub />
    </Route>
    <Route path="/signup">
      <ChallengeSignup />
    </Route>
    <Route path="/leaderboard">
      <Leaderboard />
    </Route>
  </Switch>
</Route>
```
[VERIFIED: existing App.tsx already uses `nest` prop on /challenge route]

### Cloudinary Widget TypeScript Declaration

```typescript
// client/src/types/cloudinary.d.ts
// Required because the widget is loaded via script tag, not npm
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget(
        options: CloudinaryWidgetOptions,
        callback: (error: unknown, result: CloudinaryUploadResult) => void
      ): CloudinaryWidget;
    };
  }
}

interface CloudinaryWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  sources?: string[];
  resourceType?: string;
  clientAllowedFormats?: string[];
  maxVideoFileSize?: number;
  multiple?: boolean;
  maxFiles?: number;
  folder?: string;
  tags?: string[];
  singleUploadAutoClose?: boolean;
  showUploadMoreButton?: boolean;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    thumbnail_url: string;
    resource_type: string;
    bytes: number;
    format: string;
    eager?: Array<{ secure_url: string }>;
  };
}

interface CloudinaryWidget {
  open(): void;
  close(): void;
  destroy(): void;
  isShowing(): boolean;
}

export {};
```
[CITED: cloudinary.com/documentation/upload_widget_reference]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Upload Widget v1 script URL | v2 at `upload-widget.cloudinary.com/latest/global/all.js` | 2023 | New URL, same API surface |
| cloudinary-react npm package | Script tag + `createUploadWidget()` | Cloudinary recommendation | Less bundle weight, direct API access |
| Server-side multer upload | Client-side direct upload | Cloudinary best practice | No server memory pressure, works on Replit Autoscale |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Cloudinary upload preset `nsc_challenge` is configured in dashboard with unsigned mode | Architecture Patterns | Upload will fail with 401; requires dashboard config before testing |
| A2 | VITE_CLOUDINARY_CLOUD_NAME env var will be set in Replit | Architecture Patterns | Widget won't know which account to upload to |
| A3 | Eager transformation `c_limit,w_480,h_480/f_jpg` is configured on the upload preset | Architecture Patterns | Thumbnails won't auto-generate; would need server-side transformation |
| A4 | No CSP headers currently restrict YouTube iframe embedding | Common Pitfalls | YouTube video embeds would be blocked |

## Open Questions (RESOLVED)

1. **Are Cloudinary environment variables already set in Replit?** (RESOLVED: Plan 03 user_setup block directs the executor to set VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Replit before execution.)
   - What we know: CLAUDE.md lists CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET as needed
   - What's unclear: Whether these are already configured in the Replit environment
   - Recommendation: The planner should include a verification step early in Wave 1. Also need VITE_CLOUDINARY_CLOUD_NAME as a client-side env var (Vite prefix required for browser access).

2. **Is the `nsc_challenge` upload preset created in Cloudinary dashboard?** (RESOLVED: Plan 03 user_setup block directs the executor to create the unsigned upload preset named "nsc_challenge" with the required configuration before execution.)
   - What we know: CLAUDE.md specifies unsigned preset with specific constraints
   - What's unclear: Whether this has been manually configured yet
   - Recommendation: Add a "configure Cloudinary preset" task as a prerequisite, or at minimum a verification step.

3. **Video URLs for instructional YouTube embeds** (RESOLVED: null videoUrl is handled by D-07 -- the video bonus section simply does not render. Video URLs will be added via admin panel in Phase 4.)
   - What we know: challenges.videoUrl column exists but all seed data has null videoUrl values
   - What's unclear: Whether YouTube video URLs will be available before launch
   - Recommendation: Per D-07, the code handles null videoUrl by simply not showing the video bonus. This is fine for launch. Videos can be added via admin panel in Phase 4.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | requireFamily middleware (existing, session-based) |
| V3 Session Management | Yes | express-session with connect-pg-simple (existing from Phase 1) |
| V4 Access Control | Yes | Verify kid belongs to family before any submission operation |
| V5 Input Validation | Yes | Zod schemas for all submission data; server-side type/format validation |
| V6 Cryptography | No | No new crypto operations in this phase |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Unauthorized submission for another family's kid | Elevation of Privilege | Verify kid.familyId === req.session.familyId before INSERT |
| Daily cap bypass via concurrent requests | Tampering | Server-side count check + consider unique index on (kid_id, type, DATE(submitted_at)) |
| Cloudinary URL exposure in public API | Information Disclosure | Never return cloudinary_url or cloudinary_id in leaderboard/public endpoints |
| Fake Cloudinary upload data in POST body | Spoofing | Accept but note: unsigned uploads mean someone could POST fake cloudinary IDs. At community-challenge scale this is acceptable risk. The points are 1-per-submission, not high-value. |
| XSS via display names | Tampering | Display names are already sanitized to "First L." format in Phase 1 kid creation |
| IDOR on submission status endpoint | Information Disclosure | Require auth + verify kid ownership before returning submission data |

## Sources

### Primary (HIGH confidence)
- Cloudinary Upload Widget docs: https://cloudinary.com/documentation/upload_widget -- widget initialization, events, React integration
- Cloudinary Upload Widget Reference: https://cloudinary.com/documentation/upload_widget_reference -- maxVideoFileSize, clientAllowedFormats, resourceType, all widget parameters
- Drizzle ORM Context7 (/drizzle-team/drizzle-orm) -- aggregation patterns: count, sum, groupBy, orderBy, subqueries
- Wouter Context7 (/molefrog/wouter) -- nested routing with `nest` prop, Switch component
- Cloudinary Node SDK Context7 (/cloudinary/cloudinary_npm) -- destroy method for admin-side cleanup
- Existing codebase: ~/Projects/nipomo-soccer-website/ -- schema.ts, challengeRoutes.ts, challengeAuth.ts, challengeValidation.ts, App.tsx, challenge/index.tsx, use-auth.tsx, use-active-kid.tsx, KidSelector.tsx, package.json, tailwind.config.ts, db.ts, server/index.ts

### Secondary (MEDIUM confidence)
- Cloudinary Upload Widget script URL verified via web search: `https://upload-widget.cloudinary.com/latest/global/all.js`

### Tertiary (LOW confidence)
- None -- all findings verified against primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified in package.json, no new installs needed
- Architecture: HIGH -- patterns directly derived from existing codebase + official Cloudinary docs
- Pitfalls: HIGH -- based on known Cloudinary widget behavior and common React integration issues
- Security: HIGH -- extends existing auth patterns, ASVS categories mapped to specific controls

**Research date:** 2026-05-29
**Valid until:** 2026-06-15 (stable stack, no fast-moving dependencies)
