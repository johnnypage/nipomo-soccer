# Feature Landscape

**Domain:** Community skills challenge / gamification web app (youth soccer)
**Researched:** 2026-05-28
**Build window:** ~9 days (May 28 -- Jun 6)
**Context:** Greenfield feature built into existing nipomosc.org (React + Express + Drizzle/Postgres on Replit). 8-week campaign, June 9 -- August 3. Free, participation-based, targets non-technical parents in a small town.

## Table Stakes

Features users expect. Missing = the challenge feels broken or parents stop participating.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Challenge hub page** (`/challenge`) | Central landing page. Parents need one URL to understand, sign up, and participate. Without it there's no campaign. | Low | Static-ish content with dynamic "this week" card. 8 weeks of content already defined in proposal doc. |
| **Family signup with email** | Parents must create an account to submit videos. Email is the identity. No account = no participation, no email capture. | Medium | Single email field + name. Magic link or simple code-based auth. Must capture email for marketing list. |
| **Multi-child profiles** | Nipomo families commonly have 2-3 kids in different age tracks. If a parent has to create separate accounts per kid, they won't do it. | Medium | Parent account is the auth entity. Children are profiles under it (name, age/grade, age track). Parent picks which kid when submitting. |
| **Video submission flow** | The core action. Parents film their kid, upload the video, get confirmation. If this is clunky on a phone, the whole campaign fails. | High | Cloudinary direct upload widget handles format conversion (iPhone .mov, Android .mp4). Must show progress bar. Accept up to 100MB (Cloudinary free tier limit). Camera-first on mobile (capture="environment"). |
| **Points tracking** | Each submission = 1 point = 1 raffle entry. Parents and kids need to see their point total. Without visible points, there's no motivation loop. | Low | Simple counter. 1 skill + 1 fitness per day + 1 video bonus per week = max 15 points/week. Store as submission records, derive points from count. |
| **Public leaderboard** | The competitive/social proof engine. Parents show their kids where they rank. Kids want to climb. Without it, the challenge is just submitting into a void. | Medium | Ranked list by total points. Top-3 podium treatment. Filter by age track (All / Little Kicks / Starter / Advanced). Mobile-responsive. Mockup already exists. |
| **Weekly challenge content display** | Parents need to know what this week's challenge is, see the instructional video, and understand the age-track variations. | Low | Content cards showing skill name, description per track, embedded video (YouTube/hosted), countdown to week end. Admin-managed but could be hardcoded for v1. |
| **Prize information display** | Parents and kids need to see what they're playing for. Weekly prizes + grand prize must be visible. | Low | Static display cards. Weekly prizes section + grand prize callout. Already designed in mockup. |
| **Mobile-first responsive design** | 95%+ of submissions will come from phones. Parents film on their phone and upload immediately. Desktop is an afterthought. | Medium | The mockup is already mobile-responsive. Every interaction (signup, submit, leaderboard) must work flawlessly on iPhone Safari and Android Chrome. |
| **Submission confirmation** | After uploading, parents need to know it worked. No confirmation = they upload again or assume it's broken. | Low | Success screen with point awarded, updated total, and position on leaderboard. |

## Differentiators

Features that set the challenge apart from a generic "upload and win" contest. Not expected, but they drive engagement and retention.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Streak tracking + streak badges** | Consecutive-day participation creates habit loops. Duolingo proved streaks drive retention (14% improvement at day 14). A "7-Day Streak" badge is social proof of commitment. | Medium | Track consecutive days with submissions. Display streak count on leaderboard. Award badges at 3, 7, 14, 21+ day thresholds. No streak freeze needed -- this is 8 weeks, keep it simple. |
| **Achievement badges** | Visual recognition beyond just points. "NSC Player" badge for registered members, "Fitness All-Star" for completing all fitness bonuses, "Perfect Week" for max points in a week. | Medium | 5-7 badge types max. Computed from submission data. Displayed on leaderboard rows and player profiles. Already designed in mockup (NSC Player, streak badges, Fitness All-Star, etc.). |
| **Player profiles** | A page per child showing their challenge history, badges, streak, and total points. Parents share these ("look how many challenges my kid did"). | Medium | Simple profile page at `/challenge/player/:id`. Shows name, age track, points, badges, submission history (dates, not videos). Link from leaderboard rows. |
| **Activity feed** | "Recent Activity" showing real-time submissions ("Mateo L. submitted Week 3 Passing challenge -- 12 min ago"). Creates sense of community momentum. | Low | Last 10-20 submissions, reverse chronological. Name, action, time ago. Already in mockup. Can be derived from submissions table. |
| **Admin prize drawing tool** | Admin triggers a weighted random drawing (each point = 1 entry). Produces a winner with a verifiable, transparent result. Beats manually counting names in a spreadsheet. | Medium | Weighted random selection using crypto.getRandomValues(). Admin inputs number of winners, system selects from all points earned that week (or all-time for grand prize). Display winner name + entry count. |
| **"NSC Player" badge for registered players** | Subtle registration incentive. Registered ROOTS/RISE/REIGN players get a visible badge. Everyone can play, but registered players "look cooler doing it." | Low | Boolean flag on child profile. Admin can mark kids as registered, or check against a registration list. No automated verification needed for v1. |
| **Instructional video watch tracking** | 1 bonus point per week for watching the instructional video. Ensures kids actually learn the technique before practicing. | Low-Med | Track whether parent marked "watched" per week per child. Could be a simple checkbox ("We watched the video") rather than actual video completion tracking. Honor system is fine for a community challenge. |

## Anti-Features

Features to explicitly NOT build. These will consume build time without proportional value, or they actively harm the experience.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Video judging / skill scoring** | The entire philosophy is participation-based ("you don't have to be good, you just have to do it"). Judging kills inclusivity and creates admin burden. | Points are earned by submitting, not by quality. Every submission = 1 point, period. |
| **Social media auto-posting** | Integration complexity with Instagram/Facebook APIs is high. OAuth flows, content policies, rate limits. Not worth it for 8 weeks. | Johnny and Ashley manually reshare submissions to social. Keep the video URLs accessible to admin for easy download/reshare. |
| **Email automation sequences** | Mailchimp/SendGrid drip campaigns add integration complexity. The proposal says "manual sends for v1." | Store emails in the database. Export as CSV for manual email sends. Or use the existing SendGrid integration on the site for one-off blasts. |
| **Password-based auth** | Parents are non-technical. Password creation, password reset flows, "forgot password" -- all unnecessary friction. | Magic link or email code auth. One field: email. Click link or enter code. Done. |
| **Native mobile app** | 9-day build window. A mobile app is months of work. The web app must be mobile-first but it's still a website. | Progressive enhancement: camera access via `<input type="file" accept="video/*" capture>`, full-screen upload flow, "Add to Home Screen" prompt. |
| **Real-time leaderboard (WebSockets)** | The site already has WebSocket infrastructure (ws in package.json), but real-time updates are overkill. Submissions happen a few times per day per user, not per second. | Leaderboard refreshes on page load. React Query with a reasonable stale time (60 seconds). Poll if needed. |
| **Video playback / gallery** | Hosting and streaming video in-app burns through Cloudinary bandwidth (25GB free tier). With 50-100+ submissions, playback would exhaust the free tier fast. | Store video URLs for admin access. Leaderboard shows points and badges, not videos. Admin downloads videos for social resharing. |
| **User-to-user messaging / comments** | Community features add moderation burden and COPPA complexity. Not needed for a challenge where the social layer lives on Instagram/Facebook. | Activity feed provides community feel. Social interaction happens on the club's Instagram. |
| **Complex admin CMS** | Building a full content management system for 8 weeks of pre-defined content is over-engineering. | Hardcode week 1-8 challenge content in the database seed or admin UI with simple CRUD forms. The content is already fully defined in the proposal doc. |
| **Oauth / Google sign-in** | Adds dependency on third-party auth providers. Magic links are simpler and more inclusive (not everyone has Google). | Email-only auth. |
| **Multi-language support (i18n)** | Nipomo has a significant Spanish-speaking population, but building full i18n in 9 days adds complexity to every string in the app. | Write copy in clear, simple English. Consider a "Spanish" toggle for key pages as a post-launch enhancement if demand warrants it. |

## Feature Dependencies

```
Family Signup (email + auth)
  |-> Multi-Child Profiles (children belong to a parent account)
       |-> Video Submission (submit requires selecting a child + current challenge)
            |-> Points Tracking (derived from submission count)
                 |-> Leaderboard (ranked by points)
                 |-> Prize Drawing (weighted by points)
            |-> Streak Tracking (derived from consecutive submission dates)
                 |-> Badges (computed from streaks, points, submission patterns)
                      |-> Player Profiles (display badges, history)

Challenge Content Management (admin)
  |-> Weekly Challenge Display (what's shown on /challenge)
       |-> Video Submission (must know which challenge week is active)
       |-> Instructional Video Embed (watch tracking for bonus point)

Activity Feed (derived from submissions -- no dependency beyond submissions existing)

Prize Drawing (depends on points data + admin trigger)
```

**Critical path:** Signup -> Multi-Child -> Submission -> Points -> Leaderboard. Everything else layers on top.

## MVP Recommendation

**Prioritize (must ship by June 6):**

1. **Family signup with magic link auth + multi-child profiles** -- Without this, nobody can participate. This is the foundation.
2. **Video submission flow via Cloudinary** -- The core action of the entire campaign. Must work flawlessly on mobile.
3. **Points tracking + public leaderboard** -- The motivation engine. Kids need to see their name and rank.
4. **Weekly challenge content display** -- Parents need to know what to do this week. Can be admin-seeded, doesn't need a fancy CMS.
5. **Streak tracking + badges** -- The engagement differentiator. Computed from submission data, so it's mostly display logic once submissions work.

**Ship if time allows (nice-to-have for launch):**

6. **Player profiles** -- Useful for social sharing but the leaderboard serves most of the same purpose.
7. **Activity feed** -- Simple query, adds community feel. Worth building if there's a spare afternoon.
8. **Admin prize drawing tool** -- Weekly drawings start Week 1 (June 14). Could be a simple admin-only page that runs a weighted random selection. If not ready for launch, Johnny can use an external tool (RandomPicker) for the first drawing.
9. **Instructional video watch tracking** -- The 1 bonus point per week for watching. Could launch as an honor-system checkbox.

**Defer to post-launch:**

10. **Email export / marketing integration** -- Emails are captured at signup. Export/integration can happen anytime.
11. **Sponsor attribution / display** -- Static content, can be added to challenge page whenever sponsors are confirmed.

## COPPA Considerations

Videos of children under 13 are "personal information" under COPPA. However, this app is **parent-directed**, not child-directed:
- Parents create the account (their email, their consent)
- Parents upload the videos (acting on behalf of their children)
- Children never directly interact with the app
- The app doesn't collect information directly from children

This parent-mediated model is the standard COPPA-compliant approach used by youth sports platforms. The parent's account creation constitutes verifiable parental consent. No additional COPPA consent mechanism is needed, but a brief privacy notice at signup is good practice ("By signing up, you consent to your child's name and submitted videos being displayed on the public leaderboard").

## Cloudinary Free Tier Budget

| Resource | Free Tier | Estimated Usage (8 weeks) | Risk |
|----------|-----------|--------------------------|------|
| Storage | 25 GB (shared credits) | ~50-100 videos x 30MB avg = 1.5-3 GB | LOW |
| Bandwidth | 25 GB (shared credits) | Admin downloads only (no public playback) = <1 GB | LOW |
| Video file size | 100 MB max | Most phone videos <50MB for 30-60 sec clips | LOW |
| Transformations | 25,000 | Thumbnail generation only = ~100-200 | LOW |

**Key insight:** By NOT streaming videos back to users (no gallery/playback feature), bandwidth stays minimal. Videos are stored for admin access and social resharing, not public consumption. This is the right trade-off for the free tier.

## Sources

- [Cloudinary Upload Widget docs](https://cloudinary.com/documentation/upload_widget)
- [Cloudinary Free Tier pricing](https://cloudinary.com/pricing)
- [Cloudinary Video Best Practices](https://cloudinary.com/documentation/video_best_practices)
- [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [Trophy - Streak design for long-term growth](https://trophy.so/blog/designing-streaks-for-long-term-user-growth)
- [Trophy - Badge gamification examples](https://trophy.so/blog/badges-feature-gamification-examples)
- [Nudge - Leaderboard gamification ideas](https://www.nudgenow.com/blogs/gamification-leaderboard-ideas-engagement)
- [Yu-kai Chou - Streak design rules (Duolingo)](https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/)
- [Postmark - Magic links guide](https://postmarkapp.com/blog/magic-links)
- [SuperTokens - Magic link implementation](https://supertokens.com/blog/magiclinks)
- [RandomPicker - Weighted raffle tool](https://www.randompicker.com/)
- [Uploadcare - Large file upload handling](https://uploadcare.com/blog/handling-large-file-uploads/)
- [Storyly - Gamification best practices](https://www.storyly.io/post/best-gamification-practices-to-boost-user-engagement)
- [Existing leaderboard mockup](marketing/summer-skills-challenge-leaderboard-mockup.html)
- [Board proposal with full challenge calendar](marketing/summer-skills-challenge-proposal.html)
