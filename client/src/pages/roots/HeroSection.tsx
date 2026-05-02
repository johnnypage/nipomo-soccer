export default function HeroSection() {
  return (
    <section className="roots-hero bg-night" id="top">
      <div className="roots-hero__inner text-center flex flex-col items-center">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/40 bg-crimson/10 text-crimson mb-6">
          ROOTS Fall 2026
        </span>
        <h1 className="font-display text-warmwhite text-[clamp(52px,9vw,112px)] leading-[0.92] uppercase tracking-tight max-w-[900px]">
          Soccer starts here.
        </h1>
        <p className="text-warmwhite/80 text-xl mt-6 leading-relaxed max-w-[600px]">
          ROOTS is Nipomo Soccer's recreational program for kids ages 2 through 14.
          A 12-week season with up to 16 games per team, paid referees, and a community
          of families and coaches that makes Saturday soccer the best part of the week.
        </p>
        <p className="text-warmwhite/50 mt-3 text-base">
          No tryouts. No experience required. Just show up ready to play.
        </p>

        <div className="flex flex-wrap gap-2.5 mt-8 mb-10 justify-center">
          {["Ages 2–14", "12-week season", "Up to 16 games", "Paid referees", "No tryouts"].map((stat) => (
            <span key={stat} className="px-4 py-1.5 bg-warmwhite/[0.06] border border-warmwhite/10 rounded-full text-warmwhite/65 text-sm font-medium">
              {stat}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
            data-testid="link-register-hero"
          >
            Register Now <span aria-hidden="true">→</span>
          </a>
          <a
            href="#divisions"
            className="px-6 py-3 border border-warmwhite/20 text-warmwhite rounded-lg hover:bg-warmwhite/5 transition-colors"
            data-testid="link-find-division"
          >
            Find Your Division <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-16 relative z-10">
        <div className="relative bg-warmwhite/[0.04] border-l-[3px] border-crimson rounded-lg pl-8 pr-6 py-6 md:pl-20 md:pr-12 md:py-9">
          <span className="absolute left-2 top-2 font-display text-crimson text-4xl md:text-7xl md:left-6 md:top-4 leading-none select-none" aria-hidden="true">"</span>
          <p className="text-warmwhite/80 italic text-lg leading-relaxed">
            My son had the best time ever. He was super shy at first few games and it really helped him become more independent and love the game of soccer.
          </p>
          <div className="mt-3">
            <span className="font-heading text-crimson font-bold text-xs uppercase tracking-widest">Parent — 2025 Survey</span>
          </div>
        </div>
      </div>
    </section>
  );
}
