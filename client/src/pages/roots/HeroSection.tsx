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
        <p className="text-warmwhite/50 mt-2 text-base max-w-[620px]">
          Many of the same people who ran youth soccer in Nipomo are continuing that work. If your family played last year, you will see familiar faces on the sidelines.
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
    </section>
  );
}
