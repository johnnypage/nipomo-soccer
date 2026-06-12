# Quick Task 260611-wvd: Dark Athletic Redesign of /fall and /futbol - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Task Boundary

Redesign the existing Meta ads landing pages (client/src/pages/landing/: LandingPage.tsx, landingContent.ts, FallLanding.tsx, FutbolLanding.tsx) from the current light/tan styling to a dark, bold, athletic look that matches the club's ad creative. Add two real photos as full-bleed bands. Remove 5v5 prominence. Both languages share the layout, so all visual changes apply to both pages automatically.

User feedback driving this (decisions LOCKED):
1. The current tan background and plain styling feel flat. Ads/flyers have a Nike/bold/athletic feel; the page should match.
2. NO photo in the hero. Hero stays typographic. Real photos go lower on the page as full-bleed bands.
3. The logo and CTA must be sticky in the navigation (always visible while scrolling).
4. 5v5 mentions are too prominent. Trim to one quiet line.

</domain>

<decisions>
## Design Spec (locked)

### Overall palette
- Entire page goes dark: base background is the `night` token. Remove all `bg-warmwhite` / `bg-paper` sections.
- Text: `warmwhite` (and /70, /55 tints). Accents: `gold` for urgency/eyebrows, `crimson` for CTAs and emphasis.
- Cards on dark: `bg-white/5` with `border border-warmwhite/10`, rounded-xl. NO border-left accent stripes. No pills above the hero headline.
- Section rhythm: alternate plain night sections with the two photo bands so the page does not feel like one flat dark slab. Subtle variation allowed (e.g. `bg-[#181818]` vs night) if helpful.

### Sticky header
- `sticky top-0 z-50 bg-night` with `border-b border-warmwhite/10` (1px is fine, that rule only bans thick left/right accent stripes).
- Logo left (existing `@assets/NSC_1764979848772.png`, ~h-10), compact crimson CTA button right (content.ctaLabel, links to SPOND_MAIN, same target=_blank pattern, data-testid="cta-nav").
- On small screens both must fit on one row; shrink CTA padding/text as needed.

### Hero (typographic, no photo)
- bg-night, generous vertical padding (py-20 md:py-28), left-aligned or centered (designer's call, but BIG).
- Headline in font-display uppercase, clamp up to ~96px desktop, tight leading like the current version.
- Gold urgency line, subhead in warmwhite/75, large crimson CTA button.
- Subhead changes to say "Pre-K through 8th grade" (EN) / "desde Pre-K hasta 8vo grado" (ES) to match the ad copy exactly. (The teen note elsewhere covers older kids.)

### Value props (restyle bolder)
- Change content shape from `valueProps: string[]` to `valueProps: { title: string; body: string }[]` with display-font uppercase titles. EN set:
  - UP TO 16 GAMES / "A real season that runs August through November."
  - PAID REFEREES / "Trained and paid referees at every game from 1st grade up. New this season."
  - BALANCED TEAMS / "Every player evaluated at Kickoff Day so games stay close all season."
  - THE FULL KIT / "Custom jersey, Photo Day, and a medal or trophy to close out the season."
  - CLOSE TO HOME / "Every game right here in Nipomo."
- ES set (hand-written, natural, accented):
  - HASTA 16 PARTIDOS / "Una temporada de verdad, de agosto a noviembre."
  - ARBITROS PAGADOS / "Arbitros capacitados y pagados en cada partido desde 1er grado. Nuevo esta temporada." (use proper accents: Árbitros, árbitros)
  - EQUIPOS PAREJOS / "Cada jugador se evalua en el Kickoff Day para que los partidos esten renidos toda la temporada." (use proper accents: evalúa, estén, reñidos)
  - EQUIPO COMPLETO / "Jersey personalizado, dia de fotos y una medalla o trofeo para cerrar la temporada." (día)
  - CERCA DE CASA / "Cada partido aqui mismo en Nipomo." (aquí)
- NOTE the 5v5 "20+ games" clause is REMOVED from value props.

### Photo band 1 (after value props): game day
- New asset: client/public/landing-band-gameday.jpg
- Full-bleed background image section with `bg-night/70`-ish overlay (match the existing PhotoBand.tsx pattern in client/src/pages/roots/PhotoBand.tsx: bg-scroll md:bg-fixed bg-cover bg-center, absolute overlay, relative z-10 content).
- Band copy, display font uppercase: EN "Saturdays belong to the kids" + sub "Real teams, real referees, and a sideline full of families every week." ES "Los sabados son de los ninos" (Los sábados son de los niños) + sub "Equipos de verdad, arbitros de verdad y una banda llena de familias cada semana." (árbitros)
- Content shape: add `band1: { line: string; sub: string }` and `band2: { line: string; sub: string }` to LandingContent.

### Photo band 2 (directly before final CTA): night game under lights
- New asset: client/public/landing-band-lights.jpg
- Same treatment. EN "This is a real season" + sub "From the first whistle in August to medals and trophies in November." ES "Esto es una temporada de verdad" + sub "Desde el primer silbatazo en agosto hasta las medallas y trofeos en noviembre."

### Photo asset processing (exact commands, run from repo root)
```
sips -s format jpeg -s formatOptions 70 --resampleWidth 1800 "/Users/johnnypage/Projects/Nipomo Soccer/marketing/ad-images/source-photos/B0BE001A-5C91-4196-BE1F-6C77CCEDDCD3.jpeg" --out client/public/landing-band-gameday.jpg
sips -s format jpeg -s formatOptions 70 --resampleWidth 1800 "/Users/johnnypage/Projects/Nipomo Soccer/marketing/ad-images/source-photos/IMG_8044.jpeg" --out client/public/landing-band-lights.jpg
```
Both sources are 4032x3024 upright (no EXIF orientation). After processing, verify each output is under 600KB (`ls -la client/public/landing-band-*.jpg`).

### Pricing section (dark, bolder)
- font-display gold "From $150" / "Desde $150" huge (keep clamp). Tiers line warmwhite. Urgency line crimson -> use gold or crimson, designer's call, but it must pop.
- Scholarships line stays. Parent and Me / Special Needs become dark cards (bg-white/5).

### Ages section (5v5 demoted)
- ONE card: League Play, Pre-K through 6th grade, weekly practices plus Saturday games.
- Below it one quiet sentence (not a card): EN "Players in 7th grade and up have their own fast paced teen league that plays twice a week. Register through the same form." ES "Los jugadores de 7mo grado en adelante tienen su propia liga juvenil que juega dos veces por semana. Se inscriben con el mismo formulario."
- The literal string "5v5" should no longer appear anywhere on either page.
- Secondary links (Parent and Me, Special Needs Spond forms) stay, restyled for dark (gold or warmwhite links with hover).
- Content shape: replace `ages.fiveVFive` with `ages.teenNote`; update `ages.note` usage accordingly (the "same form" sentence can merge into teenNote, drop the separate note if redundant).

### How it works + FAQ + final CTA + footer
- Same content, restyled dark: cards bg-white/5, FAQ details on dark (keep all collapsed, keep chevron pattern), summary text warmwhite.
- Final CTA section sits right after photo band 2: big display heading, gold urgency, crimson CTA. Footer unchanged structurally (already dark) but ensure border-t still reads.

### Hard rules (unchanged from v1)
- Brand is "Nipomo Soccer"; the internal program name must never appear in page copy.
- No em dashes, no double hyphens in copy. No hero pills. No stat pill rows in the hero. No thick border-left/right accents.
- Spanish is hand-written natural Spanish with proper accents and ene characters in the actual code (the spec above strips some accents; the implementation must use correct Spanish: sábados, niños, árbitros, evalúa, reñidos, día, aquí, estén).
- Mobile-first: check type scale and band heights at 390px width mentally; bands min height ~300px mobile.
- data-testid attributes preserved (cta-hero, cta-final, link-parent-and-me, link-special-needs) plus new cta-nav.

</decisions>

<specifics>
## Code constraints

- Files to touch: client/src/pages/landing/LandingPage.tsx, client/src/pages/landing/landingContent.ts, plus the two new jpg assets in client/public/. FallLanding.tsx/FutbolLanding.tsx should not need changes.
- CRITICAL: working tree has unrelated in-progress edits (client/src/components/challenge/*, client/src/hooks/use-submissions.tsx, server/challengeRoutes.ts, shared/*, deleted .planning/HANDOFF.md, untracked challenge components). Never stage/commit/revert those. Stage ONLY by explicit path: the two landing source files and the two new public jpgs. Never `git add -A` or `git add .`.
- Verify: `npx tsc --noEmit -p .` shows no errors in landing files (pre-existing server errors are out of scope), and `npm run build` succeeds.
- Grep gates before commit: `grep -ri "5v5" client/src/pages/landing/` returns nothing; `grep -ri "roots" client/src/pages/landing/` returns nothing in copy strings (comments referring to file paths are fine).

</specifics>

<canonical_refs>
## Canonical References

- Existing pages: client/src/pages/landing/ (current implementation to restyle)
- Band overlay pattern: client/src/pages/roots/PhotoBand.tsx
- Aesthetic target: the Meta ad creative (dark, golden-hour, big condensed type) and prior CONTEXT at .planning/quick/260611-vza-en-es-meta-ads-landing-pages-fall-and-fu/260611-vza-CONTEXT.md

</canonical_refs>
