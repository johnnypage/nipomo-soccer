import { useEffect, useState } from "react";

const HERO_IMAGES = [
  "/landing-hero-6.jpg",
  "/landing-hero-5.jpg",
  "/landing-hero-9.jpg",
  "/landing-hero-7.jpg",
  "/landing-hero-8.jpg",
  "/landing-hero-1.jpg",
  "/landing-hero-4.jpg",
  "/landing-hero-2.jpg",
  "/landing-hero-3.jpg",
];

/**
 * Crossfading photo background for the ROOTS page heroes.
 * Ported from the /fall and /futbol landing pages so the warm-audience
 * pages share the same hero treatment. Sits behind the .roots-hero__inner
 * content (which is z-index:1); carries its own night overlay + bottom
 * gradient for text legibility.
 */
export default function HeroRotation() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % HERO_IMAGES.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms]"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === active ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-night/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
    </div>
  );
}
