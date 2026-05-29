# Phase 2: Core Loop - Context

**Gathered:** 2026-05-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Parents can submit challenge videos for their kids and see them climb a live leaderboard. This phase adds the `submissions` table, Cloudinary direct-upload video submission, points calculation, daily submission caps, the honor-system video bonus, and the public leaderboard page. The complete participation cycle works end to end: view challenge, upload video, earn points, see ranking.

</domain>

<decisions>
## Implementation Decisions

### Submission flow
- **D-01:** "Submit Video" buttons appear inline on both the skill challenge card and the fitness bonus card. Each button opens the Cloudinary Upload Widget as a modal overlay.
- **D-02:** After successful upload, the submit button transforms into an inline success state: green checkmark, "+1 point", and the kid's updated total. No page navigation, no confirmation modal.
- **D-03:** When the daily cap is hit (1 skill + 1 fitness per child per day), submit buttons show a disabled/grayed state with "Come back tomorrow!" message and the kid's current point total.
- **D-04:** Server enforces daily cap via the submissions table (query by kid_id + type + submitted_at date). Client reflects the state but enforcement is server-side.

### Video bonus mechanic
- **D-05:** Honor-system checkbox ("I watched the video (+1 bonus point)") appears directly below the YouTube instructional video embed on the challenge card.
- **D-06:** One video bonus per kid per week. Checkbox disabled once claimed for the current week.
- **D-07:** If a challenge week has no instructional video (videoUrl is null), the video bonus is simply not available that week. No auto-granting. Max points that week drops from 15 to 14.

### Leaderboard layout and access
- **D-08:** Leaderboard at /challenge/leaderboard is public -- no login required. It's a marketing surface (share with grandma, post on social).
- **D-09:** Use the existing mockup (marketing/summer-skills-challenge-leaderboard-mockup.html) as loose inspiration, not a pixel-exact reference. Developer has flexibility on layout.
- **D-10:** Age track filtering via Radix Tabs across the top: All | Little Kicks | Starter | Advanced. Default to "All". Client-side filtering (all data loaded at once, no separate API calls per filter).
- **D-11:** Top 3 get podium-style visual treatment (medals/icons). Rest of the list is a standard ranked list.
- **D-12:** Each row shows: rank, display name (First L.), age track, total points, NSC Player badge (if flagged). Streak/badges deferred to Phase 3.

### Week navigation and late submissions
- **D-13:** Challenge hub shows the current week prominently at top. Past weeks appear below in a collapsed/scrollable list with submission status indicators (checkmarks). Future weeks are hidden.
- **D-14:** Late submissions are allowed. Parents can submit for any past week that has already started. Points still count toward the leaderboard and raffle.
- **D-15:** Daily cap (1 skill + 1 fitness per child per day) is enforced globally, regardless of which week the submission is for.

### Claude's Discretion
- Cloudinary Upload Widget configuration details (accepted formats, max file size enforcement, mobile styling)
- Submissions table schema (columns, indexes, constraints) following existing Drizzle patterns
- Leaderboard SQL query structure (aggregation, ranking)
- Loading states, error handling, empty states
- Video embed responsive sizing
- Past-week card collapse/expand interaction pattern

</decisions>

<specifics>
## Specific Ideas

- Submission flow should feel instant and rewarding -- tap submit, widget opens, upload completes, points appear. Minimal friction.
- Leaderboard is a marketing tool -- shareable, public, visually appealing. Not just a data table.
- The daily cap messaging ("Come back tomorrow!") should feel encouraging, not restrictive.
- Past weeks showing submission status (checkmarks) gives parents a sense of progress over the summer.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Video upload and Cloudinary
- `CLAUDE.md` §Video Upload: Cloudinary Upload Widget -- Upload widget config, preset name (`nsc_challenge`), unsigned mode, format/size constraints, eager thumbnail transformation
- `CLAUDE.md` §Environment Variables -- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### Database schema
- `CLAUDE.md` §Database Schema Additions -- submissions table definition (kid_id, challenge_id, family_id, week_number, type, points, cloudinary_id, cloudinary_url, thumbnail_url, submitted_at)
- `~/Projects/nipomo-soccer-website/shared/schema.ts` -- Existing schema patterns (families, kids, challenges tables from Phase 1)

### Requirements
- `.planning/REQUIREMENTS.md` §Challenge Content -- CHAL-01 through CHAL-04
- `.planning/REQUIREMENTS.md` §Video Submission -- SUB-01 through SUB-06
- `.planning/REQUIREMENTS.md` §Points & Gamification -- PTS-01 through PTS-03
- `.planning/REQUIREMENTS.md` §Leaderboard -- LDR-01 through LDR-06
- `.planning/REQUIREMENTS.md` §Privacy & Compliance -- PRIV-02, PRIV-03

### Design reference
- `marketing/summer-skills-challenge-leaderboard-mockup.html` -- Leaderboard visual reference (use as loose inspiration)
- `marketing/summer-skills-challenge-proposal.html` -- Full 8-week challenge calendar (seed data source, video URLs)

### Existing codebase patterns
- `~/Projects/nipomo-soccer-website/server/challengeRoutes.ts` -- Phase 1 routes (auth, kids, challenges). Submission routes go here.
- `~/Projects/nipomo-soccer-website/server/challengeAuth.ts` -- requireFamily middleware for auth-protected submission endpoints
- `~/Projects/nipomo-soccer-website/client/src/pages/challenge/index.tsx` -- Challenge hub page to extend with submit buttons and week navigation
- `~/Projects/nipomo-soccer-website/client/src/hooks/use-auth.tsx` -- useAuth hook (family, kids, isAuthenticated)
- `~/Projects/nipomo-soccer-website/client/src/hooks/use-active-kid.tsx` -- ActiveKidProvider and useActiveKid hook
- `~/Projects/nipomo-soccer-website/client/src/components/challenge/KidSelector.tsx` -- Kid selector component

### Brand and design
- `club/brand-design-skill.md` -- Full visual design system (colors, typography, component patterns)

### Phase 1 context
- `.planning/phases/01-family-auth-data-foundation/01-CONTEXT.md` -- 16 locked decisions from Phase 1 (auth flow, kid profiles, display names, session handling)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Radix Tabs`: Already installed. Use for leaderboard age track filter.
- `Framer Motion`: Already installed. Use for submission success animation and leaderboard transitions.
- `TanStack Query`: Already wired up. Use for leaderboard data fetching with refetchOnWindowFocus.
- `Radix Dialog`: Already used in challenge hub (add kid modal). Available for any modal needs.
- `date-fns`: Already installed. Use for week date calculations and submission date comparisons.
- `Recharts`: Already installed, reserved for Phase 4 admin charts.
- `@sendgrid/mail`: Already configured, not needed in this phase.

### Established Patterns
- **Schema pattern:** Drizzle pgTable with `gen_random_uuid()` PKs, `createInsertSchema` from drizzle-zod, typed exports (InsertX, X types).
- **Route pattern:** Express routes in dedicated `*Routes.ts` files registered via `register*Routes(app)` in server/index.ts.
- **Auth middleware:** `requireFamily` middleware in challengeAuth.ts -- uses `req.session.familyId`. Returns 401 if not authenticated.
- **Validation:** Zod schemas in `shared/challengeValidation.ts`, separate from Drizzle insert schemas.
- **Client queries:** TanStack Query with `getQueryFn({ on401: "returnNull" })` pattern for auth-optional endpoints.

### Integration Points
- `shared/schema.ts`: Add `submissions` table + `videoBonuses` table (or column on submissions)
- `server/challengeRoutes.ts`: Add submission POST endpoint, daily-cap check, video bonus endpoint, leaderboard GET endpoint
- `client/src/pages/challenge/index.tsx`: Extend with submit buttons, video embeds, week navigation, past weeks
- `client/src/App.tsx`: Add /challenge/leaderboard route
- `shared/challengeValidation.ts`: Add submission validation schemas

</code_context>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 02-core-loop*
*Context gathered: 2026-05-29*
