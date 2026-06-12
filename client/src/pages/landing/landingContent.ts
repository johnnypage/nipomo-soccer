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
  hero: {
    headline: string;
    subhead: string;
    urgency: string;
  };
  valueProps: string[];
  pricing: {
    heading: string;
    fromLine: string;
    tiersLine: string;
    urgency: string;
    scholarshipsLine: string;
    parentAndMe: string;
    specialNeeds: string;
  };
  ages: {
    heading: string;
    leaguePlay: string;
    fiveVFive: string;
    note: string;
  };
  howItWorks: { heading: string; steps: { step: number; text: string }[] };
  faqs: { q: string; a: string }[];
  finalCta: {
    heading: string;
    urgency: string;
  };
  secondaryLinks: {
    parentAndMeLabel: string;
    specialNeedsLabel: string;
  };
  footerContact: string;
}

export const enContent: LandingContent = {
  lang: "en",
  docTitle: "Nipomo Soccer | Fall 2026 Registration",
  ctaLabel: "Register Now",
  hero: {
    headline: "Fall soccer is back in Nipomo",
    subhead:
      "Registration is open for the fall season. Saturday games right here in Nipomo, for Pre-K through 12th grade. The season runs August through November.",
    urgency: "Prices go up August 1.",
  },
  valueProps: [
    "Up to 16 games per season, 20 or more for the 5v5 teen league",
    "Trained, paid referees at every game from 1st grade up, new this season",
    "Balanced teams: every player evaluated at Kickoff Day so games stay close",
    "Custom jersey, Photo Day, and a medal or trophy run to end the season",
    "Every game close to home in Nipomo",
  ],
  pricing: {
    heading: "Pricing",
    fromLine: "From $150",
    tiersLine: "$150 Early Bird, $175 Regular, $200 Late",
    urgency: "Prices go up after July 31",
    scholarshipsLine:
      "Scholarships available because every kid in Nipomo deserves a team",
    parentAndMe: "Parent and Me is $120 flat",
    specialNeeds: "Special Needs is $50 flat",
  },
  ages: {
    heading: "Find your age group",
    leaguePlay:
      "League Play: Pre-K through 6th grade. Weekly practices plus Saturday games.",
    fiveVFive:
      "5v5: 7th through 12th grade. No practices, just games twice a week.",
    note: "Both register through the same form below.",
  },
  howItWorks: {
    heading: "How it works",
    steps: [
      { step: 1, text: "Register in about two minutes on Spond." },
      {
        step: 2,
        text: "Come to Kickoff Day for a player evaluation and team formation.",
      },
      {
        step: 3,
        text: "The season kicks off in August with games every Saturday through early November.",
      },
    ],
  },
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
      q: "What is included in registration?",
      a: "A custom jersey, Photo Day, trained and paid referees from 1st grade up, balanced teams, and a medal or trophy run to close out the season.",
    },
    {
      q: "What if my kid has never played?",
      a: "Beginners are welcome. There are no tryouts. Players are evaluated at Kickoff Day so teams stay balanced and every kid gets a fair chance to grow.",
    },
    {
      q: "What if I cannot afford it?",
      a: "Scholarships are available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com and we will help.",
    },
  ],
  finalCta: {
    heading: "Lock in your spot for fall",
    urgency: "Prices go up August 1. Register today.",
  },
  secondaryLinks: {
    parentAndMeLabel: "Parent and Me, ages 2 to 3, $120 flat",
    specialNeedsLabel: "Special Needs, all ages, $50 flat",
  },
  footerContact: "admin@nipomosoccer.com",
};

export const esContent: LandingContent = {
  lang: "es",
  docTitle: "Nipomo Soccer | Inscripción Otoño 2026",
  ctaLabel: "Inscribe a tu hijo",
  hero: {
    headline: "El fútbol de otoño regresa a Nipomo",
    subhead:
      "Ya abrió la inscripción para la temporada de otoño de Nipomo Soccer. Partidos los sábados aquí mismo en Nipomo, desde Pre-K hasta 12vo grado. La temporada va de agosto a noviembre.",
    urgency: "Los precios suben el 1 de agosto.",
  },
  valueProps: [
    "Hasta 16 partidos por temporada, 20 o más para la liga 5v5 de jóvenes",
    "Árbitros capacitados y pagados en cada partido desde 1er grado, nuevo esta temporada",
    "Equipos parejos: cada jugador se evalúa en el Kickoff Day para que los partidos estén reñidos",
    "Jersey personalizado, día de fotos y una medalla o trofeo para cerrar la temporada",
    "Cada partido cerca de casa, aquí en Nipomo",
  ],
  pricing: {
    heading: "Precios",
    fromLine: "Desde $150",
    tiersLine: "$150 temprano, $175 regular, $200 tardío",
    urgency: "Los precios suben después del 31 de julio",
    scholarshipsLine:
      "Hay becas disponibles porque cada niño de Nipomo merece un equipo",
    parentAndMe: "Parent and Me cuesta $120 fijo",
    specialNeeds: "Special Needs cuesta $50 fijo",
  },
  ages: {
    heading: "Encuentra tu grupo de edad",
    leaguePlay:
      "League Play: de Pre-K a 6to grado. Práctica semanal y partidos los sábados.",
    fiveVFive:
      "5v5: de 7mo a 12vo grado. Sin prácticas, solo partidos dos veces por semana.",
    note: "Ambos se inscriben con el mismo formulario de abajo.",
  },
  howItWorks: {
    heading: "Cómo funciona",
    steps: [
      { step: 1, text: "Inscríbete en unos dos minutos en Spond." },
      {
        step: 2,
        text: "Ven al Kickoff Day para la evaluación del jugador y la formación de equipos.",
      },
      {
        step: 3,
        text: "La temporada arranca en agosto con partidos cada sábado hasta principios de noviembre.",
      },
    ],
  },
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
      q: "¿Y si no me alcanza?",
      a: "Hay becas disponibles porque cada niño de Nipomo merece un equipo. Escribe a admin@nipomosoccer.com y te ayudamos.",
    },
  ],
  finalCta: {
    heading: "Aparta tu lugar para el otoño",
    urgency: "Los precios suben el 1 de agosto. Inscríbete hoy.",
  },
  secondaryLinks: {
    parentAndMeLabel: "Parent and Me, de 2 a 3 años, $120 fijo",
    specialNeedsLabel: "Special Needs, todas las edades, $50 fijo",
  },
  footerContact: "admin@nipomosoccer.com",
};
