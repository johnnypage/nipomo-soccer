---
phase: quick-260723-j8p
plan: 01
subsystem: roots-website-content
tags: [roots, divisions, copa-de-costa, content-update]
requirements: [BOARD-260723-ROOTS-3RD-GRADE-CAP, BOARD-260723-COPA-DATE]
key-files:
  modified:
    - client/src/pages/roots/DivisionSection.tsx
    - client/src/pages/roots/WhatsNewSection.tsx
    - client/src/pages/roots/FAQSection.tsx
    - client/src/pages/roots/HeroSection.tsx
    - client/src/pages/roots/RegistrationSection.tsx
    - client/src/pages/roots/RootsSubNav.tsx
    - client/src/pages/roots/Recreational.tsx
    - client/src/pages/FindMyDivision.tsx
    - client/src/pages/landing/landingContent.ts
    - client/src/App.tsx
    - client/src/pages/CopaDeCostaComingSoon.tsx
    - client/src/pages/Compare.tsx
metrics:
  tasks: 3
  files: 12
  commits: 3
---

# Phase quick-260723-j8p Plan 01: Retire ROOTS Divisions Above 3rd Grade + Copa Date Change Summary

Site-wide content update retiring every ROOTS Fall 2026 division above 3rd grade (including the 7th-12th grade 5v5 format) and moving Copa De Costa from July 25-26, 2026 to May 8-9, 2027.

## What Changed

### Task 1 -- ROOTS section components (commit 3deb421)
- **DivisionSection.tsx:** removed the 5v5 division card, League Play now "Pre-K through 3rd Grade", heading "Four programs" to "Three programs".
- **WhatsNewSection.tsx:** removed the 5v5 change tab, "Six big upgrades" to "Five", "six big shifts" to "five".
- **FAQSection.tsx:** removed the "What is the 5v5 division?" FAQ.
- **HeroSection.tsx:** ages "2 through high school" to "2 through 3rd grade"; game count 20 to 16 (headline and stats line).
- **RegistrationSection.tsx:** pricing row "Pre-K through 12th Grade" to "Pre-K through 3rd Grade".
- **RootsSubNav.tsx:** removed the 5v5 nav item.
- **Recreational.tsx:** removed the 5th-6th division, relabeled 3rd-4th to "3rd Grade" (birthYear "Born 2017-2018"), hero "Pre-K through 6th graders" to "Pre-K through 3rd graders", tournament milestone body generalized.

### Task 2 -- Calculator, landers, /5v5 route (commit 9e59d07)
- **FindMyDivision.tsx:** removed 5th-6th (U11/U12) and 7th-8th (U13/U14) divisions; relabeled 3rd-4th to "3rd Grade" (U9); too-old cutoff moved from Sep 1, 2012 to Sep 1, 2017; date input min "2017-09-01"; reference table trimmed to end at the U9/3rd Grade row.
- **landingContent.ts:** EN + ES -- hero subhead to "3rd grade" / "3er grado", removed 5v5 division cards, League Play to "Pre-K through 3rd grade" / "De Pre-K a 3er grado", tournament copy generalized to "older divisions" / "divisiones mayores". `fiveVFiveContent` export left intact (now unused but harmless, per plan).
- **App.tsx:** `/5v5` and `/roots/5v5` now redirect to `/fall`; removed the `FiveVFiveLanding` import.

### Task 3 -- Copa dates + Compare ages (commit 650c1a3)
- **CopaDeCostaComingSoon.tsx:** every event-date string updated to May 8-9, 2027 (hero badge, Day 1 "Saturday, May 8", Day 2 "Sunday, May 9", footer).
- **Compare.tsx:** ROOTS age ranges corrected from "4 to 14" / "4-14" to "Pre-K through 3rd grade" in the FAQ answer, the "What ages" FAQ, and the program card desc.

## Deviations from Plan

### Auto-added (Rule 1 -- content correctness)

**1. landingContent.ts "Four/Cuatro divisiones" subhead**
- Not called out in the plan, but removing the 5v5 card left the divisions sub-heading claiming four divisions when only three remain. Changed EN "Four divisions" to "Three divisions" and ES "Cuatro divisiones" to "Tres divisiones". Committed with Task 2.

### Instructed override -- Copa registration deadline

Per the additional instruction, the stale "Registration deadline: July 6, 2026" copy was NOT left as-is (a 2026 deadline on a 2027 event is broken content). All four deadline instances were neutralized to "Registration details coming soon" (hero, bottom CTA, footer) and the FAQ answer reworded to "Registration details are coming soon. Applications submitted through GotSport are reviewed...". The table footnote dropped the deadline clause entirely ("Registration through GotSport · Cal South affiliated teams only"). Two generic references to "the deadline" without a date (lines ~60 and ~432) were left as-is since they are not broken.

## Flag for Johnny
- **New Copa registration deadline needed.** The old July 6, 2026 deadline was removed everywhere and replaced with "Registration details coming soon." Once a real 2027 deadline is set, that placeholder copy should be updated. This is a decision for you, not something I invented a date for.

## Notes
- **Game count 20 to 16:** HeroSection previously advertised "up to 20 games per player," a figure specific to the retired 5v5 format. Changed to "up to 16 games" (headline + stats line) to match the surviving League Play divisions.
- **No Summer Skills Challenge WIP files were touched.** All uncommitted challenge work (client/src/**/challenge/**, server/challengeRoutes.ts, shared/schema.ts, shared/challengeValidation.ts, use-submissions.tsx, .planning/notes, .planning/todos, HANDOFF.md) remains uncommitted and unmodified. Files were staged individually by explicit path; no `git add -A` used.

## Verification
- `npx vite build` passes (built in ~3.3s).
- No ROOTS surface shows any division above 3rd grade; /5v5 and /roots/5v5 redirect to /fall; calculator returns "outside age range" for 4th grade and older; Copa reads May 8-9, 2027 everywhere.

## Self-Check: PASSED
- All 12 modified files present and committed across 3deb421, 9e59d07, 650c1a3.
- Build verified green.
