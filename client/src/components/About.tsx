import { Target, Users, Trophy, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for the highest standards in player development, coaching, and sportsmanship.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building lasting bonds between players, families, and our local Nipomo community.",
  },
  {
    icon: Trophy,
    title: "Competition",
    description: "Preparing players for success at every level, from recreational to elite competition.",
  },
  {
    icon: Heart,
    title: "Character",
    description: "Developing not just athletes, but leaders with integrity, respect, and dedication.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-warmwhite dark:bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-purple/10 dark:bg-purple/20 border border-purple/30 rounded-full text-purple text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-night dark:text-warmwhite tracking-wide mb-6">
              BUILDING CHAMPIONS
            </h2>
            <p className="text-slate dark:text-warmwhite/70 mb-4">
              Nipomo Soccer Club was founded in 2025 with a vision to create a premier youth 
              soccer program on California's Central Coast. Nestled at the base of the beautiful 
              coastal mountains, we're building a club that develops complete players and 
              outstanding individuals.
            </p>
            <p className="text-slate dark:text-warmwhite/70 mb-6">
              Our three-tier development pathway — Grow, Rise, and Reign — ensures every player 
              has a clear path forward, from their first touch to elite competition. We believe 
              in the power of sport to transform lives and strengthen communities.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-display text-3xl text-crimson">200+</p>
                <p className="text-slate dark:text-warmwhite/60">Players</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl text-crimson">15</p>
                <p className="text-slate dark:text-warmwhite/60">Teams</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl text-gold">12</p>
                <p className="text-slate dark:text-warmwhite/60">Coaches</p>
              </div>
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

        <div className="mt-16 relative">
          <div className="h-px bg-gradient-to-r from-transparent via-slate/30 to-transparent" />
          <svg
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-full max-w-lg text-slate/20"
            viewBox="0 0 400 40"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 35 L50 25 L100 30 L150 20 L200 25 L250 15 L300 22 L350 18 L400 25"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
