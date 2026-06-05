# Project Research Summary

**Project:** Summer Skills Challenge
**Domain:** Video submission + gamification web app (youth soccer, community engagement)
**Researched:** 2026-05-28
**Confidence:** HIGH

## Executive Summary

The Summer Skills Challenge is a participation-based gamification feature built into an existing React + Express + PostgreSQL web app hosted on Replit. The build follows a well-trodden pattern: direct-to-CDN video upload (Cloudinary), passwordless auth (magic link via existing SendGrid), session-based family accounts with multi-child profiles, and a points-driven leaderboard. The existing codebase already has every dependency needed except a single npm package (`cloudinary` Node SDK for admin operations). The stack research confirms this is not a greenfield build -- it is a feature addition that follows established patterns already present in the codebase (separate route files, Drizzle ORM schemas, TanStack Query for data fetching, Shadcn/Radix components).

The recommended approach is to build auth and data models first, then the video submission pipeline, then the leaderboard and gamification layer, and finally admin tooling. The critical path is: family signup -> multi-child profiles -> video submission -> points -> leaderboard. Everything else (badges, streaks, player profiles, prize drawing) layers on top of that chain. The 9-day build window (May 28 -- Jun 6) is tight but achievable because the stack requires almost no new infrastructure -- one npm install, one Cloudinary account setup, and four new database tables.

The top risks are Cloudinary free tier exhaustion (video is credit-expensive across storage, bandwidth, and transformations), iPhone video file size chaos (parents shooting 4K .mov files that time out on upload), magic link emails landing in spam, and COPPA compliance for children's video content. All four are preventable with upfront configuration decisions: enforce 30-second max duration and 720p resolution caps on the upload preset, use the existing SendGrid integration with proper SPF/DKIM/DMARC, keep videos non-public (admin-only playback, thumbnails on leaderboard), and implement a parent-mediated consent model at signup.

## Key Findings

### Recommended Stack

The entire feature is built on the existing nipomosc.org stack with minimal additions. Only one new npm package is needed (`cloudinary`). Express-session and connect-pg-simple are already in package.json but not yet wired up -- this feature activates them. Video bytes never touch the Express server; Cloudinary's Upload Widget handles direct browser-to-CDN transfer, which is critical on Replit Autoscale where cold starts and limited memory make server-side file handling unreliable.

**Core technologies (all existing except Cloudinary):**
- **Cloudinary Upload Widget (script tag)**: Direct browser-to-CDN video upload -- bypasses Express entirely, handles .mov/.mp4 conversion, provides progress UI
- **DIY Magic Link (crypto.randomBytes + DB)**: 30 lines of auth code using built-in Node crypto -- no passport, no JWT, no third-party auth library
- **express-session + connect-pg-simple**: Cookie-based sessions stored in PostgreSQL -- survives Replit restarts, already a dependency
- **Drizzle ORM schema additions**: 5 new tables (families, kids, challenges, submissions, drawings) following existing patterns
- **SQL aggregation for leaderboard**: GROUP BY + ORDER BY, not a gamification engine -- PostgreSQL handles this instantly at 100-200 kids
- **Recharts (existing)**: Admin participation charts

**New environment variables needed:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SESSION_SECRET`

### Expected Features

**Must have (table stakes):**
- Challenge hub page at `/challenge` with weekly content and instructional video embeds
- Family signup with email magic link auth (no passwords)
- Multi-child profiles under one parent account
- Video submission flow via Cloudinary direct upload (must work flawlessly on mobile)
- Points tracking (1 per submission, max 15/week)
- Public leaderboard ranked by total points with age-track filters
- Weekly challenge content display with age-track variations
- Prize information display
- Submission confirmation with point update
- Mobile-first responsive design

**Should have (differentiators):**
- Streak tracking + streak badges (3, 7, 14, 21+ day thresholds)
- Achievement badges (NSC Player, Perfect Week, Fitness All-Star)
- Player profiles at `/challenge/player/:id`
- Activity feed (recent submissions, text-only)
- Admin prize drawing tool (weighted random, each point = 1 entry)
- "NSC Player" badge for registered members (soft registration incentive)

**Defer (post-launch or nice-to-have):**
- Email export / marketing list integration
- Sponsor attribution display
- Instructional video watch tracking (bonus point via honor-system checkbox)
- i18n / Spanish language support

**Explicitly NOT building (anti-features):**
- Video judging or skill scoring
- Social media auto-posting
- Email automation sequences
- Password-based auth
- Native mobile app
- Real-time WebSocket leaderboard
- Video playback / gallery on public pages (bandwidth killer)
- User-to-user messaging / comments
- Complex admin CMS
- OAuth / Google sign-in

### Architecture Approach

The feature integrates as a new route module (`challengeRoutes.ts`) following the existing pattern of `shopRoutes.ts`, `coachRoutes.ts`, and `placementRoutes.ts`. Client pages live under `client/src/pages/challenge/`. The key architectural decision is the direct-to-Cloudinary upload pattern: video bytes flow from the parent's phone browser directly to Cloudinary, bypassing Express entirely. Express only receives metadata (Cloudinary URL, public ID) after upload completes, validates the session, and writes a submission record to PostgreSQL. This avoids Replit Autoscale's memory limits and cold start timeouts.

**Major components:**
1. **Family Auth System** -- magic link send/verify, express-session management, multi-kid profile CRUD
2. **Video Submission Flow** -- kid selector, challenge picker, Cloudinary Upload Widget wrapper, server-side validation (daily caps, week boundaries), submission recording
3. **Points Engine** -- additive points on submission insert, daily/weekly cap enforcement via unique constraints
4. **Leaderboard** -- SQL aggregation query with age-track filter, streak computation, badge derivation, polling via TanStack Query
5. **Challenge Content Manager** -- admin CRUD for weekly challenges, seeded from proposal doc content
6. **Prize Drawing System** -- weighted random selection (each point = 1 entry), winner recording, admin-only trigger
7. **Player Profiles** -- per-kid display of points, badges, streak, submission history (dates, not videos)

**Key data flow:** Parent's phone -> Cloudinary Upload Widget -> Cloudinary CDN (video stored) -> Widget callback to React -> React POSTs metadata to Express -> Express validates + writes to PostgreSQL -> Leaderboard queries PostgreSQL on page load

### Critical Pitfalls

1. **Cloudinary free tier exhaustion** -- Video is dramatically more credit-expensive than images. Enforce 30-second max duration, 720p resolution cap, 50MB file size limit on the upload preset. Use eager transformations to compress on upload and delete raw originals. Monitor credits weekly; budget $89/month as contingency. Host instructional videos on YouTube, not Cloudinary.

2. **iPhone video file size and format chaos** -- Parents will shoot 4K/60fps .mov files that are 100-200MB for a 30-second clip. Client-side file size validation before upload begins. Set max to 50MB. Show clear guidance ("Try recording under 30 seconds"). Use Cloudinary chunked upload for resilience on spotty connections. Show real progress bar, never a spinner.

3. **Magic link emails landing in spam** -- Verify SPF, DKIM, DMARC DNS records for nipomosoccer.com before launch. Use the existing SendGrid integration (already paid). Disable click/open tracking on auth emails. Keep the email minimal -- just the link. Set 15-minute expiry. Provide "didn't get it? check spam / resend" flow. Test deliverability on Gmail, Yahoo, Outlook, iCloud before launch.

4. **COPPA compliance** -- The parent-mediated model (parent creates account, parent uploads video) is the strongest practical defense. Use first name + last initial only on leaderboard. Never display videos publicly without parent action. Add a clear privacy notice at signup. Provide a data deletion mechanism. Do not enable any child-to-child interaction features.

5. **Magic link UX friction on mobile** -- Links opened in email app in-app browsers (Gmail, Outlook) create separate session contexts. Set session cookies to 30 days with `httpOnly`, `secure`, `sameSite: 'lax'`. Test the full flow on iPhone Gmail app, Apple Mail, and Android Gmail before launch. Redirect to `/challenge` after verification, not homepage.

## Implications for Roadmap

Based on research, the feature dependency chain and build order are clear. Five phases, with the first three being critical path for launch.

### Phase 1: Foundation (Auth + Data Model)
**Rationale:** Everything depends on family accounts and database tables. Auth is the gating function -- no auth means no submissions, no leaderboard, nothing. This phase also sets up Cloudinary account configuration, which is a manual prerequisite for Phase 2.
**Delivers:** Family signup flow, magic link auth, express-session wired up, multi-kid profile CRUD, all database tables created, Cloudinary account + upload preset configured
**Addresses:** Family signup, multi-child profiles, email capture (table stakes)
**Avoids:** Replit data loss (#5 -- PostgreSQL from day one), magic link deliverability (#3 -- SendGrid + DNS records), COPPA consent (#4 -- privacy notice in signup), mobile session friction (#10 -- 30-day cookies)

### Phase 2: Core Loop (Submission + Points + Leaderboard)
**Rationale:** This is the product. A kid submits a video, earns a point, and sees their name on the leaderboard. Without this loop working on a phone, there is no campaign. Submission and leaderboard are tightly coupled -- building them together enables end-to-end testing.
**Delivers:** Video submission flow with Cloudinary widget, points calculation, public leaderboard with age-track filters, challenge content display, submission confirmation
**Addresses:** Video submission, points tracking, public leaderboard, weekly challenge display, mobile-first design (table stakes)
**Avoids:** Cloudinary credit burn (#1 -- preset limits enforced), iPhone video chaos (#2 -- client-side validation + chunked upload), multi-kid confusion (#6 -- prominent kid selector + confirmation), timezone bugs (#12 -- Pacific Time boundaries), unsigned upload abuse (#9 -- auth-gate the widget)

### Phase 3: Engagement Layer (Streaks + Badges + Profiles)
**Rationale:** Streaks and badges are the engagement differentiators that keep kids coming back after Week 1 novelty wears off. These are all computed from existing submission data, so they layer on top of Phase 2 without new infrastructure. Player profiles enable social sharing ("look at my kid's badges").
**Delivers:** Streak tracking, achievement badges, player profile pages, activity feed
**Addresses:** Streak badges, achievement badges, player profiles, activity feed (differentiators)
**Avoids:** Leaderboard gaming (#7 -- visible badges reward consistency, not volume)

### Phase 4: Admin Tooling (Challenge Management + Prize Drawing)
**Rationale:** Admin tools are needed before Week 1's prize drawing (June 14) but not before launch day (June 9). Johnny can seed Week 1 content via database if the admin UI isn't ready. The prize drawing tool replaces manual RandomPicker usage.
**Delivers:** Admin challenge CRUD, submission review/moderation, prize drawing system, participation charts
**Addresses:** Admin dashboard, prize drawing, content management (table stakes / differentiators)
**Avoids:** Content moderation risk (#8 -- admin review before public visibility), gaming (#7 -- admin spot-check capability)

### Phase 5: Polish + Launch Prep
**Rationale:** Final mobile UX testing, Cloudinary monitoring setup, edge case handling. This is buffer time -- if Phases 1-3 run clean, Phase 5 absorbs Phase 4 admin work.
**Delivers:** Mobile UX polish, Cloudinary usage monitoring, "NSC Player" badge admin toggle, launch checklist verification
**Addresses:** Mobile-first design refinement, registration tie-in
**Avoids:** Launch-day surprises

### Phase Ordering Rationale

- **Auth before everything** because every subsequent feature requires knowing which family/kid is acting
- **Submission + Leaderboard together** because they form the core engagement loop -- testing one without the other is meaningless
- **Streaks/badges after leaderboard** because they are pure computation on top of existing submission data -- no new infrastructure, just display logic
- **Admin tooling deferred** because Johnny can manually manage Week 1 content and use external tools for the first drawing if needed
- **Polish is explicit buffer** because the 9-day timeline has no slack and something will slip

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Auth):** Magic link delivery testing across email clients (Gmail, Apple Mail, Outlook) and in-app browsers. Must be validated before launch, not just assumed to work.
- **Phase 1 (Cloudinary):** Upload preset configuration specifics -- duration limits, resolution caps, and eager transformation syntax need to be verified against current Cloudinary docs (API surface changes frequently).
- **Phase 2 (Submission):** Daily cap enforcement via unique constraints -- the exact constraint definition needs careful design to handle timezone edge cases.

Phases with standard patterns (skip research):
- **Phase 3 (Streaks/Badges):** Pure computation from submission dates. Well-understood SQL patterns. No research needed.
- **Phase 4 (Admin):** Extends existing admin panel with established CRUD patterns already in the codebase.
- **Phase 4 (Prize Drawing):** `crypto.randomInt()` weighted selection is a solved problem.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Nearly everything is already installed. One new npm package. Sources are official docs + existing codebase analysis. |
| Features | HIGH | Feature list informed by existing mockup, proposal doc, and established gamification patterns. COPPA analysis is the only MEDIUM area. |
| Architecture | HIGH | Architecture follows proven patterns already in the codebase. Direct-to-Cloudinary upload is well-documented. |
| Pitfalls | HIGH | All critical pitfalls are well-documented in official sources. Cloudinary credit math verified against pricing docs. |

**Overall confidence:** HIGH

### Gaps to Address

- **Cloudinary free tier math under real conditions:** The storage/credit projections assume typical usage. If participation exceeds 50 families or parents upload longer/higher-res videos, credits will run out. Need a monitoring plan and a go/no-go threshold for upgrading to the $89/month plan mid-campaign.
- **SendGrid deliverability for magic links:** The site already uses SendGrid for transactional email, but magic links are more time-sensitive. SPF/DKIM/DMARC status for nipomosoccer.com needs to be verified. PITFALLS.md recommends Resend but STACK.md correctly overrides this -- SendGrid is already paid and integrated.
- **COPPA legal exposure:** The parent-mediated model is a strong practical mitigation but is not a guaranteed exemption. If the club plans to scale this feature beyond a single summer campaign, legal review is warranted. For an 8-week community campaign with 50-100 families, the risk is low.
- **Cloudinary Upload Widget mobile behavior:** The widget is documented as mobile-responsive, but real-world testing on iPhone Safari (camera roll access, .mov handling, progress indicators) is essential before launch. This cannot be validated by research alone.
- **Session behavior across Replit Autoscale restarts:** express-session + connect-pg-simple should persist sessions across deploys, but this needs to be tested explicitly during Phase 1. The combination is correct in theory but has not been used in this codebase before.

## Sources

### Primary (HIGH confidence)
- Cloudinary Upload Widget docs: https://cloudinary.com/documentation/upload_widget
- Cloudinary Upload Widget API reference: https://cloudinary.com/documentation/upload_widget_reference
- Cloudinary Node SDK (Context7): /cloudinary/cloudinary_npm
- Cloudinary pricing/credits: https://cloudinary.com/pricing, https://cloudinary.com/documentation/developer_onboarding_faq_credits
- Cloudinary transformation counting: https://cloudinary.com/documentation/transformation_counts
- Cloudinary unsigned upload security: https://support.cloudinary.com/hc/en-us/articles/208335975
- FTC COPPA FAQ: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- FTC COPPA 2025 Amendments: https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule
- Replit deployment docs: https://docs.replit.com/cloud-services/storage-and-databases/production-databases
- Existing codebase: ~/Projects/nipomo-soccer-website/ (HIGH -- read directly)
- Existing leaderboard mockup: marketing/summer-skills-challenge-leaderboard-mockup.html
- Existing proposal doc: marketing/summer-skills-challenge-proposal.html

### Secondary (MEDIUM confidence)
- Magic link deliverability patterns: https://securityboulevard.com/2026/04/how-email-infrastructure-impacts-otp-and-magic-link-authentication-success-rates/
- Replit free tier limitations: https://p0stman.com/guides/replit-limitations
- SendGrid free tier removal (May 2025): https://dev.to/thiago_alvarez_a7561753aa/resend-vs-sendgrid-2026-sendgrid-killed-its-free-tier-now-what-2gh4
- Streak design for engagement: https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/
- Trophy badge gamification examples: https://trophy.so/blog/badges-feature-gamification-examples

### Tertiary (LOW confidence)
- iPhone video file size estimates (~130MB/min at 1080p 30fps) -- varies significantly by device model and camera settings
- Neon free tier compute hours (100/month) -- sufficient for this scale but Replit's Neon integration specifics change frequently

---
*Research completed: 2026-05-28*
*Ready for roadmap: yes*
