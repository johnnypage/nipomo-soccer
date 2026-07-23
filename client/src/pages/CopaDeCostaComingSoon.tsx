import { motion } from "framer-motion";
import Header from "@/components/Header";
import copaLogo from "@assets/Copa_Final_1780769803507.png";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const GOTSPORT_URL = "https://system.gotsport.com/event_regs/e064e077e3";

const divisions = [
  { age: "U10", fee: "$695" },
  { age: "U11", fee: "$795" },
  { age: "U12", fee: "$795" },
  { age: "U13", fee: "$895" },
  { age: "U14", fee: "$895" },
  { age: "U15", fee: "$895" },
  { age: "U16", fee: "$895" },
  { age: "U17", fee: "$895" },
  { age: "U18", fee: "$895" },
  { age: "U19", fee: "$895" },
];

const scheduleDay1 = [
  { time: "7:00 – 8:00am", event: "Gates open · Team check-in" },
  { time: "8:00am – 5:00pm", event: "Tier point games (all age groups)" },
];

const scheduleDay2 = [
  { time: "7:00 – 8:00am", event: "Gates open · Team check-in" },
  { time: "8:00am – 12:00pm", event: "Semifinals (all tiers)" },
  { time: "1:00 – 5:00pm", event: "Finals (all tiers)" },
];

const faq = [
  {
    q: "What league affiliations are accepted?",
    a: "We welcome teams affiliated with Cal South, Cal North, US Soccer, USYS, or AYSO. Out-of-state teams require prior approval.",
  },
  {
    q: "How does the tier-based format work?",
    a: "Teams are grouped into tiers based on their league division standing rather than traditional pools. Each tier runs independently -- Day 1 is point games within your tier, Day 2 is semifinals and finals within that same tier. Every tier crowns its own champion and runner-up.",
  },
  {
    q: "How is check-in handled?",
    a: "Check-in is fully digital through GotSport. Accepted teams will receive check-in instructions by email. All check-in must be completed before your team's first match.",
  },
  {
    q: "What is the registration deadline?",
    a: "Registration details are coming soon. Applications submitted through GotSport are reviewed and you will be notified of acceptance, waitlist, or decline status by email.",
  },
  {
    q: "What happens if my division doesn't fill?",
    a: "Tier count per age group is set at registration based on sign-up volume. If a tier doesn't reach minimum enrollment, teams may be merged or relocated -- you will be notified before the deadline.",
  },
  {
    q: "Who do I contact for questions?",
    a: "Email us at tournament@nipomosc.org and we'll get back to you.",
  },
];

export default function CopaDeCostaComingSoon() {
  return (
    <>
      <Header />

      <main className="bg-[#0A0A0A] text-[#F5F5F5] pt-28">

        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          className="relative flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
          data-testid="section-copa-hero"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 30%, #8B2332 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <img
              src={copaLogo}
              alt="Copa De Costa logo"
              className="w-56 sm:w-72 h-auto drop-shadow-2xl"
              data-testid="img-copa-logo"
            />

            <div>
              <p className="text-[#D4A747] font-heading font-semibold text-sm uppercase tracking-widest mb-2">
                Presented by Nipomo Soccer
              </p>
              <h1
                className="font-integral font-bold uppercase leading-none"
                style={{
                  fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                  color: "#F5F5F5",
                }}
                data-testid="text-copa-heading"
              >
                Copa De Costa
              </h1>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm font-heading font-medium">
              <span className="bg-[#D4A747]/15 border border-[#D4A747]/40 rounded-full px-4 py-1.5 text-[#D4A747]">
                May 8 – 9, 2027
              </span>
              <span className="bg-[#D4A747]/15 border border-[#D4A747]/40 rounded-full px-4 py-1.5 text-[#D4A747]">
                Nipomo, CA · Central Coast
              </span>
            </div>

            <a
              href={GOTSPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 bg-crimson hover:bg-crimson/85 text-white font-heading font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-lg transition-colors"
              data-testid="button-copa-register"
            >
              Register on GotSport
              <span aria-hidden="true">→</span>
            </a>

            <p className="text-[#595959] text-sm">
              Registration details coming soon
            </p>
          </motion.div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────── */}
        <section className="bg-[#111111] py-16 px-4" data-testid="section-copa-about">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-6 text-center"
            >
              About the Tournament
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#F5F5F5]/70 text-base sm:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-12"
            >
              Copa De Costa is a two-day Cal South Class II sanctioned club tournament
              hosted by Nipomo Soccer on the Central Coast. Ten age groups, Boys and Girls
              divisions, and a tier-based format.
            </motion.p>

            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { value: "10", label: "Age Groups" },
                { value: "~80", label: "Target Teams" },
                { value: "2", label: "Days of Play" },
                { value: "Class II", label: "Cal South Tier" },
              ].map(({ value, label }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 text-center"
                >
                  <div
                    className="font-integral font-bold text-3xl mb-1"
                    style={{ color: "#D4A747" }}
                  >
                    {value}
                  </div>
                  <div className="text-[#F5F5F5]/50 text-xs font-heading uppercase tracking-wider">
                    {label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── DIVISIONS & FEES ─────────────────────────────── */}
        <section className="py-16 px-4" data-testid="section-copa-divisions">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-2 text-center"
            >
              Divisions &amp; Entry Fees
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[#F5F5F5]/50 text-sm text-center mb-8"
            >
              All age groups offer Boys and Girls divisions · Format: Tier point games Day 1 · Semis &amp; Finals Day 2
            </motion.p>

            <motion.div variants={fadeUp} className="overflow-x-auto">
              <table
                className="w-full text-sm border-collapse"
                data-testid="table-copa-divisions"
              >
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left py-3 px-4 text-[#D4A747] font-heading font-semibold uppercase tracking-wider text-xs">
                      Age Group
                    </th>
                    <th className="text-left py-3 px-4 text-[#D4A747] font-heading font-semibold uppercase tracking-wider text-xs">
                      Divisions
                    </th>
                    <th className="text-right py-3 px-4 text-[#D4A747] font-heading font-semibold uppercase tracking-wider text-xs">
                      Entry Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {divisions.map((div, i) => (
                    <tr
                      key={div.age}
                      className={`border-b border-[#1e1e1e] transition-colors hover:bg-[#D4A747]/5 ${
                        i % 2 === 0 ? "bg-[#111111]" : "bg-[#0A0A0A]"
                      }`}
                      data-testid={`row-division-${div.age.toLowerCase()}`}
                    >
                      <td className="py-3 px-4 font-heading font-bold text-[#F5F5F5]">
                        {div.age}
                      </td>
                      <td className="py-3 px-4 text-[#F5F5F5]/60">
                        Boys &amp; Girls
                      </td>
                      <td className="py-3 px-4 text-right font-heading font-semibold text-[#D4A747]">
                        {div.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-[#595959] text-xs text-center mt-4"
            >
              Registration through GotSport · Cal South affiliated teams only
            </motion.p>
          </motion.div>
        </section>

        {/* ── FORMAT ───────────────────────────────────────── */}
        <section className="bg-[#111111] py-16 px-4" data-testid="section-copa-format">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-10 text-center"
            >
              Tournament Format
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div
                variants={fadeUp}
                className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-xl p-6"
              >
                <h3 className="font-heading font-bold text-[#D4A747] uppercase tracking-wider text-sm mb-4">
                  Tier-Based Competition
                </h3>
                <ul className="space-y-3 text-[#F5F5F5]/70 text-sm leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[#D4A747] font-bold shrink-0">Day 1</span>
                    All teams play point games within their tier
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D4A747] font-bold shrink-0">Day 2</span>
                    Semifinals and Finals within each tier
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#D4A747] font-bold shrink-0">Result</span>
                    Every tier produces its own champion and runner-up
                  </li>
                </ul>
                <p className="mt-4 text-[#F5F5F5]/40 text-xs">
                  Teams are grouped by league division standing -- not random pools. Tier count is set at registration based on sign-up volume.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-xl p-6"
              >
                <h3 className="font-heading font-bold text-[#D4A747] uppercase tracking-wider text-sm mb-4">
                  Field Layout
                </h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { group: "U10", detail: "7v7 fields (Fields A – D area)" },
                    { group: "U11 – U12", detail: "9v9 fields (Fields E – G area)" },
                    { group: "U13 – U19", detail: "11v11 fields (Fields H – I area)" },
                  ].map(({ group, detail }) => (
                    <li
                      key={group}
                      className="flex items-start gap-3 border-b border-[#1e1e1e] pb-2 last:border-0"
                    >
                      <span className="font-heading font-bold text-[#D4A747] text-xs w-24 shrink-0 pt-0.5 uppercase">
                        {group}
                      </span>
                      <span className="text-[#F5F5F5]/65 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── SCHEDULE ─────────────────────────────────────── */}
        <section className="py-16 px-4" data-testid="section-copa-schedule">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-10 text-center"
            >
              Schedule
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  day: "Day 1",
                  date: "Saturday, May 8",
                  rows: scheduleDay1,
                },
                {
                  day: "Day 2",
                  date: "Sunday, May 9",
                  rows: scheduleDay2,
                },
              ].map(({ day, date, rows }) => (
                <motion.div
                  key={day}
                  variants={fadeUp}
                  className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden"
                >
                  <div className="bg-[#6B1A1A] px-5 py-3">
                    <p className="font-integral font-bold text-[#F5F5F5] text-lg uppercase leading-tight">
                      {day}
                    </p>
                    <p className="text-[#F5F5F5]/60 text-xs font-heading">{date}</p>
                  </div>
                  <ul className="divide-y divide-[#1e1e1e]">
                    {rows.map(({ time, event }) => (
                      <li key={time} className="flex gap-3 px-5 py-3">
                        <span className="text-[#D4A747] text-xs font-heading font-semibold w-32 shrink-0 pt-0.5">
                          {time}
                        </span>
                        <span className="text-[#F5F5F5]/70 text-sm">{event}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── REGISTRATION ─────────────────────────────────── */}
        <section className="bg-[#111111] py-16 px-4" data-testid="section-copa-registration">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-10 text-center"
            >
              How to Register
            </motion.h2>

            <motion.ol
              variants={stagger}
              className="space-y-4 mb-10"
            >
              {[
                {
                  n: "01",
                  title: "Confirm your affiliation",
                  body: "Your team must be affiliated with Cal South, Cal North, US Soccer, USYS, or AYSO.",
                },
                {
                  n: "02",
                  title: "Submit on GotSport",
                  body: "Find Copa De Costa on GotSport (gotsport.com) and complete the application for your age group and division.",
                },
                {
                  n: "03",
                  title: "Watch for acceptance email",
                  body: "Applications are reviewed after the deadline. You'll receive a status email: Accepted, Waitlisted, or Declined.",
                },
                {
                  n: "04",
                  title: "Complete digital check-in",
                  body: "Accepted teams receive check-in instructions via email. Digital check-in via GotSport must be completed before your first match.",
                },
              ].map(({ n, title, body }) => (
                <motion.li
                  key={n}
                  variants={fadeUp}
                  className="flex gap-5 items-start bg-[#0A0A0A] border border-[#2a2a2a] rounded-xl px-5 py-4"
                >
                  <span
                    className="font-integral font-bold text-2xl shrink-0 leading-none mt-0.5"
                    style={{ color: "#D4A747" }}
                  >
                    {n}
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-[#F5F5F5] text-sm mb-0.5">
                      {title}
                    </p>
                    <p className="text-[#F5F5F5]/55 text-sm">{body}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            <motion.div variants={fadeUp} className="text-center">
              <a
                href={GOTSPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson/85 text-white font-heading font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-lg transition-colors"
                data-testid="button-copa-register-bottom"
              >
                Register on GotSport
                <span aria-hidden="true">→</span>
              </a>
              <p className="mt-3 text-[#595959] text-xs">
                Registration details coming soon
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="py-16 px-4" data-testid="section-copa-faq">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-8 text-center"
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.dl variants={stagger} className="space-y-3">
              {faq.map(({ q, a }) => (
                <motion.div
                  key={q}
                  variants={fadeUp}
                  className="bg-[#111111] border border-[#2a2a2a] rounded-xl px-5 py-4"
                >
                  <dt className="font-heading font-semibold text-[#F5F5F5] text-sm mb-2">
                    {q}
                  </dt>
                  <dd className="text-[#F5F5F5]/60 text-sm leading-relaxed">{a}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>
        </section>

        {/* ── CONTACTS ─────────────────────────────────────── */}
        <section className="bg-[#111111] py-16 px-4" data-testid="section-copa-contacts">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="font-integral font-bold text-2xl sm:text-3xl uppercase text-[#F5F5F5] mb-8"
            >
              Contact
            </motion.h2>

            <motion.div variants={fadeUp} className="space-y-3">
              <a
                href="mailto:tournament@nipomosc.org"
                className="inline-flex items-center gap-2 bg-crimson/20 hover:bg-crimson/40 border border-crimson/50 text-[#F5F5F5] font-heading font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
                data-testid="link-copa-email"
              >
                tournament@nipomosc.org
              </a>

              <div className="flex justify-center gap-4 pt-2">
                <a
                  href="https://instagram.com/nipomo.soccer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F5]/40 hover:text-[#D4A747] text-sm transition-colors font-heading"
                  data-testid="link-copa-instagram"
                >
                  @nipomo.soccer
                </a>
                <span className="text-[#2a2a2a]">·</span>
                <a
                  href="https://facebook.com/61557721034820"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F5F5F5]/40 hover:text-[#D4A747] text-sm transition-colors font-heading"
                  data-testid="link-copa-facebook"
                >
                  Facebook
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── FOOTER CTA ───────────────────────────────────── */}
        <section
          className="relative py-20 px-4 text-center overflow-hidden"
          data-testid="section-copa-footer-cta"
        >
          <div
            className="absolute inset-0 opacity-8"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 100%, #6B1A1A 0%, transparent 70%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-xl mx-auto"
          >
            <img
              src={copaLogo}
              alt=""
              aria-hidden="true"
              className="w-24 h-auto mx-auto mb-6 opacity-70"
            />
            <h2
              className="font-integral font-bold uppercase text-[#F5F5F5] mb-4"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
            >
              See You on the Coast
            </h2>
            <p className="text-[#F5F5F5]/55 text-base mb-8">
              May 8 – 9, 2027 · Nipomo, CA<br />
              Registration details coming soon
            </p>
            <a
              href={GOTSPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson/85 text-white font-heading font-bold uppercase tracking-wider text-sm px-10 py-4 rounded-lg transition-colors"
              data-testid="button-copa-register-footer"
            >
              Register Now on GotSport
              <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </section>

      </main>
    </>
  );
}
