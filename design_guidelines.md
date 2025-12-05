# Nipomo Soccer Club Website Design Guidelines

## Design Approach
**Reference-Based with Custom Branding**: Draw inspiration from modern sports club websites (Nike Training Club, LA Galaxy, professional sports academies) combined with the club's distinctive "Grow. Rise. Reign." three-tier program structure and mountain-themed regional identity.

## Color Implementation

**Primary Palette:**
- Deep Crimson (#8B1D24): Primary CTAs, borders, active states, section accents
- Night Black (#0D0D0D): Primary backgrounds, header/footer, dark sections
- Warm White (#F4EDE1): All body text on dark backgrounds, card backgrounds

**Accent Palette:**
- Slate Mountain Grey (#55524D): Secondary text, subtle borders, icon backgrounds
- Royal Gold (#C6A045): Premium program highlights (Reign), achievement badges
- Pathway Purple (#4A2B73): "EST. 2025" badges, timeline elements, subtle brand continuity

## Typography

**Font Selection:**
- Headers: Montserrat (Bold/ExtraBold) - athletic, modern, strong
- Body: Inter - clean, highly readable for sports content
- Accent: Bebas Neue for program names and impact statements

**Hierarchy:**
- Hero Headlines: 4xl-6xl, Montserrat ExtraBold
- Section Headers: 3xl-4xl, Montserrat Bold
- Program Names: 2xl-3xl, Bebas Neue (all caps)
- Body: base-lg, Inter Regular
- Captions: sm, Inter Medium

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
**Container:** max-w-7xl for main content, max-w-6xl for text-heavy sections
**Grid System:** 12-column responsive grid

## Component Library

### Navigation
- Fixed header with Deep Crimson underline on scroll
- Logo left, menu center/right with "Join Now" CTA in Deep Crimson
- Mobile: hamburger menu with full-screen Night Black overlay

### Hero Section
- **Large Hero Image**: Action shot of youth soccer players on field (mountain backdrop if possible)
- Overlay: gradient from Night Black (bottom) to transparent
- Centered content with blurred-background Deep Crimson CTA button
- "Grow. Rise. Reign." tagline in Bebas Neue
- "EST. 2025" badge with Pathway Purple accent in corner

### Program Showcases
- Three-column cards (desktop) for Grow/Rise/Reign programs
- Each card: program icon, name in Bebas Neue, description, "Learn More" link
- Grow: Warm White background with Deep Crimson accents
- Rise: Slate Grey background with crimson highlights
- Reign: Night Black background with Royal Gold crown accent

### Content Sections
- Alternating Night Black and Warm White backgrounds
- Image-text split layouts (60/40 ratio)
- Stats/achievements in large Montserrat Bold with Royal Gold numbers

### Forms & CTAs
- Primary buttons: Deep Crimson background, Warm White text, rounded-lg
- Input fields: Slate Grey borders, Warm White backgrounds, focus state in Deep Crimson
- Registration forms: multi-step with progress indicator in Pathway Purple

### Footer
- Night Black background with Slate Grey dividers
- Four-column layout: About, Programs, Quick Links, Contact
- Social icons in Deep Crimson on hover
- Newsletter signup with inline form
- Mountain silhouette graphic as decorative element

## Images

**Hero Image:** Full-width action shot of diverse youth players in practice/game (1920x1080 min)
**Program Cards:** Three distinct images showing age-appropriate training for each tier
**About Section:** Coaching staff or team group photo with mountain backdrop
**Testimonials:** Parent/player headshots in circular frames
**Background Elements:** Subtle mountain ridge silhouettes in Slate Grey for section dividers

## Key Page Structures

**Homepage:**
1. Hero with large image + CTA
2. Three-program overview cards
3. Mission/values section with mountain imagery
4. Testimonials carousel
5. Upcoming events/registration callout
6. Contact CTA section

**Program Pages:**
Individual pages for Grow, Rise, Reign with age groups, training schedules, coaching philosophy, registration info

**About/Contact:**
Club history, staff bios, facility info, contact form with location map

## Special Elements

- "EST. 2025" badges throughout in Pathway Purple
- Crown icons (Royal Gold) for Reign program
- Mountain graphic elements as section dividers
- Player number typography styling in Warm White
- Achievement badges/milestones in circular formats

## Animations
Minimal and purposeful: smooth scrolling, subtle fade-ins for section reveals, hover scale (1.05) on cards only.