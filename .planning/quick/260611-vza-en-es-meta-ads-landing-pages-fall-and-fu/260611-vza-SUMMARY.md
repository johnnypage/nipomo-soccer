---
phase: quick-260611-vza
plan: 01
subsystem: marketing-landing
tags: [landing-page, meta-ads, i18n, conversion, spond]
requires: []
provides:
  - "/fall English Meta-ads conversion landing page"
  - "/futbol Spanish Meta-ads conversion landing page"
  - "Shared LandingPage layout driven by per-language content objects"
affects:
  - client/src/App.tsx
tech-stack:
  added: []
  patterns:
    - "Per-language content objects feeding one shared layout component"
    - "Focused landing page with no site Navbar/Footer chrome"
key-files:
  created:
    - client/src/pages/landing/landingContent.ts
    - client/src/pages/landing/LandingPage.tsx
    - client/src/pages/landing/FallLanding.tsx
    - client/src/pages/landing/FutbolLanding.tsx
  modified:
    - client/src/App.tsx
    - client/index.html
decisions:
  - "Moved Meta pixel noscript fallback from head to body to unblock the production build"
metrics:
  duration: ~15m
  completed: 2026-06-11
  tasks: 3
  files: 6
---

# Quick Task 260611-vza: EN/ES Meta Ads Landing Pages Summary

Two focused, mobile-first Meta-ads conversion landing pages (`/fall` English, `/futbol` natural Spanish) built on one shared `LandingPage` layout fed by per-language content objects, each driving primary clicks to the main Spond Fall 2026 registration form in a new tab.

## What Was Built

- **landingContent.ts** -- A typed `LandingContent` interface plus `enContent` and `esContent` objects, and the three exported Spond form URL constants (`SPOND_MAIN`, `SPOND_PARENT_AND_ME`, `SPOND_SPECIAL_NEEDS`). English uses the verified Fall 2026 ad facts; Spanish is hand-written neighbor-to-neighbor copy with proper accents (anchored on the approved phrases including "becas disponibles").
- **LandingPage.tsx** -- A single mobile-first layout taking a `LandingContent` prop and rendering all nine sections (minimal NSC-logo header, hero, value props, pricing, ages strip with secondary links, how it works, collapsed FAQ, final CTA, light footer). No site Header/Navbar/Footer. Primary CTA appears twice (hero + final), both opening `SPOND_MAIN` in a new tab. Secondary text links cover Parent and Me ($120) and Special Needs ($50). Sets `document.title` and scrolls to top on mount.
- **FallLanding.tsx / FutbolLanding.tsx** -- Thin route components wiring `enContent` / `esContent` into `LandingPage`.
- **App.tsx** -- Two flat Wouter routes (`/fall`, `/futbol`) registered before the catch-all `NotFound`, with matching imports.

## Brand Compliance

- The internal program name appears nowhere on either page (verified by grep across both source files).
- No em dashes and no double hyphens in any copy string (verified by grep).
- No hero pill/badge above the headline, no stat pill row, no border accent stripes wider than 1px.
- FAQ items all collapsed by default (`open={false}`); the first is never auto-opened.
- Only existing Tailwind brand tokens used (crimson, gold, night, warmwhite, slate, paper). No new CSS file, no new binary assets, no new npm packages added to the project.
- No specific field locations named; no competitor positioning.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Moved Meta pixel noscript fallback out of `<head>`**
- **Found during:** Task 3 (npm run build verification)
- **Issue:** `npm run build` failed in the `vite:build-html` (parse5) step with `disallowed-content-in-noscript-in-head` at `client/index.html:55`. The Meta pixel `<noscript><img></noscript>` block lived inside `<head>`, which parse5 rejects. Confirmed pre-existing by stashing the landing files and reproducing the identical failure at the base commit. Not caused by this task.
- **Fix:** Moved the `<noscript>` pixel fallback from the end of `<head>` to the top of `<body>` (where Meta's own install snippet places it). The PageView pixel still fires; behavior is unchanged for users.
- **Files modified:** client/index.html
- **Commit:** 0d582aa

**2. [Rule 3 - Blocking] Installed missing already-declared `jsonwebtoken` dependency**
- **Found during:** Task 3 (npm run build, server bundle step)
- **Issue:** After the HTML fix, the esbuild server bundle failed with `Could not resolve "jsonwebtoken"` from `server/oauthRoutes.ts:6`. `jsonwebtoken` and `@types/jsonwebtoken` are already declared in `package.json` but were missing from `node_modules` (stale install state). `server/oauthRoutes.ts` is a pre-existing committed file unrelated to this task.
- **Fix:** Ran `npm install jsonwebtoken@^9.0.3` to sync `node_modules` with the existing `package.json` declaration. No tracked files changed (`package.json` and `package-lock.json` already had it).
- **Files modified:** none tracked (node_modules only)
- **Commit:** n/a (no source change)

## Deferred Issues

- The repository has pre-existing TypeScript errors in `server/oauthRoutes.ts` (implicit any) and `server/shopRoutes.ts` (`Set<string>` downlevel iteration) surfaced by `npm run check`. These are in server files outside this task's scope and originate from prior commits and unrelated in-progress edits. None are in the four new landing files or the App.tsx edit (verified: `npm run check` reports no errors for `landing/` or `App.tsx`). Not fixed per scope boundary.

## Verification

- `npm run check`: no errors in any of the new landing files or the App.tsx edit (pre-existing server errors remain out of scope).
- `npm run build`: succeeds end to end (client `✓ built`, server bundle `⚡ Done`).
- Routes `/fall` and `/futbol` registered in App.tsx pointing at the new components; FallLanding renders `enContent`, FutbolLanding renders `esContent`.
- `becas disponibles` present in the Spanish content; `534965DA898B4B7E9CC0A589047F6061` (main Spond form) present in both content and layout.
- Unrelated in-progress working-tree edits (challenge components, use-submissions, schema, deleted HANDOFF.md) left untouched and unstaged. No file deletions introduced by any task commit.

## Commits

- 40385a5: feat(260611-vza): add EN/ES landing page content objects
- 05de676: feat(260611-vza): add shared mobile-first LandingPage layout
- 0d582aa: feat(260611-vza): wire /fall and /futbol routes, fix index.html build blocker

## Self-Check: PASSED

All four created files exist on disk and all three task commits (40385a5, 05de676, 0d582aa) are present in git history.
