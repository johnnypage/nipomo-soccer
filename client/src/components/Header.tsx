import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import clubLogo from "@assets/NSC_1764979848772.png";

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Programs", section: "programs" },
    { label: "About", section: "about" },
    { label: "Contact", section: "contact" },
  ];

  const handleNavigate = (section: string) => {
    onNavigate?.(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-night/95 backdrop-blur-sm border-b border-slate/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between gap-4 h-16">
          <div className="flex items-center gap-3">
            <img 
              src={clubLogo} 
              alt="Nipomo SC" 
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-warmwhite text-lg leading-tight">
                Nipomo Soccer Club
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavigate(item.section)}
                className="text-warmwhite/80 hover:text-warmwhite font-medium transition-colors"
                data-testid={`nav-${item.section}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleNavigate("contact")}
              className="hidden sm:flex bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson"
              data-testid="button-join-now"
            >
              Join Now
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-warmwhite"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-night border-t border-slate/20">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavigate(item.section)}
                className="block w-full text-left text-warmwhite/80 hover:text-warmwhite font-medium py-2"
                data-testid={`mobile-nav-${item.section}`}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => handleNavigate("contact")}
              className="w-full bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson mt-2"
              data-testid="button-mobile-join"
            >
              Join Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
