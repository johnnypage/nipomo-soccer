# Roadmap: Summer Skills Challenge

## Overview

This roadmap delivers an 8-week video submission and gamification feature built into nipomosc.org. The build follows a strict dependency chain: family auth and data models first, then the core submission-to-leaderboard loop, then the engagement layer (streaks, badges, profiles), and finally admin tooling. Four phases, driven by the natural clustering of 39 requirements. Website functional by June 6, challenge launches June 9.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Family Auth & Data Foundation** - Magic link auth, multi-kid profiles, database schema, Cloudinary config, challenge data seeded
- [ ] **Phase 2: Core Loop** - Challenge display, video submission, points, leaderboard -- the complete participation cycle
- [x] **Phase 3: Engagement & Profiles** - Streaks, badges, player profiles -- the retention layer
- [ ] **Phase 4: Admin Tooling** - Challenge management, submission review, prize drawing, email export
- [ ] **Phase 5: Pre-Launch Testing & Data Setup** - End-to-end testing with sample content, then wipe clean for go-live

## Phase Details

### Phase 1: Family Auth & Data Foundation
**Goal**: Parents can create accounts, add their kids, and the system is ready to accept submissions
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, PRIV-01, CHAL-05
**Success Criteria** (what must be TRUE):
  1. Parent can sign up with email, receive a magic link, and land in an authenticated session that persists across browser refreshes
  2. Parent can add multiple children to their account with name and grade, and each child is auto-assigned to the correct age track (Little Kicks / Starter / Advanced)
  3. Parent can select which child they are acting on behalf of
  4. Signup flow includes a visible privacy/consent notice about public leaderboard display
  5. All 8 weeks of challenge content exist in the database (seeded from proposal doc)
**Plans:** 3 plans in 3 waves
Plans:
**Wave 1**
- [x] 01-01-PLAN.md -- Schema, validation schemas, and session middleware (data foundation)
**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-02-PLAN.md -- Server API routes, auth flow, kid CRUD, challenge seed, db:push
**Wave 3** *(blocked on Wave 2 completion)*
- [x] 01-03-PLAN.md -- Client UI: hooks, components, pages, routing for signup and challenge hub
**UI hint**: yes

### Phase 2: Core Loop
**Goal**: Parents can submit challenge videos and see their kids climb a live leaderboard -- the complete participation cycle works end to end
**Depends on**: Phase 1
**Requirements**: CHAL-01, CHAL-02, CHAL-03, CHAL-04, SUB-01, SUB-02, SUB-03, SUB-04, SUB-05, SUB-06, PTS-01, PTS-02, PTS-03, LDR-01, LDR-02, LDR-03, LDR-04, LDR-05, LDR-06, PRIV-02, PRIV-03
**Success Criteria** (what must be TRUE):
  1. Parent visiting /challenge sees the current week's skill challenge with age-track variations, fitness bonus, and embedded instructional video
  2. Parent can upload a video from their phone (accepts .mov and .mp4, max 50MB) with a visible progress indicator, and the video goes directly to Cloudinary without touching the server
  3. System enforces daily submission caps (1 skill + 1 fitness per child per day) and shows confirmation with points awarded after each submission
  4. Public leaderboard at /challenge/leaderboard ranks all participants by total points, is filterable by age track, shows first name + last initial only, and gives top 3 podium-style treatment
  5. Registered NSC players display an "NSC Player" badge on the leaderboard, and videos are accessible only to admins (not publicly viewable)
**Plans:** 5 plans in 4 waves
Plans:
**Wave 1**
- [x] 02-01-PLAN.md -- Submissions schema, validation schemas, Cloudinary widget script + TypeScript declarations, db:push
**Wave 2** *(blocked on Wave 1 completion)*
- [x] 02-02-PLAN.md -- Server API routes: submission recording, video bonus, submission status, public leaderboard
**Wave 3** *(blocked on Wave 2 completion, parallel pair)*
- [x] 02-03-PLAN.md -- Client hooks (useCloudinaryUpload, useSubmissions) and submission components (SubmitButton, VideoBonusCheckbox, ChallengeCard, TrackPill, PointsDisplay)
- [x] 02-05-PLAN.md -- Public leaderboard page with hero, podium, player rows, age track tabs, route wiring
**Wave 4** *(blocked on Wave 3 / Plan 03 completion)*
- [x] 02-04-PLAN.md -- Challenge hub rewrite: WeekNavigation, PastWeekRow, integrate submission flow into /challenge page
**UI hint**: yes

### Phase 3: Engagement & Profiles
**Goal**: Kids earn visible streak and achievement badges that keep them coming back, and each participant has a shareable profile page
**Depends on**: Phase 2
**Requirements**: PTS-04, PTS-05, PTS-06, PTS-07, PROF-01, PROF-02, PROF-03, PROF-04
**Success Criteria** (what must be TRUE):
  1. System tracks consecutive-day streaks per child and awards badges at 3-day, 7-day, 14-day, and 21-day thresholds
  2. Achievement badges are awarded for "Perfect Week" (max points in a week), "Fitness All-Star" (all 8 fitness bonuses), and "Summer Champion" (at least 1 submission every week)
  3. Each child has a profile page at /challenge/player/:id showing name, age track, total points, streak, earned badges, and submission history (dates and challenge names)
  4. Leaderboard rows link to player profiles, and profiles display streak badges and achievement badges
**Plans:** 3 plans in 3 waves
Plans:
**Wave 1**
- [x] 03-01-PLAN.md -- Badge definitions, streak/badge computation, player profile API endpoint, enhanced leaderboard API
**Wave 2** *(blocked on Wave 1 completion)*
- [x] 03-02-PLAN.md -- BadgeIcon/StreakBadge components, PlayerRow/PodiumCard links + streak indicators, leaderboard page updates
**Wave 3** *(blocked on Wave 2 completion)*
- [x] 03-03-PLAN.md -- Player profile page at /challenge/player/:id with route registration
**UI hint**: yes

### Phase 4: Admin Tooling
**Goal**: Johnny can manage weekly challenges, review submissions for social resharing, run prize drawings, and export the email list
**Depends on**: Phase 2
**Requirements**: ADM-01, ADM-02, ADM-03, ADM-04, ADM-05
**Success Criteria** (what must be TRUE):
  1. Admin can view all submissions with Cloudinary video URLs (for manual social resharing)
  2. Admin can add and edit weekly challenge content (text, video URLs) and mark children as "NSC Player"
  3. Admin can trigger a weighted prize drawing where each point equals one raffle entry, for both weekly and grand prizes
  4. Admin can view and export the email list from all signups
**Plans**: TBD
**UI hint**: yes

### Phase 5: Pre-Launch Testing & Data Setup
**Goal**: Complete end-to-end testing of every user flow with real sample content before launch, then wipe all test data clean for go-live
**Depends on**: Phase 3 and Phase 4 (both must be complete)
**Requirements**:
- Shift challenge week dates so current week is "active" for testing
- Seed sample challenge content (titles, descriptions, instructional video URLs) for at least 2 weeks
- Test full submission flow: Cloudinary upload, points awarded, daily cap enforced
- Test leaderboard with multiple kids across all 3 age tracks
- Test streak and badge logic with multi-day submissions
- Test player profile pages
- Test all admin functions: submission review, challenge editing, prize drawing, email export
- Test magic link flow on mobile devices
- Verify Cloudinary free tier usage tracking within limits
- Create a "wipe test data" admin action or script that resets families/kids/submissions but preserves challenge content
- Verify production readiness: error handling, edge cases, mobile responsiveness
**Success Criteria** (what must be TRUE):
  1. All user flows tested end-to-end on live Replit deployment with real Cloudinary uploads
  2. Admin can manage challenges, review submissions, run prize drawing, and export emails
  3. Leaderboard displays correctly with kids across all age tracks, with badges and streaks visible
  4. A clean "reset for launch" script exists that wipes test families/kids/submissions while preserving challenge content
  5. Mobile testing confirms signup, upload, and leaderboard work on phone browsers
**Plans**: TBD
**UI hint**: no

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5
Note: Phase 3 and Phase 4 both depend on Phase 2 and could theoretically run in parallel. Phase 5 requires both 3 and 4.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Family Auth & Data Foundation | 3/3 | Complete | 2026-05-29 |
| 2. Core Loop | 5/5 | In Progress | - |
| 3. Engagement & Profiles | 3/3 | Complete | 2026-05-29 |
| 4. Admin Tooling | 0/? | Not started | - |
| 5. Pre-Launch Testing & Data Setup | 0/? | Not started | - |
