---
phase: 02-core-loop
verified: 2026-05-29T18:00:00Z
status: human_needed
score: 9/10 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Challenge hub submission flow -- upload video, see points, hit daily cap"
    expected: "Cloudinary widget opens, video uploads, green checkmark + +1 point appears, second upload of same type shows 'Come back tomorrow!'"
    why_human: "Requires live Replit environment with VITE_CLOUDINARY_CLOUD_NAME set and nsc_challenge preset configured; also requires db:push to have run in Replit"
  - test: "Leaderboard page at /challenge/leaderboard accessible without login"
    expected: "Crimson hero banner, age track tabs, podium cards for top 3, player rows for rank 4+, display names in 'First L.' format only, no Cloudinary URLs visible"
    why_human: "Requires live environment with at least one submission in the database to verify ranked display; empty state only shows otherwise"
  - test: "Video bonus checkbox -- watch video, claim bonus, see disabled state"
    expected: "YouTube embed renders inside ChallengeCard, checkbox shows 'I watched the video (+1 bonus point)', checking it posts to /api/video-bonus, label changes to 'Video bonus claimed! +1 point', second visit shows 'Video bonus claimed this week' (disabled)"
    why_human: "Requires live environment with a challenge that has a videoUrl populated in the database"
  - test: "Past weeks accordion expands for late submission"
    expected: "Past weeks appear below current week with status icons (green CheckCircle2 for completed, gray circle for not), clicking expands to full ChallengeCard with functional submit buttons"
    why_human: "Requires at least one past week to have started (weekStart in the past) in the database"
---

# Phase 02: Core Loop Verification Report

**Phase Goal:** Parents can submit challenge videos and see their kids climb a live leaderboard -- the complete participation cycle works end to end
**Verified:** 2026-05-29T18:00:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | submissions table exists in PostgreSQL schema with correct columns and FK constraints | VERIFIED | `shared/schema.ts` line 264: `export const submissions = pgTable("submissions", {...})` with all 11 columns, 3 FK references to kids/challenges/families. `insertSubmissionSchema` and `Submission` type exported. |
| 2 | Zod validation schemas exist for submission and video bonus requests | VERIFIED | `shared/challengeValidation.ts` lines 24-44: `submissionTypeEnum`, `submitSchema`, `videoBonusSchema` all present and substantive |
| 3 | Cloudinary Upload Widget script loads in the browser | VERIFIED | `client/index.html` line 21: `<script src="https://upload-widget.cloudinary.com/latest/global/all.js" type="text/javascript"></script>` in head |
| 4 | TypeScript recognizes window.cloudinary without compile errors | VERIFIED | `client/src/types/cloudinary.d.ts` has correct `declare global` block with `Window` augmentation, `CloudinaryWidget`, `CloudinaryWidgetOptions`, `CloudinaryUploadResult` interfaces all inside the block. No TS errors in challenge files (2 pre-existing errors in ProgramCard.tsx and shopRoutes.ts are unrelated). |
| 5 | POST /api/submissions records a video submission and returns points; enforces daily cap with 409 | VERIFIED | `server/challengeRoutes.ts` lines 422-477: `requireFamily` gate, Zod validation, kid ownership check, date-range daily cap query returning 409 "Already submitted today. Come back tomorrow!", INSERT with returning, cumulative totalPoints returned |
| 6 | POST /api/video-bonus records a video bonus and enforces 1-per-kid-per-week | VERIFIED | `server/challengeRoutes.ts` lines 480-531: `requireFamily` gate, `challenge.videoUrl` existence check (D-07), weekly cap via weekNumber + type="video_bonus" query, 409 "Video bonus already claimed this week" |
| 7 | GET /api/leaderboard returns public ranked list with display names, age tracks, points, and isRegistered -- no cloudinaryUrl | VERIFIED | `server/challengeRoutes.ts` lines 585-620: No `requireFamily`, SQL SELECT includes only `kidId, displayName, ageTrack, totalPoints, isRegistered`. Confirmed `cloudinaryUrl` and `cloudinaryId` are absent from the SELECT. Uses `kids.displayName` (already "First L." format from Phase 1). |
| 8 | Leaderboard page at /challenge/leaderboard is accessible without login | VERIFIED | `client/src/pages/challenge/leaderboard.tsx`: No `requireFamily`, no auth redirect. Route wired in `client/src/App.tsx` line 48 inside `/challenge` nest. No `isAuthenticated` check in leaderboard page. |
| 9 | Challenge hub shows current week, past weeks in accordion, submission state per kid | VERIFIED | `client/src/pages/challenge/index.tsx` imports `useSubmissions`, `WeekNavigation`, `PointsDisplay`. `WeekNavigation.tsx` renders current week as full `ChallengeCard` and past weeks in Radix Accordion via `PastWeekRow`. Future weeks filtered by `weekStart <= new Date()`. |
| 10 | End-to-end submission cycle works in running app with actual Cloudinary upload and database | UNCERTAIN | Human verification required -- db:push deferred to Replit environment, VITE_CLOUDINARY_CLOUD_NAME and nsc_challenge preset must be configured. Code is correct; runtime behavior requires live environment. |

**Score:** 9/10 truths verified (1 UNCERTAIN -- runtime verification required)

### Deferred Items

Items not yet met but explicitly addressed in later milestone phases.

| # | Item | Addressed In | Evidence |
|---|------|-------------|---------|
| 1 | LDR-04 streak and achievement badge columns in leaderboard rows | Phase 3 | Phase 3 goal: "Kids earn visible streak and achievement badges"; SC 1 covers streak tracking; SC 4 covers leaderboard badge display. D-12 explicitly defers streaks/badges from Phase 2. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `shared/schema.ts` | submissions table with 11 columns, 3 FKs | VERIFIED | Lines 264-281: all columns present, FK to kids/challenges/families |
| `shared/challengeValidation.ts` | submitSchema, videoBonusSchema, submissionTypeEnum | VERIFIED | Lines 24-44: all 3 schemas exported |
| `client/index.html` | Cloudinary Upload Widget script tag in head | VERIFIED | Line 21 in head |
| `client/src/types/cloudinary.d.ts` | TypeScript declarations for Cloudinary widget | VERIFIED | Correct declare global with Window augmentation |
| `server/challengeRoutes.ts` | 4 API endpoints (2 POST, 2 GET) | VERIFIED | Lines 422, 480, 534, 585 |
| `client/src/hooks/use-cloudinary.tsx` | useCloudinaryUpload hook | VERIFIED | Exports `useCloudinaryUpload`, calls `window.cloudinary.createUploadWidget`, nsc_challenge preset, 50MB max, video only |
| `client/src/hooks/use-submissions.tsx` | useSubmissions hook with helpers | VERIFIED | Exports `useSubmissions`, `hasSubmittedToday`, `hasVideoBonusForWeek`, `getWeekSubmissions`, `invalidate` |
| `client/src/components/challenge/SubmitButton.tsx` | 4-state submit button | VERIFIED | All 4 states: "Submit Video" (crimson), "Uploading..." (spinner), "+1 point" success, "Come back tomorrow!" capped. `min-h-[44px]` touch target. Uses `useCloudinaryUpload`, POSTs to `/api/submissions`. |
| `client/src/components/challenge/VideoBonusCheckbox.tsx` | Honor-system video bonus checkbox | VERIFIED | Radix checkbox, `I watched the video (+1 bonus point)` unclaimed label, `Video bonus claimed! +1 point` / `Video bonus claimed this week` claimed labels, POSTs to `/api/video-bonus` |
| `client/src/components/challenge/ChallengeCard.tsx` | Full challenge card with track pills, video embed, submit buttons | VERIFIED | Renders TrackPill in `grid-cols-1 sm:grid-cols-3`, iframe with `aspect-video`, VideoBonusCheckbox (only when videoUrl truthy), SubmitButton for skill and fitness |
| `client/src/components/challenge/TrackPill.tsx` | Age track variation pill | VERIFIED | AGE_TRACK_LABELS record with littlekicks/starter/advanced |
| `client/src/components/challenge/PointsDisplay.tsx` | Animated points counter | VERIFIED | Framer Motion AnimatePresence with key={totalPoints} for animation on change |
| `client/src/components/challenge/WeekNavigation.tsx` | Week list with current week + past week accordion | VERIFIED | Current week as full ChallengeCard, past weeks in Radix Accordion, future weeks filtered |
| `client/src/components/challenge/PastWeekRow.tsx` | Collapsed row with status icons | VERIFIED | CheckCircle2 (green) for completed, Circle (gray) for not completed, 3 icons: skill/fitness/videoBonus |
| `client/src/pages/challenge/index.tsx` | Rewritten challenge hub with submission tracking | VERIFIED | useSubmissions, WeekNavigation, PointsDisplay, auth redirect preserved, no-kids state preserved, pre-launch state preserved, `onSubmitSuccess={invalidate}` |
| `client/src/components/challenge/LeaderboardHero.tsx` | Crimson hero banner | VERIFIED | `bg-crimson`, "Summer Skills Challenge 2026" label, "Leaderboard" heading with `font-display`, totalSubmissions and totalPlayers stats |
| `client/src/components/challenge/PodiumCard.tsx` | Top 3 podium cards | VERIFIED | RANK_CONFIG with gold border for 1st, charcoal for 2nd/3rd, Framer Motion spring animation, NSC Player badge when `isRegistered` |
| `client/src/components/challenge/PlayerRow.tsx` | Rank 4+ player rows | VERIFIED | Cycling AVATAR_COLORS via kidId hash, `hover:border-crimson`, NSC Player badge, staggered animation |
| `client/src/pages/challenge/leaderboard.tsx` | Full leaderboard page | VERIFIED | Fetches `/api/leaderboard` via TanStack Query, `staleTime: 30*1000`, `refetchOnWindowFocus: true`, Radix Tabs with 4 tabs, client-side re-ranking after filter, PodiumCard for top 3, PlayerRow for rank 4+, empty state, no auth gating |
| `client/src/App.tsx` | /challenge/leaderboard route wired | VERIFIED | Line 23: `import Leaderboard from "@/pages/challenge/leaderboard"`, line 48: `<Route path="/leaderboard">` inside `/challenge` nest |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `shared/schema.ts` submissions | families, kids, challenges tables | FK references | VERIFIED | `references(() => families.id)`, `references(() => kids.id)`, `references(() => challenges.id)` all present |
| `server/challengeRoutes.ts` | `shared/schema.ts` | import submissions | VERIFIED | Line 3: `import { families, kids, challenges, submissions } from "@shared/schema"` |
| `server/challengeRoutes.ts` | `shared/challengeValidation.ts` | import submitSchema, videoBonusSchema | VERIFIED | Line 4: `import { signupSchema, addKidSchema, submitSchema, videoBonusSchema } from "@shared/challengeValidation"` |
| `POST /api/submissions` | requireFamily middleware | auth gate | VERIFIED | Line 422: `app.post("/api/submissions", requireFamily, async (req, res)` |
| `GET /api/leaderboard` | NOT behind requireFamily | public endpoint | VERIFIED | Line 585: `app.get("/api/leaderboard", async (_req, res)` -- no requireFamily |
| `client/src/hooks/use-cloudinary.tsx` | window.cloudinary | createUploadWidget call | VERIFIED | Line 19: `window.cloudinary.createUploadWidget(...)` with nsc_challenge preset |
| `client/src/hooks/use-submissions.tsx` | /api/submissions/status | TanStack Query fetch | VERIFIED | Line 15: `fetch('/api/submissions/status?kidId=${kidId}', {...})` |
| `client/src/components/challenge/SubmitButton.tsx` | /api/submissions | apiRequest POST after Cloudinary success | VERIFIED | Line 42: `apiRequest("POST", "/api/submissions", {...})` |
| `client/src/components/challenge/VideoBonusCheckbox.tsx` | /api/video-bonus | apiRequest POST | VERIFIED | Line 31: `apiRequest("POST", "/api/video-bonus", {...})` |
| `client/src/pages/challenge/index.tsx` | useSubmissions hook | import and use | VERIFIED | Line 5: import, line 56: `useSubmissions(activeKid?.id ?? null)` |
| `client/src/components/challenge/WeekNavigation.tsx` | ChallengeCard | renders for current and expanded past weeks | VERIFIED | Lines 73, 106: ChallengeCard used in both contexts |
| `client/src/pages/challenge/leaderboard.tsx` | /api/leaderboard | TanStack Query | VERIFIED | Line 54: `queryKey: ["/api/leaderboard"]` |
| `client/src/App.tsx` | leaderboard.tsx | Wouter Route inside /challenge nest | VERIFIED | Lines 23, 48 |
| `client/src/pages/challenge/index.tsx` | invalidate as onSubmitSuccess | cache invalidation wiring | VERIFIED | Line 129: `onSubmitSuccess={invalidate}` -- invalidates both `/api/submissions/status` and `/api/leaderboard` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| leaderboard.tsx | `entries` (leaderboard array) | `GET /api/leaderboard` -> SQL `SELECT ... FROM submissions INNER JOIN kids INNER JOIN families GROUP BY` | Real DB aggregation query | FLOWING |
| leaderboard.tsx | `stats` (totalSubmissions, totalPlayers) | Same API, second SQL `SELECT count() FROM submissions` | Real DB count | FLOWING |
| challenge/index.tsx | `totalPoints` | `useSubmissions` -> `GET /api/submissions/status` -> SQL `SUM(submissions.points)` | Real DB aggregation | FLOWING |
| SubmitButton.tsx | `updatedTotal` | POST /api/submissions response -> `result.totalPoints` (server-computed) | Real DB aggregation on insert | FLOWING |
| challenge/index.tsx | `allChallenges` | `GET /api/challenges` (Phase 1, existing) | Real DB query | FLOWING |

### Behavioral Spot-Checks

Step 7b: SKIPPED -- cannot test without running server + valid DATABASE_URL + Cloudinary credentials. All checks that matter are either static code verifiable (done above) or require the live Replit environment.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| SUB-01 | 02-01, 02-03 | Parent can upload video from phone (.mov, .mp4) | VERIFIED | useCloudinaryUpload: `clientAllowedFormats: ["mp4", "mov", "webm"]`, Cloudinary widget opens on "Submit Video" click |
| SUB-02 | 02-01, 02-03 | Video uploads directly to Cloudinary (not through server) with progress indicator | VERIFIED | Cloudinary widget handles upload directly; server only records metadata after widget success callback |
| SUB-03 | 02-02, 02-03 | Parent selects child + challenge type when submitting | VERIFIED | `kidId` and `type` in submitSchema; ChallengeCard has separate SubmitButton for skill and fitness |
| SUB-04 | 02-02, 02-04 | Daily cap: 1 skill + 1 fitness per child per day | VERIFIED | Server-side cap check with date range + type filter; 409 response; client shows "Come back tomorrow!" |
| SUB-05 | 02-02, 02-03 | Confirmation with points awarded after submission | VERIFIED | SubmitButton success state: green checkmark, "+1 point", `PointsDisplay` with updated total |
| SUB-06 | 02-01, 02-03 | File size capped at 50MB | VERIFIED | `maxVideoFileSize: 52428800` in useCloudinaryUpload (Cloudinary widget enforces before upload) |
| PTS-01 | 02-01, 02-02 | Each submission earns 1 point | VERIFIED | `points: integer("points").notNull().default(1)` in schema; server returns `{ points: 1 }` |
| PTS-02 | 02-02, 02-03 | Watching video earns 1 bonus point per kid per week (honor-system) | VERIFIED | VideoBonusCheckbox + POST /api/video-bonus with weekly cap |
| PTS-03 | 02-02 | Points cumulative across all 8 weeks | VERIFIED | `SUM(submissions.points)` with no week filter in totalPoints query |
| LDR-01 | 02-02, 02-05 | Public leaderboard at /challenge/leaderboard ranked by total points | VERIFIED | Public GET /api/leaderboard, route wired, page accessible without auth |
| LDR-02 | 02-05 | Leaderboard filterable by age track | VERIFIED | Radix Tabs: All / Little Kicks / Starter / Advanced, client-side filter with re-ranking |
| LDR-03 | 02-05 | Top 3 players get podium-style visual treatment | VERIFIED | PodiumCard for ranks 1-3, gold border for 1st, Framer Motion spring animation |
| LDR-04 | 02-02, 02-05 | Row shows name, track, points, streak, badges | PARTIAL (by design) | Name/track/points/NSC badge: VERIFIED. Streak and achievement badges: deferred to Phase 3 per D-12. |
| LDR-05 | 02-02, 02-05 | NSC Player badge on registered players | VERIFIED | `isRegistered` from families table in leaderboard SQL; PodiumCard and PlayerRow render badge |
| LDR-06 | 02-02, 02-05 | First name + last initial only (COPPA) | VERIFIED | `kids.displayName` ("First L." format from Phase 1) used in leaderboard SELECT; no full name exposed |
| CHAL-01 | 02-03, 02-04 | Challenge hub shows current week with age-track variations | VERIFIED | TrackPill rendered in 3-column grid for all age tracks; active track highlighted |
| CHAL-02 | 02-03 | Instructional video embed per age track | VERIFIED | `<iframe>` with `aspect-video` container, conditional on `activeSkill.videoUrl` truthy |
| CHAL-03 | 02-03 | Fitness bonus alongside skill challenge | VERIFIED | ChallengeCard renders fitnessChallenge section with separate SubmitButton |
| CHAL-04 | 02-02, 02-04 | Challenge page shows currently active week based on date | VERIFIED | `getCurrentWeekNumber` using `weekStart`/`weekEnd` date comparison; WeekNavigation shows only started weeks |
| PRIV-02 | 02-02, 02-05 | Leaderboard displays first name + last initial only | VERIFIED | `kids.displayName` in SQL SELECT only; leaderboard.tsx does not render any other name field |
| PRIV-03 | 02-02, 02-05 | Videos not publicly viewable -- admin-only via Cloudinary URLs | VERIFIED | Leaderboard SELECT explicitly excludes `cloudinaryUrl` and `cloudinaryId`. Leaderboard page type definition has no Cloudinary fields. No public video playback UI exists. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `client/src/hooks/use-submissions.tsx` | 18 | `return null` on 401 | Info | Expected behavior -- unauthenticated requests return null so hook degrades gracefully. Not a stub. |
| `client/src/pages/challenge/index.tsx` | 120 | `allChallenges.length > 0 && currentWeek` condition | Info | Shows pre-launch placeholder if no challenges loaded. By design -- challenges come from DB seed (Phase 1). Not a stub. |

No blockers found.

### Human Verification Required

Both Plans 04 and 05 include blocking `checkpoint:human-verify` tasks that were not yet executed. The automation checks all pass. The following tests require the live Replit environment with Cloudinary configured and the database schema pushed:

#### 1. Submission flow -- video upload to points

**Test:** Log in via magic link, visit /challenge, select a kid, click "Submit Video" on the skill challenge. Upload a short .mp4 or .mov file under 50MB.
**Expected:** Cloudinary widget opens with progress indicator. After upload, button transforms to green checkmark + "+1 point" + updated total points count. Clicking Submit Video again for the same type shows "Come back tomorrow!" (daily cap enforced).
**Why human:** Requires live Replit environment, `VITE_CLOUDINARY_CLOUD_NAME` env var set, and `nsc_challenge` unsigned upload preset configured in Cloudinary dashboard. Also requires `npx drizzle-kit push` to have run on Replit to create the `submissions` table. Cannot be verified without Cloudinary credentials.

#### 2. Video bonus checkbox

**Test:** Visit /challenge for a week that has a challenge with a `videoUrl` populated. Verify YouTube embed renders. Click the checkbox "I watched the video (+1 bonus point)".
**Expected:** Checkbox turns green, label changes to "Video bonus claimed! +1 point". On next page load, checkbox is disabled with "Video bonus claimed this week" label.
**Why human:** Requires live DB with at least one challenge row where `videoUrl` is not null. Cannot verify challenge seeding without DB access.

#### 3. Leaderboard with real data

**Test:** Open /challenge/leaderboard in an incognito window (no session). Verify page loads. After at least one submission exists: verify podium cards appear for top 3, player rows for rank 4+, display names are "First L." format, no video URLs visible, NSC Player badge appears for registered users.
**Expected:** Public access confirmed, privacy-safe display, accurate ranking.
**Why human:** Empty state is testable now but ranked display requires at least one submission in the live DB.

#### 4. Past weeks accordion

**Test:** After challenge Week 1 start date (June 9) has passed and Week 2 begins, visit /challenge. Verify past weeks appear in collapsible accordion below the current week. Verify status icons show green CheckCircle2 for submitted types. Expand a past week and verify submit buttons work for late submission.
**Expected:** Past week accordion appears, status icons accurate, late submission works (subject to daily cap for that day).
**Why human:** Requires at least one week to have elapsed since launch. Cannot verify without time passing.

### Gaps Summary

No gaps blocking goal achievement. All automated verifications pass:

- Schema and validation: complete and substantive
- All 4 API endpoints: correct, gated appropriately, cap enforcement verified
- All client hooks and 9 components: created, wired, and non-stub
- Leaderboard: public, privacy-safe, NSC badge, display-name only
- Challenge hub: integrated with submission flow, week navigation, cache invalidation

One partial delivery is intentional and properly deferred: LDR-04 streak/badge columns are addressed in Phase 3 (D-12 decision). This is not a gap.

The phase goal cannot be fully confirmed as PASSED because two blocking human-verify checkpoints from Plans 04 and 05 were never executed (noted in both SUMMARYs), and the database schema push (`npx drizzle-kit push`) was deferred to Replit deployment. The code is correct; the runtime proof of the end-to-end cycle requires the live environment.

---

_Verified: 2026-05-29T18:00:00Z_
_Verifier: Claude (gsd-verifier)_
