import { useState } from "react";

const CHANGES = [
  {
    id: "refs",
    eyebrow: "Change 01",
    short: "We're paying our referees",
    icon: "⚑",
    summary:
      "No more recruiting from your sideline. No more hoping volunteers show up. Referees are paid and scheduled for every game.",
    why: "In the past, running a season in Nipomo meant recruiting over 100 coaches and then relying on roughly 20 volunteer referees to cover the entire season. Each of those referees had to complete 10+ hours of certification training and officiate every Saturday without pay. When there weren't enough, coaches were expected to recruit parents from their own teams to fill the gaps. And if your division didn't have enough certified officials, your team was disqualified from postseason play.\n\nThis year, we're investing in the people who put in the time. Referees are paid for their work. That lets us hold a higher standard, improve the quality of officiating, and make sure every game has coverage. It's a better experience for everyone.",
    practice: [
      "Referees are paid and scheduled for every game",
      "Coaches are no longer responsible for recruiting officials",
      "Higher standard of officiating and accountability",
      "No team disqualified from postseason over referee shortages",
    ],
  },
  {
    id: "playtime",
    eyebrow: "Change 02",
    short: "Playing time that rewards participation",
    icon: "⌁",
    summary:
      "Coaches now have a tool to tie game time to practice attendance. Show up, put in the work, play more.",
    why: "One of the most important things sports teach kids is that showing up matters. In the past, every player was guaranteed at least three quarters of every game whether they came to practice or not. That sent the wrong message to the kids who were there every week putting in the work. This year, practice attendance is tracked in Spond and coaches can use that data to reward players who commit to their team. Players who come to practices play more. Players who only show up on game day play less.\n\nThis is not a tool to bench kids. ROOTS is recreational soccer and every registered player deserves the opportunity to play. But there is a balance between keeping it accessible and recognizing the kids who put in the time. Coaches now have real data to find that balance, and we are here to back them up.",
    practice: [
      "Practice attendance tracked in Spond with one tap",
      "Game time reflects participation",
      "If a parent questions a playing time decision, the attendance record in Spond backs you up",
      "Three-quarter rule still applies for players with full participation",
    ],
    link: { text: "See the full breakdown in our FAQ below.", href: "#faq" },
  },
  {
    id: "balance",
    eyebrow: "Change 03",
    short: "Balanced teams from day one",
    icon: "◇",
    summary:
      "A pre-season evaluation day and data from last season mean teams are built from real information, not guesswork.",
    why: "One of the hardest things about coaching is getting dealt a roster that's completely outmatched from the start. When teams are lopsided, every game is a blowout. That's not fun for the kids and it's not rewarding for the coach. This year, we are using data we collected last season on returning players along with a pre-season evaluation day to build balanced teams before the season starts. The goal is every coach walks into the season with a competitive roster and every game is worth playing.",
    practice: [
      "Pre-season evaluation day for all registered players",
      "Returning player data from last season informs team building",
      "Teams drafted for balance so every division is competitive",
      "Coaches start the season with a roster they can work with",
    ],
  },
  {
    id: "schedule",
    eyebrow: "Change 04",
    short: "More games, more development",
    icon: "◐",
    summary:
      "Every team will play 14 to 16 games this season. More time on the field means more development and more fun.",
    why: "The best way to develop kids is to let them play. In the past, the season was Saturdays only, and coaches who wanted their players to get more touches had to organize scrimmages on their own. This year, we are adding midweek games throughout the season. It won't be every week, but the goal is simple: more games, more touches on the ball, more playing time. That means more development and more fun for your players without you having to plan extra on your own.",
    practice: [
      "14 to 16 games per team this season",
      "Midweek games added throughout the season alongside Saturday matches",
      "More touches, more development, more fun",
      "Scheduling conflicts handled in advance as long as coaches communicate them early",
    ],
  },
];

export default function WhatsDifferentSection() {
  const [active, setActive] = useState("refs");
  const current = CHANGES.find((c) => c.id === active)!;

  return (
    <section className="bg-paper py-20" id="different">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[720px]">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            What's new this year
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            Four big upgrades to this year's season
          </h2>
          <p className="text-slate mt-3 text-[17px] leading-relaxed">
            We make small improvements every season. But this year, there are four big shifts
            coming to soccer in Nipomo that change how things work for coaches, players, and families.
          </p>
        </div>

        <div className="coach-changes">
          <div className="flex flex-col gap-3" role="tablist" aria-label="Changes this year">
            {CHANGES.map((c, i) => {
              const isActive = c.id === active;
              return (
                <button
                  key={c.id}
                  className={`text-left p-5 rounded-xl border transition-all ${
                    isActive
                      ? "bg-night text-warmwhite border-night shadow-lg"
                      : "bg-white border-black/8 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                  onClick={() => setActive(c.id)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-semibold ${isActive ? "text-gold" : "text-slate"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg" aria-hidden="true">{c.icon}</span>
                  </div>
                  <h4 className={`font-semibold ${isActive ? "text-warmwhite" : "text-night"}`}>{c.short}</h4>
                  <span className={`text-xs mt-2 inline-block ${isActive ? "text-gold" : "text-crimson"}`}>
                    {isActive ? "Showing details" : "Read more"} <span aria-hidden="true">→</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="coach-change-detail" role="tabpanel" aria-live="polite">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-crimson">
                {current.eyebrow}
              </span>
              <h3 className="font-heading text-[30px] font-extrabold mt-1 text-night">{current.short}</h3>
              <p className="text-slate mt-3 text-[17px] leading-relaxed">{current.summary}</p>
            </div>

            <div className="coach-change-detail__grid">
              <div>
                <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                  Why we changed it
                </div>
                <div className="text-slate text-[15px] leading-relaxed space-y-3">
                  {current.why.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                  What it looks like
                </div>
                <ul className="space-y-2">
                  {current.practice.map((p, i) => (
                    <li key={i} className="text-[15px] text-night/80 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-gold before:font-bold">
                      {p}
                    </li>
                  ))}
                </ul>
                {"link" in current && current.link && (
                  <a href={current.link.href} className="inline-block mt-3 text-crimson hover:underline text-sm font-medium">
                    {current.link.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
