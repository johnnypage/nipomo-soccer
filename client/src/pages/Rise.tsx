import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "wouter";
import {
  Calendar,
  Users,
  Trophy,
  Shirt,
  Shield,
  Medal,
  ArrowRight,
  Clock,
  Dribbble,
  Target,
  Swords,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import riseLogo from "@assets/NSC_Rise_1771869672687.png";
import riseHero from "@assets/generated_images/rise_hero_aerial.png";
import riseTraining from "@assets/generated_images/rise_training_session.png";
import riseScrimmage from "@assets/generated_images/rise_scrimmage_game.png";

export default function Rise() {
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileCta(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const phases = [
    {
      weeks: "Weeks 1–2",
      title: "Dribbling & Ball Control",
      icon: Dribbble,
    },
    {
      weeks: "Weeks 3–4",
      title: "Passing & Receiving",
      icon: Target,
    },
    {
      weeks: "Weeks 5–6",
      title: "Attacking & Defending",
      icon: Swords,
    },
  ];

  const divisions = [
    {
      division: "Division 1",
      grades: "1st–2nd",
      session: "60 minutes",
      format: "Warm-up → Station rotations → Scrimmage",
    },
    {
      division: "Division 2",
      grades: "3rd–4th",
      session: "90 minutes",
      format: "Warm-up → Station rotations → Scrimmage",
    },
    {
      division: "Division 3",
      grades: "5th–6th",
      session: "120 minutes",
      format: "Warm-up → Stations + skill application → Scrimmage",
    },
    {
      division: "Division 4",
      grades: "7th–8th",
      session: "120 minutes",
      format: "Warm-up → Stations + skill application → Scrimmage",
    },
  ];

  const included = [
    { icon: Calendar, label: "12 Training Sessions", sublabel: "2x/week for 6 weeks" },
    { icon: Trophy, label: "2 Tournament Entries" },
    { icon: Shirt, label: "Program Shirt" },
    { icon: Shield, label: "Insurance Coverage" },
    { icon: Medal, label: "Medal for Tournament Winners" },
  ];

  const pricing = [
    {
      tier: "Early Bird",
      dates: "February 15 – March 15",
      price: "$85",
      highlighted: true,
    },
    {
      tier: "Regular",
      dates: "March 16 – April 5",
      price: "$100",
      highlighted: false,
    },
    {
      tier: "Late",
      dates: "April 6 – April 10",
      price: "$120",
      highlighted: false,
    },
  ];

  const pathway = [
    {
      name: "ROOTS",
      label: "Recreational",
      description: "Our fall rec program. Parent-coached. Weekly games. Where it all starts. Coming Fall 2026.",
      current: false,
    },
    {
      name: "RISE",
      label: "Development",
      description: "Spring. 6 weeks. Certified coaches. Skill-focused training.",
      current: true,
    },
    {
      name: "REIGN",
      label: "Competitive",
      description: "Year-round club teams. Professional coaching. League play.",
      current: false,
    },
  ];

  const faqs = [
    {
      q: "Do I need soccer experience to sign up?",
      a: "Nope. RISE is open to all skill levels, grades 1–8. No tryouts.",
    },
    {
      q: "What days are training?",
      a: "Training days will be confirmed and communicated at registration based on field availability.",
    },
    {
      q: "What if my kid plays another sport in the spring?",
      a: "That's exactly who this program is built for. Six weeks, twice a week — designed to fit alongside other activities.",
    },
    {
      q: "Are there refunds?",
      a: "No refunds. If your child is injured, credit toward a future Nipomo SC program may be offered at the director's discretion.",
    },
    {
      q: "Is there a sibling discount?",
      a: "Not at this time.",
    },
    {
      q: "What should my kid bring?",
      a: "Cleats, shin guards, water bottle, and a good attitude. Program shirts will be provided.",
    },
    {
      q: "What about the tournaments — do I need to be there all day?",
      a: "Each tournament runs about 4–5 hours on a Saturday. All players should plan to be there for the full half-day.",
    },
    {
      q: "How are tournament teams formed?",
      a: "The Program Director creates balanced, gender-separated teams the day before each tournament based on coach observations from training. A parent volunteer is assigned as team coach for the day.",
    },
  ];

  const registrationUrl = "#register";

  return (
    <div className="min-h-screen bg-warmwhite">
      <Header onNavigate={scrollToSection} />

      <section className="relative pt-16 min-h-[80vh] flex items-center" data-testid="section-hero">
        <div className="absolute inset-0">
          <img
            src={riseHero}
            alt="Aerial view of soccer training camp"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/60" />
          <div className="absolute inset-0 bg-night/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1">
              <Badge className="bg-crimson/20 text-crimson border-crimson/40 mb-6 text-sm" data-testid="badge-development">
                Spring Development League
              </Badge>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-warmwhite tracking-wide mb-4" data-testid="text-rise-title">
                RISE
              </h1>
              <p className="text-warmwhite/80 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl">
                6 weeks of skill-focused training for players who love soccer but aren't ready for year-round club.
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-6 mb-10 text-warmwhite/90 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span>April 13 – May 23</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gold" />
                  <span>Grades 1–8</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold" />
                  <span>2x/week training</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gold" />
                  <span>2 tournaments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold font-semibold">$100</span>
                </div>
              </div>

              <Button
                className="bg-crimson hover:bg-crimson-dark text-warmwhite font-bold text-lg px-8 py-6 rounded-xl shadow-lg"
                onClick={() => scrollToSection("register")}
                data-testid="button-hero-register"
              >
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex-shrink-0">
              <img
                src={riseLogo}
                alt="RISE Program Logo"
                className="h-48 sm:h-56 lg:h-72 w-auto object-contain drop-shadow-2xl"
                data-testid="img-rise-logo"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="what-is-rise" className="py-16 sm:py-20 bg-warmwhite" data-testid="section-what-is-rise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-sm font-medium mb-4 uppercase tracking-wide">
                What is RISE?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide mb-6">
                WHAT IS RISE?
              </h2>
              <p className="text-night/80 text-lg leading-relaxed mb-6">
                RISE is a 6-week spring program built for kids who love soccer but play other sports too. Instead of forming teams and jumping straight into games, RISE focuses on developing individual skills through structured, coach-led training sessions — and then puts those skills to the test in two Saturday tournaments.
              </p>
              <div className="bg-purple/5 border-l-4 border-purple p-4 rounded-r-lg mb-6">
                <p className="text-night/90 italic text-lg">
                  "Think of it as a soccer skills camp with a competitive edge."
                </p>
              </div>
              <p className="text-night/80 text-lg leading-relaxed">
                Your kid gets 12 training sessions, works with experienced coaches, and walks away a better player — all without a year-round commitment.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg" data-testid="img-what-is-rise">
              <img
                src={riseTraining}
                alt="Kids in a training session doing station rotation drills"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-20 bg-night/[0.03]" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-4 uppercase tracking-wide">
              The Program
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-crimson flex items-center justify-center">
                  <Users className="h-4 w-4 text-warmwhite" />
                </div>
                <h3 className="font-heading font-bold text-xl text-night uppercase tracking-wide">Training (Weeks 1–6)</h3>
              </div>
              <p className="text-night/80 mb-6 leading-relaxed">
                Players train twice per week in co-ed age divisions. Sessions are run by experienced coaches with support from teen helpers recruited from our REIGN club teams and local high school players. Every session follows a progressive curriculum focused on individual technical skills — not team tactics.
              </p>
              <div className="space-y-4">
                {phases.map((phase, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-night/[0.03] rounded-xl p-4" data-testid={`phase-${idx}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center">
                      <phase.icon className="h-5 w-5 text-crimson" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-crimson uppercase tracking-wide">{phase.weeks}</div>
                      <div className="font-heading font-semibold text-night">{phase.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-night" />
                </div>
                <h3 className="font-heading font-bold text-xl text-night uppercase tracking-wide">Tournaments (2 Saturdays)</h3>
              </div>
              <div className="space-y-4 mb-6">
                <Card className="border-gold/30 bg-gold/5 rounded-xl" data-testid="card-tournament-1">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-night">Tournament #1</div>
                      <div className="text-slate">May 2</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gold/30 bg-gold/5 rounded-xl" data-testid="card-tournament-2">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-night">Tournament #2</div>
                      <div className="text-slate">May 23</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-night/80 leading-relaxed">
                Teams are formed the day before each tournament — gender-separated, balanced by coaches based on what they've seen in training. Parent volunteers step in as team coaches for the day. It's competitive, it's fun, and there's no season-long standings drama.
              </p>
              <div className="mt-6 rounded-xl overflow-hidden shadow-lg" data-testid="img-scrimmage">
                <img
                  src={riseScrimmage}
                  alt="Kids in pinnies playing a small-sided scrimmage game"
                  className="w-full h-full object-cover aspect-[16/9]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="divisions" className="py-16 sm:py-20 bg-warmwhite" data-testid="section-divisions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-sm font-medium mb-4 uppercase tracking-wide">
              Age Groups
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide">
              AGE DIVISIONS
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {divisions.map((div, idx) => (
              <Card key={idx} className="bg-white border-slate/15 rounded-xl overflow-hidden shadow-sm" data-testid={`card-division-${idx}`}>
                <div className="h-1.5 bg-crimson" />
                <CardContent className="p-6">
                  <div className="text-xs font-semibold text-crimson uppercase tracking-wide mb-1">{div.division}</div>
                  <h3 className="font-heading font-bold text-xl text-night mb-4">Grades {div.grades}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate" />
                      <span className="text-night/70 text-sm">{div.session}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-slate mt-0.5 flex-shrink-0" />
                      <span className="text-night/70 text-sm">{div.format}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-slate text-sm mt-8 max-w-2xl mx-auto">
            Training days are co-ed. Tournaments are gender-separated with boys and girls brackets. Final division structure is confirmed one week before the program starts based on enrollment.
          </p>
        </div>
      </section>

      <section id="whats-included" className="py-16 sm:py-20 bg-night/[0.03]" data-testid="section-whats-included">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-4 uppercase tracking-wide">
              Everything You Get
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide">
              WHAT'S INCLUDED
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {included.map((item, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6" data-testid={`included-${idx}`}>
                <div className="w-14 h-14 rounded-full bg-purple/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-7 w-7 text-purple" />
                </div>
                <div className="font-heading font-semibold text-night text-sm">{item.label}</div>
                {item.sublabel && <div className="text-slate text-xs mt-1">{item.sublabel}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="py-16 sm:py-20 bg-night" data-testid="section-register">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-4 uppercase tracking-wide">
              Sign Up
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-warmwhite tracking-wide">
              REGISTRATION & PRICING
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-10">
            {pricing.map((tier, idx) => (
              <Card
                key={idx}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  tier.highlighted
                    ? "bg-white border-2 border-gold scale-105 relative"
                    : "bg-white/95 border-slate/20"
                }`}
                data-testid={`card-pricing-${idx}`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gold text-night text-xs font-bold uppercase tracking-wider text-center py-1.5">
                    Best Value
                  </div>
                )}
                <CardContent className={`p-6 text-center ${tier.highlighted ? "pt-10" : ""}`}>
                  <div className="font-heading font-bold text-lg text-night mb-1">{tier.tier}</div>
                  <div className="text-slate text-xs mb-4">{tier.dates}</div>
                  <div className="font-display text-4xl text-crimson mb-4">{tier.price}</div>
                  <Button
                    className={`w-full rounded-lg font-semibold ${
                      tier.highlighted
                        ? "bg-crimson hover:bg-crimson-dark text-warmwhite"
                        : "bg-night hover:bg-night/90 text-warmwhite"
                    }`}
                    asChild
                    data-testid={`button-register-${idx}`}
                  >
                    <a href={registrationUrl}>Register</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p className="text-warmwhite/80 text-sm">
              <span className="font-semibold text-warmwhite">Payment plan available</span> during Early Bird and Regular registration: pay 50% at signup, 50% by April 1. No extra fees. Late registration requires full payment.
            </p>
            <p className="font-heading font-bold text-xl text-warmwhite">
              No tryouts. No experience required. Just show up ready to play.
            </p>
          </div>
        </div>
      </section>

      <section id="why-rise" className="py-16 sm:py-20 bg-warmwhite" data-testid="section-why-rise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-purple/10 border border-purple/30 rounded-full text-purple text-sm font-medium mb-4 uppercase tracking-wide">
              The Difference
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide mb-8">
              WHY RISE IS DIFFERENT
            </h2>
            <div className="space-y-6 text-night/80 text-lg leading-relaxed">
              <p>
                Most spring rec programs put kids on a team, hand them a game schedule, and call it a season. RISE flips that.
              </p>
              <p>
                Your kid gets 12 focused training sessions where they're actually developing skills — dribbling, passing, attacking, defending — with experienced coaches running every session. That's way more touches on the ball than a typical rec season of weekly games.
              </p>
              <p>
                And the two tournaments? They're there so kids can actually apply what they've been learning. Teams are formed fresh for each tournament, so there's no politics, no drama — just soccer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pathway" className="py-16 sm:py-20 bg-warmwhite" data-testid="section-pathway">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-sm font-medium mb-4 uppercase tracking-wide">
              Player Pathway
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide mb-2">
              THE NIPOMO SC PATHWAY
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 max-w-4xl mx-auto">
            {pathway.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative" data-testid={`pathway-${idx}`}>
                <Card className={`w-full rounded-xl overflow-hidden ${
                  step.current
                    ? "border-2 border-gold shadow-lg bg-gold/5"
                    : "border-slate/15 bg-white shadow-sm"
                }`}>
                  {step.current && (
                    <div className="bg-gold text-night text-xs font-bold uppercase tracking-wider text-center py-1.5">
                      You Are Here
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <h3 className={`font-display text-2xl tracking-wide mb-1 ${
                      step.current ? "text-crimson" : "text-night"
                    }`}>{step.name}</h3>
                    <div className="text-sm font-medium text-slate mb-3">{step.label}</div>
                    <p className="text-night/70 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
                {idx < pathway.length - 1 && (
                  <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-slate/50" />
                  </div>
                )}
                {idx < pathway.length - 1 && (
                  <div className="lg:hidden py-2">
                    <ArrowRight className="h-5 w-5 text-slate/50 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-slate text-sm mt-8 max-w-2xl mx-auto">
            RISE is designed to bridge the gap between recreational and competitive soccer. If your player ends up wanting more after 6 weeks, REIGN tryout info will be shared at the end of the program.
          </p>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20 bg-night/[0.03]" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-sm font-medium mb-4 uppercase tracking-wide">
              Questions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide">
              FAQ
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-white border border-slate/15 rounded-xl px-6 overflow-hidden"
                data-testid={`faq-${idx}`}
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-night hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-night/70 pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-night text-center" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
            READY TO RISE?
          </h2>
          <p className="text-warmwhite/80 text-lg mb-8">
            Early bird registration is open now. Lock in the best price and get your player on the field this spring.
          </p>
          <Button
            className="bg-crimson hover:bg-crimson-dark text-warmwhite font-bold text-lg px-10 py-6 rounded-xl shadow-lg"
            asChild
            data-testid="button-final-register"
          >
            <a href={registrationUrl}>
              Register for RISE
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="text-warmwhite/60 text-sm mt-8">
            Questions? Reach out to{" "}
            <a href="mailto:admin@nipomosc.org" className="text-gold underline" data-testid="link-email">
              admin@nipomosc.org
            </a>
          </p>
        </div>
      </section>

      <Footer onNavigate={scrollToSection} />

      {showMobileCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-night/95 backdrop-blur-sm border-t border-slate/20 md:hidden" data-testid="mobile-cta-bar">
          <Button
            className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite font-bold text-base py-5 rounded-xl shadow-md"
            asChild
          >
            <a href={registrationUrl}>
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
