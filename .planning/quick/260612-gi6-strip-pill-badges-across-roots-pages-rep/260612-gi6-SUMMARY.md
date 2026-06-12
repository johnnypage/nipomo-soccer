---
phase: quick-260612-gi6
plan: 01
subsystem: roots-marketing-pages
tags: [design, ui-cleanup, roots, pills]
requires: []
provides: ["no-pill ROOTS pages matching approved landing-page design language"]
affects:
  - client/src/pages/roots/HeroSection.tsx
  - client/src/pages/roots/CoachCTASection.tsx
  - client/src/pages/roots/FAQSection.tsx
  - client/src/pages/roots/DivisionSection.tsx
  - client/src/pages/roots/FamilyFeedbackSection.tsx
  - client/src/pages/roots/PathwaySection.tsx
  - client/src/pages/roots/RegistrationSection.tsx
  - client/src/pages/roots/WhatsNewSection.tsx
  - client/src/pages/roots/WhatIsSection.tsx
  - client/src/pages/roots/ParentAndMe.tsx
  - client/src/pages/roots/Recreational.tsx
  - client/src/pages/roots/FiveVFive.tsx
tech-stack:
  added: []
  patterns: ["plain uppercase tracked eyebrow text (no rounded-full pill chrome)"]
key-files:
  created: []
  modified:
    - client/src/pages/roots/HeroSection.tsx
    - client/src/pages/roots/CoachCTASection.tsx
    - client/src/pages/roots/FAQSection.tsx
    - client/src/pages/roots/DivisionSection.tsx
    - client/src/pages/roots/FamilyFeedbackSection.tsx
    - client/src/pages/roots/PathwaySection.tsx
    - client/src/pages/roots/RegistrationSection.tsx
    - client/src/pages/roots/WhatsNewSection.tsx
    - client/src/pages/roots/WhatIsSection.tsx
    - client/src/pages/roots/ParentAndMe.tsx
    - client/src/pages/roots/Recreational.tsx
    - client/src/pages/roots/FiveVFive.tsx
decisions:
  - "Pathway card tags kept only the text-color portion of tagColor (text-crimson/text-risegreen/text-gold), dropping bg and border classes"
  - "Hero stat row rendered as a single plain <p> with &middot; separators instead of keeping a .map()"
metrics:
  duration: 8 min
  completed: 2026-06-12
---

# Phase quick-260612-gi6 Plan 01: Strip Pill Badges Across ROOTS Pages Summary

Removed all pill/chip/badge chrome from the 12 ROOTS page and section components, converting eyebrow badges, the hero stat row, and pathway card tags to plain text that matches the approved no-pill landing-page design language. No copy text changed; genuine UI circles preserved.

## What Was Done

**Pattern A (eyebrow pills, ~24 instances across 12 files):** Stripped `inline-block px-3 py-1 rounded-full border border-{gold|crimson}/NN bg-{gold|crimson}/10`, keeping `text-xs font-semibold tracking-wider uppercase text-{gold|crimson}` plus any existing trailing margin (e.g. `mb-5` on CoachCTASection). Label text unchanged.

**Pattern B (hero stat pills, HeroSection.tsx):** Replaced the bordered-chip `.map()` row with a single plain `<p className="text-warmwhite/55 text-sm font-medium mt-8 mb-10 max-w-[600px]">` using `&middot;` separators. All five stat strings preserved verbatim, `mt-8 mb-10` rhythm kept so the CTA row below stays positioned.

**Pattern C (pathway card tags, PathwaySection.tsx):** The `tagColor` values were `bg-*/10 text-* border-*/30` combos. Reduced each to its text-color portion (`text-crimson`, `text-risegreen`, `text-gold`) and stripped `inline-block px-2.5 py-0.5 rounded-full border` from the span, leaving `text-xs font-semibold tracking-wide uppercase ${p.tagColor}`. The "The Pathway" eyebrow was handled as Pattern A.

**Preserved:** The checkmark circle at FamilyFeedbackSection.tsx:156 (`w-5 h-5 rounded-full bg-risegreen/10`) is the only remaining `rounded-full` in client/src/pages/roots/ -- a genuine UI circle, left untouched.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `grep -rcn "rounded-full border border-\(gold\|crimson\)" client/src/pages/roots/` returns zero matches (PASS: no eyebrow pill chrome remains).
- Hero stat chip class (`bg-warmwhite/[0.06] border border-warmwhite/10 rounded-full`) is gone from HeroSection.tsx (PASS).
- Only remaining `rounded-full` in ROOTS: FamilyFeedbackSection.tsx:156 checkmark circle (expected, preserved).
- `npm run check` (tsc) surfaces only the three known pre-existing, out-of-scope errors (client/src/components/examples/ProgramCard.tsx, client/src/pages/Volunteer.tsx, server/shopRoutes.ts). No new errors attributable to the 12 edited ROOTS files.

## Commits

- `20179c8` style(quick-260612-gi6): strip pill chrome from ROOTS eyebrows, hero stats, and pathway tags (12 files, +30 -34)

## Checkpoint Status

Task 3 (`checkpoint:human-verify`, blocking) is PENDING. Per executor constraints, the auto work was completed and committed without blocking on visual verification. The orchestrator should surface the visual check to Johnny:

- Run `npm run dev` and open the ROOTS hub, /five-v-five, Parent & Me, and Recreational pages.
- Confirm every eyebrow reads as plain small uppercase tracked gold/crimson text with no pill background/border.
- Confirm the hero stat line renders as one plain middot-separated text row, not bordered chips.
- Confirm spacing rhythm (eyebrow -> heading) still reads cleanly.
- Confirm checkmark circles and timeline dots remain round and intact.

## Self-Check: PASSED

- FOUND: all 12 modified ROOTS files exist and were committed in 20179c8
- FOUND: commit 20179c8 in git log
