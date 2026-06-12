# Handoff: Apply Landing Page Patterns to the Main Site

**From:** Landing page build session, 2026-06-12 (commits `40385a5` through `80a0b90`)
**Goal of next session:** Bring the best elements of the /fall and /futbol Meta ads landing pages to the main site (home page + ROOTS hub + division pages), and simplify the ROOTS pages, which Johnny feels have grown complicated.

## What was built (reference implementation)

`client/src/pages/landing/` -- two conversion pages sharing one layout:
- `LandingPage.tsx` -- layout. Contains reusable patterns: HeroRotation (crossfading photo background, 2.5s interval, reduced-motion fallback), sponsor marquee (`.sponsor-marquee` keyframes in `client/src/index.css`), PhotoBandSection (full-bleed photo + overlay, per-band position/parallax/overlay props), timeline section (gold dots on a hairline), editorial divide-y list ("What you get"), division cards with direct Spond register CTAs.
- `landingContent.ts` -- all copy EN + ES, the SPONSORS array (16 logos, per-logo computed heights for equal visual area, processed white/color assets in `attached_assets/sponsor-mono-*.png` and `sponsor-color-*.png`).

Visit /fall locally to see everything: `npx vite --port 5051` (full dev server crashes on macOS: `reusePort` is Linux-only; port 5000 is taken by AirPlay).

## Johnny's explicit asks for the main site

1. **Sponsor logo marquee on the home page, above the fold, right below the hero.** Reuse the landing implementation: dark strip, "Sponsored by Nipomo businesses" eyebrow, infinite scroll, the same SPONSORS data. Extract marquee + SPONSORS into a shared module (e.g. `client/src/components/SponsorMarquee.tsx` + shared sponsors data file) so landing and home render from one source. The old home `Sponsors.tsx` (2 logos, grayscale hover) should be replaced or retired.
2. **Simplify the ROOTS hub and division pages.** His words: they have "gotten a little more complicated." The landing page is the model: fewer sections, each doing one job, register CTAs always in reach.

## Audit findings (from working inside these files today)

- **Old logo still referenced** by ROOTS pages and possibly others: `@assets/NSC_1764979848772.png`. The current crest is `@assets/NipomoSoccer_1780982227404.png` (Header.tsx already uses it). Sweep all imports.
- **"Real X" copy survives on the main site:** `client/src/pages/roots/PhotoBand.tsx` says "Real families, real coaches..." Johnny killed this pattern on the landing pages ("it's all real -- just say what we put on"). Sweep roots pages for "real " constructions.
- **Pill badges** above section headings (e.g. "Find your division", "Season overview" pills on roots pages) conflict with Johnny's no-pills preference (see memory: feedback-website-design-patterns). The landing pages use plain display-font headings.
- **Season overview on Recreational.tsx** is prose blocks; the landing's timeline treatment (gold dots, hairline, abbreviated dates AUG 1 AND 8 etc.) is tighter and Johnny approved it after iteration. Candidate for porting.
- **DivisionSection.tsx on the ROOTS hub** links into program pages ("Learn more about..."). Landing cards go straight to Spond registration. Consider register-first CTAs with learn-more as secondary text links.
- **Sticky CTA:** landing header keeps logo + Register always visible. Main site header has full nav; consider a persistent Register button in the nav on ROOTS pages.
- **FAQ additions** made on landing (practices, gear, late registration) may be worth syncing into the ROOTS FAQ section. Note: 3 FAQ candidates still need Johnny's policy answers: refunds, friend/buddy requests, Saturday game times.
- **Hero photo rotation** could replace static heroes on roots pages (assets: `client/public/landing-hero-{1..9}.jpg`, all browser-verified for orientation).

## Hard rules (unchanged, from CLAUDE.md + memory)

- "ROOTS" stays on the main site (it is the warm-audience program name; only paid/cold pages avoid it). Landing pages must never say it.
- No em dashes, no double hyphens in web copy. No hero pills, no stat pill rows, no border-left accents wider than 1px, FAQs all collapsed.
- Colors crimson #8B2332 / gold #D4A747 / night / warmwhite; Integral CF display, Inter body.
- Spond URLs: main form `534965DA...` (League Play + 5v5), Parent & Me `7F3CC0F6...`, Special Needs `212CA66E...` -- constants in `landingContent.ts`.
- Pixel: PageView fires on SPA route change, SpondClick fires on any spond.com link via delegated listener in `client/index.html`. No changes needed when adding Spond links.

## Workflow

- GSD quick pipeline per CLAUDE.md (`gsd-tools.cjs init quick`, CONTEXT.md with locked decisions, gsd-planner + gsd-executor in worktree, docs commit). Quick task history in `.planning/STATE.md`.
- CRITICAL: working tree carries unrelated in-progress challenge edits (client/src/components/challenge/*, hooks, server/challengeRoutes.ts, shared/*). Stage by explicit path only, never `git add -A`.
- Deploy: push to GitHub, then in Replit Shell `git fetch origin` then `git reset --hard origin/main` (separate lines -- the Shell wraps long pastes), then Republish.
- Image processing pipeline + EXIF gotchas: see memory file `reference_landing_asset_pipeline.md` (browser-verify every processed photo with headless Chrome; Read tool ignores EXIF, browsers do not).
- Sponsor logo treatments: originals in `~/Documents/Nipomo Soccer Logos/Sponsors/` (symlinked at club/logos/Sponsors). Sponsor list is complete (Corie Mae's Bouquets dropped out, 2026-06-12 -- do not add). Adding a sponsor = process asset, one import + one array entry with computed h (equal-area: h = sqrt(72*72 / aspect), cap width 175px).

## Suggested phase order for the next session

1. Extract SponsorMarquee + shared sponsors data; add to home page below hero. (Small, high-visibility, his top ask.)
2. Logo sweep (old crest -> new) + "real X" copy sweep across roots pages. (Mechanical.)
3. ROOTS hub simplification pass: discuss with Johnny which sections collapse; port timeline + register-first cards where they fit. (Needs his input -- run /gsd-quick --discuss or present a proposal first.)
