# Nipomo Soccer Website

## Overview

This is a marketing and informational website for Nipomo Soccer, a youth soccer organization in Nipomo, California. The site showcases three progressive soccer programs (Roots, Rise, Reign) designed to create a complete player development pathway from recreational to competitive levels. Built with React, TypeScript, and Express, the application features a modern single-page design with smooth scrolling navigation and custom branding following the club's "Roots. Rise. Reign." identity.

## User Preferences

Preferred communication style: Simple, everyday language.

## Branding Rules

- Organization name is always **"Nipomo Soccer"** -- never "Nipomo Soccer Club" except in the footer copyright line and explicit legal/non-profit references.
- No em dashes in copy -- use double hyphens (--) instead.
- GitHub (`github.com/johnnypage/nipomo-soccer`) is the source of truth. Always push to GitHub before running `git reset --hard github/main` to avoid losing Replit-only changes.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite as the build tool. The application uses a single-page architecture with client-side routing via Wouter.

**UI Component Library**: Shadcn UI with Radix UI primitives, providing accessible, unstyled components that are customized with Tailwind CSS. The component library follows the "New York" style variant with custom theming.

**Styling System**: Tailwind CSS with a custom design system based on the club's brand guidelines. The color palette includes:
- Deep Crimson (#8B1D24) for primary CTAs and accents
- Night Black (#0D0D0D) for dark backgrounds
- Warm White (#F4EDE1) for text and light backgrounds
- Slate Mountain Grey (#55524D) for secondary elements
- Royal Gold (#C6A045) for premium highlights
- Pathway Purple (#4A2B73) for branding accents

**Typography**: Custom font stack featuring Bebas Neue for display text, Montserrat for headings, and Inter for body copy. An additional custom "Integral" font is loaded for branding purposes.

**State Management**: TanStack Query (React Query) for server state management, with local component state using React hooks.

**Component Structure**: 
- Page-level components in `client/src/pages/`
- Reusable UI components in `client/src/components/`
- Shadcn UI primitives in `client/src/components/ui/`
- Component examples for development in `client/src/components/examples/`

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**Development Setup**: Vite middleware integration for hot module replacement (HMR) during development, with separate production build process.

**Static File Serving**: In production, the Express server serves the built Vite application as static files with fallback to index.html for client-side routing.

**Storage Layer**: Currently implements an in-memory storage interface (`MemStorage`) with methods for user management. The storage interface is designed to be swappable with a database-backed implementation.

**API Structure**: RESTful API routes are registered through `server/routes.ts`, with a convention of prefixing all API endpoints with `/api`.

**Build Process**: Custom build script using esbuild for server bundling and Vite for client bundling, with selective dependency bundling to optimize cold start times.

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL, though the database is not yet provisioned or actively used.

**Schema Definition**: Schemas defined in `shared/schema.ts` with Zod validation schemas for type-safe data operations:
- `users` - User accounts (not currently used)
- `contactSubmissions` - Contact form entries with name, email, phone, program interest, and message
- `tournamentInterests` - Team interest submissions for tournaments with club/contact info, divisions, and team count

**Current Implementation**: PostgreSQL database is actively used for form submissions. Database tables store all contact and tournament interest submissions as backup regardless of email delivery status.

**Future State**: The application is architected to support PostgreSQL with connection pooling via the `pg` library and session management through `connect-pg-simple`.

### External Dependencies

**UI Component Libraries**:
- Radix UI for headless, accessible component primitives
- Shadcn UI for pre-styled component patterns
- Lucide React for icons
- React Icons for social media icons

**Form Management**:
- React Hook Form for form state
- Hookform Resolvers for validation integration
- Zod for schema validation

**Utility Libraries**:
- class-variance-authority (cva) for component variant management
- clsx and tailwind-merge for conditional className composition
- date-fns for date formatting

**Development Tools**:
- Replit-specific plugins for development experience (runtime error overlay, cartographer, dev banner)
- TypeScript for type safety
- ESBuild and Vite for build optimization

**Active Integrations**:
- SendGrid for transactional emails (contact form, tournament interest notifications)
- Mailchimp for newsletter subscription management
- PostgreSQL for form submission storage

**Planned Integrations** (dependencies present but not implemented):
- Express session management with connect-pg-simple
- Authentication scaffolding (passport, jsonwebtoken)
- File uploads (multer)
- Payment processing (stripe)
- AI integration (OpenAI, Google Generative AI)

### Design System

**Brand Identity**: The site follows comprehensive design guidelines documented in `design_guidelines.md`, emphasizing athletic modernity with soccer-specific visual language.

**Responsive Design**: Mobile-first approach with breakpoints defined through Tailwind's default system and custom mobile detection hooks.

**Color Variables**: CSS custom properties defined in HSL format for theme flexibility, with separate light and dark mode values.

**Spacing System**: Consistent spacing primitives using Tailwind's default scale (4px base unit).

**Component Patterns**: All interactive components follow accessibility best practices through Radix UI primitives, with ARIA labels and keyboard navigation support.

## Pages

- **Home** (`/`) - Main landing page with hero, program showcase (Roots, Rise, Reign), about section, sponsors, contact form, and newsletter signup
- **Roots** (`/roots`) - ROOTS recreational program page with hero, division breakdown, what's new, family feedback, pathway, FAQ, and coach CTA. Files in `client/src/pages/roots/`.
- **Rise** (`/rise`) - RISE Spring Development League page with hero, program details, age divisions, pricing tiers, FAQ accordion, pathway visualization, and sticky mobile CTA. Uses custom green (#2E7D32) and amber (#F9A825) color scheme.
- **Reign** (`/reign`) - Detailed page for the Reign competitive program with teams organized by birth year ranges
- **Tournament** (`/tournament`) - Hidden; redirects to home.
- **Nipomo SC vs. AYSO** (`/about/compare`) - Apple-style scroll-driven page comparing Nipomo SC to AYSO. 12 full-width sections with parallax backgrounds (Unsplash), framer-motion whileInView animations, count-up numbers, recharts bar chart and donut charts, board member grid, feature card grid with icons, comparison table, FAQ accordion. Linked in About dropdown nav. File: `client/src/pages/Compare.tsx`.
- **Volunteer** (`/volunteer`) - Volunteer roles page with hero, role cards (open/filled), expandable role detail drawer. File: `client/src/pages/Volunteer.tsx`.
- **Find My Division** (`/find-my-division`) - Tool for parents to look up which ROOTS division their child belongs to. File: `client/src/pages/FindMyDivision.tsx`.
- **Team Placement Request** (`/team-placement`) - Form for requesting player/coach pairings or schedule accommodations. File: `client/src/pages/TeamPlacement.tsx`.
- **Coach With Us** (`/coach`) - Coach application page. Files in `client/src/pages/coach/`.

## Recent Changes

- Recovered Roots, Volunteer, and FindMyDivision pages that were wiped by a `git reset --hard github/main` deployment pull. Restored all files from git history and pushed to GitHub.
- Complete "Nipomo Soccer Club" -- "Nipomo Soccer" sweep across all source files: Header, Hero, About, Reign, Compare (5 spots), index.html, server/static.ts, server/vite.ts, server/routes.ts, server/placementRoutes.ts, server/shopRoutes.ts. Footer copyright kept as legal name.
- Footer Resources column updated: added "Find My Division" (/find-my-division) and "Team Placement Request" (/team-placement).
- App.tsx routes restored: /roots, /volunteer, /find-my-division all registered.
- Rebuilt /about/compare as Apple-style scroll-driven page: full-screen hero with parallax, 12 distinct sections, count-up stat cards, animated charts, board member grid, feature card grid, comparison table, FAQ; linked in About nav dropdown
- Fixed shop order recording: orders were silently failing because STRIPE_WEBHOOK_SECRET was not configured. Added `/api/shop/order-from-session` endpoint. Added "Recover Order" panel in admin Orders tab.
- Shop product images stored in PostgreSQL (base64 in `image_data` column) so they persist across deployments
