---
quick_id: 260615-gtf
status: complete
date: 2026-06-15
---

# Quick 260615-gtf: ROOTS hub simplification (phase 3 of main-site refresh)

Ported four approved landing-page patterns to the ROOTS pages and simplified the
hub. Locked decision (Johnny): cut WhatIs + hero quote box, 8 hub sections to 6.
Planner subagent hit repeated socket errors, so executed inline with atomic
commits and explicit-path staging (challenge edits in the working tree untouched).

## Commits

- e74ab1a -- feat: photo rotation behind ROOTS heroes
- aedad40 -- refactor: simplify hub hero, cut WhatIs section
- 25341f2 -- feat: register-first division cards
- 965ef74 -- feat: gold-dot season timeline on Recreational
- 0a43a7a -- fix: remove double hyphen from registration banner

## What changed

- **Hero photo rotation.** New reusable `client/src/pages/roots/HeroRotation.tsx`
  (crossfade landing-hero-1..9.jpg, 2.5s interval, 1500ms fade, prefers-reduced-
  motion fallback, own night overlay + bottom gradient). Applied behind the hub
  HeroSection, Recreational hero, and Parent & Me hero. FiveVFive.tsx left
  untouched -- Johnny is building a dedicated 5v5 landing page.
- **Hub simplification.** Deleted WhatIsSection.tsx and removed it from
  roots/index.tsx; removed the hero testimonial box; folded the continuity line
  ("same people who ran youth soccer here, familiar faces") into the hero subhead.
  Hub now: Hero, Divisions, PhotoBand, FamilyFeedback, CoachCTA, FAQ, FinalCTA.
- **Register-first division cards.** DivisionSection cards now lead with a direct
  Spond register button (SPOND_MAIN / SPOND_PARENT_AND_ME / SPOND_SPECIAL_NEEDS
  imported from landingContent.ts) with a secondary plain "Learn more" link.
  5v5's learn-more sits behind `FIVE_V_FIVE_LEARN_MORE` (one constant, TODO to
  repoint to the dedicated 5v5 landing page). Special Needs is register-only.
- **Recreational timeline.** "The season" prose replaced with the landing gold-dot
  timeline (horizontal 4-col desktop, vertical rail mobile), adapted to the light
  section background (gold dots, crimson date eyebrows, dark hairline). Dates are
  double-hyphen-free ("AUG 1 & 8", "AUG 10 to SEP 7", "SEP 12 to OCT 31", "NOV 7").
- **Header banner copy.** Removed the forbidden double hyphen: "registration is
  open. First 100 players save $20."

## Verification

- `npx tsc --noEmit` clean after every task (only the 3 known pre-existing errors:
  examples/ProgramCard.tsx, Volunteer.tsx, server/shopRoutes.ts).
- Browser-verified at 1280px + print: hub hero rotation + continuity line + no
  quote box; register-first cards with secondary learn-more; Recreational
  horizontal timeline (desktop) and vertical rail (mobile); Parent & Me hero
  rotation; banner copy fixed.

## Not done (out of scope / pending Johnny)

- Sticky Register CTA (handoff item) was already satisfied -- global Header has a
  persistent "Sign Up to Play" button + fixed registration banner on every page.
- FAQ sync: ROOTS FAQ is already a superset of the landing FAQ (refunds already
  answered). Two entries still need Johnny's policy answers: friend/buddy requests
  and Saturday game times.
