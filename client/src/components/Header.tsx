import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import clubLogo from "@assets/NSC_1764979848772.png";
import { useCart } from "@/hooks/use-cart";
import CartSheet from "@/components/CartSheet";

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();

  const programLinks = [
    { label: "Roots", href: "/#programs", description: "Community Recreational Soccer" },
    { label: "Rise", href: "/rise", description: "Spring Development League" },
    { label: "Reign", href: "/reign", description: "Competitive Club Soccer" },
  ];

  const aboutLinks = [
    { label: "About Us", href: "/#about" },
    { label: "Nipomo SC vs. AYSO", href: "/about/compare" },
    { label: "Coach With Us", href: "/coach" },
  ];

  const navItems = [
    { label: "Contact", section: "contact" },
  ];

  const handleNavigate = (section: string) => {
    if (location !== "/") {
      window.location.href = `/#${section}`;
    } else {
      onNavigate?.(section);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-night/95 backdrop-blur-sm border-b border-slate/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between gap-4 h-16">
          <Link href="/" className="flex items-center gap-3 cursor-pointer" data-testid="link-home-logo">
            <img 
              src={clubLogo} 
              alt="Nipomo SC" 
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-integral font-bold text-warmwhite text-lg leading-tight uppercase tracking-wide">
                Nipomo Soccer Club
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {location !== "/" && (
              <Link
                href="/"
                className="font-integral text-warmwhite/80 hover:text-warmwhite font-bold uppercase tracking-wide transition-colors"
                data-testid="nav-home"
              >
                Home
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="font-integral text-warmwhite/80 hover:text-warmwhite font-bold uppercase tracking-wide transition-colors flex items-center gap-1" data-testid="nav-programs">
                Programs
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-night border-slate/30">
                {programLinks.map((program) => (
                  <DropdownMenuItem key={program.label} asChild className="cursor-pointer">
                    <Link href={program.href} className="flex flex-col items-start" data-testid={`nav-program-${program.label.toLowerCase()}`}>
                      <span className="font-heading font-semibold text-warmwhite">{program.label}</span>
                      <span className="text-xs text-warmwhite/60">{program.description}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="font-integral text-warmwhite/80 hover:text-warmwhite font-bold uppercase tracking-wide transition-colors flex items-center gap-1" data-testid="nav-about">
                About
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-night border-slate/30">
                {aboutLinks.map((link) => (
                  <DropdownMenuItem key={link.label} asChild className="cursor-pointer">
                    <Link href={link.href} data-testid={`nav-about-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <span className="font-heading font-semibold text-warmwhite">{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/shop"
              className="font-integral text-warmwhite/80 hover:text-warmwhite font-bold uppercase tracking-wide transition-colors"
              data-testid="nav-shop"
            >
              Shop
            </Link>
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavigate(item.section)}
                className="font-integral text-warmwhite/80 hover:text-warmwhite font-bold uppercase tracking-wide transition-colors"
                data-testid={`nav-${item.section}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-warmwhite/80 hover:text-warmwhite transition-colors"
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-crimson text-warmwhite text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
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
            <div className="text-warmwhite/60 text-sm font-medium uppercase tracking-wide">Programs</div>
            {programLinks.map((program) => (
              <Link
                key={program.label}
                href={program.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-warmwhite/80 hover:text-warmwhite font-medium py-2 pl-3"
                data-testid={`mobile-nav-${program.label.toLowerCase()}`}
              >
                {program.label} <span className="text-warmwhite/50 text-sm">({program.description})</span>
              </Link>
            ))}
            <div className="text-warmwhite/60 text-sm font-medium uppercase tracking-wide pt-2">About</div>
            {aboutLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-warmwhite/80 hover:text-warmwhite font-medium py-2 pl-3"
                data-testid={`mobile-nav-about-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate/20 pt-3">
              {location !== "/" && (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left text-warmwhite/80 hover:text-warmwhite font-medium py-2"
                  data-testid="mobile-nav-home"
                >
                  Home
                </Link>
              )}
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left text-warmwhite/80 hover:text-warmwhite font-medium py-2"
                data-testid="mobile-nav-shop"
              >
                Shop
              </Link>
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
            </div>
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
    <a
      href="https://club.spond.com/landing/signup/nipomosc/form/A22902569DA04BE2B95994D93EE5C602"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-16 left-0 right-0 z-40 bg-risegreen text-warmwhite text-center py-3 px-4 text-base font-heading font-semibold hover:bg-risegreen/90 transition-colors cursor-pointer block"
      data-testid="banner-spring-soccer"
    >
      Ready for Spring Soccer? <span className="underline underline-offset-2">Registration is now open.</span>
    </a>
    <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
