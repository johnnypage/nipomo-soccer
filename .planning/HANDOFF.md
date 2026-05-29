# Context Handoff

**Date:** 2026-05-29
**Branch:** `roots-page-redesign` (in website repo at ~/Projects/nipomo-soccer-website)
**Previous session goal:** Apply Johnny's design feedback to ROOTS hub page + impeccable polish pass on sub-pages

## Status

### Completed (This Session)

**Hub page (index.tsx):**
- Removed "ROOTS Fall 2026" hero pill (low contrast, redundant with announcement banner)
- Removed What's New section entirely (too heavy, especially on mobile, content covered elsewhere)
- Removed Registration section (duplicative of division card pricing)
- Restructured division cards: 2x2 grid, program name as heading with ages underneath
- Renamed "Recreational" to "League Play" (can't call it recreational when everything is recreational)
- Special Needs is now equal 4th card, not an afterthought below the other three
- Flipped Family Feedback: "Built from family feedback" is now the header, "What 142 families told us" is the pill
- FAQ: all questions collapsed by default (no auto-expand)
- Removed border-left accent stripes from hero quote and family feedback quotes (impeccable BAN 1)
- Added hover effects to division cards (shadow + translate-y)

**5v5 page (FiveVFive.tsx):**
- Removed hero pill
- Removed stat pills from hero (7th-12th Grade, 20+ games, etc.)
- Fixed copy: "Two nights a week" → "Twice a week" everywhere
- Fixed copy: removed "Nipomo High School" references → "the field" (can't guarantee location)
- Fixed copy: "plus a goalkeeper" → "including a goalkeeper" (5v5 = 5 per side INCLUDING keeper)
- Fixed copy: "on a given night" → "on a given day"
- Fixed timeline overrun: "5:35 to 7:10" → just "5:35" with fixed-width time column
- Redesigned "Four reasons" section: editorial numbered layout (01-04) on dark background instead of identical white cards
- Removed "How it works" specs grid section (redundant, already explained above)
- Removed "Teams and balancing" section (team name picking was unnecessary content)
- Expanded season overview with real dates from programs/roots/season-schedule.md (Kickoff Aug 1 & 8, Pre-Season through Sep 7, Regular Season Sep 12-Oct 31, Tournament Nov 7)
- FAQ moved to light background for section rhythm variety
- Added hover effects to "Why" cards

**Parent & Me page (ParentAndMe.tsx):**
- Removed hero pill
- FAQ collapsed by default
- Fixed season details grid: added 6th item (Age range), switched to 3-col on large screens

**Recreational page (Recreational.tsx):**
- Removed hero pill

**Cross-cutting (roots.css):**
- Added staggered hero entrance animation (roots-fade-up) with prefers-reduced-motion support
- Increased hero top padding from 112px → 148px (164px mobile) across all ROOTS pages

### Not Done (Next Session)

**Parent & Me page:**
- Full copy/design review (same level of scrutiny as 5v5 got this session)
- May need similar content trimming

**Recreational page:**
- Full copy/design review
- Hero still says "ROOTS Recreational" in concept (pill is gone but page identity needs check)
- Division explorer tabs may need refinement

**Hub page remaining:**
- Hero background image/video needed (currently dark with gradient only -- too plain)
- Johnny needs to provide a game day photo or we wire up a placeholder
- `FindMyDivision.tsx` needs update for 5v5/7th-12th (still shows old "7th-8th")
- `coach/DashboardSection.tsx` and `coach/ApplyModal.tsx` reference old "7th-8th"

**Open questions:**
- Should `/roots/5v5` appear in header Programs dropdown?
- Does 5v5 need its own Spond registration form?
- Hero background image -- does Johnny have a game day photo?

## Key Decisions

- "League Play" is the name for Pre-K through 6th Grade division (not "Recreational")
- 5v5 format: 5 per side INCLUDING goalkeeper (not plus)
- Don't reference specific locations (Nipomo High School) that can't be guaranteed
- Use "days" not "nights" for 5v5 sessions (could be weekday or Saturday)
- Hero pills are out -- announcement banner covers season context
- Stat pills removed from 5v5 hero -- keep hero clean (headline + lede + CTA)
- All FAQ sections start fully collapsed
- Border-left accent stripes are banned per impeccable design rules

## Git State

- **Branch:** `roots-page-redesign` in ~/Projects/nipomo-soccer-website
- **Uncommitted changes:** All edits from this session (not committed, user hasn't asked)
- **Build:** Passes clean (pre-existing TS errors only)
- **Dev server:** Was running on port 3333

## Files Changed This Session

### Hub page
- `client/src/pages/roots/index.tsx` -- removed WhatsNew + Registration imports/components
- `client/src/pages/roots/HeroSection.tsx` -- removed pill, removed border-left on quote
- `client/src/pages/roots/DivisionSection.tsx` -- 2x2 grid, name-first, "League Play", hover effects
- `client/src/pages/roots/FamilyFeedbackSection.tsx` -- flipped pill/header, removed border-left on quotes
- `client/src/pages/roots/FAQSection.tsx` -- collapsed by default

### Sub-pages
- `client/src/pages/roots/FiveVFive.tsx` -- major rewrite (copy, sections removed, design changes)
- `client/src/pages/roots/ParentAndMe.tsx` -- pill removed, FAQ collapsed, grid fixed
- `client/src/pages/roots/Recreational.tsx` -- pill removed

### CSS
- `client/src/pages/roots/roots.css` -- hero entrance animation, increased hero padding

## Next Window Instructions

**Focus:** Design review of Parent & Me and Recreational sub-pages, then hub hero background image

**Steps:**
1. `cd ~/Projects/nipomo-soccer-website && git checkout roots-page-redesign`
2. Start dev server: `npx vite --port 3333`
3. Review Parent & Me (`/roots/parent-and-me`) -- apply same copy/design scrutiny as 5v5
4. Review Recreational (`/roots/recreational`) -- same treatment
5. Address hero background image on hub page
6. Commit all changes to `roots-page-redesign` branch

**Watch out for:**
- Website repo: `~/Projects/nipomo-soccer-website/` (NOT the planning repo)
- Don't touch `client/src/pages/challenge/` -- Johnny is working on that in Replit
- No gradients, no em dashes, no border-left accents (brand + impeccable rules)
- Pre-existing TS errors in ProgramCard, Volunteer, shopRoutes -- ignore
- 5v5 is 5 per side INCLUDING the goalkeeper
- Use "days" not "nights" for 5v5 sessions
- Don't guarantee specific field locations
