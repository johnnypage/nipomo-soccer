// Per-language content for the Meta-ads conversion landing pages (/fall EN, /futbol ES).
// Both languages share one layout (LandingPage.tsx) and differ only in this content.
//
// HARD COPY RULES (do not break):
// - The customer-facing brand is "Nipomo Soccer". The internal program name must never appear here.
// - No em dashes and no double hyphens in any copy string. Restructure sentences instead.
// - Never name specific field locations.
// - Never position against any other organization.

export const SPOND_MAIN =
  "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061";
export const SPOND_PARENT_AND_ME =
  "https://club.spond.com/landing/signup/nipomosc/form/7F3CC0F6316343DCB8851A6A05399DAA";
export const SPOND_SPECIAL_NEEDS =
  "https://club.spond.com/landing/signup/nipomosc/form/212CA66EC0C84B88AB2BEB08FEE18ECF";

export interface LandingContent {
  lang: "en" | "es";
  docTitle: string;
  ctaLabel: string;
  // Optional override for the primary CTA destination (header + hero + final CTA).
  // Falls back to SPOND_MAIN when omitted, so /fall and /futbol are unaffected.
  ctaHref?: string;
  hero: {
    headline: string;
    subhead: string;
    urgency: string;
  };
  // Optional "how it works" explainer (numbered cards). Only renders when present,
  // so existing landing pages that omit it are unaffected.
  formatExplainer?: {
    heading: string;
    sub?: string;
    steps: { title: string; body: string }[];
  };
  valuePropsHeading: string;
  valueProps: { title: string; body: string }[];
  band2: { line: string; sub: string };
  sponsors: { heading: string; sub: string };
  divisions: {
    heading: string;
    sub: string;
    urgency: string;
    scholarships: string;
    cards: {
      title: string;
      age: string;
      body: string;
      price: string;
      priceNote?: string;
      cta: string;
      href: string;
    }[];
  };
  season: {
    heading: string;
    sub: string;
    milestones: { name: string; dates: string; body: string }[];
  };
  faqHeading: string;
  faqs: { q: string; a: string }[];
  finalCta: {
    heading: string;
    urgency: string;
  };
  footerContact: string;
  footerPrivacyLabel: string;
}

export const enContent: LandingContent = {
  lang: "en",
  docTitle: "Nipomo Soccer | Fall 2026 Registration",
  ctaLabel: "Register Now",
  hero: {
    headline: "Fall soccer starts here",
    subhead:
      "Nipomo Soccer's recreational fall season is open for registration. Ages 2 through high school. No tryouts. No experience required. Just show up ready to play.",
    urgency: "Register today and save.",
  },
  valuePropsHeading: "What you get",
  valueProps: [
    {
      title: "UP TO 16 GAMES",
      body: "Games on Saturdays and the occasional midweek match, with live standings on nipomosc.org from 1st grade up.",
    },
    {
      title: "PAID REFEREES",
      body: "Trained and paid referees at every game from 1st grade up. New this season.",
    },
    {
      title: "BALANCED TEAMS",
      body: "Every player evaluated at Kickoff Day so games stay close all season.",
    },
    {
      title: "EVERY KID PLAYS",
      body: "Playing time rewards practice attendance, and every player gets meaningful minutes in every game.",
    },
    {
      title: "THE FULL KIT",
      body: "Custom jersey, Photo Day, and a medal or trophy to close out the season.",
    },
    { title: "CLOSE TO HOME", body: "Every game right here in Nipomo." },
  ],
  band2: {
    line: "A season your kid will remember",
    sub: "First whistle in August. Medals and trophies in November.",
  },
  sponsors: {
    heading: "Sponsored by Nipomo businesses",
    sub: "Local sponsors help keep the season affordable for every family.",
  },
  divisions: {
    heading: "Find your division",
    sub: "Four divisions, one quick registration. It takes about two minutes on Spond.",
    urgency: "Prices go up after July 31.",
    scholarships:
      "Scholarships available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com.",
    cards: [
      {
        title: "PARENT & ME",
        age: "Ages 2 to 3",
        body: "Your first introduction to soccer, together. Saturday sessions with your child on the field. No practices, no competition, just fun.",
        price: "$120 flat",
        cta: "Register for Parent and Me",
        href: SPOND_PARENT_AND_ME,
      },
      {
        title: "LEAGUE PLAY",
        age: "Pre-K through 6th grade",
        body: "The heart of the fall season. Weekly practices with games on Saturdays and the occasional midweek match. We are emphasizing more games this year so kids get more touches and have more fun. The 3rd through 6th grade divisions close the season with a tournament.",
        price: "$150 / $175 / $200",
        priceNote: "Early Bird / Regular / Late",
        cta: "Register for League Play",
        href: SPOND_MAIN,
      },
      {
        title: "5V5",
        age: "7th through 12th grade",
        body: "No practices. Just games. Fast paced 5v5 soccer twice a week for middle school and high school players. Over 20 games per season.",
        price: "$150 / $175 / $200",
        priceNote: "Early Bird / Regular / Late",
        cta: "Register for 5v5",
        href: SPOND_MAIN,
      },
      {
        title: "SPECIAL NEEDS",
        age: "All ages",
        body: "Drills and scrimmages with accommodations based on player needs. Every session is designed so every player can participate and have fun. Ten Saturday sessions, with kit and participation medal included.",
        price: "$50 flat",
        cta: "Register for Special Needs",
        href: SPOND_SPECIAL_NEEDS,
      },
    ],
  },
  season: {
    heading: "The season at a glance",
    sub: "Here is what the fall looks like for League Play.",
    milestones: [
      {
        name: "Kickoff Days",
        dates: "Aug 1 and 8",
        body: "Every player attends one. Pickup style games so we can build balanced teams, plus jersey fitting. Not a tryout. Every kid plays.",
      },
      {
        name: "Pre-Season",
        dates: "Aug 10 to Sep 7",
        body: "Two weeks of weekday practices, then two scrimmage Saturdays while teams get settled and jerseys arrive.",
      },
      {
        name: "Regular Season",
        dates: "Sep 12 to Oct 31",
        body: "Eight weeks of Saturday games plus midweek matchups, with live standings for 1st grade and up.",
      },
      {
        name: "Tournament",
        dates: "Nov 7",
        body: "End-of-season tournament for 3rd through 6th grade, seeded by standings. At least two games per team.",
      },
    ],
  },
  faqHeading: "Common questions",
  faqs: [
    {
      q: "When is the season?",
      a: "The season runs August through November, with games every Saturday and a few midweek games for the older groups.",
    },
    {
      q: "Where are games played?",
      a: "Every game is played right here in Nipomo, close to home so families can show up week after week.",
    },
    {
      q: "What's included in registration?",
      a: "A custom jersey, Photo Day, trained and paid referees from 1st grade up, balanced teams, and a medal or trophy run to close out the season.",
    },
    {
      q: "What if my kid has never played?",
      a: "Beginners are welcome. There are no tryouts. Players are evaluated at Kickoff Day so teams stay balanced and every kid gets a fair chance to grow.",
    },
    {
      q: "When are practices?",
      a: "League Play teams practice on weekdays. Your coach sets the day and time after teams form at Kickoff Day.",
    },
    {
      q: "What does my player need?",
      a: "Cleats, shin guards, and water. The custom jersey is included with registration and fitted at Kickoff Day.",
    },
    {
      q: "Can we register late?",
      a: "Yes. Late registration stays open through August 29. Registering early costs less and helps us build balanced teams at Kickoff Day.",
    },
    {
      q: "What if I can't afford it?",
      a: "Scholarships are available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com and we'll help.",
    },
  ],
  finalCta: {
    heading: "Lock in your spot for fall",
    urgency: "Prices go up after July 31. Register today.",
  },
  footerContact: "admin@nipomosoccer.com",
  footerPrivacyLabel: "Privacy",
};

export const esContent: LandingContent = {
  lang: "es",
  docTitle: "Nipomo Soccer | Inscripción Otoño 2026",
  ctaLabel: "Inscribe a tu hijo",
  hero: {
    headline: "El fútbol de otoño empieza aquí",
    subhead:
      "Ya abrió la inscripción para la temporada recreativa de otoño de Nipomo Soccer. De 2 años hasta high school. Sin pruebas. Sin experiencia previa. Solo llega listo para jugar.",
    urgency: "Inscríbete hoy y ahorra.",
  },
  valuePropsHeading: "Lo que incluye",
  valueProps: [
    {
      title: "HASTA 16 PARTIDOS",
      body: "Partidos los sábados y de vez en cuando entre semana, con tabla de posiciones en vivo en nipomosc.org desde 1er grado.",
    },
    {
      title: "ÁRBITROS PAGADOS",
      body: "Árbitros capacitados y pagados en cada partido desde 1er grado. Nuevo esta temporada.",
    },
    {
      title: "EQUIPOS PAREJOS",
      body: "Cada jugador se evalúa en el Kickoff Day para que los partidos estén reñidos toda la temporada.",
    },
    {
      title: "CADA NIÑO JUEGA",
      body: "El tiempo de juego premia la asistencia a las prácticas, y cada jugador tiene minutos que cuentan en cada partido.",
    },
    {
      title: "EQUIPO COMPLETO",
      body: "Jersey personalizado, día de fotos y una medalla o trofeo para cerrar la temporada.",
    },
    { title: "CERCA DE CASA", body: "Cada partido aquí mismo en Nipomo." },
  ],
  band2: {
    line: "Una temporada que tu hijo va a recordar",
    sub: "Primer silbatazo en agosto. Medallas y trofeos en noviembre.",
  },
  sponsors: {
    heading: "Patrocinado por negocios de Nipomo",
    sub: "Los patrocinadores locales ayudan a que la temporada sea accesible para cada familia.",
  },
  divisions: {
    heading: "Encuentra tu división",
    sub: "Cuatro divisiones, una inscripción rápida. Toma unos dos minutos en Spond.",
    urgency: "Los precios suben después del 31 de julio.",
    scholarships:
      "Hay becas disponibles porque cada niño de Nipomo merece un equipo. Escribe a admin@nipomosoccer.com.",
    cards: [
      {
        title: "PARENT & ME",
        age: "De 2 a 3 años",
        body: "Tu primera introducción al fútbol, juntos. Sesiones los sábados con tu hijo en la cancha. Sin prácticas, sin competencia, pura diversión.",
        price: "$120 fijo",
        cta: "Inscríbete en Parent and Me",
        href: SPOND_PARENT_AND_ME,
      },
      {
        title: "LEAGUE PLAY",
        age: "De Pre-K a 6to grado",
        body: "El corazón de la temporada de otoño. Práctica semanal con partidos los sábados y de vez en cuando un partido entre semana. Este año apostamos por más partidos para que los niños tengan más toques de balón y más diversión. Las divisiones de 3ro a 6to grado cierran la temporada con un torneo.",
        price: "$150 / $175 / $200",
        priceNote: "Temprana / Regular / Tardía",
        cta: "Inscríbete en League Play",
        href: SPOND_MAIN,
      },
      {
        title: "5V5",
        age: "De 7mo a 12vo grado",
        body: "Sin prácticas. Solo partidos. Fútbol 5v5 rápido dos veces por semana para jugadores de middle school y high school. Más de 20 partidos por temporada.",
        price: "$150 / $175 / $200",
        priceNote: "Temprana / Regular / Tardía",
        cta: "Inscríbete en 5v5",
        href: SPOND_MAIN,
      },
      {
        title: "SPECIAL NEEDS",
        age: "Todas las edades",
        body: "Ejercicios y partidos amistosos con adaptaciones según las necesidades de cada jugador. Cada sesión está diseñada para que todos participen y se diviertan. Diez sesiones los sábados, con uniforme y medalla de participación incluidos.",
        price: "$50 fijo",
        cta: "Inscríbete en Special Needs",
        href: SPOND_SPECIAL_NEEDS,
      },
    ],
  },
  season: {
    heading: "La temporada de un vistazo",
    sub: "Así se ve el otoño para League Play.",
    milestones: [
      {
        name: "Kickoff Days",
        dates: "1 y 8 ago",
        body: "Cada jugador asiste a uno. Partidos estilo cascarita para formar equipos parejos, más la medición del jersey. No es una prueba. Todos los niños juegan.",
      },
      {
        name: "Pretemporada",
        dates: "10 ago a 7 sep",
        body: "Dos semanas de prácticas entre semana y luego dos sábados de partidos amistosos mientras los equipos se acomodan y llegan los jerseys.",
      },
      {
        name: "Temporada regular",
        dates: "12 sep a 31 oct",
        body: "Ocho semanas de partidos los sábados más partidos entre semana, con tabla de posiciones en vivo desde 1er grado.",
      },
      {
        name: "Torneo",
        dates: "7 nov",
        body: "Torneo de fin de temporada de 3ro a 6to grado, sembrado por la tabla. Mínimo dos partidos por equipo.",
      },
    ],
  },
  faqHeading: "Preguntas frecuentes",
  faqs: [
    {
      q: "¿Cuándo es la temporada?",
      a: "La temporada va de agosto a noviembre, con partidos cada sábado y algunos partidos entre semana para los grupos mayores.",
    },
    {
      q: "¿Dónde se juegan los partidos?",
      a: "Cada partido se juega aquí mismo en Nipomo, cerca de casa para que las familias asistan semana tras semana.",
    },
    {
      q: "¿Qué incluye la inscripción?",
      a: "Un jersey personalizado, día de fotos, árbitros capacitados y pagados desde 1er grado, equipos parejos y una medalla o trofeo para cerrar la temporada.",
    },
    {
      q: "¿Y si mi hijo nunca ha jugado?",
      a: "Los principiantes son bienvenidos. No hay pruebas. Los jugadores se evalúan en el Kickoff Day para que los equipos estén parejos y cada niño tenga su oportunidad de crecer.",
    },
    {
      q: "¿Cuándo son las prácticas?",
      a: "Los equipos de League Play practican entre semana. Tu entrenador define el día y la hora cuando se forman los equipos en el Kickoff Day.",
    },
    {
      q: "¿Qué necesita mi jugador?",
      a: "Tachones, espinilleras y agua. El jersey personalizado va incluido con la inscripción y se mide en el Kickoff Day.",
    },
    {
      q: "¿Podemos inscribirnos tarde?",
      a: "Sí. La inscripción tardía sigue abierta hasta el 29 de agosto. Inscribirse temprano cuesta menos y nos ayuda a formar equipos parejos en el Kickoff Day.",
    },
    {
      q: "¿Y si no me alcanza?",
      a: "Hay becas disponibles porque cada niño de Nipomo merece un equipo. Escribe a admin@nipomosoccer.com y te ayudamos.",
    },
  ],
  finalCta: {
    heading: "Aparta tu lugar para el otoño",
    urgency: "Los precios suben después del 31 de julio. Inscríbete hoy.",
  },
  footerContact: "admin@nipomosoccer.com",
  footerPrivacyLabel: "Privacidad",
};

export const fiveVFiveContent: LandingContent = {
  lang: "en",
  docTitle: "Nipomo Soccer | 5v5 Fall 2026 Registration",
  ctaLabel: "Register for 5v5",
  ctaHref: SPOND_MAIN,
  hero: {
    headline: "Five a side. Twice a week. Always in the game.",
    subhead:
      "Nipomo Soccer 5v5 is built for 7th through 12th graders. Five players a side with a keeper, two matches every game day, and no separate practices. More touches, more playing time, more soccer in less time.",
    urgency: "Fall registration is open. Prices go up after July 31.",
  },
  formatExplainer: {
    heading: "How 5v5 works",
    sub: "Quick to understand, built to keep older players in the game.",
    steps: [
      {
        title: "Five a side",
        body: "Four field players and a goalkeeper. A small grass field keeps everyone close to the ball, so every player is in the game the whole time.",
      },
      {
        title: "Two matches a game day",
        body: "Players warm up with a coach, then play two full matches against different teams. Two 12 minute halves each on a running clock. In and out in about two hours.",
      },
      {
        title: "Twice a week, no extra practices",
        body: "One weeknight and one Saturday. The coaching is built into game days, so there are no separate practices to drive to.",
      },
      {
        title: "A real season",
        body: "Ability balanced teams, refereed and scored matches, and live standings. The season ends with a tournament to crown the champions.",
      },
    ],
  },
  valuePropsHeading: "Why 5v5 fits older players",
  valueProps: [
    {
      title: "MORE TOUCHES",
      body: "A smaller field with five a side means there is nowhere to hide. Every player is on the ball constantly, so they get better every game day.",
    },
    {
      title: "BUILT FOR A TEEN SCHEDULE",
      body: "No separate practices to drive to. Show up twice a week for under two hours and that is the whole commitment. Room left for everything else a teenager has going on.",
    },
    {
      title: "EVERYONE PLAYS",
      body: "Small rosters of 7 to 8 players mean every kid is in the rotation every game day. Miss a day and you still get two matches the other day that week.",
    },
    {
      title: "A REAL LEAGUE",
      body: "Refereed and scored matches, live standings, and a season long Golden Boot race for the top scorer. Not pickup. A real league with a tournament to finish.",
    },
    {
      title: "THE FULL KIT",
      body: "A custom jersey is included, the same as every Nipomo Soccer division. Teams are identified on game days by colored pennies.",
    },
  ],
  band2: {
    line: "More soccer, less standing around",
    sub: "Five a side. Twice a week. All season long.",
  },
  sponsors: {
    heading: "Sponsored by Nipomo businesses",
    sub: "Local sponsors help keep the season affordable for every family.",
  },
  divisions: {
    heading: "Ready to play?",
    sub: "One quick registration on Spond. It takes about two minutes.",
    urgency: "Prices go up after July 31.",
    scholarships:
      "Scholarships available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com.",
    cards: [
      {
        title: "5V5",
        age: "7th through 12th grade",
        body: "Fast paced 5v5 soccer twice a week for middle school and high school players, in separate divisions. Five a side with a keeper, two matches a game day, over 20 games per season, no separate practices.",
        price: "$150 / $175 / $200",
        priceNote: "Early Bird / Regular / Late",
        cta: "Register for 5v5",
        href: SPOND_MAIN,
      },
    ],
  },
  season: {
    heading: "The season at a glance",
    sub: "Here is what fall looks like for 5v5.",
    milestones: [
      {
        name: "Kickoff Day",
        dates: "Aug 1",
        body: "Every player attends. Pickup style games so we can build balanced teams within the middle school and high school divisions, plus jersey fitting. Not a tryout. Every kid plays.",
      },
      {
        name: "Regular Season",
        dates: "Aug to Oct",
        body: "One weeknight and one Saturday each week. Two matches a game day, with live standings and a season long Golden Boot race for the top scorer.",
      },
      {
        name: "Tournament",
        dates: "Nov 7",
        body: "The season closes with a tournament to crown the champions.",
      },
    ],
  },
  faqHeading: "Common questions",
  faqs: [
    {
      q: "Why 5v5?",
      a: "Smaller sides mean every player is on the ball far more often. More touches, more shots, and more playing time, in games built to fit a packed teenage week. It is the format that keeps older players improving and in the game.",
    },
    {
      q: "Is a goalkeeper part of 5v5?",
      a: "Yes. Five players a side means four field players and a goalkeeper. The keeper is fully in the game, same as full sided soccer.",
    },
    {
      q: "Are middle school and high school players on the same teams?",
      a: "No. Middle school and high school play in separate divisions, and teams are balanced within each one, so your player competes with and against kids their own age.",
    },
    {
      q: "Are there practices during the week?",
      a: "No separate practices. Players get a coached warm up at the start of every game day, then play. Showing up twice a week for under two hours is the entire commitment.",
    },
    {
      q: "My kid plays other sports. Will this still work?",
      a: "Yes. That is exactly who 5v5 is built for. Attendance is flexible with no minimum, and if your player misses a day they still get two matches the other day that week.",
    },
    {
      q: "What if my player has never played?",
      a: "Beginners are welcome. There are no tryouts. Players are evaluated at Kickoff Day so teams stay balanced and every kid gets a fair chance to grow.",
    },
    {
      q: "Is it competitive, or just for fun?",
      a: "Both. Every match is refereed and scored, standings are live, and there is a Golden Boot race for the top scorer. The season ends with a tournament. It is a real league.",
    },
    {
      q: "What does my player need?",
      a: "Cleats, shin guards, and water. The custom jersey is included with registration and fitted at Kickoff Day.",
    },
    {
      q: "What is included, and what does it cost?",
      a: "A custom jersey, refereed and scored games, and live standings. Pricing is the same as every Nipomo Soccer division: $150 Early Bird, $175 Regular, $200 Late after July 31.",
    },
  ],
  finalCta: {
    heading: "Get in the game",
    urgency: "Prices go up after July 31. Register today.",
  },
  footerContact: "admin@nipomosoccer.com",
  footerPrivacyLabel: "Privacy",
};
