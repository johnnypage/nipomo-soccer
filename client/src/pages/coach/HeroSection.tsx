interface HeroSectionProps {
  onApply: () => void;
}

export default function HeroSection({ onApply }: HeroSectionProps) {
  return (
    <section className="coach-hero bg-night min-h-[80vh]" id="top">
      <div className="coach-hero__inner">
        <div className="max-w-[620px]">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold mb-6">
            ROOTS Fall 2026
          </span>
          <h1 className="font-display text-warmwhite text-[clamp(48px,7vw,88px)] leading-[0.95] uppercase tracking-tight">
            Coach with us.
          </h1>
          <p className="text-warmwhite/80 text-lg mt-6 leading-relaxed">
            If you're here, someone asked you to coach, or you're thinking about it.
            Either way, welcome. Whether this is your first season or your fifth,
            everything you need to know about coaching with Nipomo Soccer is on this page.
          </p>
          <p className="text-warmwhite/55 mt-4 leading-relaxed">
            We have a lot planned for 2026, and none of it happens without our coaches.
            You're the one on the field. You're the one kids remember. We do everything
            we can to make sure you're supported, prepared, and set up to give these kids
            a great experience.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={onApply}
              className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
            >
              Sign Up to Coach <span aria-hidden="true">→</span>
            </button>
            <a
              href="#dashboard"
              className="px-6 py-3 border border-warmwhite/20 text-warmwhite rounded-lg hover:bg-warmwhite/5 transition-colors"
            >
              See open coaching spots
            </a>
          </div>
        </div>

        <div className="coach-video-embed">
          <iframe
            src="https://www.loom.com/embed/11e432fde66643c0a34313dfdc786a08"
            frameBorder="0"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-xl"
          />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-16 relative z-10">
        <div className="relative bg-warmwhite/[0.04] border-l-[3px] border-gold rounded-lg pl-8 pr-6 py-6 md:pl-20 md:pr-12 md:py-9">
          <span className="absolute left-2 top-2 font-display text-gold text-4xl md:text-7xl md:left-6 md:top-4 leading-none select-none" aria-hidden="true">"</span>
          <p className="text-warmwhite/80 italic text-lg leading-relaxed">
            Our coach made the season. Kids had a great time and learned a lot,
            and you could tell he actually cared about every kid on the team.
          </p>
          <div className="mt-3">
            <span className="font-heading text-gold font-bold text-xs uppercase tracking-widest">Roots parent</span>
            <span className="font-mono text-warmwhite/40 text-[11px] uppercase tracking-wider ml-3">From the 2025 end of season family survey (4.62 / 5 average coach rating)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
