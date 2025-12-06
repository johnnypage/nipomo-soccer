import ProgramCard from "./ProgramCard";
import rootsImage from "@assets/generated_images/grow_program_youth_training.png";
import riseImage from "@assets/generated_images/rise_program_competitive_training.png";
import reignImage from "@assets/generated_images/reign_program_elite_level.png";
import rootsLogo from "@assets/NSC_Roots_1764979848772.png";
import riseLogo from "@assets/NSC_Rise_1764979848772.png";
import reignLogo from "@assets/NSC_Reign_1764979848771.png";

interface ProgramsProps {
  onProgramSelect?: (program: string) => void;
}

export default function Programs({ onProgramSelect }: ProgramsProps) {
  // todo: remove mock functionality - these should come from CMS/API
  const programs = [
    {
      type: "roots" as const,
      title: "Roots",
      ageRange: "Ages 5-8",
      description: "Where young players discover the joy of soccer through fun, skill-building activities. Our foundation program focuses on creating a love for the game.",
      features: [
        "Fundamental ball skills",
        "Coordination & movement",
        "Team play introduction",
        "2x weekly sessions",
      ],
      imageSrc: rootsImage,
      logoSrc: rootsLogo,
    },
    {
      type: "rise" as const,
      title: "Rise",
      ageRange: "Ages 9-13",
      description: "Developing competitive players through structured training, tactical awareness, and character building. The next step in your soccer journey.",
      features: [
        "Advanced techniques",
        "Position-specific training",
        "Game strategy basics",
        "3x weekly sessions",
      ],
      imageSrc: riseImage,
      logoSrc: riseLogo,
    },
    {
      type: "reign" as const,
      title: "Reign",
      ageRange: "Ages 14-18",
      description: "Elite-level training for players pursuing excellence. Comprehensive development for those aiming for high school, club, and collegiate competition.",
      features: [
        "Elite skill refinement",
        "Advanced tactical systems",
        "Physical conditioning",
        "4x weekly + matches",
      ],
      imageSrc: reignImage,
      logoSrc: reignLogo,
    },
  ];

  return (
    <section id="programs" className="py-20 bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-purple/20 border border-purple/40 rounded-full text-purple text-sm font-medium mb-4">
            Our Programs
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">
            THREE PATHS TO EXCELLENCE
          </h2>
          <p className="text-warmwhite/70 max-w-2xl mx-auto">
            Every player's journey is unique. Choose the program that matches your current 
            level and aspirations. Progress through our pathway as you develop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {programs.map((program) => (
            <ProgramCard
              key={program.type}
              {...program}
              onLearnMore={() => onProgramSelect?.(program.type)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 text-warmwhite/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-crimson" />
              <span>Roots</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-crimson" />
              <span>Rise</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold" />
              <span>Reign</span>
            </div>
          </div>
          <p className="text-warmwhite/50 text-sm mt-2">
            Your pathway to soccer excellence
          </p>
        </div>
      </div>
    </section>
  );
}
