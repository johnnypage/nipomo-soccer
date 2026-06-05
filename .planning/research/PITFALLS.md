# Domain Pitfalls

**Domain:** Community video submission + gamification web app (youth sports)
**Researched:** 2026-05-28

## Critical Pitfalls

Mistakes that cause rewrites, data loss, legal exposure, or blocked launches.

### Pitfall 1: Cloudinary Free Tier Exhaustion Mid-Campaign

**What goes wrong:** The 25-credit monthly limit gets burned through faster than expected. Video transformations consume credits per second of video (2 transforms/sec for SD, 4/sec for HD). iPhone videos are commonly recorded in HD or 4K. A single 30-second HD upload costs ~0.12 credits in transformations alone, plus storage and bandwidth credits when the video is viewed. With 100 kids submitting even modest videos, the math breaks quickly: 100 kids x 2 submissions/day x 30 sec average x 30 days = 180,000 seconds of video. At HD rates, that is 720,000 transformations alone (14.4 credits), before counting storage (potentially 5-10 GB) and bandwidth (every leaderboard page view that loads video thumbnails). The rolling 30-day window means credits never fully "reset" while the campaign is active.

**Why it happens:** People see "25 GB storage" and think they have plenty of room, but credits are shared across storage, bandwidth, and transformations. Video is dramatically more expensive than images across all three dimensions.

**Consequences:** Cloudinary stops serving assets when credits are exceeded. The leaderboard goes blank, uploads fail, and parents see broken pages mid-campaign. Recovering requires upgrading to a paid plan ($89/month minimum) with no warning.

**Prevention:**
- Enforce video duration limits client-side (max 30 seconds, ideally 15 seconds). This is the single highest-leverage decision in the entire project.
- Enforce resolution limits via the Cloudinary upload preset: cap at 720p. iPhones default to 1080p or 4K, and every pixel multiplied by every second burns credits.
- Use Cloudinary's `eager` transformations on upload to generate a single compressed derivative, then serve only that version. Do not allow on-the-fly transformations.
- Store only the compressed derivative; delete the raw upload after transformation completes.
- Build a usage monitoring dashboard (Cloudinary API exposes current credit usage) and set an alert at 60% and 80% usage.
- Have a fallback plan: if credits approach the limit, disable video playback on the leaderboard (show thumbnail/placeholder only) and link to the video on a separate page to reduce bandwidth.
- Budget $89/month for the Cloudinary Plus plan as contingency. If the campaign succeeds, the free tier will not be enough.

**Detection:** Monitor Cloudinary usage dashboard weekly. Warning sign: credits above 40% by the end of Week 2.

**Phase:** Must be addressed in Phase 1 (data model/upload infrastructure). Upload preset configuration, duration limits, and resolution caps are foundational decisions.

**Confidence:** HIGH -- credit math based on official Cloudinary documentation.

---

### Pitfall 2: iPhone Video File Size and Format Chaos

**What goes wrong:** Modern iPhones record video in HEVC/H.265 codec inside .MOV containers, which can produce files that are 100-200 MB for a 30-60 second clip at default settings (1080p/4K). Parents will not change their camera settings. The Cloudinary free tier caps individual file uploads at 100 MB. Many parents will shoot video, tap upload, wait 3 minutes on a mediocre cell connection, and then see a timeout or failure with no helpful error message. They will not try again.

**Why it happens:** Developers test with small, pre-prepared files. Real parents are shooting in their backyard on an iPhone 15 with default 4K/60fps settings, then uploading over a congested home WiFi or cellular connection.

**Consequences:** The upload failure rate for first-time submissions could exceed 30-40% without intervention. Parents who experience a failed upload are unlikely to retry. You lose them permanently -- and their kids' participation with them.

**Prevention:**
- Client-side file size validation before upload begins. Show a clear message: "Your video is too large. Try recording a shorter clip (under 30 seconds) or switch your camera to 1080p." Provide a link to a simple "how to change iPhone camera settings" guide.
- Use Cloudinary's `upload_large` (chunked upload) method, which uploads in parts and handles network interruptions better than a single POST. This is available via the upload widget.
- Set the Cloudinary upload preset to auto-transcode to h264/mp4 at 720p on upload. This handles HEVC compatibility and reduces file size.
- Show a real progress bar during upload (Cloudinary widget supports this natively). Never show a spinner with no progress indication.
- If the upload is taking too long (> 60 seconds), show an encouraging message rather than letting the parent stare at a progress bar.
- Consider a max file size of 50 MB (not 100 MB) to stay well within Cloudinary limits and keep upload times reasonable on mobile.

**Detection:** Track upload success/failure rates from day one. If the failure rate exceeds 10% in the first week, the file size limits or UX guidance need immediate adjustment.

**Phase:** Phase 1 (upload infrastructure). The upload widget configuration and file validation logic must be right before any parent touches it.

**Confidence:** HIGH -- well-documented iPhone video behavior and Cloudinary limits.

---

### Pitfall 3: Magic Link Emails Landing in Spam or Not Arriving

**What goes wrong:** Magic link auth depends entirely on email deliverability. If the email doesn't arrive within 30-60 seconds, the parent gives up. A brand new sending domain (or a domain that has only sent marketing emails before) starts with zero or low reputation. Gmail, Yahoo, and Outlook may queue, delay, or spam-filter these emails. Studies show delivery rates as low as 55-60% for cold domains sending transactional email. If the email uses a tracking redirect, link shortener, or mismatched sender domain, spam filters flag it immediately.

**Why it happens:** Developers set up Nodemailer with Gmail SMTP or a basic SMTP service and assume emails will arrive. They don't realize that email deliverability requires DNS configuration (SPF, DKIM, DMARC records), domain warm-up, and a dedicated transactional email service separate from marketing email.

**Consequences:** 20-40% of parents who try to sign up never receive their magic link. They think the site is broken. They tell other parents the site doesn't work. Word-of-mouth kills the campaign before it starts.

**Prevention:**
- Use a managed transactional email service (Resend is the recommendation -- clean API, good free tier of 3,000 emails/month, built-in deliverability features). Do NOT use raw Nodemailer with a generic SMTP server.
- Set up SPF, DKIM, and DMARC DNS records for the nipomosoccer.com domain before launch. Verify them in the email service dashboard.
- Send magic link emails from a subdomain (e.g., mail.nipomosoccer.com) to isolate transactional email reputation from any marketing email.
- Disable click tracking and open tracking on magic link emails. Tracking rewrites links through a redirect domain, which is a major spam trigger.
- Keep the magic link email extremely simple: plain text or minimal HTML, no images, no marketing content. Subject: "Your Nipomo SC Login Link". Body: the link and nothing else.
- Set magic link expiry to 15 minutes (not 5 minutes). Parents might check email on a different device.
- Provide a "Didn't get the email? Check spam, or tap here to resend" flow. Include a fallback: if three resend attempts fail, show a support contact.
- Test deliverability to Gmail, Yahoo, Outlook, and iCloud BEFORE launch. Send test emails and verify inbox placement.

**Detection:** Track magic link send-to-click rates. If fewer than 80% of sent links are clicked within 15 minutes, you have a deliverability problem.

**Phase:** Phase 1 (auth infrastructure). DNS records need to be configured days before launch to allow propagation and reputation building.

**Confidence:** HIGH -- email deliverability problems are extremely well-documented and the #1 cause of magic link auth failure.

---

### Pitfall 4: COPPA Compliance Exposure

**What goes wrong:** This app collects children's first names, ages, and video/photo content -- all defined as "personal information" under COPPA. The website is explicitly directed at children (soccer challenges for ages 4-18). The 2025 COPPA amendments (effective June 23, 2025, with compliance required by April 22, 2026) tightened requirements around parental consent and third-party data sharing. Uploading children's videos to Cloudinary (a third party) and displaying children's names on a public leaderboard create specific compliance obligations.

**Why it happens:** Small community organizations assume COPPA only applies to big tech companies. It applies to ANY website or online service that is directed to children under 13 and collects personal information from them.

**Consequences:** FTC enforcement penalties of up to $50,120 per violation. Even without enforcement, a parent complaint about their child's video or name being publicly visible creates a PR crisis for a community youth sports club.

**Prevention (practical, not paranoid):**
- **Parent-mediated model is your strongest defense.** The parent creates the account, the parent enters the child's information, the parent uploads the video. The child never directly interacts with the site. This is not a guaranteed COPPA exemption, but it significantly reduces risk because you are collecting information FROM a parent, not FROM a child.
- **Use first name and last initial only** on the leaderboard (e.g., "Mateo L."), never full names. This is already shown in the mockup -- keep it.
- **Never display video content publicly without parent action.** Videos should be visible only on the child's profile page (which the parent controls), not auto-displayed on the leaderboard or activity feed.
- **Add a clear privacy notice** to the signup flow: "By creating an account, you consent to your child's first name, age group, and submitted videos being displayed on the Nipomo SC Summer Skills Challenge leaderboard." Keep it plain language, not legalese.
- **Provide a deletion mechanism.** Parents must be able to request removal of their child's data (name, videos, points) at any time. This is both a COPPA requirement and basic trust-building.
- **Do not enable comments, messaging, or any child-to-child interaction features.** These would trigger much stricter COPPA requirements.
- **Add a privacy policy page** covering: what data you collect, how it's used, that videos are stored on Cloudinary (third party), how parents can request deletion.
- **Non-profit status may provide a partial exemption** but should NOT be relied upon. The FTC has ruled that non-profits operated for commercial benefit (and ROOTS registration is commercial) may still be subject to COPPA.

**Detection:** If a parent asks "why is my child's video publicly visible?" and you don't have a clear answer backed by their documented consent, you have a problem.

**Phase:** Phase 1 (data model and signup flow). Privacy notice and consent capture must be baked into the signup flow from the start, not bolted on later.

**Confidence:** MEDIUM -- COPPA applicability to parent-mediated models in youth sports contexts is not explicitly addressed in FTC guidance. The risk is real but the parent-mediated approach is a strong practical mitigation. Consult a lawyer for definitive guidance if the club plans to scale this.

---

### Pitfall 5: Replit Data Loss on Redeploy

**What goes wrong:** Replit's deployed filesystem is ephemeral. Any data stored in local files (SQLite databases, JSON files, uploaded assets) is wiped on every redeploy. During a 9-day build sprint with frequent deploys, and then during the 8-week campaign with bug fixes and content updates, every deploy risks destroying all user data -- accounts, submissions, points, streaks.

**Why it happens:** Replit's development environment persists files, so developers test and see data survive. But when they deploy and then redeploy, the production filesystem is rebuilt from scratch. The site's existing codebase may already use patterns (file-based storage) that work in development but fail in production.

**Consequences:** Complete loss of all user data. Every parent's account, every child's points, every video submission record -- gone. The leaderboard resets to zero. There is no recovery.

**Prevention:**
- Use Replit's built-in PostgreSQL database for ALL persistent data (accounts, kids, submissions, points, streaks, challenge content). This persists independently of the filesystem.
- Never store application state in local files. No SQLite. No JSON files. No filesystem-based session stores.
- Test the redeploy scenario explicitly: deploy, create test data, redeploy, verify data survived. Do this during Phase 1, not after launch.
- Store video URLs (Cloudinary URLs) in PostgreSQL, not the videos themselves. Videos live on Cloudinary; your database only stores references.
- Back up the PostgreSQL database weekly during the campaign. Replit's built-in database does not have automatic backup.

**Detection:** If you can't answer "what happens to user data when I click Deploy?" with confidence, you have this problem.

**Phase:** Phase 1 (data model). The database choice is the first technical decision and everything depends on it.

**Confidence:** HIGH -- Replit's documentation explicitly states filesystem writes do not persist across deploys.

---

## Moderate Pitfalls

### Pitfall 6: Multi-Kid Account Confusion and Edge Cases

**What goes wrong:** A parent with 3 kids in different age tracks submits a video. Which kid is it for? They select the wrong kid. Now the 4-year-old has a submission for the Advanced track challenge. Or a parent creates separate accounts for each kid (using different email addresses) and now has to manage 3 magic link logins. Or two parents share custody and both want to submit for the same child.

**Prevention:**
- The "select which kid" step must be prominent and unmissable in the submission flow, not a dropdown that defaults to the first child.
- Show a confirmation screen before upload: "Submitting for [kid name] -- [age track] -- [challenge name]. Is this correct?"
- Allow admin to reassign submissions to different kids (for when parents mess up).
- Do not allow multiple accounts with the same child's name in the same age track. Surface a "this child may already be registered" warning.
- For v1, do not try to solve the shared custody problem. One account per family. Keep it simple.

**Phase:** Phase 2 (submission flow and family management).

**Confidence:** HIGH -- multi-child families are called out as common in Nipomo in the project docs.

---

### Pitfall 7: Leaderboard Gaming and Fairness Perception

**What goes wrong:** A parent submits the same 10-second video of their kid every day, earning points without the kid actually doing the challenge. Or a parent uploads 7 videos on Sunday to max out the week's points. Other parents see this and feel the system is unfair. The point of the challenge (daily practice) is undermined.

**Prevention:**
- Admin review queue: all submissions go to a "pending" state and earn points only after admin marks them as valid. This is the simplest moderation approach and doubles as content review.
- If admin review is too much work for daily submissions, use an "auto-approve with spot-check" model: submissions auto-earn points, but admin can review and remove points for duplicates or non-genuine submissions.
- Rate limit: maximum 1 skill submission + 1 fitness submission per kid per day. Enforce this in the database, not just the UI.
- Consider requiring video metadata (date/time) to match the submission date, though this is complex to implement and easy to circumvent.
- Communicate the honor system clearly: "We trust our families. Submissions that are clearly not genuine will be removed."

**Phase:** Phase 2 (submission flow and points system).

**Confidence:** MEDIUM -- this is a known pattern in gamified community systems, though the small-town community context may self-regulate.

---

### Pitfall 8: Content Moderation for User-Submitted Videos

**What goes wrong:** Someone uploads a video that isn't a kid doing a soccer drill. Could be accidental (wrong video from camera roll) or intentional (inappropriate content). In a system with children's content, even one inappropriate video visible to other parents is a trust-destroying event.

**Prevention:**
- Videos should NOT auto-display publicly. Keep submissions visible only to the submitting parent and admins until reviewed.
- Admin approval before any video appears on a public-facing page (profile, activity feed, or if you add video to the leaderboard).
- For the activity feed, show text activity ("Mateo L. submitted Week 3 Passing challenge") without embedding the actual video.
- Cloudinary offers AI moderation add-ons, but these are not on the free tier and add cost. For the scale of this campaign (sub-100 kids), manual admin review is more practical and more reliable.
- Provide a "flag/report" button on any visible video content.
- The admin dashboard should make reviewing submissions fast: thumbnail preview, one-click approve/reject, bulk actions.

**Phase:** Phase 2 (submission flow) and Phase 3 (admin dashboard).

**Confidence:** HIGH -- content moderation is a universal requirement for UGC platforms, especially those involving children.

---

### Pitfall 9: Cloudinary Unsigned Upload Abuse

**What goes wrong:** Cloudinary's direct upload from the browser requires an unsigned upload preset. If someone discovers the preset name (trivially visible in the page source), they can upload arbitrary files to your Cloudinary account, burning through your credits and potentially uploading inappropriate content.

**Prevention:**
- Restrict the unsigned upload preset to accept only video files (mp4, mov, webm). Block image and raw file uploads through the preset.
- Set a maximum file size on the upload preset (50 MB).
- Set a maximum video duration on the upload preset if Cloudinary supports it.
- Require authentication (magic link session) before the upload widget is even rendered. No anonymous uploads.
- Monitor Cloudinary storage for unexpected growth. If storage spikes without corresponding submissions in your database, someone may be abusing the preset.
- If abuse is detected, create a new upload preset with a different name and update the app. The old preset can be disabled.

**Phase:** Phase 1 (upload infrastructure).

**Confidence:** HIGH -- documented by Cloudinary's own security guidance.

---

### Pitfall 10: Magic Link UX Friction on Mobile

**What goes wrong:** Parent opens nipomosc.org on their phone. Types email. Switches to their email app. Finds the magic link. Taps it. The link opens in the email app's in-app browser (Gmail, Outlook) instead of their default browser. Now they're authenticated in one browser context but the page they were originally on is in a different context. Session doesn't carry over. They appear logged out.

**Prevention:**
- Set the magic link to open with a deep link or universal link pattern that forces the default browser. This is hard to guarantee across all email clients.
- More practical: after tapping the magic link and authenticating, redirect to the submission page (not the homepage). The parent should land exactly where they need to be.
- Store auth state in a cookie (not just in-memory session state) so that if the parent opens the site later in their regular browser, they're still logged in.
- Set session/cookie duration to at least 30 days. Parents should not have to re-authenticate every time they submit a video. Once per device for the whole campaign.
- Test the full flow on iPhone (Gmail app, Apple Mail, Safari) and Android (Gmail app, Chrome) before launch. This is the most common point of friction.

**Phase:** Phase 1 (auth infrastructure).

**Confidence:** HIGH -- in-app browser session issues are a widely documented problem with magic link auth.

---

## Minor Pitfalls

### Pitfall 11: Instructional Video Hosting Costs

**What goes wrong:** The weekly instructional videos are embedded on the challenge page. If these are hosted on Cloudinary, every page view of the challenge page streams video, burning through bandwidth credits rapidly. A challenge page viewed 500 times with a 3-minute video at 720p = ~25,000 seconds of bandwidth = significant credit consumption.

**Prevention:** Host instructional videos on YouTube (free, unlimited bandwidth) and embed them on the challenge page. Only user-submitted videos go to Cloudinary. This is probably already the plan but needs to be explicitly decided.

**Phase:** Phase 2 (challenge content management).

**Confidence:** HIGH -- straightforward bandwidth math.

---

### Pitfall 12: Week Transition Timing and Timezone Issues

**What goes wrong:** The challenge says "Week 3: Jun 23 - 29" but a parent submits at 11:30 PM on Sunday June 29 and it counts as Week 4 because the server is in UTC. Or the weekly challenge doesn't update at a time that makes sense for Pacific Time families.

**Prevention:**
- Define all week boundaries in Pacific Time (the club's timezone), not UTC.
- Store submission timestamps in UTC but apply Pacific Time conversion for all display and business logic.
- Set the weekly rollover to Monday at 12:00 AM Pacific (or Monday at 6:00 AM to give a buffer).
- Make it clear to parents: "New challenges drop every Monday morning."
- Allow late submissions for the previous week until Tuesday at midnight (grace period), or accept that some parents will be confused and handle it manually via admin tools.

**Phase:** Phase 2 (points system and challenge management).

**Confidence:** HIGH -- timezone bugs are one of the most common issues in time-bounded applications.

---

### Pitfall 13: Leaderboard Performance with Growing Data

**What goes wrong:** The leaderboard page queries every submission for every kid, calculates running totals, computes streaks, applies filters, and renders it all on every page load. By Week 6, with 50-100 kids and 2,000+ submissions, the query becomes slow and the page takes 3-5 seconds to load.

**Prevention:**
- Maintain a denormalized `leaderboard` table (or materialized view) with pre-computed totals: kid_id, total_points, current_streak, longest_streak, last_submission_date. Update this on each new submission, not on each page load.
- The leaderboard page should read from the pre-computed table (a single indexed query), never aggregate raw submissions.
- At the scale of this campaign (~100 kids, ~5,000 submissions over 8 weeks), this is unlikely to be a real performance problem with PostgreSQL. But building the denormalized pattern from the start prevents a rewrite later.

**Phase:** Phase 2 (leaderboard implementation).

**Confidence:** MEDIUM -- at this scale it's unlikely to be a real problem, but it's free to prevent.

---

### Pitfall 14: Parent Email Fatigue and Unsubscribes

**What goes wrong:** Parents sign up for the challenge and then get weekly emails (Monday challenge, Saturday recap). Some view these as spam, especially if the emails aren't mobile-optimized or if they signed up weeks ago and lost interest. They unsubscribe. If you're using the same email list for challenge communications and future ROOTS marketing, unsubscribes from challenge emails also remove them from the marketing funnel.

**Prevention:**
- Keep challenge emails and marketing emails on separate lists/segments. An unsubscribe from challenge updates should not remove them from the general Nipomo SC list.
- The magic link auth email and the weekly challenge emails are different communication channels. Auth emails are transactional (always sent). Challenge emails are marketing (must honor unsubscribe).
- Include an unsubscribe link in every non-transactional email (legally required by CAN-SPAM).
- Keep weekly emails short and high-value: this week's challenge, top 5 leaderboard, and that's it.

**Phase:** Phase 3 (email communication setup, if added).

**Confidence:** MEDIUM -- the project says email is manual for v1, but if any automated email is added, this applies.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Data model & auth (Phase 1) | Replit filesystem data loss (#5) | Use PostgreSQL from day one, never local files |
| Data model & auth (Phase 1) | Magic link deliverability (#3) | Set up Resend + DNS records before writing any code |
| Data model & auth (Phase 1) | COPPA consent capture (#4) | Bake privacy notice into signup flow, first name + last initial only |
| Upload infrastructure (Phase 1) | iPhone video size (#2) | Client-side validation, 30s max duration, 720p cap, chunked upload |
| Upload infrastructure (Phase 1) | Cloudinary credit burn (#1) | Upload preset with strict limits, eager transformation, delete originals |
| Upload infrastructure (Phase 1) | Unsigned upload abuse (#9) | Restrict preset to video-only, auth-gate the widget |
| Submission flow (Phase 2) | Multi-kid confusion (#6) | Prominent kid selector, confirmation before upload |
| Submission flow (Phase 2) | Content moderation (#8) | Admin review before public visibility |
| Submission flow (Phase 2) | Gaming/fairness (#7) | Server-side rate limiting, admin spot-check capability |
| Challenge content (Phase 2) | Instructional video bandwidth (#11) | YouTube embeds for instructional content, Cloudinary only for submissions |
| Challenge content (Phase 2) | Timezone bugs (#12) | Pacific Time for all business logic, UTC for storage |
| Leaderboard (Phase 2) | Performance (#13) | Denormalized leaderboard table from the start |
| Auth UX (Phase 1) | Mobile browser session (#10) | Long-lived cookies, test Gmail/Apple Mail in-app browsers |
| Email (Phase 3) | Deliverability + fatigue (#3, #14) | Separate transactional from marketing, keep emails minimal |

## Sources

- [Cloudinary Pricing/Credits](https://cloudinary.com/documentation/developer_onboarding_faq_credits) -- HIGH confidence
- [Cloudinary Transformation Counting](https://cloudinary.com/documentation/transformation_counts) -- HIGH confidence
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget) -- HIGH confidence
- [Cloudinary Unsigned Upload Security](https://support.cloudinary.com/hc/en-us/articles/208335975-How-safe-secure-is-it-to-use-unsigned-upload-from-web-browsers-or-mobile-clients) -- HIGH confidence
- [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) -- HIGH confidence
- [FTC COPPA 2025 Amendments](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule) -- HIGH confidence
- [Replit Deployment Persistence](https://docs.replit.com/cloud-services/storage-and-databases/production-databases) -- HIGH confidence
- [Magic Link Deliverability](https://securityboulevard.com/2026/04/how-email-infrastructure-impacts-otp-and-magic-link-authentication-success-rates/) -- HIGH confidence
- [Resend Email Service](https://resend.com/) -- MEDIUM confidence
- [Replit Free Tier Limitations](https://p0stman.com/guides/replit-limitations) -- MEDIUM confidence
