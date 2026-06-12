---
phase: 260612-ehr
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - client/src/pages/landing/landingContent.ts
  - client/src/pages/landing/LandingPage.tsx
autonomous: true
requirements: [EHR-01]

must_haves:
  truths:
    - "Both /fall (EN) and /futbol (ES) render a divisions section with 4 cards, each CTA opening the correct Spond href in a new tab"
    - "Both pages render a season-at-a-glance section with 4 League Play milestones"
    - "Hero shows the new program paragraph plus a 'No tryouts' reassurance line"
    - "Photo band 1 uses /roots-photo-band.jpg with the updated copy"
    - "The Pricing, Find-your-age-group, and How-it-works sections no longer appear on the page"
    - "No 'real X' copy remains; npm run build passes; no internal program name in copy strings"
  artifacts:
    - path: "client/src/pages/landing/landingContent.ts"
      provides: "Updated LandingContent interface + enContent/esContent with divisions, season, hero.noTryouts; pricing/ages/howItWorks/secondaryLinks removed"
      contains: "divisions"
    - path: "client/src/pages/landing/LandingPage.tsx"
      provides: "Restructured layout: divisions + season sections, removed pricing/ages/howItWorks, per-card Spond hrefs"
      contains: "division-"
  key_links:
    - from: "LandingPage.tsx divisions cards"
      to: "card.href (SPOND_MAIN / SPOND_PARENT_AND_ME / SPOND_SPECIAL_NEEDS)"
      via: "anchor href per card"
      pattern: "href=\\{.*card.href"
    - from: "PhotoBandSection band1"
      to: "/roots-photo-band.jpg"
      via: "image prop"
      pattern: "roots-photo-band"
---

<objective>
Restructure the EN (/fall) and ES (/futbol) Meta-ads landing pages to the locked CONTEXT spec: add a Divisions section (4 cards, each with its own Spond CTA) and a Season-at-a-glance section, update hero/valueProps/band copy, swap band 1 image, and remove the Pricing, Find-your-age-group, and How-it-works sections.

Purpose: Johnny's content revision -- replace "real X" framing with concrete program facts, consolidate pricing/ages into division cards, and add a season timeline.
Output: Updated landingContent.ts (interface + both language objects) and LandingPage.tsx (layout) with all copy transcribed verbatim from CONTEXT, including Spanish accents.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260612-ehr-landing-page-content-revision-divisions-/260612-ehr-CONTEXT.md

<interfaces>
<!-- Spond href constants already exported from landingContent.ts -- reuse, do not redefine: -->
SPOND_MAIN          -- League Play and 5V5 cards
SPOND_PARENT_AND_ME -- Parent & Me card
SPOND_SPECIAL_NEEDS -- Special Needs card

<!-- IMPORTANT: the existing CtaButton component hardcodes href={SPOND_MAIN}.
     Division card CTAs must use a per-card href (card.href), NOT CtaButton.
     Render division CTAs as plain <a> anchors with target="_blank" rel="noopener noreferrer". -->

<!-- New LandingContent shape (replace the old interface): -->
hero: { headline; subhead; noTryouts; urgency }     // ADD noTryouts
divisions: {
  heading; sub; urgency; scholarships;
  cards: { title; age; body; price; priceNote?; cta; href }[]
}
season: { heading; sub; milestones: { title; body }[] }
// REMOVE from interface AND both objects: pricing, ages, howItWorks, secondaryLinks
// KEEP unchanged: lang, docTitle, ctaLabel, valueProps, band1, band2, sponsors, faqs, finalCta, footerContact, footerPrivacyLabel
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite landingContent.ts interface and both language objects</name>
  <files>client/src/pages/landing/landingContent.ts</files>
  <action>
Update the LandingContent interface and both enContent/esContent objects to the new shape. Leave the SPOND_* constants, sponsor imports, and SPONSORS array exactly as they are.

INTERFACE changes:
- In `hero`, add `noTryouts: string` (after subhead).
- ADD `divisions: { heading: string; sub: string; urgency: string; scholarships: string; cards: { title: string; age: string; body: string; price: string; priceNote?: string; cta: string; href: string }[] }`
- ADD `season: { heading: string; sub: string; milestones: { title: string; body: string }[] }`
- REMOVE the `pricing`, `ages`, `howItWorks`, and `secondaryLinks` interface members.

enContent / esContent changes -- transcribe ALL copy VERBATIM from CONTEXT.md sections "EN copy (exact)" and "ES copy (exact)". Do not paraphrase. Preserve every Spanish accent (á é í ó ú ñ ¿) exactly. No em dashes, no double hyphens in any string.

- hero.subhead -> new locked paragraph; add hero.noTryouts -> new line. (hero.headline and hero.urgency stay as-is in both languages.)
- valueProps: change ONLY the FIRST card body ("UP TO 16 GAMES" / "HASTA 16 PARTIDOS"). EN: "Saturday games plus midweek matchups, August through November." ES: "Partidos los sábados y entre semana, de agosto a noviembre." All other valueProps titles and bodies unchanged.
- band1: EN line "The best part of the week happens on the field" / sub "Families, coaches, and a whole town that shows up every Saturday." ES line "Lo mejor de la semana pasa en la cancha" / sub "Familias, entrenadores y todo un pueblo que llega cada sábado."
- band2: EN line "A season your kid will remember" / sub "First whistle in August. Medals and trophies in November." ES line "Una temporada que tu hijo va a recordar" / sub "Primer silbatazo en agosto. Medallas y trofeos en noviembre."
- ADD divisions object with the 4 cards in this exact order, using href = the matching SPOND_* constant: card1 Parent&Me -> SPOND_PARENT_AND_ME, card2 League Play -> SPOND_MAIN, card3 5V5 -> SPOND_MAIN, card4 Special Needs -> SPOND_SPECIAL_NEEDS. Cards 1 and 4 have NO priceNote (omit the field). Cards 2 and 3 include priceNote (EN "Early Bird / Regular / Late", ES "Temprana / Regular / Tardía"). Copy each title/age/body/price/cta verbatim from CONTEXT.
- ADD season object with heading, sub, and the 4 milestones (title + body) verbatim from CONTEXT.
- DELETE the `pricing`, `ages`, `howItWorks`, and `secondaryLinks` keys from BOTH objects.

The word "5v5"/"5V5" is allowed (it is a division name). The internal program name (R-O-O-T-S) must not appear in any copy string.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && grep -c "divisions" client/src/pages/landing/landingContent.ts && grep -c "season" client/src/pages/landing/landingContent.ts && ! grep -E "pricing:|ages:|howItWorks:|secondaryLinks:" client/src/pages/landing/landingContent.ts && grep -iv "roots-photo-band" client/src/pages/landing/landingContent.ts | grep -ic "roots" | grep -qx 0 && echo OK</automated>
  </verify>
  <done>Interface has divisions+season and no pricing/ages/howItWorks/secondaryLinks; both language objects populated verbatim with correct per-card Spond hrefs; no internal program name in copy.</done>
</task>

<task type="auto">
  <name>Task 2: Restructure LandingPage.tsx layout</name>
  <files>client/src/pages/landing/LandingPage.tsx</files>
  <action>
Restructure the page to the locked section order: Header (unchanged) -> Hero -> Sponsor marquee (unchanged) -> Divisions (NEW) -> Season (NEW) -> Value props -> Photo band 1 (new image) -> FAQ (unchanged) -> Photo band 2 (unchanged) -> Final CTA (unchanged) -> Footer (unchanged).

Specific edits:
1. HERO: after the subhead paragraph, add a second paragraph rendering `content.hero.noTryouts` (style it as a quieter reassurance line, e.g. text-warmwhite/60, smaller than subhead). Keep headline, urgency, and CtaButton as-is.

2. REMOVE three whole sections: the Pricing section (currently "5. Pricing"), the Ages section ("6. Ages"), and the How it works section ("7. How it works"). Also remove the now-unused SPOND_PARENT_AND_ME / SPOND_SPECIAL_NEEDS imports ONLY if they are no longer referenced after the divisions section is added (they ARE referenced via card.href in JSX, but as the imported constant lives in landingContent and is embedded in content.divisions.cards[].href, the component no longer needs to import them directly -- remove unused imports to keep the build clean; verify with the build).

3. ADD Divisions section after the Sponsor marquee. Design per CONTEXT: section on bg-night (or alternate panel), centered heading `content.divisions.heading` (display font uppercase), urgency line `content.divisions.urgency` near the heading in gold, sub line `content.divisions.sub` in warmwhite/70. Then a 2x2 grid on desktop / single column mobile (`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1100px]`). Each card: `bg-white/5 border border-warmwhite/10 rounded-xl px-6 py-6`, display-font uppercase title, gold age line, body in warmwhite/70, price in display font (crimson or gold) with optional priceNote in warmwhite/50 below it, and a full-width crimson CTA anchor at the bottom. The CTA anchor uses `href={card.href}` with target="_blank" rel="noopener noreferrer" (NOT the CtaButton component, which hardcodes SPOND_MAIN). Map a stable data-testid per card by title: PARENT & ME -> division-parent-and-me, LEAGUE PLAY -> division-league-play, 5V5 -> division-5v5, SPECIAL NEEDS -> division-special-needs (derive via a small lookup or slug helper, do not hardcode index). Below the grid, render `content.divisions.scholarships` in warmwhite/60, centered.

4. ADD Season section after Divisions, on the alternate panel color (bg-[#181818]). Centered heading `content.season.heading` and sub `content.season.sub`. Render the 4 milestones as a vertical stacked list of milestone cards (executor's craft within the dark system): each milestone title bold warmwhite, body warmwhite/70. max-w around 760-860px.

5. Photo band 1: change the PhotoBandSection image prop from "/landing-band-gameday.jpg" to "/roots-photo-band.jpg". band1.line/sub already come from content. Photo band 2 stays "/landing-band-lights.jpg".

Keep all CtaButton usages (nav, hero, final) pointing at SPOND_MAIN as before.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && grep -q "roots-photo-band.jpg" client/src/pages/landing/LandingPage.tsx && grep -q "content.divisions" client/src/pages/landing/LandingPage.tsx && grep -q "content.season" client/src/pages/landing/LandingPage.tsx && grep -q "content.hero.noTryouts" client/src/pages/landing/LandingPage.tsx && ! grep -E "content.pricing|content.ages|content.howItWorks|content.secondaryLinks" client/src/pages/landing/LandingPage.tsx && grep -q "division-parent-and-me" client/src/pages/landing/LandingPage.tsx && grep -q "card.href" client/src/pages/landing/LandingPage.tsx && echo OK</automated>
  </verify>
  <done>Page renders divisions (4 cards, per-card hrefs, correct testids), season, updated hero with noTryouts, band1 on /roots-photo-band.jpg; pricing/ages/howItWorks sections gone.</done>
</task>

</tasks>

<verification>
Run the full gate set after both tasks:

```bash
cd /Users/johnnypage/Projects/nipomo-soccer-website
npm run build
# Internal program name gate (asset path /roots-photo-band.jpg is allowed):
grep -rni "roots" client/src/pages/landing/ | grep -v "roots-photo-band"
# Expect: no matches (clean). 5v5 is allowed and intentionally not gated.
# No "real X" framing remains:
grep -rni "real " client/src/pages/landing/landingContent.ts
# Expect: no "real teams/season/referees" copy.
```

- `npm run build` passes (TypeScript compiles; both enContent and esContent satisfy the updated LandingContent interface).
- Internal-program-name grep is clean except the allowed /roots-photo-band.jpg asset path.
- Both language objects have divisions (4 cards) and season (4 milestones); no pricing/ages/howItWorks/secondaryLinks fields remain.
</verification>

<success_criteria>
- Both /fall and /futbol render the new section order: Hero (with noTryouts) -> Sponsors -> Divisions (4 cards, per-card Spond CTAs in new tabs) -> Season (4 milestones) -> Value props -> Band1 (/roots-photo-band.jpg) -> FAQ -> Band2 -> Final CTA -> Footer.
- All copy matches CONTEXT verbatim, Spanish accents preserved.
- Pricing, Find-your-age-group, and How-it-works sections removed.
- npm run build passes; internal-program-name grep clean; no "real X" copy.
- Only the two landing files changed.
</success_criteria>

<git_hygiene>
Stage ONLY these two files by explicit path. Never use `git add -A` or `git add .`. The challenge WIP and any other working-tree changes must never be staged.

```bash
cd /Users/johnnypage/Projects/nipomo-soccer-website
git add client/src/pages/landing/landingContent.ts client/src/pages/landing/LandingPage.tsx
```
</git_hygiene>

<output>
After completion, create `.planning/quick/260612-ehr-landing-page-content-revision-divisions-/260612-ehr-SUMMARY.md`
</output>
