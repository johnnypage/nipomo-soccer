import { useEffect } from "react";
import clubLogo from "@assets/NSC_1764979848772.png";
import {
  type LandingContent,
  SPOND_MAIN,
  SPOND_PARENT_AND_ME,
  SPOND_SPECIAL_NEEDS,
} from "./landingContent";

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

export default function LandingPage({ content }: { content: LandingContent }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = content.docTitle;
  }, [content.docTitle]);

  return (
    <div className="min-h-screen bg-warmwhite text-night">
      {/* 1. Minimal header */}
      <header className="bg-night">
        <div className="max-w-[1100px] mx-auto px-5 py-4">
          <a href="/" className="inline-flex items-center" aria-label="Nipomo Soccer">
            <img
              src={clubLogo}
              alt="Nipomo Soccer"
              className="h-11 w-auto object-contain"
            />
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="bg-night">
        <div className="max-w-[1100px] mx-auto px-5 pt-12 pb-16 text-center flex flex-col items-center">
          <h1 className="font-display text-warmwhite uppercase tracking-tight leading-[0.95] text-[clamp(40px,8vw,84px)] max-w-[860px]">
            {content.hero.headline}
          </h1>
          <p className="text-warmwhite/80 text-lg md:text-xl mt-6 leading-relaxed max-w-[640px]">
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
      <section className="bg-paper">
        <div className="max-w-[1100px] mx-auto px-5 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.valueProps.map((prop, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-black/8 px-6 py-5 flex items-start gap-3"
              >
                <span
                  aria-hidden="true"
                  className="text-crimson font-bold text-lg leading-6 flex-shrink-0"
                >
                  &bull;
                </span>
                <p className="text-night text-[16px] leading-relaxed">{prop}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pricing */}
      <section className="bg-warmwhite">
        <div className="max-w-[760px] mx-auto px-5 py-14 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-night">
            {content.pricing.heading}
          </h2>
          <p className="font-display text-crimson text-[clamp(40px,9vw,64px)] leading-none mt-4">
            {content.pricing.fromLine}
          </p>
          <p className="text-night text-lg mt-3">{content.pricing.tiersLine}</p>
          <p className="text-crimson font-semibold mt-2">
            {content.pricing.urgency}
          </p>
          <p className="text-slate mt-5 text-[16px] leading-relaxed max-w-[560px] mx-auto">
            {content.pricing.scholarshipsLine}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center text-night text-[15px]">
            <span className="bg-white rounded-lg border border-black/8 px-4 py-2">
              {content.pricing.parentAndMe}
            </span>
            <span className="bg-white rounded-lg border border-black/8 px-4 py-2">
              {content.pricing.specialNeeds}
            </span>
          </div>
        </div>
      </section>

      {/* 5. Ages strip + secondary links */}
      <section className="bg-paper">
        <div className="max-w-[1100px] mx-auto px-5 py-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-night text-center">
            {content.ages.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white rounded-xl border border-black/8 px-6 py-6">
              <p className="text-night text-[16px] leading-relaxed">
                {content.ages.leaguePlay}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-black/8 px-6 py-6">
              <p className="text-night text-[16px] leading-relaxed">
                {content.ages.fiveVFive}
              </p>
            </div>
          </div>
          <p className="text-slate text-center mt-5 text-[15px]">
            {content.ages.note}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-x-8 gap-y-2 justify-center text-[15px]">
            <a
              href={SPOND_PARENT_AND_ME}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-parent-and-me"
              className="text-crimson hover:underline font-medium"
            >
              {content.secondaryLinks.parentAndMeLabel}
            </a>
            <a
              href={SPOND_SPECIAL_NEEDS}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-special-needs"
              className="text-crimson hover:underline font-medium"
            >
              {content.secondaryLinks.specialNeedsLabel}
            </a>
          </div>
        </div>
      </section>

      {/* 6. How it works */}
      <section className="bg-warmwhite">
        <div className="max-w-[860px] mx-auto px-5 py-14">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-night text-center">
            {content.howItWorks.heading}
          </h2>
          <div className="mt-8 flex flex-col gap-4">
            {content.howItWorks.steps.map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-4 bg-white rounded-xl border border-black/8 px-6 py-5"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-crimson text-warmwhite font-display flex items-center justify-center text-lg">
                  {s.step}
                </span>
                <p className="text-night text-[16px] leading-relaxed pt-1">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ (all collapsed) */}
      <section className="bg-paper">
        <div className="max-w-[760px] mx-auto px-5 py-14">
          <div className="flex flex-col gap-3">
            {content.faqs.map((f, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-black/8"
                open={false}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-medium text-night list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <svg
                    className="w-5 h-5 text-slate/40 group-open:text-crimson transition-all group-open:rotate-180 flex-shrink-0 ml-4"
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
                <div className="px-6 pb-5 text-slate text-[15px] leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="bg-night">
        <div className="max-w-[760px] mx-auto px-5 py-16 text-center flex flex-col items-center">
          <h2 className="font-display text-warmwhite uppercase tracking-tight leading-[0.95] text-[clamp(32px,7vw,56px)]">
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

      {/* 9. Light footer */}
      <footer className="bg-night border-t border-warmwhite/10">
        <div className="max-w-[1100px] mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-warmwhite/70 text-sm">
          <a
            href={`mailto:${content.footerContact}`}
            className="hover:text-warmwhite transition-colors"
          >
            {content.footerContact}
          </a>
          <a
            href="/privacy"
            className="hover:text-warmwhite transition-colors"
          >
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
