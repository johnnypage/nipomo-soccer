import { useEffect, useState } from "react";
import clubLogo from "@assets/NipomoSoccer_1780982227404.png";
import {
  type LandingContent,
  SPONSORS,
  SPOND_MAIN,
  SPOND_PARENT_AND_ME,
  SPOND_SPECIAL_NEEDS,
} from "./landingContent";

const HERO_IMAGES = [
  "/landing-hero-1.jpg",
  "/landing-hero-2.jpg",
  "/landing-hero-3.jpg",
];

function CtaButton({
  label,
  testId,
  className = "",
}: {
  label: string;
  testId: string;
  className?: string;
}) {
  return (
    <a
      href={SPOND_MAIN}
      target="_blank"
      rel="noopener noreferrer"
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
}: {
  image: string;
  line: string;
  sub: string;
}) {
  return (
    <section
      className="relative bg-scroll md:bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-night/70" />
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
    }, 5000);
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

  return (
    <div className="min-h-screen bg-night text-warmwhite">
      {/* 1. Sticky header */}
      <header className="sticky top-0 z-50 bg-night border-b border-warmwhite/10">
        <div className="max-w-[1100px] mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <a
            href="/"
            className="inline-flex items-center flex-shrink-0"
            aria-label="Nipomo Soccer"
          >
            <img
              src={clubLogo}
              alt="Nipomo Soccer"
              className="h-10 w-auto object-contain"
            />
          </a>
          <a
            href={SPOND_MAIN}
            target="_blank"
            rel="noopener noreferrer"
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
        <div className="relative z-10 max-w-[1100px] mx-auto px-5 py-20 md:py-28 text-center flex flex-col items-center">
          <h1 className="font-display text-warmwhite uppercase tracking-tight leading-[0.92] text-[clamp(48px,10vw,96px)] max-w-[920px]">
            {content.hero.headline}
          </h1>
          <p className="text-warmwhite/75 text-lg md:text-xl mt-6 leading-relaxed max-w-[640px]">
            {content.hero.subhead}
          </p>
          <p className="text-gold font-semibold mt-5 text-base md:text-lg">
            {content.hero.urgency}
          </p>
          <div className="mt-9 w-full sm:w-auto">
            <CtaButton
              label={content.ctaLabel}
              testId="cta-hero"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>

      {/* 3. Value props */}
      <section className="bg-[#181818]">
        <div className="max-w-[1100px] mx-auto px-5 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.valueProps.map((prop, i) => (
              <div
                key={i}
                className="bg-white/5 border border-warmwhite/10 rounded-xl px-6 py-6"
              >
                <p className="font-display text-warmwhite uppercase tracking-tight text-xl md:text-2xl leading-tight">
                  {prop.title}
                </p>
                <p className="text-warmwhite/70 text-[16px] leading-relaxed mt-2">
                  {prop.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Photo band 1 */}
      <PhotoBandSection
        image="/landing-band-gameday.jpg"
        line={content.band1.line}
        sub={content.band1.sub}
      />

      {/* 4b. Sponsor ribbon (compact infinite marquee) */}
      <section data-testid="sponsor-ribbon" className="bg-warmwhite py-8 md:py-10 overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-5 text-center">
          <h2 className="font-display uppercase text-night text-lg md:text-xl">
            {content.sponsors.heading}
          </h2>
          <p className="text-night/60 text-sm mt-1">
            {content.sponsors.sub}
          </p>
        </div>
        <div className="mt-6 w-full overflow-hidden">
          <div className="sponsor-marquee flex w-max items-center gap-4 pr-4">
            {[0, 1].map((copy) =>
              SPONSORS.map((s, i) => {
                const img = (
                  <img
                    src={s.src}
                    alt={copy === 0 ? s.name : ""}
                    className={`w-auto object-contain ${
                      s.dark ? "max-h-14 md:max-h-16" : "max-h-11 md:max-h-14"
                    }`}
                  />
                );
                return (
                  <div
                    key={`${copy}-${i}`}
                    aria-hidden={copy === 1 ? "true" : undefined}
                    className={`rounded-lg h-16 md:h-20 min-w-[140px] md:min-w-[170px] flex items-center justify-center px-5 flex-shrink-0 ${
                      s.dark ? "bg-black" : "bg-white border border-black/8"
                    }`}
                  >
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                        tabIndex={copy === 1 ? -1 : undefined}
                      >
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="bg-night">
        <div className="max-w-[760px] mx-auto px-5 py-16 text-center">
          <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl">
            {content.pricing.heading}
          </h2>
          <p className="font-display text-gold text-[clamp(48px,11vw,80px)] leading-none mt-4">
            {content.pricing.fromLine}
          </p>
          <p className="text-warmwhite text-lg mt-3">
            {content.pricing.tiersLine}
          </p>
          <p className="text-gold font-semibold mt-2">
            {content.pricing.urgency}
          </p>
          <p className="text-warmwhite/70 mt-5 text-[16px] leading-relaxed max-w-[560px] mx-auto">
            {content.pricing.scholarshipsLine}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center text-warmwhite text-[15px]">
            <span className="bg-white/5 border border-warmwhite/10 rounded-lg px-4 py-2">
              {content.pricing.parentAndMe}
            </span>
            <span className="bg-white/5 border border-warmwhite/10 rounded-lg px-4 py-2">
              {content.pricing.specialNeeds}
            </span>
          </div>
        </div>
      </section>

      {/* 6. Ages (teen league demoted to one line) */}
      <section className="bg-[#181818]">
        <div className="max-w-[760px] mx-auto px-5 py-16">
          <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl text-center">
            {content.ages.heading}
          </h2>
          <div className="mt-8 bg-white/5 border border-warmwhite/10 rounded-xl px-6 py-6">
            <p className="text-warmwhite text-[16px] leading-relaxed">
              {content.ages.leaguePlay}
            </p>
          </div>
          <p className="text-warmwhite/70 text-center mt-5 text-[15px] leading-relaxed max-w-[600px] mx-auto">
            {content.ages.teenNote}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-x-8 gap-y-2 justify-center text-center text-[15px]">
            <a
              href={SPOND_PARENT_AND_ME}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-parent-and-me"
              className="text-gold hover:underline font-medium"
            >
              {content.secondaryLinks.parentAndMeLabel}
            </a>
            <a
              href={SPOND_SPECIAL_NEEDS}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-special-needs"
              className="text-gold hover:underline font-medium"
            >
              {content.secondaryLinks.specialNeedsLabel}
            </a>
          </div>
        </div>
      </section>

      {/* 7. How it works */}
      <section className="bg-night">
        <div className="max-w-[860px] mx-auto px-5 py-16">
          <h2 className="font-display text-warmwhite uppercase tracking-tight text-2xl md:text-3xl text-center">
            {content.howItWorks.heading}
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            {content.howItWorks.steps.map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-4 bg-white/5 border border-warmwhite/10 rounded-xl px-6 py-5"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-crimson text-warmwhite font-display flex items-center justify-center text-lg">
                  {s.step}
                </span>
                <p className="text-warmwhite text-[16px] leading-relaxed pt-1">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ (all collapsed) */}
      <section className="bg-[#181818]">
        <div className="max-w-[760px] mx-auto px-5 py-16">
          <div className="flex flex-col gap-3">
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

      {/* 9. Photo band 2 */}
      <PhotoBandSection
        image="/landing-band-lights.jpg"
        line={content.band2.line}
        sub={content.band2.sub}
      />

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
