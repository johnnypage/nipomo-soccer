---
phase: 02-core-loop
plan: 01
subsystem: database
tags: [drizzle, postgresql, zod, cloudinary, typescript]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: families, kids, challenges tables in schema.ts; challengeValidation.ts with signupSchema and addKidSchema
provides:
  - submissions table in schema.ts with FK references to families, kids, challenges
  - submitSchema and videoBonusSchema validation in challengeValidation.ts
  - submissionTypeEnum Zod enum for submission types
  - Cloudinary Upload Widget script loaded globally in browser
  - TypeScript declarations for Cloudinary widget API
affects: [02-02 submission API routes, 02-03 client submission flow, 02-04 leaderboard, 02-05 admin]

# Tech tracking
tech-stack:
  added: [Cloudinary Upload Widget v2 (script tag)]
  patterns: [submissions table follows existing pgTable pattern with varchar UUID PKs and timestamp defaults]

key-files:
  created:
    - client/src/types/cloudinary.d.ts
  modified:
    - shared/schema.ts
    - shared/challengeValidation.ts
    - client/index.html

key-decisions:
  - "db:push deferred to Replit deploy -- DATABASE_URL only available in Replit environment"

patterns-established:
  - "Submission schema: denormalized familyId FK for query speed alongside kidId and challengeId FKs"
  - "Points default to 1 per submission (server-controlled, not user-supplied) per PTS-01"
  - "cloudinaryUrl stored in DB but marked for exclusion from public API responses per PRIV-03"

requirements-completed: [SUB-01, SUB-02, SUB-06, PTS-01]

# Metrics
duration: 2min
completed: 2026-05-29
---

# Phase 02 Plan 01: Submission Data Foundation Summary

**Submissions table with 11 columns and 3 FK constraints, Zod validation schemas for submit/video_bonus, and Cloudinary Upload Widget script with TypeScript declarations**

## Performance

- **Duration:** 2 min
- **Started:** 2026-05-29T16:52:47Z
- **Completed:** 2026-05-29T16:54:58Z
- **Tasks:** 3 (2 code tasks committed, 1 db:push deferred to Replit)
- **Files modified:** 4

## Accomplishments
- Submissions table defined in schema.ts with all 11 columns, 3 FK references (kids, challenges, families), and proper defaults
- Zod validation schemas (submitSchema, videoBonusSchema, submissionTypeEnum) added to challengeValidation.ts for server-side request validation
- Cloudinary Upload Widget v2 script tag added to index.html, making window.cloudinary.createUploadWidget() available globally
- TypeScript declarations created for CloudinaryWidgetOptions, CloudinaryUploadResult, and CloudinaryWidget interfaces

## Task Commits

Each task was committed atomically (in nipomo-soccer-website repo):

1. **Task 1: Add submissions table to schema and validation schemas** - `10e3f0f` (feat)
2. **Task 2: Add Cloudinary Upload Widget script and TypeScript declarations** - `be49935` (feat)
3. **Task 3: Push schema to database** - deferred (DATABASE_URL only available on Replit)

## Files Created/Modified
- `shared/schema.ts` - Added submissions pgTable with id, kidId, challengeId, familyId, weekNumber, type, points, cloudinaryId, cloudinaryUrl, thumbnailUrl, submittedAt; plus insertSubmissionSchema and type exports
- `shared/challengeValidation.ts` - Added submissionTypeEnum, submitSchema (for video uploads), videoBonusSchema (for video bonus claims)
- `client/index.html` - Added Cloudinary Upload Widget v2 script tag in head
- `client/src/types/cloudinary.d.ts` - TypeScript declarations for Cloudinary widget API (Window augmentation, options, result, widget interfaces)

## Decisions Made
- db:push deferred to Replit deployment -- DATABASE_URL is a Replit-only environment variable (Neon-backed PostgreSQL). Schema definition is correct; table creation happens via `npx drizzle-kit push` in Replit Shell after git pull.

## Deviations from Plan

None -- plan executed exactly as written. Task 3 (db:push) was a no-op locally due to expected environment constraint (no DATABASE_URL outside Replit), which is the standard deploy workflow.

## Issues Encountered
- Pre-existing TypeScript errors in ProgramCard.tsx and shopRoutes.ts (2 errors, unrelated to this plan's changes). No new errors introduced.

## User Setup Required

None -- Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are needed for Plan 02 (API routes), not this plan. The upload widget script tag loads without credentials.

**Deploy note:** After merging to main and pulling in Replit, run `npx drizzle-kit push` to create the submissions table in PostgreSQL.

## Next Phase Readiness
- submissions table schema ready for Plan 02 (API routes) to import and query
- submitSchema and videoBonusSchema ready for Plan 02 request validation
- Cloudinary widget and TypeScript types ready for Plan 03 (client submission flow)
- db:push must complete on Replit before API routes can function

## Self-Check: PASSED

All files exist, all commits verified, all content checks passed.

---
*Phase: 02-core-loop*
*Completed: 2026-05-29*
