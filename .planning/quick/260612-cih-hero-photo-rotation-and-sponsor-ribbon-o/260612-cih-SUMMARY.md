---
phase: 260612-cih
plan: 01
subsystem: landing-pages
tags: [hero, sponsors, marketing, conversion, i18n]
requires:
  - client/public/landing-hero-{1,2,3}.jpg (committed at base)
  - attached_assets/ nine sponsor logo files (committed at base)
provides:
  - "sponsors copy field on LandingContent (EN + ES)"
  - "shared SPONSORS array in landingContent.ts"
  - "HeroRotation crossfade background in LandingPage.tsx"
  - "SponsorRibbon section (data-testid=sponsor-ribbon)"
affects:
  - /fall (EN landing)
  - /futbol (ES landing)
tech-stack:
  added: []
  patterns:
    - "@assets alias import for logo files (matches Sponsors.tsx)"
    - "stacked absolutely-positioned bg-cover divs with opacity crossfade"
    - "prefers-reduced-motion guard via window.matchMedia in useEffect"
key-files:
  created: []
  modified:
    - client/src/pages/landing/landingContent.ts
    - client/src/pages/landing/LandingPage.tsx
decisions:
  - "No carousel library; ambient background only, no dots/arrows/controls"
  - "SPONSORS is a single shared array (not per-language) so a tenth sponsor is one line"
  - "dark:true black tiles only for Cafe DeVille, Coast Water, Shuck Ups"
metrics:
  duration: ~7m
  completed: 2026-06-12
  tasks: 2
  files: 2
---

# Phase 260612-cih Plan 01: Hero Photo Rotation + Sponsor Ribbon Summary

Added a slow crossfading three-photo hero background and a light nine-logo sponsor ribbon to the shared /fall (EN) and /futbol (ES) landing layout, making the page feel unmistakably local without changing any existing hero copy or testids.

## What Was Built

**Task 1 - landingContent.ts (commit eebf026)**
- Added nine sponsor asset imports via the `@assets` alias.
- Added `sponsors: { heading: string; sub: string }` to the `LandingContent` interface (after `band2`).
- Supplied hand-written EN and ES sponsor copy in both content objects (proper Spanish accents, no em/double dashes). The interface field forces both objects to provide it, so a missing one is a TypeScript error.
- Exported a single shared `SPONSORS` array (nine entries) with `dark: true` on exactly Cafe DeVille, Coast Water Solutions, and The Shuck Ups; `url` only on JG Contracting.

**Task 2 - LandingPage.tsx (commit 06b1554)**
- Imported `SPONSORS`; added `useState`; defined module-level `HERO_IMAGES` (hero-1 first).
- New `HeroRotation` component: all three `bg-cover bg-center` divs render from mount with `transition-opacity duration-[1500ms]`; active index in state advances every 5000ms via `setInterval`. A `prefers-reduced-motion: reduce` check via `window.matchMedia` skips the interval so hero-1 stays static. Legibility handled by a `bg-night/65` full-cover overlay plus a `bg-gradient-to-t from-night via-night/40 to-transparent` bottom gradient.
- Hero section is now `relative overflow-hidden bg-night` with content wrapped in `relative z-10`. All original hero children and `data-testid="cta-hero"` are unchanged.
- New `data-testid="sponsor-ribbon"` light section (`bg-warmwhite`) inserted between Photo band 1 and Pricing: font-display uppercase heading + small sub from `content.sponsors`, then a `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` grid of nine uniform tiles. Default tiles are `bg-white border border-black/8`; `dark` tiles are `bg-black` with a slightly larger logo cap. Logos are full color (no grayscale); `url` logos wrap in a `target=_blank rel=noopener noreferrer` anchor.

## Verification

- `npm run build` passes (TypeScript + Vite + server bundle).
- `npx tsc --noEmit` shows no errors referencing landingContent.ts.
- Grep gates on `client/src/pages/landing/`: no `5v5`, no internal program name (ROOTS/RISE/REIGN).
- Only the two intended landing files changed; no file deletions in the task commits.
- Language correctness: EN content carries "Backed by Nipomo businesses"; ES carries "Con el respaldo de negocios de Nipomo". Both pages render the same shared SPONSORS logos. Hero crossfade is driven by a 5s interval with a reduced-motion fallback (described, not browser-verified in this run).

## Deviations from Plan

None - plan executed exactly as written.

## Git Hygiene

Staged only `client/src/pages/landing/landingContent.ts` and `client/src/pages/landing/LandingPage.tsx` by explicit path. The unrelated in-progress challenge edits and deleted .planning/HANDOFF.md were never staged, committed, or reverted.

## Commits

- eebf026: feat(260612-cih): add sponsors copy field and shared SPONSORS array
- 06b1554: feat(260612-cih): hero photo rotation + sponsor ribbon on landing pages

## Self-Check: PASSED

- FOUND: client/src/pages/landing/landingContent.ts
- FOUND: client/src/pages/landing/LandingPage.tsx
- FOUND commit: eebf026
- FOUND commit: 06b1554
