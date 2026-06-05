import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./roots.css";

const REGISTER_URL = "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061";

const TIMELINE = [
  { time: "5:00", label: "All four teams warm up together. A lead coach runs 30 minutes of passing sequences, dribbling work, small-sided possession games, and shooting. This is the coaching. There are no separate practices during the week." },
  { time: "5:30", label: "First match kicks off. Two teams play while the other two rest, do skills work on a spare goal, or watch." },
  { time: "5:35", label: "Three matches rotate through. Each team plays twice and sits once. Every match is two 12-minute halves with a 1-minute break at half." },
  { time: "7:10", label: "Scores posted, cooldown, done." },
];

const WHY_ITEMS = [
  {
    num: "01",
    title: "Every player touches the ball",
    body: "In 5v5, players average roughly 4 touches per minute. In traditional 11v11, that number drops below half a touch per minute. On a smaller field with fewer players, there is nowhere to hide. Every player is making decisions, receiving the ball, and contributing on every play.",
  },
  {
    num: "02",
    title: "It fits real life",
    body: "No separate weekday practices. No long Saturday commitments. Two sessions per week. Players juggling football, volleyball, cross-country, after-school jobs, or homework can still play a full season of competitive soccer without it taking over their schedule.",
  },
  {
    num: "03",
    title: "More games, not fewer",
    body: "Traditional rec at this age typically delivers 8 to 12 games per season. The 5v5 format delivers over 20. Two games per session, two sessions per week, across a full ROOTS season. Your player will see more competitive minutes in this format than in any traditional rec league.",
  },
  {
    num: "04",
    title: "It stays local",
    body: "Every game is played right here in Nipomo. No travel, no cross-play with other towns. Your player's opponents are kids from the same community, and you can watch every game from the same sideline all season.",
  },
];

const SEASON = [
  {
    phase: "Kickoff Days",
    dates: "Aug 1 & 8",
    detail: "All 5v5 players attend at least one Kickoff Day. Players play pickup-style games so we can see where everyone is at, then teams are balanced by ability, age, and size. Jersey fitting also happens here.",
  },
  {
    phase: "Pre-Season",
    dates: "Aug 10 through Sep 7",
    detail: "Sessions begin the week of August 10. Scrimmage days on August 22 and 29 give players a full game-day experience before the regular season. Players wear ROOTS pennies until jerseys arrive. Labor Day weekend off.",
  },
  {
    phase: "Regular Season",
    dates: "Sep 12 through Oct 31",
    detail: "Twice-weekly sessions with refereed, scored matches. Live standings on nipomosc.org. Jerseys distributed the week of September 7. Over 20 games total across the regular season window.",
  },
  {
    phase: "Tournament",
    dates: "Nov 7",
    detail: "End-of-season tournament seeded by regular season standings. Minimum two games per team. Saturday morning through afternoon.",
  },
];

const FAQS = [
  {
    q: "Why not regular 11v11?",
    a: "At this age in a town our size, we have about 25 to 30 kids who want to play. That is not enough for 11v11. You would end up with two teams playing each other every week, or traveling to other towns for cross-play. 5v5 keeps it local, keeps it competitive, and gives every player more soccer per hour than 11v11 ever could.",
  },
  {
    q: "Is it safe for 7th graders to play with 12th graders?",
    a: "Teams are balanced by ability, not just age. The 5v5 format also reduces the physical mismatch you would see in traditional formats. There is no slide tackling, no aerial battles, and no long sprints where size dominates. It is close control, quick decisions, and constant movement. If enrollment grows past 35 players, we split into two age-based divisions.",
  },
  {
    q: "Does my kid need to come to both sessions every week?",
    a: "No. The format is built to handle absences. With 7 to 8 players per team, one or two missing players on a given day does not create a problem. If a team is short, players borrow from the team sitting out that round. Just play when you can.",
  },
  {
    q: "What if my kid plays other sports too?",
    a: "That is exactly who this is for. The no-practice, twice-a-week format exists because we know these players are busy. There is no penalty for missing a session, and the schedule is designed to coexist with other fall sports.",
  },
  {
    q: "Is this competitive or just pickup?",
    a: "Every match is refereed and scored. We run live standings on the website. There is a Golden Boot race for the top scorer posted weekly. The season ends with a seeded tournament. If your player wants more after this, they can enter sanctioned 5v5 Soccer national qualifying tournaments using the exact same rules.",
  },
];

export default function FiveVFive() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="roots-hero bg-night" id="top">
        <div className="roots-hero__inner text-center flex flex-col items-center">
          <h1 className="font-display text-warmwhite text-[clamp(44px,8vw,96px)] leading-[0.92] uppercase tracking-tight max-w-[900px]">
            No practices. Just games.
          </h1>
          <p className="text-warmwhite/80 text-xl mt-6 leading-relaxed max-w-[640px]">
            Fast-paced 5v5 soccer for 7th through 12th graders. Twice a week, your player shows up, warms up, plays two competitive matches, and goes home. That is the whole commitment.
          </p>

          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
          >
            Register Now <span aria-hidden="true">&#8594;</span>
          </a>
        </div>
      </section>

      {/* What is 5v5? */}
      <section className="bg-paper py-16 md:py-24">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            The format
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-3 text-night">
            What is 5v5?
          </h2>

          <div className="mt-6 space-y-5 text-slate text-[17px] leading-relaxed">
            <p>
              Five players on each side, including a goalkeeper, on a smaller field. The ball moves faster, every player is involved on every play, and the pace is closer to futsal than traditional rec soccer. It is the same format used in over 200 tournaments nationally through 5v5 Soccer, a Cal South partner with a National Championship pathway.
            </p>
            <p>
              We brought this format to ROOTS because it solves two real problems at this age. First, Nipomo has never had enough 14U and up players to fill out traditional 11v11 divisions without traveling to other towns. 5v5 runs with fewer players and keeps everything local. Second, this is the age when kids stop playing. The combination of other sports, homework, jobs, and general teenage life makes it hard to commit to multiple practices plus a weekend game. 5v5 removes that barrier entirely.
            </p>
          </div>
        </div>
      </section>

      {/* A Typical Game Day */}
      <section className="bg-night py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Game day
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            A typical session
          </h2>
          <p className="text-warmwhite/55 mt-2 text-[17px]">
            Your player shows up to the field for a one-stop session. Here is how it goes.
          </p>

          <div className="mt-8 space-y-0">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-5 py-5 border-b border-warmwhite/10 last:border-0">
                <div className="font-display text-crimson text-lg tracking-wide whitespace-nowrap w-[72px] shrink-0">
                  {item.time}
                </div>
                <p className="text-warmwhite/80 text-[15px] leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-warmwhite/55 text-sm mt-6">
            Total time at the field: about two hours. Your player gets two full competitive games every session.
          </p>
        </div>
      </section>

      {/* Why 5v5 */}
      <section className="bg-night py-16 md:py-24">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Why 5v5
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            Four reasons this format works
          </h2>

          <div className="mt-10 space-y-0">
            {WHY_ITEMS.map((item) => (
              <div key={item.num} className="flex gap-6 md:gap-8 py-8 border-b border-warmwhite/10 last:border-0 first:pt-0">
                <div className="font-display text-crimson text-4xl md:text-5xl leading-none tracking-tight shrink-0 w-[56px] md:w-[72px]">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-warmwhite text-lg">{item.title}</h3>
                  <p className="text-warmwhite/65 text-[15px] leading-relaxed mt-2">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Season */}
      <section className="bg-paper py-16 md:py-24">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            Season overview
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            The season
          </h2>
          <p className="text-slate mt-2 text-[17px]">
            The 5v5 division follows the same ROOTS season window. August through November, over 20 games total.
          </p>

          <div className="mt-8 space-y-6">
            {SEASON.map((item) => (
              <div key={item.phase} className="bg-white rounded-xl border border-black/8 p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <h3 className="font-heading font-bold text-night text-lg">{item.phase}</h3>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-crimson">{item.dates}</span>
                </div>
                <p className="text-slate text-[15px] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <p className="text-slate/70 text-sm mt-6">
            All games are refereed and scored. Standings are live on nipomosc.org. The season ends with a tournament seeded by regular season results.
          </p>
        </div>
      </section>

      {/* Registration and Pricing */}
      <section className="bg-night py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Registration
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            Registration and pricing
          </h2>

          <div className="mt-8 bg-white rounded-xl border border-black/8 overflow-hidden">
            <table className="roots-pricing-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Dates</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-night">Early Bird</td>
                  <td className="text-slate">Now through first 100 families</td>
                  <td className="font-display text-xl text-crimson">$150</td>
                </tr>
                <tr>
                  <td className="font-medium text-night">Regular</td>
                  <td className="text-slate">After Early Bird sells out, through July 31</td>
                  <td className="font-display text-xl text-crimson">$175</td>
                </tr>
                <tr>
                  <td className="font-medium text-night">Late</td>
                  <td className="text-slate">August 1 and after</td>
                  <td className="font-display text-xl text-crimson">$200</td>
                </tr>
              </tbody>
            </table>

            <div className="px-6 pb-6 pt-2">
              <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono mt-4">
                What's included
              </div>
              <ul className="space-y-1.5">
                {["Custom ROOTS jersey (shirt and shorts)", "League participation and referee fees", "Insurance", "End-of-season tournament entry"].map((item) => (
                  <li key={item} className="text-[15px] text-night/85 pl-5 relative before:content-['&#10003;'] before:absolute before:left-0 before:text-gold before:font-bold">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-slate text-[15px] mt-6 leading-relaxed">
                <strong>Scholarships:</strong> We do not want cost to keep any player off the field. Email{" "}
                <a href="mailto:admin@nipomosoccer.com" className="text-crimson hover:underline">admin@nipomosoccer.com</a>{" "}
                if your family needs assistance.
              </p>

              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
              >
                Sign up for 7th-12th Grade 5v5 <span aria-hidden="true">&#8594;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            Questions
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            Common questions about 5v5
          </h2>

          <div className="flex flex-col gap-3 mt-8">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-black/8"
                open={false}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-medium text-night list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <svg
                    className="w-5 h-5 text-slate/40 group-open:text-crimson transition-all group-open:rotate-180 flex-shrink-0 ml-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-slate text-[15px] leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Back to ROOTS + CTA */}
      <section className="roots-final-cta bg-crimson py-16 text-center">
        <div className="relative z-10 max-w-[760px] mx-auto px-6">
          <h2 className="font-display text-warmwhite text-[clamp(40px,6vw,72px)] uppercase leading-[0.95]">
            Ready to play?
          </h2>
          <p className="text-warmwhite/75 mt-4 text-lg leading-relaxed">
            Sign up for the 5v5 league and get your player on the field this fall.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-crimson font-bold rounded-lg hover:bg-warmwhite transition-colors text-lg"
            >
              Register Now <span aria-hidden="true">&#8594;</span>
            </a>
          </div>
          <a
            href="/roots"
            className="inline-block mt-6 text-warmwhite/60 hover:text-warmwhite text-sm transition-colors"
          >
            &#8592; See all ROOTS divisions
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
