---
phase: 02-core-loop
plan: 03
subsystem: ui
tags: [cloudinary, react, framer-motion, radix-checkbox, tanstack-query, video-upload]

requires:
  - phase: 02-01
    provides: "Drizzle schema (families, kids, challenges, submissions) and Cloudinary type declarations"
  - phase: 02-02
    provides: "API endpoints (POST /api/submissions, POST /api/video-bonus, GET /api/submissions/status)"
provides:
  - "useCloudinaryUpload hook wrapping Cloudinary Upload Widget with nsc_challenge preset"
  - "useSubmissions hook with per-kid submission status, daily cap, and video bonus helpers"
  - "SubmitButton component with 4 states (default/uploading/success/capped)"
  - "VideoBonusCheckbox component with Radix checkbox and API integration"
  - "ChallengeCard component assembling track pills, YouTube embed, submit buttons, fitness bonus"
  - "TrackPill component for age track variation display"
  - "PointsDisplay component with Framer Motion animated counter"
affects: [02-04, 02-05]

tech-stack:
  added: []
  patterns:
    - "Cloudinary Upload Widget hook pattern with widget ref caching and script-load guard"
    - "Per-kid query key pattern for submission status caching"
    - "4-state button pattern with Cloudinary widget integration"
    - "Honor-system checkbox with server-side deduplication on 409"

key-files:
  created:
    - "client/src/hooks/use-cloudinary.tsx"
    - "client/src/hooks/use-submissions.tsx"
    - "client/src/components/challenge/SubmitButton.tsx"
    - "client/src/components/challenge/VideoBonusCheckbox.tsx"
    - "client/src/components/challenge/ChallengeCard.tsx"
    - "client/src/components/challenge/TrackPill.tsx"
    - "client/src/components/challenge/PointsDisplay.tsx"
  modified:
    - "client/src/types/cloudinary.d.ts"

key-decisions:
  - "409 conflict responses from server treated as capped state in SubmitButton and claimed state in VideoBonusCheckbox"
  - "Widget ref cached across re-renders to avoid recreating Cloudinary widget instance"
  - "Submission status query uses 30s staleTime with refetchOnWindowFocus for near-real-time updates"

patterns-established:
  - "Cloudinary widget hook: useRef for widget instance, useCallback for openWidget, window.cloudinary guard"
  - "Submission mutation pattern: apiRequest POST then invalidate both /api/submissions/status and /api/leaderboard"
  - "409 conflict handling: treat as idempotent success (already submitted/claimed), not error"

requirements-completed: [SUB-01, SUB-02, SUB-03, SUB-05, SUB-06, CHAL-02, CHAL-03, PTS-02]

duration: 3min
completed: 2026-05-29
---

# Phase 02 Plan 03: Submission Hooks & Components Summary

**Cloudinary upload widget hook, per-kid submission status hook, and 5 challenge card UI components with 4-state submit button and honor-system video bonus checkbox**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-29T17:05:00Z
- **Completed:** 2026-05-29T17:08:20Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- useCloudinaryUpload hook wraps Cloudinary Upload Widget with project-specific config (nsc_challenge preset, 50MB max, video-only, mp4/mov/webm)
- useSubmissions hook provides per-kid submission status with hasSubmittedToday, hasVideoBonusForWeek, getWeekSubmissions helpers and dual cache invalidation
- SubmitButton handles full upload lifecycle: opens Cloudinary widget, POSTs metadata to server, shows animated success state with +1 point, gracefully handles 409 daily cap
- ChallengeCard assembles all sub-components into a cohesive weekly challenge view with age track pills, responsive YouTube embed, video bonus checkbox, and separate skill/fitness submit buttons

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useCloudinaryUpload and useSubmissions hooks** - `1014778` (feat)
2. **Task 2: Create SubmitButton, VideoBonusCheckbox, ChallengeCard, TrackPill, PointsDisplay components** - `b2a81a3` (feat)

## Files Created/Modified
- `client/src/hooks/use-cloudinary.tsx` - Cloudinary Upload Widget React hook with widget ref caching
- `client/src/hooks/use-submissions.tsx` - TanStack Query hook for per-kid submission status
- `client/src/components/challenge/SubmitButton.tsx` - 4-state submit button (default/uploading/success/capped) with Cloudinary integration
- `client/src/components/challenge/VideoBonusCheckbox.tsx` - Radix checkbox for honor-system video bonus with POST /api/video-bonus
- `client/src/components/challenge/ChallengeCard.tsx` - Full challenge card rendering skill/fitness with all sub-components
- `client/src/components/challenge/TrackPill.tsx` - Age track variation display pill (active/inactive styling)
- `client/src/components/challenge/PointsDisplay.tsx` - Animated points counter with Framer Motion AnimatePresence
- `client/src/types/cloudinary.d.ts` - Fixed type declarations (moved interfaces inside declare global block)

## Decisions Made
- 409 conflict responses treated as idempotent success (capped/claimed state) rather than errors, matching server-side deduplication design
- Widget ref cached via useRef to avoid recreating Cloudinary widget on every render
- Submission status uses 30s staleTime with refetchOnWindowFocus for responsive updates without excessive polling

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed cloudinary.d.ts type declarations for cross-file visibility**
- **Found during:** Task 2 (component creation, TypeScript compilation)
- **Issue:** CloudinaryUploadResult, CloudinaryWidget, and CloudinaryWidgetOptions interfaces were declared outside the `declare global` block in cloudinary.d.ts. The `export {}` made the file a module, scoping those interfaces to the file only. Other files referencing these types got TS2304 "Cannot find name" errors.
- **Fix:** Moved all three interfaces inside the `declare global` block so they're globally available
- **Files modified:** client/src/types/cloudinary.d.ts
- **Verification:** `npx tsc --noEmit` shows 0 errors in new files (only 2 pre-existing errors in unrelated files)
- **Committed in:** b2a81a3 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix for TypeScript compilation. No scope creep.

## Issues Encountered
None beyond the cloudinary.d.ts fix documented above.

## User Setup Required
Cloudinary environment variables and upload preset configuration required before deploy. See plan frontmatter `user_setup` section:
- `VITE_CLOUDINARY_CLOUD_NAME` - browser-accessible cloud name for upload widget
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - server-side admin ops
- Create unsigned upload preset "nsc_challenge" in Cloudinary dashboard

## Next Phase Readiness
- All 2 hooks and 5 components ready for integration by Plan 04 (Challenge Hub page assembly)
- ChallengeCard is the primary building block Plan 04 will render for the current week
- useSubmissions provides the data layer Plan 04 needs to wire up submission state per kid

## Self-Check: PASSED

- All 7 created files verified present on disk
- Both task commits (1014778, b2a81a3) verified in git log

---
*Phase: 02-core-loop*
*Completed: 2026-05-29*
