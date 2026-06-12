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

import herreraLogo from "@assets/Herrera_1765222077181.png";
import jgContractingLogo from "@assets/sponsor-mono-jg.png";
import headlinersLogo from "@assets/sponsor-color-headliners.png";
import cafeDevilleLogo from "@assets/sponsor-mono-cafe-deville.png";
import coastWaterLogo from "@assets/sponsor-color-coast-water.png";
import lvlSalonLogo from "@assets/sponsor-mono-lvl-salon.png";
import superiorFireLogo from "@assets/sponsor-color-superior-fire.png";
import taylorReaLogo from "@assets/sponsor-taylor-rea.png";
import shuckupsLogo from "@assets/sponsor-mono-shuckups.png";
import shakedownLogo from "@assets/sponsor-mono-shakedown.png";
import mayorsPlaceLogo from "@assets/sponsor-color-mayors-split.png";
import bbq805Logo from "@assets/sponsor-color-805bbq.png";
import fitHouseLogo from "@assets/sponsor-color-fithouse.png";
import paintingConceptsLogo from "@assets/sponsor-color-painting-concepts.png";
import pcMechanicalLogo from "@assets/sponsor-color-pcmechanical.png";
import threeOaksLogo from "@assets/sponsor-color-threeoaks.png";

// Shared sponsor list (same logos on both /fall and /futbol).
// Adding a sponsor is one import + one array entry. Assets are processed
// for the dark strip: backgrounds removed, original colors kept, near-black
// marks lightened so they read on black. Simple dark marks use the white
// mono versions. Originals live in the club sponsor logos folder.
// h = display height in px, computed so every logo carries equal visual area
export const SPONSORS: { name: string; src: string; url?: string; h: number }[] = [
  { name: "Herrera Farming Company", src: herreraLogo, h: 57 },
  { name: "JG Contracting", src: jgContractingLogo, url: "https://jgcontracting.biz/", h: 71 },
  { name: "Head Liners Barber Shop", src: headlinersLogo, h: 70 },
  { name: "Cafe DeVille", src: cafeDevilleLogo, h: 40 },
  { name: "Coast Water Solutions", src: coastWaterLogo, h: 47 },
  { name: "LVL Salon", src: lvlSalonLogo, h: 63 },
  { name: "Superior Fire Sprinkler", src: superiorFireLogo, h: 75 },
  { name: "Taylor Rea Photography", src: taylorReaLogo, h: 72 },
  { name: "The Shuck Ups Cornhole Club", src: shuckupsLogo, h: 84 },
  { name: "Shakedown Seasoning", src: shakedownLogo, h: 69 },
  { name: "The Mayor's Place", src: mayorsPlaceLogo, h: 56 },
  { name: "805 BBQ & Smoke", src: bbq805Logo, h: 57 },
  { name: "Fit Höuse Studios", src: fitHouseLogo, h: 40 },
  { name: "Painting Concepts", src: paintingConceptsLogo, h: 40 },
  { name: "PC Mechanical", src: pcMechanicalLogo, h: 40 },
  { name: "Three Oaks BBQ", src: threeOaksLogo, h: 72 },
];

export interface LandingContent {
  lang: "en" | "es";
  docTitle: string;
  ctaLabel: string;
  hero: {
    headline: string;
    subhead: string;
    urgency: string;
  };
  valueProps: { title: string; body: string }[];
  band1: { line: string; sub: string };
  band2: { line: string; sub: string };
  sponsors: { heading: string; sub: string };
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
    teenNote: string;
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
  footerPrivacyLabel: string;
}

export const enContent: LandingContent = {
  lang: "en",
  docTitle: "Nipomo Soccer | Fall 2026 Registration",
  ctaLabel: "Register Now",
  hero: {
    headline: "Fall soccer is back in Nipomo",
    subhead:
      "Recreational soccer registration is open for the fall season. Saturday games right here in Nipomo, for Pre-K through 8th grade. The season runs August through November.",
    urgency: "Prices go up August 1.",
  },
  valueProps: [
    { title: "UP TO 16 GAMES", body: "A real season that runs August through November." },
    {
      title: "PAID REFEREES",
      body: "Trained and paid referees at every game from 1st grade up. New this season.",
    },
    {
      title: "BALANCED TEAMS",
      body: "Every player evaluated at Kickoff Day so games stay close all season.",
    },
    {
      title: "THE FULL KIT",
      body: "Custom jersey, Photo Day, and a medal or trophy to close out the season.",
    },
    { title: "CLOSE TO HOME", body: "Every game right here in Nipomo." },
  ],
  band1: {
    line: "Saturdays belong to the kids",
    sub: "Real teams, real referees, and a sideline full of families every week.",
  },
  band2: {
    line: "Rec soccer with a real season",
    sub: "From the first whistle in August to medals and trophies in November.",
  },
  sponsors: {
    heading: "Sponsored by Nipomo businesses",
    sub: "Local sponsors help keep the season affordable for every family.",
  },
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
      "League Play: recreational soccer for Pre-K through 6th grade. Weekly practices plus Saturday games.",
    teenNote:
      "Players in 7th grade and up have their own fast paced teen league that plays twice a week. Register through the same form.",
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
      q: "What's included in registration?",
      a: "A custom jersey, Photo Day, trained and paid referees from 1st grade up, balanced teams, and a medal or trophy run to close out the season.",
    },
    {
      q: "What if my kid has never played?",
      a: "Beginners are welcome. There are no tryouts. Players are evaluated at Kickoff Day so teams stay balanced and every kid gets a fair chance to grow.",
    },
    {
      q: "What if I can't afford it?",
      a: "Scholarships are available because every kid in Nipomo deserves a team. Email admin@nipomosoccer.com and we'll help.",
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
  footerPrivacyLabel: "Privacy",
};

export const esContent: LandingContent = {
  lang: "es",
  docTitle: "Nipomo Soccer | Inscripción Otoño 2026",
  ctaLabel: "Inscribe a tu hijo",
  hero: {
    headline: "El fútbol de otoño regresa a Nipomo",
    subhead:
      "Ya abrió la inscripción para el fútbol recreativo de otoño de Nipomo Soccer. Partidos los sábados aquí mismo en Nipomo, desde Pre-K hasta 8vo grado. La temporada va de agosto a noviembre.",
    urgency: "Los precios suben el 1 de agosto.",
  },
  valueProps: [
    { title: "HASTA 16 PARTIDOS", body: "Una temporada de verdad, de agosto a noviembre." },
    {
      title: "ÁRBITROS PAGADOS",
      body: "Árbitros capacitados y pagados en cada partido desde 1er grado. Nuevo esta temporada.",
    },
    {
      title: "EQUIPOS PAREJOS",
      body: "Cada jugador se evalúa en el Kickoff Day para que los partidos estén reñidos toda la temporada.",
    },
    {
      title: "EQUIPO COMPLETO",
      body: "Jersey personalizado, día de fotos y una medalla o trofeo para cerrar la temporada.",
    },
    { title: "CERCA DE CASA", body: "Cada partido aquí mismo en Nipomo." },
  ],
  band1: {
    line: "Los sábados son de los niños",
    sub: "Equipos de verdad, árbitros de verdad y una banda llena de familias cada semana.",
  },
  band2: {
    line: "Fútbol recreativo con temporada de verdad",
    sub: "Desde el primer silbatazo en agosto hasta las medallas y trofeos en noviembre.",
  },
  sponsors: {
    heading: "Patrocinado por negocios de Nipomo",
    sub: "Los patrocinadores locales ayudan a que la temporada sea accesible para cada familia.",
  },
  pricing: {
    heading: "Precios",
    fromLine: "Desde $150",
    tiersLine: "Inscripción temprana $150, regular $175, tardía $200",
    urgency: "Los precios suben después del 31 de julio",
    scholarshipsLine:
      "Hay becas disponibles porque cada niño de Nipomo merece un equipo",
    parentAndMe: "Parent and Me cuesta $120 fijo",
    specialNeeds: "Special Needs cuesta $50 fijo",
  },
  ages: {
    heading: "Encuentra tu grupo de edad",
    leaguePlay:
      "League Play: fútbol recreativo de Pre-K a 6to grado. Práctica semanal y partidos los sábados.",
    teenNote:
      "Los jugadores de 7mo grado en adelante tienen su propia liga juvenil que juega dos veces por semana. Se inscriben con el mismo formulario.",
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
  footerPrivacyLabel: "Privacidad",
};
