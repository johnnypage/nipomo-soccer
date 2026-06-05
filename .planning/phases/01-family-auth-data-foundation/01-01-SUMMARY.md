---
phase: 01-family-auth-data-foundation
plan: 01
subsystem: database, auth
tags: [drizzle, postgresql, express-session, connect-pg-simple, zod, schema]

# Dependency graph
requires:
  - phase: none
    provides: first plan in project
provides:
  - families, kids, challenges Drizzle table definitions with UUID PKs
  - Insert schemas (insertFamilySchema, insertKidSchema, insertChallengeSchema) with server-computed field omissions
  - Type exports (Family, Kid, Challenge, InsertFamily, InsertKid)
  - API validation schemas (signupSchema, addKidSchema, ageTrackEnum) for shared client/server use
  - Express session middleware with PostgreSQL-backed store (connect-pg-simple)
  - TypeScript session type augmentation (req.session.familyId)
affects: [01-02, 01-03, phase-2, phase-3, phase-4]

# Tech tracking
tech-stack:
  added: []
  patterns: [drizzle-date-mode-date, session-type-augmentation, separate-pg-pool-for-sessions, api-validation-separate-from-db-schemas]

key-files:
  created: [shared/challengeValidation.ts]
  modified: [shared/schema.ts, server/index.ts]

key-decisions:
  - "Separate pg.Pool for connect-pg-simple rather than importing from db.ts (db.ts exports Drizzle, not raw pool)"
  - "API validation schemas in shared/challengeValidation.ts separate from drizzle-zod insert schemas in schema.ts"
  - "ageTrack and displayName omitted from insertKidSchema (computed server-side per D-03 and D-06)"
  - "birthdate uses Drizzle date with mode:date for JavaScript Date objects (per Pitfall 6)"

patterns-established:
  - "date column with mode:date: use date('column', { mode: 'date' }) for proper Date objects"
  - "Session type augmentation: declare module 'express-session' { interface SessionData { familyId: string } }"
  - "API validation file pattern: plain Zod schemas in shared/challengeValidation.ts (not drizzle-zod)"
  - "Trust proxy before session middleware for Replit HTTPS proxy"

requirements-completed: [AUTH-03, PRIV-01, CHAL-05]

# Metrics
duration: 4min
completed: 2026-05-29
---

# Phase 1 Plan 01: Schema, Validation & Session Middleware Summary

**Drizzle schema with families/kids/challenges tables, Zod API validation schemas, and PostgreSQL-backed session middleware for cookie-based family auth**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-29T06:11:11Z
- **Completed:** 2026-05-29T06:15:04Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Three new database tables (families, kids, challenges) with UUID primary keys, foreign key constraints, and consent tracking
- Shared Zod validation schemas for signup (email + consent), kid creation (first/last name + birthdate), and age track enum
- Express session middleware wired to PostgreSQL via connect-pg-simple with 30-day httpOnly secure cookies and auto session table creation

## Task Commits

Each task was committed atomically:

1. **Task 1: Add families, kids, and challenges tables to shared/schema.ts** - `98b12f4` (feat)
2. **Task 2: Create shared/challengeValidation.ts with API Zod schemas** - `ad56ca1` (feat)
3. **Task 3: Wire express-session + connect-pg-simple into server/index.ts** - `e72500e` (feat)

## Files Created/Modified
- `shared/schema.ts` - Added families, kids, challenges tables with insert schemas and type exports
- `shared/challengeValidation.ts` - New file with signupSchema, addKidSchema, ageTrackEnum for API validation
- `server/index.ts` - Added session middleware with connect-pg-simple, trust proxy, session type augmentation

## Decisions Made
- Used a separate pg.Pool for connect-pg-simple rather than trying to extract the pool from db.ts (which exports a Drizzle instance, not a raw pool)
- API validation schemas kept in their own file (shared/challengeValidation.ts) separate from Drizzle insert schemas, following the existing shopValidation.ts pattern
- birthdate column uses `date("birthdate", { mode: "date" })` to return JavaScript Date objects instead of strings

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
- Two pre-existing TypeScript errors found (ProgramCard.tsx missing props, shopRoutes.ts Set iteration) -- both unrelated to this plan's changes. Logged as out-of-scope per deviation rules.

## User Setup Required

None -- no external service configuration required. SESSION_SECRET env var has a dev fallback and should be set in production (Replit secrets).

## Next Phase Readiness
- Schema ready for Plan 02 to create API routes (challengeRoutes.ts) with Drizzle queries against families/kids/challenges tables
- Validation schemas ready for Plan 02 to use in .safeParse() on POST endpoints
- Session middleware ready for Plan 02 to create challengeAuth.ts middleware checking req.session.familyId
- db:push needed in Plan 02 to apply schema to PostgreSQL

---
*Phase: 01-family-auth-data-foundation*
*Completed: 2026-05-29*
