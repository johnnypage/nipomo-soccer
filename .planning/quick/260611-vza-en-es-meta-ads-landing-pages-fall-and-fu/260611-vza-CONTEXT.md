# Quick Task 260611-vza: EN/ES Meta Ads Landing Pages (/fall and /futbol) - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Task Boundary

Build two focused paid-traffic landing pages for the Meta Andromeda campaign (Nipomo Soccer | Fall 2026 Registration): `/fall` (English ad set) and `/futbol` (Spanish ad set). Register both as Wouter routes. Conversion goal: click through to Spond registration. The Meta pixel already fires PageView on SPA route changes and a SpondClick custom event on any outbound spond.com link (document-delegated listener in client/index.html) -- NO pixel changes needed.

</domain>

<decisions>
## Implementation Decisions (locked by user 2026-06-12)

### Language structure
- Two separate pages: `/fall` (English) and `/futbol` (fully Spanish).
- Spanish copy is hand-written natural Spanish for Mexican-American families in Nipomo, matching the tone of the Spanish ad set (neighbor talking to neighbor, proud, direct). NOT a literal translation of the English page.
- Recommended implementation: one shared layout component + per-language content objects, so design changes apply to both. Planner's call on exact structure.

### CTA strategy
- Primary CTA on both pages goes straight to the main Spond registration form (covers League Play AND 5v5):
  `https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061`
- Open in new tab (target="_blank" rel="noopener noreferrer") -- matches existing site pattern.
- Small secondary links (text links or small cards, not competing buttons) for:
  - Parent & Me (ages 2-3, $120): `https://club.spond.com/landing/signup/nipomosc/form/7F3CC0F6316343DCB8851A6A05399DAA`
  - Special Needs (all ages, $50): `https://club.spond.com/landing/signup/nipomosc/form/212CA66EC0C84B88AB2BEB08FEE18ECF`
- English CTA label: "Register Now" (or similar). Spanish CTA label: "Registrate" / "Inscribe a tu hijo" style.

### Page chrome
- Focused landing page: minimal header (NSC logo only, may link to /), NO site navigation, single repeated CTA down the page, light footer (contact admin@nipomosoccer.com + privacy link). No links out to other site pages except the two secondary Spond forms and footer privacy.
- Do NOT use the site's standard Navbar/Footer components.

### Destinations split
- These pages serve the general-audience ads. Teen-targeted 5v5 creative keeps pointing at the existing /roots/5v5 page -- do not modify it.
- The landing pages still cover the full Pre-K through 12th grade range (League Play + 5v5 brief mention), since the main Spond form covers both.

</decisions>

<specifics>
## Page Content (facts are verified -- use these, do not invent)

### Section outline (both pages, same structure)
1. **Minimal header** -- NSC logo.
2. **Hero** -- registration is open for the fall season. Saturday games right here in Nipomo. Pre-K through 12th grade. Season runs August through November. Primary CTA + urgency line: prices go up August 1 (EN) / Los precios suben el 1 de agosto (ES). Headline first thing you see -- no badge/pill above it.
3. **Value props** (cards or simple grid -- these are the exact promises in the ads):
   - Up to 16 games per season (League Play); 20+ for the 5v5 teen league
   - Trained, paid referees at every game from 1st grade up -- new this season
   - Balanced teams: every player evaluated at Kickoff Day so games stay close
   - Custom jersey, Photo Day, and a medal or trophy run to end the season
   - Every game close to home in Nipomo
4. **Pricing** -- From $150. Tiers $150 / $175 / $200 (Early Bird / Regular / Late). Prices go up after July 31. Scholarships available because every kid in Nipomo deserves a team (ES ads promise "becas disponibles" -- must appear on /futbol; include on /fall too). Parent & Me $120 flat. Special Needs $50 flat.
5. **Ages strip** -- League Play: Pre-K through 6th grade (practices weekly + Saturday games). 5v5: 7th-12th grade (no practices, just games, twice a week). Both register through the same primary form. Parent & Me and Special Needs secondary links here.
6. **How it works** -- 3 steps: Register in about two minutes on Spond -> Kickoff Day player evaluation and team formation -> Season kicks off in August, games every Saturday through early November.
7. **FAQ** -- 4-5 `<details>` items, ALL collapsed (never auto-expand the first). Suggested: When is the season? Where are games played? (answer: in Nipomo -- do NOT name specific field locations) What's included in registration? What if my kid has never played? What if I can't afford it? (scholarships)
8. **Final CTA** -- urgency restated, primary button.
9. **Light footer** -- admin@nipomosoccer.com, link to /privacy.

### Spanish page copy direction
- Hand-written, mirrors the ES ad set voice. Reference phrases from approved ads: "Ya abrio la inscripcion para la temporada de otono de Nipomo Soccer", "Partidos los sabados aqui mismo en Nipomo", "El futbol se vive en familia", "arbitros capacitados y pagados en cada partido desde 1er grado", "Equipos parejos hacen temporadas divertidas", "Hay becas disponibles porque cada nino de Nipomo merece un equipo", "Los precios suben despues del 31 de julio". (Use proper accented characters in the actual page copy.)

### Brand rules (hard constraints)
- Customer-facing brand is "Nipomo Soccer" -- the word ROOTS must NOT appear anywhere on these pages.
- NO em dashes and NO double hyphens in page copy. Restructure sentences instead.
- No hero pills/badges above headlines. No stat pill rows. No border-left/border-right accent stripes wider than 1px.
- Never position against AYSO or any competitor.
- Voice: confident, community-proud, direct. Not corporate.
- Colors: Crimson #8B2332, Gold #D4A747, Charcoal/night, Off-White. Use the existing Tailwind tokens already used in client/src/pages/roots/ (crimson, gold, night, warmwhite, slate). Headlines use the existing font-display (Integral CF) / font-heading classes.
- Mobile-first: nearly all Meta ad traffic is mobile. Design for a phone screen first.

### Code constraints
- New files under client/src/pages/ (suggested: client/src/pages/landing/ with FallLanding.tsx, FutbolLanding.tsx, shared pieces as needed).
- Register routes in client/src/App.tsx: `/fall` and `/futbol`.
- Follow existing page patterns in client/src/pages/roots/ for styling idioms, document.title handling, and scroll-to-top behavior (check how existing pages do it and match).
- Reuse existing imagery: check client/public/roots-photo-band.jpg, og-hero.jpg, and whatever client/src/pages/roots/PhotoBand.tsx imports. Do not add new binary assets.
- CRITICAL: the working tree has unrelated in-progress edits (client/src/components/challenge/*, client/src/hooks/use-submissions.tsx, deleted .planning/HANDOFF.md). Do NOT stage, commit, revert, or modify those files. Commit ONLY the new landing page files and the App.tsx route additions. Never use `git add -A` or `git add .` -- stage files by explicit path.
- Verify build passes: `npm run check` (TypeScript) and `npm run build` if feasible.

</specifics>

<canonical_refs>
## Canonical References

- Ad set strategy: ~/Projects/Nipomo Soccer/marketing/meta-ads-adset-strategy.md (campaign structure, optimization on Landing Page Views)
- English ad copy: ~/Projects/Nipomo Soccer/marketing/roots-fall-2026-meta-ads-andromeda.md
- Spanish ad copy: ~/Projects/Nipomo Soccer/marketing/roots-fall-2026-meta-ads-spanish.md
- Existing design idioms: client/src/pages/roots/ (HeroSection.tsx, DivisionSection.tsx, FAQSection.tsx, roots.css)
- Pixel/tracking: client/index.html lines 40-57 (PageView SPA tracking + SpondClick delegated listener) -- no changes needed

</canonical_refs>
