# Technology Stack

**Project:** Summer Skills Challenge
**Researched:** 2026-05-28

## Existing Stack (Non-Negotiable)

The challenge is built into nipomosc.org, which already runs this stack. Everything below extends what's already there -- no framework migrations, no new build tools, no separate deployments.

| Technology | Version | Role |
|------------|---------|------|
| React | 18.3 | Frontend UI |
| TypeScript | 5.6 | Type safety across client/server |
| Vite | 5.4 | Build tool + HMR |
| Express | 4.21 | API server |
| Drizzle ORM | 0.39 | Database queries + schema |
| PostgreSQL | 16 (via Neon on Replit) | Database |
| Wouter | 3.3 | Client-side routing |
| TanStack Query | 5.60 | Server state management |
| Tailwind CSS | 3.4 | Styling |
| Shadcn/Radix UI | Various | Component primitives |
| Zod | 3.24 | Schema validation (shared client/server) |
| React Hook Form | 7.55 | Form state management |
| SendGrid | 8.1 | Transactional email (already integrated, paid) |
| Lucide React | 0.453 | Icons |

**Deploy workflow:** Push to GitHub, pull in Replit Shell, republish.

---

## Recommended Stack (New Additions)

### Video Upload: Cloudinary Upload Widget (client-side)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Cloudinary Upload Widget | v2.0 (script tag) | Direct browser-to-Cloudinary video upload | No server-side file handling, auto .mov/.mp4 conversion, mobile-responsive widget, progress indicators built-in |
| cloudinary (Node SDK) | ^2.5 | Server-side admin ops (deletion, thumbnail URLs) | Needed for admin features like viewing/deleting submissions. Not needed for upload path. |

**Confidence:** HIGH -- Cloudinary is already decided per PROJECT.md. The Upload Widget v2 is the correct integration path for this use case.

**How it works:**
1. Parent taps "Upload Video" on mobile
2. Cloudinary Upload Widget opens (mobile-optimized, handles camera roll access)
3. Video uploads directly from phone to Cloudinary (bypasses Express server entirely)
4. Widget returns `secure_url`, `public_id`, `resource_type`, `duration`, `format` to the React callback
5. React POSTs metadata to Express API endpoint, which writes to PostgreSQL

**Upload Preset Configuration (set in Cloudinary Console):**
- Preset name: `nsc_challenge`
- Signing mode: **Unsigned** -- simpler implementation, acceptable risk for a community challenge (not public internet). The Express API still validates session auth before recording the submission, so unauthorized uploads to Cloudinary won't create points.
- Resource type: `video` (only accept video files)
- Max file size: 50MB (conservative for free tier -- 30-60 second phone clips are 10-30MB)
- Allowed formats: mp4, mov, webm (covers iPhone and Android)
- Eager transformation: `c_limit,w_480,h_480/f_jpg` (auto-generate thumbnail on upload)
- Folder: `challenge-submissions/`
- Tags: `summer-challenge`

**Free Tier Math (25 credits/month, where 1 credit = 1GB storage OR 1GB bandwidth OR 1,000 transformations):**
- Storage: ~25GB available. At ~20MB avg per compressed video, ~50 families x 8 weeks x ~15 submissions = ~1,200 submissions = ~24GB raw. Tight. With 50MB max file size and eager compression, realistic usage is ~5-10GB. **Monitor weekly.**
- Bandwidth: ~25GB available. Thumbnails only served from Cloudinary (~50KB each). Full videos rarely replayed. ~2-5GB expected. Comfortable.
- Transformations: ~25,000 available. Thumbnail generation per upload = ~1,200. Well within limits.

**Risk flag:** Storage could exceed free tier if participation is higher than projected or parents upload long/high-res videos. Mitigation: set max file size to 50MB (not 100MB), and if storage gets tight mid-summer, reduce to 30MB or add duration limit.

**Integration approach:** Load the widget script via a `<script>` tag in `client/index.html`:
```html
<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
```
Then wrap in a React component that calls `window.cloudinary.createUploadWidget()`. No npm package needed -- the script tag approach is what Cloudinary recommends for React and avoids bundle bloat.

### Authentication: DIY Magic Link with Random Token + express-session

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js `crypto` (built-in) | Built-in | Generate random magic link tokens | `crypto.randomBytes(32).toString("hex")` -- no npm package needed. Token stored in DB, verified via lookup. Simpler than JWT. |
| express-session | 1.18 (already in package.json) | Session management after magic link verification | Already a dependency, just not wired up yet |
| connect-pg-simple | 10.0 (already in package.json) | Store sessions in existing PostgreSQL | Already a dependency, keeps sessions alive across Replit restarts |

**Confidence:** HIGH -- DIY magic link is the right call here.

**Why random token over JWT:**
- Token stored in `families.magic_token` column, verified via DB lookup
- Automatically invalidated after use (set to null after verification)
- No `jsonwebtoken` dependency needed -- one less package to install
- JWT would work too, but adds a dependency for no benefit when you're doing a DB lookup anyway

**Why NOT to use passport-magic-login or any third-party auth library:**

1. **passport + passport-local are already in package.json** but not actually used anywhere in the codebase. The existing admin auth is a custom HMAC token approach in `server/auth.ts`. Adding passport-magic-login means wiring up passport middleware, session serialization, and strategy registration -- all overhead for a simple use case.

2. **The magic link flow is ~30 lines of code:**
   - `POST /api/challenge/auth/send-link` -- validate email, generate random token with 15min expiry, store in families table, send via SendGrid
   - `GET /api/challenge/auth/verify?token=xxx` -- look up token in DB, verify not expired, create session, clear token
   - `GET /api/challenge/auth/me` -- return current session's family + kids
   - `POST /api/challenge/auth/logout` -- destroy session

3. **SendGrid is already integrated** across 3 route files. No need for a separate email provider.

4. **express-session + connect-pg-simple are already in package.json.** Just need to initialize the middleware in `server/index.ts` and create the session table.

**Session strategy:**
- Cookie-based sessions with `httpOnly: true`, `secure: true`, `sameSite: 'lax'`
- Sessions stored in PostgreSQL via connect-pg-simple (survives Replit restarts)
- Session duration: 30 days (families shouldn't have to re-auth weekly during an 8-week challenge)
- No token stored client-side after verification -- session cookie handles everything

**Do NOT use:**
- `passport-magic-login` -- unnecessary abstraction over something simple. Adds passport middleware overhead and debugging complexity for a 30-line feature.
- `jsonwebtoken` -- random token + DB lookup is simpler for this use case. JWT adds a dependency for no benefit.
- `Resend` -- SendGrid is already paid and integrated. Adding a second email provider creates confusion. (Note: SendGrid killed their free tier in May 2025, but the site already has a paid SendGrid account.)
- `next-auth` / `Auth.js` -- not applicable, this isn't Next.js.
- `Supabase Auth` -- would require migrating to Supabase, which means abandoning the existing Drizzle + PostgreSQL setup.

### Database Schema Additions (Drizzle ORM)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| drizzle-orm | 0.39 (existing) | New tables for families, kids, submissions, challenges | Already the ORM. Schema goes in shared/schema.ts, same as existing tables. |
| drizzle-kit | 0.31 (existing) | Schema push to PostgreSQL | Already configured. `npm run db:push` applies schema changes. |

**Confidence:** HIGH -- zero new dependencies needed.

**New tables needed:**
- `families` -- parent email (unique), name, magic_token, token_expires, is_registered (NSC member flag), created_at
- `kids` -- family_id FK, name, birth_year, age_track (littlekicks/starter/advanced), display_name (first name + last initial), created_at
- `challenges` -- week_number, age_track, title, description, type (skill/fitness), video_url (instructional embed), active, created_at
- `submissions` -- kid_id FK, challenge_id FK, family_id FK (denormalized for query speed), week_number, type (skill/fitness/video_bonus), points, cloudinary_id, cloudinary_url, thumbnail_url, submitted_at
- `drawings` -- week_number (unique), winner_kid_id FK, total_entries, drawn_at
- `sessions` -- managed automatically by connect-pg-simple (sid, sess, expire)

### Leaderboard & Gamification: Pure Computation (No Library)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| SQL aggregation queries | -- | Leaderboard ranking, streak calculation, badge computation | Points = count of submissions. Streaks = consecutive weeks with >= 1 submission. This is a GROUP BY + ORDER BY, not a gamification engine. |

**Confidence:** HIGH -- no gamification library needed. The points system is purely additive (1 point per action, max 15/week). Streaks are consecutive week counts. Badges are threshold checks. All of this is 5-10 SQL queries, not a framework.

**Do NOT use:**
- Any gamification SaaS (Bunchball, Badgeville, etc.) -- massive overkill for a participation counter
- Redis for leaderboard caching -- PostgreSQL handles this fine at 100-200 kids. `SELECT kid_id, SUM(points) FROM submissions GROUP BY kid_id ORDER BY SUM(points) DESC` runs in <10ms at this scale.

### Admin Dashboard: Extend Existing Admin

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Existing admin pattern | -- | Challenge management, submission review, prize drawing | The site already has `/admin` with HMAC token auth. Add new tabs/sections for challenge admin. |
| Recharts | 2.15 (existing) | Participation charts | Already in package.json. Use for daily submission trends, age track breakdown. |

**Confidence:** HIGH -- proven pattern in the codebase.

### Prize Drawing: Simple Random Selection

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js `crypto.randomInt()` | Built-in | Random prize winner selection | Each point = 1 raffle entry. Weighted random selection from submissions table. No external randomization library needed. |

**Confidence:** HIGH -- `crypto.randomInt()` is cryptographically random, which matters for perceived fairness of prize drawings.

### Video Playback: Native HTML5 `<video>` Tag

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Native `<video>` element | HTML5 | Play back submitted videos (admin view only) | Cloudinary serves optimized MP4 URLs. Browser's native player handles 30-60 second skill videos perfectly. No player library needed. |

**Confidence:** HIGH -- Video.js and Plyr are unnecessary for short-form video clips.

**Important:** Public-facing pages (leaderboard, profiles) should NOT stream video -- show thumbnails only. Video playback burns through Cloudinary's bandwidth allowance. Only admin should be able to view full videos for resharing to social media.

---

## Supporting Libraries (No New NPM Installs Needed)

These are already in the project and handle the challenge feature's needs:

| Library | Already Installed | Purpose for Challenge |
|---------|-------------------|----------------------|
| React Hook Form + zod resolvers | Yes | Signup form, kid profile forms |
| Framer Motion | Yes | Leaderboard animations, badge reveals |
| date-fns | Yes | Week calculations, streak date logic |
| Radix Tabs | Yes | Age track filters on leaderboard |
| Radix Dialog | Yes | Upload confirmation modals |
| Radix Progress | Yes | Weekly progress bars |
| Radix Avatar | Yes | Kid profiles on leaderboard |
| TanStack Query | Yes | Leaderboard polling, submission state |
| Recharts | Yes | Admin participation charts |

---

## New NPM Installs Required

Only one new package:

```bash
npm install cloudinary
```

That's it. The magic link auth uses built-in Node.js `crypto`, sessions use already-installed `express-session` + `connect-pg-simple`. Everything else is already in the project.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Video upload | Cloudinary Upload Widget (script tag) | `next-cloudinary`, `cloudinary-react` npm packages | npm packages add bundle weight and version coupling. Script tag is Cloudinary's recommended React approach and gives direct access to widget API. |
| Video upload | Cloudinary Upload Widget (script tag) | multer server-side upload then forward to Cloudinary | Replit Autoscale has cold starts and limited memory. Routing 50MB video files through Express would timeout or OOM. Direct browser-to-Cloudinary bypasses the server entirely. |
| Auth token | `crypto.randomBytes()` + DB storage | `jsonwebtoken` (JWT) | JWT adds a dependency for no benefit when you're doing a DB lookup anyway to find the family. Random token + DB is simpler and auto-invalidated. |
| Auth strategy | DIY 30-line magic link | passport-magic-login | Unnecessary abstraction. Passport isn't used in this codebase despite being in package.json. Custom HMAC auth pattern already exists. |
| Auth strategy | DIY 30-line magic link | Supabase Auth / Auth0 / Clerk | Would require migrating from Drizzle/Postgres or adding a third-party dependency. Massive scope creep for an 8-week campaign. |
| Email | SendGrid (existing) | Resend | SendGrid is already paid and integrated across 3 route files. Resend has a great free tier (3,000 emails/month) but switching would mean replacing working code. |
| Leaderboard | SQL aggregation | Redis sorted sets | At 100-200 kids with <2,000 submissions total, PostgreSQL GROUP BY is instant. Redis adds infrastructure complexity for zero benefit at this scale. |
| Session store | connect-pg-simple (PostgreSQL) | memorystore (in package.json) | memorystore loses sessions on Replit restart. PostgreSQL sessions persist. |
| Routing | Wouter nested routes (`nest` prop) | React Router | Wouter is already the router. Its `nest` prop handles `/challenge/*` sub-routes cleanly. No reason to add a second router. |
| Video playback | Native `<video>` tag with Cloudinary URL | Video.js, Plyr | Cloudinary serves optimized MP4 URLs. The browser's native player handles short skill videos perfectly. No player library needed. |
| Real-time updates | TanStack Query polling (refetchOnWindowFocus) | WebSocket via ws (already in package.json) | Replit Autoscale doesn't reliably support persistent WebSocket connections. Polling on page load is sufficient for a leaderboard that updates a few dozen times per day. |

---

## Environment Variables (New)

Add to Replit Secrets:

| Variable | Purpose | Source |
|----------|---------|--------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier | Cloudinary Dashboard > Settings |
| `CLOUDINARY_API_KEY` | Server-side API key (for admin operations) | Cloudinary Dashboard > Settings |
| `CLOUDINARY_API_SECRET` | Server-side API secret (for admin operations) | Cloudinary Dashboard > Settings |
| `SESSION_SECRET` | Express session cookie signing | Already exists (used in auth.ts HMAC_SECRET fallback). If not set as its own var, generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

`SENDGRID_API_KEY` and `DATABASE_URL` already exist. No `JWT_SECRET` needed since we're using random tokens, not JWTs.

---

## Architecture Fit

The challenge feature fits cleanly into the existing codebase architecture:

```
client/src/pages/challenge/     -- New page directory (matches roots/ pattern)
  index.tsx                     -- Challenge hub (/challenge)
  leaderboard.tsx               -- Public leaderboard
  profile.tsx                   -- Player profile (/challenge/profile/:id)
  submit.tsx                    -- Submission flow
  login.tsx                     -- Magic link auth

server/
  challengeRoutes.ts            -- New route module (matches shopRoutes.ts, coachRoutes.ts pattern)
  challengeAuth.ts              -- Magic link + session middleware

shared/schema.ts                -- Add new tables alongside existing ones
```

This follows the existing pattern: `shopRoutes.ts`, `coachRoutes.ts`, `placementRoutes.ts` are all separate route files registered in `routes.ts`. The challenge gets the same treatment.

---

## Replit-Specific Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| Single port (PORT env var) | All traffic through Express | Already handled -- Express serves both API and static files |
| Replit PostgreSQL (Neon-backed) | 0.5GB free storage, scale-to-zero cold starts (~300-500ms) | Schema additions are tiny. Cold starts acceptable for a community challenge. |
| No persistent filesystem | Can't store uploaded videos on server | Cloudinary handles all media storage. Server only stores metadata in PostgreSQL. |
| Deploy = git pull + republish | Must commit all changes to GitHub first | Normal workflow, already established |
| Autoscale cold starts (10-30s on first request) | First visit after idle is slow | Unrelated to video upload -- Cloudinary direct upload bypasses Express. Page load is the only thing affected. |
| No reliable WebSocket support in Autoscale | Can't do real-time leaderboard push | Use TanStack Query polling. Sufficient at this scale. |

---

## Installation Summary

```bash
# In the nipomo-soccer-website directory:
npm install cloudinary

# That's it. One package.
# express-session, connect-pg-simple, @sendgrid/mail are already installed.
# crypto is built-in Node.js.
```

**Cloudinary Console setup (manual, one-time):**
1. Create Cloudinary account (free)
2. Create upload preset named `nsc_challenge` with settings above
3. Copy cloud name, API key, API secret to Replit Secrets

**Database setup:**
```bash
# After adding new tables to shared/schema.ts:
npm run db:push
```

---

## Sources

- Cloudinary Upload Widget docs: https://cloudinary.com/documentation/upload_widget (HIGH confidence)
- Cloudinary Upload Widget API reference: https://cloudinary.com/documentation/upload_widget_reference (HIGH confidence)
- Cloudinary Node SDK (Context7): /cloudinary/cloudinary_npm (HIGH confidence)
- Cloudinary free tier pricing: https://cloudinary.com/pricing (HIGH confidence -- verified May 2026: 25 credits/month)
- Cloudinary video format conversion: https://cloudinary.com/documentation/video_manipulation_and_delivery (HIGH confidence)
- Cloudinary upload presets: https://cloudinary.com/documentation/upload_presets (HIGH confidence)
- passport-magic-login: https://github.com/mxstbr/passport-magic-login (evaluated, not recommended)
- Wouter nested routes: https://github.com/molefrog/wouter (HIGH confidence -- nest prop confirmed)
- Replit PostgreSQL docs: https://docs.replit.com/cloud-services/storage-and-databases/sql-database (MEDIUM confidence -- Replit docs change frequently)
- Neon free tier: https://neon.com -- 0.5GB storage, 100 compute-hours/month (HIGH confidence)
- SendGrid: Already integrated in codebase (server/routes.ts, server/shopRoutes.ts, server/placementRoutes.ts) (HIGH confidence)
- SendGrid free tier removal (May 2025): https://dev.to/thiago_alvarez_a7561753aa/resend-vs-sendgrid-2026-sendgrid-killed-its-free-tier-now-what-2gh4 (MEDIUM confidence)
- Resend free tier: https://resend.com/pricing -- 3,000 emails/month free (HIGH confidence, but not recommended -- SendGrid already in use)
- express-session httpOnly cookies: https://www.npmjs.com/package/express-session (HIGH confidence)
- connect-pg-simple: Already in package.json (HIGH confidence)
- iPhone video file sizes: ~130MB/min at 1080p 30fps (MEDIUM confidence -- varies by device/settings)
- Existing codebase analysis: ~/Projects/nipomo-soccer-website/ (HIGH confidence -- read directly)
