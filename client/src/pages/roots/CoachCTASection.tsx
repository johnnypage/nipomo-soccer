const QUOTES = [
  {
    text: "I had never coached before and was terrified. The support from the club was incredible. By week three I actually felt like I knew what I was doing.",
    attr: "First-year coach — 2025 Season",
  },
  {
    text: "Watching my players grow over the season is the most rewarding thing I've done outside of my own family. I'm coaching again next year for sure.",
    attr: "Parent-coach — 2025 Season",
  },
  {
    text: "They gave me a full practice plan, a gear bag, and a group chat with experienced coaches I could text any time. I never felt alone.",
    attr: "Parent — 2025 Survey",
  },
];

export default function CoachCTASection() {
  return (
    <section className="roots-final-cta bg-crimson py-16 md:py-20" id="coach-cta">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="max-w-[680px] mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold mb-5">
            Coach with us
          </span>
          <h2 className="font-display text-warmwhite text-[clamp(38px,5vw,68px)] uppercase leading-[0.92] tracking-tight">
            Your team needs a coach.
          </h2>
          <p className="text-warmwhite/75 mt-5 text-[17px] leading-relaxed">
            Most of our coaches are parents just like you. No soccer experience required.
            We cover all training and certification costs, provide session plans and a full
            equipment kit, and support you the whole season.
          </p>
          <a
            href="/coach"
            className="inline-block mt-7 px-8 py-4 bg-warmwhite text-crimson font-bold rounded-lg hover:bg-warmwhite/90 transition-colors text-base"
            data-testid="link-coach-cta"
          >
            Learn about coaching →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/15 rounded-xl px-6 py-6 backdrop-blur-sm"
            >
              <p className="text-warmwhite/85 italic text-[15px] leading-relaxed">"{q.text}"</p>
              <p className="mt-4 text-gold font-bold text-[11px] uppercase tracking-widest">{q.attr}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
