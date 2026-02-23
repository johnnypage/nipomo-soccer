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
  Sparkles,
  GraduationCap,
  Heart,
  Star,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  const whoIsRiseFor = [
    {
      icon: Sparkles,
      title: "Multi-sport athletes",
      description: "who want to stay sharp on the soccer field between seasons",
    },
    {
      icon: Dribbble,
      title: "Rec soccer players",
      description: "who love the game and are ready for more structured skill development",
    },
    {
      icon: Target,
      title: "Club-curious players",
      description: "interested in competitive soccer but not ready to commit to REIGN",
    },
    {
      icon: Heart,
      title: "New families",
      description: "looking for a low-pressure way to try Nipomo Soccer Club",
    },
    {
      icon: Star,
      title: "Any player",
      description: "who wants more touches on the ball and focused coaching",
    },
  ];

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
      format: "Warm-up → Station rotations → Game play",
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
    <div className="min-h-screen bg-[#F5F5F0]">
      <Header onNavigate={scrollToSection} />

      <section className="relative pt-16 min-h-[80vh] flex items-center bg-risegreen-dark" data-testid="section-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.03) 20px,
              rgba(255,255,255,0.03) 40px
            )`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-3xl">
            <Badge className="bg-amber/20 text-amber border-amber/40 mb-6 text-sm" data-testid="badge-development">
              Spring Development League
            </Badge>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide mb-4" data-testid="text-rise-title">
              RISE
            </h1>
            <p className="text-white/85 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl">
              6 weeks of skill-focused training for players who love soccer but aren't ready for year-round club.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 mb-10 text-white/90 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber" />
                <span>April 13 – May 24</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber" />
                <span>Grades 1–8</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber" />
                <span>2x/week training</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber" />
                <span>2 tournaments</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber font-semibold">$85–$120</span>
              </div>
            </div>

            <Button
              className="bg-amber hover:bg-amber-dark text-risegreen-dark font-bold text-lg px-8 py-6 rounded-xl shadow-lg"
              onClick={() => scrollToSection("register")}
              data-testid="button-hero-register"
            >
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section id="what-is-rise" className="py-16 sm:py-20 bg-white" data-testid="section-what-is-rise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-risegreen/10 border border-risegreen/30 rounded-full text-risegreen text-sm font-medium mb-4 uppercase tracking-wide">
                What is RISE?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide mb-6">
                WHAT IS RISE?
              </h2>
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed mb-6">
                RISE is a 6-week spring program built for kids who love soccer but play other sports too. Instead of forming teams and jumping straight into games, RISE focuses on developing individual skills through structured, coach-led training sessions — and then puts those skills to the test in two Saturday tournaments.
              </p>
              <div className="bg-risegreen/5 border-l-4 border-risegreen p-4 rounded-r-lg mb-6">
                <p className="text-[#1A1A1A]/90 italic text-lg">
                  "Think of it as a soccer skills camp with a competitive edge."
                </p>
              </div>
              <p className="text-[#1A1A1A]/80 text-lg leading-relaxed">
                Your kid gets 12 training sessions, works with certified coaches, and walks away a better player — all without a year-round commitment.
              </p>
            </div>
            <div className="bg-gray-200 rounded-xl aspect-[4/3] flex items-center justify-center" data-testid="placeholder-what-is-rise">
              <div className="text-center text-gray-500 p-6">
                <div className="text-sm font-medium uppercase tracking-wide mb-2">Photo Placeholder</div>
                <p className="text-sm">Wide shot of kids in a training session doing station rotation drills on a grass field</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="who-is-rise-for" className="py-16 sm:py-20 bg-risegreen/5" data-testid="section-who-is-rise-for">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-risegreen/10 border border-risegreen/30 rounded-full text-risegreen text-sm font-medium mb-4 uppercase tracking-wide">
              Perfect Fit
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide">
              WHO IS RISE FOR?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {whoIsRiseFor.map((item, idx) => (
              <Card key={idx} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl" data-testid={`card-who-${idx}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-risegreen/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-risegreen" />
                  </div>
                  <h3 className="font-heading font-bold text-[#1A1A1A] mb-2">{item.title}</h3>
                  <p className="text-[#1A1A1A]/60 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-20 bg-white" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-amber/10 border border-amber/30 rounded-full text-amber-dark text-sm font-medium mb-4 uppercase tracking-wide">
              The Program
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-risegreen flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A] uppercase tracking-wide">Training (Weeks 1–6)</h3>
              </div>
              <p className="text-[#1A1A1A]/80 mb-6 leading-relaxed">
                Players train twice per week in co-ed age divisions. Sessions are run by certified coaches with support from teen helpers recruited from our REIGN club teams and local high school players. Every session follows a progressive curriculum focused on individual technical skills — not team tactics.
              </p>
              <div className="space-y-4">
                {phases.map((phase, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-[#F5F5F0] rounded-xl p-4" data-testid={`phase-${idx}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-risegreen/10 flex items-center justify-center">
                      <phase.icon className="h-5 w-5 text-risegreen" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-risegreen uppercase tracking-wide">{phase.weeks}</div>
                      <div className="font-heading font-semibold text-[#1A1A1A]">{phase.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-risegreen-dark" />
                </div>
                <h3 className="font-heading font-bold text-xl text-[#1A1A1A] uppercase tracking-wide">Tournaments (2 Saturdays)</h3>
              </div>
              <div className="space-y-4 mb-6">
                <Card className="border-amber/30 bg-amber/5 rounded-xl" data-testid="card-tournament-1">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-amber-dark" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-[#1A1A1A]">Tournament #1</div>
                      <div className="text-[#1A1A1A]/60">May 2</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-amber/30 bg-amber/5 rounded-xl" data-testid="card-tournament-2">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-amber-dark" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-[#1A1A1A]">Tournament #2</div>
                      <div className="text-[#1A1A1A]/60">May 23</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-[#1A1A1A]/80 leading-relaxed">
                Teams are formed the day before each tournament — gender-separated, balanced by coaches based on what they've seen in training. Parent volunteers step in as team coaches for the day. It's competitive, it's fun, and there's no season-long standings drama.
              </p>
              <div className="mt-6 bg-gray-200 rounded-xl aspect-[16/9] flex items-center justify-center" data-testid="placeholder-scrimmage">
                <div className="text-center text-gray-500 p-6">
                  <div className="text-sm font-medium uppercase tracking-wide mb-2">Photo Placeholder</div>
                  <p className="text-sm">Kids in pinnies playing a small-sided scrimmage game</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="divisions" className="py-16 sm:py-20 bg-[#F5F5F0]" data-testid="section-divisions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-risegreen/10 border border-risegreen/30 rounded-full text-risegreen text-sm font-medium mb-4 uppercase tracking-wide">
              Age Groups
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide">
              AGE DIVISIONS
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {divisions.map((div, idx) => (
              <Card key={idx} className="bg-white border-gray-200 rounded-xl overflow-hidden shadow-sm" data-testid={`card-division-${idx}`}>
                <div className="h-1.5 bg-risegreen" />
                <CardContent className="p-6">
                  <div className="text-xs font-semibold text-risegreen uppercase tracking-wide mb-1">{div.division}</div>
                  <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-4">Grades {div.grades}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#1A1A1A]/40" />
                      <span className="text-[#1A1A1A]/70 text-sm">{div.session}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-[#1A1A1A]/40 mt-0.5 flex-shrink-0" />
                      <span className="text-[#1A1A1A]/70 text-sm">{div.format}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-[#1A1A1A]/60 text-sm mt-8 max-w-2xl mx-auto">
            Training days are co-ed. Tournaments are gender-separated with boys and girls brackets. Final division structure is confirmed one week before the program starts based on enrollment.
          </p>
        </div>
      </section>

      <section id="whats-included" className="py-16 sm:py-20 bg-white" data-testid="section-whats-included">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-amber/10 border border-amber/30 rounded-full text-amber-dark text-sm font-medium mb-4 uppercase tracking-wide">
              Everything You Get
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide">
              WHAT'S INCLUDED
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {included.map((item, idx) => (
              <div key={idx} className="text-center p-4 sm:p-6" data-testid={`included-${idx}`}>
                <div className="w-14 h-14 rounded-full bg-risegreen/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-7 w-7 text-risegreen" />
                </div>
                <div className="font-heading font-semibold text-[#1A1A1A] text-sm">{item.label}</div>
                {item.sublabel && <div className="text-[#1A1A1A]/50 text-xs mt-1">{item.sublabel}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="py-16 sm:py-20 bg-gradient-to-br from-risegreen-dark to-risegreen" data-testid="section-register">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm font-medium mb-4 uppercase tracking-wide">
              Sign Up
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
              REGISTRATION & PRICING
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-10">
            {pricing.map((tier, idx) => (
              <Card
                key={idx}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  tier.highlighted
                    ? "bg-white border-2 border-amber scale-105 relative"
                    : "bg-white/95 border-white/20"
                }`}
                data-testid={`card-pricing-${idx}`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-amber text-risegreen-dark text-xs font-bold uppercase tracking-wider text-center py-1.5">
                    Best Value
                  </div>
                )}
                <CardContent className={`p-6 text-center ${tier.highlighted ? "pt-10" : ""}`}>
                  <div className="font-heading font-bold text-lg text-[#1A1A1A] mb-1">{tier.tier}</div>
                  <div className="text-[#1A1A1A]/50 text-xs mb-4">{tier.dates}</div>
                  <div className="font-display text-4xl text-risegreen-dark mb-4">{tier.price}</div>
                  <Button
                    className={`w-full rounded-lg font-semibold ${
                      tier.highlighted
                        ? "bg-amber hover:bg-amber-dark text-risegreen-dark"
                        : "bg-risegreen hover:bg-risegreen-dark text-white"
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
            <p className="text-white/80 text-sm">
              <span className="font-semibold text-white">Payment plan available</span> during Early Bird and Regular registration: pay 50% at signup, 50% by April 1. No extra fees. Late registration requires full payment.
            </p>
            <p className="font-heading font-bold text-xl text-white">
              No tryouts. No experience required. Just show up ready to play.
            </p>
          </div>
        </div>
      </section>

      <section id="why-rise" className="py-16 sm:py-20 bg-risegreen/5" data-testid="section-why-rise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-risegreen/10 border border-risegreen/30 rounded-full text-risegreen text-sm font-medium mb-4 uppercase tracking-wide">
              The Difference
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide mb-8">
              WHY RISE IS DIFFERENT
            </h2>
            <div className="space-y-6 text-[#1A1A1A]/80 text-lg leading-relaxed">
              <p>
                Most spring rec programs put kids on a team, hand them a game schedule, and call it a season. RISE flips that.
              </p>
              <p>
                Your kid gets 12 focused training sessions where they're actually developing skills — dribbling, passing, attacking, defending — with certified coaches running every session. That's way more touches on the ball than a typical rec season of weekly games.
              </p>
              <p>
                And the two tournaments? They're there so kids can actually apply what they've been learning. Teams are formed fresh for each tournament, so there's no politics, no drama — just soccer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pathway" className="py-16 sm:py-20 bg-white" data-testid="section-pathway">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-purple/10 border border-purple/30 rounded-full text-purple text-sm font-medium mb-4 uppercase tracking-wide">
              Player Pathway
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide mb-2">
              THE NIPOMO SC PATHWAY
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 max-w-4xl mx-auto">
            {pathway.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative" data-testid={`pathway-${idx}`}>
                <Card className={`w-full rounded-xl overflow-hidden ${
                  step.current
                    ? "border-2 border-amber shadow-lg bg-amber/5"
                    : "border-gray-200 bg-white shadow-sm"
                }`}>
                  {step.current && (
                    <div className="bg-amber text-risegreen-dark text-xs font-bold uppercase tracking-wider text-center py-1.5">
                      You Are Here
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <h3 className={`font-display text-2xl tracking-wide mb-1 ${
                      step.current ? "text-risegreen-dark" : "text-[#1A1A1A]"
                    }`}>{step.name}</h3>
                    <div className="text-sm font-medium text-[#1A1A1A]/50 mb-3">{step.label}</div>
                    <p className="text-[#1A1A1A]/70 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
                {idx < pathway.length - 1 && (
                  <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-[#1A1A1A]/30" />
                  </div>
                )}
                {idx < pathway.length - 1 && (
                  <div className="lg:hidden py-2">
                    <ArrowRight className="h-5 w-5 text-[#1A1A1A]/30 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-[#1A1A1A]/60 text-sm mt-8 max-w-2xl mx-auto">
            RISE is designed to bridge the gap between recreational and competitive soccer. If your player ends up wanting more after 6 weeks, REIGN tryout info will be shared at the end of the program.
          </p>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20 bg-[#F5F5F0]" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-risegreen/10 border border-risegreen/30 rounded-full text-risegreen text-sm font-medium mb-4 uppercase tracking-wide">
              Questions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A1A] tracking-wide">
              FAQ
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-white border border-gray-200 rounded-xl px-6 overflow-hidden"
                data-testid={`faq-${idx}`}
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-[#1A1A1A] hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#1A1A1A]/70 pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-risegreen-dark text-center" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide mb-4">
            READY TO RISE?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Early bird registration is open now. Lock in the best price and get your player on the field this spring.
          </p>
          <Button
            className="bg-amber hover:bg-amber-dark text-risegreen-dark font-bold text-lg px-10 py-6 rounded-xl shadow-lg"
            asChild
            data-testid="button-final-register"
          >
            <a href={registrationUrl}>
              Register for RISE
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <p className="text-white/60 text-sm mt-8">
            Questions? Reach out to{" "}
            <a href="mailto:admin@nipomosc.org" className="text-amber underline" data-testid="link-email">
              admin@nipomosc.org
            </a>
          </p>
        </div>
      </section>

      <Footer onNavigate={scrollToSection} />

      {showMobileCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-200 md:hidden" data-testid="mobile-cta-bar">
          <Button
            className="w-full bg-amber hover:bg-amber-dark text-risegreen-dark font-bold text-base py-5 rounded-xl shadow-md"
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
