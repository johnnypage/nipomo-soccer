# Quick Task 260612-cih: Hero Photo Rotation + Sponsor Ribbon on Landing Pages - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Task Boundary

Two additions to the existing dark athletic landing pages (client/src/pages/landing/), shared by /fall (EN) and /futbol (ES):

1. **Hero photo rotation:** Replace the flat bg-night hero background with a slow crossfading rotation of three real photos. The typographic content (headline, subhead, urgency, CTA) stays exactly as is, layered above the photos with a dark overlay for legibility.
2. **Sponsor ribbon:** A light-background strip in the middle of the page showing the club's three local sponsor logos, to build local credibility and familiarity.

User goals driving this (from Johnny): the page must feel unmistakably local, established, and familiar so Nipomo parents register without second-guessing. Real photos at our fields plus recognizable local business logos do that work.

</domain>

<decisions>
## Implementation Decisions (locked)

### Hero photo rotation
- Assets already committed and orientation-verified (commit 5d0cd46): `/landing-hero-1.jpg` (girls team huddle, crowd and Nipomo hills), `/landing-hero-2.jpg` (team lineup in golden light), `/landing-hero-3.jpg` (kids under a rainbow sky). All ~1350x1800 portrait, ~500-650KB.
- Order: hero-1 first (strongest: crowd + hills + coach huddle), then hero-2, then hero-3.
- Mechanics: stacked absolutely-positioned background divs (`bg-cover bg-center`), opacity crossfade with `transition-opacity duration-[1500ms]`, advance every 5 seconds via setInterval in a useEffect (clean up on unmount). React state holds active index.
- Respect `prefers-reduced-motion: reduce` (check via window.matchMedia in the effect): if reduced, show hero-1 statically with no interval.
- Overlay for type legibility: full-cover `bg-night/65` PLUS a bottom gradient (`bg-gradient-to-t from-night via-night/40 to-transparent` or similar) so the section blends into the value-props section below. Test mentally against warmwhite text: headline must stay readable over the busiest photo (hero-1 has a bright sky top half -- the overlay must handle it).
- Hero section gets `relative overflow-hidden`; content wrapper `relative z-10`. Keep current paddings (py-20 md:py-28); optionally min-h for presence on mobile, designer's call, but do not exceed ~90svh.
- The first image should not flash-in late: all three divs render from mount (browser loads them eagerly); hero-1 is the bottom layer always visible.
- No external carousel library. No dots/arrows/controls -- it is ambient background, not a carousel.

### Sponsor ribbon
- New section between photo band 1 (gameday) and the Pricing section.
- Light strip to contrast the dark page: `bg-warmwhite`, generous py (~py-12/14).
- Content per language (add to LandingContent interface as `sponsors: { heading: string; sub: string }`):
  - EN heading: "Backed by Nipomo businesses" / sub: "Local sponsors help keep the season affordable for every family."
  - ES heading: "Con el respaldo de negocios de Nipomo" / sub: "Los patrocinadores locales ayudan a que la temporada sea accesible para cada familia."
- Heading in font-display uppercase text-night (text-xl md:text-2xl, modest -- the logos are the point); sub small text-night/60.
- NINE sponsor logos in a centered responsive grid of uniform tiles (grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 or similar, gap-4). Each tile: rounded-lg, fixed height (~h-24 md:h-28), flex items-center justify-center, px-4, logo as img with max-h-16 md:max-h-20 w-auto object-contain. Full color, NO grayscale -- recognition is the goal.
- Tile background per logo: default `bg-white border border-black/8`. Logos whose artwork has a black background get `bg-black` tiles (seamless dark tile) with the img max-h slightly larger since the art includes its own padding.
- Sponsor data lives in a shared array in landingContent.ts (NOT per-language; same logos both pages) with shape `{ name, src (imported asset), url?: string, dark?: boolean }`:
  | Sponsor | Asset import | dark tile | url |
  |---|---|---|---|
  | Herrera Farming Company | `@assets/Herrera_1765222077181.png` | no | -- |
  | JG Contracting | `@assets/JG_Contracting_1765222077181.png` | no | https://jgcontracting.biz/ |
  | Head Liners Barber Shop | `@assets/headliners-barbershop.jpg` | no (white bg jpg) | -- |
  | Cafe DeVille | `@assets/sponsor-cafe-deville.jpg` | YES (black art bg) | -- |
  | Coast Water Solutions | `@assets/sponsor-coast-water.jpg` | YES (black art bg) | -- |
  | LVL Salon | `@assets/sponsor-lvl-salon.png` | no | -- |
  | Superior Fire Sprinkler | `@assets/sponsor-superior-fire.jpg` | no | -- |
  | Taylor Rea Photography | `@assets/sponsor-taylor-rea.png` | no (mustard square, fine on white) | -- |
  | The Shuck Ups Cornhole Club | `@assets/sponsor-shuckups.png` | YES (white line art on TRANSPARENT bg -- invisible on white, must sit on a dark tile) | -- |
- All assets committed at base (commits 5d0cd46 and 0e154f2). Three more sponsors are pending logo files (805 BBQ and Smoke, Fit House Studios, Corie Maes Bouquets) plus Mayors Place pending a cleaner file -- the array structure must make adding one a single-line change.
- Logos link out only when url present (target _blank rel noopener); otherwise plain img.
- data-testid="sponsor-ribbon" on the section.
- Do NOT modify the existing client/src/components/Sponsors.tsx home-page component.

### Hard rules (unchanged)
- Brand "Nipomo Soccer" only; no internal program name in copy. No em dashes or double hyphens in copy. No pills above the hero headline. FAQ stays collapsed. Mobile-first.
- Spanish copy hand-written with proper accents.
- All existing data-testids preserved.

</decisions>

<specifics>
## Code constraints

- Files to touch: client/src/pages/landing/LandingPage.tsx and client/src/pages/landing/landingContent.ts ONLY. Assets are already committed at base.
- CRITICAL git hygiene: working tree has unrelated in-progress challenge edits (client/src/components/challenge/*, client/src/hooks/use-submissions.tsx, server/challengeRoutes.ts, shared/*, deleted .planning/HANDOFF.md, untracked challenge components). Never stage/commit/revert those. Stage ONLY the two landing files by explicit path. Never `git add -A` or `git add .`.
- Verify: `npm run build` passes; grep gates: no "5v5" and no internal program name in client/src/pages/landing/.
- TypeScript: the new `sponsors` field must be added to the LandingContent interface and BOTH content objects.

</specifics>

<canonical_refs>
## Canonical References

- Current implementation: client/src/pages/landing/LandingPage.tsx (restyle target -- hero is section 2, ribbon goes after PhotoBandSection band1)
- Existing sponsor imports/pattern: client/src/components/Sponsors.tsx (home page; logo import paths and alt text)
- Hero assets: client/public/landing-hero-{1,2,3}.jpg (committed, orientation-verified)

</canonical_refs>
