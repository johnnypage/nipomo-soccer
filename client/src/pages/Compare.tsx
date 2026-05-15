import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList,
  PieChart, Pie,
} from "recharts";
import { Shield, Users, Trophy, DollarSign, Calendar, Scale, ChevronDown } from "lucide-react";

const COLORS = {
  darkGreen: "#1a472a",
  green: "#2E7D32",
  lightGreen: "#E8F5E9",
  gold: "#c8a951",
  maroon: "#8B1D24",
  cream: "#F3ECE2",
  cardBg: "#F8F5F1",
  fg: "#0D0D0D",
  muted: "#555249",
  border: "#CFCCC9",
  white: "#FDFCFA",
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const categoryRatings = [
  { name: "Equipment", score: 4.61 },
  { name: "Communication", score: 4.53 },
  { name: "Coach Experience", score: 4.44 },
  { name: "Food Options", score: 4.39 },
  { name: "Jerseys & Uniforms", score: 4.37 },
  { name: "Field Space & Quality", score: 4.21 },
  { name: "Photo Day", score: 3.99 },
  { name: "Referee Experience", score: 3.86 },
];

const refereeDonut = [
  { name: "Yes, support paid referees", value: 74, count: 105, color: COLORS.green },
  { name: "Not sure / need details", value: 14, count: 20, color: COLORS.border },
  { name: "No, keep costs the same", value: 12, count: 17, color: COLORS.maroon },
];

const springDonut = [
  { name: "Very likely", value: 42, count: 59, color: COLORS.green },
  { name: "Somewhat likely", value: 29, count: 41, color: "#66BB6A" },
  { name: "Unsure", value: 8, count: 11, color: COLORS.border },
  { name: "Not likely", value: 22, count: 31, color: "#9E9E9E" },
];

const comparisonRows = [
  { label: "Referees", nsc: "Paid, trained referees with better coverage, accountability, and retention", ayso: "Volunteer-only with no compensation allowed, even with demanding certification requirements" },
  { label: "Team Balancing", nsc: "Roots is exclusively for non-club players; coach assessment data used to balance all Roots teams; teams formed by someone with no ties to players in that division", ayso: "No restrictions on club players in rec divisions; team balancing varies by region" },
  { label: "Player Pathway", nsc: "Roots (rec) > Rise (developmental) > Reign (competitive), all under one organization", ayso: "Recreational focus with limited competitive pathways (All-Stars, postseason)" },
  { label: "Rec Postseason", nsc: "Roots teams that qualify move on to a regional tournament", ayso: "For teams to advance, they must have 3 volunteer referees who have volunteered 20+ hours. Most teams that advance are the ones that meet referee requirements, not necessarily the ones that played the best" },
  { label: "Spring Season", nsc: "Yes. Launching a spring developmental season this year", ayso: "Not available under our previous AYSO structure" },
  { label: "Jersey Sponsorships", nsc: "Local business sponsorships support local teams, helping offset costs", ayso: "Sponsorships sold at national level with no funds benefiting local teams" },
  { label: "Local Control", nsc: "Independent organization with scheduling, team formation, and policies set by the local board", ayso: "Subject to area and national AYSO governance requirements" },
  { label: "Home Field", nsc: "Nipomo High School with active permits in place", ayso: "Nipomo High School" },
  { label: "Registration Cost", nsc: "~$155, same as last year", ayso: "~$155 last season" },
  { label: "Coaching", nsc: "Volunteer coaches with local training and support", ayso: "Volunteer coaches with AYSO training requirements" },
];

const boardMembers = [
  { name: "Adrian Dalton", role: "President", bg: "Former AYSO Region 716 Regional Commissioner. Current Nipomo High School men's soccer head coach.", photo: "/adrian-dalton.jpg" },
  { name: "Autumn Dalton", role: "Board Member", bg: "Former AYSO board member." },
  { name: "Johnny Page", role: "Head of Marketing & Recruiting", bg: "Former AYSO Coach Administrator." },
  { name: "Ashley Page", role: "Operations & Social Media", bg: "Ran social media and operations for AYSO; continues in that role for NSC." },
  { name: "Justin Marsh", role: "Operations Director", bg: "Former AYSO Assistant Regional Commissioner." },
  { name: "Ashley Marsh", role: "Referee Administrator", bg: "Served as AYSO Referee Administrator; continues in that role for NSC." },
  { name: "Andres Lopez", role: "Treasurer", bg: "" },
  { name: "Carla Alonso", role: "Registrar", bg: "" },
  { name: "Kacie Lopez", role: "Secretary", bg: "Serving since 2026." },
  { name: "Che Coho", role: "Board Member", bg: "" },
];

const faqItems = [
  { q: "Is Nipomo Soccer a non-profit?", a: "Yes. Nipomo Soccer is a registered non-profit organization." },
  { q: 'Does "soccer club" mean it\'s only for competitive players?', a: 'Not at all. The word "club" refers to the organization, not the level of play. Nipomo Soccer is the umbrella for all soccer in Nipomo. Roots is recreational soccer: Saturday games, weekday practices, team assignments, ages 4 to 14. Rise is a developmental bridge for players who want more training without the full commitment of a competitive team. Reign is competitive, year-round training and tournament play. Your child can play Roots every season and have a great experience, or they can grow into Rise or Reign over time. No pressure, no wrong path.' },
  { q: "Will Roots cost more than AYSO?", a: "We expect registration to be around $155, the same as last year's AYSO season. That's despite Nipomo Soccer having to purchase all new equipment from scratch, including goals, balls, and jerseys, and now paying referees. We've worked hard to keep costs the same for families." },
  { q: "Do I have to volunteer?", a: "Volunteering isn't mandatory per parent, but Nipomo Soccer still depends heavily on community support. Our entire board is volunteer. All coaches are volunteer. As we grow revenue through fundraisers, sponsorships, and hosting club tournaments, we expect to add paid positions over time to reduce the volunteer burden. Right now, every helping hand makes a real difference." },
  { q: "How will teams be balanced?", a: "Two ways. First, players on competitive teams, whether Reign or any outside club, are not eligible to play in Roots. Recreational soccer should feel recreational. Second, we'll be collecting detailed coach assessment data on all players and using that data to balance teams fairly across every division. All teams will be formed by someone who has no ties to a player in that division, removing any conflict of interest from the process. No more lopsided matchups." },
  { q: "Can local businesses sponsor jerseys?", a: "Yes, this is new. Under AYSO, jersey sponsorship funds didn't benefit local teams. Under Nipomo SC, local businesses can sponsor jerseys and support the program directly. If you're a business owner interested in sponsoring, email admin@nipomosc.org." },
  { q: "What ages does Nipomo SC cover?", a: "Roots (recreational) serves ages 4 to 14. Visit nipomosc.org for details on Rise and Reign age ranges." },
  { q: "When does the season start?", a: "Visit nipomosc.org for the latest on season dates and registration." },
  { q: "How can I get involved?", a: "We're actively looking for board members, coaches, referees, and volunteers. Email admin@nipomosc.org to learn more." },
];

const changeFeatures = [
  { icon: Shield, title: "Paid Referees", desc: "Referees can be compensated, improving recruitment, retention, and accountability. 74% of families surveyed support this." },
  { icon: Scale, title: "Balanced Teams", desc: "Club players can't play Roots. Coach assessment data balances every division. Teams formed by someone with no ties to players." },
  { icon: Users, title: "Local Control", desc: "Scheduling, team formation, policies, and tournaments are decided by the local board, not a national governing body." },
  { icon: Trophy, title: "Player Pathway", desc: "Roots, Rise, and Reign give every player a place to play and a path to grow, all within one organization." },
  { icon: DollarSign, title: "Jersey Sponsorships", desc: "Local businesses can sponsor local teams directly, helping offset costs for families." },
  { icon: Calendar, title: "Spring Season", desc: "70% of families wanted a spring season. Under AYSO, we couldn't offer one. Under Nipomo SC, we're launching it this year." },
];

function renderLinkedText(text: string) {
  const parts = text.split(/(admin@nipomosc\.org|nipomosc\.org)/g);
  return parts.map((part, i) => {
    if (part === "admin@nipomosc.org") {
      return <a key={i} href="mailto:admin@nipomosc.org" className="text-[#c8a951] font-semibold underline underline-offset-2" data-testid={`link-faq-email-${i}`}>admin@nipomosc.org</a>;
    }
    if (part === "nipomosc.org") {
      return <a key={i} href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-[#c8a951] font-semibold underline underline-offset-2" data-testid={`link-faq-site-${i}`}>nipomosc.org</a>;
    }
    return <span key={i}>{part}</span>;
  });
}

function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{value}{suffix}</span>;
}

function ParallaxSection({ imageUrl, children, overlay = "rgba(26,71,42,0.8)" }: { imageUrl: string; children: React.ReactNode; overlay?: string }) {
  return (
    <section
      className="relative bg-scroll md:bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: overlay }} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function AnimatedBarChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimate(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const data = animate ? categoryRatings : categoryRatings.map(d => ({ ...d, score: 0 }));

  return (
    <div ref={ref} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-8" data-testid="chart-category-ratings">
      <h4 className="font-heading font-bold text-lg text-white mb-6">End-of-Season Category Ratings</h4>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 5]} hide />
          <YAxis type="category" dataKey="name" width={140} tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1200} animationEasing="ease-out">
            {categoryRatings.map((entry, idx) => (
              <Cell key={idx} fill={entry.name === "Referee Experience" ? COLORS.maroon : COLORS.gold} />
            ))}
            <LabelList dataKey="score" position="right" formatter={(v: number) => v.toFixed(2)} style={{ fill: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "Inter" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-white/60 mt-4 text-center">142 families surveyed | 2025 End-of-Season Survey</p>
    </div>
  );
}

function DonutChart({ data, centerValue, centerLabel, title, testId }: { data: typeof refereeDonut; centerValue: string; centerLabel: string; title: string; testId: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-8" data-testid={testId}>
      <h4 className="font-heading font-bold text-lg text-white mb-6 text-center">{title}</h4>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" dataKey="value" startAngle={90} endAngle={-270} animationDuration={1000} animationEasing="ease-out">
                  {data.map((entry, idx) => <Cell key={idx} fill={entry.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-bold text-[#c8a951] font-heading">{centerValue}</span>
            <span className="text-sm text-white/70">{centerLabel}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-white/90"><span className="font-semibold">{item.value}%</span> {item.name} ({item.count})</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-white/50 mt-4 text-center">142 families surveyed | 2025 End-of-Season Survey</p>
    </div>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-scroll md:bg-fixed bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80)" }} data-testid="section-hero">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a472a]/90 via-[#1a472a]/85 to-[#0D0D0D]/95" />
      <motion.div style={{ opacity, y }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-[#c8a951] font-heading font-bold text-sm sm:text-base uppercase tracking-[0.2em] mb-6">
          Nipomo Soccer
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-white leading-[1.1] mb-8" data-testid="text-hero-title">
          Nipomo SC vs. AYSO
          <br />
          <span className="text-[#c8a951]">What's the Difference?</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          The same people who ran AYSO Nipomo built something better. Here's why we made the switch, what's different, and what it means for your family.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.6 }} className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-sm" data-testid="text-scroll-indicator">Scroll to explore</span>
          <ChevronDown className="h-5 w-5 animate-bounce" data-testid="icon-scroll-indicator" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ShortOnTimeSection() {
  return (
    <section className="bg-[#F3ECE2] py-20 sm:py-28" data-testid="section-short-on-time">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="bg-white border border-[#D4D0CB] rounded-2xl px-6 sm:px-10 py-8 sm:py-10 shadow-sm">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6">Short on time? Here's what you need to know.</h2>
            <div className="space-y-4 text-[#555249] text-base sm:text-lg leading-relaxed">
              <p>Nipomo Soccer is a new, independent soccer organization built by a majority of the people who ran AYSO Nipomo for the 2025 season. Despite the name, it's not just a club program.</p>
              <p>We offer three programs under one roof, from recreational soccer in the fall through a spring development league to competitive club soccer. If your child played AYSO rec, Roots is the program for them.</p>
              <p>We left AYSO because of structural issues that couldn't be fixed from inside the system, mainly around referees, postseason access, and limited local control. The experience your family had last season? That's what we're building on, with more flexibility to do it better.</p>
            </div>
            <p className="text-[#0D0D0D] text-lg sm:text-xl font-bold leading-relaxed mt-6 mb-5">Same Community. Same fields. Same price. Better structure.</p>
            <p className="text-[#555249] text-base sm:text-lg leading-relaxed">
              If you want the full backstory, keep reading. We've included an{" "}
              <a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }); }} className="text-[#8B1D24] font-semibold underline underline-offset-2" data-testid="link-faq-anchor">FAQ at the bottom</a>{" "}
              for the questions we hear most.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  const programs = [
    { name: "Roots", tagline: "Community Recreational Soccer", desc: "Saturday games, weekday practices, ages 4-14. The heart of Nipomo soccer.", color: COLORS.green, href: "/#programs" },
    { name: "Rise", tagline: "Spring Development League", desc: "A developmental bridge for players who want more training without the full commitment of competitive.", color: COLORS.gold, href: "/rise" },
    { name: "Reign", tagline: "Competitive Club Soccer", desc: "Year-round training and tournament play. The next level of competition, right here in Nipomo.", color: COLORS.maroon, href: "/reign" },
  ];

  return (
    <section className="bg-[#0D0D0D] py-20 sm:py-28" data-testid="section-programs">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">Three Programs, One Club</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white text-center mb-6" data-testid="heading-programs">
            Roots. Rise. Reign.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/60 text-lg text-center max-w-2xl mx-auto mb-16">
            Every player in Nipomo has a place to play and a path to grow, all within one organization.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <motion.a
                key={program.name}
                href={program.href}
                variants={fadeUp}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                data-testid={`card-program-${program.name.toLowerCase()}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: program.color + "20" }}>
                  <span className="font-heading font-black text-xl" style={{ color: program.color }}>{program.name.charAt(0)}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-1">{program.name}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: program.color }}>{program.tagline}</p>
                <p className="text-white/60 text-sm leading-relaxed">{program.desc}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SamePeopleSection() {
  return (
    <ParallaxSection imageUrl="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80" overlay="rgba(26,71,42,0.88)">
      <div className="py-20 sm:py-28" data-testid="section-same-people">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">Our Story</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white text-center mb-16" data-testid="heading-same-people">
              The Same People, a Local Structure
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <motion.div variants={fadeUp} className="md:sticky md:top-32 space-y-6">
                <div className="bg-[#c8a951] rounded-2xl p-8 sm:p-10 text-center">
                  <span className="text-5xl sm:text-6xl md:text-7xl font-heading font-black text-[#1a472a]">
                    <CountUp target={75} suffix="%" prefix="~" />
                  </span>
                  <p className="text-[#1a472a]/80 text-base sm:text-lg mt-3 font-medium">of the board running the 2025 AYSO season is now running Nipomo SC</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8">
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-heading font-black text-white">
                      <CountUp target={83} suffix="%" />
                    </span>
                    <p className="text-white/70 text-sm sm:text-base mt-2">of families rated their experience 8+ out of 10</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { score: "10", pct: "53%", count: "75" },
                      { score: "9", pct: "15%", count: "21" },
                      { score: "8", pct: "15%", count: "22" },
                    ].map((item) => (
                      <div key={item.score} className="bg-white/10 rounded-lg p-3 text-center">
                        <span className="text-xl font-bold text-[#c8a951] font-heading">{item.pct}</span>
                        <p className="text-xs text-white/60 mt-1">gave a {item.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="space-y-6 text-white/80 text-base sm:text-lg leading-relaxed">
                <p>Nipomo SC didn't come out of nowhere. We looked into making improvements within AYSO, and when it became clear that the area and national structure wouldn't allow us to build what this community deserved, we built something well suited for Nipomo.</p>
                <p>Many of us have been volunteering in the Nipomo soccer community for several years. Last season, this group invested in making the game-day experience better for players, families, and volunteers.</p>
                <p>That included several improvements: dramatically reducing the volunteer hours needed to run the season, adding benches to every sideline in the 10U, 12U, and 14U divisions, buying new goals, upgrading coaching gear, compressing the Saturday schedule so families and volunteers weren't stuck at the fields all day, and expanding cross-play with neighboring regions while maintaining a competitive local schedule.</p>
                <div className="bg-white/10 border-l-4 border-[#c8a951] rounded-r-lg px-6 py-5">
                  <p className="text-white italic text-lg leading-relaxed">We started it because we spent years trying to fix the things that weren't working, and we hit a wall.</p>
                </div>
                <p>The team that executed the 2025 season is the team that's starting Nipomo Soccer. That commitment hasn't gone anywhere. It's operating under a local structure better suited to our community's needs.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
}

function DataSection() {
  return (
    <section className="bg-[#1a472a] py-20 sm:py-28" data-testid="section-data">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">The Data</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white text-center mb-6" data-testid="heading-data">
            What Families Told Us
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/60 text-lg text-center max-w-2xl mx-auto mb-16">
            In our end-of-season survey of 142 families, the results speak for themselves. Every category scored well, with one clear exception: referees.
          </motion.p>

          <motion.div variants={fadeUp} className="mb-10">
            <AnimatedBarChart />
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-6 mb-10">
            <DonutChart data={refereeDonut} centerValue="74%" centerLabel="support" title="Support for paid referees?" testId="chart-referee-support" />
            <DonutChart data={springDonut} centerValue="70%" centerLabel="interested" title="Interest in a spring season?" testId="chart-spring-interest" />
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 sm:px-8 py-6 relative">
            <span className="text-[#c8a951] text-5xl font-serif leading-none absolute top-4 left-5 sm:left-7 select-none" aria-hidden="true">&ldquo;</span>
            <div className="pt-8 sm:pt-6 sm:pl-8">
              <p className="text-white text-lg leading-relaxed">To pay $161 for one child and to not have refs for MOST games was really disappointing. I saw other coaches we played against frustrated with this issue.</p>
              <p className="text-white/50 text-sm mt-3 italic">— Nipomo soccer parent, end-of-season survey</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BoardSection() {
  return (
    <section className="bg-[#F3ECE2] py-20 sm:py-28" data-testid="section-board">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">Leadership</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] text-center mb-16" data-testid="heading-board">
            Meet the Board
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {boardMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-white border border-[#D4D0CB] rounded-xl p-5 flex items-start gap-4"
                data-testid={`card-board-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-11 h-11 rounded-full bg-[#1a472a] flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0 overflow-hidden">
                  {member.photo
                    ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                    : member.name.charAt(0)}
                </div>
                <div>
                  <span className="font-heading font-bold text-[#0D0D0D]">{member.name}</span>
                  <span className="text-[#8B1D24] font-medium italic ml-1">{member.role}</span>
                  {member.bg && <p className="text-[#555249] text-sm mt-1 leading-relaxed">{member.bg}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg text-center mt-10 leading-relaxed">
            We're still filling additional board positions. If you're passionate about youth soccer, reach out at{" "}
            <a href="mailto:admin@nipomosc.org" className="text-[#8B1D24] font-semibold underline underline-offset-2" data-testid="link-board-email">admin@nipomosc.org</a>.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function WhyWeLeftSection() {
  return (
    <ParallaxSection imageUrl="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80" overlay="rgba(13,13,13,0.92)">
      <div className="py-20 sm:py-28" data-testid="section-why-left">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">The Decision</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white text-center mb-16" data-testid="heading-why-left">
              Why We Left AYSO
            </motion.h2>

            <div className="space-y-6 text-white/80 text-base sm:text-lg leading-relaxed">
              <motion.p variants={fadeUp}>This wasn't a decision made lightly. AYSO has served communities across the country for decades, and it served Nipomo for many years. Many of us participated within AYSO as players, coaches, board members, referees, and volunteers for years.</motion.p>
              <motion.p variants={fadeUp}>But the challenges of operating within AYSO's structure became harder to overcome. Not because of local volunteers, but because of the national governing body.</motion.p>
              <motion.p variants={fadeUp}>Before we get into the specifics, it helps to understand how AYSO is structured. AYSO is a national organization. What most families in Nipomo know as "AYSO soccer" is Region 716, run entirely by local volunteers. But those volunteers operate under rules, certification requirements, and policies set at the area and national level.</motion.p>

              <motion.div variants={fadeUp} className="bg-white/10 border-l-4 border-[#c8a951] rounded-r-lg px-6 py-5 my-4">
                <p className="text-white italic text-lg leading-relaxed">The local board doesn't get to decide how referees are certified, what's required for All-Star play, or how sponsorship revenue is handled.</p>
              </motion.div>

              <motion.p variants={fadeUp} className="font-semibold text-white text-xl">There were three main challenges:</motion.p>

              <motion.div variants={fadeUp}>
                <h3 className="font-heading font-bold text-xl text-[#c8a951] mb-3 mt-8">1. Referees</h3>
                <p className="mb-4">AYSO requires all referees to be unpaid volunteers while imposing demanding certification standards. A basic Regional certification takes a full day. Intermediate requires a 10-11 hour course plus 25 games of experience.</p>
                <p className="mb-4">And that's just the referee coursework. Before an adult volunteer can even step on the field, they also need to complete annual registration, a background check, state-mandated fingerprinting under California AB 506, Safe Haven training, SafeSport certification, CDC concussion awareness training, and sudden cardiac arrest training.</p>
                <p className="mb-4">These are all good standards, and Nipomo Soccer upholds them. But asking someone to meet all of those requirements and then officiate every Saturday without compensation is a lot.</p>
                <p className="mb-4">On top of that, the AYSO referee pathway creates a direct pipeline out. Volunteers invest heavily in training through AYSO, then cross-certify with USSF so they can work paid matches in other leagues. We lost many of our best referees to organizations that actually compensate their officials.</p>
                <p>Running the Nipomo AYSO region required over 200 volunteers. There are real benefits to a volunteer-driven model. But the demands on referees in particular led to burnout. Referee shortages were our biggest challenge last season.</p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="font-heading font-bold text-xl text-[#c8a951] mb-3 mt-8">2. All-Star Postseason</h3>
                <p>AYSO's certification requirements for All-Star play hit our community hard. Of our 25+ referees in the region, only 5 qualified to officiate at the All-Star level. Kids who deserved a chance to play all-stars couldn't, because we didn't have enough certified officials to staff their divisions. Only our 12U boys division qualified based on the referees available. Every other division was left out.</p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="font-heading font-bold text-xl text-[#c8a951] mb-3 mt-8">3. Inadequate National Support</h3>
                <p className="mb-4">AYSO does an excellent job creating rules, policies, and training requirements at the national level. But when you read AYSO's own support pages, the message is clear: volunteers should go first to their Regional, Area, or Section leaders rather than expecting hands-on help from the national office.</p>
                <div className="bg-white/10 border-l-4 border-[#8B1D24] rounded-r-lg px-6 py-5 my-4">
                  <p className="text-white italic text-lg leading-relaxed">"Many issues can only be solved by your local AYSO" — from AYSO's own support pages</p>
                </div>
                <p>In practice, that means the organization sets a thick stack of standards and restrictions, then expects small, volunteer-run regions to figure out how to implement them.</p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <h3 className="font-heading font-bold text-xl text-white mb-3 mt-8">We're Not the Only Ones</h3>
                <p>Within a short drive of Nipomo, several towns now operate their primary programs through independent, non-AYSO leagues. Estero Bay Youth Soccer League serves Morro Bay, Los Osos, Cambria, Templeton, and Atascadero. Atascadero Youth Soccer Association runs as its own independent organization. Orcutt United Soccer League does the same for Orcutt and surrounding communities.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
}

function WhatChangesSection() {
  return (
    <section className="bg-[#F3ECE2] py-20 sm:py-28" data-testid="section-what-changes">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">The Difference</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] text-center mb-6" data-testid="heading-different">
            What Changes Under Nipomo Soccer
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg text-center max-w-2xl mx-auto mb-16">
            Nipomo Soccer meets all standards set forth by California and the U.S. Soccer Federation. The difference is that we now have the flexibility to do what's best for this community.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {changeFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white border border-[#D4D0CB] rounded-2xl p-6 sm:p-8"
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a472a]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#1a472a]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0D0D0D] mb-2">{feature.title}</h3>
                <p className="text-[#555249] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="bg-white/80 border border-[#D4D0CB] rounded-2xl px-6 sm:px-8 py-6 relative mb-10">
            <span className="text-[#2E7D32] text-5xl font-serif leading-none absolute top-4 left-5 sm:left-7 select-none" aria-hidden="true">&ldquo;</span>
            <div className="pt-8 sm:pt-6 sm:pl-8">
              <p className="text-[#0D0D0D] text-lg leading-relaxed">The refs deserve compensation. I think a managed increase is well worth it both because then the refs get better training, and volunteers and board members aren't so pressed for time.</p>
              <p className="text-[#555249]/70 text-sm mt-3 italic">— Nipomo soccer parent, end-of-season survey</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white/80 border border-[#D4D0CB] rounded-2xl px-6 sm:px-8 py-6 relative">
            <span className="text-[#2E7D32] text-5xl font-serif leading-none absolute top-4 left-5 sm:left-7 select-none" aria-hidden="true">&ldquo;</span>
            <div className="pt-8 sm:pt-6 sm:pl-8">
              <p className="text-[#0D0D0D] text-lg leading-relaxed">It felt like several teams had club "ringers" who you never knew if they would show up. If they weren't there on game days, their team was left short and we were asked to sit some of our kids to even out the teams, so our kids lost playing time.</p>
              <p className="text-[#555249]/70 text-sm mt-3 italic">— Nipomo soccer parent, end-of-season survey</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonTableSection() {
  return (
    <section className="bg-[#0D0D0D] py-20 sm:py-28" data-testid="section-comparison">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">Side by Side</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white text-center mb-16" data-testid="heading-comparison">
            Nipomo SC vs. AYSO at a Glance
          </motion.h2>

          <motion.div variants={fadeUp} className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full border-collapse min-w-[540px]" data-testid="table-comparison">
              <thead>
                <tr className="bg-[#1a472a]">
                  <th className="text-left py-4 px-5 text-white font-heading font-bold text-sm uppercase tracking-wide">Category</th>
                  <th className="text-left py-4 px-5 text-[#c8a951] font-heading font-bold text-sm uppercase tracking-wide">Nipomo SC</th>
                  <th className="text-left py-4 px-5 text-white/60 font-heading font-bold text-sm uppercase tracking-wide">AYSO</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"} data-testid={`comparison-row-${row.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <td className="py-4 px-5 font-heading font-bold text-white text-sm align-top border-b border-white/10">{row.label}</td>
                    <td className="py-4 px-5 text-white/90 text-sm leading-relaxed align-top border-b border-white/10">{row.nsc}</td>
                    <td className="py-4 px-5 text-white/50 text-sm leading-relaxed align-top border-b border-white/10">{row.ayso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AYSOThisYearSection() {
  return (
    <section className="bg-[#1a472a] py-20 sm:py-28" data-testid="section-ayso-this-year">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">Looking Ahead</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white text-center mb-12" data-testid="heading-ayso-this-year">
            What About AYSO This Year?
          </motion.h2>

          <motion.p variants={fadeUp} className="text-white/80 text-lg leading-relaxed text-center mb-6">
            We'll be straightforward: <strong className="text-white">we're not sure if there will be an AYSO season in Nipomo this year.</strong> That's not our decision to make.
          </motion.p>

          <motion.p variants={fadeUp} className="text-white/80 text-lg leading-relaxed text-center mb-10">
            What we can tell you is this:
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="bg-[#c8a951] rounded-2xl px-8 sm:px-12 py-10 sm:py-12 text-center mb-10"
            data-testid="callout-key-point-roots-season"
          >
            <p className="text-[#1a472a] text-2xl sm:text-3xl md:text-4xl font-heading font-black leading-snug">
              There is 100% going to be a Nipomo Soccer Roots season.
            </p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-white/80 text-lg leading-relaxed text-center mb-4">
            The people, the infrastructure, and the plan are in place to deliver a great season for your family.
          </motion.p>

          <motion.p variants={fadeUp} className="text-white text-xl leading-relaxed text-center font-bold">
            You don't need to wait and wonder. Nipomo Soccer is here.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-[#F3ECE2] py-20 sm:py-28" id="faq" data-testid="section-faq">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[#c8a951] font-heading font-bold text-sm uppercase tracking-[0.2em] text-center mb-4">Questions</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] text-center mb-16" data-testid="heading-faq">
            Frequently Asked Questions
          </motion.h2>

          <motion.div variants={fadeUp}>
            <Accordion type="single" collapsible className="space-y-3" data-testid="faq-accordion">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-[#D4D0CB] px-6 shadow-sm"
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger
                    className="text-left text-base sm:text-lg font-heading font-semibold text-[#0D0D0D] hover:no-underline py-5 [&>svg]:text-[#1a472a]"
                    data-testid={`faq-trigger-${i}`}
                  >
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#555249] leading-relaxed pb-5 text-base">
                    {renderLinkedText(item.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="bg-[#0D0D0D] py-20 sm:py-28" data-testid="section-footer-cta">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-white/50 text-lg mb-6">
            Visit{" "}
            <a href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-[#c8a951] font-semibold underline underline-offset-2 hover:text-[#d4b55a] transition-colors" data-testid="link-footer-website">nipomosc.org</a>
            {" "}to learn more, or email{" "}
            <a href="mailto:admin@nipomosc.org" className="text-[#c8a951] font-semibold underline underline-offset-2 hover:text-[#d4b55a] transition-colors" data-testid="link-footer-email">admin@nipomosc.org</a>
            {" "}with questions.
          </motion.p>
          <motion.p variants={fadeUp} className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white">
            Roots. Rise. Reign.
          </motion.p>
        </motion.div>
      </div>
      <div className="border-t border-white/10 mt-16 pt-8">
        <div className="flex items-center justify-center gap-4">
          <a href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-sm transition-colors" data-testid="link-footer-site">nipomosc.org</a>
          <span className="text-white/20">|</span>
          <a href="mailto:admin@nipomosc.org" className="text-white/40 hover:text-white text-sm transition-colors" data-testid="link-footer-mail">admin@nipomosc.org</a>
        </div>
        <p className="text-white/30 text-xs text-center mt-4">Nipomo Soccer</p>
      </div>
    </section>
  );
}

export default function Compare() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const ogTitle = "Nipomo SC vs. AYSO -- What's the Difference? | Nipomo Soccer";
    const ogDescription = "The same people who ran AYSO Nipomo built something better. Learn why we made the switch, what's different, and what it means for your family.";
    const ogImage = window.location.origin + "/nsc-logo-og.png";
    const ogUrl = window.location.href;

    document.title = ogTitle;

    const metaTags: Record<string, string> = {
      "description": ogDescription,
      "og:title": ogTitle,
      "og:description": ogDescription,
      "og:image": ogImage,
      "og:url": ogUrl,
      "og:type": "article",
      "twitter:card": "summary_large_image",
      "twitter:title": ogTitle,
      "twitter:description": ogDescription,
      "twitter:image": ogImage,
    };

    const createdTags: HTMLMetaElement[] = [];
    Object.entries(metaTags).forEach(([key, value]) => {
      const isOg = key.startsWith("og:") || key.startsWith("twitter:");
      const attr = isOg ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
        createdTags.push(tag);
      }
      tag.setAttribute("content", value);
    });

    return () => {
      document.title = "Nipomo Soccer | Roots. Rise. Reign.";
      createdTags.forEach((tag) => tag.remove());
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ShortOnTimeSection />
      <ProgramsSection />
      <SamePeopleSection />
      <DataSection />
      <BoardSection />
      <WhyWeLeftSection />
      <WhatChangesSection />
      <ComparisonTableSection />
      <AYSOThisYearSection />
      <FAQSection />
      <FooterCTA />
    </div>
  );
}