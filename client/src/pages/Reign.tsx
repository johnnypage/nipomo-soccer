import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Trophy, Users, Target, DollarSign, Award, ArrowRight, Calendar, MapPin, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import reignLogo from "@assets/NSC_Reign_1764979848771.png";
import reignHero from "@assets/generated_images/reign_program_elite_level.png";

export default function Reign() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const girlsTeams = [
    { name: "Girls", birthRange: "Born between Aug 2017 and Jul 2018" },
    { name: "Girls", birthRange: "Born between Aug 2016 and Jul 2017" },
    { name: "Girls", birthRange: "Born between Aug 2015 and Jul 2016" },
    { name: "Girls", birthRange: "Born between Aug 2014 and Jul 2015" },
  ];

  const boysTeams = [
    { name: "Boys", birthRange: "Born between Aug 2017 and Jul 2018" },
    { name: "Boys", birthRange: "Born between Aug 2015 and Jul 2016" },
    { name: "Boys", birthRange: "Born between Aug 2013 and Jul 2014" },
    { name: "Boys", birthRange: "Born between Aug 2010 and Jul 2011" },
  ];

  const values = [
    {
      icon: Award,
      title: "Quality Coaching",
      description: "Licensed and experienced coaches who volunteer their time to develop local talent. Every training session is planned with purpose.",
    },
    {
      icon: DollarSign,
      title: "Affordability",
      description: "Our goal is to keep club participation under $300 per year through sponsorships, donations, and fundraising.",
    },
    {
      icon: Target,
      title: "Earned Opportunity",
      description: "Players are selected based on ability, attitude, and effort. Talent matters, but character and commitment matter just as much.",
    },
  ];

  const trainingFeatures = [
    "Multiple weekly practices",
    "Preseason preparation",
    "Year-round development",
    "League play competition",
    "Tournament participation",
    "Individual skill sessions",
  ];

  return (
    <div className="min-h-screen bg-night">
      <Header onNavigate={scrollToSection} />
      
      <section className="relative pt-[140px] md:pt-28 min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={reignHero} 
            alt="Reign competitive soccer" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
          <div className="absolute inset-0 bg-night/40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-6" data-testid="badge-competitive">
              Competitive Program
            </Badge>
            
            <div className="flex items-center gap-4 mb-6">
              <img src={reignLogo} alt="Reign Logo" className="h-20 w-auto" />
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-warmwhite tracking-wide">
                REIGN
              </h1>
            </div>
            
            <p className="text-warmwhite/80 text-lg sm:text-xl mb-8 leading-relaxed">
              The competitive program of Nipomo Soccer. A complete pathway for skilled 
              and committed young athletes to pursue advanced soccer without leaving town 
              or taking on high financial burdens.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <ContactFormDialog 
                trigger={
                  <Button 
                    className="bg-crimson hover:bg-crimson-dark text-warmwhite"
                    data-testid="button-hero-cta"
                  >
                    Join Interest List
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
              <Button 
                variant="outline" 
                className="border-warmwhite/30 text-warmwhite bg-warmwhite/10 backdrop-blur-sm"
                onClick={() => scrollToSection("teams")}
                data-testid="button-view-teams"
              >
                View Teams
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="why-reign" className="py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-purple/20 border border-purple/40 rounded-full text-purple text-sm font-medium mb-4">
              Our Philosophy
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
              WHY REIGN
            </h2>
            <p className="text-warmwhite/70 max-w-3xl mx-auto">
              We believe that players should be able to reach their potential in their own community, 
              surrounded by teammates and families who share their pride in where they are from.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <Card key={idx} className="bg-slate/10 border-slate/20">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-warmwhite mb-3">
                    {value.title}
                  </h3>
                  <p className="text-warmwhite/70">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="who-its-for" className="py-20 bg-slate/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-crimson/20 border border-crimson/40 rounded-full text-crimson text-sm font-medium mb-4">
                Who It's For
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-6">
                IS REIGN RIGHT FOR YOU?
              </h2>
              <p className="text-warmwhite/80 text-lg mb-6 leading-relaxed">
                Reign is designed for players who are ready for the extended commitment and competition 
                of a year-round environment. Players earn their spot through performance in Roots and Rise 
                or through open tryouts.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-warmwhite/80">Skilled players seeking advanced development</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-warmwhite/80">Committed families ready for year-round soccer</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-warmwhite/80">Athletes who demonstrate strong character and work ethic</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-warmwhite/80">Players from U8 through high school age groups</p>
                </div>
              </div>
            </div>
            
            <div className="bg-night rounded-md p-8 border border-slate/20">
              <h3 className="font-heading font-semibold text-xl text-warmwhite mb-4">
                What We Look For
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-warmwhite font-medium">Ability</p>
                    <p className="text-warmwhite/60 text-sm">Technical skills and game understanding</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-purple" />
                  </div>
                  <div>
                    <p className="text-warmwhite font-medium">Attitude</p>
                    <p className="text-warmwhite/60 text-sm">Coachability and team-first mindset</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-crimson" />
                  </div>
                  <div>
                    <p className="text-warmwhite font-medium">Effort</p>
                    <p className="text-warmwhite/60 text-sm">Consistent work ethic and dedication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="teams" className="py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-gold text-sm font-medium mb-4">
              Current Season
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
              ACTIVE TEAMS
            </h2>
            <p className="text-warmwhite/70 max-w-2xl mx-auto">
              Reign offers competitive teams beginning at U8 and continuing through high school age groups. 
              Additional teams are forming as more players commit to the program.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-lg text-warmwhite mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500" />
                Girls Teams
              </h3>
              <div className="space-y-3">
                {girlsTeams.map((team, idx) => (
                  <Card key={idx} className="bg-slate/10 border-slate/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-heading font-semibold text-warmwhite">{team.name}</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/40">
                          Active
                        </Badge>
                      </div>
                      <p className="text-warmwhite/60 text-sm">{team.birthRange}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg text-warmwhite mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Boys Teams
              </h3>
              <div className="space-y-3">
                {boysTeams.map((team, idx) => (
                  <Card key={idx} className="bg-slate/10 border-slate/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-heading font-semibold text-warmwhite">{team.name}</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/40">
                          Active
                        </Badge>
                      </div>
                      <p className="text-warmwhite/60 text-sm">{team.birthRange}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-warmwhite/60 text-sm">
              More teams forming as players commit to the program
            </p>
          </div>
        </div>
      </section>

      <section id="training" className="py-20 bg-slate/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-purple/20 border border-purple/40 rounded-full text-purple text-sm font-medium mb-4">
                Development
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-6">
                TRAINING OVERVIEW
              </h2>
              <p className="text-warmwhite/80 text-lg mb-8 leading-relaxed">
                Reign delivers structured year-round development that focuses on strong fundamentals, 
                tactical understanding, mental toughness, and character on and off the field.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {trainingFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                    <span className="text-warmwhite/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-night rounded-md p-8 border border-slate/20">
              <h3 className="font-heading font-semibold text-xl text-warmwhite mb-6">
                Season Structure
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-crimson" />
                  </div>
                  <div>
                    <p className="text-warmwhite font-medium">Year-Round Training</p>
                    <p className="text-warmwhite/60 text-sm">Consistent development throughout the year with structured practice schedules</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-warmwhite font-medium">League Play</p>
                    <p className="text-warmwhite/60 text-sm">Competitive league matches providing valuable game experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-purple" />
                  </div>
                  <div>
                    <p className="text-warmwhite font-medium">Tournaments</p>
                    <p className="text-warmwhite/60 text-sm">Tournament participation for increasingly challenging competition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="scholarships" className="py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-gold text-sm font-medium mb-4">
              Accessibility
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
              SCHOLARSHIPS & SUPPORT
            </h2>
            <p className="text-warmwhite/70 max-w-3xl mx-auto">
              Traditional club soccer often costs families thousands of dollars per year. 
              We are committed to making Reign accessible for families who believe in the work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate/10 border-slate/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-warmwhite">Under $300/Year</h3>
                    <p className="text-warmwhite/60 text-sm">Our target annual cost</p>
                  </div>
                </div>
                <p className="text-warmwhite/70">
                  Through sponsorships, donations, and fundraising, we keep participation costs 
                  dramatically lower than traditional club soccer programs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate/10 border-slate/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-warmwhite">Financial Aid</h3>
                    <p className="text-warmwhite/60 text-sm">No one priced out</p>
                  </div>
                </div>
                <p className="text-warmwhite/70">
                  Families should never be priced out of development. We work with families 
                  who need assistance to ensure every committed player can participate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="pathway" className="py-20 bg-slate/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-purple/20 border border-purple/40 rounded-full text-purple text-sm font-medium mb-4">
              Player Development
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
              THE PATHWAY
            </h2>
            <p className="text-warmwhite/70 max-w-2xl mx-auto">
              A clear pathway from recreational fun to advanced play, all within Nipomo.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="bg-night rounded-md p-6 border border-slate/20 text-center min-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-400 font-display text-2xl">1</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-warmwhite mb-2">Roots</h3>
              <p className="text-warmwhite/60 text-sm">Foundational learning</p>
              <p className="text-warmwhite/40 text-xs mt-1">U4 and up</p>
            </div>

            <ArrowRight className="h-8 w-8 text-warmwhite/40 rotate-90 md:rotate-0 flex-shrink-0" />

            <div className="bg-night rounded-md p-6 border border-slate/20 text-center min-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-400 font-display text-2xl">2</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-warmwhite mb-2">Rise</h3>
              <p className="text-warmwhite/60 text-sm">Skill advancement</p>
              <p className="text-warmwhite/40 text-xs mt-1">U8 and up</p>
            </div>

            <ArrowRight className="h-8 w-8 text-warmwhite/40 rotate-90 md:rotate-0 flex-shrink-0" />

            <div className="bg-gold/10 rounded-md p-6 border border-gold/30 text-center min-w-[200px]">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-gold mb-2">Reign</h3>
              <p className="text-warmwhite/60 text-sm">Competitive excellence</p>
              <p className="text-warmwhite/40 text-xs mt-1">U8 through HS</p>
            </div>
          </div>

          <p className="text-center text-warmwhite/60 mt-8 max-w-xl mx-auto">
            Selection for Reign is earned through performance in Roots and Rise, 
            or through open tryouts for new players.
          </p>
        </div>
      </section>

      <section id="join" className="py-20 bg-night">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-crimson/20 to-gold/10 rounded-md p-8 md:p-12 border border-crimson/30 text-center">
            <span className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-gold text-sm font-medium mb-6">
              Open Evaluations
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
              JOIN THE REIGN
            </h2>
            <p className="text-warmwhite/80 text-lg mb-8 max-w-2xl mx-auto">
              We regularly offer open evaluations for new players. Join our interest list to receive 
              updates about team openings, tryout dates, and program news.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <ContactFormDialog 
                trigger={
                  <Button 
                    className="bg-crimson hover:bg-crimson-dark text-warmwhite"
                    data-testid="button-join-interest-list"
                  >
                    Join Interest List
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="border-warmwhite/30 text-warmwhite"
                  data-testid="button-back-home"
                >
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-warmwhite/10">
              <p className="text-warmwhite/60 text-sm mb-2">
                Reign players represent Nipomo.
              </p>
              <p className="text-warmwhite/80 font-medium">
                They work hard for their teammates. They show up with purpose. They compete with heart.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
