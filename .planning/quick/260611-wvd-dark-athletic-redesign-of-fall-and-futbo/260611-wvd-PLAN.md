---
phase: 260611-wvd-dark-athletic-redesign
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - client/src/pages/landing/landingContent.ts
  - client/src/pages/landing/LandingPage.tsx
  - client/public/landing-band-gameday.jpg
  - client/public/landing-band-lights.jpg
autonomous: true
requirements: [WVD-01, WVD-02, WVD-03, WVD-04]
must_haves:
  truths:
    - "Both /fall and /futbol render dark (night base), bold athletic styling with no tan sections"
    - "Logo and crimson CTA stay visible while scrolling (sticky header)"
    - "Hero is fully typographic with no photo"
    - "Two full-bleed real-photo bands appear lower on the page, each with display-font overlay copy"
    - "Value props render as bold display-font titles with body text"
    - "The literal string 5v5 appears nowhere on either page; teen players covered by one quiet line"
    - "Both photo assets exist under client/public and are each under 600KB"
  artifacts:
    - path: "client/public/landing-band-gameday.jpg"
      provides: "Game-day full-bleed band image (band 1)"
    - path: "client/public/landing-band-lights.jpg"
      provides: "Night-game full-bleed band image (band 2)"
    - path: "client/src/pages/landing/landingContent.ts"
      provides: "Restructured content (valueProps objects, band1/band2, teenNote) for EN+ES"
      contains: "band1"
    - path: "client/src/pages/landing/LandingPage.tsx"
      provides: "Dark athletic layout with sticky header and two photo bands"
      contains: "sticky top-0"
  key_links:
    - from: "client/src/pages/landing/LandingPage.tsx"
      to: "client/public/landing-band-gameday.jpg"
      via: "backgroundImage url"
      pattern: "landing-band-gameday"
    - from: "client/src/pages/landing/LandingPage.tsx"
      to: "client/src/pages/landing/landingContent.ts"
      via: "content.band1 / content.band2 / content.valueProps[].title"
      pattern: "content\\.band1"
---

<objective>
Redesign the /fall (EN) and /futbol (ES) Meta-ads landing pages from the current light/tan styling to a dark, bold, athletic look matching the club ad creative. Both pages share LandingPage.tsx, so visual changes apply to both automatically; only language strings differ in landingContent.ts.

Purpose: The current flat tan page does not match the Nike/athletic feel of the ad creative driving traffic to it. A dark, typographic, photo-anchored page improves conversion continuity from ad to landing.

Output: Restructured landingContent.ts (EN+ES), fully restyled dark LandingPage.tsx with sticky header and two full-bleed photo bands, and two processed sub-600KB photo assets in client/public/.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260611-wvd-dark-athletic-redesign-of-fall-and-futbo/260611-wvd-CONTEXT.md

@client/src/pages/landing/LandingPage.tsx
@client/src/pages/landing/landingContent.ts
@client/src/pages/roots/PhotoBand.tsx

<interfaces>
<!-- Current LandingContent shape (landingContent.ts). This plan CHANGES it. -->
<!-- Old fields being replaced: valueProps: string[] -> { title; body }[];
     ages.fiveVFive -> ages.teenNote (and ages.note merges in or drops);
     NEW: band1: { line; sub } and band2: { line; sub }. -->

Stable exports to keep using as-is:
```typescript
export const SPOND_MAIN: string;          // hero/nav/final CTA href, target=_blank
export const SPOND_PARENT_AND_ME: string; // link-parent-and-me
export const SPOND_SPECIAL_NEEDS: string; // link-special-needs
```

PhotoBand.tsx overlay pattern to reuse for both bands:
```tsx
<section className="relative bg-scroll md:bg-fixed bg-cover bg-center"
  style={{ backgroundImage: `url(/landing-band-gameday.jpg)` }}>
  <div className="absolute inset-0 bg-night/70" />
  <div className="relative z-10 ...">{/* display-font line + warmwhite/70 sub */}</div>
</section>
```
Note: assets in client/public/ are served from site root, so the URL is `/landing-band-gameday.jpg` (no /public prefix).

Preserved data-testid attributes (must remain): cta-hero, cta-final, link-parent-and-me, link-special-needs. NEW: cta-nav on the sticky header CTA.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Process photo assets and restructure landingContent.ts (EN + ES)</name>
  <files>client/public/landing-band-gameday.jpg, client/public/landing-band-lights.jpg, client/src/pages/landing/landingContent.ts</files>
  <action>
First, process the two photo bands by running these EXACT commands from the repo root (sources live outside the repo, absolute paths given; both sources are 4032x3024 upright with no EXIF orientation):

```
sips -s format jpeg -s formatOptions 70 --resampleWidth 1800 "/Users/johnnypage/Projects/Nipomo Soccer/marketing/ad-images/source-photos/B0BE001A-5C91-4196-BE1F-6C77CCEDDCD3.jpeg" --out client/public/landing-band-gameday.jpg
sips -s format jpeg -s formatOptions 70 --resampleWidth 1800 "/Users/johnnypage/Projects/Nipomo Soccer/marketing/ad-images/source-photos/IMG_8044.jpeg" --out client/public/landing-band-lights.jpg
```

Then verify both outputs are under 600KB: `ls -la client/public/landing-band-*.jpg`. If either exceeds 600KB, lower formatOptions (e.g. 60) and re-run that file until under 600KB.

Then update the LandingContent interface and BOTH content objects (enContent, esContent) in landingContent.ts to the new shape per CONTEXT spec:

1. Change `valueProps: string[]` to `valueProps: { title: string; body: string }[]`.
   - EN: UP TO 16 GAMES / "A real season that runs August through November." | PAID REFEREES / "Trained and paid referees at every game from 1st grade up. New this season." | BALANCED TEAMS / "Every player evaluated at Kickoff Day so games stay close all season." | THE FULL KIT / "Custom jersey, Photo Day, and a medal or trophy to close out the season." | CLOSE TO HOME / "Every game right here in Nipomo."
   - ES (proper accents/ñ in code): HASTA 16 PARTIDOS / "Una temporada de verdad, de agosto a noviembre." | ÁRBITROS PAGADOS / "Árbitros capacitados y pagados en cada partido desde 1er grado. Nuevo esta temporada." | EQUIPOS PAREJOS / "Cada jugador se evalúa en el Kickoff Day para que los partidos estén reñidos toda la temporada." | EQUIPO COMPLETO / "Jersey personalizado, día de fotos y una medalla o trofeo para cerrar la temporada." | CERCA DE CASA / "Cada partido aquí mismo en Nipomo."
   - The 5v5 "20+ games" clause is REMOVED entirely.

2. Add `band1: { line: string; sub: string }` and `band2: { line: string; sub: string }` to the interface and both objects:
   - band1 EN: line "Saturdays belong to the kids" / sub "Real teams, real referees, and a sideline full of families every week." | band1 ES: line "Los sábados son de los niños" / sub "Equipos de verdad, árbitros de verdad y una banda llena de familias cada semana."
   - band2 EN: line "This is a real season" / sub "From the first whistle in August to medals and trophies in November." | band2 ES: line "Esto es una temporada de verdad" / sub "Desde el primer silbatazo en agosto hasta las medallas y trofeos en noviembre."

3. Replace `ages.fiveVFive` with `ages.teenNote` (string), and drop `ages.note` if it becomes redundant (merge the "same form" idea into teenNote). Update the interface accordingly.
   - leaguePlay EN: "League Play: Pre-K through 6th grade. Weekly practices plus Saturday games." (keep) ; teenNote EN: "Players in 7th grade and up have their own fast paced teen league that plays twice a week. Register through the same form."
   - leaguePlay ES: keep existing ; teenNote ES: "Los jugadores de 7mo grado en adelante tienen su propia liga juvenil que juega dos veces por semana. Se inscriben con el mismo formulario."
   - The literal string "5v5" must NOT appear in either object after this change.

4. Update hero.subhead in both objects so the grade range reads "Pre-K through 8th grade" (EN) / "desde Pre-K hasta 8vo grado" (ES) instead of "12th grade" / "12vo grado". Leave the rest of the subhead intact.

Hard copy rules: brand is "Nipomo Soccer" only (no internal program name in copy); no em dashes or double hyphens in any string; Spanish uses correct accents and ñ in the actual code (sábados, niños, árbitros, evalúa, reñidos, día, aquí, estén).
  </action>
  <verify>
    <automated>ls -la client/public/landing-band-gameday.jpg client/public/landing-band-lights.jpg && test $(wc -c < client/public/landing-band-gameday.jpg) -lt 614400 && test $(wc -c < client/public/landing-band-lights.jpg) -lt 614400 && grep -c "band1" client/src/pages/landing/landingContent.ts && grep -c "teenNote" client/src/pages/landing/landingContent.ts && ! grep -i "5v5" client/src/pages/landing/landingContent.ts</automated>
  </verify>
  <done>Both jpgs exist under 600KB; landingContent.ts has valueProps objects, band1/band2, and teenNote in both EN and ES; no "5v5" string remains; hero subhead reads "8th grade"/"8vo grado".</done>
</task>

<task type="auto">
  <name>Task 2: Rewrite LandingPage.tsx as the dark athletic layout</name>
  <files>client/src/pages/landing/LandingPage.tsx</files>
  <action>
Rewrite LandingPage.tsx to render the dark athletic layout per CONTEXT spec, consuming the new content shape from Task 1. Keep the CtaButton helper (it already links to SPOND_MAIN, target=_blank). Section order and treatment:

1. Sticky header: `sticky top-0 z-50 bg-night border-b border-warmwhite/10`. Logo left (existing `@assets/NSC_1764979848772.png`, ~h-10), compact crimson CTA right using content.ctaLabel, links SPOND_MAIN target=_blank, data-testid="cta-nav". Both fit one row on small screens (shrink CTA padding/text on mobile). Root wrapper switches from `bg-warmwhite text-night` to `bg-night text-warmwhite`.

2. Hero (bg-night, py-20 md:py-28, no photo): headline font-display uppercase tracking-tight tight leading, clamp up to ~96px desktop. Gold urgency line, subhead in warmwhite/75, large crimson CtaButton testId="cta-hero". No pills above headline.

3. Value props: dark section. Map content.valueProps as bold cards `bg-white/5 border border-warmwhite/10 rounded-xl` (no border-left stripe, no bullet). Each card: font-display uppercase title (prop.title) + warmwhite/70 body (prop.body).

4. Photo band 1 (after value props): reuse PhotoBand.tsx overlay pattern inline. Section relative bg-scroll md:bg-fixed bg-cover bg-center, backgroundImage url(/landing-band-gameday.jpg), absolute inset-0 bg-night/70 overlay, relative z-10 content, min height ~300px mobile. Display-font uppercase content.band1.line + warmwhite/70 content.band1.sub.

5. Pricing (dark): font-display gold content.pricing.fromLine huge (keep clamp). tiersLine warmwhite. urgency in gold or crimson (must pop). scholarshipsLine stays (warmwhite/70). parentAndMe + specialNeeds become dark cards bg-white/5 border border-warmwhite/10.

6. Ages (5v5 demoted): heading + ONE card (bg-white/5) with content.ages.leaguePlay. Below the card, content.ages.teenNote as one quiet sentence (warmwhite/70, not a card). Secondary links (link-parent-and-me, link-special-needs) stay, restyled gold or warmwhite with hover underline. Drop the second card and the old fiveVFive/note rendering.

7. How it works: dark, cards bg-white/5 border border-warmwhite/10, keep numbered crimson circles.

8. FAQ: dark, details cards bg-white/5 border border-warmwhite/10, all collapsed, keep chevron rotate pattern, summary text warmwhite, answer warmwhite/70.

9. Photo band 2 (directly before final CTA): same treatment as band 1 but backgroundImage url(/landing-band-lights.jpg), content.band2.line + content.band2.sub.

10. Final CTA (right after band 2): big font-display heading, gold urgency, crimson CtaButton testId="cta-final".

11. Footer: structurally unchanged (already dark), ensure border-t border-warmwhite/10 still reads.

Use subtle section variation (e.g. bg-[#181818] vs bg-night) so the dark page is not one flat slab. Preserve all data-testid attributes (cta-hero, cta-final, link-parent-and-me, link-special-needs, cta-nav). No em dashes / double hyphens. No "5v5" or internal program name anywhere.
  </action>
  <verify>
    <automated>npx tsc --noEmit -p . 2>&1 | grep -E "client/src/pages/landing/(LandingPage|landingContent)" ; test $? -ne 0 && echo "no landing tsc errors" ; grep -c "sticky top-0" client/src/pages/landing/LandingPage.tsx && grep -c "cta-nav" client/src/pages/landing/LandingPage.tsx && grep -c "landing-band-gameday" client/src/pages/landing/LandingPage.tsx && grep -c "landing-band-lights" client/src/pages/landing/LandingPage.tsx && ! grep -i "5v5" client/src/pages/landing/LandingPage.tsx && ! grep -i "bg-warmwhite\|bg-paper" client/src/pages/landing/LandingPage.tsx</automated>
  </verify>
  <done>LandingPage.tsx compiles with no new errors in the landing files; renders sticky header with cta-nav, typographic hero, bold value-prop cards, two photo bands referencing both jpgs, demoted ages section with teenNote, dark pricing/FAQ/how-it-works; no bg-warmwhite/bg-paper and no "5v5" remain.</done>
</task>

<task type="auto">
  <name>Task 3: Build, run grep/git gates, and commit landing files only</name>
  <files>client/src/pages/landing/LandingPage.tsx, client/src/pages/landing/landingContent.ts, client/public/landing-band-gameday.jpg, client/public/landing-band-lights.jpg</files>
  <action>
Run the full build and gates, then commit ONLY the landing files by explicit path. The working tree contains unrelated in-progress challenge edits (client/src/components/challenge/*, client/src/hooks/use-submissions.tsx, server/challengeRoutes.ts, shared/*, deleted .planning/HANDOFF.md, untracked challenge components). NEVER stage, commit, or revert those.

1. Build gate: `npm run build` must succeed. (Pre-existing server-side tsc errors unrelated to landing are out of scope, but the production build must complete.)

2. Grep gates (all must pass):
   - `grep -ri "5v5" client/src/pages/landing/` returns nothing.
   - `grep -ri "roots" client/src/pages/landing/` returns nothing in copy strings (matches that are only file-path comments are acceptable; copy strings are not).

3. Git stage by EXPLICIT path only (never `git add -A` or `git add .`):
   ```
   git add client/src/pages/landing/LandingPage.tsx client/src/pages/landing/landingContent.ts client/public/landing-band-gameday.jpg client/public/landing-band-lights.jpg
   ```

4. Confirm the staged set contains ONLY those four paths before committing: `git status --short` should show only those four under staged changes; the challenge WIP must remain unstaged. If anything else is staged, unstage it (`git restore --staged <path>`) and re-stage only the four landing paths.

5. Commit:
   ```
   git commit -m "feat(260611-wvd): dark athletic redesign of /fall and /futbol landing pages"
   ```
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -5 && ! grep -ri "5v5" client/src/pages/landing/ && git log -1 --name-only --pretty=format:"%s" | grep -E "landing-band-gameday|LandingPage" && git diff --cached --name-only | grep -cE "challenge|use-submissions|challengeRoutes|shared/" | grep -q "^0$"</automated>
  </verify>
  <done>npm run build succeeds; no "5v5" in landing dir; the latest commit contains exactly the four landing paths (two source files, two jpgs) and zero challenge WIP files; challenge edits remain unstaged in the working tree.</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit -p .` shows no errors originating in client/src/pages/landing/* (pre-existing server errors out of scope).
- `npm run build` succeeds.
- `grep -ri "5v5" client/src/pages/landing/` returns nothing.
- `grep -ri "roots" client/src/pages/landing/` returns nothing in copy strings.
- Both client/public/landing-band-*.jpg exist and are each under 600KB.
- The redesign commit stages only the four landing paths; challenge WIP stays untouched.
</verification>

<success_criteria>
- /fall and /futbol render dark, bold, athletic styling with a sticky logo + crimson CTA header.
- Hero is typographic with no photo; subhead reads Pre-K through 8th grade (EN) / desde Pre-K hasta 8vo grado (ES).
- Value props are bold display-font title + body cards on dark.
- Two full-bleed real-photo bands appear lower on the page with display-font overlay copy.
- 5v5 is gone everywhere; teen players covered by one quiet line; secondary Spond links preserved.
- All data-testid attributes preserved plus new cta-nav.
- Build passes; commit contains only the landing files and assets; challenge WIP untouched.
</success_criteria>

<output>
After completion, create `.planning/quick/260611-wvd-dark-athletic-redesign-of-fall-and-futbo/260611-wvd-SUMMARY.md`
</output>
