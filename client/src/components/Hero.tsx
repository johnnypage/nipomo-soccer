import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/youth_soccer_hero_image.png";

interface HeroProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export default function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" />
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-16">
        <span className="inline-block px-3 py-1 bg-purple/20 border border-purple/40 rounded-full text-purple text-sm font-medium mb-6">
          EST. 2025
        </span>
        
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-warmwhite tracking-wide mb-4">
          ROOTS. RISE. REIGN.
        </h1>
        
        <p className="font-heading text-xl sm:text-2xl text-warmwhite/90 font-medium mb-2">
          Nipomo Soccer Club
        </p>
        
        <p className="text-warmwhite/70 text-lg max-w-2xl mx-auto mb-8">
          High quality, affordable youth soccer development close to home. From first touches to elite competition.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson px-8"
            data-testid="button-get-started"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onLearnMore}
            className="border-warmwhite/30 text-warmwhite bg-warmwhite/10 backdrop-blur-sm hover:bg-warmwhite/20"
            data-testid="button-learn-more"
          >
            Our Programs
          </Button>
        </div>
      </div>
      
      <button
        onClick={onLearnMore}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-warmwhite/60 hover:text-warmwhite animate-bounce"
        data-testid="button-scroll-down"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
}
