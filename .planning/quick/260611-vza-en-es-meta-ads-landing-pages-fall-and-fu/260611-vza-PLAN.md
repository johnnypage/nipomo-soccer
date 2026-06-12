---
phase: quick-260611-vza
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - client/src/pages/landing/landingContent.ts
  - client/src/pages/landing/LandingPage.tsx
  - client/src/pages/landing/FallLanding.tsx
  - client/src/pages/landing/FutbolLanding.tsx
  - client/src/App.tsx
autonomous: true
requirements: [VZA-LANDING]
must_haves:
  truths:
    - "Visiting /fall renders a focused English Fall 2026 registration landing page with no site Navbar/Footer"
    - "Visiting /futbol renders a focused, fully Spanish landing page with no site Navbar/Footer"
    - "Every primary CTA on both pages opens the main Spond form (534965DA...) in a new tab"
    - "Both pages link Parent and Me ($120) and Special Needs ($50) to their dedicated Spond forms as secondary links"
    - "The word ROOTS appears nowhere on either page; no em dashes or double hyphens in page copy"
    - "FAQ items are all collapsed by default on both pages"
  artifacts:
    - path: "client/src/pages/landing/landingContent.ts"
      provides: "Per-language content objects (EN + ES) consumed by the shared layout"
      contains: "534965DA898B4B7E9CC0A589047F6061"
    - path: "client/src/pages/landing/LandingPage.tsx"
      provides: "Shared mobile-first landing layout"
      min_lines: 80
    - path: "client/src/pages/landing/FallLanding.tsx"
      provides: "English /fall page wiring EN content into LandingPage"
    - path: "client/src/pages/landing/FutbolLanding.tsx"
      provides: "Spanish /futbol page wiring ES content into LandingPage"
  key_links:
    - from: "client/src/App.tsx"
      to: "client/src/pages/landing/FallLanding.tsx and FutbolLanding.tsx"
      via: "Wouter Route path /fall and path /futbol"
      pattern: "path=\"/fall\"|path=\"/futbol\""
    - from: "client/src/pages/landing/LandingPage.tsx"
      to: "Spond main registration form"
      via: "primary CTA anchor with target _blank"
      pattern: "534965DA898B4B7E9CC0A589047F6061"
---

<objective>
Build two focused Meta-ads conversion landing pages in the existing nipomo-soccer-website React app: `/fall` (English) and `/futbol` (fully Spanish). Each is a single-purpose, mobile-first page that drives clicks to the Spond registration form. Minimal chrome (NSC logo only, no site nav, light footer), brand-compliant design reusing existing Tailwind tokens and roots/ styling idioms.

Purpose: The Meta Andromeda campaign (Nipomo Soccer | Fall 2026 Registration) optimizes on Landing Page Views. These pages are the conversion destination for the general-audience EN and ES ad sets. The pixel already fires PageView on SPA route changes and SpondClick on outbound spond.com links, so no tracking work is needed.

Output: A shared `LandingPage` layout plus per-language content objects, two route components, and two new Wouter routes registered in App.tsx.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260611-vza-en-es-meta-ads-landing-pages-fall-and-fu/260611-vza-CONTEXT.md

<interfaces>
Wouter routing (client/src/App.tsx) uses flat top-level routes inside Switch:
  import { Switch, Route, Redirect } from "wouter";
  <Route path="/coach" component={CoachWithUs} />
  <Route path="/privacy" component={Privacy} />
Add new page imports near the other imports and new Route entries before the catch-all <Route component={NotFound} />.

Tailwind brand tokens (tailwind.config.ts), use these class names directly:
  crimson #8B1D24 (crimson-dark #6B161C, use bg-crimson hover:bg-crimson-dark), night #0D0D0D,
  warmwhite #F4EDE1, slate #55524D, paper #F2F2EE, gold #C6A045.
  Headlines use font-display (Integral CF, uppercase) and font-heading. Body uses defaults.

Logo import (matches client/src/components/Header.tsx):
  import clubLogo from "@assets/NSC_1764979848772.png";
  then <img src={clubLogo} alt="Nipomo Soccer" ... />

document.title + scroll-to-top idiom (client/src/pages/Compare.tsx):
  useEffect(() => { window.scrollTo(0, 0); document.title = "..."; }, []);

Primary CTA anchor pattern (client/src/pages/roots/HeroSection.tsx):
  <a href={SPOND_MAIN} target="_blank" rel="noopener noreferrer"
     className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors">
    {ctaLabel}
  </a>

FAQ collapsed-details pattern (client/src/pages/roots/FAQSection.tsx):
  <details className="group bg-white rounded-xl border border-black/8" open={false}>
    <summary className="... list-none [&::-webkit-details-marker]:hidden"> ... </summary>
    <div className="px-6 pb-5 text-slate text-[15px] leading-relaxed">{a}</div>
  </details>

Spond URLs (from CONTEXT, do not alter):
  Main (League Play + 5v5): https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061
  Parent and Me ($120):     https://club.spond.com/landing/signup/nipomosc/form/7F3CC0F6316343DCB8851A6A05399DAA
  Special Needs ($50):      https://club.spond.com/landing/signup/nipomosc/form/212CA66EC0C84B88AB2BEB08FEE18ECF
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build per-language content objects</name>
  <files>client/src/pages/landing/landingContent.ts</files>
  <action>
Create client/src/pages/landing/landingContent.ts exporting a typed LandingContent interface plus two content objects: enContent (English) and esContent (Spanish). Structure the type to cover every section the shared layout renders so design changes apply to both languages from one component.

Export the Spond URL constants:
  export const SPOND_MAIN = "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061";
  export const SPOND_PARENT_AND_ME = "https://club.spond.com/landing/signup/nipomosc/form/7F3CC0F6316343DCB8851A6A05399DAA";
  export const SPOND_SPECIAL_NEEDS = "https://club.spond.com/landing/signup/nipomosc/form/212CA66EC0C84B88AB2BEB08FEE18ECF";

LandingContent interface should include: docTitle, ctaLabel, hero { headline, subhead, urgency }, valueProps (string array), pricing { heading, fromLine, tiersLine, urgency, scholarshipsLine, parentAndMe, specialNeeds }, ages { heading, leaguePlay, fiveVFive, note }, howItWorks (array of { step, text }), faqs (array of { q, a }), finalCta { heading, urgency }, secondaryLinks { parentAndMeLabel, specialNeedsLabel }, footerContact.

EN content uses the exact verified facts from CONTEXT:
- Hero headline conveys registration is open for the fall season, Saturday games in Nipomo, Pre-K through 12th grade. Subhead notes the season runs August through November. Urgency: "Prices go up August 1."
- Value props (exact ad promises): "Up to 16 games per season, 20 or more for the 5v5 teen league" / "Trained, paid referees at every game from 1st grade up, new this season" / "Balanced teams: every player evaluated at Kickoff Day so games stay close" / "Custom jersey, Photo Day, and a medal or trophy run to end the season" / "Every game close to home in Nipomo".
- Pricing: fromLine "From $150", tiersLine "$150 Early Bird, $175 Regular, $200 Late", urgency "Prices go up after July 31", scholarshipsLine "Scholarships available because every kid in Nipomo deserves a team", parentAndMe "Parent and Me is $120 flat", specialNeeds "Special Needs is $50 flat".
- Ages: leaguePlay "League Play: Pre-K through 6th grade. Weekly practices plus Saturday games." / fiveVFive "5v5: 7th through 12th grade. No practices, just games twice a week." / note "Both register through the same form below."
- How it works (3 steps): "Register in about two minutes on Spond" / "Come to Kickoff Day for a player evaluation and team formation" / "The season kicks off in August with games every Saturday through early November".
- FAQ (4 to 5 plain-string items): When is the season? (August through November) / Where are games played? (in Nipomo; answer must NOT name specific fields) / What is included in registration? / What if my kid has never played? / What if I cannot afford it? (scholarships, email admin@nipomosoccer.com).
- ctaLabel "Register Now". docTitle "Nipomo Soccer | Fall 2026 Registration". footerContact "admin@nipomosoccer.com".

ES content is hand-written natural Spanish for Mexican-American families, mirroring the approved Spanish ad voice. Use real accented characters. Anchor on these approved phrases (with proper accents): "Ya abrió la inscripción para la temporada de otoño de Nipomo Soccer", "Partidos los sábados aquí mismo en Nipomo", "El fútbol se vive en familia", "árbitros capacitados y pagados en cada partido desde 1er grado", "Equipos parejos hacen temporadas divertidas", "Hay becas disponibles porque cada niño de Nipomo merece un equipo", "Los precios suben después del 31 de julio". ctaLabel "Inscribe a tu hijo". docTitle "Nipomo Soccer | Inscripción Otoño 2026". The "becas disponibles" line MUST appear. This is NOT a literal translation; write it neighbor-to-neighbor.

HARD CONSTRAINTS for all copy in this file:
- The word ROOTS must NOT appear anywhere.
- NO em dashes and NO double hyphens in any copy string. Restructure instead. The shorthand in this plan is not literal; never put a double hyphen in an actual content string.
- Customer-facing brand is "Nipomo Soccer".
- Do not name specific field locations anywhere.
- Never position against AYSO or any competitor.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && npm run check 2>&1 | tail -3 && test -z "$(grep ROOTS client/src/pages/landing/landingContent.ts)" && grep -q "534965DA898B4B7E9CC0A589047F6061" client/src/pages/landing/landingContent.ts && grep -q "becas disponibles" client/src/pages/landing/landingContent.ts && echo CONTENT_OK</automated>
  </verify>
  <done>landingContent.ts exists, exports LandingContent type plus enContent/esContent plus the three SPOND_ constants. tsc passes. No "ROOTS" string, no double hyphens, no em dashes in copy. ES content includes "becas disponibles".</done>
</task>

<task type="auto">
  <name>Task 2: Build the shared LandingPage layout</name>
  <files>client/src/pages/landing/LandingPage.tsx</files>
  <action>
Create client/src/pages/landing/LandingPage.tsx: a single mobile-first layout component that takes a LandingContent prop and renders the full page. It does NOT use the site Header, Navbar, or Footer components.

Props signature: export default function LandingPage({ content }: { content: LandingContent }).

On mount, run the useEffect idiom from Compare.tsx: window.scrollTo(0, 0) and set document.title to content.docTitle.

Sections, top to bottom (mobile-first, then md: breakpoints):
1. Minimal header: bg-night strip with only the NSC logo (import clubLogo from "@assets/NSC_1764979848772.png"). Logo wrapped in an anchor to "/". No nav links.
2. Hero: bg-night, font-display uppercase headline (clamp sizing similar to roots HeroSection, e.g. text-[clamp(40px,8vw,84px)]), subhead in warmwhite/80, urgency line in gold, and the primary CTA anchor (use a reusable inline CtaButton that points href to SPOND_MAIN, target _blank, rel noopener noreferrer, label content.ctaLabel). NO badge or pill above the headline. NO stat pill row.
3. Value props: paper or white background, simple responsive grid (1 col mobile, 2 col md) of content.valueProps cards. Plain cards, no border-left accent stripes wider than 1px.
4. Pricing: heading, fromLine prominent, tiersLine, urgency in crimson, scholarshipsLine, then the Parent and Me and Special Needs lines.
5. Ages strip: content.ages.leaguePlay and fiveVFive in two simple blocks plus the note. This is also where the secondary Spond links live: a small Parent and Me link to SPOND_PARENT_AND_ME and a small Special Needs link to SPOND_SPECIAL_NEEDS (text links or small cards, target _blank rel noopener noreferrer, NOT competing primary buttons). Use content.secondaryLinks labels.
6. How it works: 3 numbered steps from content.howItWorks.
7. FAQ: map content.faqs to the collapsed <details open={false}> pattern from FAQSection.tsx (chevron svg with group-open:rotate-180). All collapsed by default; never auto-open the first.
8. Final CTA: bg-night, content.finalCta.heading, urgency line, repeat the primary CTA button.
9. Light footer: bg-night, content.footerContact email as a mailto link, and a link to "/privacy". No other site links.

Reuse the primary CTA anchor pattern at least twice (hero + final CTA). Keep it mobile-first: large tap targets, comfortable spacing, single-column default. Use only existing Tailwind tokens (crimson, gold, night, warmwhite, slate, paper). No new CSS file and no new binary assets.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && npm run check 2>&1 | tail -3 && grep -c "534965DA898B4B7E9CC0A589047F6061\|SPOND_MAIN" client/src/pages/landing/LandingPage.tsx && grep -q "open={false}" client/src/pages/landing/LandingPage.tsx && test -z "$(grep ROOTS client/src/pages/landing/LandingPage.tsx)" && echo LAYOUT_OK</automated>
  </verify>
  <done>LandingPage.tsx renders all 9 sections from a LandingContent prop, no site Header/Navbar/Footer, primary CTA points at SPOND_MAIN and opens in a new tab, secondary links point at Parent and Me and Special Needs forms, FAQ details all collapsed, tsc passes, no "ROOTS" string.</done>
</task>

<task type="auto">
  <name>Task 3: Wire the two route pages and register routes</name>
  <files>client/src/pages/landing/FallLanding.tsx, client/src/pages/landing/FutbolLanding.tsx, client/src/App.tsx</files>
  <action>
Create the two thin route components and register them.

client/src/pages/landing/FallLanding.tsx:
  import LandingPage from "./LandingPage";
  import { enContent } from "./landingContent";
  export default function FallLanding() { return <LandingPage content={enContent} />; }

client/src/pages/landing/FutbolLanding.tsx:
  import LandingPage from "./LandingPage";
  import { esContent } from "./landingContent";
  export default function FutbolLanding() { return <LandingPage content={esContent} />; }

Edit client/src/App.tsx:
- Add two imports near the other page imports:
    import FallLanding from "@/pages/landing/FallLanding";
    import FutbolLanding from "@/pages/landing/FutbolLanding";
- Add two flat routes inside the Switch, before the catch-all <Route component={NotFound} />:
    <Route path="/fall" component={FallLanding} />
    <Route path="/futbol" component={FutbolLanding} />

Do not touch any other routes or the nested /roots or /challenge blocks. Do not modify /roots/5v5.

GIT HYGIENE (critical): the working tree has unrelated in-progress edits (client/src/components/challenge/*, client/src/hooks/use-submissions.tsx, server/challengeRoutes.ts, shared/*, deleted .planning/HANDOFF.md). When committing, stage ONLY these explicit paths by name: client/src/pages/landing/landingContent.ts, client/src/pages/landing/LandingPage.tsx, client/src/pages/landing/FallLanding.tsx, client/src/pages/landing/FutbolLanding.tsx, client/src/App.tsx, and the plan/summary files under .planning/quick/260611-vza-*. NEVER run git add -A or git add . Never stage, commit, or revert the unrelated challenge edits or the deleted HANDOFF.md.
  </action>
  <verify>
    <automated>cd /Users/johnnypage/Projects/nipomo-soccer-website && npm run check 2>&1 | tail -3 && grep -q 'path="/fall"' client/src/App.tsx && grep -q 'path="/futbol"' client/src/App.tsx && grep -q "FallLanding" client/src/App.tsx && grep -q "FutbolLanding" client/src/App.tsx && npm run build 2>&1 | tail -5 && echo ROUTES_OK</automated>
  </verify>
  <done>/fall and /futbol routes registered in App.tsx pointing at the new components. FallLanding renders enContent, FutbolLanding renders esContent. tsc passes and npm run build succeeds. No unrelated files staged or modified.</done>
</task>

</tasks>

<verification>
- npm run check (tsc) passes with the four new files plus the App.tsx edit.
- npm run build succeeds.
- Manually load /fall and /futbol in dev: both render with NSC logo only (no site nav), all sections present, primary CTA opens SPOND_MAIN in a new tab, FAQ items start collapsed.
- /futbol copy is fully Spanish with accents and contains the "becas disponibles" line.
- The word ROOTS appears on neither page; no em dashes or double hyphens in rendered copy.
- git status shows only the intended new landing files and App.tsx as staged for this work; the unrelated challenge edits remain untouched and unstaged.
</verification>

<success_criteria>
- Two new Wouter routes (/fall English, /futbol Spanish) render focused, mobile-first conversion landing pages.
- Shared LandingPage layout driven by per-language content objects so design changes apply to both.
- Primary CTA on both pages opens the main Spond registration form in a new tab; secondary links cover Parent and Me and Special Needs.
- Brand-compliant: existing Tailwind tokens, font-display headlines, no hero pills, no stat pills, no wide accent stripes, no ROOTS wording, no em/double dashes, no competitor positioning, no named field locations.
- No new npm packages, no new binary assets, no pixel/tracking changes.
- Only the intended files committed; unrelated in-progress working-tree edits left untouched.
</success_criteria>

<output>
After completion, create `.planning/quick/260611-vza-en-es-meta-ads-landing-pages-fall-and-fu/260611-vza-SUMMARY.md`
</output>
