import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronDown, DollarSign, Shield, TrendingUp, Shirt, Calendar, Scale } from "lucide-react";
import heroImage from "@assets/generated_images/youth_soccer_hero_image.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

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

const features = [
  {
    icon: DollarSign,
    title: "Referees Can Be Paid",
    desc: "This won't solve every challenge overnight, but it fundamentally changes the equation. It gives us a real incentive to recruit new officials, helps us retain the ones we train instead of losing them to organizations that already pay, and allows us to move on from referees who aren't meeting our standards. When we surveyed families, 75% said they'd support a small registration increase to make this happen.",
  },
  {
    icon: Shield,
    title: "More Local Control",
    desc: "As an independent organization, we have the flexibility to make decisions that fit this community, from scheduling to team formation to how we train and support volunteers.",
  },
  {
    icon: Scale,
    title: "Balanced Teams in Roots",
    desc: "Players registered on a competitive team (Reign or any outside club) are not eligible to play in Roots. Recreational soccer should feel recreational. We'll also be collecting detailed coach assessment data on all players and using that data to balance teams fairly across every division.",
  },
  {
    icon: TrendingUp,
    title: "A Complete Player Pathway",
    desc: "Roots, Rise, and Reign give every player in Nipomo a place to play and a path to grow, all within one organization. Players won't have to leave Nipomo to play the next level of competitive soccer.",
  },
  {
    icon: Shirt,
    title: "Jersey Sponsorships",
    desc: "Under AYSO, jersey sponsorships were sold at a national level with none of those funds benefiting local teams. Under Nipomo SC, local businesses can support local teams directly, helping offset costs for families.",
  },
  {
    icon: Calendar,
    title: "More Soccer, More Often",
    desc: "68% of families said they'd be interested in a spring season. Under AYSO, that wasn't something we could offer. Under Nipomo SC, it is, and we're launching a spring developmental season this year.",
  },
];

const comparisonRows = [
  {
    label: "Referees",
    nsc: "Paid, trained referees with better coverage, accountability, and retention",
    ayso: "Volunteer-only with no compensation allowed, even with demanding certification requirements",
  },
  {
    label: "Team Balancing",
    nsc: "Roots is exclusively for non-club players; coach assessment data used to balance all Roots teams",
    ayso: "No restrictions on club players in rec divisions; team balancing varies by region",
  },
  {
    label: "Player Pathway",
    nsc: "Roots (rec), Rise (developmental), Reign (competitive), all under one organization",
    ayso: "Recreational focus with limited competitive pathways (All-Stars, postseason)",
  },
  {
    label: "Rec Postseason",
    nsc: "Roots teams that qualify move on to a regional tournament",
    ayso: "Teams must have 3 volunteer referees who volunteered 20+ hours to advance",
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
];

const faqItems = [
  {
    q: "Is Nipomo SC a non-profit?",
    a: "Yes. Nipomo Soccer Club is a registered non-profit organization.",
  },
  {
    q: 'Does "soccer club" mean it\'s only for competitive players?',
    a: 'Not at all. The word "club" refers to the organization, not the level of play. Nipomo SC is the umbrella for all soccer in Nipomo. Roots is recreational soccer: Saturday games, weekday practices, team assignments, ages 4 to 14. Rise is a developmental bridge for players who want more training without the full commitment of a competitive team. Reign is competitive, year-round training and tournament play. Your child can play Roots every season and have a great experience without ever playing competitive soccer.',
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
    a: "Two ways. First, players on competitive teams, whether Reign or any outside club, are not eligible to play in Roots. Recreational soccer should feel recreational. Second, we'll be collecting detailed coach assessment data on all players and using that data to balance teams fairly across every division. No more lopsided matchups.",
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

function renderFaqAnswer(text: string) {
  const parts = text.split(/(admin@nipomosc\.org|nipomosc\.org)/g);
  return parts.map((part, i) => {
    if (part === "admin@nipomosc.org") {
      return (
        <a key={i} href="mailto:admin@nipomosc.org" className="text-crimson font-semibold underline underline-offset-2">
          admin@nipomosc.org
        </a>
      );
    }
    if (part === "nipomosc.org") {
      return (
        <a key={i} href="https://nipomosc.org" className="text-crimson font-semibold underline underline-offset-2" target="_blank" rel="noopener noreferrer">
          nipomosc.org
        </a>
      );
    }
    return part;
  });
}

export default function Compare() {
  const scrollToContent = useCallback(() => {
    const el = document.getElementById("section-same-people");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-night">
      <Header />

      {/* HERO */}
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
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display text-warmwhite text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-wider leading-none mb-6"
          >
            NIPOMO SC VS. AYSO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-warmwhite/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            What's the difference? This article breaks down what Nipomo SC is, who's behind it, and what it means for your family.
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

      {/* THE SAME PEOPLE, A LOCAL STRUCTURE */}
      <section id="section-same-people" className="py-20 md:py-28 bg-warmwhite" data-testid="section-same-people">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-purple/10 rounded-full text-purple text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Who We Are
            </span>
            <h2 className="font-display text-night text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
              THE SAME PEOPLE, A LOCAL STRUCTURE
            </h2>
          </motion.div>

          <div className="space-y-6">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-night/80 text-lg leading-relaxed"
            >
              Nipomo SC didn't come out of nowhere. <strong className="text-night">~75% of the board members running the day to day operations of the 2025 AYSO soccer season is now running Nipomo Soccer Club</strong>, and many of us have been volunteering in the Nipomo soccer community for several years.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-night/80 text-lg leading-relaxed"
            >
              Last season, this group invested in making the game-day experience better for players, families, and volunteers. That included several improvements that dramatically reduced the volunteer hours needed to run the season, adding benches to every sideline in the 10U, 12U, and 14U divisions, buying new goals, upgrading coaching gear, compressing the Saturday schedule so families and volunteers weren't stuck at the fields all day, and expanding cross-play with neighboring regions.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-night/80 text-lg leading-relaxed"
            >
              In our end-of-season survey of 126 families, the results speak for themselves. Equipment, communication, and coaching all scored between 4.4 and 4.6 out of 5. Every single category scored 4.0 or higher, except referees, which we'll get to. And when asked how likely they'd be to recommend Nipomo Soccer to a friend, families gave an average score of 8.8 out of 10, with 69% giving a 9 or 10.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-night/80 text-lg leading-relaxed"
            >
              That commitment hasn't gone anywhere. It's operating under a local structure better suited to our community's needs, not requirements set by a national governing body.
            </motion.p>
          </div>

        </div>
      </section>

      {/* WHY WE LEFT AYSO */}
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
            className="font-display text-warmwhite text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-tight mb-10"
          >
            WHY WE LEFT AYSO
          </motion.h2>

          <div className="space-y-8">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-warmwhite/80 text-lg leading-relaxed"
            >
              This wasn't a decision made lightly. AYSO has served communities across the country for decades, and it served Nipomo for many years. Many of us participated within AYSO as players, coaches, board members, referees, and volunteers for years. But the challenges of operating within AYSO's structure became harder to overcome. Not because of local volunteers, but because of the national governing body.
            </motion.p>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-warmwhite/80 text-lg leading-relaxed"
            >
              There were three main challenges:
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-gold font-display text-lg uppercase tracking-wide mb-3">REFEREES</h3>
              <p className="text-warmwhite/80 text-lg leading-relaxed">
                AYSO requires all referees to be unpaid volunteers while imposing demanding certification standards. A basic Regional certification takes a full day. Intermediate requires a full-day course (10 to 11 hours) plus 25 games of experience. Advanced requires even more. AYSO asks volunteers to commit 10+ hours of training and officiate every Saturday with no compensation, and we were routinely losing our most qualified referees to other organizations that actually pay their officials.
              </p>
              <p className="text-warmwhite/80 text-lg leading-relaxed mt-4">
                Running the Nipomo AYSO region required over 200 volunteers across coaching, board positions, and officiating. There are real benefits to a volunteer-driven model, and we're proud of what this community stepped up to do. But the demands on referees in particular (heavy training requirements, no compensation, and increasingly rigid certification standards) led to burnout. Referee shortages were our biggest challenge last season. Games ran with a single official. AYSO prevents dual registration across regions, meaning we couldn't easily share officials with neighboring areas. Referees scored 3.89 out of 5 in our family survey, the only category below 4.0.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-gold font-display text-lg uppercase tracking-wide mb-3">ALL-STAR POSTSEASON</h3>
              <p className="text-warmwhite/80 text-lg leading-relaxed">
                AYSO's certification requirements for All-Star play hit our community hard. Of our 25+ referees in the region, only 5 qualified to officiate at the All-Star level. Kids who deserved a chance to play all-stars couldn't, because we didn't have enough certified officials to staff their divisions. Only our 12U boys division qualified based on the referees available. Every other division was left out. Not because of any competing teams or clubs, but because the system made it impossible.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h3 className="text-gold font-display text-lg uppercase tracking-wide mb-3">INADEQUATE NATIONAL SUPPORT</h3>
              <p className="text-warmwhite/80 text-lg leading-relaxed">
                While requirements from area and national leadership grew more difficult, the support just wasn't there. Very few classes to meet the training requirements were offered. Operating a successful local league became increasingly difficult under AYSO's constraints.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MEET THE BOARD */}
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
                {member.bg && <p className="text-night/50 text-sm leading-relaxed">{member.bg}</p>}
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
              We're still filling additional board positions. If you're passionate about youth soccer and want to help build something meaningful for this community, reach out at{" "}
              <a href="mailto:admin@nipomosc.org" className="text-gold font-semibold underline underline-offset-2" data-testid="link-board-email">
                admin@nipomosc.org
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S DIFFERENT UNDER NIPOMO SC */}
      <section className="py-20 md:py-28 bg-warmwhite" data-testid="section-what-changes">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-6"
          >
            <span className="inline-block px-4 py-1.5 bg-purple/10 rounded-full text-purple text-xs font-heading font-semibold uppercase tracking-wider mb-4">
              Cal South Affiliated
            </span>
            <h2 className="font-display text-night text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide mb-4">
              WHAT'S DIFFERENT UNDER NIPOMO SC
            </h2>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-night/80 text-lg leading-relaxed mb-12 text-center"
          >
            Nipomo SC meets all standards set forth by California and the U.S. Soccer Federation, so your child still has the same insurance coverage, background checks, and organizational standards you'd expect. The difference is that we now have the flexibility to do what's best for this community without the AYSO policies that held us back.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white rounded-xl p-7 border border-night/5"
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon className="h-5 w-5 text-crimson" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wide text-night mb-2">{feature.title}</h3>
                    <p className="text-night/70 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NIPOMO SC VS. AYSO AT A GLANCE */}
      <section className="py-20 md:py-28 bg-night" data-testid="section-comparison">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="font-display text-warmwhite text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
              AT A GLANCE
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="overflow-x-auto"
          >
            {/* Desktop table */}
            <table className="hidden md:table w-full" data-testid="table-comparison">
              <thead>
                <tr className="border-b border-warmwhite/10">
                  <th className="text-left py-4 px-5 font-display text-warmwhite/50 uppercase tracking-wider text-base w-[160px]"></th>
                  <th className="text-left py-4 px-5 font-display text-crimson uppercase tracking-wider text-base">Nipomo SC</th>
                  <th className="text-left py-4 px-5 font-display text-warmwhite/40 uppercase tracking-wider text-base">AYSO</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-warmwhite/5" data-testid={`comparison-row-${row.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <td className="py-5 px-5 font-heading font-semibold text-gold text-base uppercase tracking-wider align-top">{row.label}</td>
                    <td className="py-5 px-5 text-warmwhite/80 text-base leading-relaxed align-top">{row.nsc}</td>
                    <td className="py-5 px-5 text-warmwhite/40 text-base leading-relaxed align-top">{row.ayso}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {comparisonRows.map((row, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-warmwhite/5 rounded-xl p-5"
                  data-testid={`comparison-card-${row.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <h4 className="font-heading font-semibold text-gold text-base uppercase tracking-wider mb-3">{row.label}</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-crimson font-heading font-semibold text-sm uppercase tracking-wider">Nipomo SC</span>
                      <p className="text-warmwhite/80 text-base leading-relaxed mt-1">{row.nsc}</p>
                    </div>
                    <div>
                      <span className="text-warmwhite/40 font-heading font-semibold text-sm uppercase tracking-wider">AYSO</span>
                      <p className="text-warmwhite/40 text-base leading-relaxed mt-1">{row.ayso}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHAT ABOUT AYSO THIS YEAR? */}
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
            We'll be straightforward: <strong className="text-warmwhite">we're not sure if there will be an AYSO season in Nipomo this year.</strong> That's not our decision to make.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-warmwhite/60 text-lg mb-6"
          >
            What we can tell you is this:
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-display text-warmwhite text-2xl md:text-4xl uppercase tracking-wide mb-8"
          >
            THERE IS <span className="text-crimson">100%</span> GOING TO BE A NIPOMO SC ROOTS SEASON
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-warmwhite/60 text-lg mb-3"
          >
            The people, the infrastructure, and the plan are in place to deliver a great season for your family.
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-gold font-display text-xl md:text-2xl uppercase tracking-wide"
          >
            YOU DON'T NEED TO WAIT AND WONDER. NIPOMO SC IS HERE.
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
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
                    {renderFaqAnswer(item.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* FOOTER CTA */}
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
                <a href="/#contact">Get Started</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
