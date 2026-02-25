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
  LabelList,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronDown, DollarSign, Shield, TrendingUp, Shirt, Calendar } from "lucide-react";
import heroImage from "@assets/generated_images/youth_soccer_hero_image.png";
import rootsLogo from "@assets/NSC_Roots_1764979848772.png";
import riseLogo from "@assets/NSC_Rise_1764979848772.png";
import reignLogo from "@assets/NSC_Reign_1764979848771.png";

function useCountUp(end: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef(null);
  const isInView = useInView(inViewRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView || done) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(parseFloat(end.toFixed(decimals)));
        setDone(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration, decimals, done]);

  return { count, ref, inViewRef };
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const programs = [
  {
    name: "Roots",
    type: "Recreational Soccer",
    description: "Saturday games, weekday practices, team assignments, ages 4 to 14. If your family is looking for rec soccer, Roots is your home.",
    logo: rootsLogo,
  },
  {
    name: "Rise",
    type: "Developmental",
    description: "A bridge for players who want more training without the full commitment of a competitive team.",
    logo: riseLogo,
  },
  {
    name: "Reign",
    type: "Competitive",
    description: "Year-round training and tournament play for players ready for that level.",
    logo: reignLogo,
  },
];

const boardMembers = [
  { name: "Adrian Dalton", role: "President", bg: "Former AYSO Region 716 Regional Commissioner. Current Nipomo HS men's soccer head coach." },
  { name: "Autumn Dalton", role: "Board Member", bg: "Former AYSO board member." },
  { name: "Johnny Page", role: "Head of Marketing & Recruiting", bg: "Former AYSO Coach Administrator." },
  { name: "Ashley Page", role: "Operations & Social Media", bg: "Ran social media and operations for AYSO; continues for NSC." },
  { name: "Justin Marsh", role: "Operations Director", bg: "Former AYSO Assistant Regional Commissioner." },
  { name: "Ashley Marsh", role: "Referee Administrator", bg: "AYSO Referee Admin; continues for NSC." },
  { name: "Andres Lopez", role: "Treasurer", bg: "Nipomo soccer community volunteer." },
  { name: "Giovanni Garcia", role: "Club Director, Reign", bg: "Head JV coach, Pioneer Valley HS soccer." },
  { name: "Carla", role: "Registrar", bg: "Nipomo soccer community volunteer." },
  { name: "Che Coho", role: "Board Member", bg: "Nipomo soccer community volunteer." },
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
    a: "Yes. This is new. Under AYSO, jersey sponsorships weren't permitted. Email admin@nipomosc.org if interested.",
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
  const { count, inViewRef } = useCountUp(value, 2000, decimals);
  return (
    <motion.div
      ref={inViewRef}
      variants={fadeUp}
      className="bg-warmwhite rounded-xl p-6 md:p-8 text-center"
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span className="block text-4xl sm:text-5xl md:text-6xl font-bold text-crimson font-display">
        {count}{suffix}
      </span>
      <span className="block mt-2 text-sm md:text-base text-night/60 font-heading font-medium uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

function PercentBar({ label, percent, count, color }: { label: string; percent: number; count: number; color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="mb-4" data-testid={`percent-bar-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-heading font-semibold text-night">{label}</span>
        <span className="text-night/60">{percent}% ({count})</span>
      </div>
      <div className="w-full bg-night/10 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={isInView ? { width: `${percent}%` } : { width: "0%" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

export default function Compare() {
  const scrollToContent = useCallback(() => {
    const el = document.getElementById("section-name");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-night">
      <Header />

      {/* SECTION 1: HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(13,13,13,0.6), rgba(13,13,13,0.6)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        data-testid="section-hero"
      >
        <div className="text-center px-6 max-w-5xl mx-auto pt-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gold uppercase tracking-[0.3em] text-xs md:text-sm font-heading font-semibold mb-6"
          >
            Nipomo Soccer Club
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display text-warmwhite text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-wider leading-none mb-6"
          >
            THIS IS YOUR HOME FOR SOCCER IN NIPOMO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-warmwhite/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Recreational. Developmental. Competitive. All under one roof.
          </motion.p>
        </div>
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2 } }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-warmwhite/50 hover:text-warmwhite transition-colors"
          aria-label="Scroll down"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.button>
      </section>

      {/* SECTION 2: THE NAME */}
      <section id="section-name" className="py-20 md:py-28 bg-warmwhite" data-testid="section-name">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-purple/10 rounded-full text-purple text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Three Connected Programs
            </span>
            <h2 className="font-display text-night text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
              "SOCCER CLUB" DOESN'T MEAN CLUB-ONLY
            </h2>
          </motion.div>

          <div className="md:grid md:grid-cols-2 md:gap-16 items-start">
            <div className="md:sticky md:top-32 mb-12 md:mb-0">
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-lg md:text-xl text-night/70 leading-relaxed"
              >
                Nipomo SC offers three programs for every level of player. Whether your kid wants to play for fun on Saturdays or compete year-round, there's a place here.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="space-y-5"
            >
              {programs.map((prog) => (
                <motion.div
                  key={prog.name}
                  variants={fadeUp}
                  className="bg-white rounded-xl p-6 border border-night/5"
                  data-testid={`card-program-${prog.name.toLowerCase()}`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img src={prog.logo} alt={prog.name} className="w-14 h-14 object-contain" />
                    <div>
                      <h3 className="font-display text-lg uppercase tracking-wide text-night">{prog.name}</h3>
                      <p className="text-xs text-night/50 font-heading font-medium uppercase tracking-wider">{prog.type}</p>
                    </div>
                  </div>
                  <p className="text-night/70 leading-relaxed">{prog.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-16 text-center"
          >
            <p className="text-xl md:text-2xl font-heading font-semibold text-crimson max-w-3xl mx-auto leading-relaxed">
              Your child can play Roots every season. Or grow into Rise and Reign over time. No pressure. No wrong path.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: SAME PEOPLE */}
      <section
        className="relative py-24 md:py-36"
        style={{
          backgroundImage: `linear-gradient(rgba(13,13,13,0.75), rgba(13,13,13,0.75)), url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80')`,
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
            className="text-gold uppercase tracking-[0.3em] text-xs font-heading font-semibold mb-6"
          >
            The Team Behind It
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-display text-warmwhite text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-tight mb-8"
          >
            80% OF LAST YEAR'S AYSO BOARD NOW LEADS NIPOMO SC
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-warmwhite/80 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            Many of us have been volunteering in the Nipomo soccer community for years. Last season, we invested in a TurfTank robotic field painter, added benches for upper divisions, bought new goals, upgraded coaching gear, compressed the Saturday schedule, and coordinated cross-play with neighboring regions.
          </motion.p>
        </div>
      </section>

      {/* SECTION 4: THE DATA */}
      <section className="py-20 md:py-28 bg-warmwhite" data-testid="section-data">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-purple/10 rounded-full text-purple text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Survey Results
            </span>
            <h2 className="font-display text-night text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide mb-4">
              WHAT 126 FAMILIES TOLD US
            </h2>
            <p className="text-night/60 text-lg max-w-2xl mx-auto">
              End-of-season survey results from the 2025 AYSO season, run by the team now leading Nipomo SC.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-16"
          >
            <StatCard value={8.8} label="Recommendation Score" decimals={1} suffix="/10" />
            <StatCard value={75} label="Support Paid Referees" suffix="%" />
            <StatCard value={68} label="Want a Spring Season" suffix="%" />
            <StatCard value={126} label="Families Surveyed" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-xl p-6 md:p-10 border border-night/5 mb-10"
          >
            <h3 className="font-display text-xl md:text-2xl text-night uppercase tracking-wide mb-1">
              SEASON RATINGS BY CATEGORY
            </h3>
            <p className="text-night/50 text-sm mb-8">Average rating out of 5.0</p>
            <div className="w-full h-[400px]" data-testid="chart-season-ratings">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonRatings} layout="vertical" margin={{ left: 10, right: 50, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,13,13,0.06)" horizontal={false} />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12, fill: "#55524D" }} />
                  <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 12, fill: "#0D0D0D" }} />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(2), "Rating"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid rgba(13,13,13,0.1)", fontFamily: "Inter, sans-serif" }}
                  />
                  <Bar dataKey="rating" radius={[0, 4, 4, 0]} barSize={26}>
                    {seasonRatings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.category === "Referees" ? "#8B1D24" : "#0D0D0D"}
                      />
                    ))}
                    <LabelList dataKey="rating" position="right" formatter={(v: number) => v.toFixed(2)} style={{ fontSize: 12, fill: "#55524D", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-night/50 text-sm mt-4 italic">
              Every category scored 4.0+, except referees, our biggest structural challenge under AYSO.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-xl p-6 md:p-8 border border-night/5"
            >
              <h3 className="font-display text-lg text-night uppercase tracking-wide mb-6">
                PAID REFEREE SUPPORT
              </h3>
              <PercentBar label="Yes" percent={75} count={94} color="#8B1D24" />
              <PercentBar label="Not Sure" percent={13} count={17} color="#C6A045" />
              <PercentBar label="No" percent={12} count={15} color="#55524D" />
              <p className="text-night/50 text-sm mt-6 italic">
                3 out of 4 families supported this change. Under Cal South, we can now make it happen.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-xl p-6 md:p-8 border border-night/5"
            >
              <h3 className="font-display text-lg text-night uppercase tracking-wide mb-6">
                SPRING SEASON INTEREST
              </h3>
              <PercentBar label="Very Likely" percent={42} count={53} color="#8B1D24" />
              <PercentBar label="Somewhat Likely" percent={26} count={33} color="#C6A045" />
              <PercentBar label="Not Likely" percent={23} count={29} color="#55524D" />
              <PercentBar label="Unsure" percent={9} count={11} color="#A8ADB5" />
              <p className="text-night/50 text-sm mt-6 italic">
                68% expressed interest. Nipomo SC's spring developmental season is a direct answer.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-white rounded-xl p-6 md:p-10 border border-night/5"
          >
            <h3 className="font-display text-xl md:text-2xl text-night uppercase tracking-wide mb-1">
              RECOMMENDATION SCORE DISTRIBUTION
            </h3>
            <p className="text-night/50 text-sm mb-6">Scores from 1 to 10, grouped by category</p>
            <div className="flex gap-4 mb-6 text-sm flex-wrap">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-crimson inline-block" /> Detractors (1-6): 15</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gold inline-block" /> Passives (7-8): 24</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-night inline-block" /> Promoters (9-10): 87</span>
            </div>
            <div className="w-full h-[300px]" data-testid="chart-nps">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npsData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,13,13,0.06)" vertical={false} />
                  <XAxis dataKey="score" tick={{ fontSize: 12, fill: "#55524D" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#55524D" }} />
                  <Tooltip
                    formatter={(value: number) => [value, "Responses"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid rgba(13,13,13,0.1)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
                    {npsData.map((entry, index) => (
                      <Cell
                        key={`nps-${index}`}
                        fill={
                          entry.type === "detractor"
                            ? "#8B1D24"
                            : entry.type === "passive"
                            ? "#C6A045"
                            : "#0D0D0D"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-night/50 text-sm mt-4 italic">
              69% gave a 9 or 10. The board that earned those scores is the one running Nipomo SC.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: WHY WE LEFT */}
      <section
        className="relative py-24 md:py-36"
        style={{
          backgroundImage: `linear-gradient(rgba(13,13,13,0.8), rgba(13,13,13,0.8)), url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1920&q=80')`,
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
            className="text-gold uppercase tracking-[0.3em] text-xs font-heading font-semibold mb-6"
          >
            Why the Change
          </motion.p>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-display text-warmwhite text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-tight mb-12"
          >
            WE DIDN'T LEAVE LIGHTLY
          </motion.h2>

          <div className="space-y-10">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-warmwhite/80 text-lg leading-relaxed"
            >
              AYSO has served communities for decades, and it served Nipomo for many years. But the challenges of operating within AYSO's structure became harder to overcome, not because of local volunteers, but because of area and national governing bodies.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-gold font-display text-lg uppercase tracking-wide mb-3">THE REFEREE PROBLEM</h3>
              <p className="text-warmwhite/80 text-lg leading-relaxed">
                AYSO requires all referees to be unpaid volunteers while imposing demanding certification standards: 10+ hours of training for upper-level certification. We were routinely losing qualified refs to the Los Padres Soccer Referees Association and other organizations that pay. Running our region required 200+ volunteers. The demands on referees led to burnout, shortages, and games with a single official. Referees scored 3.89/5, our lowest category.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-gold font-display text-lg uppercase tracking-wide mb-3">POSTSEASON</h3>
              <p className="text-warmwhite/80 text-lg leading-relaxed">
                Only 5 of our 40+ referees qualified to officiate postseason. Our 12U boys division was the only one that could play. Every other division was shut out, not because of the players, but because the system made it impossible.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-gold font-display text-lg uppercase tracking-wide mb-3">SUPPORT</h3>
              <p className="text-warmwhite/80 text-lg leading-relaxed">
                Requirements from AYSO grew more rigid. Support didn't keep pace. After our longtime referee trainer departed, we had no local certified trainer and became dependent on neighboring regions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHAT CHANGES */}
      <section className="py-20 md:py-28 bg-warmwhite" data-testid="section-what-changes">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-purple/10 rounded-full text-purple text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Cal South Affiliated
            </span>
            <h2 className="font-display text-night text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide mb-4">
              WHAT CHANGES UNDER CAL SOUTH
            </h2>
            <p className="text-night/60 text-lg max-w-2xl mx-auto">
              Nipomo SC is now a Cal South organization, affiliated with US Youth Soccer and the U.S. Soccer Federation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white rounded-xl p-7 border border-night/5"
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-11 h-11 rounded-full bg-crimson/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-crimson" />
                </div>
                <h3 className="font-display text-base uppercase tracking-wide text-night mb-2">{feature.title}</h3>
                <p className="text-night/60 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 7: MEET THE BOARD */}
      <section className="py-20 md:py-28 bg-night" data-testid="section-board">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-purple/20 rounded-full text-warmwhite/70 text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Leadership
            </span>
            <h2 className="font-display text-warmwhite text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
              MEET THE BOARD
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {boardMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-warmwhite rounded-xl p-6"
                data-testid={`card-board-${member.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-11 h-11 rounded-full bg-crimson flex items-center justify-center text-warmwhite font-display text-lg mb-3">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-display text-base uppercase tracking-wide text-night">{member.name}</h3>
                <p className="text-crimson font-heading font-semibold text-xs uppercase tracking-wider mb-2">{member.role}</p>
                <p className="text-night/50 text-sm leading-relaxed">{member.bg}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mt-10 border border-warmwhite/15 rounded-xl p-8 text-center"
          >
            <p className="text-warmwhite/80 text-lg">
              We're still filling board positions. If you're passionate about youth soccer, reach out at{" "}
              <a href="mailto:admin@nipomosc.org" className="text-gold font-semibold underline underline-offset-2" data-testid="link-board-email">
                admin@nipomosc.org
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 8: WHAT ABOUT AYSO? */}
      <section className="py-20 md:py-28 bg-night border-t border-warmwhite/5" data-testid="section-ayso-this-year">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-display text-warmwhite text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide mb-6"
          >
            WHAT ABOUT AYSO THIS YEAR?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-warmwhite/60 text-lg mb-8"
          >
            We're not sure if there will be an AYSO season in Nipomo. That's not our decision.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-display text-warmwhite text-2xl md:text-4xl uppercase tracking-wide mb-6"
          >
            THERE IS <span className="text-crimson">100%</span> GOING TO BE A NIPOMO SC ROOTS SEASON
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-warmwhite/60 text-lg mb-8"
          >
            The people, the infrastructure, and the plan are in place.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-gold font-display text-xl md:text-2xl uppercase tracking-wide"
          >
            YOU DON'T NEED TO WAIT AND WONDER
          </motion.p>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-20 md:py-28 bg-warmwhite" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="font-display text-night text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
              FREQUENTLY ASKED QUESTIONS
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
                  className="bg-white rounded-xl border border-night/5 px-6"
                  data-testid={`faq-item-${i}`}
                >
                  <AccordionTrigger className="text-left text-base font-heading font-semibold text-night hover:no-underline py-5 [&>svg]:text-crimson" data-testid={`faq-trigger-${i}`}>
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-night/70 leading-relaxed pb-5">
                    {item.a.includes("admin@nipomosc.org") ? (
                      <span>
                        {item.a.split("admin@nipomosc.org")[0]}
                        <a href="mailto:admin@nipomosc.org" className="text-crimson font-semibold underline underline-offset-2">
                          admin@nipomosc.org
                        </a>
                        {item.a.split("admin@nipomosc.org")[1]}
                      </span>
                    ) : item.a.includes("nipomosc.org") ? (
                      <span>
                        {item.a.split("nipomosc.org")[0]}
                        <a href="https://nipomosc.org" className="text-crimson font-semibold underline underline-offset-2" target="_blank" rel="noopener noreferrer">
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

      {/* SECTION 10: FOOTER CTA */}
      <section className="py-24 md:py-32 bg-night" data-testid="section-footer-cta">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-display text-warmwhite text-4xl sm:text-5xl md:text-7xl uppercase tracking-wider mb-8"
          >
            ROOTS. RISE. REIGN.
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-5"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://nipomosc.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warmwhite/70 hover:text-warmwhite text-lg underline underline-offset-4 transition-colors"
                data-testid="link-footer-website"
              >
                Visit nipomosc.org
              </a>
              <span className="hidden sm:inline text-warmwhite/30">|</span>
              <a
                href="mailto:admin@nipomosc.org"
                className="text-gold hover:text-gold/80 text-lg underline underline-offset-4 transition-colors"
                data-testid="link-footer-email"
              >
                admin@nipomosc.org
              </a>
            </div>
            <div>
              <Button
                asChild
                className="bg-crimson hover:bg-crimson-dark text-warmwhite px-8 py-3 text-base font-heading font-semibold uppercase tracking-wider rounded-lg"
                data-testid="button-get-started"
              >
                <a href="https://nipomosc.org/#contact">Get Started</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
