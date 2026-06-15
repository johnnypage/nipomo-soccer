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
  { name: "Head Liners Barber Shop", src: headlinersLogo, h: 68 },
  { name: "Cafe DeVille", src: cafeDevilleLogo, h: 40 },
  { name: "Coast Water Solutions", src: coastWaterLogo, h: 47 },
  { name: "LVL Salon", src: lvlSalonLogo, h: 63 },
  { name: "Superior Fire Sprinkler", src: superiorFireLogo, h: 75 },
  { name: "Taylor Rea Photography", src: taylorReaLogo, h: 72 },
  { name: "The Shuck Ups Cornhole Club", src: shuckupsLogo, h: 84 },
  { name: "Shakedown Seasoning", src: shakedownLogo, h: 69 },
  { name: "The Mayor's Place", src: mayorsPlaceLogo, h: 56 },
  { name: "805 BBQ & Smoke", src: bbq805Logo, h: 84 },
  { name: "Fit Höuse Studios", src: fitHouseLogo, h: 40 },
  { name: "Painting Concepts", src: paintingConceptsLogo, h: 40 },
  { name: "PC Mechanical", src: pcMechanicalLogo, h: 40 },
  { name: "Three Oaks BBQ", src: threeOaksLogo, h: 72 },
];
