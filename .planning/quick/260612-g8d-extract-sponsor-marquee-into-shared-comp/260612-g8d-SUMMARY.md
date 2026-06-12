---
phase: quick-260612-g8d
plan: 01
subsystem: marketing-site
tags: [refactor, sponsors, marquee, landing, home]
requires: []
provides:
  - "client/src/lib/sponsors.ts (single shared SPONSORS array)"
  - "client/src/components/SponsorMarquee.tsx (shared marquee component)"
affects:
  - "client/src/pages/landing/LandingPage.tsx"
  - "client/src/pages/Home.tsx"
tech_stack:
  added: []
  patterns:
    - "Shared data module + presentational component pattern for sponsor marquee"
key_files:
  created:
    - client/src/lib/sponsors.ts
    - client/src/components/SponsorMarquee.tsx
  modified:
    - client/src/pages/landing/landingContent.ts
    - client/src/pages/landing/LandingPage.tsx
    - client/src/pages/Home.tsx
  deleted:
    - client/src/components/Sponsors.tsx
decisions:
  - "SponsorMarquee accepts an optional heading prop, defaulting to the EN copy; landing pages pass the localized content.sponsors.heading"
metrics:
  duration: 3 min
  completed: 2026-06-12
---

# Phase quick-260612-g8d Plan 01: Extract Sponsor Marquee Into Shared Component Summary

Extracted the 16-logo sponsor marquee from the Meta-ads landing pages into a shared `SPONSORS` data module and a reusable `SponsorMarquee` component, wired both landing pages and the home page to it, and deleted the old 2-logo `Sponsors` component.

## What Was Built

- **`client/src/lib/sponsors.ts`** — single source of truth for the 16 sponsor logos (verbatim move from landingContent.ts: same imports, names, urls, per-logo heights, and order).
- **`client/src/components/SponsorMarquee.tsx`** — shared dark-strip infinite-scroll marquee. Accepts an optional `heading` prop (default `"Sponsored by Nipomo businesses"`). Markup, Tailwind classes, duplicate-for-loop scroll structure, aria/tabIndex logic, and the `url ? <a> : img` branch are unchanged from the original landing ribbon.
- **`landingContent.ts`** — removed the duplicate logo imports and `SPONSORS` array; localized `sponsors` copy and all other content untouched.
- **`LandingPage.tsx`** — dropped the `SPONSORS` import, added `SponsorMarquee`, replaced the inline `<section data-testid="sponsor-ribbon">` block with `<SponsorMarquee heading={content.sponsors.heading} />`. Localized heading preserved via prop.
- **`Home.tsx`** — renders `<SponsorMarquee />` (default heading) directly below `<Hero />`, removed the old `<Sponsors />` usage near the bottom.
- **`Sponsors.tsx`** — deleted via `git rm`; no remaining imports.

## Tasks Completed

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Create shared sponsors data module and SponsorMarquee component | 152d491 | client/src/lib/sponsors.ts, client/src/components/SponsorMarquee.tsx |
| 2 | Wire landing pages to shared module/component | ba2d6bd | client/src/pages/landing/landingContent.ts, client/src/pages/landing/LandingPage.tsx |
| 3 | Add marquee to home page below hero, retire old Sponsors | 683c245 | client/src/pages/Home.tsx, client/src/components/Sponsors.tsx (deleted) |

## Deviations from Plan

None functional. One note on the Task 1 verify command: its `grep -c 'name:'` returned 17 rather than 16 because the inline TypeScript type annotation `{ name: string; ... }` also matches `name:`. The array itself has exactly 16 entries (`grep -c '{ name: "'` = 16), so the data is correct. No change required.

## Verification

- `npx tsc --noEmit -p .` produced no errors touching sponsors.ts, SponsorMarquee.tsx, landingContent.ts, LandingPage.tsx, or Home.tsx.
- The 3 remaining tsc errors (`components/examples/ProgramCard.tsx`, `Volunteer.tsx`, `server/shopRoutes.ts`) are pre-existing and out of scope for this task.
- Exactly one `export const SPONSORS` in the codebase, in `client/src/lib/sponsors.ts`.
- `grep -rn 'components/Sponsors"' client/src/` returns nothing — old component fully retired.
- Challenge work-in-progress (challenge/*, hooks, shared/*, server/challengeRoutes.ts) left unstaged. Only Sponsors.tsx was deleted in the commits.

## Self-Check: PASSED

- FOUND: client/src/lib/sponsors.ts
- FOUND: client/src/components/SponsorMarquee.tsx
- FOUND: commit 152d491
- FOUND: commit ba2d6bd
- FOUND: commit 683c245
- CONFIRMED DELETED: client/src/components/Sponsors.tsx
