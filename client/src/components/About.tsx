import { Target, Users, Trophy, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Accessible",
    description: "High quality year-round player development that's affordable to every family in Nipomo.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building real development opportunities for local kids and keeping families engaged in the sport they love.",
  },
  {
    icon: Trophy,
    title: "Complete Pathway",
    description: "A connected journey from first steps to advanced competition — a program that grows with every child.",
  },
  {
    icon: Heart,
    title: "Player Focused",
    description: "Teams built intentionally so every player is developed with care, fostering a lifelong love for the game.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-warmwhite dark:bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-purple/10 dark:bg-purple/20 border border-purple/30 rounded-full text-purple text-sm font-medium mb-4">
              Community First
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-night dark:text-warmwhite tracking-wide mb-6">
              OUR MISSION
            </h2>
            <p className="text-slate dark:text-warmwhite/70 mb-4 text-lg font-medium">
              To make high quality year-round player development accessible and affordable to every 
              family in Nipomo while fostering a strong community culture and developing the next 
              generation of proud Nipomo athletes.
            </p>
            <p className="text-slate dark:text-warmwhite/70 mb-6">
              Nipomo is filled with talented and passionate young athletes who love soccer. For years, 
              many local families struggled to find a program that is high quality, affordable, and close 
              to home. Nipomo Soccer Club was created to solve that. We believe that great soccer can be 
              both accessible and development focused.
            </p>
            
            <div className="bg-crimson/10 dark:bg-crimson/20 rounded-md p-4 border border-crimson/20">
              <p className="text-slate dark:text-warmwhite/80 text-sm italic">
                "We are creating a soccer culture that makes Nipomo proud."
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="p-6 bg-card dark:bg-night/50 rounded-md border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center mb-4">
                  <value.icon className="h-5 w-5 text-crimson" />
                </div>
                <h3 className="font-heading font-semibold text-night dark:text-warmwhite mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate dark:text-warmwhite/60">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
