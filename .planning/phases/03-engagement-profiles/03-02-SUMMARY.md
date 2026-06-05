---
phase: 03-engagement-profiles
plan: 02
subsystem: ui
tags: [badges, streaks, leaderboard, wouter, framer-motion, lucide-react, player-profiles]

# Dependency graph
requires:
  - phase: 03-engagement-profiles
    provides: badge definitions (STREAK_BADGES, ACHIEVEMENT_BADGES), enhanced leaderboard API with currentStreak/badgeCount
provides:
  - BadgeIcon reusable component for rendering any badge with Framer Motion animation
  - StreakBadge component with flame icon and color intensity scaling
  - Clickable PlayerRow linking to /challenge/player/:kidId
  - Clickable PodiumCard linking to /challenge/player/:kidId
  - Leaderboard page passing streak and badge data to all display components
affects: [03-03-PLAN]

# Tech tracking
tech-stack:
  added: []
  patterns: [Wouter Link wrapping Framer Motion div for animated clickable cards, color intensity scaling by streak length]

key-files:
  created:
    - client/src/components/challenge/BadgeIcon.tsx
    - client/src/components/challenge/StreakBadge.tsx
  modified:
    - client/src/components/challenge/PlayerRow.tsx
    - client/src/components/challenge/PodiumCard.tsx
    - client/src/pages/challenge/leaderboard.tsx

key-decisions:
  - "No new dependencies added -- used existing wouter Link, framer-motion, and lucide-react"
  - "Streak color intensity scales at 7-day and 14-day thresholds (orange-400 < orange-500 < red-500)"

patterns-established:
  - "Link wrapping motion.div: Wouter Link as outer element, Framer Motion div as inner animated container with cursor-pointer"
  - "Badge icon mapping: ICON_MAP record maps string icon names to Lucide React components for dynamic rendering"

requirements-completed: [PROF-04, PTS-04, PTS-05]

# Metrics
duration: 4min
completed: 2026-05-29
---

# Phase 3 Plan 02: Leaderboard UI with Clickable Profiles, Streak Flames, and Badge Counts Summary

**BadgeIcon and StreakBadge display components plus leaderboard entries linked to player profiles with inline streak/badge indicators**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-29T21:35:47Z
- **Completed:** 2026-05-29T21:40:09Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created BadgeIcon component that renders any badge definition with Framer Motion scale animation and earned/unearned state
- Created StreakBadge component with flame icon, count display, and color intensity that scales at 7 and 14 day thresholds
- PlayerRow and PodiumCard now link to /challenge/player/:kidId via Wouter Link, showing streak and badge data inline
- Leaderboard page passes currentStreak and badgeCount from the enhanced API to all display components

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BadgeIcon and StreakBadge display components** - `a9d0822` (feat)
2. **Task 2: Enhance PlayerRow and PodiumCard with links, streak, and badge indicators** - `e87121e` (feat)

## Files Created/Modified
- `client/src/components/challenge/BadgeIcon.tsx` - Reusable badge display with Framer Motion animation, icon mapping, and earned/unearned state
- `client/src/components/challenge/StreakBadge.tsx` - Streak indicator with flame icon, count, and color intensity scaling
- `client/src/components/challenge/PlayerRow.tsx` - Extended with Wouter Link, StreakBadge, badge count display, currentStreak/badgeCount props
- `client/src/components/challenge/PodiumCard.tsx` - Extended with Wouter Link, StreakBadge, kidId/currentStreak/badgeCount props
- `client/src/pages/challenge/leaderboard.tsx` - LeaderboardEntry type extended, new props passed to PodiumCard and PlayerRow

## Decisions Made
- No new npm dependencies needed -- wouter Link, framer-motion, and lucide-react icons were all already available
- Streak color thresholds set at 7 days (orange-500) and 14 days (red-500) to match the streak badge definitions from Plan 01

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- All display components for badges, streaks, and clickable profiles are ready
- Plan 03 (player profile page at /challenge/player/:id) can proceed immediately
- The profile page will use BadgeIcon to render earned badges and StreakBadge for the player's current streak

## Self-Check: PASSED

- FOUND: client/src/components/challenge/BadgeIcon.tsx
- FOUND: client/src/components/challenge/StreakBadge.tsx
- FOUND: a9d0822 (Task 1 commit)
- FOUND: e87121e (Task 2 commit)
- FOUND: 03-02-SUMMARY.md

---
*Phase: 03-engagement-profiles*
*Completed: 2026-05-29*
