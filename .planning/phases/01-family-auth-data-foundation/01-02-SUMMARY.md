---
phase: 01-family-auth-data-foundation
plan: 02
subsystem: api, auth
tags: [express, sendgrid, magic-link, drizzle, session, zod, date-fns]

# Dependency graph
requires:
  - phase: 01-01
    provides: families/kids/challenges Drizzle tables, challengeValidation Zod schemas, express-session middleware
provides:
  - requireFamily auth middleware for session-based family authentication
  - Magic link signup/login/verify/logout API endpoints via SendGrid
  - Kid CRUD endpoints with auto-computed age track and display name
  - 48-entry challenge seed data (8 weeks x 3 tracks x 2 types)
  - Public GET /api/challenges endpoint for challenge content
affects: [01-03, phase-2, phase-3, phase-4]

# Tech tracking
tech-stack:
  added: []
  patterns: [magic-link-auth-flow, session-fixation-protection, email-enumeration-prevention, idempotent-seed-data, family-scoped-kid-access]

key-files:
  created: [server/challengeAuth.ts, server/challengeRoutes.ts]
  modified: [server/routes.ts]

key-decisions:
  - "requireFamily uses NextFunction middleware pattern (not boolean-return like existing admin auth) for cleaner route composition"
  - "Same API response for existing and new emails on signup/login to prevent email enumeration (T-02-03)"
  - "Session regenerated on verify before setting familyId (session fixation protection, T-02-02)"
  - "Kid queries always scoped to req.session.familyId (cross-family access prevention, T-02-04)"
  - "PATCH /api/kids/:id recomputes ageTrack and displayName when birthdate or name changes"

patterns-established:
  - "Family auth middleware: requireFamily checks req.session.familyId, returns 401 JSON"
  - "Magic link flow: randomBytes(32) token, 15-min expiry, single-use (nullified after verify)"
  - "Seed data pattern: CHALLENGE_SEED const array with seedChallengesIfEmpty() called at route registration"
  - "Age track computation: differenceInYears from date-fns, 4-6 littlekicks, 7-10 starter, 11-18 advanced"
  - "Display name generation: 'First L.' format for COPPA-friendly leaderboard display"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, PRIV-01, CHAL-05]

# Metrics
duration: 3min
completed: 2026-05-29
---

# Phase 1 Plan 02: Auth API Routes, Kid CRUD & Challenge Seed Summary

**Magic link auth flow with SendGrid email delivery, kid management with auto-computed age tracks, and 48 pre-seeded challenges from the proposal calendar**

## Performance

- **Duration:** 3 min
- **Started:** 2026-05-29T06:18:57Z
- **Completed:** 2026-05-29T06:22:44Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Complete magic link auth API (signup, login, verify, logout, /me) with session fixation protection and email enumeration prevention
- Kid CRUD endpoints (create, update, delete) with server-side age track auto-assignment from birthdate and "First L." display name generation
- 48 challenge entries seeded from the Summer Skills Challenge proposal (8 weeks x 3 age tracks x 2 types)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create challengeAuth.ts and challengeRoutes.ts with all API routes and challenge seed** - `2a7c2a1` (feat)
2. **Task 2: Register challengeRoutes in routes.ts and push database schema** - `28cdcb4` (feat)

## Files Created/Modified
- `server/challengeAuth.ts` - requireFamily session auth middleware
- `server/challengeRoutes.ts` - All auth, kid, and challenge API routes plus 48-entry seed data
- `server/routes.ts` - Added import and registration call for registerChallengeRoutes

## Decisions Made
- requireFamily middleware uses standard Express NextFunction pattern rather than the boolean-return pattern in auth.ts, since family auth is a separate system and middleware composition is cleaner
- Session regeneration on magic link verify prevents session fixation attacks
- All kid endpoints scope queries to the authenticated family's ID, preventing cross-family data access

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
- `npx drizzle-kit push` cannot run locally (no DATABASE_URL env var). This is expected per the plan objective -- schema push will happen on deployment to Replit. Not a blocker.
- Two pre-existing TypeScript errors (ProgramCard.tsx, shopRoutes.ts) remain unrelated to this plan's changes. Documented in Plan 01-01 SUMMARY as out-of-scope.

## User Setup Required

None -- SendGrid API key and session secret are already documented in Plan 01's user_setup. No new env vars introduced.

## Next Phase Readiness
- All API endpoints ready for Plan 03 client UI development
- GET /api/auth/me provides family + kids data for auth state hook
- GET /api/challenges returns all seed data for challenge display
- POST /api/kids with age track auto-computation ready for kid-add form
- db:push must run on Replit before routes function against the database

---
*Phase: 01-family-auth-data-foundation*
*Completed: 2026-05-29*
