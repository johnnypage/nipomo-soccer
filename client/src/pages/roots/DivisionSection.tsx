const DIVISIONS = [
  {
    id: "parent-and-me",
    label: "Parent & Me",
    age: "Ages 2-3",
    description:
      "Your first introduction to soccer, together. Saturday sessions with your child on the field. No practices, no competition, just fun.",
    price: "$120",
    priceNote: "Fall 2026 season fee",
    learnMoreHref: "/roots/parent-and-me",
    learnMoreLabel: "Learn more about Parent & Me",
    color: "border-[#B99EE8]",
    badgeColor: "text-[#B99EE8]",
  },
  {
    id: "league-play",
    label: "League Play",
    age: "Pre-K through 3rd Grade",
    description:
      "The core ROOTS experience. Weekly practices, Saturday games, midweek matches, and an end-of-season tournament for older divisions. Up to 16 games per team.",
    price: "$150 to $200",
    priceNote: "Fall 2026 season fee",
    learnMoreHref: "/roots/recreational",
    learnMoreLabel: "Find your division",
    color: "border-crimson",
    badgeColor: "text-crimson",
  },
];

export default function DivisionSection() {
  return (
    <section className="bg-night py-20" id="divisions">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-wider uppercase text-gold">
            Find your division
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            Two programs, every age and stage.
          </h2>
          <p className="text-warmwhite/55 mt-2 text-[17px]">
            ROOTS has tracks built for different ages and stages. Here is how the Fall 2026 season is set up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DIVISIONS.map((div) => (
            <div
              key={div.id}
              className={`rounded-xl border-t-4 ${div.color} bg-white border border-black/8 border-t-0 p-7 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1`}
            >
              <h3 className="font-display text-night text-3xl uppercase tracking-tight mb-1">
                {div.label}
              </h3>

              <span className={`text-sm font-semibold ${div.badgeColor} mb-4`}>
                {div.age}
              </span>

              <p className="text-slate text-sm leading-relaxed flex-1">
                {div.description}
              </p>

              <div className="mt-5 pt-5 border-t border-black/8">
                <div className="font-display text-2xl text-crimson tracking-wide leading-none">
                  {div.price}
                </div>
                {div.priceNote && (
                  <p className="text-night/50 text-xs mt-1 font-mono uppercase tracking-wide">
                    {div.priceNote}
                  </p>
                )}
              </div>

              {div.learnMoreHref && (
                <a
                  href={div.learnMoreHref}
                  data-testid={`link-learn-more-${div.id}`}
                  className="mt-5 px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-warmwhite font-semibold rounded-lg text-sm transition-colors text-center"
                >
                  {div.learnMoreLabel} <span aria-hidden="true">&#8594;</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
