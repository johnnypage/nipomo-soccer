export default function FinalCTASection() {
  return (
    <section className="roots-final-cta bg-crimson py-24 text-center">
      <div className="relative z-10 max-w-[760px] mx-auto px-6">
        <blockquote className="mb-10">
          <p className="text-warmwhite/80 italic text-xl leading-relaxed">
            "Our kids had an amazing experience and they can't wait for next year."
          </p>
          <footer className="mt-2 text-xs font-mono text-warmwhite/40 uppercase tracking-wider">Parent — 2025 Survey</footer>
        </blockquote>
        <h2 className="font-display text-warmwhite text-[clamp(48px,7vw,88px)] uppercase leading-[0.95]">
          Ready to play?
        </h2>
        <p className="text-warmwhite/75 mt-4 text-lg leading-relaxed">
          Registration is open for ROOTS Fall 2026. Sign up today and lock in your spot.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <a
            href="https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-crimson font-bold rounded-lg hover:bg-warmwhite transition-colors text-lg"
            data-testid="link-register-cta"
          >
            Register Now →
          </a>
        </div>
      </div>
    </section>
  );
}
