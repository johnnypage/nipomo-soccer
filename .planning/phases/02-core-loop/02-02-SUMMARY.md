---
phase: 02-core-loop
plan: 02
subsystem: api
tags: [express, drizzle, postgresql, leaderboard, submissions, zod]

# Dependency graph
requires:
  - phase: 02-01
    provides: submissions table schema, submitSchema/videoBonusSchema validation, challengeRoutes.ts foundation
provides:
  - POST /api/submissions with daily cap enforcement
  - POST /api/video-bonus with weekly cap and videoUrl check
  - GET /api/submissions/status for per-kid client state
  - GET /api/leaderboard public ranked list with privacy boundary
affects: [02-03, 02-04, 02-05]

# Tech tracking
tech-stack:
  added: []
  patterns: [daily-cap-via-date-range-query, weekly-cap-via-weekNumber, public-vs-auth-endpoint-split, privacy-boundary-in-select]

key-files:
  created: []
  modified:
    - server/challengeRoutes.ts

key-decisions:
  - "Daily cap uses startOfDay/endOfDay date range (not date truncation) for timezone safety"
  - "Leaderboard uses SQL aggregation with innerJoin rather than subquery for simplicity at this scale"
  - "Video bonus stored as submission row with type=video_bonus (unified points model)"

patterns-established:
  - "Daily cap: count submissions by kidId + type + date range, return 409 on duplicate"
  - "Weekly cap: count submissions by kidId + weekNumber + type, return 409 on duplicate"
  - "Privacy boundary: leaderboard SELECT excludes cloudinaryUrl/cloudinaryId, uses displayName only"
  - "Public endpoint pattern: no requireFamily middleware, async (_req, res) signature"

requirements-completed: [SUB-03, SUB-04, SUB-05, PTS-01, PTS-02, PTS-03, LDR-01, LDR-04, LDR-05, LDR-06, PRIV-02, PRIV-03, CHAL-04]

# Metrics
duration: 3min
completed: 2026-05-29
---

# Phase 02 Plan 02: Submission & Leaderboard API Summary

**Four API endpoints for submission recording with daily/weekly caps, per-kid status queries, and public leaderboard ranking with privacy-safe display names**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-29T16:58:47Z
- **Completed:** 2026-05-29T17:01:22Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- POST /api/submissions with Zod validation, kid ownership verification, and daily cap enforcement (1 skill + 1 fitness per kid per day)
- POST /api/video-bonus with weekly cap (1 per kid per week) and challenge videoUrl existence check
- GET /api/submissions/status returning todaySubmissions, allSubmissions, and totalPoints for client-side state
- GET /api/leaderboard as a public endpoint returning ranked display names, age tracks, points, and isRegistered flag (no Cloudinary URLs)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add submission and video bonus POST endpoints** - `38bae2a` (feat)
2. **Task 2: Add submission status and public leaderboard GET endpoints** - `2e7cda6` (feat)

## Files Created/Modified
- `server/challengeRoutes.ts` - Added 4 new endpoints (2 POST, 2 GET) with 211 new lines of route handlers

## Decisions Made
- Used startOfDay/endOfDay from date-fns for daily cap checks rather than SQL date truncation -- timezone-safe approach
- Leaderboard query uses innerJoin (submissions -> kids -> families) so kids with zero submissions don't appear -- intentional since you need at least one submission to be on the board
- Video bonus stored as a submission row with type="video_bonus" and no Cloudinary fields -- keeps the points model unified in one table

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in ProgramCard.tsx and shopRoutes.ts (unrelated to this plan). Zero errors in challengeRoutes.ts. Out of scope per deviation rules.

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- All 4 API endpoints ready for Plan 03 (client submission flow) and Plan 04 (leaderboard page)
- POST /api/submissions expects Cloudinary upload metadata from client -- Plan 03 will wire the upload widget
- GET /api/leaderboard shape matches the leaderboard UI needs documented in Plan 04

## Self-Check: PASSED

- [x] server/challengeRoutes.ts exists
- [x] 02-02-SUMMARY.md exists
- [x] Commit 38bae2a found
- [x] Commit 2e7cda6 found
- [x] All 4 endpoints present (1 each)
- [x] No TypeScript errors in modified file

---
*Phase: 02-core-loop*
*Completed: 2026-05-29*
