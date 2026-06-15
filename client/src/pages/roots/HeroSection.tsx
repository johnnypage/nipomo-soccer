import HeroRotation from "./HeroRotation";

export default function HeroSection() {
  return (
    <section className="roots-hero bg-night" id="top">
      <HeroRotation />
      <div className="roots-hero__inner text-center flex flex-col items-center">
        <h1 className="font-display text-warmwhite text-[clamp(52px,9vw,112px)] leading-[0.92] uppercase tracking-tight max-w-[900px]">
          Soccer starts here.
        </h1>
        <p className="text-warmwhite/80 text-xl mt-6 leading-relaxed max-w-[600px]">
          ROOTS is Nipomo Soccer's recreational program for players ages 2 through high school.
          A 12-week season with up to 20 games per player, paid referees, and a community
          of families and coaches that makes game day the best part of the week.
        </p>
        <p className="text-warmwhite/50 mt-3 text-base">
          No tryouts. No experience required. Just show up ready to play.
        </p>

        <p className="text-warmwhite/55 text-sm font-medium mt-8 mb-10 max-w-[600px]">
          Ages 2 to high school &middot; 12-week season &middot; Up to 20 games &middot; Paid referees &middot; No tryouts
        </p>

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
        <div className="relative bg-warmwhite/[0.04] rounded-lg pl-8 pr-6 py-6 md:pl-20 md:pr-12 md:py-9">
          <span className="absolute left-2 top-2 font-display text-crimson text-4xl md:text-7xl md:left-6 md:top-4 leading-none select-none" aria-hidden="true">"</span>
          <p className="text-warmwhite/80 italic text-lg leading-relaxed">
            My son had the best time ever. He was super shy at first few games and it really helped him become more independent and love the game of soccer.
          </p>
          <div className="mt-3">
            <span className="font-heading text-crimson font-bold text-xs uppercase tracking-widest">Parent / 2025 Survey</span>
          </div>
        </div>
      </div>
    </section>
  );
}
