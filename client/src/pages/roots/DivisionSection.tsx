import { useState } from "react";

const DIVISIONS = [
  {
    id: "parent-me",
    label: "Parent & Me",
    age: "Ages 2–3",
    birthYear: "Born 2023–2024",
    format: "No games — Saturday sessions",
    expect:
      "Think of it like an organized PE class for you and your child to connect over soccer. You are on the field together for kid-friendly drills and soccer-oriented games in a fun weekend environment. No practices, no competitive games, just an introduction to the sport with mom or dad by their side.",
    schedule: "Saturday sessions only · 10 sessions per season",
    price: "$120 flat rate",
    includes: ["Kit", "Insurance", "Participation medal"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/7F3CC0F6316343DCB8851A6A05399DAA",
    color: "text-[#B99EE8]",
    badgeColor: "bg-purple/10 border-purple/30 text-[#B99EE8]",
  },
  {
    id: "prek-k",
    label: "Pre-K / K",
    age: "Pre-K & Kindergarten",
    birthYear: "Born 2020–2022",
    format: "3v3 to 5v5",
    expect:
      "Saturday sessions start with 30 minutes of soccer-oriented drills followed by 30 minutes of scrimmages, anywhere from 3v3 to 5v5. Practices are at the coach's discretion based on the experience level of the group. Some coaches hold one practice per week, others keep it games only.",
    schedule: "10 games per season · Practices vary by team",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "Participation medal"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061",
    color: "text-gold",
    badgeColor: "bg-gold/10 border-gold/30 text-gold",
  },
  {
    id: "1st-2nd",
    label: "1st–2nd Grade",
    age: "1st & 2nd Grade",
    birthYear: "Born 2018–2019",
    format: "4v4 to 6v6",
    expect:
      "Practices and games every week. Games are typically 4v4 to 6v6 depending on how many players show up and what coaches agree on. This is where kids start building real soccer skills in a structured but fun environment.",
    schedule: "1–2 practices per week (up to coach) · 14–16 games per season",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "Participation medal"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061",
    color: "text-crimson",
    badgeColor: "bg-crimson/10 border-crimson/30 text-crimson",
  },
  {
    id: "3rd-4th",
    label: "3rd–4th Grade",
    age: "3rd & 4th Grade",
    birthYear: "Born 2016–2017",
    format: "7v7 with goalkeepers",
    expect:
      "Practices and games every week. Games move to 7v7 with goalkeepers. The pre-season evaluation day starts at this division, and teams are balanced using player data. End-of-season tournament for all teams.",
    schedule: "2 practices per week · 14–16 games per season",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "End-of-season tournament", "Awards based on tournament results"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061",
    color: "text-risegreen",
    badgeColor: "bg-risegreen/10 border-risegreen/30 text-risegreen",
  },
  {
    id: "5th-6th",
    label: "5th–6th Grade",
    age: "5th & 6th Grade",
    birthYear: "Born 2014–2015",
    format: "9v9 with goalkeepers",
    expect:
      "Practices and games every week. Games move to 9v9 with goalkeepers. Teams are balanced using returning player data and the pre-season evaluation day. End-of-season tournament for all teams.",
    schedule: "2 practices per week · 14–16 games per season",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "End-of-season tournament", "Awards based on tournament results"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061",
    color: "text-risegreen",
    badgeColor: "bg-risegreen/10 border-risegreen/30 text-risegreen",
  },
  {
    id: "7th-8th",
    label: "7th–8th Grade",
    age: "7th & 8th Grade",
    birthYear: "Born 2012–2013",
    format: "11v11 full format",
    expect:
      "Practices and games every week. Full 11v11 format. Teams are balanced using returning player data and the pre-season evaluation day. End-of-season tournament for all teams.",
    schedule: "2 practices per week · 10–16 games per season*",
    scheduleNote: "* Game count dependent on registration numbers and crossplay availability with other regions.",
    price: "$150 / $175 / $200",
    priceNote: "Early Bird (first 100) / Regular / Late",
    includes: ["Kit", "Insurance", "End-of-season tournament", "Awards based on tournament results"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061",
    color: "text-risegreen",
    badgeColor: "bg-risegreen/10 border-risegreen/30 text-risegreen",
  },
  {
    id: "special-needs",
    label: "Special Needs",
    age: "All ages",
    birthYear: "All ages welcome",
    format: "Drills & scrimmages with accommodations",
    expect:
      "A combination of drills and scrimmages with accommodations based on player needs. Every session is designed to be inclusive and supportive so every player can participate and have fun.",
    schedule: "Saturday sessions only · 10 sessions per season",
    price: "$50 flat rate",
    includes: ["Kit", "Insurance", "Participation medal"],
    registerUrl: "https://club.spond.com/landing/signup/nipomosc/form/212CA66EC0C84B88AB2BEB08FEE18ECF",
    color: "text-gold",
    badgeColor: "bg-gold/10 border-gold/30 text-gold",
  },
];

export default function DivisionSection() {
  const [active, setActive] = useState("prek-k");
  const div = DIVISIONS.find((d) => d.id === active)!;

  return (
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
            Click your child's grade level to see what their season looks like. This year, US Soccer
            has shifted from birth-year divisions to school-year alignment, so your child's division
            is based on their grade level.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10" role="tabpanel" aria-live="polite">
          {/* Tab bar — lives inside the box */}
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
                data-testid={`tab-division-${d.id}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Division header */}
          <div className="bg-night px-8 py-5 flex flex-wrap items-center gap-4 justify-between border-b border-white/10">
            <div>
              <p className="text-warmwhite/45 text-xs font-mono uppercase tracking-widest mb-1">{div.birthYear}</p>
              <h3 className="font-heading text-warmwhite font-bold text-xl">{div.label}</h3>
              <p className={`text-sm font-medium mt-0.5 ${div.color}`}>{div.format}</p>
            </div>
            <a
              href={div.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-warmwhite font-semibold rounded-lg text-sm transition-colors shrink-0"
              data-testid={`link-register-${div.id}`}
            >
              Register for {div.label} →
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
                {"scheduleNote" in div && div.scheduleNote && (
                  <p className="text-night/50 text-xs mt-2 leading-relaxed">{div.scheduleNote}</p>
                )}
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
                    <li key={i} className="text-[15px] text-night/85 pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-gold before:font-bold">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="text-warmwhite/55 text-sm mt-4 text-center">
          Early Bird ($150) is limited to the first 100 registrations — act fast. Regular pricing through July 31 · Late registration begins August 1 ($200) · Coaches receive Early Bird pricing regardless of when they register
        </p>
      </div>
    </section>
  );
}
