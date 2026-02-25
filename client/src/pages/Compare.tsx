import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import { ChevronDown, Shield, DollarSign, Users, Shirt, Calendar, TreePine, TrendingUp, Award } from "lucide-react";

function useCountUp(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration, decimals]);

  return { count, ref };
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const programs = [
  {
    name: "Roots",
    type: "Recreational Soccer",
    description:
      "Saturday games, weekday practices, team assignments, ages 4 to 14. If your family is looking for rec soccer, Roots is your home.",
    icon: TreePine,
    color: "#2E7D32",
  },
  {
    name: "Rise",
    type: "Developmental",
    description:
      "A bridge for players who want more training without the full commitment of a competitive team.",
    icon: TrendingUp,
    color: "#c8a951",
  },
  {
    name: "Reign",
    type: "Competitive",
    description:
      "Year-round training and tournament play for players ready for that level.",
    icon: Award,
    color: "#8B1D24",
  },
];

const boardMembers = [
  { name: "Adrian Dalton", role: "President", bg: "Former AYSO Region 716 Regional Commissioner. Current Nipomo HS men's soccer head coach." },
  { name: "Autumn Dalton", role: "Board Member", bg: "Former AYSO board member." },
  { name: "Johnny Page", role: "Head of Marketing & Recruiting", bg: "Former AYSO Coach Administrator." },
  { name: "Ashley Page", role: "Operations & Social Media", bg: "Ran social media and operations for AYSO; continues for NSC." },
  { name: "Justin Marsh", role: "Operations Director", bg: "Former AYSO Assistant Regional Commissioner." },
  { name: "Ashley Marsh", role: "Referee Administrator", bg: "AYSO Referee Admin; continues for NSC." },
  { name: "Andres Lopez", role: "Treasurer", bg: "" },
  { name: "Giovanni Garcia", role: "Club Director, Reign", bg: "Head JV coach, Pioneer Valley HS soccer." },
  { name: "Carla", role: "Registrar", bg: "" },
  { name: "Che Coho", role: "Board Member", bg: "" },
];

const seasonRatings = [
  { category: "Equipment", rating: 4.6 },
  { category: "Communication", rating: 4.55 },
  { category: "Coaching", rating: 4.46 },
  { category: "Food Options", rating: 4.43 },
  { category: "Jerseys", rating: 4.37 },
  { category: "Field Quality", rating: 4.24 },
  { category: "Photo Day", rating: 4.0 },
  { category: "Referees", rating: 3.89 },
];

const npsData = [
  { score: "1", count: 1, type: "detractor" },
  { score: "2", count: 0, type: "detractor" },
  { score: "3", count: 2, type: "detractor" },
  { score: "4", count: 3, type: "detractor" },
  { score: "5", count: 6, type: "detractor" },
  { score: "6", count: 3, type: "detractor" },
  { score: "7", count: 5, type: "passive" },
  { score: "8", count: 19, type: "passive" },
  { score: "9", count: 20, type: "promoter" },
  { score: "10", count: 67, type: "promoter" },
];

const features = [
  {
    icon: DollarSign,
    title: "Referees Can Be Paid",
    desc: "75% of families supported this. It transforms recruitment, retention, and accountability.",
  },
  {
    icon: Shield,
    title: "More Local Control",
    desc: "Flexibility to make decisions that fit this community: scheduling, team formation, volunteer support.",
  },
  {
    icon: TrendingUp,
    title: "Complete Player Pathway",
    desc: "Roots, Rise, Reign. Every player has a place and a path to grow.",
  },
  {
    icon: Shirt,
    title: "Jersey Sponsorships",
    desc: "Local businesses can now sponsor jerseys. Not allowed under AYSO. A new way to support the program and offset costs.",
  },
  {
    icon: Calendar,
    title: "More Soccer, More Often",
    desc: "68% wanted a spring season. We're launching one this year.",
  },
];

const faqItems = [
  {
    q: "Is Nipomo SC a non-profit?",
    a: "Yes. Nipomo Soccer Club is a registered non-profit organization.",
  },
  {
    q: "Will it cost more than AYSO?",
    a: "We expect registration to be around $155, the same as last year's AYSO season. That's despite having to purchase all new equipment from scratch, including goals, balls, and jerseys, and now paying referees.",
  },
  {
    q: "Do I have to volunteer?",
    a: "Not required per parent, but Nipomo SC depends heavily on community support. Our entire board and all coaches are volunteer. As we grow revenue through fundraisers, sponsorships, and hosting tournaments, we expect to add paid positions over time.",
  },
  {
    q: "Can my child play both AYSO and Nipomo SC?",
    a: "If your child is in Roots (recreational), yes. They can also play AYSO rec with no conflict. However, if your child plays on a Reign (competitive) team, they cannot also play in Roots or AYSO rec. Cal South does not allow competitive players to be dual-registered in recreational programs. But Reign runs year-round with consistent playing opportunities built in, so there's no gap to fill.",
  },
  {
    q: "Can local businesses sponsor jerseys?",
    a: 'Yes. This is new. Under AYSO, jersey sponsorships weren\'t permitted. Email admin@nipomosc.org if interested.',
  },
  {
    q: "What ages does Nipomo SC cover?",
    a: "Roots (recreational) serves ages 4 to 14. Visit nipomosc.org for Rise and Reign age ranges.",
  },
  {
    q: "When does the season start?",
    a: "Visit nipomosc.org for the latest on season dates and registration.",
  },
  {
    q: "How can I get involved?",
    a: "We're looking for board members, coaches, referees, and volunteers. Email admin@nipomosc.org.",
  },
];

function StatCard({ value, label, decimals = 0, suffix = "" }: { value: number; label: string; decimals?: number; suffix?: string }) {
  const { count, ref } = useCountUp(value, 2000, decimals);
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl p-8 text-center shadow-lg"
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span ref={ref} className="block text-5xl md:text-6xl font-bold text-[#1a472a]">
        {count}{suffix}
      </span>
      <span className="block mt-2 text-lg text-gray-600">{label}</span>
    </motion.div>
  );
}

function PercentBar({ label, percent, count, color }: { label: string; percent: number; count: number; color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="mb-3" data-testid={`percent-bar-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-gray-600">{percent}% ({count})</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export default function Compare() {
  const heroRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const scrollToContent = useCallback(() => {
    const el = document.getElementById("section-name");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fafaf7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* Section 1: Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        data-testid="section-hero"
      >
        <div className="text-center px-6 max-w-4xl mx-auto pt-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[#c8a951] uppercase tracking-[0.25em] text-sm md:text-base font-semibold mb-6"
          >
            Nipomo Soccer Club
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
          >
            This Is Your Home for Soccer in Nipomo.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto"
          >
            Recreational. Developmental. Competitive. All under one roof.
          </motion.p>
        </div>
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2 } }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll down"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.button>
      </section>

      {/* Section 2: The Name */}
      <section id="section-name" className="py-20 md:py-32 bg-[#fafaf7]" data-testid="section-name">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a472a] leading-tight"
              style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
            >
              "Soccer Club" Doesn't Mean Club-Only
            </h2>
          </motion.div>

          <div className="md:grid md:grid-cols-2 md:gap-16 items-start">
            <div className="md:sticky md:top-32 mb-12 md:mb-0">
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                Nipomo SC offers three programs for every level of player. Whether your kid wants to play for fun on Saturdays or compete year-round, there's a place here.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {programs.map((prog) => (
                <motion.div
                  key={prog.name}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
                  data-testid={`card-program-${prog.name.toLowerCase()}`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${prog.color}15` }}
                    >
                      <prog.icon className="h-6 w-6" style={{ color: prog.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{prog.name}</h3>
                      <p className="text-sm text-gray-500">{prog.type}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{prog.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-20 text-center"
          >
            <p
              className="text-xl md:text-2xl text-[#1a472a] font-medium max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
            >
              Your child can play Roots every season. Or grow into Rise and Reign over time. No pressure. No wrong path.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Same People */}
      <section
        className="relative py-24 md:py-36"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        data-testid="section-same-people"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[#c8a951] uppercase tracking-[0.2em] text-sm font-semibold mb-6"
          >
            The Team Behind It
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
          >
            80% of last year's AYSO board now leads Nipomo SC.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            Many of us have been volunteering in the Nipomo soccer community for years. Last season, we invested in a TurfTank robotic field painter, added benches for upper divisions, bought new goals, upgraded coaching gear, compressed the Saturday schedule, and coordinated cross-play with neighboring regions.
          </motion.p>
        </div>
      </section>

      {/* Section 4: The Data */}
      <section className="py-20 md:py-32 bg-[#fafaf7]" data-testid="section-data">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a472a] mb-4"
              style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
            >
              What 126 Families Told Us
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              End-of-season survey results from the 2025 AYSO season, run by the team now leading Nipomo SC.
            </p>
          </motion.div>

          {/* Stat Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20"
          >
            <StatCard value={8.8} label="Recommendation Score" decimals={1} suffix=" / 10" />
            <StatCard value={75} label="Support Paid Referees" suffix="%" />
            <StatCard value={68} label="Want a Spring Season" suffix="%" />
            <StatCard value={126} label="Families Surveyed" />
          </motion.div>

          {/* Chart 1: Season Ratings */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 md:p-10 shadow-lg mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
              Season Ratings by Category
            </h3>
            <p className="text-gray-500 text-sm mb-8">Average rating out of 5.0</p>
            <div className="w-full h-[400px]" data-testid="chart-season-ratings">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonRatings} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 13 }} />
                  <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 13 }} />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(2), "Rating"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
                  />
                  <Bar dataKey="rating" radius={[0, 6, 6, 0]} barSize={28}>
                    {seasonRatings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.category === "Referees" ? "#dc2626" : "#1a472a"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-gray-500 text-sm mt-4 italic">
              Every category scored 4.0+, except referees, our biggest structural challenge under AYSO.
            </p>
          </motion.div>

          {/* Charts Row: Paid Referee Support & Spring Season Interest */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                Paid Referee Support
              </h3>
              <PercentBar label="Yes" percent={75} count={94} color="#1a472a" />
              <PercentBar label="Not Sure" percent={13} count={17} color="#d97706" />
              <PercentBar label="No" percent={12} count={15} color="#dc2626" />
              <p className="text-gray-500 text-sm mt-6 italic">
                3 out of 4 families supported this change. Under Cal South, we can now make it happen.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                Spring Season Interest
              </h3>
              <PercentBar label="Very Likely" percent={42} count={53} color="#1a472a" />
              <PercentBar label="Somewhat Likely" percent={26} count={33} color="#4ade80" />
              <PercentBar label="Not Likely" percent={23} count={29} color="#9ca3af" />
              <PercentBar label="Unsure" percent={9} count={11} color="#d1d5db" />
              <p className="text-gray-500 text-sm mt-6 italic">
                68% expressed interest. Nipomo SC's spring developmental season is a direct answer.
              </p>
            </motion.div>
          </div>

          {/* Chart 4: NPS Score Distribution */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-2xl p-6 md:p-10 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
              Recommendation Score Distribution
            </h3>
            <p className="text-gray-500 text-sm mb-8">Scores from 1 to 10, grouped by category</p>
            <div className="flex gap-4 mb-4 text-sm flex-wrap">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> Detractors (1-6): 15</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Passives (7-8): 24</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1a472a] inline-block" /> Promoters (9-10): 87</span>
            </div>
            <div className="w-full h-[300px]" data-testid="chart-nps">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npsData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="score" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <Tooltip
                    formatter={(value: number) => [value, "Responses"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                    {npsData.map((entry, index) => (
                      <Cell
                        key={`nps-${index}`}
                        fill={
                          entry.type === "detractor"
                            ? "#dc2626"
                            : entry.type === "passive"
                            ? "#d97706"
                            : "#1a472a"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-gray-500 text-sm mt-4 italic">
              69% gave a 9 or 10. The board that earned those scores is the one running Nipomo SC.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Meet the Board */}
      <section className="py-20 md:py-32 bg-white" data-testid="section-board">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a472a]"
              style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
            >
              Meet the Board
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {boardMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-[#fafaf7] rounded-2xl p-6 border border-gray-100"
                data-testid={`card-board-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1a472a] flex items-center justify-center text-white font-bold text-lg mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-[#c8a951] font-medium text-sm mb-2">{member.role}</p>
                {member.bg && <p className="text-gray-500 text-sm leading-relaxed">{member.bg}</p>}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-12 bg-[#1a472a]/5 border border-[#1a472a]/10 rounded-2xl p-8 text-center"
          >
            <p className="text-gray-700 text-lg">
              We're still filling board positions. If you're passionate about youth soccer, reach out at{" "}
              <a href="mailto:admin@nipomosc.org" className="text-[#1a472a] font-semibold underline" data-testid="link-board-email">
                admin@nipomosc.org
              </a>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Why We Left AYSO */}
      <section
        className="relative py-24 md:py-36"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        data-testid="section-why-left"
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[#c8a951] uppercase tracking-[0.2em] text-sm font-semibold mb-6"
          >
            Why the Change
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-12"
            style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
          >
            We Didn't Leave Lightly.
          </motion.h2>

          <div className="space-y-10">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-white/85 text-lg leading-relaxed"
            >
              AYSO has served communities for decades, and it served Nipomo for many years. But the challenges of operating within AYSO's structure became harder to overcome, not because of local volunteers, but because of area and national governing bodies.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-[#c8a951] text-xl font-bold mb-3">The Referee Problem</h3>
              <p className="text-white/85 text-lg leading-relaxed">
                AYSO requires all referees to be unpaid volunteers while imposing demanding certification standards: 10+ hours of training for upper-level certification. We were routinely losing qualified refs to the Los Padres Soccer Referees Association and other organizations that pay. Running our region required 200+ volunteers. The demands on referees led to burnout, shortages, and games with a single official. Referees scored 3.89/5, our lowest category.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-[#c8a951] text-xl font-bold mb-3">Postseason</h3>
              <p className="text-white/85 text-lg leading-relaxed">
                Only 5 of our 40+ referees qualified to officiate postseason. Our 12U boys division was the only one that could play. Every other division was shut out, not because of the players, but because the system made it impossible.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-[#c8a951] text-xl font-bold mb-3">Support</h3>
              <p className="text-white/85 text-lg leading-relaxed">
                Requirements from AYSO grew more rigid. Support didn't keep pace. After our longtime referee trainer departed, we had no local certified trainer and became dependent on neighboring regions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 7: What Changes */}
      <section className="py-20 md:py-32 bg-[#fafaf7]" data-testid="section-what-changes">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a472a] mb-4"
              style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
            >
              What Changes Under Cal South
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Nipomo SC is now a Cal South organization, affiliated with US Youth Soccer and the U.S. Soccer Federation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a472a]/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#1a472a]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 8: AYSO This Year? */}
      <section className="py-24 md:py-36 bg-[#111]" data-testid="section-ayso-this-year">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
          >
            What about AYSO this year?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-white/70 text-lg mb-8"
          >
            We're not sure if there will be an AYSO season in Nipomo. That's not our decision.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-white text-2xl md:text-3xl font-bold mb-6"
          >
            There is 100% going to be a Nipomo SC Roots season.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-white/70 text-lg mb-8"
          >
            The people, the infrastructure, and the plan are in place.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-[#c8a951] text-xl md:text-2xl font-bold"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            You don't need to wait and wonder.
          </motion.p>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section className="py-20 md:py-32 bg-[#fafaf7]" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a472a]"
              style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
            >
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Accordion type="single" collapsible className="space-y-3" data-testid="faq-accordion">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-gray-100 px-6 shadow-sm"
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900 hover:no-underline py-5" data-testid={`faq-trigger-${i}`}>
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-5 text-base">
                    {item.a.includes("admin@nipomosc.org") ? (
                      <span>
                        {item.a.split("admin@nipomosc.org")[0]}
                        <a href="mailto:admin@nipomosc.org" className="text-[#1a472a] font-semibold underline">
                          admin@nipomosc.org
                        </a>
                        {item.a.split("admin@nipomosc.org")[1]}
                      </span>
                    ) : item.a.includes("nipomosc.org") ? (
                      <span>
                        {item.a.split("nipomosc.org")[0]}
                        <a href="https://nipomosc.org" className="text-[#1a472a] font-semibold underline" target="_blank" rel="noopener noreferrer">
                          nipomosc.org
                        </a>
                        {item.a.split("nipomosc.org")[1]}
                      </span>
                    ) : (
                      item.a
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Section 10: Footer CTA */}
      <section className="py-24 md:py-32 bg-[#1a472a]" data-testid="section-footer-cta">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8"
            style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}
          >
            Roots. Rise. Reign.
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-4"
          >
            <p>
              <a
                href="https://nipomosc.org"
                className="text-white/90 hover:text-white text-lg underline underline-offset-4 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-website"
              >
                Visit nipomosc.org to learn more
              </a>
            </p>
            <p>
              <a
                href="mailto:admin@nipomosc.org"
                className="text-[#c8a951] hover:text-[#dfc06a] text-lg underline underline-offset-4 transition-colors"
                data-testid="link-footer-email"
              >
                admin@nipomosc.org
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
