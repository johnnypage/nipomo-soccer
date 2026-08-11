export default function FinalCTASection() {
  return (
    <section className="roots-final-cta bg-crimson py-24 text-center">
      <div className="relative z-10 max-w-[760px] mx-auto px-6">
        <blockquote className="mb-10">
          <p className="text-warmwhite/80 italic text-xl leading-relaxed">
            "Our kids had an amazing experience and they can't wait for next year."
          </p>
          <footer className="mt-2 text-xs font-mono text-warmwhite/40 uppercase tracking-wider">Parent / 2025 Survey</footer>
        </blockquote>
        <h2 className="font-display text-warmwhite text-[clamp(48px,7vw,88px)] uppercase leading-[0.95]">
          Want in next season?
        </h2>
        <p className="text-warmwhite/75 mt-4 text-lg leading-relaxed">
          Registration for ROOTS Fall 2026 is closed. Reach out and we will make sure you
          hear first when the next season opens.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <a
            href="/#contact"
            className="px-8 py-4 bg-white text-crimson font-bold rounded-lg hover:bg-warmwhite transition-colors text-lg"
            data-testid="link-contact-cta"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </section>
  );
}
