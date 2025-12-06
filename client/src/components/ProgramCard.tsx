import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, TrendingUp, Crown } from "lucide-react";

export type ProgramType = "roots" | "rise" | "reign";

interface ProgramCardProps {
  type: ProgramType;
  title: string;
  subtitle: string;
  ageRange: string;
  season: string;
  description: string;
  features: string[];
  imageSrc: string;
  logoSrc: string;
  onLearnMore?: () => void;
}

const programStyles = {
  roots: {
    bg: "bg-warmwhite",
    text: "text-night",
    accent: "text-crimson",
    icon: Sprout,
    iconBg: "bg-crimson/10",
    button: "bg-crimson hover:bg-crimson-dark text-warmwhite",
  },
  rise: {
    bg: "bg-slate",
    text: "text-warmwhite",
    accent: "text-crimson",
    icon: TrendingUp,
    iconBg: "bg-crimson/20",
    button: "bg-crimson hover:bg-crimson-dark text-warmwhite",
  },
  reign: {
    bg: "bg-night",
    text: "text-warmwhite",
    accent: "text-gold",
    icon: Crown,
    iconBg: "bg-gold/20",
    button: "bg-gold hover:bg-gold/90 text-night",
  },
};

export default function ProgramCard({
  type,
  title,
  subtitle,
  ageRange,
  season,
  description,
  features,
  imageSrc,
  logoSrc,
  onLearnMore,
}: ProgramCardProps) {
  const styles = programStyles[type];

  return (
    <Card className={`${styles.bg} border-0 overflow-hidden h-full flex flex-col`}>
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={imageSrc}
          alt={`${title} program`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
          <img 
            src={logoSrc} 
            alt={`${title} logo`} 
            className="h-14 w-auto object-contain"
          />
        </div>
      </div>
      
      <CardContent className="p-6 flex flex-col flex-grow">
        <h3 className={`font-integral text-2xl uppercase tracking-wide ${styles.text} mb-1`}>
          {title}
        </h3>
        <p className={`${styles.accent} text-sm font-medium mb-1`}>
          {subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`${styles.text} opacity-70 text-sm`}>
            {ageRange}
          </span>
          <span className={`${styles.text} opacity-40`}>|</span>
          <span className={`${styles.text} opacity-70 text-sm`}>
            {season}
          </span>
        </div>
        
        <p className={`${styles.text} opacity-80 text-sm mb-4`}>
          {description}
        </p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className={`flex items-center gap-2 ${styles.text} opacity-70 text-sm`}>
              <span className={`w-1.5 h-1.5 rounded-full ${type === "reign" ? "bg-gold" : "bg-crimson"}`} />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button
          onClick={onLearnMore}
          className={`w-full mt-auto ${styles.button}`}
          data-testid={`button-learn-more-${type}`}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}
