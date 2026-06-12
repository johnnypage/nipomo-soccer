const DIVISIONS = [
  {
    id: "parent-and-me",
    label: "Parent & Me",
    age: "Ages 2-3",
    description:
      "Your first introduction to soccer, together. Saturday sessions with your child on the field. No practices, no competition, just fun.",
    price: "$120 flat rate",
    href: "/roots/parent-and-me",
    cta: "Learn more about Parent & Me",
    color: "border-[#B99EE8]",
    badgeColor: "text-[#B99EE8]",
  },
  {
    id: "league-play",
    label: "League Play",
    age: "Pre-K through 6th Grade",
    description:
      "The core ROOTS experience. Weekly practices, Saturday games, midweek matches, and an end-of-season tournament for older divisions. Up to 16 games per team.",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird / Regular / Late",
    href: "/roots/recreational",
    cta: "Find your division",
    color: "border-crimson",
    badgeColor: "text-crimson",
  },
  {
    id: "5v5",
    label: "5v5",
    age: "7th-12th Grade",
    description:
      "No practices. Just games. Fast-paced 5v5 soccer twice a week for middle school and high school players. Over 20 games per season.",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird / Regular / Late",
    href: "/roots/5v5",
    cta: "Learn more about 5v5",
    color: "border-risegreen",
    badgeColor: "text-risegreen",
  },
  {
    id: "special-needs",
    label: "Special Needs",
    age: "All ages",
    description:
      "A combination of drills and scrimmages with accommodations based on player needs. Every session is designed so every player can participate and have fun.",
    price: "$50 flat rate",
    schedule: "Saturday sessions only, 10 sessions per season",
    includes: "Kit, insurance, participation medal",
    registerUrl:
      "https://club.spond.com/landing/signup/nipomosc/form/212CA66EC0C84B88AB2BEB08FEE18ECF",
    cta: "Sign up for Special Needs",
    color: "border-gold",
    badgeColor: "text-gold",
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
            Four programs, one registration.
          </h2>
          <p className="text-warmwhite/55 mt-2 text-[17px]">
            ROOTS has tracks built for different ages and stages. Click into the one that fits your player.
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

              {"schedule" in div && div.schedule && (
                <p className="text-slate/70 text-xs mt-3">
                  <strong>Schedule:</strong> {div.schedule}
                </p>
              )}

              {"includes" in div && div.includes && (
                <p className="text-slate/70 text-xs mt-1">
                  <strong>Includes:</strong> {div.includes}
                </p>
              )}

              <div className="mt-5 pt-5 border-t border-black/8">
                <div className="font-display text-2xl text-crimson tracking-wide leading-none">
                  {div.price}
                </div>
                {"priceNote" in div && div.priceNote && (
                  <p className="text-night/50 text-xs mt-1 font-mono uppercase tracking-wide">
                    {div.priceNote}
                  </p>
                )}
              </div>

              {"href" in div && div.href ? (
                <a
                  href={div.href}
                  className="mt-5 px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-warmwhite font-semibold rounded-lg text-sm transition-colors text-center"
                >
                  {div.cta} <span aria-hidden="true">&#8594;</span>
                </a>
              ) : (
                <a
                  href={div.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-warmwhite font-semibold rounded-lg text-sm transition-colors text-center"
                >
                  {div.cta} <span aria-hidden="true">&#8594;</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
