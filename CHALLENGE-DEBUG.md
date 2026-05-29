# Summer Skills Challenge -- Debug Reference

Quick reference for debugging Phase 2 (Core Loop) on Replit.

## Routes (Client)

| URL | File | Auth Required |
|-----|------|---------------|
| `/challenge` | `client/src/pages/challenge/index.tsx` | Yes (redirects to /signup) |
| `/challenge/signup` | `client/src/pages/challenge/signup.tsx` | No (redirects to / if logged in) |
| `/challenge/leaderboard` | `client/src/pages/challenge/leaderboard.tsx` | No |

Routing uses wouter's `nest` prop on `/challenge` in `App.tsx:40`. Inside the nest, all paths are relative (e.g. `/signup` not `/challenge/signup`).

## API Endpoints

| Method | Path | Auth | File:Line | Purpose |
|--------|------|------|-----------|---------|
| POST | `/api/auth/signup` | No | `challengeRoutes.ts:148` | Create family + send magic link |
| POST | `/api/auth/login` | No | `challengeRoutes.ts:188` | Resend magic link |
| GET | `/api/auth/verify?token=X` | No | `challengeRoutes.ts:217` | Verify magic link, create session |
| GET | `/api/auth/me` | Session | `challengeRoutes.ts:262` | Get current family + kids |
| POST | `/api/auth/logout` | Session | `challengeRoutes.ts:292` | Destroy session |
| POST | `/api/kids` | Session | `challengeRoutes.ts:305` | Add kid to family |
| GET | `/api/challenges` | No | `challengeRoutes.ts:409` | List all challenges |
| POST | `/api/submissions` | Session | `challengeRoutes.ts:422` | Submit video (1/day/kid/type cap) |
| POST | `/api/video-bonus` | Session | `challengeRoutes.ts:480` | Claim video bonus (1/week/kid) |
| GET | `/api/submissions/status` | Session | `challengeRoutes.ts:534` | Kid's submission history |
| GET | `/api/leaderboard` | No | `challengeRoutes.ts:585` | Public leaderboard |

## Database Tables (Drizzle schema in `shared/schema.ts`)

- `families` -- id, email (unique), name, magic_token, token_expires_at, consent_given_at, is_registered, created_at
- `kids` -- id, family_id (FK), first_name, last_name, birthdate, age_track, display_name, created_at
- `challenges` -- id, week_number, age_track, title, description, type (skill/fitness), video_url, week_start, week_end, active, created_at
- `submissions` -- id, kid_id (FK), challenge_id (FK), family_id (FK), week_number, type, points, cloudinary_id, cloudinary_url, thumbnail_url, submitted_at
- `sessions` -- auto-managed by connect-pg-simple

## Key Files

```
server/challengeRoutes.ts    -- All challenge API endpoints + magic link sending
server/challengeAuth.ts      -- requireFamily session middleware
server/index.ts              -- Session middleware setup (express-session + connect-pg-simple)
shared/schema.ts             -- All Drizzle table definitions
shared/challengeValidation.ts -- Zod schemas for request validation
client/src/hooks/use-auth.tsx -- Auth state hook (calls /api/auth/me)
client/src/hooks/use-cloudinary.tsx -- Cloudinary upload widget hook
client/src/hooks/use-submissions.tsx -- Submission state + helpers
client/src/hooks/use-active-kid.tsx -- Active kid selection context
client/src/components/challenge/ -- 13 UI components
```

## Env Vars Required

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | PostgreSQL connection (Neon, auto-set by Replit) |
| `SENDGRID_API_KEY` | Email sending (should already exist) |
| `SESSION_SECRET` | Cookie signing (falls back to dev secret if unset) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Client-side Cloudinary cloud name (`dlujqtoz8`) |
| `CLOUDINARY_CLOUD_NAME` | Server-side Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Server-side Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Server-side Cloudinary API secret |

## Email Config

SendGrid sends from `admin@nipomosc.org` (or `SENDGRID_FROM_EMAIL` env var). Same sender used across all routes (contact, shop, placement, challenge).

## Challenge Seed Data

`challengeRoutes.ts` auto-seeds 48 challenges (8 weeks x 3 tracks x 2 types) on first boot if the challenges table is empty. Seed runs in `seedChallengesIfEmpty()` at module load.

## Auth Flow

1. User enters email on `/challenge/signup` -> POST `/api/auth/signup`
2. Server creates/updates family row with random token, sends magic link email
3. User clicks email link -> GET `/api/auth/verify?token=X`
4. Server validates token, creates express-session, redirects to `/challenge`
5. Client calls GET `/api/auth/me` to get family + kids data
6. Session cookie (30-day, httpOnly, secure, sameSite=lax) persists login

## Common Debug Steps

**500 on signup/login:** Check Replit logs for "Signup error:" -- actual error is logged there. Likely causes: SENDGRID_API_KEY not set, families table missing columns, DB connection issue.

**Blank challenge pages:** Wouter nest routing issue. Redirects inside `/challenge` nest must use relative paths (`/signup` not `/challenge/signup`).

**Session not persisting:** Check DATABASE_URL is set (connect-pg-simple needs it). Check `trust proxy` is set to 1 in index.ts. Check secure cookie + HTTPS.

**Cloudinary widget not opening:** Check VITE_CLOUDINARY_CLOUD_NAME is set in Replit env vars (must start with `VITE_` to reach client). Check browser console for script load errors.

**No challenges showing:** Check if challenges table has data. Seed runs automatically but only if table is empty. Check Replit logs for "Challenge seed error:".
