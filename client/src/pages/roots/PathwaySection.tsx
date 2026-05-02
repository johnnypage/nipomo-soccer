const PROGRAMS = [
  {
    name: "ROOTS",
    tag: "Recreational",
    season: "Fall season",
    description:
      "Saturday games, weekday practices. Where every player belongs. No tryouts, no experience required — just show up and play.",
    color: "border-crimson",
    tagColor: "bg-crimson/10 text-crimson border-crimson/30",
    active: true,
  },
  {
    name: "RISE",
    tag: "Development",
    season: "Spring season",
    description:
      "Camp-style training focused on individual skills. For players who want more soccer without a year-round commitment.",
    href: "/rise",
    color: "border-risegreen",
    tagColor: "bg-risegreen/10 text-risegreen border-risegreen/30",
    active: false,
  },
  {
    name: "REIGN",
    tag: "Competitive",
    season: "Year-round",
    description:
      "Advanced training, league play, and tournaments. Selection-based entry for players ready to compete at a higher level.",
    href: "/reign",
    color: "border-gold",
    tagColor: "bg-gold/10 text-gold border-gold/30",
    active: false,
  },
];

export default function PathwaySection() {
  return (
    <section className="roots-pathway py-20" id="pathway">
      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="max-w-[680px] mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/40 bg-crimson/10 text-crimson">
            The Pathway
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            A complete player pathway
          </h2>
          <p className="text-warmwhite/60 mt-3 text-[17px] leading-relaxed">
            ROOTS is where it starts, but it is not where it has to end. Nipomo Soccer offers
            three connected programs so your child can grow at their own pace, all within one organization.
            Your child can play ROOTS every season and have a great experience, or they can grow into
            RISE and REIGN over time. No pressure, no wrong path.
          </p>
        </div>

        <div className="roots-pathway-grid">
          {PROGRAMS.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl border-t-4 ${p.color} bg-white border border-black/8 border-t-0 p-7 flex flex-col ${p.active ? "ring-2 ring-crimson/20" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase rounded-full border ${p.tagColor}`}>
                  {p.tag}
                </span>
                <span className="text-slate text-xs font-mono">{p.season}</span>
              </div>
              <h3 className="font-display text-night text-3xl uppercase tracking-tight mb-3">{p.name}</h3>
              <p className="text-slate text-sm leading-relaxed flex-1">{p.description}</p>
              {p.href && (
                <a
                  href={p.href}
                  className="mt-5 text-sm font-medium text-crimson hover:underline"
                >
                  Learn about {p.name} →
                </a>
              )}
              {p.active && (
                <span className="mt-5 text-sm font-medium text-crimson/60 italic">
                  You are here
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
