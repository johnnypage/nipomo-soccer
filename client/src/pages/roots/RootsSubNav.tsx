import { Link, useLocation } from "wouter";
import { SPOND_SPECIAL_NEEDS } from "@/pages/landing/landingContent";

type SubNavItem = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  // Paths (exact or prefix) that mark this item as the active division.
  match?: string[];
};

const ITEMS: SubNavItem[] = [
  { id: "parent-and-me", label: "Parent & Me", href: "/roots/parent-and-me" },
  { id: "league-play", label: "League Play", href: "/roots/recreational" },
  // 5v5 lives only on the dedicated /5v5 landing page now.
  { id: "5v5", label: "5v5", href: "/5v5", match: ["/5v5", "/roots/5v5"] },
  { id: "special-needs", label: "Special Needs", href: SPOND_SPECIAL_NEEDS, external: true },
];

// Secondary navigation for the ROOTS section. Sticks just below the fixed
// site header (h-16 / 64px) so families can move between divisions from any
// ROOTS page. Horizontally scrollable on small screens.
export default function RootsSubNav() {
  const [location] = useLocation();

  const isActive = (item: SubNavItem) =>
    !item.external &&
    (item.match ?? [item.href]).some(
      (p) => location === p || location.startsWith(p + "/"),
    );

  return (
    <nav
      className="sticky top-16 z-40 bg-night/95 backdrop-blur-sm border-b border-slate/20"
      aria-label="ROOTS divisions"
      data-testid="roots-subnav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 h-12 overflow-x-auto whitespace-nowrap">
          <Link
            href="/roots"
            className={`shrink-0 font-integral text-xs uppercase tracking-wide font-bold px-3 py-1.5 rounded-lg transition-colors ${
              location === "/roots"
                ? "text-gold"
                : "text-warmwhite/70 hover:text-warmwhite"
            }`}
            data-testid="roots-subnav-home"
          >
            ROOTS
          </Link>
          <span className="shrink-0 text-warmwhite/20" aria-hidden="true">
            /
          </span>
          {ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors text-warmwhite/60 hover:text-warmwhite hover:bg-warmwhite/8"
                data-testid={`roots-subnav-${item.id}`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className={`shrink-0 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors ${
                  isActive(item)
                    ? "bg-crimson text-warmwhite"
                    : "text-warmwhite/60 hover:text-warmwhite hover:bg-warmwhite/8"
                }`}
                aria-current={isActive(item) ? "page" : undefined}
                data-testid={`roots-subnav-${item.id}`}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </nav>
  );
}
