import { useState } from "react";

const SURVEY_TABS = [
  {
    id: "coaching",
    label: "Coaching",
    rating: "4.62 / 5",
    ratingLabel: "Coach satisfaction",
    overview:
      "Coaching was the highest-rated category of the season. Families said their coaches cared and their kids had fun. The main ask was more preparation and training before the season starts.",
    feedback: [
      "Kids had a great time and learned a lot. Our coach made it fun.",
      "Better training for new coaches would be great.",
      "It would help to have local clinics so we can see drills in action.",
    ],
    plan: [
      "Preseason clinics before every season. In-person walkthrough of the curriculum with session plans provided.",
      "Grassroots certification covered by Nipomo Soccer. About 3-5 hours total.",
      "Board and staff available throughout the season for ongoing support.",
    ],
  },
  {
    id: "refs",
    label: "Referees",
    rating: "3.74 / 5",
    ratingLabel: "Lowest-rated category",
    overview:
      "Referees were the lowest-rated category. Families noticed missing refs, inconsistent coverage, and felt it was too much to ask of unpaid volunteers. 74% of families surveyed supported paying referees.",
    feedback: [
      "The lack of referees at games was very noticeable.",
      "Paying refs makes sense. It is too much to ask volunteers to do that many games.",
    ],
    plan: [
      "Referees are now paid and scheduled for every game.",
      "Coaches are not responsible for recruiting or coordinating officials.",
    ],
    planLink: { text: "Covered in detail above.", href: "#different" },
  },
  {
    id: "fields",
    label: "Fields & Schedule",
    rating: "4.24 / 5",
    ratingLabel: "Schedule and field setup",
    overview:
      "Families loved the compressed Saturday schedule and the quality of the field setup. This worked well and we are keeping it.",
    feedback: [
      "Loved being done by 2:00. It made a big difference for volunteers.",
      "The TurfTank paint lines made everything look sharp.",
    ],
    plan: [
      "Compressed Saturday schedule returning. Done by 2:00 PM.",
      "Higher-contrast field paint and updated maps for cross-play weekends.",
      "Start-time adjustments to reduce congestion at peak hours.",
    ],
  },
  {
    id: "equipment",
    label: "Equipment",
    rating: "4.35 / 5",
    ratingLabel: "Equipment and field gear",
    overview:
      "Families appreciated the equipment upgrades last season. The ask was to make sure everything is ready from day one. As a new organization, we are purchasing all new equipment from scratch.",
    feedback: [
      "Loved the new benches and how professional the fields looked.",
      "Loved the new ball bags. Way better quality.",
    ],
    plan: [
      "No coach will need to provide any of their own equipment. We have budgeted for everything.",
      "Improved jersey quality for this season.",
      "All equipment staged and ready before the first game day.",
      "Coaches get full equipment kits at preseason.",
    ],
  },
  {
    id: "balance",
    label: "Team Balance",
    rating: "New for 2026",
    ratingLabel: "Built from feedback",
    overview:
      "Families flagged mismatches in upper divisions where games were consistently lopsided. This is a new initiative built directly from that feedback.",
    feedback: [
      "U12 teams were inconsistent week to week. It felt uneven.",
      "Have tryouts or simple evaluation days to help balance teams.",
    ],
    plan: [
      "Pre-season evaluation day for 3rd grade and up.",
      "Returning player data used to inform team building.",
    ],
    planLink: { text: "Covered in detail above.", href: "#different" },
  },
];

export default function SurveySection() {
  const [active, setActive] = useState("coaching");
  const tab = SURVEY_TABS.find((t) => t.id === active)!;

  return (
    <section className="bg-night py-20" id="survey">
      <div className="max-w-[1200px] mx-auto px-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Built from family feedback
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            What 142 families told us
          </h2>
          <p className="text-warmwhite/55 mt-3 max-w-[640px] text-[17px]">
            At the end of the 2025 season, we surveyed every family in the program to understand
            what went well and what could be better. 142 families completed the survey. Here are
            the big takeaways from the season we ran last year and how we plan to address them this year.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-8">
          {SURVEY_TABS.map((t) => (
            <button
              key={t.id}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === t.id
                  ? "bg-gold text-night"
                  : "text-warmwhite/70 hover:text-warmwhite hover:bg-warmwhite/5"
              }`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="coach-survey-grid">
          <div className="bg-white rounded-xl p-8">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="font-heading font-bold text-night">What families said</h3>
              <div className="text-right">
                <div className="font-display text-2xl text-crimson tracking-wide leading-none">
                  {tab.rating}
                </div>
                <div className="text-[11px] text-slate uppercase tracking-widest mt-1 font-semibold">
                  {tab.ratingLabel}
                </div>
              </div>
            </div>
            <p className="text-slate text-[15px] leading-relaxed mb-5">
              {tab.overview}
            </p>
            <div className="space-y-4">
              {tab.feedback.map((q, i) => (
                <p key={i} className="text-slate italic text-[17px] pl-4 border-l-3 border-crimson/40 leading-relaxed">
                  "{q}"
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8">
            <h3 className="font-heading font-bold text-night mb-5">The game plan</h3>
            <ul className="space-y-0">
              {tab.plan.map((p, i) => (
                <li key={i} className="flex gap-3 py-3 border-t border-black/5 first:border-0 text-[15px] text-night/80">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-risegreen/10 text-risegreen flex items-center justify-center text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
              {"planLink" in tab && tab.planLink && (
                <li className="flex gap-3 py-3 border-t border-black/5 text-[15px]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-risegreen/10 text-risegreen flex items-center justify-center text-xs font-bold mt-0.5">
                    →
                  </span>
                  <a href={tab.planLink.href} className="text-crimson hover:underline font-medium">
                    {tab.planLink.text}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
