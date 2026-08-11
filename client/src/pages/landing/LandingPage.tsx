import { useEffect, useState } from "react";
import clubLogo from "@assets/NipomoSoccer_1780982227404.png";
import { type LandingContent } from "./landingContent";
import SponsorMarquee from "@/components/SponsorMarquee";

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

function CtaButton({
  label,
  testId,
  href,
  className = "",
}: {
  label: string;
  testId: string;
  href: string;
  className?: string;
}) {
  // Internal destinations stay in the same tab; only off-site links open a new one.
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-testid={testId}
      className={`inline-flex items-center justify-center px-8 py-4 bg-crimson text-warmwhite font-semibold text-lg rounded-lg hover:bg-crimson-dark transition-colors ${className}`}
    >
      {label}
      <span aria-hidden="true" className="ml-2">
        &rarr;
      </span>
    </a>
  );
}

function PhotoBandSection({
  image,
  line,
  sub,
  parallax = true,
  position = "center",
  overlay = "bg-night/70",
}: {
  image: string;
  line: string;
  sub: string;
  parallax?: boolean;
  position?: string;
  overlay?: string;
}) {
  return (
    <section
      className={`relative bg-cover ${parallax ? "bg-scroll md:bg-fixed" : "bg-scroll"}`}
      style={{ backgroundImage: `url(${image})`, backgroundPosition: position }}
    >
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10 max-w-[1100px] mx-auto px-5 py-24 md:py-32 min-h-[300px] flex flex-col items-center justify-center text-center">
        <p className="font-display text-warmwhite uppercase tracking-tight leading-[1.02] text-[clamp(32px,7vw,64px)] max-w-3xl">
          {line}
        </p>
        <p className="text-warmwhite/70 text-lg md:text-xl mt-5 max-w-xl">
          {sub}
        </p>
      </div>
    </section>
  );
}

function HeroRotation() {
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
      {/* Legibility overlay + bottom gradient blend into the value-props section */}
      <div className="absolute inset-0 bg-night/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
    </div>
  );
}

export default function LandingPage({ content }: { content: LandingContent }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = content.docTitle;
  }, [content.docTitle]);

  const ctaHref = content.ctaHref;
  const singleDivision = content.divisions.cards.length === 1;
  const seasonColsClass =
    {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
    }[content.season.milestones.length] ?? "md:grid-cols-4";

  return (
    <div className="min-h-screen bg-night text-warmwhite">
      {/* 1. Sticky header */}
      <header className="sticky top-0 z-50 bg-night border-b border-warmwhite/10">
        <div className="max-w-[1100px] mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-3 flex-shrink-0"
            aria-label="Nipomo Soccer"
          >
            <img
              src={clubLogo}
              alt="Nipomo Soccer"
              className="h-10 w-auto object-contain"
            />
            <span className="font-integral font-bold text-warmwhite text-base sm:text-lg leading-tight uppercase tracking-wide">
              Nipomo Soccer
            </span>
          </a>
          <a
            href={ctaHref}
            data-testid="cta-nav"
            className="inline-flex items-center justify-center px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors whitespace-nowrap"
          >
            {content.ctaLabel}
          </a>
        </div>
      </header>

      {/* 2. Hero (typographic over rotating field photos) */}
      <section className="relative overflow-hidden bg-night">
        <HeroRotation />
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 py-10 sm:py-20 md:py-28 text-center flex flex-col items-center">
          <h1 className="font-display text-warmwhite uppercase tracking-tight leading-[0.92] text-[clamp(44px,9.5vw,96px)] max-w-[920px]">
            {content.hero.headline}
          </h1>
          <p className="text-warmwhite/75 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 leading-relaxed max-w-[640px]">
            {content.hero.subhead}
          </p>
          <p className="text-gold font-semibold mt-3 sm:mt-5 text-base md:text-lg">
            {content.hero.urgency}
          </p>
          <div className="mt-6 sm:mt-9 w-full sm:w-auto">
            <CtaButton
              label={content.ctaLabel}
              testId="cta-hero"
              href={ctaHref}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* 2b. Sponsor ribbon (Monjur-style: dark strip, white monochrome logos, infinite marquee) */}
      <SponsorMarquee heading={content.sponsors.heading} />

      {/* 2b2. Format explainer (optional, numbered cards). Only renders when content provides it. */}
      {content.formatExplainer && (
        <section className="bg-night border-t border-warmwhite/10">
          <div className="max-w-[1100px] mx-auto px-5 py-16">
            <div className="text-center max-w-[640px] mx-auto">
              <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl">
                {content.formatExplainer.heading}
              </h2>
              {content.formatExplainer.sub && (
                <p className="text-warmwhite/70 mt-3 text-[16px] leading-relaxed">
                  {content.formatExplainer.sub}
                </p>
              )}
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.formatExplainer.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white/5 border border-warmwhite/10 rounded-xl px-6 py-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-gold text-3xl leading-none"
                  >
                    {i + 1}
                  </span>
                  <p className="font-display text-warmwhite uppercase tracking-tight text-lg leading-tight mt-3">
                    {step.title}
                  </p>
                  <p className="text-warmwhite/70 text-[15px] leading-relaxed mt-2 flex-1">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2c. Divisions (replaces the old Pricing and Find-your-age-group sections) */}
      <section className="bg-night">
        <div className="max-w-[1100px] mx-auto px-5 py-16">
          <div className="text-center max-w-[640px] mx-auto">
            <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl">
              {content.divisions.heading}
            </h2>
            <p className="text-gold font-semibold mt-3 text-base md:text-lg">
              {content.divisions.urgency}
            </p>
            <p className="text-warmwhite/70 mt-3 text-[16px] leading-relaxed">
              {content.divisions.sub}
            </p>
          </div>
          <div
            className={
              singleDivision
                ? "mt-10 max-w-[560px] mx-auto"
                : "mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"
            }
          >
            {content.divisions.cards.map((card) => {
              const testId =
                "division-" +
                card.title
                  .toLowerCase()
                  .replace(/&/g, "and")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
              return (
                <div
                  key={card.title}
                  className="flex flex-col bg-white/5 border border-warmwhite/10 rounded-xl px-6 py-6"
                >
                  <p className="font-display text-warmwhite uppercase tracking-tight text-xl md:text-2xl leading-tight">
                    {card.title}
                  </p>
                  <p className="text-gold font-semibold mt-1 text-[15px]">
                    {card.age}
                  </p>
                  <p className="text-warmwhite/70 text-[16px] leading-relaxed mt-3 flex-1">
                    {card.body}
                  </p>
                  <p className="font-display text-gold text-2xl md:text-3xl leading-none mt-5">
                    {card.price}
                  </p>
                  {card.priceNote && (
                    <p className="text-warmwhite/50 text-[13px] mt-1">
                      {card.priceNote}
                    </p>
                  )}
                  <a
                    href={card.href}
                    data-testid={testId}
                    className="mt-5 inline-flex items-center justify-center w-full px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
                  >
                    {card.cta}
                  </a>
                </div>
              );
            })}
          </div>
          <p className="text-warmwhite/60 text-center mt-8 text-[15px] leading-relaxed max-w-[640px] mx-auto">
            {content.divisions.scholarships}
          </p>
        </div>
      </section>

      {/* 2d. Season at a glance */}
      <section className="bg-[#181818]">
        <div className="max-w-[820px] mx-auto px-5 py-16">
          <div className="text-center">
            <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl">
              {content.season.heading}
            </h2>
            <p className="text-warmwhite/70 mt-3 text-[16px] leading-relaxed">
              {content.season.sub}
            </p>
          </div>
          {/* Timeline: horizontal on desktop, vertical rail on mobile. No boxes. */}
          <div className={`mt-12 hidden md:grid ${seasonColsClass} md:gap-8 relative`}>
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-[5px] h-px bg-warmwhite/15"
            />
            {content.season.milestones.map((m, i) => (
              <div key={i} className="relative">
                <span
                  aria-hidden="true"
                  className="block w-[11px] h-[11px] rounded-full bg-gold mb-5"
                />
                <p className="text-gold text-[13px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap">
                  {m.dates}
                </p>
                <p className="font-display text-warmwhite uppercase tracking-tight text-base lg:text-lg leading-tight mt-2 md:whitespace-nowrap">
                  {m.name}
                </p>
                <p className="text-warmwhite/65 text-[14px] leading-relaxed mt-2">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 md:hidden flex flex-col">
            {content.season.milestones.map((m, i) => (
              <div key={i} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className="block w-[11px] h-[11px] rounded-full bg-gold mt-1.5 flex-shrink-0"
                  />
                  {i < content.season.milestones.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="block w-px flex-1 bg-warmwhite/15"
                    />
                  )}
                </div>
                <div className={i < content.season.milestones.length - 1 ? "pb-8" : ""}>
                  <p className="text-gold text-[13px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap">
                    {m.dates}
                  </p>
                  <p className="font-display text-warmwhite uppercase tracking-tight text-lg leading-tight mt-1">
                    {m.name}
                  </p>
                  <p className="text-warmwhite/65 text-[14px] leading-relaxed mt-2">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What you get (editorial list, no boxes) */}
      <section className="bg-night">
        <div className="max-w-[860px] mx-auto px-5 py-16">
          <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl text-center">
            {content.valuePropsHeading}
          </h2>
          <div className="mt-8 divide-y divide-warmwhite/10 border-t border-b border-warmwhite/10">
            {content.valueProps.map((prop, i) => (
              <div
                key={i}
                className="py-5 md:flex md:items-baseline md:gap-8"
              >
                <p className="font-display text-warmwhite uppercase tracking-tight text-lg md:text-xl leading-tight md:w-[260px] md:flex-shrink-0">
                  {prop.title}
                </p>
                <p className="text-warmwhite/65 text-[15px] leading-relaxed mt-1.5 md:mt-0">
                  {prop.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ (all collapsed) */}
      {/* Photo band: rainbow */}
      <PhotoBandSection
        image="/landing-band-rainbow.jpg"
        line={content.band2.line}
        sub={content.band2.sub}
        parallax={false}
        position="center 40%"
        overlay="bg-night/55"
      />

      <section className="bg-[#181818]">
        <div className="max-w-[760px] mx-auto px-5 py-16">
          <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl text-center">
            {content.faqHeading}
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {content.faqs.map((f, i) => (
              <details
                key={i}
                className="group bg-white/5 border border-warmwhite/10 rounded-xl"
                open={false}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-medium text-warmwhite list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <svg
                    className="w-5 h-5 text-warmwhite/40 group-open:text-gold transition-all group-open:rotate-180 flex-shrink-0 ml-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-warmwhite/70 text-[15px] leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>


      {/* 10. Final CTA */}
      <section className="bg-night">
        <div className="max-w-[760px] mx-auto px-5 py-20 text-center flex flex-col items-center">
          <h2 className="font-display text-warmwhite uppercase tracking-tight leading-[0.95] text-[clamp(36px,8vw,64px)]">
            {content.finalCta.heading}
          </h2>
          <p className="text-gold font-semibold mt-4 text-base md:text-lg">
            {content.finalCta.urgency}
          </p>
          <div className="mt-8 w-full sm:w-auto">
            <CtaButton
              label={content.ctaLabel}
              testId="cta-final"
              href={ctaHref}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-night border-t border-warmwhite/10">
        <div className="max-w-[1100px] mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-warmwhite/70 text-sm">
          <a
            href={`mailto:${content.footerContact}`}
            className="hover:text-warmwhite transition-colors"
          >
            {content.footerContact}
          </a>
          <a href="/privacy" className="hover:text-warmwhite transition-colors">
            {content.footerPrivacyLabel}
          </a>
        </div>
      </footer>
    </div>
  );
}
