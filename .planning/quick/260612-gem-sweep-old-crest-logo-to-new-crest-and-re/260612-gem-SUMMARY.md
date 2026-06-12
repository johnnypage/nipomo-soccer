---
status: complete
quick_id: 260612-gem
date: 2026-06-12
---

# Quick Task 260612-gem: Logo + "real X" copy sweep

Scoped from `.planning/HANDOFF-main-site-refresh.md` audit findings. Executed inline (fast path) because the scope collapsed to a single line after investigation.

## Findings

- **Old crest sweep: already clean.** No file in `client/src` references `NSC_1764979848772.png` or any old club crest asset. Remaining `NSC_Roots_/NSC_Rise_/NSC_Reign_` imports are program logos, not the club crest -- out of scope. Header, Footer, and LandingPage all use the current crest `NipomoSoccer_1780982227404.png`.
- **"Real X" copy: one occurrence.** `client/src/pages/roots/PhotoBand.tsx:16` said "Real families, real coaches, and a whole community that shows up every Saturday."
- `Recreational.tsx:245` ("just like real games" describing scrimmages) is descriptive usage, not the marketing construction Johnny killed. Left unchanged.

## Change

- `PhotoBand.tsx` sub line now reads: "Families, coaches, and a whole community that shows up every Saturday."

## Commit

- fix(quick-260612-gem): drop "Real X" construction from ROOTS photo band copy
