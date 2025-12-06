import { SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import clubLogo from "@assets/NSC_1764979848772.png";

interface FooterProps {
  onNavigate?: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    programs: [
      { label: "Roots (Ages 5-8)", section: "programs" },
      { label: "Rise (Ages 9-13)", section: "programs" },
      { label: "Reign (Ages 14-18)", section: "programs" },
    ],
    club: [
      { label: "About Us", section: "about" },
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
    { icon: SiInstagram, label: "Instagram", href: "#" },
    { icon: SiYoutube, label: "YouTube", href: "#" },
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
              Building champions on and off the field. Youth soccer development 
              on California's Central Coast.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-slate/20 flex items-center justify-center text-warmwhite/60 hover:text-crimson hover:bg-crimson/10 transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
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
            <span className="font-display text-warmwhite/60">GROW. RISE. REIGN.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
