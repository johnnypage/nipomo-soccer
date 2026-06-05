---
phase: 01-family-auth-data-foundation
plan: 03
subsystem: frontend, auth-ui
tags: [react, wouter, tanstack-query, react-hook-form, zod, tailwind]

# Dependency graph
requires:
  - phase: 01-02
    provides: Auth API routes (signup/login/verify/logout), kid CRUD, challenge endpoint
provides:
  - useAuth hook wrapping GET /api/auth/me with TanStack Query
  - ActiveKidProvider context and useActiveKid hook for kid selection
  - SignupForm component with email + consent checkbox (React Hook Form + zodResolver)
  - AddKidForm component with repeating field group (useFieldArray)
  - KidSelector component (dropdown for multi-kid, static for single-kid)
  - Signup page at /challenge/signup with auth redirect
  - Challenge hub page at /challenge with kid management and challenge display
  - Wouter nested routing at /challenge/* with nest prop
affects: [phase-2, phase-3]

# Tech tracking
tech-stack:
  added: []
  patterns: [wouter-nested-routes, active-kid-context, auth-hook-with-returnNull, repeating-field-array]

key-files:
  created: [client/src/hooks/use-auth.tsx, client/src/hooks/use-active-kid.tsx, client/src/components/challenge/SignupForm.tsx, client/src/components/challenge/AddKidForm.tsx, client/src/components/challenge/KidSelector.tsx, client/src/pages/challenge/signup.tsx, client/src/pages/challenge/index.tsx]
  modified: [client/src/App.tsx]

key-decisions:
  - "useAuth uses getQueryFn({ on401: 'returnNull' }) so unauthenticated state is null, not an error"
  - "ActiveKidProvider auto-selects first kid for single-kid families (D-08)"
  - "Kid selector uses Radix Select for multi-kid, static display for single-kid"
  - "Challenge hub filters content by active kid's age track and current week number"
  - "Wouter nest prop creates /challenge/* sub-routing context"

patterns-established:
  - "Auth hook pattern: useAuth returns { family, kids, isLoading, isAuthenticated, logout }"
  - "Active kid context: ActiveKidProvider wraps challenge routes, useActiveKid for selection"
  - "Challenge component directory: client/src/components/challenge/"
  - "Challenge page directory: client/src/pages/challenge/"

requirements-completed: [AUTH-01, AUTH-02, AUTH-04, AUTH-05, PRIV-01]

# Metrics
duration: 4min
completed: 2026-05-29
---

# Phase 1 Plan 03: Client UI -- Auth Hooks, Components, Pages & Routing Summary

**Complete frontend for family signup with consent, kid management with age track display, persistent kid selector, and challenge hub with current week content**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-29
- **Completed:** 2026-05-29
- **Tasks:** 2 auto + 1 checkpoint
- **Files modified:** 8

## Accomplishments
- useAuth hook with TanStack Query wrapping /api/auth/me, returning null for unauthenticated (not error)
- ActiveKidProvider context with auto-select for single-kid families and persistent selection state
- SignupForm with React Hook Form + zodResolver, email input + consent checkbox, login/signup mode toggle
- AddKidForm with useFieldArray for repeating kid entries (first name, last name, birthdate), "Add another kid" button
- KidSelector with Radix Select dropdown for multi-kid families, static display for single-kid, age track badge pills
- Signup page at /challenge/signup with authenticated user redirect and expired link error handling
- Challenge hub at /challenge with first-time user add-kids prompt, returning user challenge content filtered by age track and week, and inline add-kid dialog
- ActiveKidProvider added to App.tsx provider tree, Wouter nested routes at /challenge/*

## Task Commits

Each task was committed atomically:

1. **Task 1: Create hooks and challenge components** - `679a98b` (feat)
2. **Task 2: Create challenge pages and wire routing** - `51c6eaf` (feat)

## Files Created/Modified
- `client/src/hooks/use-auth.tsx` - Auth state hook with TanStack Query, logout, session persistence
- `client/src/hooks/use-active-kid.tsx` - ActiveKidContext provider with auto-select logic
- `client/src/components/challenge/SignupForm.tsx` - Email + consent form with mode toggle
- `client/src/components/challenge/AddKidForm.tsx` - Repeating kid add form with useFieldArray
- `client/src/components/challenge/KidSelector.tsx` - Persistent kid selector with age track badges
- `client/src/pages/challenge/signup.tsx` - Signup page with auth redirect
- `client/src/pages/challenge/index.tsx` - Challenge hub with kid management and challenge display
- `client/src/App.tsx` - Added ActiveKidProvider, challenge routes with nest prop

## Checkpoint: Human Verification Required

Task 3 is a human verification checkpoint. The following needs manual testing:

1. Visit /challenge/signup -- email input, consent checkbox, "Send Login Link" button
2. Submit email -- success message "Check your email for a login link"
3. Click magic link from email -- redirected to /challenge authenticated
4. First-time user sees "Add your kids to get started" with AddKidForm
5. Add a kid -- age track displayed after creation
6. Add second kid -- kid selector appears as dropdown
7. Single-kid family -- static display instead of dropdown
8. Switch kids -- challenge content filters by age track
9. Refresh page -- session persists (still authenticated)
10. Visit /challenge/signup while logged in -- redirects to /challenge

## Deviations from Plan

None -- plan executed as written. Agent crashed during SUMMARY creation (API error), but all code was written and committed successfully. SUMMARY created by orchestrator.

## Issues Encountered
- Executor agent hit an internal API error after completing all code tasks. All files were created and committed; only the SUMMARY.md was missing, created manually by orchestrator.

## Next Phase Readiness
- Complete client-side auth, kid management, and challenge display ready for Phase 2
- Phase 2 will add video upload widget, submission tracking, and leaderboard
- All hooks and components follow established patterns for extension

---
*Phase: 01-family-auth-data-foundation*
*Completed: 2026-05-29*
