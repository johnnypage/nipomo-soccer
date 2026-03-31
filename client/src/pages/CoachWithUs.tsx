import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  BookOpen,
  Users,
  ArrowUpCircle,
  ArrowRight,
  CheckCircle,
  Diamond,
  Calendar,
  Heart,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import coachHuddle from "@assets/coach_huddle.png";
import coachHighfive from "@assets/coach_highfive.png";
import coachCones from "@assets/coach_cones.png";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function CoachWithUs() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [bgCheckConsent, setBgCheckConsent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    playingExperience: "",
    coachingExperience: "",
    certifications: "",
    hasChildren: "",
    childrenAges: "",
    whyCoach: "",
    additionalNotes: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleProgram = (program: string) => {
    setSelectedPrograms(prev =>
      prev.includes(program) ? prev.filter(p => p !== program) : [...prev, program]
    );
  };

  const toggleAgeGroup = (group: string) => {
    setSelectedAgeGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.playingExperience || !formData.coachingExperience) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (selectedPrograms.length === 0) {
      toast({ title: "Missing fields", description: "Please select at least one program.", variant: "destructive" });
      return;
    }
    if (selectedAgeGroups.length === 0) {
      toast({ title: "Missing fields", description: "Please select at least one age group.", variant: "destructive" });
      return;
    }
    if (!bgCheckConsent) {
      toast({ title: "Required", description: "Please confirm you are willing to complete a background check and all required training.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/coach-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          programs: selectedPrograms.join(", "),
          ageGroups: selectedAgeGroups.join(", "),
          backgroundCheckConsent: bgCheckConsent,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit");

      setSubmitted(true);
      const successEl = document.getElementById("form-success");
      if (successEl) successEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Star, title: "Your kid plays free", description: "Registration fees are waived for your children in the program you coach. Any program, any season.", color: "text-gold", bg: "bg-gold/15" },
    { icon: BookOpen, title: "Paid coaching licenses", description: "We cover US Soccer Grassroots courses and D License certification through Cal South.", color: "text-crimson", bg: "bg-crimson/15" },
    { icon: Users, title: "Training and clinics", description: "Preseason clinics, session plans, and curriculum all provided.", color: "text-purple", bg: "bg-purple/15" },
    { icon: ArrowUpCircle, title: "Equipment covered", description: "Balls, cones, pinnies, goals. All provided by the club.", color: "text-warmwhite", bg: "bg-slate/15" },
  ];

  const certifications = [
    { icon: CheckCircle, title: "Grassroots courses (required)", subtitle: "We pay for them", description: "Online training covering age-appropriate coaching for your division. 3 to 5 hours total depending on the age group. This is the only certification required for ROOTS and RISE coaches.", color: "text-gold", bg: "bg-gold/10" },
    { icon: Diamond, title: "D License", subtitle: "Required for REIGN, we pay for it", description: "Required for REIGN club coaches. The first nationally recognized US Soccer coaching credential. Nine weeks, mix of virtual sessions and in-person weekends. For ROOTS and RISE coaches who want to go further, we cover the cost for you too.", color: "text-crimson", bg: "bg-crimson/10" },
    { icon: Calendar, title: "Preseason clinics", subtitle: "Every season", description: "Before every season, we run in-person training for all coaches. Curriculum walkthrough, session plans, expectations.", color: "text-purple", bg: "bg-purple/10" },
    { icon: Heart, title: "Ongoing support", subtitle: "Year-round", description: "Our staff and board are available to coaches throughout the season. When we support our coaches, our coaches support our players. Making sure you feel appreciated, supported, and have a great experience is a huge point of emphasis for us.", color: "text-gold", bg: "bg-gold/10" },
  ];

  const faqs = [
    { q: "Do I need soccer experience?", a: "No. Plenty of our coaches started with none. We provide session plans, training, and pair you with experienced coaches. If you can manage a group of kids and care about their experience, you're qualified." },
    { q: "How much time does it take?", a: "Depends on the program and age group. In ROOTS: 6U practices once a week, 8U practices twice a week, and 10U and up normally practices two to three times a week, plus Saturday games. RISE coaches are at two sessions per week. REIGN is at the coach's discretion, usually two to four practices per week depending on the time of year, plus league games and tournaments." },
    { q: "What if I can't make every session?", a: "Life happens, we get it. We ask that you're reliable for the majority of the season. If you know you'll miss a week, just let your team know in advance. Assistant coaches and co-coaches can cover." },
    { q: "Does my kid really play free?", a: "Yes. If you coach, your children's registration fees are waived for the program you're coaching in." },
    { q: "What about background checks?", a: "All coaches complete a background check, SafeSport training, and concussion awareness certification before stepping on the field. We walk you through the whole process." },
    { q: "I played in high school and want to help. Where do I fit?", a: "Everywhere. You can assistant coach at any level, shadow in RISE, or lead a ROOTS team. If you have competitive experience, talk to us about REIGN. A lot of our coaching pipeline comes from local high school players." },
  ];

  const programs = ["ROOTS", "RISE", "REIGN"];
  const ageGroups = ["U4-U6", "U8", "U10", "U12", "U14+"];

  return (
    <div className="min-h-screen bg-warmwhite">
      <Header onNavigate={scrollToSection} />

      {/* Hero */}
      <section className="relative pt-16 min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={coachHuddle} alt="Coach kneeling with young players in a team huddle" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
          <div className="absolute inset-0 bg-night/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-6">Get Involved</Badge>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-warmwhite tracking-wide mb-6">
              COACH WITH US
            </h1>
            <p className="text-warmwhite/90 text-lg sm:text-xl mb-4 leading-relaxed">
              Nipomo Soccer Club is built and run by coaches from this community. Just like our players, our coaches are homegrown. Parents, high school athletes, and neighbors who show up for Nipomo kids.
            </p>
            <p className="text-warmwhite/65 text-base sm:text-lg mb-8 leading-relaxed">
              No soccer experience required. We train you, we support you, and your kid plays free.
            </p>
            <Button
              className="bg-crimson hover:bg-crimson-dark text-warmwhite"
              onClick={() => scrollToSection("apply")}
            >
              Apply to Coach
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 sm:py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-12">
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-4">Coach benefits</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-warmwhite tracking-wide">WHAT YOU GET</h2>
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, idx) => (
              <RevealSection key={idx} delay={idx * 100}>
                <Card className="bg-slate/10 border-slate/20 text-center hover:translate-y-[-4px] transition-transform duration-200 h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full ${benefit.bg} flex items-center justify-center mx-auto mb-4`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                    </div>
                    <h3 className="font-heading font-bold text-warmwhite mb-2">{benefit.title}</h3>
                    <p className="text-warmwhite/60 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>

          <RevealSection delay={400}>
            <div className="max-w-2xl mx-auto mt-10 bg-gradient-to-br from-gold/10 to-crimson/5 border border-gold/25 rounded-xl p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold to-crimson" />
              <h3 className="font-display text-xl sm:text-2xl text-warmwhite tracking-wide mb-3">THE BEST PART OF COACHING</h3>
              <p className="text-warmwhite/80 text-base sm:text-lg leading-relaxed">
                It's knowing every kid on your team by name. It's the parents who become your friends because you see them twice a week. If you're looking for a way to get to know your kids' peers, meet more families, and be more connected to this community, coaching is one of the best ways to do it.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 sm:py-20 bg-warmwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <RevealSection>
                <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-sm font-medium mb-4 uppercase tracking-wide">
                  Our philosophy
                </span>
              </RevealSection>
              <RevealSection delay={100}>
                <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide mb-6">
                  WHY WE CARE SO MUCH ABOUT COACHING
                </h2>
              </RevealSection>
              <RevealSection delay={200}>
                <p className="text-night/80 text-lg leading-relaxed mb-5">
                  For a lot of kids, the soccer field is the one place where an adult looks them in the eye, holds them to a standard, and tells them they did a good job. Not school. Not always home. The field.
                </p>
                <p className="text-night/80 text-lg leading-relaxed mb-5">
                  A parent volunteer coaching U6 has the same shot at shaping a kid's confidence as a licensed coach running a competitive U12 team. Different setting, same opportunity.
                </p>
                <p className="text-night/80 text-lg leading-relaxed mb-6">
                  That's why we don't just hand you a whistle and point you at a field. We train our coaches, pair them with experienced people, and pay for their certifications. And we're honest about what this role actually is. It's not about winning games. It's about the kid standing in front of you.
                </p>
              </RevealSection>
              <RevealSection delay={300}>
                <div className="bg-night rounded-xl p-6 border-l-4 border-gold">
                  <p className="font-heading font-semibold text-warmwhite text-lg leading-relaxed">
                    You don't need soccer experience. You need to care about kids and show up when you say you will.
                  </p>
                  <p className="text-warmwhite/60 mt-2">We'll teach you the soccer part.</p>
                </div>
              </RevealSection>
            </div>
            <RevealSection delay={200}>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img src={coachHighfive} alt="Parent coach high-fiving a young player" className="w-full h-full object-cover aspect-[4/3]" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* How Coaches Grow */}
      <section className="py-16 sm:py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-12">
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-4">Coach development</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-warmwhite tracking-wide mb-4">HOW COACHES GROW HERE</h2>
            <p className="text-warmwhite/70 max-w-2xl mx-auto">
              We have a player pathway (ROOTS, RISE, REIGN) and we have one for coaches too. Most of our coaches don't walk in with a background in soccer. There are real ways in, and real ways to grow.
            </p>
          </RevealSection>

          <div className="grid lg:grid-cols-[5fr_4fr] gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              {[
                { label: "Entry point 1", color: "crimson", title: "Start with young players in ROOTS", text: "At U8 and below, the game is simple. Keep kids moving, keep them smiling, make them want to come back. If you can manage a group of 6-year-olds and stay patient, you can coach this age group. We give you session plans and connect you with coaches who've done it before." },
                { label: "Entry point 2", color: "gold", title: "Shadow experienced coaches in RISE", text: "RISE runs structured skill sessions twice a week. If you want to learn what a well-run practice looks like before you lead one, this is the place. You work alongside our experienced coaches, help run stations, and pick up how things are done. Nobody throws you into the deep end." },
                { label: "Entry point 3", color: "purple", title: "Jump in as an assistant", text: "At any level, you can start by assisting. Watch how a head coach manages a session. Help run a drill. Figure out the rhythm before it's your group." },
              ].map((entry, idx) => (
                <RevealSection key={idx} delay={idx * 100}>
                  <Card className="bg-slate/10 border-slate/20 overflow-hidden hover:border-slate/35 hover:translate-y-[-2px] transition-all duration-200">
                    <div className={`h-1 bg-${entry.color}`} />
                    <CardContent className="p-5">
                      <div className={`text-${entry.color} text-xs font-semibold uppercase tracking-wide mb-1 font-heading`}>{entry.label}</div>
                      <h3 className="font-heading font-bold text-warmwhite mb-2">{entry.title}</h3>
                      <p className="text-warmwhite/70 text-sm leading-relaxed">{entry.text}</p>
                    </CardContent>
                  </Card>
                </RevealSection>
              ))}
            </div>

            <div className="space-y-4">
              <RevealSection delay={200}>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img src={coachCones} alt="Young coach setting up cones while players watch" className="w-full h-full object-cover aspect-[4/3]" />
                </div>
              </RevealSection>
              <RevealSection delay={300}>
                <Card className="bg-gold/5 border-gold/15">
                  <CardContent className="p-5">
                    <p className="text-warmwhite/75 text-sm leading-relaxed">
                      <span className="font-semibold text-warmwhite">Once you're comfortable, there's room to take on more.</span> Coach older ROOTS divisions where positioning and team shape start to matter. Run your own RISE sessions. If you have competitive experience, coach in REIGN. We built this intentionally. RISE in particular is designed as a place where newer coaches can shadow and get real reps with real support.
                    </p>
                  </CardContent>
                </Card>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* Training / Certification */}
      <section className="py-16 sm:py-20 bg-warmwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-sm font-medium mb-4 uppercase tracking-wide">
              Your growth
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide">WE HANDLE YOUR TRAINING</h2>
          </RevealSection>
          <RevealSection delay={100}>
            <p className="text-night/70 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
              All ROOTS and RISE coaches complete Grassroots training through US Soccer, which is 3 to 5 hours of online coursework depending on the age division you coach. We cover the cost. That's all that's required to get on the field.
            </p>
          </RevealSection>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, idx) => (
              <RevealSection key={idx} delay={idx * 100}>
                <Card className="bg-white border-slate/12 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-200 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${cert.bg} flex items-center justify-center flex-shrink-0`}>
                        <cert.icon className={`h-5 w-5 ${cert.color}`} />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-night">{cert.title}</h3>
                        <div className="text-slate text-xs">{cert.subtitle}</div>
                      </div>
                    </div>
                    <p className="text-night/70 text-sm leading-relaxed">{cert.description}</p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 sm:py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-12">
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-4">Apply</Badge>
            <h2 className="font-display text-3xl sm:text-4xl text-warmwhite tracking-wide mb-4">COACHING APPLICATION</h2>
            <p className="text-warmwhite/70 max-w-xl mx-auto">
              If you've coached before, great. If you haven't, also great. Fill out the form and we'll set up a conversation.
            </p>
          </RevealSection>

          <div className="max-w-2xl mx-auto bg-slate/[0.08] rounded-xl p-6 sm:p-8 border border-slate/20">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Full name</label>
                    <Input placeholder="Your full name" value={formData.name} onChange={e => handleChange("name", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35" required />
                  </div>
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Email address</label>
                    <Input type="email" placeholder="you@email.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35" required />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Phone number</label>
                    <Input type="tel" placeholder="(555) 555-5555" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35" required />
                  </div>
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">City / Town</label>
                    <Input placeholder="Nipomo, Arroyo Grande, etc." value={formData.city} onChange={e => handleChange("city", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Playing experience</label>
                    <Select value={formData.playingExperience} onValueChange={v => handleChange("playingExperience", v)}>
                      <SelectTrigger className="bg-slate/20 border-slate/30 text-warmwhite"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Recreational">Recreational</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Semi-Pro or Higher">Semi-Pro or Higher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Coaching experience</label>
                    <Select value={formData.coachingExperience} onValueChange={v => handleChange("coachingExperience", v)}>
                      <SelectTrigger className="bg-slate/20 border-slate/30 text-warmwhite"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None, but I'm ready to learn">None, but I'm ready to learn</SelectItem>
                        <SelectItem value="Parent volunteer (1-2 seasons)">Parent volunteer (1-2 seasons)</SelectItem>
                        <SelectItem value="1-3 years organized coaching">1-3 years organized coaching</SelectItem>
                        <SelectItem value="3+ years organized coaching">3+ years organized coaching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Current certifications (optional)</label>
                  <Input placeholder="e.g., USSF Grassroots, D License, AYSO badges" value={formData.certifications} onChange={e => handleChange("certifications", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35" />
                </div>

                <div>
                  <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Which program(s) are you interested in?</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {programs.map(p => (
                      <button key={p} type="button" onClick={() => toggleProgram(p)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedPrograms.includes(p) ? "bg-gold/20 border-gold/50 text-gold border" : "bg-slate/15 border-slate/25 text-warmwhite/80 border hover:border-gold/30"}`}
                      >{p}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Age groups you'd like to coach</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ageGroups.map(g => (
                      <button key={g} type="button" onClick={() => toggleAgeGroup(g)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedAgeGroups.includes(g) ? "bg-gold/20 border-gold/50 text-gold border" : "bg-slate/15 border-slate/25 text-warmwhite/80 border hover:border-gold/30"}`}
                      >{g}</button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Children in Nipomo SC?</label>
                    <Select value={formData.hasChildren} onValueChange={v => handleChange("hasChildren", v)}>
                      <SelectTrigger className="bg-slate/20 border-slate/30 text-warmwhite"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">If yes, their age(s)</label>
                    <Input placeholder="e.g., 7 and 10" value={formData.childrenAges} onChange={e => handleChange("childrenAges", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35" />
                  </div>
                </div>

                <div>
                  <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Why do you want to coach with Nipomo SC?</label>
                  <Textarea placeholder="Tell us a little about why you're interested..." value={formData.whyCoach} onChange={e => handleChange("whyCoach", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35 min-h-[120px]" />
                </div>

                <div>
                  <label className="block font-heading text-xs font-semibold text-warmwhite/70 uppercase tracking-wide mb-1">Anything else we should know? (optional)</label>
                  <Textarea placeholder="Scheduling constraints, relevant experience, questions..." value={formData.additionalNotes} onChange={e => handleChange("additionalNotes", e.target.value)} className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/35 min-h-[80px]" />
                </div>

                <div className="flex items-start gap-3 mt-2 p-3 bg-crimson/[0.08] border border-crimson/25 rounded-lg">
                  <Checkbox checked={bgCheckConsent} onCheckedChange={(v) => setBgCheckConsent(v === true)} className="mt-0.5 border-warmwhite/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold" />
                  <label className="text-warmwhite/80 text-sm cursor-pointer" onClick={() => setBgCheckConsent(!bgCheckConsent)}>
                    I am willing to complete a background check and all required training (required)
                  </label>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite font-bold text-base py-5 rounded-xl mt-4">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>

                <p className="text-center text-warmwhite/50 text-xs mt-2">We'll review your application and reach out within a few days.</p>
              </form>
            ) : (
              <div id="form-success" className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-heading font-bold text-xl text-warmwhite mb-3">Thank you, your application has been submitted.</h3>
                <p className="text-warmwhite/60">We'll be in touch soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-night/[0.03]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-4 uppercase tracking-wide">
              Questions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-night tracking-wide">FAQ</h2>
          </RevealSection>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <RevealSection key={idx} delay={Math.min(idx * 50, 200)}>
                <AccordionItem value={`faq-${idx}`} className="bg-white border border-slate/15 rounded-xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-left font-heading font-semibold text-night hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-night/70 pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </RevealSection>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-night border-t border-slate/15 text-center">
        <p className="text-warmwhite/60 text-sm">
          Questions? Email{" "}
          <a href="mailto:admin@nipomosc.org" className="text-gold underline hover:text-warmwhite transition-colors">
            admin@nipomosc.org
          </a>
          . Happy to talk before you apply.
        </p>
      </section>

      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
