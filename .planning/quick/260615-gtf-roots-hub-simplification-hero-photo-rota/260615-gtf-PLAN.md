---
quick_id: 260615-gtf
status: in-progress
date: 2026-06-15
mode: quick (executed inline -- planner subagent hit repeated socket errors)
---

# Quick 260615-gtf: ROOTS hub simplification (phase 3 of main-site refresh)

Port approved landing-page patterns to the ROOTS pages and simplify the hub.
Locked decision: cut WhatIs + hero quote box (8 hub sections -> 6).

## Tasks (atomic commits, explicit-path staging only -- working tree carries unrelated challenge edits)

- **A. Hero photo rotation.** New reusable `client/src/pages/roots/HeroRotation.tsx` (crossfade /landing-hero-1..9.jpg, 2.5s interval, 1500ms fade, prefers-reduced-motion fallback, own night overlay + bottom gradient). Add behind hub HeroSection, Recreational hero, ParentAndMe hero. NOT FiveVFive (dedicated 5v5 landing page coming).
- **B. Cut WhatIs + hero quote.** Remove `<WhatIsSection />` from roots/index.tsx, `git rm` WhatIsSection.tsx. Fold its continuity line into HeroSection subhead. Remove HeroSection testimonial box (~L41-51).
- **C. Register-first division cards.** DivisionSection cards: primary = direct Spond register (import SPOND_MAIN / SPOND_PARENT_AND_ME / SPOND_SPECIAL_NEEDS from landingContent.ts), secondary = plain "Learn more" link. 5v5 learn-more behind a swappable `FIVE_V_FIVE_LEARN_MORE` constant with TODO. Special Needs: register only.
- **D. Timeline on Recreational "The season."** Replace 4 prose blocks with gold-dot timeline (port LandingPage.tsx L248-299). Double-hyphen-free date eyebrows.
- **E. Header banner copy fix.** Remove forbidden "--" from the registration banner string.

## Hard rules
No em dashes / double hyphens in web copy. crimson #8B2332 / gold #D4A747 / night / warmwhite. "ROOTS" stays. Don't touch FiveVFive, landing pages, sponsor marquee, challenge files. tsc clean (pre-existing errors only: examples/ProgramCard.tsx, Volunteer.tsx, server/shopRoutes.ts).
