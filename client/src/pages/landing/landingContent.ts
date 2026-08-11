// Per-language content for the Meta-ads conversion landing pages (/fall EN, /futbol ES).
// Both languages share one layout (LandingPage.tsx) and differ only in this content.
//
// HARD COPY RULES (do not break):
// - The customer-facing brand is "Nipomo Soccer". The internal program name must never appear here.
// - No em dashes and no double hyphens in any copy string. Restructure sentences instead.
// - Never name specific field locations.
// - Never position against any other organization.

export interface LandingContent {
  lang: "en" | "es";
  docTitle: string;
  ctaLabel: string;
  // Destination for the primary CTA (header + hero + final CTA).
  ctaHref: string;
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
  docTitle: "Nipomo Soccer | Fall 2026 Season",
  ctaLabel: "Contact Us",
  ctaHref: "/#contact",
  hero: {
    headline: "Fall soccer starts here",
    subhead:
      "Nipomo Soccer's recreational fall season is underway. Ages 2 through 3rd grade. No tryouts. No experience required. Just show up ready to play.",
    urgency: "Registration for this season is closed.",
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
    sub: "Two divisions built for different ages and stages. Here is how this season is set up.",
    urgency: "Registration for this season is closed.",
    scholarships:
      "Scholarships available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com.",
    cards: [
      {
        title: "PARENT & ME",
        age: "Ages 2 to 3",
        body: "Your first introduction to soccer, together. Saturday sessions with your child on the field. No practices, no competition, just fun.",
        price: "$120",
        priceNote: "Fall 2026 season fee",
        cta: "Contact Us",
        href: "/#contact",
      },
      {
        title: "LEAGUE PLAY",
        age: "Pre-K through 3rd grade",
        body: "The heart of the fall season. Weekly practices with games on Saturdays and the occasional midweek match. We are emphasizing more games this year so kids get more touches and have more fun. The older divisions close the season with a tournament.",
        price: "$150 to $200",
        priceNote: "Fall 2026 season fee",
        cta: "Contact Us",
        href: "/#contact",
      },
    ],
  },
  season: {
    heading: "The season at a glance",
    sub: "Here is what the fall looks like for League Play.",
    milestones: [
      {
        name: "Kickoff Day",
        dates: "Aug 8",
        body: "Every player attends. Pickup style games so we can build balanced teams, plus jersey fitting. Not a tryout. Every kid plays.",
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
        body: "End-of-season tournament for older divisions, seeded by standings. At least two games per team.",
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
      q: "Can we still register?",
      a: "No. Registration for this season is closed and the season is already underway. Get in touch and we will let you know as soon as the next season opens.",
    },
    {
      q: "What if I can't afford it?",
      a: "Scholarships are available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com and we'll help.",
    },
  ],
  finalCta: {
    heading: "Want in next season?",
    urgency: "Registration for this season is closed. Reach out and we will keep you posted.",
  },
  footerContact: "admin@nipomosoccer.com",
  footerPrivacyLabel: "Privacy",
};

export const esContent: LandingContent = {
  lang: "es",
  docTitle: "Nipomo Soccer | Temporada Otoño 2026",
  ctaLabel: "Contáctanos",
  ctaHref: "/#contact",
  hero: {
    headline: "El fútbol de otoño empieza aquí",
    subhead:
      "La temporada recreativa de otoño de Nipomo Soccer ya está en marcha. De 2 años hasta 3er grado. Sin pruebas. Sin experiencia previa. Solo llega listo para jugar.",
    urgency: "La inscripción para esta temporada está cerrada.",
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
    sub: "Dos divisiones para diferentes edades y etapas. Así está organizada esta temporada.",
    urgency: "La inscripción para esta temporada está cerrada.",
    scholarships:
      "Hay becas disponibles porque cada niño de Nipomo merece un equipo. Escribe a admin@nipomosoccer.com.",
    cards: [
      {
        title: "PARENT & ME",
        age: "De 2 a 3 años",
        body: "Tu primera introducción al fútbol, juntos. Sesiones los sábados con tu hijo en la cancha. Sin prácticas, sin competencia, pura diversión.",
        price: "$120",
        priceNote: "Cuota de la temporada Otoño 2026",
        cta: "Contáctanos",
        href: "/#contact",
      },
      {
        title: "LEAGUE PLAY",
        age: "De Pre-K a 3er grado",
        body: "El corazón de la temporada de otoño. Práctica semanal con partidos los sábados y de vez en cuando un partido entre semana. Este año apostamos por más partidos para que los niños tengan más toques de balón y más diversión. Las divisiones mayores cierran la temporada con un torneo.",
        price: "$150 a $200",
        priceNote: "Cuota de la temporada Otoño 2026",
        cta: "Contáctanos",
        href: "/#contact",
      },
    ],
  },
  season: {
    heading: "La temporada de un vistazo",
    sub: "Así se ve el otoño para League Play.",
    milestones: [
      {
        name: "Kickoff Day",
        dates: "8 ago",
        body: "Cada jugador asiste. Partidos estilo cascarita para formar equipos parejos, más la medición del jersey. No es una prueba. Todos los niños juegan.",
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
        body: "Torneo de fin de temporada para las divisiones mayores, sembrado por la tabla. Mínimo dos partidos por equipo.",
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
      q: "¿Todavía podemos inscribirnos?",
      a: "No. La inscripción para esta temporada está cerrada y la temporada ya comenzó. Contáctanos y te avisamos en cuanto abra la siguiente temporada.",
    },
    {
      q: "¿Y si no me alcanza?",
      a: "Hay becas disponibles porque cada niño de Nipomo merece un equipo. Escribe a admin@nipomosoccer.com y te ayudamos.",
    },
  ],
  finalCta: {
    heading: "¿Quieres entrar la próxima temporada?",
    urgency: "La inscripción para esta temporada está cerrada. Contáctanos y te mantenemos al tanto.",
  },
  footerContact: "admin@nipomosoccer.com",
  footerPrivacyLabel: "Privacidad",
};
