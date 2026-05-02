import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();
  
  const handleLearnMore = (programType: string) => {
    if (programType === "roots") {
      setLocation("/roots");
    } else if (programType === "rise") {
      setLocation("/rise");
    } else if (programType === "reign") {
      setLocation("/reign");
    } else {
      onProgramSelect?.(programType);
    }
  };

  const programs = [
    {
      type: "roots" as const,
      title: "Roots",
      subtitle: "Community Recreational Soccer",
      ageRange: "U4 and up",
      season: "Fall Season",
      description: "Where players discover their love for the game. Focuses on fun, skill fundamentals, and teamwork in a supportive environment. Every player plays. Every player belongs.",
      features: [
        "Fun skill-building activities",
        "Fundamental ball skills",
        "Teamwork & coordination",
        "Supportive environment",
      ],
      imageSrc: rootsImage,
      logoSrc: rootsLogo,
    },
    {
      type: "rise" as const,
      title: "Rise",
      subtitle: "Individual Player Development",
      ageRange: "U8 and up",
      season: "Spring Season",
      description: "For motivated players who want more soccer without a full year commitment. Training focuses on technical skills, decision making, and confidence with pod-based training and small-sided play.",
      features: [
        "Technical skill development",
        "Decision making training",
        "Pod-based training",
        "Small-sided play",
      ],
      imageSrc: riseImage,
      logoSrc: riseLogo,
    },
    {
      type: "reign" as const,
      title: "Reign",
      subtitle: "Competitive Club Soccer",
      ageRange: "U8 and up",
      season: "Year-Round",
      description: "Our highest level of play. Players receive advanced training, competitive matches, and strong coaching. Teams are built intentionally so every player is developed with care.",
      features: [
        "Advanced training",
        "Competitive matches",
        "Strong coaching",
        "Selection-based entry",
      ],
      imageSrc: reignImage,
      logoSrc: reignLogo,
    },
  ];

  return (
    <section id="programs" className="py-20 bg-night">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 border border-purple/40 rounded-full text-sm font-medium mb-4 text-[#B21F24] bg-[#b21f2454]">
            Three Connected Programs
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-warmwhite tracking-wide mb-4">From Rec to Club. You've got options.</h2>
          <p className="text-warmwhite/70 max-w-2xl mx-auto">
            We offer a full pathway designed to support every level of play. Each stage 
            builds on the one before it so players can learn, grow, and advance at their own pace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {programs.map((program) => (
            <ProgramCard
              key={program.type}
              {...program}
              onLearnMore={() => handleLearnMore(program.type)}
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
