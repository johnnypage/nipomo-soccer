# Requirements: Summer Skills Challenge

**Defined:** 2026-05-28
**Core Value:** Parents can easily submit their kids' challenge videos and see them climb a live leaderboard -- frictionless participation that rewards consistency.

## v1 Requirements

Requirements for launch (June 9, 2026). Each maps to roadmap phases.

### Auth & Accounts

- [x] **AUTH-01**: Parent can sign up with email address (no password)
- [x] **AUTH-02**: Parent receives magic link email to log in
- [x] **AUTH-03**: Parent session persists across browser refresh (cookie-based)
- [x] **AUTH-04**: Parent can add multiple child profiles under their account (name, grade, age track auto-assigned)
- [ ] **AUTH-05**: Parent can select which child they're submitting for

### Challenge Content

- [ ] **CHAL-01**: Challenge hub page at /challenge shows current week's skill challenge with age-track variations
- [ ] **CHAL-02**: Each week displays instructional video embed (YouTube) per age track
- [ ] **CHAL-03**: Fitness bonus displayed alongside each week's skill challenge
- [ ] **CHAL-04**: Challenge page shows which week is currently active based on date
- [x] **CHAL-05**: All 8 weeks of challenge content are pre-loaded (from proposal doc)

### Video Submission

- [ ] **SUB-01**: Parent can upload video from phone (accepts .mov, .mp4, common mobile formats)
- [ ] **SUB-02**: Video uploads directly to Cloudinary (not through server) with progress indicator
- [ ] **SUB-03**: Parent selects child + challenge type (skill or fitness bonus) when submitting
- [ ] **SUB-04**: System enforces daily cap: max 1 skill submission + 1 fitness submission per child per day
- [ ] **SUB-05**: Parent sees confirmation with points awarded and updated total after submission
- [ ] **SUB-06**: File size capped at 50MB with clear error message if exceeded

### Points & Gamification

- [ ] **PTS-01**: Each submission earns 1 point (1 point = 1 raffle entry)
- [ ] **PTS-02**: Watching weekly instructional video earns 1 bonus point per child per week (honor-system checkbox)
- [ ] **PTS-03**: Points are cumulative across all 8 weeks
- [x] **PTS-04**: Streak tracking: consecutive days with at least 1 submission per child
- [x] **PTS-05**: Streak badges awarded at 3-day, 7-day, 14-day, and 21-day thresholds
- [x] **PTS-06**: Achievement badges: "Perfect Week" (max points in a week), "Fitness All-Star" (all 8 fitness bonuses)
- [x] **PTS-07**: "Summer Champion" badge for kids who complete all 8 weeks (at least 1 submission per week). Comes with a physical reward (t-shirt or challenge coin).

### Leaderboard

- [ ] **LDR-01**: Public leaderboard page at /challenge/leaderboard showing all participants ranked by total points
- [ ] **LDR-02**: Leaderboard filterable by age track (All / Little Kicks / Starter / Advanced)
- [ ] **LDR-03**: Top 3 players get podium-style visual treatment
- [ ] **LDR-04**: Each row shows child name (first name + last initial), age track, total points, current streak, badges
- [ ] **LDR-05**: "NSC Player" badge visible on registered ROOTS/RISE/REIGN players (admin-set flag)
- [ ] **LDR-06**: Leaderboard uses first name + last initial only (COPPA compliance)

### Player Profiles

- [x] **PROF-01**: Each child has a profile page at /challenge/player/:id
- [x] **PROF-02**: Profile shows name, age track, total points, streak, and all earned badges
- [x] **PROF-03**: Profile shows submission history (dates and challenge names, not videos)
- [x] **PROF-04**: Profile is linkable from leaderboard rows

### Admin

- [ ] **ADM-01**: Admin can view all submissions with Cloudinary video URLs (for social resharing)
- [ ] **ADM-02**: Admin can manage weekly challenge content (add/edit challenge text, video URLs)
- [ ] **ADM-03**: Admin can trigger weighted prize drawing (each point = 1 entry) for weekly and grand prize
- [ ] **ADM-04**: Admin can mark children as "NSC Player" (registered members)
- [ ] **ADM-05**: Admin can view and export email list from signups

### Privacy & Compliance

- [x] **PRIV-01**: Signup includes brief privacy/consent notice ("By signing up, you consent to your child's first name and challenge participation being displayed on the public leaderboard")
- [ ] **PRIV-02**: Leaderboard displays first name + last initial only (never full last name)
- [ ] **PRIV-03**: Videos are not publicly viewable -- admin-only access via Cloudinary URLs

## v2 Requirements

Deferred to post-launch or mid-campaign enhancements.

### Engagement

- **ENG-01**: Activity feed showing recent submissions ("Mateo L. submitted Week 3 Passing -- 12 min ago")
- **ENG-02**: "Add to Home Screen" PWA prompt for mobile users
- **ENG-03**: Spanish language toggle for key pages

### Marketing Integration

- **MKT-01**: Automated weekly challenge email (Monday) via SendGrid
- **MKT-02**: Automated winner announcement email (Saturday) via SendGrid
- **MKT-03**: Sponsor attribution section on challenge page

### Analytics

- **ANL-01**: Submission analytics dashboard (submissions per day, per week, per age track)
- **ANL-02**: Conversion tracking: challenge signups who register for ROOTS

## Out of Scope

| Feature | Reason |
|---------|--------|
| Video playback/gallery | Burns Cloudinary free tier bandwidth. Videos stored for admin, not public streaming. |
| Video judging/scoring | Philosophy is participation-based. Every submission = 1 point, period. |
| Password-based auth | Magic links are simpler for non-technical parents. No password reset flow needed. |
| Social media auto-posting | API integration complexity not worth it for 8-week campaign. Manual resharing. |
| Native mobile app | 9-day build window. Mobile-responsive web is sufficient. |
| Real-time WebSocket updates | Overkill for submissions that happen a few times per day per user. |
| User-to-user messaging | Adds moderation burden and COPPA complexity. Social layer lives on Instagram. |
| OAuth (Google/Facebook login) | Magic links are more inclusive and simpler. |
| Email drip sequences | Manual sends sufficient for v1. Emails captured for future use. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| AUTH-05 | Phase 1 | Pending |
| CHAL-01 | Phase 2 | Pending |
| CHAL-02 | Phase 2 | Pending |
| CHAL-03 | Phase 2 | Pending |
| CHAL-04 | Phase 2 | Pending |
| CHAL-05 | Phase 1 | Complete |
| SUB-01 | Phase 2 | Pending |
| SUB-02 | Phase 2 | Pending |
| SUB-03 | Phase 2 | Pending |
| SUB-04 | Phase 2 | Pending |
| SUB-05 | Phase 2 | Pending |
| SUB-06 | Phase 2 | Pending |
| PTS-01 | Phase 2 | Pending |
| PTS-02 | Phase 2 | Pending |
| PTS-03 | Phase 2 | Pending |
| PTS-04 | Phase 3 | Complete |
| PTS-05 | Phase 3 | Complete |
| PTS-06 | Phase 3 | Complete |
| PTS-07 | Phase 3 | Complete |
| LDR-01 | Phase 2 | Pending |
| LDR-02 | Phase 2 | Pending |
| LDR-03 | Phase 2 | Pending |
| LDR-04 | Phase 2 | Pending |
| LDR-05 | Phase 2 | Pending |
| LDR-06 | Phase 2 | Pending |
| PROF-01 | Phase 3 | Complete |
| PROF-02 | Phase 3 | Complete |
| PROF-03 | Phase 3 | Complete |
| PROF-04 | Phase 3 | Complete |
| ADM-01 | Phase 4 | Pending |
| ADM-02 | Phase 4 | Pending |
| ADM-03 | Phase 4 | Pending |
| ADM-04 | Phase 4 | Pending |
| ADM-05 | Phase 4 | Pending |
| PRIV-01 | Phase 1 | Complete |
| PRIV-02 | Phase 2 | Pending |
| PRIV-03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0

---
*Requirements defined: 2026-05-28*
*Last updated: 2026-05-28 after roadmap creation*
