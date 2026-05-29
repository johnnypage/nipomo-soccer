# Phase 1: Family Auth & Data Foundation - Discussion Log

**Date:** 2026-05-28
**Mode:** Advisor (research-backed comparison tables)
**Calibration:** standard (pragmatic-fast vendor philosophy)
**Areas discussed:** 4 of 4

## Area 1: Signup and kid setup experience

**Options presented:**
1. Single-page form (parent info + kids inline)
2. Two-step flow (Step 1: parent email + consent, Step 2: add kids after magic link)
3. Multi-step wizard (3+ steps)

**Recommendation:** Two-step flow -- magic link creates a natural break. Collect first name, last name, birthdate per kid.

**User selection:** Approved with modification -- use birthdate instead of birth year for precise age track assignment.

**Notes:** Birth year was in the original schema spec (CLAUDE.md). User overrode to birthdate for accuracy. Grade was mentioned in AUTH-04 requirement text but birthdate is more reliable during summer (avoids rising-grade ambiguity).

## Area 2: Switching between kids

**Options presented:**
1. Persistent kid selector (sticky bar below header on /challenge/* pages)
2. Per-action selector (choose kid in submission form)
3. Family dashboard with active kid toggle

**Recommendation:** Persistent kid selector -- challenge pages show age-track-specific content, so system needs to know active kid before submission time.

**User selection:** Approved as recommended.

## Area 3: Where parents land after login

**Options presented:**
1. Challenge hub (/challenge) with inline auth state handling
2. Family dashboard (/challenge/dashboard) as default landing
3. Conditional redirect (first-time -> onboarding, returning -> challenge)

**Recommendation:** Challenge hub (/challenge) as single landing page. First-time users see "add your kids" prompt inline.

**User selection:** Approved as recommended.

## Area 4: Challenge content seeding

**Options presented:**
1. Startup auto-seed (seedIfEmpty pattern matching existing codebase)
2. Standalone seed script (npm run db:seed)
3. Manual entry via admin panel

**Recommendation:** Startup auto-seed -- matches existing codebase pattern, zero manual deploy steps, idempotent.

**User selection:** Approved as recommended.

## Deferred Ideas

None.

## Claude's Discretion Items

- Form layout and field sizing
- Kid selector styling and animation
- Magic link email template wording
- Loading states and error handling
- Session cookie configuration details

---

*Discussion completed: 2026-05-28*
