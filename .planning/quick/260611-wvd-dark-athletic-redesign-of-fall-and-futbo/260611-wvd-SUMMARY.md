---
phase: 260611-wvd-dark-athletic-redesign
plan: 01
subsystem: marketing-landing
tags: [landing, meta-ads, redesign, dark-theme, en-es]
requires: []
provides:
  - "Dark athletic /fall and /futbol landing pages with sticky header and two photo bands"
  - "Restructured LandingContent shape (valueProps objects, band1/band2, teenNote)"
  - "Two sub-600KB full-bleed photo assets in client/public"
affects:
  - client/src/pages/landing/LandingPage.tsx
  - client/src/pages/landing/landingContent.ts
tech-stack:
  added: []
  patterns:
    - "PhotoBandSection helper reuses roots PhotoBand overlay pattern (bg-cover + bg-night/70 overlay)"
    - "Dark cards: bg-white/5 + border border-warmwhite/10 rounded-xl"
key-files:
  created:
    - client/public/landing-band-gameday.jpg
    - client/public/landing-band-lights.jpg
  modified:
    - client/src/pages/landing/landingContent.ts
    - client/src/pages/landing/LandingPage.tsx
decisions:
  - "Used sips formatOptions 40 on the gameday photo to land under 600KB (70 and 55 both exceeded the cap); lights stayed at 70"
  - "Removed the 5v5 string from the section comment in LandingPage.tsx so the case-insensitive grep gate passes"
metrics:
  duration: ~10m
  completed: 2026-06-11
---

# Phase 260611-wvd Plan 01: Dark Athletic Redesign of /fall and /futbol Summary

Redesigned the shared Meta-ads landing page (EN /fall, ES /futbol) from a light/tan layout to a dark, typographic, photo-anchored athletic look with a sticky logo + crimson CTA header and two full-bleed real-photo bands.

## What Was Built

- **landingContent.ts (EN + ES):** Changed `valueProps` from `string[]` to `{ title; body }[]` (display-font titles + body copy), added `band1`/`band2` overlay objects, replaced `ages.fiveVFive`/`ages.note` with a single `ages.teenNote` line, and updated both hero subheads to read "Pre-K through 8th grade" / "desde Pre-K hasta 8vo grado". All Spanish copy uses correct accents and ñ (sábados, niños, árbitros, evalúa, reñidos, día, aquí, estén). No "5v5" string remains.
- **LandingPage.tsx:** Full dark rewrite. Root wrapper is `bg-night text-warmwhite`. Sticky header (`sticky top-0 z-50`) with logo left and compact crimson `cta-nav` CTA right (fits one row on mobile). Typographic hero (no photo, clamp up to 96px). Bold value-prop cards (`bg-white/5 border border-warmwhite/10`). Two photo bands via a `PhotoBandSection` helper using the roots PhotoBand overlay pattern. Dark pricing, demoted ages section (one League Play card + one quiet teen-note line), dark how-it-works and FAQ, second photo band before the final CTA. Section rhythm alternates `bg-night` and `bg-[#181818]`.
- **Photo assets:** Processed two source photos with `sips` to width 1800, both under 600KB in client/public.

All required data-testid attributes preserved (cta-hero, cta-final, link-parent-and-me, link-special-needs) plus the new cta-nav.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Gameday photo exceeded 600KB at the specified quality**
- **Found during:** Task 1
- **Issue:** The plan's exact command used `formatOptions 70`, which produced a 1.09MB gameday jpg (over the 600KB cap). Quality 55 still gave 805KB.
- **Fix:** Lowered `formatOptions` to 40 for the gameday photo only, producing 545KB. The lights photo stayed at 70 (497KB). The plan explicitly anticipated this ("If either exceeds 600KB, lower formatOptions ... and re-run").
- **Files modified:** client/public/landing-band-gameday.jpg
- **Commit:** 65abfef

**2. [Rule 3 - Blocking] "5v5" appeared in a section comment**
- **Found during:** Task 2
- **Issue:** The Task 3 grep gate `grep -ri "5v5" client/src/pages/landing/` is case-insensitive and recursive, so a `{/* 6. Ages (5v5 demoted) */}` comment would fail the gate.
- **Fix:** Reworded the comment to "Ages (teen league demoted to one line)".
- **Files modified:** client/src/pages/landing/LandingPage.tsx
- **Commit:** cd8d895

## Verification

- `npx tsc --noEmit -p .` shows no errors originating in the landing files.
- `npm run build` succeeds (production client + server build complete).
- `grep -ri "5v5" client/src/pages/landing/` returns nothing.
- `grep -ri "roots" client/src/pages/landing/` returns nothing.
- Both client/public/landing-band-*.jpg exist and are under 600KB (gameday 545KB, lights 497KB).
- Commits stage only landing paths; challenge WIP (challenge components/hooks, server/challengeRoutes.ts, shared/*, deleted HANDOFF.md) remains unstaged in the working tree.

## Commits

- 65abfef feat(260611-wvd): restructure landing content for dark redesign and add photo bands
- cd8d895 feat(260611-wvd): rewrite LandingPage as dark athletic layout

## Self-Check: PASSED
- FOUND: client/public/landing-band-gameday.jpg
- FOUND: client/public/landing-band-lights.jpg
- FOUND: client/src/pages/landing/landingContent.ts (modified)
- FOUND: client/src/pages/landing/LandingPage.tsx (modified)
- FOUND commit: 65abfef
- FOUND commit: cd8d895
