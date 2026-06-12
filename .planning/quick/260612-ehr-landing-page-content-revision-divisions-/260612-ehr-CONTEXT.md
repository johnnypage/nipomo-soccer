# Quick Task 260612-ehr: Landing Page Content Revision - Context

**Gathered:** 2026-06-12
**Status:** Ready for planning

<domain>
## Task Boundary

Content and structure revision of the /fall and /futbol landing pages (client/src/pages/landing/). Johnny's feedback:
1. Kill all "real X" copy ("real teams", "real season", "real referees") -- say what we actually put on instead.
2. Hero subhead becomes a fuller program paragraph plus a "No tryouts" reassurance line.
3. NEW divisions section: all four divisions with descriptions and pricing, every CTA going to the matching Spond registration form. This RETIRES the standalone Pricing section and the "Find your age group" section (their info moves into the cards -- no duplicate sections).
4. NEW season-at-a-glance section with League Play key dates.
5. Photo band 1 swaps to /roots-photo-band.jpg (wide practice-field shot with hills, already in client/public).
6. "How it works" section is REMOVED (the season timeline supersedes it; its "two minutes on Spond" point moves into the divisions intro).

ALL COPY BELOW IS LOCKED -- use exactly as written (typographic details like the section layout are the executor's craft within the established dark athletic system).

</domain>

<decisions>
## New page structure (section order)

1. Sticky header (unchanged)
2. Hero with photo rotation (copy updated below)
3. Sponsor marquee (unchanged)
4. Divisions (NEW -- replaces "Find your age group" AND "Pricing")
5. Season at a glance (NEW)
6. Value props (copy updated below)
7. Photo band 1 (new image /roots-photo-band.jpg, copy updated below)
8. FAQ (unchanged content, all collapsed)
9. Photo band 2 (same image /landing-band-lights.jpg, copy updated below)
10. Final CTA (unchanged)
11. Footer (unchanged)

REMOVED sections: Pricing, Find your age group, How it works. Remove their content fields from LandingContent (pricing, ages, howItWorks) -- scholarships and urgency lines move into the divisions section fields below.

## Interface changes (LandingContent)

- hero gains `noTryouts: string`
- ADD `divisions: { heading: string; sub: string; urgency: string; scholarships: string; cards: { title: string; age: string; body: string; price: string; priceNote?: string; cta: string; href: string }[] }`
- ADD `season: { heading: string; sub: string; milestones: { title: string; body: string }[] }`
- REMOVE `pricing`, `ages`, `howItWorks`
- `secondaryLinks` field is also removed (Parent and Me / Special Needs links are now division cards)

## EN copy (exact)

hero.subhead: "Nipomo Soccer's recreational fall season is open for registration. Players ages 2 through high school, up to 16 games, paid referees, and a community of families and coaches that makes game day the best part of the week."
hero.noTryouts: "No tryouts. No experience required. Just show up ready to play."
(hero.headline and hero.urgency unchanged)

valueProps (only the first body changes; titles and other bodies unchanged):
- UP TO 16 GAMES / "Saturday games plus midweek matchups, August through November."

band1 (image /roots-photo-band.jpg): line "The best part of the week happens on the field" / sub "Families, coaches, and a whole town that shows up every Saturday."

band2 (image unchanged): line "A season your kid will remember" / sub "First whistle in August. Medals and trophies in November."

divisions:
- heading: "Find your division"
- sub: "Four divisions, one quick registration. It takes about two minutes on Spond."
- urgency: "Prices go up after July 31."
- scholarships: "Scholarships available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com."
- cards:
  1. title "PARENT & ME" / age "Ages 2 to 3" / body "Your first introduction to soccer, together. Saturday sessions with your child on the field. No practices, no competition, just fun." / price "$120 flat" / cta "Register for Parent and Me" / href SPOND_PARENT_AND_ME
  2. title "LEAGUE PLAY" / age "Pre-K through 6th grade" / body "The heart of the fall season. Weekly practices, Saturday games, midweek matches, and an end-of-season tournament for older divisions. Up to 16 games per team." / price "$150 / $175 / $200" / priceNote "Early Bird / Regular / Late" / cta "Register for League Play" / href SPOND_MAIN
  3. title "5V5" / age "7th through 12th grade" / body "No practices. Just games. Fast paced 5v5 soccer twice a week for middle school and high school players. Over 20 games per season." / price "$150 / $175 / $200" / priceNote "Early Bird / Regular / Late" / cta "Register for 5v5" / href SPOND_MAIN
  4. title "SPECIAL NEEDS" / age "All ages" / body "Drills and scrimmages with accommodations based on player needs. Every session is designed so every player can participate and have fun. Ten Saturday sessions, with kit, insurance, and a participation medal included." / price "$50 flat" / cta "Register for Special Needs" / href SPOND_SPECIAL_NEEDS

season:
- heading: "The season at a glance"
- sub: "Here is what the fall looks like for League Play."
- milestones:
  1. "Kickoff Days: August 1 and 8" / "Every player attends one. Pickup style games so we can build balanced teams, plus jersey fitting. Not a tryout. Every kid plays."
  2. "Pre-Season: August 10 to September 7" / "Two weeks of weekday practices, then two scrimmage Saturdays while teams get settled and jerseys arrive."
  3. "Regular Season: September 12 to October 31" / "Eight weeks of Saturday games plus midweek matchups, with live standings for 1st grade and up."
  4. "Tournament: November 7" / "End-of-season tournament for 3rd through 6th grade, seeded by standings. At least two games per team."

## ES copy (exact -- hand-written, not literal translation)

hero.subhead: "Ya abrió la inscripción para la temporada recreativa de otoño de Nipomo Soccer. Jugadores desde los 2 años hasta high school, hasta 16 partidos, árbitros pagados y una comunidad de familias y entrenadores que hace del día de partido lo mejor de la semana."
hero.noTryouts: "Sin pruebas. Sin experiencia previa. Solo llega listo para jugar."

valueProps first body: "Partidos los sábados y entre semana, de agosto a noviembre."

band1: line "Lo mejor de la semana pasa en la cancha" / sub "Familias, entrenadores y todo un pueblo que llega cada sábado."
band2: line "Una temporada que tu hijo va a recordar" / sub "Primer silbatazo en agosto. Medallas y trofeos en noviembre."

divisions:
- heading: "Encuentra tu división"
- sub: "Cuatro divisiones, una inscripción rápida. Toma unos dos minutos en Spond."
- urgency: "Los precios suben después del 31 de julio."
- scholarships: "Hay becas disponibles porque cada niño de Nipomo merece un equipo. Escribe a admin@nipomosoccer.com."
- cards:
  1. "PARENT & ME" / "De 2 a 3 años" / "Tu primera introducción al fútbol, juntos. Sesiones los sábados con tu hijo en la cancha. Sin prácticas, sin competencia, pura diversión." / "$120 fijo" / "Inscríbete en Parent and Me"
  2. "LEAGUE PLAY" / "De Pre-K a 6to grado" / "El corazón de la temporada de otoño. Práctica semanal, partidos los sábados, partidos entre semana y un torneo de fin de temporada para las divisiones mayores. Hasta 16 partidos por equipo." / "$150 / $175 / $200" / priceNote "Temprana / Regular / Tardía" / "Inscríbete en League Play"
  3. "5V5" / "De 7mo a 12vo grado" / "Sin prácticas. Solo partidos. Fútbol 5v5 rápido dos veces por semana para jugadores de middle school y high school. Más de 20 partidos por temporada." / "$150 / $175 / $200" / priceNote "Temprana / Regular / Tardía" / "Inscríbete en 5v5"
  4. "SPECIAL NEEDS" / "Todas las edades" / "Ejercicios y partidos amistosos con adaptaciones según las necesidades de cada jugador. Cada sesión está diseñada para que todos participen y se diviertan. Diez sesiones los sábados, con uniforme, seguro y medalla de participación incluidos." / "$50 fijo" / "Inscríbete en Special Needs"

season:
- heading: "La temporada de un vistazo"
- sub: "Así se ve el otoño para League Play."
- milestones:
  1. "Kickoff Days: 1 y 8 de agosto" / "Cada jugador asiste a uno. Partidos estilo cascarita para formar equipos parejos, más la medición del jersey. No es una prueba. Todos los niños juegan."
  2. "Pretemporada: del 10 de agosto al 7 de septiembre" / "Dos semanas de prácticas entre semana y luego dos sábados de partidos amistosos mientras los equipos se acomodan y llegan los jerseys."
  3. "Temporada regular: del 12 de septiembre al 31 de octubre" / "Ocho semanas de partidos los sábados más partidos entre semana, con tabla de posiciones en vivo desde 1er grado."
  4. "Torneo: 7 de noviembre" / "Torneo de fin de temporada de 3ro a 6to grado, sembrado por la tabla. Mínimo dos partidos por equipo."

## Design treatment (within the established system)

- Divisions: 2x2 card grid on desktop, single column mobile. Dark cards (bg-white/5, border-warmwhite/10, rounded-xl) with display-font uppercase titles, gold age line, body in warmwhite/70, price in display font crimson or gold, full-width crimson CTA button per card opening the Spond href in a new tab (SpondClick fires automatically). data-testid="division-{parent-and-me|league-play|5v5|special-needs}". Urgency line near the heading in gold; scholarships line in warmwhite/60 below the grid.
- Season: vertical timeline or stacked milestone cards (executor's craft) on the alternate panel color, milestone titles bold warmwhite, bodies warmwhite/70.
- NOTE: the word "5v5" is now ALLOWED on the page (it is the division's name, presented with its description). The internal program name (R-O-O-T-S) is still banned, as are em dashes and double hyphens in copy.
- The grep gate from previous tasks changes: drop the "no 5v5" gate; keep the internal-program-name gate.

## Code constraints

- Files: client/src/pages/landing/landingContent.ts and LandingPage.tsx ONLY.
- Git hygiene unchanged: stage only these two files by explicit path; never git add -A; never touch challenge WIP.
- Gates: `npm run build` passes; `grep -rni "roots" client/src/pages/landing/` clean (except the /roots-photo-band.jpg asset path, which is a filename and allowed); both language objects satisfy the updated interface.

</decisions>

<canonical_refs>
- Season dates source: programs/roots/season-schedule.md and client/src/pages/roots/Recreational.tsx (Season overview section) -- already distilled into the locked copy above
- Division facts source: client/src/pages/roots/DivisionSection.tsx -- already distilled above
- Band 1 image: client/public/roots-photo-band.jpg (exists)
</canonical_refs>
