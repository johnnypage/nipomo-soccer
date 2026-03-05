import { useState } from "react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import clubLogo from "@assets/NSC_1764979848772.png";

interface FooterProps {
  onNavigate?: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await apiRequest("POST", "/api/subscribe", { email });
      setMessage({ type: "success", text: "Thanks for subscribing!" });
      setEmail("");
    } catch (error: any) {
      const errorText = error?.message || "Failed to subscribe. Please try again.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  const footerLinks = {
    programs: [
      { label: "Roots (U4 and up)", section: "programs" },
      { label: "Rise (U8 and up)", section: "programs" },
      { label: "Reign (U8 and up)", section: "programs" },
    ],
    club: [
      { label: "About Us", section: "about" },
      { label: "Shop", section: "shop", href: "/shop" },
      { label: "Contact", section: "contact" },
      { label: "Join Now", section: "contact" },
    ],
    resources: [
      { label: "Training Schedule", section: "programs" },
      { label: "Registration", section: "contact" },
      { label: "FAQ", section: "contact" },
    ],
  };

  const socialLinks = [
    { icon: SiFacebook, label: "Facebook", href: "#" },
    { icon: SiInstagram, label: "Instagram", href: "https://www.instagram.com/nipomo.soccer/" },
  ];

  return (
    <footer className="bg-night border-t border-slate/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={clubLogo} 
                alt="Nipomo SC" 
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-warmwhite/60 text-sm mb-4">
              Building a complete player pathway in Nipomo. High quality, affordable 
              youth soccer development close to home.
            </p>
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate/20 flex items-center justify-center text-warmwhite/60 hover:text-crimson hover:bg-crimson/10 transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div>
              <h4 className="font-heading font-semibold text-warmwhite text-sm mb-2">
                Stay Updated
              </h4>
              <p className="text-warmwhite/60 text-xs mb-3">
                Get news and updates from Nipomo Soccer.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate/20 border-slate/30 text-warmwhite placeholder:text-warmwhite/40 text-sm h-9"
                  data-testid="input-subscribe-email"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-crimson hover:bg-crimson-dark text-warmwhite border-crimson shrink-0"
                  disabled={isLoading || !email}
                  data-testid="button-subscribe"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
              </form>
              {message && (
                <p className={`text-xs mt-2 ${message.type === "success" ? "text-green-400" : "text-red-400"}`} data-testid="text-subscribe-message">
                  {message.type === "success" && <CheckCircle className="inline h-3 w-3 mr-1" />}
                  {message.text}
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-warmwhite text-sm mb-4">
              Programs
            </h4>
            <ul className="space-y-2">
              {footerLinks.programs.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate?.(link.section)}
                    className="text-warmwhite/60 hover:text-warmwhite text-sm transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-warmwhite text-sm mb-4">
              Club
            </h4>
            <ul className="space-y-2">
              {footerLinks.club.map((link, idx) => (
                <li key={idx}>
                  {"href" in link && link.href ? (
                    <Link
                      href={link.href}
                      className="text-warmwhite/60 hover:text-warmwhite text-sm transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => onNavigate?.(link.section)}
                      className="text-warmwhite/60 hover:text-warmwhite text-sm transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-warmwhite text-sm mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate?.(link.section)}
                    className="text-warmwhite/60 hover:text-warmwhite text-sm transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative py-8">
          <svg
            className="absolute left-0 right-0 top-0 h-8 text-slate/10"
            viewBox="0 0 1200 30"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 25 L100 20 L200 22 L300 15 L400 18 L500 10 L600 15 L700 8 L800 12 L900 5 L1000 10 L1100 8 L1200 12"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate/20">
          <p className="text-warmwhite/40 text-sm">
            © {currentYear} Nipomo Soccer Club. All rights reserved.
          </p>
          <p className="text-warmwhite/40 text-sm">
            <span className="font-display text-warmwhite/60">ROOTS. RISE. REIGN.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
