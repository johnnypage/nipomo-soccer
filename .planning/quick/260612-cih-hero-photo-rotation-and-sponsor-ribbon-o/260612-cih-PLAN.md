---
phase: 260612-cih
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - client/src/pages/landing/landingContent.ts
  - client/src/pages/landing/LandingPage.tsx
autonomous: true
requirements: [HERO-ROTATION, SPONSOR-RIBBON]

must_haves:
  truths:
    - "Hero section shows three real photos crossfading on a 5-second cycle behind the existing headline/subhead/urgency/CTA"
    - "Hero type stays readable over the brightest photo via a dark overlay plus bottom gradient"
    - "Users with prefers-reduced-motion see hero-1 statically with no interval running"
    - "A light sponsor ribbon with nine full-color logos appears between photo band 1 and Pricing on both /fall and /futbol"
    - "Sponsor heading/sub render in the correct language (EN on /fall, ES on /futbol)"
    - "Adding a tenth sponsor is a single array entry in landingContent.ts"
  artifacts:
    - path: "client/src/pages/landing/landingContent.ts"
      provides: "sponsors copy field on LandingContent + shared SPONSORS array"
      contains: "export const SPONSORS"
    - path: "client/src/pages/landing/LandingPage.tsx"
      provides: "HeroRotation background + SponsorRibbon section"
      contains: "data-testid=\"sponsor-ribbon\""
  key_links:
    - from: "LandingPage.tsx hero section"
      to: "/landing-hero-{1,2,3}.jpg"
      via: "stacked absolutely-positioned bg-cover divs with opacity crossfade"
      pattern: "landing-hero-"
    - from: "LandingPage.tsx SponsorRibbon"
      to: "SPONSORS array in landingContent.ts"
      via: "import + map render"
      pattern: "SPONSORS\\.map"
    - from: "LandingPage.tsx sponsor heading"
      to: "content.sponsors"
      via: "per-language content object"
      pattern: "content\\.sponsors"
---

<objective>
Add two locally-credible elements to the shared landing layout (used by /fall EN and /futbol ES):
1. A slow crossfading rotation of three real field photos behind the hero, with the existing typographic content layered above a dark overlay.
2. A light sponsor ribbon with nine full-color local sponsor logos in uniform tiles, between photo band 1 and Pricing.

Purpose: Make the page feel unmistakably local and established so Nipomo parents register without second-guessing.
Output: Restyled hero + new ribbon section in LandingPage.tsx; new `sponsors` content field and shared `SPONSORS` array in landingContent.ts.

This implements the LOCKED spec in 260612-cih-CONTEXT.md exactly. Do not redesign.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260612-cih-hero-photo-rotation-and-sponsor-ribbon-o/260612-cih-CONTEXT.md

Verified facts (do not re-discover):
- `@assets` alias resolves to `attached_assets/` (vite.config.ts line 26).
- All nine sponsor files exist in attached_assets/ at the exact paths in the spec table.
- All three hero files exist at client/public/landing-hero-{1,2,3}.jpg (served from web root as /landing-hero-N.jpg).
- Existing import pattern (client/src/components/Sponsors.tsx): `import herreraLogo from "@assets/Herrera_1765222077181.png";` then `<img src={logo} .../>`. Reuse this pattern. Do NOT modify Sponsors.tsx.

<interfaces>
Current LandingContent interface (landingContent.ts) — add ONE field:

```typescript
export interface LandingContent {
  lang: "en" | "es";
  // ...existing fields unchanged...
  sponsors: { heading: string; sub: string };  // NEW — add after band2 or near other section copy
  // ...rest unchanged...
}
```

Shared sponsor array (NOT per-language) shape:

```typescript
export const SPONSORS: { name: string; src: string; url?: string; dark?: boolean }[] = [ ... ];
```

LandingPage.tsx renders both enContent and esContent through the same component via `content` prop. The hero is section 2 (currently `bg-night`, lines ~96-116). Photo band 1 is `<PhotoBandSection image="/landing-band-gameday.jpg" .../>` (section 4). The ribbon goes immediately AFTER that PhotoBandSection and BEFORE the Pricing section (section 5).
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add sponsors copy field and shared SPONSORS array to landingContent.ts</name>
  <files>client/src/pages/landing/landingContent.ts</files>
  <action>
At the top of the file (after the SPOND_* consts), add the nine sponsor asset imports using the `@assets` alias, exactly matching the spec table:
- `import herreraLogo from "@assets/Herrera_1765222077181.png";`
- `import jgContractingLogo from "@assets/JG_Contracting_1765222077181.png";`
- `import headlinersLogo from "@assets/headliners-barbershop.jpg";`
- `import cafeDevilleLogo from "@assets/sponsor-cafe-deville.jpg";`
- `import coastWaterLogo from "@assets/sponsor-coast-water.jpg";`
- `import lvlSalonLogo from "@assets/sponsor-lvl-salon.png";`
- `import superiorFireLogo from "@assets/sponsor-superior-fire.jpg";`
- `import taylorReaLogo from "@assets/sponsor-taylor-rea.png";`
- `import shuckupsLogo from "@assets/sponsor-shuckups.png";`

Add `sponsors: { heading: string; sub: string };` to the LandingContent interface (place it logically, e.g. right after the `band2` field).

Add the `sponsors` object to BOTH enContent and esContent (TypeScript will error if either is missing — that is the gate):
- EN: heading "Backed by Nipomo businesses", sub "Local sponsors help keep the season affordable for every family."
- ES: heading "Con el respaldo de negocios de Nipomo", sub "Los patrocinadores locales ayudan a que la temporada sea accesible para cada familia." (proper accents, hand-written; no em dashes or double hyphens).

Export a single shared array (NOT inside either content object) so both pages use the same logos:

```typescript
export const SPONSORS: { name: string; src: string; url?: string; dark?: boolean }[] = [
  { name: "Herrera Farming Company", src: herreraLogo },
  { name: "JG Contracting", src: jgContractingLogo, url: "https://jgcontracting.biz/" },
  { name: "Head Liners Barber Shop", src: headlinersLogo },
  { name: "Cafe DeVille", src: cafeDevilleLogo, dark: true },
  { name: "Coast Water Solutions", src: coastWaterLogo, dark: true },
  { name: "LVL Salon", src: lvlSalonLogo },
  { name: "Superior Fire Sprinkler", src: superiorFireLogo },
  { name: "Taylor Rea Photography", src: taylorReaLogo },
  { name: "The Shuck Ups Cornhole Club", src: shuckupsLogo, dark: true },
];
```

`dark: true` ONLY on Cafe DeVille, Coast Water Solutions, and The Shuck Ups (per spec: black-art-bg or transparent line-art that needs a dark tile). The keep-it-one-line structure is required so the three pending sponsors can be added later as single entries.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "landingContent" || echo "TS-OK landingContent"</automated>
  </verify>
  <done>Interface has `sponsors` field; both content objects supply it; `export const SPONSORS` has nine entries with dark:true on exactly the three specified; TypeScript compiles with no errors referencing landingContent.ts.</done>
</task>

<task type="auto">
  <name>Task 2: Hero photo rotation + SponsorRibbon in LandingPage.tsx</name>
  <files>client/src/pages/landing/LandingPage.tsx</files>
  <action>
Import the new array: add `SPONSORS` to the existing import from "./landingContent". Keep `useEffect` import and add `useState` and `useRef` as needed.

HERO ROTATION (replace section 2, currently `<section className="bg-night">` at lines ~96-116):
- Build a `HeroRotation` background as stacked absolutely-positioned divs. Define `const HERO_IMAGES = ["/landing-hero-1.jpg", "/landing-hero-2.jpg", "/landing-hero-3.jpg"];` (hero-1 first per spec).
- Render all three divs from mount (so the browser loads eagerly and there is no late flash). Each: `absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms]`, `style={{ backgroundImage: url(...) }}`, opacity `1` when its index is active else `0`. hero-1 (index 0) is the bottom layer and stays mounted/visible underneath.
- Active index in React state. In a `useEffect`: first check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` — if reduced, do NOT start an interval (leave index at 0, hero-1 static). Otherwise `setInterval` every 5000ms advancing `(i + 1) % 3`; clean up with clearInterval on unmount.
- Overlay for legibility (above the photo divs, below the content): a full-cover `bg-night/65` div PLUS a bottom gradient div `bg-gradient-to-t from-night via-night/40 to-transparent` so the hero blends into the value-props section below. The headline must stay readable over hero-1's bright sky top.
- Section wrapper: `relative overflow-hidden` (keep `bg-night` as a base fallback color). Content wrapper gets `relative z-10` and KEEPS the existing classes (`max-w-[1100px] mx-auto px-5 py-20 md:py-28 text-center flex flex-col items-center`) and ALL existing children unchanged: h1 headline, subhead p, urgency p, and the CtaButton with `testId="cta-hero"`. Optional min-h for mobile presence but do not exceed ~90svh. Do NOT add dots/arrows/controls — ambient background only.
- Preserve every existing data-testid (cta-hero stays).

SPONSOR RIBBON (new section, inserted AFTER the photo band 1 `<PhotoBandSection image="/landing-band-gameday.jpg" .../>` and BEFORE the Pricing `<section className="bg-night">`):
- `<section data-testid="sponsor-ribbon" className="bg-warmwhite py-12 md:py-14">`.
- Inner: `max-w-[1100px] mx-auto px-5 text-center`.
- Heading: `font-display uppercase text-night text-xl md:text-2xl` using `{content.sponsors.heading}`. Sub below it: small `text-night/60` using `{content.sponsors.sub}`.
- Grid of nine uniform tiles: `mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center`.
- For each sponsor in `SPONSORS.map((s, i) => ...)`:
  - Tile: `rounded-lg h-24 md:h-28 flex items-center justify-center px-4`; background = `s.dark ? "bg-black" : "bg-white border border-black/8"`.
  - Logo img: `src={s.src}` `alt={s.name}` `className="w-auto object-contain max-h-16 md:max-h-20"`. For `s.dark` tiles bump the img cap slightly (e.g. `max-h-20 md:max-h-24`) since that art includes its own padding. NO grayscale — full color, recognition is the goal.
  - If `s.url`, wrap the img in `<a href={s.url} target="_blank" rel="noopener noreferrer">`; otherwise render the plain img. Use `key={i}` or `key={s.name}`.

Do NOT touch any other section, the header, footer, or PhotoBandSection helper. Do NOT modify client/src/components/Sponsors.tsx.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && npm run build 2>&1 | tail -5 && grep -rn "5v5" client/src/pages/landing/ && echo "FAIL-5v5" || echo "OK-no-5v5"</automated>
  </verify>
  <done>`npm run build` passes. Hero renders three stacked photo divs that crossfade every 5s (static hero-1 under reduced-motion), with dark overlay + bottom gradient and all original hero content/testids intact. A `data-testid="sponsor-ribbon"` light section with nine full-color tiles (black tiles for Cafe DeVille, Coast Water, Shuck Ups) renders between band 1 and Pricing, language-correct heading/sub. No "5v5" and no internal program name in client/src/pages/landing/.</done>
</task>

</tasks>

<verification>
- `npm run build` passes (TypeScript + Vite).
- Both content objects compile (missing `sponsors` on either would be a TS error).
- Grep gates on client/src/pages/landing/: `grep -rn "5v5"` returns nothing; the internal program name does not appear.
- Manual sanity (executor describes, does not block): /fall shows EN ribbon heading, /futbol shows ES heading; hero photos visibly crossfade.
</verification>

<success_criteria>
- Hero background rotates three real photos with a dark overlay + bottom gradient; reduced-motion shows hero-1 static; existing headline/subhead/urgency/CTA and all data-testids unchanged.
- Light sponsor ribbon with nine full-color uniform tiles (3 black tiles) sits between photo band 1 and Pricing on both languages, language-correct copy, `data-testid="sponsor-ribbon"`.
- SPONSORS is a shared single array; adding a tenth sponsor is one line.
- Only client/src/pages/landing/LandingPage.tsx and landingContent.ts changed.
</success_criteria>

<git_hygiene>
CRITICAL — the working tree has unrelated in-progress challenge edits (client/src/components/challenge/*, client/src/hooks/use-submissions.tsx, server/challengeRoutes.ts, shared/*, deleted .planning/HANDOFF.md, untracked challenge components). NEVER stage, commit, or revert those.

When committing, stage ONLY the two landing files by explicit path:
`git add client/src/pages/landing/LandingPage.tsx client/src/pages/landing/landingContent.ts`

NEVER use `git add -A`, `git add .`, or `git add client/`. Verify with `git status` that only the two landing files are staged before committing.
</git_hygiene>

<output>
After completion, create `.planning/quick/260612-cih-hero-photo-rotation-and-sponsor-ribbon-o/260612-cih-SUMMARY.md`
</output>
