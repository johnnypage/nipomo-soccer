import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DivisionInfo {
  name: string;
  uGroup: string;
  grade: string;
  format: string;
  games: string;
  practices: string;
  extra: string;
  color: string;
}

const DIVISIONS: DivisionInfo[] = [
  {
    name: "Parent & Me",
    uGroup: "U3 / U4",
    grade: "Ages 2-3",
    format: "Drills + soccer games, parent on field",
    games: "10 sessions",
    practices: "None",
    extra: "Medal at end of season",
    color: "from-gold/20 to-gold/5 border-gold/30",
  },
  {
    name: "Pre-K / K",
    uGroup: "U5 / U6",
    grade: "Pre-K through Kindergarten",
    format: "30 min drills + 30 min scrimmages (3v3 to 5v5)",
    games: "10 games",
    practices: "Coach's discretion",
    extra: "Medal at end of season",
    color: "from-[#4A2B73]/20 to-[#4A2B73]/5 border-[#4A2B73]/30",
  },
  {
    name: "1st - 2nd Grade",
    uGroup: "U7 / U8",
    grade: "1st and 2nd Grade",
    format: "4v4 to 6v6",
    games: "14-16 games",
    practices: "1-2x / week",
    extra: "Medal at end of season",
    color: "from-[#1a6b3c]/20 to-[#1a6b3c]/5 border-[#1a6b3c]/30",
  },
  {
    name: "3rd - 4th Grade",
    uGroup: "U9 / U10",
    grade: "3rd and 4th Grade",
    format: "7v7 with goalkeeper",
    games: "14-16 games",
    practices: "2x / week",
    extra: "End-of-season tournament",
    color: "from-crimson/20 to-crimson/5 border-crimson/30",
  },
  {
    name: "5th - 6th Grade",
    uGroup: "U11 / U12",
    grade: "5th and 6th Grade",
    format: "9v9 with goalkeeper",
    games: "14-16 games",
    practices: "2x / week",
    extra: "End-of-season tournament",
    color: "from-crimson/20 to-crimson/5 border-crimson/30",
  },
  {
    name: "7th - 8th Grade",
    uGroup: "U13 / U14",
    grade: "7th and 8th Grade",
    format: "11v11",
    games: "14-16 games",
    practices: "2x / week",
    extra: "End-of-season tournament",
    color: "from-crimson/20 to-crimson/5 border-crimson/30",
  },
];

type ResultType =
  | { type: "too_young" }
  | { type: "too_old" }
  | { type: "division"; division: DivisionInfo };

// Nipomo Soccer uses a September 1 cutoff so players are in the division
// that matches their California school grade.
function getDivision(dob: Date): ResultType {
  // Too young: born Sep 1, 2024 or later (under 2 years old as of Sep 1, 2026)
  const tooYoungCutoff = new Date(2024, 8, 1); // Sep 1, 2024
  // Too old: born before Sep 1, 2012
  const tooOldCutoff = new Date(2012, 8, 1);   // Sep 1, 2012

  if (dob >= tooYoungCutoff) return { type: "too_young" };
  if (dob < tooOldCutoff) return { type: "too_old" };

  // Sep 1 of startYear through Aug 31 of startYear+1
  const ranges: { start: Date; end: Date; divIndex: number }[] = [
    { start: new Date(2023, 8, 1), end: new Date(2024, 7, 31), divIndex: 0 }, // Parent & Me
    { start: new Date(2022, 8, 1), end: new Date(2023, 7, 31), divIndex: 0 }, // Parent & Me
    { start: new Date(2021, 8, 1), end: new Date(2022, 7, 31), divIndex: 1 }, // Pre-K / K
    { start: new Date(2020, 8, 1), end: new Date(2021, 7, 31), divIndex: 1 }, // Pre-K / K
    { start: new Date(2019, 8, 1), end: new Date(2020, 7, 31), divIndex: 2 }, // 1st-2nd
    { start: new Date(2018, 8, 1), end: new Date(2019, 7, 31), divIndex: 2 }, // 1st-2nd
    { start: new Date(2017, 8, 1), end: new Date(2018, 7, 31), divIndex: 3 }, // 3rd-4th
    { start: new Date(2016, 8, 1), end: new Date(2017, 7, 31), divIndex: 3 }, // 3rd-4th
    { start: new Date(2015, 8, 1), end: new Date(2016, 7, 31), divIndex: 4 }, // 5th-6th
    { start: new Date(2014, 8, 1), end: new Date(2015, 7, 31), divIndex: 4 }, // 5th-6th
    { start: new Date(2013, 8, 1), end: new Date(2014, 7, 31), divIndex: 5 }, // 7th-8th
    { start: new Date(2012, 8, 1), end: new Date(2013, 7, 31), divIndex: 5 }, // 7th-8th
  ];

  const match = ranges.find((r) => dob >= r.start && dob <= r.end);
  if (match) return { type: "division", division: DIVISIONS[match.divIndex] };

  return { type: "too_old" };
}

const FAQS = [
  {
    q: "What changed with U.S. Soccer age groups?",
    a: "U.S. Soccer moved from a January 1 calendar-year cutoff to an August 1 school-year cutoff starting in 2026-2027. Nipomo Soccer goes one step further -- we use a September 1 cutoff that aligns with the California school year. That means if your child is in 2nd grade at school, they play in our 2nd grade division. Kids play with their classmates, not with kids who are nearly a year older or younger.",
  },
  {
    q: "What if my child's birthday is in August?",
    a: "Because we use a September 1 cutoff aligned with California schools, your child will be placed in the same division as their school classmates. For example, a child born August 16, 2020 who is entering 1st grade will play in our 1st-2nd Grade division. Their birthday being in August does not bump them down a division.",
  },
  {
    q: "What if my child is in a different grade than expected for their age?",
    a: "Nipomo Soccer places players in the division matching the California school-year grade for their birth date (September 1 cutoff). If your child was held back or skipped a grade, their division placement is still based on birth date. Reach out at admin@nipomosoccer.com if you have a specific situation and we'll work with you.",
  },
  {
    q: "When does registration open?",
    a: "Early Bird registration opens soon. Follow @nipomo.soccer on Instagram or visit nipomosoccer.com for updates.",
  },
];

export default function FindMyDivision() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleDateChange(value: string) {
    setDob(value);
    if (!value) { setResult(null); return; }
    const parsed = new Date(value + "T12:00:00");
    if (isNaN(parsed.getTime())) { setResult(null); return; }
    setResult(getDivision(parsed));
  }

  return (
    <div className="min-h-screen bg-night text-warmwhite">
      <Header />

      {/* Hero */}
      <section className="pt-36 pb-14 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/8 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.2em] mb-4">ROOTS Fall 2026</p>
          <h1 className="font-display text-6xl sm:text-7xl uppercase tracking-wide text-warmwhite leading-none mb-5">
            Find Your<br />
            <span className="text-crimson">Division</span>
          </h1>
          <p className="text-warmwhite/60 text-lg leading-relaxed max-w-xl mx-auto">
            Nipomo Soccer uses a September 1 cutoff so your child plays in the division that matches their school grade. Enter their birthday and we'll show you exactly where they play.
          </p>
        </div>
      </section>

      {/* Birthday Input */}
      <section className="px-6 pb-12">
        <div className="max-w-md mx-auto">
          <div className="bg-warmwhite/5 border border-warmwhite/10 rounded-2xl p-8">
            <label className="block text-warmwhite/70 text-sm font-medium mb-1.5 text-center">
              Child's date of birth
            </label>
            <p className="text-warmwhite/35 text-xs text-center mb-5">
              Division is based on school grade as of September 1, 2026
            </p>
            <input
              type="date"
              value={dob}
              onChange={(e) => handleDateChange(e.target.value)}
              min="2012-09-01"
              max="2024-08-31"
              data-testid="input-birthday"
              className="w-full px-4 py-4 bg-warmwhite/8 border border-warmwhite/15 rounded-xl text-warmwhite text-lg text-center focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Result card */}
          {result && (
            <div className="mt-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {result.type === "too_young" && (
                <div className="bg-gold/10 border border-gold/25 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-3">🌱</div>
                  <p className="text-warmwhite font-semibold text-lg mb-2">Not quite yet!</p>
                  <p className="text-warmwhite/60 text-sm leading-relaxed">
                    Your child isn't quite old enough yet! Check back when they turn 2 for our Parent & Me program.
                  </p>
                </div>
              )}

              {result.type === "too_old" && (
                <div className="bg-crimson/10 border border-crimson/25 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-3">👋</div>
                  <p className="text-warmwhite font-semibold text-lg mb-2">Outside our current age range</p>
                  <p className="text-warmwhite/60 text-sm leading-relaxed">
                    Your child is older than our current age range. Contact us at{" "}
                    <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>
                    {" "}for options, or check out our{" "}
                    <a href="/reign" className="text-gold underline underline-offset-2">REIGN competitive program</a>.
                  </p>
                </div>
              )}

              {result.type === "division" && (
                <div className={`bg-gradient-to-br ${result.division.color} border rounded-2xl p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-warmwhite/50 text-xs font-semibold uppercase tracking-widest mb-1">Your division</p>
                      <h2 className="font-display text-5xl uppercase tracking-wide text-warmwhite leading-none">
                        {result.division.name}
                      </h2>
                    </div>
                    <span className="bg-warmwhite/10 text-warmwhite/70 text-xs font-mono px-3 py-1.5 rounded-full border border-warmwhite/15 flex-shrink-0 mt-1">
                      {result.division.uGroup}
                    </span>
                  </div>

                  <p className="text-warmwhite/50 text-xs mb-4">{result.division.grade}</p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-night/40 rounded-xl p-3">
                      <p className="text-warmwhite/40 text-xs uppercase tracking-wider mb-1">Format</p>
                      <p className="text-warmwhite text-sm font-medium leading-snug">{result.division.format}</p>
                    </div>
                    <div className="bg-night/40 rounded-xl p-3">
                      <p className="text-warmwhite/40 text-xs uppercase tracking-wider mb-1">Games</p>
                      <p className="text-warmwhite text-sm font-medium">{result.division.games}</p>
                    </div>
                    <div className="bg-night/40 rounded-xl p-3">
                      <p className="text-warmwhite/40 text-xs uppercase tracking-wider mb-1">Practices</p>
                      <p className="text-warmwhite text-sm font-medium">{result.division.practices}</p>
                    </div>
                    <div className="bg-night/40 rounded-xl p-3">
                      <p className="text-warmwhite/40 text-xs uppercase tracking-wider mb-1">Bonus</p>
                      <p className="text-warmwhite text-sm font-medium leading-snug">{result.division.extra}</p>
                    </div>
                  </div>

                  <a
                    href="https://club.spond.com/landing/signup/nipomosc"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-register-now"
                    className="block w-full py-3.5 bg-crimson text-warmwhite font-semibold text-center rounded-xl hover:bg-crimson/90 transition-colors"
                  >
                    Register Now
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Full division reference table */}
      <section className="px-6 py-12 border-t border-warmwhite/8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-xl text-warmwhite text-center mb-2">Full Division Reference</h2>
          <p className="text-warmwhite/40 text-sm text-center mb-8">Based on birth date -- September 1 school-year cutoff.</p>

          <div className="rounded-xl border border-warmwhite/10 overflow-hidden">
            <div className="grid grid-cols-3 bg-warmwhite/8 px-4 py-2.5 text-xs text-warmwhite/40 uppercase tracking-wider">
              <span>Birth Date Range</span>
              <span className="text-center">Age Group</span>
              <span className="text-right">Division</span>
            </div>
            {[
              { range: "Sep 2023 -- Aug 2024", uGroup: "U3/U4", div: "Parent & Me" },
              { range: "Sep 2022 -- Aug 2023", uGroup: "U4",    div: "Parent & Me" },
              { range: "Sep 2021 -- Aug 2022", uGroup: "U5",    div: "Pre-K / K" },
              { range: "Sep 2020 -- Aug 2021", uGroup: "U6",    div: "Pre-K / K" },
              { range: "Sep 2019 -- Aug 2020", uGroup: "U7",    div: "1st - 2nd Grade" },
              { range: "Sep 2018 -- Aug 2019", uGroup: "U8",    div: "1st - 2nd Grade" },
              { range: "Sep 2017 -- Aug 2018", uGroup: "U9",    div: "3rd - 4th Grade" },
              { range: "Sep 2016 -- Aug 2017", uGroup: "U10",   div: "3rd - 4th Grade" },
              { range: "Sep 2015 -- Aug 2016", uGroup: "U11",   div: "5th - 6th Grade" },
              { range: "Sep 2014 -- Aug 2015", uGroup: "U12",   div: "5th - 6th Grade" },
              { range: "Sep 2013 -- Aug 2014", uGroup: "U13",   div: "7th - 8th Grade" },
              { range: "Sep 2012 -- Aug 2013", uGroup: "U14",   div: "7th - 8th Grade" },
            ].map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-warmwhite/8 ${i % 2 === 0 ? "bg-transparent" : "bg-warmwhite/3"}`}
              >
                <span className="text-warmwhite/60">{row.range}</span>
                <span className="text-warmwhite/50 text-center font-mono text-xs">{row.uGroup}</span>
                <span className="text-warmwhite font-medium text-right">{row.div}</span>
              </div>
            ))}
          </div>

          <p className="text-warmwhite/30 text-xs text-center mt-4 leading-relaxed">
            U.S. Soccer moved to an August 1 national cutoff for 2026-2027. Nipomo Soccer uses September 1 so players stay with their California school-grade classmates.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-12 border-t border-warmwhite/8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-xl text-warmwhite text-center mb-8">Common Questions</h2>

          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-warmwhite/5 border border-warmwhite/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-${i}`}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                >
                  <span className="text-warmwhite font-medium text-sm leading-snug">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-warmwhite/40 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-warmwhite/40 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-warmwhite/60 text-sm leading-relaxed border-t border-warmwhite/8 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-crimson py-24 text-center">
        <div className="max-w-[760px] mx-auto px-6">
          <blockquote className="mb-10">
            <p className="text-warmwhite/80 italic text-xl leading-relaxed">
              "Our kids had an amazing experience and they can't wait for next year."
            </p>
            <footer className="mt-2 text-xs font-mono text-warmwhite/40 uppercase tracking-wider">Parent -- 2025 Survey</footer>
          </blockquote>
          <h2 className="font-display text-warmwhite text-[clamp(48px,7vw,88px)] uppercase leading-[0.95]">
            Ready to play?
          </h2>
          <p className="text-warmwhite/75 mt-4 text-lg leading-relaxed">
            Registration is open for ROOTS Fall 2026. Sign up today and lock in your spot.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a
              href="https://club.spond.com/landing/signup/nipomosc/form/534965DA898B4B7E9CC0A589047F6061"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-register-cta"
              className="px-8 py-4 bg-white text-crimson font-bold rounded-lg hover:bg-warmwhite transition-colors text-lg"
            >
              Register Now →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
