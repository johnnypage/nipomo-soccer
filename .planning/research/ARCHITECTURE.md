# Architecture Patterns

**Domain:** Video submission + gamification web app (Summer Skills Challenge)
**Researched:** 2026-05-28

## Existing System Snapshot

The challenge system integrates into an existing Replit-hosted web app:

- **Frontend:** React 18 + TypeScript + Vite, Wouter for routing, TanStack Query for server state, Shadcn/Radix UI components, Tailwind CSS
- **Backend:** Express.js + TypeScript, RESTful API under `/api`
- **Database:** PostgreSQL via Drizzle ORM (already in use for contact forms, shop orders, coach apps)
- **Auth (current):** Admin-only HMAC token auth -- no public user accounts exist yet
- **Email:** SendGrid already integrated
- **Hosting:** Replit Autoscale deployment, single port (5000), build via esbuild + Vite
- **Deploy workflow:** Push to GitHub, pull in Replit Shell, republish

## Recommended Architecture

### System Overview

```
[Parent's Phone Browser]
    |
    v
[React SPA (new routes: /challenge, /challenge/submit, /challenge/profile/:id)]
    |
    |-- Cloudinary Upload Widget (direct browser-to-Cloudinary, unsigned)
    |       |
    |       v
    |   [Cloudinary CDN] -- webhook --> [Express /api/challenge/webhook]
    |
    |-- TanStack Query --> [Express API /api/challenge/*]
    |                           |
    |                           v
    |                      [PostgreSQL via Drizzle]
    |
    v
[Admin Dashboard (new tab in existing /admin)]
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Challenge Hub Page** (`/challenge`) | Weekly challenge display, leaderboard, age-track tabs, sign-up CTA | Express API (GET challenges, GET leaderboard) |
| **Family Auth System** | Magic link email login, session management, multi-kid profile CRUD | Express API, SendGrid (magic link emails), PostgreSQL (families + kids tables) |
| **Video Submission Flow** | Kid selection, challenge picker, Cloudinary upload widget, confirmation | Cloudinary (direct upload), Express API (POST submission record) |
| **Points Engine** | Calculate and store points per submission, enforce daily/weekly caps | PostgreSQL (submissions table), triggered on submission creation |
| **Leaderboard** | Ranked display of all participants, filters by age track, streak badges | Express API (GET ranked query), PostgreSQL (materialized view or query) |
| **Player Profile** (`/challenge/profile/:id`) | Individual challenge history, badges, streak, "NSC Player" badge | Express API (GET player data) |
| **Prize Drawing System** | Points-to-raffle-entries conversion, random weighted draw, winner history | Express API (admin-only endpoints), PostgreSQL |
| **Admin Challenge Manager** | CRUD weekly challenges, view submissions, trigger drawings, moderate | Express API (admin endpoints behind existing HMAC auth) |

### Data Flow

#### 1. Signup Flow
```
Parent enters email
  --> Express generates magic link token (JWT, 15min expiry)
  --> SendGrid delivers email with link
  --> Parent clicks link
  --> Express verifies token, creates session (express-session + connect-pg-simple)
  --> Parent adds kid profiles (name, birth year, age track auto-calculated)
  --> Session cookie set for future visits
```

#### 2. Video Submission Flow (critical path)
```
Parent opens /challenge/submit
  --> Selects kid from their profile
  --> Selects current week's challenge (skill or fitness)
  --> Cloudinary Upload Widget opens (unsigned preset, resource_type: video)
  --> Video uploads directly from phone to Cloudinary (bypasses Express entirely)
  --> On widget "success" callback:
      --> Client receives Cloudinary public_id, secure_url, thumbnail_url
      --> Client POSTs to /api/challenge/submissions with:
          { kidId, challengeId, cloudinaryPublicId, cloudinaryUrl, type: "skill"|"fitness"|"video_bonus" }
      --> Express validates:
          - Session is authenticated
          - Kid belongs to this family
          - Challenge is current week
          - Daily cap not exceeded (1 skill + 1 fitness per day)
          - Video bonus not already claimed this week
      --> Express inserts submission row, calculates points (1 per valid submission)
      --> Returns updated point total + streak info
```

#### 3. Leaderboard Data Flow
```
Any visitor hits /challenge
  --> Client fetches GET /api/challenge/leaderboard?track=all|littlekicks|starter|advanced
  --> Express runs ranked query:
      SELECT k.display_name, k.age_track, SUM(s.points) as total_points,
             COUNT(DISTINCT s.week_number) as weeks_active,
             ... streak calculation ...
      FROM kids k
      JOIN submissions s ON s.kid_id = k.id
      GROUP BY k.id
      ORDER BY total_points DESC, earliest_submission ASC
  --> Returns ranked array with position, name, points, streak, badges
  --> Client renders leaderboard (no real-time needed -- polling on page load is sufficient)
```

#### 4. Prize Drawing Flow
```
Admin clicks "Draw Weekly Winner" in admin panel
  --> Express calculates raffle pool: each point earned that week = 1 entry
  --> Weighted random selection
  --> Winner stored in drawings table
  --> Admin sees winner name + contact email for notification
  --> Drawing marked as complete (prevents re-draw)
```

## Database Schema

All new tables follow existing patterns (UUID PKs, drizzle-zod validation, timestamps).

```
families
  id            UUID PK
  email         TEXT UNIQUE (login identifier)
  name          TEXT (parent name)
  magic_token   TEXT NULLABLE (current magic link token)
  token_expires TIMESTAMP NULLABLE
  is_registered BOOLEAN DEFAULT false (NSC member flag, set manually by admin)
  created_at    TIMESTAMP

kids
  id            UUID PK
  family_id     UUID FK -> families.id
  name          TEXT
  birth_year    INTEGER
  age_track     TEXT ("littlekicks" | "starter" | "advanced")
  display_name  TEXT (what shows on leaderboard -- first name + last initial)
  created_at    TIMESTAMP

challenges
  id            UUID PK
  week_number   INTEGER (1-8)
  age_track     TEXT
  title         TEXT ("Toe Taps", "Wall Passes", etc.)
  description   TEXT
  type          TEXT ("skill" | "fitness")
  video_url     TEXT NULLABLE (instructional video embed)
  active        BOOLEAN DEFAULT true
  created_at    TIMESTAMP

submissions
  id              UUID PK
  kid_id          UUID FK -> kids.id
  challenge_id    UUID FK -> challenges.id
  family_id       UUID FK -> families.id (denormalized for query speed)
  week_number     INTEGER
  type            TEXT ("skill" | "fitness" | "video_bonus")
  points          INTEGER DEFAULT 1
  cloudinary_id   TEXT
  cloudinary_url  TEXT
  thumbnail_url   TEXT
  submitted_at    TIMESTAMP
  UNIQUE(kid_id, challenge_id, submitted_at::date, type) -- enforce daily caps

drawings
  id            UUID PK
  week_number   INTEGER UNIQUE
  winner_kid_id UUID FK -> kids.id
  total_entries INTEGER
  drawn_at      TIMESTAMP
  drawn_by      TEXT ("admin")

sessions (managed by connect-pg-simple -- already a dependency)
  sid           TEXT PK
  sess          JSONB
  expire        TIMESTAMP
```

### Schema Design Rationale

- **families vs users:** The existing `users` table is admin-only with password auth. Families need a separate table with magic link auth -- cleaner than overloading the users table.
- **Denormalized family_id on submissions:** Avoids a JOIN through kids for every leaderboard query. Worth the small duplication.
- **age_track on kids:** Auto-calculated from birth_year at creation, but stored so leaderboard queries don't need to compute it per row.
- **display_name on kids:** "Emma S." format, set at creation. Leaderboard shows this, not full names. Privacy for minors.
- **week_number on submissions:** Denormalized from challenge for fast "this week's activity" queries without joining challenges.

## Patterns to Follow

### Pattern 1: Direct-to-Cloudinary Upload (bypass Express for video bytes)

**What:** Video bytes go directly from the parent's phone browser to Cloudinary via the Upload Widget. Express never touches the video file.

**Why:** Replit Autoscale has cold starts and limited resources. Routing 50-100MB video files through Express would be slow and unreliable. Unsigned upload presets let Cloudinary handle the heavy lifting.

**Implementation:**
```typescript
// Client: Load Cloudinary widget script in challenge pages
// <script src="https://upload-widget.cloudinary.com/latest/global/all.js" />

// React component
function VideoUpload({ onSuccess }: { onSuccess: (info: CloudinaryResult) => void }) {
  const widget = useRef<any>(null);
  
  useEffect(() => {
    widget.current = window.cloudinary.createUploadWidget({
      cloudName: "your-cloud-name",
      uploadPreset: "nsc_challenge_unsigned",  // configured in Cloudinary console
      sources: ["local", "camera"],             // file picker or camera
      resourceType: "video",
      maxFileSize: 100_000_000,                 // 100MB (free tier limit)
      clientAllowedFormats: ["mp4", "mov", "webm"],
      showPoweredBy: false,
    }, (error, result) => {
      if (!error && result.event === "success") {
        onSuccess(result.info);
      }
    });
  }, []);

  return <button onClick={() => widget.current?.open()}>Upload Video</button>;
}
```

### Pattern 2: Magic Link Auth with Express Sessions

**What:** Passwordless login via emailed links. Token in URL, verified server-side, session cookie set.

**Why:** Target users are non-technical parents on phones. No passwords = no friction, no "forgot password" flow, no password reset emails.

**Implementation:**
```typescript
// Server: Generate and send magic link
app.post("/api/challenge/auth/send-link", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  
  // Upsert family record with token
  await db.insert(families).values({ email, magicToken: token, tokenExpires: expires })
    .onConflictDoUpdate({ target: families.email, set: { magicToken: token, tokenExpires: expires } });
  
  // Send via SendGrid (already integrated)
  await sgMail.send({
    to: email,
    from: "admin@nipomosc.org",
    subject: "Your Summer Skills Challenge Login Link",
    html: `<a href="https://nipomosc.org/challenge/verify?token=${token}">Click to log in</a>`
  });
  
  res.json({ success: true });
});

// Server: Verify token, create session
app.get("/api/challenge/auth/verify", async (req, res) => {
  const { token } = req.query;
  const family = await db.select().from(families).where(eq(families.magicToken, token)).limit(1);
  
  if (!family.length || family[0].tokenExpires < new Date()) {
    return res.status(401).json({ error: "Link expired" });
  }
  
  // Clear token, set session
  await db.update(families).set({ magicToken: null, tokenExpires: null }).where(eq(families.id, family[0].id));
  req.session.familyId = family[0].id;
  
  res.redirect("/challenge");
});
```

### Pattern 3: Polling-Based Leaderboard (not WebSocket)

**What:** Leaderboard fetches fresh data on page load and on submission. No real-time push.

**Why:** 
1. Replit Autoscale deployment does NOT reliably support WebSockets (their docs recommend Reserved VM for WebSocket use, and the proxy infrastructure interferes).
2. This leaderboard updates when someone submits a video -- not high-frequency. Dozens of updates per day, not per second.
3. TanStack Query's `refetchOnWindowFocus` gives a "feels live" experience for free.

```typescript
// Client: Leaderboard hook
const { data: leaderboard } = useQuery({
  queryKey: ["leaderboard", ageTrack],
  queryFn: () => fetch(`/api/challenge/leaderboard?track=${ageTrack}`).then(r => r.json()),
  refetchOnWindowFocus: true,  // refresh when parent switches back to tab
  staleTime: 30_000,           // consider data fresh for 30 seconds
});
```

### Pattern 4: Separate Route Files per Domain

**What:** All challenge routes live in `server/challengeRoutes.ts`, registered in `routes.ts` alongside existing route modules.

**Why:** The codebase already follows this pattern (shopRoutes.ts, coachRoutes.ts, placementRoutes.ts). Keeps route files manageable.

```typescript
// server/routes.ts
import { registerChallengeRoutes } from "./challengeRoutes";
// ...
registerChallengeRoutes(app);
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Routing Video Through Express
**What:** Using multer to accept video uploads on Express, then forwarding to Cloudinary server-side.
**Why bad:** Replit Autoscale has cold starts (10-30s), limited memory, and 5000 port constraint. A 100MB video upload through Express would timeout or OOM. Cloudinary's widget handles chunked upload, retry, and progress natively.
**Instead:** Direct browser-to-Cloudinary upload with unsigned preset.

### Anti-Pattern 2: Overloading the Existing users Table
**What:** Adding magic link fields to the existing `users` table and mixing admin auth with family auth.
**Why bad:** The `users` table uses password auth with HMAC tokens for admin access. Magic link auth has different session semantics, different expiry rules, and different user types. Mixing them creates confusing auth logic.
**Instead:** Separate `families` table with its own auth flow. Admin stays on HMAC tokens.

### Anti-Pattern 3: Real-Time Leaderboard with WebSockets
**What:** Setting up WebSocket connections for live leaderboard updates.
**Why bad:** Replit Autoscale deployment doesn't reliably support persistent WebSocket connections. Their proxy infrastructure interferes, and Autoscale instances can scale to zero. You'd need Reserved VM deployment ($$$) and complex reconnection logic.
**Instead:** Polling via TanStack Query with `refetchOnWindowFocus`. At this scale (dozens of families, max ~120 submissions/week per kid), polling on page load is more than sufficient.

### Anti-Pattern 4: Pre-Building All 8 Weeks of Challenge Content in the Database
**What:** Seeding all 8 weeks of challenges into the database before launch.
**Why bad:** Content may need mid-season tweaks. Having it in the DB means admin UI is the only way to edit.
**Instead:** Seed week 1 at launch. Admin dashboard lets Johnny add/edit challenges weekly. The proposal doc has all content planned but the admin UI should make it easy to adjust.

## Hosting Constraints (Replit-Specific)

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **Autoscale cold starts (10-30s)** | First request after idle period is slow | Not critical -- parents will wait. But avoid routing video bytes through Express (use Cloudinary direct). |
| **Single external port** | All traffic (API + SPA) on port 5000/80 | Already the pattern. No changes needed. |
| **No native WebSocket support in Autoscale** | Can't do real-time leaderboard push | Use polling. TanStack Query refetchOnWindowFocus is sufficient. |
| **Deployment = git pull + republish** | No CI/CD, manual deploy | Same workflow as today. `drizzle-kit push` for schema changes. |
| **Environment secrets separate for workspace vs deployment** | Easy to miss adding a new secret | Document all new env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET`, session secret for connect-pg-simple. |
| **PostgreSQL is external (Neon/Supabase/etc.)** | Connection pooling matters | Already using `pg.Pool`. No change needed. |

## Cloudinary Configuration

### Upload Preset (create in Cloudinary Console)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Preset name | `nsc_challenge_unsigned` | Descriptive, unique |
| Signing mode | Unsigned | Direct browser upload without server involvement |
| Folder | `challenge-submissions/` | Organized in Cloudinary |
| Resource type | Video | Only accept video files |
| Max file size | 50MB | Conservative for free tier; 30-60s phone clips are well under this |
| Allowed formats | mp4, mov, webm | Covers iPhone (.mov) and Android (.mp4) |
| Eager transformations | `c_limit,w_480,h_480/f_jpg` | Auto-generate thumbnail on upload |
| Tags | `summer-challenge` | Easy to filter in Cloudinary dashboard |

### Free Tier Budget

| Resource | Limit | Expected Usage | Headroom |
|----------|-------|----------------|----------|
| Storage | 25 credits (25GB) | ~50 families x 8 weeks x ~15 submissions x 20MB avg = ~120GB raw. BUT: apply eager compression to reduce. Realistic: ~5-10GB. | Tight if viral. Monitor weekly. |
| Bandwidth | 25 credits (25GB) | Thumbnails only served from Cloudinary. Full videos rarely replayed. ~2-5GB. | Comfortable. |
| Transformations | 25 credits (25K image or equivalent) | Thumbnail generation per upload. ~600-1200 video uploads = ~2400-4800 transformation credits. | Comfortable. |

**Risk mitigation:** Set Cloudinary `max_file_size` to 50MB (not 100MB). Most phone clips for 30-second drills will be 10-30MB. If storage gets tight mid-summer, apply server-side compression via eager transformations or reduce max size further.

## Suggested Build Order

Based on component dependencies:

```
Phase 1: Foundation
  - Database schema (families, kids, challenges, submissions, drawings tables)
  - Family auth (magic link send + verify + session)
  - Multi-kid profile CRUD
  Depends on: nothing
  Enables: everything else

Phase 2: Challenge Content + Submission
  - Challenge hub page (/challenge)
  - Weekly challenge display with age-track tabs
  - Cloudinary upload preset configuration
  - Video submission flow (widget integration + API endpoint + validation)
  Depends on: Phase 1 (need auth + kid profiles)
  Enables: points + leaderboard

Phase 3: Points + Leaderboard
  - Points calculation (on submission insert)
  - Leaderboard API endpoint (ranked query with age-track filter)
  - Leaderboard UI (ranked list, streak badges, "NSC Player" badge)
  - Player profile pages
  Depends on: Phase 2 (need submissions to rank)
  Enables: prize drawing

Phase 4: Admin + Prize Drawing
  - Admin challenge management (add/edit weekly challenges)
  - Submission viewer in admin
  - Prize drawing system (weighted random, winner recording)
  - Admin integration into existing /admin page as new tab
  Depends on: Phase 3 (need points for raffle entries)
  Enables: launch readiness

Phase 5: Polish + Launch Prep
  - Email capture integration (Mailchimp tag for challenge signups)
  - "NSC Player" badge verification (admin marks registered families)
  - Mobile UX testing and polish
  - Cloudinary usage monitoring setup
  Depends on: Phase 4
  Enables: June 9 launch
```

## Session Architecture Decision

The existing site has no public user sessions. This feature introduces them. Two options:

**Recommended: express-session + connect-pg-simple**
- `connect-pg-simple` is already a dependency in package.json
- `express-session` is already a dependency in package.json
- Stores sessions in the existing PostgreSQL database
- Stateless across Autoscale instances (session in DB, not memory)
- Cookie-based, works naturally with mobile browsers
- No new dependencies needed

**Not recommended: JWT-only approach**
- Would require storing JWTs in localStorage (XSS risk on mobile)
- Session invalidation is hard with pure JWTs
- The site already has express-session in dependencies -- use it

## Sources

- [Cloudinary Upload Widget Documentation](https://cloudinary.com/documentation/upload_widget)
- [Cloudinary Client-side Uploading](https://cloudinary.com/documentation/client_side_uploading)
- [Cloudinary Pricing/Plans](https://cloudinary.com/pricing)
- [Cloudinary Webhooks and Notifications](https://cloudinary.com/documentation/notifications)
- [Cloudinary Free Tier Quotas](https://support.cloudinary.com/hc/en-us/articles/203125631-How-does-Cloudinary-count-my-plan-s-quotas-and-what-does-every-quota-mean)
- [Passport.js Magic Link Tutorial](https://www.passportjs.org/tutorials/email/configure/)
- [Replit Deployment Docs - Ports](https://docs.replit.com/replit-workspace/ports)
- [Replit Autoscale vs Reserved VM](https://blog.replit.com/ports)
- Existing codebase: `~/Projects/nipomo-soccer-website/` (server/routes.ts, shared/schema.ts, server/auth.ts, .replit)
