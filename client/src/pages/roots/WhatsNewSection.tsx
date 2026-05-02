import { useState } from "react";

const CHANGES = [
  {
    id: "parent-me",
    icon: "◎",
    short: "A brand new Parent & Me division",
    ageBadge: "Ages 2 & 3 only",
    summary:
      "You and your child get out on the field together for soccer-related games, drills, and scrimmages in a fun weekend environment.",
    body: "This year we are introducing a Parent & Me program for our youngest players. You and your child get out on the field together for soccer-related games, drills, and scrimmages in a fun weekend environment. No practices, no pressure, just an introduction to the sport with mom or dad right there.",
    bullets: [
      "For 2 and 3 year olds — no experience needed",
      "Saturday sessions only — no weekday practices",
      "Parent on the field with their child the whole time",
      "Soccer-oriented games and activities, not competitive play",
    ],
  },
  {
    id: "refs",
    icon: "⚑",
    short: "Paid referees at every game",
    summary:
      "Your kid's games will have paid, scheduled referees. No more missing officials, no more parents filling in.",
    body: "Paid referees at every game. No more missing officials, no more parents filling in, no more games without a ref. Referees are now compensated and scheduled for the full season. Coaches are not responsible for recruiting or coordinating officials.",
    bullets: [
      "Paid, scheduled referees at every game",
      "No more parent volunteers filling in as refs",
      "Coaches are not responsible for recruiting officials",
      "Higher standard of officiating and accountability",
    ],
  },
  {
    id: "playtime",
    icon: "⌁",
    short: "Playing time that rewards participation",
    summary:
      "For 1st grade and up, kids who come to practice earn more playing time on game day.",
    body: "For 1st grade and up, kids who come to practice earn more playing time on game day. Attendance is tracked in Spond and coaches have a real tool to reward players who put in the work. Every registered player gets the opportunity to play, but effort matters and your kid will see that reflected on the field.",
    bullets: [
      "Practice attendance tracked in Spond (1st grade and up)",
      "Players who come to practice earn more game time",
      "Three-quarter rule still applies for fully-attending players",
      "A fair, transparent system coaches and families can trust",
    ],
  },
  {
    id: "balance",
    icon: "◇",
    short: "Balanced teams from day one",
    summary:
      "A pre-season evaluation day and returning player data mean teams are built from real information, not guesswork.",
    body: "For divisions with practices and competitive play, we are using returning player data and a pre-season evaluation day to build balanced teams. The goal is every game is competitive and every kid has a great experience regardless of which team they are on.",
    bullets: [
      "Pre-season evaluation day for 3rd grade and up",
      "Returning player data from last season informs team building",
      "Teams balanced so every division is competitive",
      "Player requests taken into account where possible",
    ],
  },
  {
    id: "games",
    icon: "◐",
    short: "More games, more development",
    summary:
      "Every team from 1st grade and up will play 14 to 16 games this season, including midweek games.",
    body: "Every team from 1st grade and up will play 14 to 16 games this season. We are adding midweek games alongside Saturday matches. More games means more touches, more development, and more fun.",
    bullets: [
      "14 to 16 games per team this season",
      "Midweek games added alongside Saturday matches",
      "More touches, more development, more fun",
      "No extra planning required from coaches or families",
    ],
  },
];

export default function WhatsNewSection() {
  const [active, setActive] = useState("parent-me");
  const current = CHANGES.find((c) => c.id === active)!;

  return (
    <section className="bg-paper py-20" id="whats-new">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[720px]">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            What's new this year
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            Five big upgrades to this year's season
          </h2>
          <p className="text-slate mt-2 text-[17px] leading-relaxed">
            We make small improvements every season. But this year, there are five big shifts
            coming to soccer in Nipomo that change how things work for players, coaches, and families.
          </p>
        </div>

        <div className="roots-changes">
          <div className="flex flex-col gap-3" role="tablist" aria-label="What's new this year">
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
                  data-testid={`tab-whats-new-${c.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-semibold ${isActive ? "text-gold" : "text-slate"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg" aria-hidden="true">{c.icon}</span>
                  </div>
                  <h4 className={`font-semibold ${isActive ? "text-warmwhite" : "text-night"}`}>{c.short}</h4>
                  {"ageBadge" in c && c.ageBadge && (
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold tracking-wide ${isActive ? "bg-gold/20 text-gold" : "bg-crimson/10 text-crimson"}`}>
                      {c.ageBadge}
                    </span>
                  )}
                  <span className={`text-xs mt-2 inline-block ${isActive ? "text-gold" : "text-crimson"}`}>
                    {isActive ? "Showing details" : "Read more"} <span aria-hidden="true">→</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="roots-change-detail" role="tabpanel" aria-live="polite">
            <span className="text-xs font-semibold tracking-wider uppercase text-crimson font-mono">
              Change {String(CHANGES.findIndex((c) => c.id === active) + 1).padStart(2, "0")}
            </span>
            <h3 className="font-heading text-[28px] font-extrabold mt-1 text-night leading-tight">{current.short}</h3>
            {"ageBadge" in current && current.ageBadge && (
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg bg-crimson/10 border border-crimson/20 text-crimson text-sm font-bold">
                <span aria-hidden="true">👶</span> {current.ageBadge}
              </span>
            )}
            <p className="text-slate mt-2 text-[17px] leading-relaxed">{current.summary}</p>

            <p className="text-slate/80 mt-3 text-[15px] leading-relaxed">{current.body}</p>

            <div className="roots-change-detail__bullets">
              <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                What it means for your player
              </div>
              <ul className="space-y-2">
                {current.bullets.map((b, i) => (
                  <li key={i} className="text-[15px] text-night/80 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-gold before:font-bold">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
