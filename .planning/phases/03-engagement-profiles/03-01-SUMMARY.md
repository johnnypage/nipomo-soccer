---
phase: 03-engagement-profiles
plan: 01
subsystem: api
tags: [streaks, badges, gamification, player-profiles, drizzle, date-fns, leaderboard]

# Dependency graph
requires:
  - phase: 02-core-loop
    provides: submissions table, kids table, leaderboard endpoint, challenge routes
provides:
  - Badge definitions shared between server and client (STREAK_BADGES, ACHIEVEMENT_BADGES)
  - computeStreak function for consecutive-day streak tracking
  - computeBadges function for achievement badge eligibility
  - GET /api/player/:id public player profile endpoint
  - Enhanced GET /api/leaderboard with currentStreak and badgeCount per entry
affects: [03-02-PLAN, 03-03-PLAN]

# Tech tracking
tech-stack:
  added: [differenceInCalendarDays, subDays from date-fns]
  patterns: [batch-compute-in-JS pattern for leaderboard enrichment, public profile with field-level privacy]

key-files:
  created:
    - client/src/lib/badges.ts
  modified:
    - server/challengeRoutes.ts

key-decisions:
  - "Used Array.from(new Set(...)) instead of spread to avoid downlevelIteration TS flag requirement"
  - "Player profile is fully public (no auth required) since kid IDs are UUIDs and only public fields are returned"
  - "Leaderboard enrichment fetches all submissions in a single query then computes in JS rather than N+1 queries"

patterns-established:
  - "Batch computation: fetch all submissions once, group by kid in JS, compute streaks/badges per kid"
  - "Privacy boundary: player profile SELECT specifies exact columns (no familyId, lastName, Cloudinary URLs)"

requirements-completed: [PTS-04, PTS-05, PTS-06, PTS-07]

# Metrics
duration: 3min
completed: 2026-05-29
---

# Phase 3 Plan 01: Badge Definitions, Streak/Badge Computation, Player Profile API Summary

**Streak computation, 7 badge definitions (4 streak + 3 achievement), player profile endpoint, and leaderboard enriched with streak/badge data**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-29T21:28:33Z
- **Completed:** 2026-05-29T21:31:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Badge definitions file with 4 streak badges (3/7/14/21-day) and 3 achievement badges (Perfect Week, Fitness All-Star, Summer Champion)
- computeStreak algorithm tracks consecutive days with yesterday grace period, computeBadges checks thresholds against submission data
- GET /api/player/:id returns full profile (kid info, points, streak, badges, submission history) with privacy-safe field selection
- GET /api/leaderboard now includes currentStreak and badgeCount for each ranked entry

## Task Commits

Each task was committed atomically:

1. **Task 1: Create badge definitions and types** - `c3a0509` (feat)
2. **Task 2: Add streak/badge computation and player profile endpoint** - `769c323` (feat)

## Files Created/Modified
- `client/src/lib/badges.ts` - Badge type definitions, STREAK_BADGES, ACHIEVEMENT_BADGES constants, getBadgeById helper
- `server/challengeRoutes.ts` - computeStreak, computeBadges functions, GET /api/player/:id endpoint, enhanced GET /api/leaderboard

## Decisions Made
- Used `Array.from(new Set(...))` instead of spread operator to avoid TS downlevelIteration flag (matching existing codebase TS config)
- Player profile endpoint is public (no requireFamily middleware) since leaderboard is also public and only safe fields are returned
- Batch computation approach: single query fetches all submissions, JS groups by kid and computes -- avoids N+1 at leaderboard scale

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Set spread causing TS2802 error**
- **Found during:** Task 2 (streak computation)
- **Issue:** `[...new Set()]` spread on Set triggers TS2802 when target < es2015 and downlevelIteration is not enabled
- **Fix:** Changed to `Array.from(new Set(...))` which works with current tsconfig
- **Files modified:** server/challengeRoutes.ts
- **Verification:** `npx tsc --noEmit` shows no errors in challengeRoutes.ts or badges.ts
- **Committed in:** 769c323 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor syntax fix for TypeScript compatibility. No scope change.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Server-side streak/badge computation and player profile API are ready for client consumption
- Plan 02 (BadgeIcon/StreakBadge components, leaderboard UI updates) can proceed immediately
- Plan 03 (player profile page at /challenge/player/:id) depends on Plan 02

## Self-Check: PASSED

- FOUND: client/src/lib/badges.ts
- FOUND: c3a0509 (Task 1 commit)
- FOUND: 769c323 (Task 2 commit)
- FOUND: 03-01-SUMMARY.md

---
*Phase: 03-engagement-profiles*
*Completed: 2026-05-29*
