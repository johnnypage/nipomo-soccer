# Phase 1: Family Auth & Data Foundation - Context

**Gathered:** 2026-05-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Parents can create accounts via magic link email auth, add their children's profiles, and the system is ready to accept video submissions. All 8 weeks of challenge content are pre-loaded in the database. This phase establishes the auth system, family/kid data model, and challenge content -- but not the submission flow, leaderboard, or admin tools.

</domain>

<decisions>
## Implementation Decisions

### Signup and kid setup flow
- **D-01:** Two-step flow driven by the magic link mechanism. Step 1: parent enters email on signup page, receives magic link. Step 2: parent clicks magic link, lands authenticated, sees "add your kids" form.
- **D-02:** Collect per kid: first name, last name, and birthdate (not birth year or grade). Birthdate is used to calculate exact age for age track auto-assignment.
- **D-03:** Age track auto-assigned from birthdate: Little Kicks (4-6), Starter (7-10), Advanced (11-18). Parent sees the assigned track but doesn't choose it manually.
- **D-04:** "Add another kid" button for multi-kid families. Repeating field group, not a wizard.
- **D-05:** Privacy/consent notice displayed at signup (Step 1, before magic link is sent). Checkbox acknowledgment required.
- **D-06:** Display name auto-generated as "First L." (first name + last initial) for leaderboard privacy (COPPA compliance).

### Switching between kids
- **D-07:** Persistent kid selector pinned at top of all /challenge/* pages. Shows active kid's name and age track. Tap to switch.
- **D-08:** Single-kid families: selector auto-selects and shows as static display (name + age track, no dropdown).
- **D-09:** Active kid selection stored in React context (client-side state). Challenge content filters to the active kid's age track.

### Post-login landing
- **D-10:** Challenge hub at /challenge is the single landing page for all authenticated users. Magic link verify endpoint redirects here.
- **D-11:** First-time users (no kids added yet) see an inline "add your kids to get started" prompt on /challenge. No separate onboarding page or dashboard.
- **D-12:** Returning users see the current week's challenge content (filtered to active kid's age track).
- **D-13:** No separate family dashboard page. Kid management (add/edit) happens inline or via modal from the /challenge page.

### Challenge content seeding
- **D-14:** Startup auto-seed pattern (matches existing seedDivisionsIfEmpty / seedProductsIfEmpty in codebase). On server start, check if challenges table is empty, insert all 8 weeks of content if so.
- **D-15:** Seed data sourced from marketing/summer-skills-challenge-proposal.html. 8 weeks x 3 age tracks = 24 skill challenges + fitness bonuses per week.
- **D-16:** Seed is idempotent -- only runs on empty table. Phase 4 admin edits to challenge content will persist across restarts.

### Claude's Discretion
- Form layout and field sizing for kid-add form
- Exact kid selector component styling and animation
- Magic link email template wording (within brand voice)
- Loading states and error handling patterns
- Session cookie configuration details (duration, flags)

</decisions>

<specifics>
## Specific Ideas

- Kid selector should feel like the Netflix profile switcher -- simple, obvious, one tap
- Challenge hub (/challenge) is the one URL for all marketing: emails, social posts, word of mouth
- Birth year was considered but birthdate chosen for precise age track assignment (avoids ambiguity during summer when kids are between grades)
- No wizard or multi-page onboarding -- keep it as few fields as possible for a free community challenge

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Auth and data model
- `CLAUDE.md` §Authentication — DIY magic link spec, session config, token handling, express-session + connect-pg-simple details
- `CLAUDE.md` §Database Schema Additions — families, kids, challenges, submissions table definitions
- `.planning/REQUIREMENTS.md` §Auth & Accounts — AUTH-01 through AUTH-05 requirements
- `.planning/REQUIREMENTS.md` §Privacy & Compliance — PRIV-01 requirement (signup consent notice)

### Challenge content
- `marketing/summer-skills-challenge-proposal.html` — Complete 8-week challenge calendar with all drills per age track (seed data source)
- `.planning/REQUIREMENTS.md` §Challenge Content — CHAL-05 (pre-load 8 weeks)

### Existing codebase patterns
- `~/Projects/nipomo-soccer-website/server/auth.ts` — Existing HMAC admin auth (reference, not reuse for family auth)
- `~/Projects/nipomo-soccer-website/shared/schema.ts` — Existing Drizzle schema patterns (UUID PKs, createInsertSchema, typed exports)
- `~/Projects/nipomo-soccer-website/server/coachRoutes.ts` — seedDivisionsIfEmpty pattern (model for challenge seeding)
- `~/Projects/nipomo-soccer-website/server/shopRoutes.ts` — seedProductsIfEmpty pattern (model for challenge seeding)
- `~/Projects/nipomo-soccer-website/server/db.ts` — Database connection setup (Drizzle + pg Pool)

### Brand and design
- `club/brand-design-skill.md` — Full visual design system (colors, typography, component patterns)
- `club/website-copy.md` — Voice guide and writing style reference

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `express-session` + `connect-pg-simple`: Already in package.json, not wired up yet. Ready for session middleware.
- `@sendgrid/mail`: Already integrated across 3 route files. Use for magic link emails.
- React Hook Form + Zod resolvers: Already installed. Use for signup and kid-add forms.
- Radix UI primitives (Select, Dialog, Avatar, Tabs): Already installed. Use for kid selector, modals.
- Framer Motion: Already installed. Use for kid selector transitions.

### Established Patterns
- **Schema pattern:** Drizzle pgTable with `gen_random_uuid()` PKs, `createInsertSchema` from drizzle-zod, typed exports (InsertX, X types).
- **Auto-seed pattern:** `seedXIfEmpty()` functions in route files, called on route registration. Check if table has rows, insert seed array if empty.
- **Admin auth:** HMAC token in Bearer header, 24h expiry. Family auth will be a separate system (cookie-based sessions, not Bearer tokens).
- **Form pattern:** Single-page forms with React Hook Form, Zod validation, useMutation for submission.

### Integration Points
- `server/index.ts`: Where Express middleware (session) needs to be wired up
- `shared/schema.ts`: Where new tables (families, kids, challenges, sessions) are defined
- `client/src/App.tsx`: Where new /challenge/* routes are registered (Wouter)
- `client/src/components/Header.tsx`: Where auth state indicator / kid selector may connect

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 01-family-auth-data-foundation*
*Context gathered: 2026-05-28*
