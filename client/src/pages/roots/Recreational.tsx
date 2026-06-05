import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./roots.css";

const REGISTER_URL = "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061";

const DIVISIONS = [
  {
    id: "prek-k",
    label: "Pre-K / K",
    age: "Pre-K & Kindergarten",
    birthYear: "Born 2020-2022",
    format: "3v3 to 5v5",
    expect:
      "Saturday sessions start with 30 minutes of soccer-oriented drills followed by 30 minutes of scrimmages, anywhere from 3v3 to 5v5. Practices are at the coach's discretion based on the experience level of the group. Some coaches hold one practice per week, others keep it games only.",
    schedule: "10 games per season, practices vary by team",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "Participation medal"],
    color: "text-gold",
    badgeColor: "bg-gold/10 border-gold/30 text-gold",
  },
  {
    id: "1st-2nd",
    label: "1st-2nd Grade",
    age: "1st & 2nd Grade",
    birthYear: "Born 2018-2019",
    format: "4v4 to 6v6",
    expect:
      "Practices and games every week. Games are typically 4v4 to 6v6 depending on how many players show up and what coaches agree on. This is where kids start building real soccer skills in a structured but fun environment.",
    schedule: "1-2 practices per week (up to coach) + 14-16 games per season",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "Participation medal"],
    color: "text-crimson",
    badgeColor: "bg-crimson/10 border-crimson/30 text-crimson",
  },
  {
    id: "3rd-4th",
    label: "3rd-4th Grade",
    age: "3rd & 4th Grade",
    birthYear: "Born 2016-2017",
    format: "7v7 with goalkeepers",
    expect:
      "Practices and games every week. Games move to 7v7 with goalkeepers. Starting at this division, teams are balanced using player data from the pre-season Kickoff Day. End-of-season tournament for all teams.",
    schedule: "2 practices per week + 14-16 games per season",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "End-of-season tournament", "Awards based on tournament results"],
    color: "text-risegreen",
    badgeColor: "bg-risegreen/10 border-risegreen/30 text-risegreen",
  },
  {
    id: "5th-6th",
    label: "5th-6th Grade",
    age: "5th & 6th Grade",
    birthYear: "Born 2014-2015",
    format: "9v9 with goalkeepers",
    expect:
      "Practices and games every week. Games move to 9v9 with goalkeepers. Teams are balanced using returning player data and the pre-season Kickoff Day. End-of-season tournament for all teams.",
    schedule: "2 practices per week + 14-16 games per season",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "End-of-season tournament", "Awards based on tournament results"],
    color: "text-risegreen",
    badgeColor: "bg-risegreen/10 border-risegreen/30 text-risegreen",
  },
];

export default function Recreational() {
  const [active, setActive] = useState("prek-k");
  const div = DIVISIONS.find((d) => d.id === active)!;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="roots-hero bg-night" id="top">
        <div className="roots-hero__inner text-center flex flex-col items-center">
          <h1 className="font-display text-warmwhite text-[clamp(44px,8vw,96px)] leading-[0.92] uppercase tracking-tight max-w-[900px]">
            Practices, games, and a team to call their own.
          </h1>
          <p className="text-warmwhite/80 text-xl mt-6 leading-relaxed max-w-[640px]">
            The core ROOTS experience for Pre-K through 6th graders. Weekly practices, Saturday games, midweek matches, and an end-of-season tournament for older divisions. Up to 16 games per team this season.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
            >
              Register Now <span aria-hidden="true">&#8594;</span>
            </a>
            <a
              href="#divisions"
              className="px-6 py-3 border border-warmwhite/20 text-warmwhite rounded-lg hover:bg-warmwhite/5 transition-colors"
            >
              Find Your Division <span aria-hidden="true">&#8595;</span>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-paper py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            How it works
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-3 text-night">
            Teams, practices, and game day
          </h2>

          <div className="mt-6 space-y-5 text-slate text-[17px] leading-relaxed">
            <p>
              Every player is placed on a team with a volunteer coach. Teams practice during the week and play games on Saturdays. For 3rd grade and up, we also add midweek games so players get even more time on the field. All games have paid, scheduled referees.
            </p>
            <p>
              For 3rd grade and up, teams are balanced using returning player data and a pre-season Kickoff Day where players play pickup-style games so coaches and evaluators can see where every kid is at. The goal is competitive, balanced games every Saturday.
            </p>
          </div>
        </div>
      </section>

      {/* Find Your Division (Tabs) */}
      <section className="bg-night py-20" id="divisions">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-5">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
              Division Explorer
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
              Find your player's division
            </h2>
            <p className="text-warmwhite/55 mt-2 text-[17px]">
              Click your child's grade level to see what their season looks like. Divisions are based on grade level, aligned with the US Soccer school-year standard.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10" role="tabpanel" aria-live="polite">
            <div className="bg-night px-6 pt-4 pb-0 flex flex-wrap gap-1.5 border-b border-white/8" role="tablist">
              {DIVISIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActive(d.id)}
                  role="tab"
                  aria-selected={active === d.id}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    active === d.id
                      ? "bg-crimson text-warmwhite"
                      : "text-warmwhite/55 hover:text-warmwhite hover:bg-warmwhite/8"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="bg-night px-8 py-5 flex flex-wrap items-center gap-4 justify-between border-b border-white/10">
              <div>
                <p className="text-warmwhite/45 text-xs font-mono uppercase tracking-widest mb-1">{div.birthYear}</p>
                <h3 className="font-heading text-warmwhite font-bold text-xl">{div.label}</h3>
                <p className={`text-sm font-medium mt-0.5 ${div.color}`}>{div.format}</p>
              </div>
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-warmwhite font-semibold rounded-lg text-sm transition-colors shrink-0"
              >
                Register for {div.label} &#8594;
              </a>
            </div>

            <div className="roots-division-detail px-8 py-8 bg-white">
              <div>
                <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                  What to expect
                </div>
                <p className="text-night/85 text-[15px] leading-relaxed">{div.expect}</p>

                <div className="mt-6">
                  <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                    Schedule
                  </div>
                  <p className="text-night/85 text-[15px]">{div.schedule}</p>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                  Pricing
                </div>
                <div className="text-2xl font-display text-night leading-none">{div.price}</div>
                {div.priceNote && (
                  <p className="text-night/60 text-xs mt-1 font-mono uppercase tracking-wide">{div.priceNote}</p>
                )}

                <div className="mt-6">
                  <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                    What's included
                  </div>
                  <ul className="space-y-1.5">
                    {div.includes.map((item, i) => (
                      <li key={i} className="text-[15px] text-night/85 pl-5 relative before:content-['&#10003;'] before:absolute before:left-0 before:text-gold before:font-bold">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Season */}
      <section className="bg-paper py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            Season overview
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            The season
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-heading font-bold text-night text-lg">Kickoff Days (August 1 and 8)</h3>
              <p className="text-slate text-[15px] leading-relaxed mt-2">
                Before the season starts, all registered players come to Kickoff Day. Players play pickup-style games while coaches and evaluators watch. This is not a tryout. Every kid plays. It is how we see where every player is starting so we can build balanced teams. You only need to attend one of the two dates. Jersey fitting also happens at Kickoff Day.
              </p>
              <p className="text-slate/70 text-[14px] leading-relaxed mt-2">
                For Pre-K / Kindergarten and 1st-2nd Grade, Kickoff Day is about meeting your coach and teammates and getting fitted for jerseys. Team balancing based on evaluations starts at 3rd grade.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-bold text-night text-lg">Pre-Season (August 10 through September 7)</h3>
              <p className="text-slate text-[15px] leading-relaxed mt-2">
                Two full weeks of weekday practices before the first game. Then two scrimmage Saturdays where teams play in pennies (jerseys are still in production). Scrimmages are just like real games, but referees are more instructive and accommodating while players and coaches get settled in.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-bold text-night text-lg">Regular Season (September 12 through October 31)</h3>
              <p className="text-slate text-[15px] leading-relaxed mt-2">
                Eight weeks of Saturday games plus 2 to 4 midweek games. For 1st grade and up, all games are scored with live standings on nipomosc.org. Standings are used to seed the end-of-season tournament.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-bold text-night text-lg">Tournament (November 7)</h3>
              <p className="text-slate text-[15px] leading-relaxed mt-2">
                End-of-season tournament for 3rd through 6th grade. Minimum two games per team. Seeded by regular season standings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Playtime Policy */}
      <section className="bg-night py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Playtime policy
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            Playing time that rewards participation
          </h2>

          <div className="mt-6 space-y-5 text-warmwhite/80 text-[17px] leading-relaxed">
            <p>
              For 1st grade and up, playing time is tied to practice attendance tracked in Spond. Kids who come to practice consistently earn more game time. Players with full participation follow the three-quarter rule, meaning every player must play three quarters before any player plays the full game. This rewards effort while making sure every committed player gets meaningful time on the field.
            </p>
            <p>
              Every registered player gets the opportunity to play. But the first minutes go to the kids who are showing up and putting in the work.
            </p>
          </div>
        </div>
      </section>

      {/* Registration and Pricing */}
      <section className="bg-paper py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            Registration
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
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
                {["Custom ROOTS jersey (shirt and shorts)", "League participation and referee fees", "Insurance", "End-of-season tournament entry (8U and up)"].map((item) => (
                  <li key={item} className="text-[15px] text-night/85 pl-5 relative before:content-['&#10003;'] before:absolute before:left-0 before:text-gold before:font-bold">
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-slate text-[15px] mt-6 leading-relaxed">
                <strong>Coach perk:</strong> All volunteer coaches receive Early Bird pricing ($150) for their player, regardless of when they register.
              </p>

              <p className="text-slate text-[15px] mt-3 leading-relaxed">
                <strong>Scholarships:</strong> We do not want cost to keep any kid off the field. Email{" "}
                <a href="mailto:admin@nipomosoccer.com" className="text-crimson hover:underline">admin@nipomosoccer.com</a>{" "}
                if your family needs assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coach CTA */}
      <section className="roots-final-cta bg-crimson py-16">
        <div className="relative z-10 max-w-[880px] mx-auto px-6">
          <h2 className="font-display text-warmwhite text-[clamp(36px,5vw,60px)] uppercase leading-[0.92] tracking-tight">
            Want to coach?
          </h2>
          <p className="text-warmwhite/75 mt-4 text-[17px] leading-relaxed max-w-[600px]">
            Most of our coaches are parents just like you. No soccer experience required. We cover all training and certification costs, provide session plans and a full equipment kit, and support you throughout the season.
          </p>
          <a
            href="/coach"
            className="inline-block mt-6 px-8 py-4 bg-warmwhite text-crimson font-bold rounded-lg hover:bg-warmwhite/90 transition-colors"
          >
            Learn about coaching <span aria-hidden="true">&#8594;</span>
          </a>
        </div>
      </section>

      {/* Back to ROOTS + Final CTA */}
      <section className="bg-night py-16 text-center">
        <div className="max-w-[760px] mx-auto px-6">
          <h2 className="font-display text-warmwhite text-[clamp(40px,6vw,72px)] uppercase leading-[0.95]">
            Ready to play?
          </h2>
          <p className="text-warmwhite/75 mt-4 text-lg leading-relaxed">
            Registration is open for ROOTS Fall 2026. Find your division above and sign up today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-crimson text-warmwhite font-bold rounded-lg hover:bg-crimson-dark transition-colors text-lg"
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
