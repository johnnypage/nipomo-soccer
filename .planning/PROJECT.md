# Summer Skills Challenge

## What This Is

A web application built into nipomosc.org that runs an 8-week free community engagement campaign (Jun 9 -- Aug 3, 2026). Families sign up, kids complete weekly soccer skill challenges by uploading short video clips, earn points on a public leaderboard, and enter weekly prize drawings and a grand prize raffle. The campaign develops players over the summer, generates organic social content, and drives ROOTS Fall 2026 registration.

## Core Value

Parents can easily submit their kids' challenge videos and see them climb a live leaderboard -- frictionless participation that rewards consistency.

## Requirements

### Validated

(None yet -- ship to validate)

### Active

- [ ] Challenge hub page at /challenge with weekly challenge content, age-track instructions, and instructional video embeds
- [ ] Family account system with email magic-link auth (no passwords) and multi-kid profiles under one parent
- [ ] Video submission flow: parent selects kid, picks current challenge, uploads mobile video (Cloudinary direct upload)
- [ ] Points system: 1 point per skill submission + 1 point per fitness bonus per day + 1 bonus point for watching weekly video (max 15 points/week)
- [ ] Public leaderboard showing all participants ranked by total points, with streak badges and age-track filters
- [ ] Player profiles showing challenge history, badges earned, streak length, and "NSC Player" badge for registered players
- [ ] Admin dashboard for managing weekly challenges, viewing submissions, triggering prize drawings
- [ ] Weekly challenge content management: 3 age tracks (Little Kicks 4-6, Starter 7-10, Advanced 11-18) with skill + fitness bonus per week
- [ ] Email capture on signup for marketing list integration
- [ ] Prize drawing system tied to points (each point = 1 raffle entry)

### Out of Scope

- Mobile app -- web-only, mobile-responsive
- Real-time video judging or scoring -- purely participation-based
- Payment processing -- challenge is free
- Social media auto-posting -- manual resharing of submissions
- Email automation (Mailchimp/Sendgrid sequences) -- manual sends for v1
- Facebook Live integration -- done manually outside the app

## Context

- **Existing site:** nipomosc.org is a Replit-hosted web app. Local clone at ~/Projects/nipomo-soccer-website. GitHub repo: github.com/johnnypage/nipomo-soccer.
- **Leaderboard mockup:** A full HTML/CSS mockup already exists at marketing/summer-skills-challenge-leaderboard-mockup.html -- use as design reference.
- **Proposal doc:** Complete 8-week challenge calendar with all drills per age track lives in marketing/summer-skills-challenge-proposal.html.
- **Brand system:** Colors (Crimson #8B2332, Gold #D4A747, Charcoal #1E1E1E, Off-White #F5F5F0), Integral CF headlines, Inter body. Full spec in club/brand-design-skill.md.
- **Video formats:** Must accept iPhone .mov and Android .mp4 -- Cloudinary handles format conversion automatically.
- **Multi-kid families:** Common in Nipomo. One parent may have 2-3 kids in different age tracks. Account system must handle this cleanly.
- **Points math:** Max 15 points/week (7 skill + 7 fitness + 1 video bonus). Over 8 weeks, max 120 entries in grand prize drawing.
- **Registration tie-in:** Registered ROOTS/RISE/REIGN players get visible "NSC Player" badge on leaderboard. Soft registration CTA in every touchpoint, never the main message.
- **Budget:** ~$1,800 for prizes (8 weekly packs @ $100 + $1,000 grand prize). Minimal tech budget -- use free tiers where possible.
- **Prep timeline:** Board approved. Challenge calendar finalized. Need website ready by ~Jun 6.
- **Content source:** 8 weeks of challenge content is fully defined in the proposal doc -- drills, fitness bonuses, age-track variations all specified.

## Constraints

- **Timeline**: Website must be functional by June 6, 2026 -- challenge launches June 9
- **Hosting**: Built into existing nipomosc.org Replit app -- new routes, not a separate site
- **Video storage**: Cloudinary free tier (25GB bandwidth, 10GB storage) -- monitor usage mid-summer
- **Auth**: Magic link email auth, no passwords -- minimize friction for non-technical parents
- **Budget**: Near-zero tech spend. Cloudinary free tier, existing Replit hosting.
- **Deploy workflow**: Changes pushed to GitHub, pulled in Replit Shell, then republished

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Cloudinary for video uploads | Auto format conversion, direct mobile upload widget, free tier sufficient for expected volume | -- Pending |
| Magic link auth (no passwords) | Parents are non-technical, minimize friction. No password reset flow needed. | -- Pending |
| Multi-kid family accounts | Common for Nipomo families to have 2-3 kids in different age tracks | -- Pending |
| Built into nipomosc.org | Consistent branding, captures traffic, builds site authority | -- Pending |
| Participation-based points (not skill judging) | Rewards showing up, not talent. Aligns with ROOTS philosophy. | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check -- still the right priority?
3. Audit Out of Scope -- reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-28 after initialization*
