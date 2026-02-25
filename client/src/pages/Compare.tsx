import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const COLORS = {
  primary: "#8B1D24",
  green: "#2E7D32",
  gold: "#C6A045",
  purple: "#4A2B73",
  bg: "#F3ECE2",
  cardBg: "#F8F5F1",
  foreground: "#0D0D0D",
  muted: "#555249",
  border: "#CFCCC9",
  dark: "#0D0D0D",
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
  { name: "No, keep costs the same", value: 12, count: 17, color: COLORS.primary },
];

const springDonut = [
  { name: "Very likely", value: 42, count: 59, color: COLORS.green },
  { name: "Somewhat likely", value: 29, count: 41, color: "#66BB6A" },
  { name: "Unsure", value: 8, count: 11, color: COLORS.border },
  { name: "Not likely", value: 22, count: 31, color: "#9E9E9E" },
];

const comparisonRows = [
  {
    label: "Referees",
    nsc: "Paid, trained referees with better coverage, accountability, and retention",
    ayso: "Volunteer-only with no compensation allowed, even with demanding certification requirements",
  },
  {
    label: "Team Balancing",
    nsc: "Roots is exclusively for non-club players; coach assessment data used to balance all Roots teams; teams formed by someone with no ties to players in that division",
    ayso: "No restrictions on club players in rec divisions; team balancing varies by region",
  },
  {
    label: "Player Pathway",
    nsc: "Roots (rec) > Rise (developmental) > Reign (competitive), all under one organization",
    ayso: "Recreational focus with limited competitive pathways (All-Stars, postseason)",
  },
  {
    label: "Rec Postseason",
    nsc: "Roots teams that qualify move on to a regional tournament",
    ayso: "For teams to advance, they must have 3 volunteer referees who have volunteered 20+ hours. Most teams that advance are the ones that meet referee requirements, not necessarily the ones that played the best",
  },
  {
    label: "Spring Season",
    nsc: "Yes. Launching a spring developmental season this year",
    ayso: "Not available under our previous AYSO structure",
  },
  {
    label: "Jersey Sponsorships",
    nsc: "Local business sponsorships support local teams, helping offset costs",
    ayso: "Sponsorships sold at national level with no funds benefiting local teams",
  },
  {
    label: "Local Control",
    nsc: "Independent organization with scheduling, team formation, and policies set by the local board",
    ayso: "Subject to area and national AYSO governance requirements",
  },
  {
    label: "Home Field",
    nsc: "Nipomo High School with active permits in place",
    ayso: "Nipomo High School",
  },
  {
    label: "Registration Cost",
    nsc: "~$155, same as last year",
    ayso: "~$155 last season",
  },
  {
    label: "Coaching",
    nsc: "Volunteer coaches with local training and support",
    ayso: "Volunteer coaches with AYSO training requirements",
  },
];

const boardMembers = [
  { name: "Adrian Dalton", role: "President", bg: "Former AYSO Region 716 Regional Commissioner. Current Nipomo High School men's soccer head coach." },
  { name: "Autumn Dalton", role: "Board Member", bg: "Former AYSO board member." },
  { name: "Johnny Page", role: "Head of Marketing & Recruiting", bg: "Former AYSO Coach Administrator." },
  { name: "Ashley Page", role: "Operations & Social Media", bg: "Ran social media and operations for AYSO; continues in that role for NSC." },
  { name: "Justin Marsh", role: "Operations Director", bg: "Former AYSO Assistant Regional Commissioner." },
  { name: "Ashley Marsh", role: "Referee Administrator", bg: "Served as AYSO Referee Administrator; continues in that role for NSC." },
  { name: "Andres Lopez", role: "Treasurer", bg: "" },
  { name: "Giovanni Garcia", role: "Club Director, Reign", bg: "Head JV coach, Pioneer Valley High School soccer." },
  { name: "Carla Alonso", role: "Registrar", bg: "" },
  { name: "Che Coho", role: "Board Member", bg: "" },
];

const faqItems = [
  {
    q: "Is Nipomo SC a non-profit?",
    a: "Yes. Nipomo Soccer Club is a registered non-profit organization.",
  },
  {
    q: 'Does "soccer club" mean it\'s only for competitive players?',
    a: 'Not at all. The word "club" refers to the organization, not the level of play. Nipomo SC is the umbrella for all soccer in Nipomo. Roots is recreational soccer: Saturday games, weekday practices, team assignments, ages 4 to 14. Rise is a developmental bridge for players who want more training without the full commitment of a competitive team. Reign is competitive, year-round training and tournament play. Your child can play Roots every season and have a great experience, or they can grow into Rise or Reign over time. No pressure, no wrong path.',
  },
  {
    q: "Will Roots cost more than AYSO?",
    a: "We expect registration to be around $155, the same as last year's AYSO season. That's despite Nipomo SC having to purchase all new equipment from scratch, including goals, balls, and jerseys, and now paying referees. We've worked hard to keep costs the same for families.",
  },
  {
    q: "Do I have to volunteer?",
    a: "Volunteering isn't mandatory per parent, but Nipomo SC still depends heavily on community support. Our entire board is volunteer. All coaches are volunteer. As we grow revenue through fundraisers, sponsorships, and hosting club tournaments, we expect to add paid positions over time to reduce the volunteer burden. Right now, every helping hand makes a real difference.",
  },
  {
    q: "How will teams be balanced?",
    a: "Two ways. First, players on competitive teams, whether Reign or any outside club, are not eligible to play in Roots. Recreational soccer should feel recreational. Second, we'll be collecting detailed coach assessment data on all players and using that data to balance teams fairly across every division. All teams will be formed by someone who has no ties to a player in that division, removing any conflict of interest from the process. No more lopsided matchups.",
  },
  {
    q: "Can local businesses sponsor jerseys?",
    a: "Yes, this is new. Under AYSO, jersey sponsorship funds didn't benefit local teams. Under Nipomo SC, local businesses can sponsor jerseys and support the program directly. If you're a business owner interested in sponsoring, email admin@nipomosc.org.",
  },
  {
    q: "What ages does Nipomo SC cover?",
    a: "Roots (recreational) serves ages 4 to 14. Visit nipomosc.org for details on Rise and Reign age ranges.",
  },
  {
    q: "When does the season start?",
    a: "Visit nipomosc.org for the latest on season dates and registration.",
  },
  {
    q: "How can I get involved?",
    a: "We're actively looking for board members, coaches, referees, and volunteers. Email admin@nipomosc.org to learn more.",
  },
];

function renderLinkedText(text: string) {
  const parts = text.split(/(admin@nipomosc\.org|nipomosc\.org)/g);
  return parts.map((part, i) => {
    if (part === "admin@nipomosc.org") {
      return (
        <a key={i} href="mailto:admin@nipomosc.org" className="text-[#8B1D24] font-semibold underline underline-offset-2">
          admin@nipomosc.org
        </a>
      );
    }
    if (part === "nipomosc.org") {
      return (
        <a key={i} href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-[#8B1D24] font-semibold underline underline-offset-2">
          nipomosc.org
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
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
    <div ref={ref} className="bg-[#F8F5F1] border border-[#CFCCC9] rounded-xl p-5 sm:p-8 my-8" data-testid="chart-category-ratings">
      <h4 className="font-heading font-bold text-lg text-[#0D0D0D] mb-6">End-of-Season Category Ratings</h4>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 5]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: COLORS.muted, fontSize: 13, fontFamily: "Inter" }}
            axisLine={false}
            tickLine={false}
          />
          <Bar
            dataKey="score"
            radius={[0, 6, 6, 0]}
            barSize={24}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {categoryRatings.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.name === "Referee Experience" ? COLORS.primary : COLORS.green}
              />
            ))}
            <LabelList
              dataKey="score"
              position="right"
              formatter={(v: number) => v.toFixed(2)}
              style={{ fill: COLORS.foreground, fontSize: 13, fontWeight: 600, fontFamily: "Inter" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-[#555249] mt-4 text-center">142 families surveyed | 2025 End-of-Season Survey</p>
    </div>
  );
}

function SatisfactionCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="bg-[#F8F5F1] border border-[#CFCCC9] rounded-xl p-5 sm:p-8 my-8" data-testid="chart-satisfaction">
      <h4 className="font-heading font-bold text-lg text-[#0D0D0D] mb-6">Overall Family Satisfaction</h4>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <span className="text-6xl sm:text-7xl font-bold text-[#2E7D32] font-heading">83%</span>
        <p className="text-[#555249] text-base mt-1">of families rated their experience 8 or higher out of 10</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { score: "10", pct: "53%", count: "75 families" },
          { score: "9", pct: "15%", count: "21 families" },
          { score: "8", pct: "15%", count: "22 families" },
        ].map((item) => (
          <motion.div
            key={item.score}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border border-[#CFCCC9] rounded-lg p-3 sm:p-4 text-center"
          >
            <span className="text-2xl sm:text-3xl font-bold text-[#2E7D32] font-heading">{item.pct}</span>
            <p className="text-xs text-[#555249] mt-1">gave a {item.score}</p>
            <p className="text-xs text-[#555249]">({item.count})</p>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-[#555249] mt-4 text-center">142 families surveyed | 2025 End-of-Season Survey</p>
    </div>
  );
}

function DonutChart({
  data,
  centerValue,
  centerLabel,
  title,
  testId,
}: {
  data: typeof refereeDonut;
  centerValue: string;
  centerLabel: string;
  title: string;
  testId: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="bg-[#F8F5F1] border border-[#CFCCC9] rounded-xl p-5 sm:p-8 my-8" data-testid={testId}>
      <h4 className="font-heading font-bold text-lg text-[#0D0D0D] mb-6 text-center">{title}</h4>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-bold text-[#2E7D32] font-heading">{centerValue}</span>
            <span className="text-sm text-[#555249]">{centerLabel}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-[#0D0D0D]">
                <span className="font-semibold">{item.value}%</span> {item.name} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#555249] mt-4 text-center">142 families surveyed | 2025 End-of-Season Survey</p>
    </div>
  );
}

function ParentVoice({ quote, testId }: { quote: string; testId: string }) {
  return (
    <div className="bg-[#FDFCFA] rounded-xl px-6 sm:px-8 py-6 my-8 relative" data-testid={testId}>
      <span className="text-[#2E7D32] text-5xl sm:text-6xl font-serif leading-none absolute top-4 left-5 sm:left-7 select-none" aria-hidden="true">&ldquo;</span>
      <div className="pt-8 sm:pt-6 sm:pl-8">
        <p className="text-[#0D0D0D] text-lg leading-relaxed">{quote}</p>
        <p className="text-[#555249]/70 text-sm mt-3 italic">— Nipomo soccer parent, end-of-season survey</p>
      </div>
    </div>
  );
}

export default function Compare() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F3ECE2] min-h-screen">
      <Header />

      <main className="max-w-[720px] mx-auto px-5 sm:px-6 pt-36 sm:pt-40 pb-20">
        <motion.article initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>

          <motion.h1
            variants={fadeUp}
            className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] leading-tight mb-6"
            data-testid="text-article-title"
          >
            Nipomo SC Roots vs AYSO Nipomo:<br />What's the Difference?
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            The goal of this article is to break down what Nipomo SC is, how it's different from AYSO, and why we made this change. But before we get into any of that, we want to acknowledge something important.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            AYSO has been part of Nipomo for over 20 years. Many of us on this board grew up playing in it, put our own kids through it, coached in it, and eventually joined the board to try to make it better.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            We didn't start Nipomo SC because we wanted to walk away from that. We started it because we spent years trying to fix the things that weren't working, and we hit a wall.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            We got involved on the board. We worked with and learned from previous AYSO leadership, with area leadership, and with other regions to find solutions within AYSO's structure.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Some of the problems got better. But the ones that didn't, no matter who is running things locally, are structural to how AYSO operates.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            That said, Nipomo SC isn't starting from scratch. We're building on the values and the foundation that previous volunteers and community members laid over the years. We've learned from the people who came before us, and we hope to involve the next generation of soccer leaders in this community as we grow.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-10">
            This article is our attempt to explain where we're coming from, why we made this decision, and what we have planned.
          </motion.p>

          <motion.div variants={fadeUp} className="bg-[#F8F5F1] border-l-4 border-[#2E7D32] rounded-r-lg px-6 py-5 my-10" data-testid="callout-pull-quote-1">
            <p className="text-[#0D0D0D] text-lg sm:text-xl italic leading-relaxed">
              We started it because we spent years trying to fix the things that weren't working, and we hit a wall.
            </p>
          </motion.div>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* THE SAME PEOPLE */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-same-people">
            The Same People, a Local Structure
          </motion.h2>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Nipomo SC didn't come out of nowhere. We looked into making improvements within AYSO, and when it became clear that the area and national structure wouldn't allow us to build what this community deserved, we built something well suited for Nipomo.
          </motion.p>

          <motion.div variants={fadeUp} className="bg-[#8B1D24] rounded-xl px-6 py-6 my-8 text-center" data-testid="callout-stat-board">
            <span className="text-3xl sm:text-4xl font-heading font-bold text-[#F3ECE2]">~75%</span>
            <p className="text-[#F3ECE2]/80 text-sm sm:text-base mt-2">of the board running the 2025 AYSO season is now running Nipomo SC</p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Many of us have been volunteering in the Nipomo soccer community for several years. Last season, this group invested in making the game-day experience better for players, families, and volunteers. That included several improvements that dramatically reduced the volunteer hours needed to run the season, adding benches to every sideline in the 10U, 12U, and 14U divisions, buying new goals, upgrading coaching gear, compressing the Saturday schedule so families and volunteers weren't stuck at the fields all day, and expanding cross-play with neighboring regions while maintaining a competitive local schedule.
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-4 mt-10">
            Community Feedback on the 2025 Season
          </motion.h3>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            In our end-of-season survey of 142 families, the results speak for themselves. Every category we measured scored well, with one clear exception: referees. That wasn't a surprise to us, and it's the single biggest reason we made this change. Overall, 83% of families rated their experience an 8 or higher out of 10. The community showed up, the volunteers showed up, and families noticed.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-4">
            The team that executed the 2025 season is the team that's starting Nipomo Soccer Club.
          </motion.p>

          <motion.div variants={fadeUp}>
            <SatisfactionCard />
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            That commitment hasn't gone anywhere. It's operating under a local structure better suited to our community's needs, not requirements set by a national governing body.
          </motion.p>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* WHY WE LEFT AYSO */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-why-left">
            Why We Left AYSO
          </motion.h2>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            This wasn't a decision made lightly. AYSO has served communities across the country for decades, and it served Nipomo for many years. Many of us participated within AYSO as players, coaches, board members, referees, and volunteers for years. But the challenges of operating within AYSO's structure became harder to overcome. Not because of local volunteers, but because of the national governing body.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Before we get into the specifics, it helps to understand how AYSO is structured. AYSO is a national organization. What most families in Nipomo know as "AYSO soccer" is Region 716, run entirely by local volunteers.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            But those volunteers operate under rules, certification requirements, and policies set at the area and national level. The local board doesn't get to decide how referees are certified, what's required for All-Star play, or how sponsorship revenue is handled. That distinction matters, because the challenges we ran into weren't about the people running things here. They were about the system those people were required to work within.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            There were three main challenges:
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-4">
            Referees
          </motion.h3>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            AYSO requires all referees to be unpaid volunteers while imposing demanding certification standards.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            A basic Regional certification takes a full day. Intermediate requires a full-day course (10 to 11 hours) plus 25 games of experience. Advanced requires even more.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            And that's just the referee coursework. Before an adult volunteer can even step on the field, they also need to complete annual registration, a background check, state-mandated fingerprinting under California AB 506, Safe Haven training, SafeSport certification, CDC concussion awareness training, and sudden cardiac arrest training.
          </motion.p>

          <motion.div variants={fadeUp} className="bg-[#F8F5F1] border-l-4 border-[#2E7D32] rounded-r-lg px-6 py-5 my-8" data-testid="callout-pull-quote-referees">
            <p className="text-[#0D0D0D] text-lg sm:text-xl italic leading-relaxed">
              These are all good standards, and Nipomo SC upholds them. But asking someone to meet all of those requirements and then officiate every Saturday without compensation is a lot.
            </p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            It's just not sustainable when the people doing the work aren't paid for it.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            On top of that, the AYSO referee pathway creates a direct pipeline out. Volunteers invest heavily in training through AYSO, then cross-certify with USSF so they can work paid matches in other leagues. We lost many of our best referees to organizations that actually compensate their officials.
          </motion.p>

          <motion.div variants={fadeUp}>
            <AnimatedBarChart />
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Running the Nipomo AYSO region required over 200 volunteers across coaching, board positions, and officiating. There are real benefits to a volunteer-driven model, and we're proud of what this community stepped up to do. But the demands on referees in particular led to burnout. Referee shortages were our biggest challenge last season. Games ran with a single official. AYSO's referee guidance is built around the traditional one-center, two-assistant system, and region guidelines determine minimum staffing. That means when we didn't have enough certified referees, games either ran short-staffed or risked not being played at all.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            In past seasons, the short-term fix had been to spread games out across more time slots and ask the same small pool of referees to cover more games. It only deepened the burnout over time, drove more referees out, and left us in a worse position year after year.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            The results from our survey tell the story.
          </motion.p>

          <motion.div variants={fadeUp}>
            <ParentVoice
              quote="To pay $161 for one child and to not have refs for MOST games was really disappointing. I saw other coaches we played against frustrated with this issue."
              testId="parent-voice-referee-burnout"
            />
          </motion.div>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-4">
            All-Star Postseason
          </motion.h3>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            AYSO's certification requirements for All-Star play hit our community hard. Of our 25+ referees in the region, only 5 qualified to officiate at the All-Star level. Kids who deserved a chance to play all-stars couldn't, because we didn't have enough certified officials to staff their divisions. Only our 12U boys division qualified based on the referees available. Every other division was left out. Not because of any competing teams or clubs, but because the AYSO system made it nearly impossible to meet the requirements with volunteer officials alone.
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-4">
            Inadequate National Support
          </motion.h3>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            AYSO does an excellent job creating rules, policies, and training requirements at the national level. There are manuals for everything: referee upgrades, volunteer compliance, Safe Haven, SafeSport, All-Star eligibility, and more. But when you read AYSO's own support pages, the message is clear: volunteers should go first to their Regional, Area, or Section leaders rather than expecting hands-on help from the national office.
          </motion.p>

          <motion.div variants={fadeUp} className="bg-[#F0EDEA] border-l-4 border-[#8B1D24] rounded-r-lg px-6 py-5 my-8" data-testid="callout-pull-quote-ayso-support">
            <p className="text-[#0D0D0D] text-lg sm:text-xl italic leading-relaxed">
              "Many issues can only be solved by your local AYSO" - from AYSO's own support pages
            </p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            In practice, that means the organization sets a thick stack of standards and restrictions, then expects small, volunteer-run regions to figure out how to implement them, even when those policies make it harder to do what is obviously better for local players and families. The gap we ran into in Nipomo was the lack of practical support and flexibility to adapt those rules to what our community actually needed.
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-4">
            We're Not the Only Ones
          </motion.h3>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Within a short drive of Nipomo, several towns now operate their primary programs through independent, non-AYSO leagues. Estero Bay Youth Soccer League serves Morro Bay, Los Osos, Cambria, Templeton, and Atascadero. Atascadero Youth Soccer Association runs as its own independent organization. Orcutt United Soccer League does the same for Orcutt and surrounding communities. The point is that there are several individual communities choosing the structure that works best for their families rather than being tied to AYSO's.
          </motion.p>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* MEET THE BOARD */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-board">
            Meet the Board
          </motion.h2>

          <motion.div variants={fadeUp} className="space-y-4 mb-6">
            {boardMembers.map((member) => (
              <div key={member.name} className="bg-[#F8F5F1] border border-[#CFCCC9] rounded-lg p-4" data-testid={`card-board-${member.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B1D24] flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-[#0D0D0D]">{member.name},</span>{" "}
                    <span className="text-[#8B1D24] font-medium italic">{member.role}.</span>
                    {member.bg && <span className="text-[#555249]"> {member.bg}</span>}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            We're still filling additional board positions. If you're passionate about youth soccer and want to help build something meaningful for this community, reach out at{" "}
            <a href="mailto:admin@nipomosc.org" className="text-[#8B1D24] font-semibold underline underline-offset-2" data-testid="link-board-email">admin@nipomosc.org</a>.
          </motion.p>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* WHAT'S DIFFERENT */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-different">
            What's Different Under Nipomo SC
          </motion.h2>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            Nipomo SC meets all standards set forth by California and the U.S. Soccer Federation, so your child still has the same insurance coverage, background checks, and organizational standards you'd expect. The difference is that we now have the flexibility to do what's best for this community without the AYSO policies that held us back.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8 font-semibold">
            Here's what that means in practice:
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-3">
            Referees can be paid
          </motion.h3>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-4">
            This won't solve every challenge overnight, but it fundamentally changes the equation. It gives us a real incentive to recruit new officials, helps us retain the ones we train instead of losing them to organizations that already pay, and allows us to move on from referees who aren't meeting our standards. In a fully volunteer model, you can't hold people accountable the same way. When we surveyed families, 74% said they'd support a small registration increase for paid, trained referees. We can now deliver on that.
          </motion.p>

          <motion.div variants={fadeUp}>
            <ParentVoice
              quote="The refs deserve compensation. I think a managed increase is well worth it both because then the refs get better training, and volunteers and board members aren't so pressed for time."
              testId="parent-voice-paid-refs"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <DonutChart
              data={refereeDonut}
              centerValue="74%"
              centerLabel="support"
              title="Would you support a small increase for paid, trained referees?"
              testId="chart-referee-support"
            />
          </motion.div>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-3 mt-8">
            More local control
          </motion.h3>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            As an independent organization, we have the flexibility to make decisions that fit this community, from scheduling to team formation, to tournaments and cross-play, to how we train and support volunteers.
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-3">
            Balanced teams in Roots
          </motion.h3>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-4">
            One of the most common concerns from last season, especially in 12U Boys, was the competitive gap between teams, often driven by the presence of club-level players in the recreational divisions. Under Nipomo SC, that changes in two ways.
          </motion.p>

          <motion.div variants={fadeUp}>
            <ParentVoice
              quote="It felt like several teams had club &quot;ringers&quot; who you never knew if they would show up. When they didn't on game days, we were asked to sit some of our kids to even the teams, so we lost playing time."
              testId="parent-voice-balanced-teams"
            />
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-4">
            First, players registered on a competitive team (Reign or any outside club) are not eligible to play in Roots. Recreational soccer should feel recreational.
          </motion.p>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            Second, we'll be collecting detailed coach assessment data on players and using that data to balance Roots teams fairly across every division. The goal is simple: every team should have a real chance to compete, and every player should have a great experience.
          </motion.p>

          <motion.div variants={fadeUp} className="bg-[#E8F5E9] border-l-4 border-[#2E7D32] rounded-r-lg px-6 py-5 my-8" data-testid="callout-key-point-balanced">
            <p className="text-[#0D0D0D] text-base sm:text-lg font-semibold leading-relaxed">
              All teams will be formed by someone who has no ties to a player in that division, removing any conflict of interest from the process.
            </p>
          </motion.div>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-3">
            A complete player pathway
          </motion.h3>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            We have 3 programs. Roots, Rise, and Reign give every player in Nipomo a place to play and a path to grow, all within one organization. Players won't have to leave Nipomo to play the next level of competitive soccer.
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-3">
            Jersey sponsorships
          </motion.h3>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-8">
            Under AYSO, jersey sponsorships were sold at a national level with none of those funds benefiting local teams. Under Nipomo SC, local businesses can support local teams. This opens up a new way for the community to support the program and for local businesses to get involved, while helping offset costs for families.
          </motion.p>

          <motion.h3 variants={fadeUp} className="font-heading font-bold text-xl text-[#0D0D0D] mb-3">
            More soccer, more often
          </motion.h3>
          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-4">
            In the same survey, 70% of families said they'd be interested in a spring season. Under AYSO, that wasn't something we could offer. Under Nipomo SC, it is, and we're launching a spring developmental season this year. More details at{" "}
            <a href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-[#8B1D24] font-semibold underline underline-offset-2">nipomosc.org</a>.
          </motion.p>
          <motion.div variants={fadeUp}>
            <DonutChart
              data={springDonut}
              centerValue="70%"
              centerLabel="interested"
              title="How likely would your child be to participate in a spring season?"
              testId="chart-spring-interest"
            />
          </motion.div>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* COMPARISON TABLE */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-comparison">
            Nipomo SC vs. AYSO at a Glance
          </motion.h2>

          <motion.div variants={fadeUp} className="overflow-x-auto -mx-5 sm:mx-0 mb-6">
            <div className="min-w-[600px] sm:min-w-0 px-5 sm:px-0">
              <table className="w-full border-collapse" data-testid="table-comparison">
                <thead>
                  <tr className="bg-[#8B1D24]">
                    <th className="text-left py-3 px-4 text-white font-heading font-bold text-sm uppercase tracking-wide rounded-tl-lg">Category</th>
                    <th className="text-left py-3 px-4 text-white font-heading font-bold text-sm uppercase tracking-wide">Nipomo SC</th>
                    <th className="text-left py-3 px-4 text-white font-heading font-bold text-sm uppercase tracking-wide rounded-tr-lg">AYSO</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-[#F8F5F1]" : "bg-white"}
                      data-testid={`comparison-row-${row.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <td className="py-3 px-4 font-heading font-bold text-[#0D0D0D] text-sm align-top border-b border-[#CFCCC9]">{row.label}</td>
                      <td className="py-3 px-4 text-[#0D0D0D] text-sm leading-relaxed align-top border-b border-[#CFCCC9]">{row.nsc}</td>
                      <td className="py-3 px-4 text-[#555249] text-sm leading-relaxed align-top border-b border-[#CFCCC9]">{row.ayso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* WHAT ABOUT AYSO */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-ayso-this-year">
            What About AYSO This Year?
          </motion.h2>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            We'll be straightforward: <strong className="text-[#0D0D0D]">we're not sure if there will be an AYSO season in Nipomo this year.</strong> That's not our decision to make.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            What we can tell you is this:
          </motion.p>

          <motion.div variants={fadeUp} className="bg-[#2E7D32] rounded-xl px-6 py-8 my-8 text-center" data-testid="callout-key-point-roots-season">
            <p className="text-[#F3ECE2] text-xl sm:text-2xl md:text-3xl font-heading font-bold leading-snug">
              There is 100% going to be a Nipomo SC Roots season.
            </p>
          </motion.div>

          <motion.p variants={fadeUp} className="text-[#555249] text-lg leading-relaxed mb-6">
            The people, the infrastructure, and the plan are in place to deliver a great season for your family.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[#0D0D0D] text-lg leading-relaxed mb-6 font-semibold">
            You don't need to wait and wonder. Nipomo SC is here.
          </motion.p>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* FAQ */}
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-[#0D0D0D] mb-6" data-testid="heading-faq">
            Frequently Asked Questions
          </motion.h2>

          <motion.div variants={fadeUp}>
            <Accordion type="single" collapsible className="space-y-3" data-testid="faq-accordion">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-[#F8F5F1] rounded-lg border border-[#CFCCC9] px-5"
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger
                    className="text-left text-base font-heading font-semibold text-[#0D0D0D] hover:no-underline py-4 [&>svg]:text-[#8B1D24]"
                    data-testid={`faq-trigger-${i}`}
                  >
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#555249] leading-relaxed pb-4 text-base">
                    {renderLinkedText(item.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.hr variants={fadeUp} className="border-[#CFCCC9] my-10" />

          {/* FOOTER */}
          <motion.div variants={fadeUp} className="text-center py-8">
            <p className="text-[#555249] text-lg mb-3">
              Visit{" "}
              <a href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-[#8B1D24] font-semibold underline underline-offset-2" data-testid="link-footer-website">nipomosc.org</a>
              {" "}to learn more, or email{" "}
              <a href="mailto:admin@nipomosc.org" className="text-[#8B1D24] font-semibold underline underline-offset-2" data-testid="link-footer-email">admin@nipomosc.org</a>
              {" "}with questions.
            </p>
            <p className="font-heading font-black text-2xl sm:text-3xl text-[#0D0D0D] mt-6">
              Roots. Rise. Reign.
            </p>
          </motion.div>

        </motion.article>
      </main>

      <footer className="bg-[#0D0D0D] py-8 text-center">
        <p className="text-white/60 font-heading font-semibold text-sm uppercase tracking-wider">Nipomo Soccer Club</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a href="https://nipomosc.org" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-sm transition-colors" data-testid="link-footer-site">nipomosc.org</a>
          <span className="text-white/20">|</span>
          <a href="mailto:admin@nipomosc.org" className="text-white/40 hover:text-white text-sm transition-colors" data-testid="link-footer-mail">admin@nipomosc.org</a>
        </div>
      </footer>
    </div>
  );
}
