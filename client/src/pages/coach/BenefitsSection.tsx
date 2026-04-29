const BENEFITS = [
  {
    iconCls: "bg-crimson/10 text-crimson",
    icon: "✓",
    title: "We cover all expenses and equipment",
    body: "Background check, fingerprinting, Grassroots certification, balls, cones, pinnies, goals. All covered. No coach brings their own gear.",
  },
  {
    iconCls: "bg-gold/10 text-gold",
    icon: "★",
    title: "Discounted registration for your kids",
    body: "Your players register at a discounted rate when you coach.",
  },
  {
    iconCls: "bg-purple/10 text-purple",
    icon: "◎",
    title: "A coaching community",
    body: "You join a staff that meets, plans, and develops together. Nobody coaches alone.",
  },
  {
    iconCls: "bg-risegreen/10 text-risegreen",
    icon: "◇",
    title: "Training and clinics",
    body: "Preseason clinics every season, plus session plans and a curriculum tailored to each age group.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-paper py-20" id="benefits">
      <div className="max-w-[1200px] mx-auto px-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            Coach benefits
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            What you get when you coach
          </h2>
          <p className="text-slate mt-3 max-w-[640px] text-[17px] leading-relaxed">
            More than any of the benefits below, you are taking an active role in supporting
            your community and supporting kids. Coaches are one of the most important figures
            in a young kid's life. That matters more than anything on this list.
          </p>
        </div>

        <div className="coach-benefit-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-white rounded-xl border border-black/8 p-7 text-center">
              <div className={`w-[52px] h-[52px] rounded-full ${b.iconCls} flex items-center justify-center text-xl mx-auto mb-4`}>
                {b.icon}
              </div>
              <h4 className="font-semibold text-night mb-2">{b.title}</h4>
              <p className="text-slate text-sm leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
