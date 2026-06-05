# Phase 1: Family Auth & Data Foundation - Research

**Researched:** 2026-05-28
**Domain:** Magic link authentication, session management, database schema (Drizzle/PostgreSQL), challenge content seeding
**Confidence:** HIGH

## Summary

This phase establishes the authentication system, family/kid data model, and pre-loaded challenge content for the Summer Skills Challenge. The existing codebase already has `express-session` (1.18.1) and `connect-pg-simple` (10.0.0) installed but not wired up, `@sendgrid/mail` integrated across 3 route files, and a well-established Drizzle ORM schema pattern with UUID primary keys and `createInsertSchema` from `drizzle-zod`. The auto-seed pattern (`seedDivisionsIfEmpty`, `seedProductsIfEmpty`) is already proven in two route files and directly applies to challenge content seeding.

The magic link auth flow is straightforward: generate a random token with `crypto.randomBytes()`, store it in the `families` table with an expiration, email the link via SendGrid, verify on click, establish a session. No new npm packages are needed. The session middleware needs to be wired into `server/index.ts` before route registration, using the existing `pg.Pool` from `server/db.ts` shared with connect-pg-simple. The client already uses `credentials: "include"` in its `apiRequest` and `getQueryFn` helpers, so cookie-based auth will work without client fetch changes.

The challenge seed data source is `marketing/summer-skills-challenge-proposal.html`, which contains a complete 8-week calendar with 3 age tracks per week (24 skill challenges) plus 8 fitness bonuses. Parsing this HTML is unnecessary -- the seed data should be hardcoded as a TypeScript array following the exact `DIVISION_SEED` pattern in `coachRoutes.ts`.

**Primary recommendation:** Wire up express-session + connect-pg-simple first (enables all auth work), then schema + seed, then auth API routes, then client pages. No new npm installs needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Two-step flow driven by the magic link mechanism. Step 1: parent enters email on signup page, receives magic link. Step 2: parent clicks magic link, lands authenticated, sees "add your kids" form.
- **D-02:** Collect per kid: first name, last name, and birthdate (not birth year or grade). Birthdate is used to calculate exact age for age track auto-assignment.
- **D-03:** Age track auto-assigned from birthdate: Little Kicks (4-6), Starter (7-10), Advanced (11-18). Parent sees the assigned track but doesn't choose it manually.
- **D-04:** "Add another kid" button for multi-kid families. Repeating field group, not a wizard.
- **D-05:** Privacy/consent notice displayed at signup (Step 1, before magic link is sent). Checkbox acknowledgment required.
- **D-06:** Display name auto-generated as "First L." (first name + last initial) for leaderboard privacy (COPPA compliance).
- **D-07:** Persistent kid selector pinned at top of all /challenge/* pages. Shows active kid's name and age track. Tap to switch.
- **D-08:** Single-kid families: selector auto-selects and shows as static display (name + age track, no dropdown).
- **D-09:** Active kid selection stored in React context (client-side state). Challenge content filters to the active kid's age track.
- **D-10:** Challenge hub at /challenge is the single landing page for all authenticated users. Magic link verify endpoint redirects here.
- **D-11:** First-time users (no kids added yet) see an inline "add your kids to get started" prompt on /challenge. No separate onboarding page or dashboard.
- **D-12:** Returning users see the current week's challenge content (filtered to active kid's age track).
- **D-13:** No separate family dashboard page. Kid management (add/edit) happens inline or via modal from the /challenge page.
- **D-14:** Startup auto-seed pattern (matches existing seedDivisionsIfEmpty / seedProductsIfEmpty in codebase).
- **D-15:** Seed data sourced from marketing/summer-skills-challenge-proposal.html.
- **D-16:** Seed is idempotent -- only runs on empty table.

### Claude's Discretion
- Form layout and field sizing for kid-add form
- Exact kid selector component styling and animation
- Magic link email template wording (within brand voice)
- Loading states and error handling patterns
- Session cookie configuration details (duration, flags)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | Parent can sign up with email address (no password) | Magic link flow: email input + consent checkbox -> POST /api/auth/signup -> token generated + email sent. Schema: `families.email` (unique), `families.magic_token`, `families.token_expires_at` |
| AUTH-02 | Parent receives magic link email to log in | SendGrid integration already working in 3 route files. Magic link URL: `{origin}/api/auth/verify?token={token}`. Email template in brand voice (crimson header, gold accent). |
| AUTH-03 | Parent session persists across browser refresh (cookie-based) | express-session (1.18.1) + connect-pg-simple (10.0.0) already in package.json. Session stored in PostgreSQL, 30-day maxAge, httpOnly + secure cookies. `createTableIfMissing: true` handles session table. |
| AUTH-04 | Parent can add multiple child profiles (name, grade, age track auto-assigned) | Schema: `kids` table with `family_id` FK, `first_name`, `last_name`, `birthdate` (date type), `age_track` (computed on insert from birthdate using date-fns `differenceInYears`), `display_name` ("First L." auto-generated). |
| AUTH-05 | Parent can select which child they're submitting for | React context (`ActiveKidContext`) stores selected kid ID. Persistent kid selector component at top of /challenge/* pages. Auto-selects for single-kid families. |
| PRIV-01 | Signup includes brief privacy/consent notice | Checkbox on signup form (Step 1, before magic link sent). Text: "By signing up, you consent to your child's first name and challenge participation being displayed on the public leaderboard." Stored as `families.consent_given_at` timestamp. |
| CHAL-05 | All 8 weeks of challenge content pre-loaded | `seedChallengesIfEmpty()` function following existing pattern. 8 weeks x 3 age tracks = 24 skill challenges + 8 fitness bonuses (one per week, all tracks). Data extracted from proposal HTML and hardcoded as TypeScript array. |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Magic link token generation + verification | API / Backend | -- | Crypto operations and DB lookups must happen server-side |
| Session management | API / Backend | Browser (cookie storage) | Server creates/validates sessions; browser stores httpOnly cookie automatically |
| Magic link email delivery | API / Backend | -- | SendGrid API call is server-side only |
| Family/kid data model | Database / Storage | API / Backend | Schema lives in PostgreSQL; API layer handles CRUD |
| Age track computation | API / Backend | -- | Calculated on kid creation from birthdate; stored in DB |
| Challenge content seeding | API / Backend | Database / Storage | Seed runs at server startup; data persists in PostgreSQL |
| Signup form + consent checkbox | Browser / Client | -- | React form with Zod validation, POST to API |
| Kid management (add/edit) | Browser / Client | API / Backend | Form UI in React; mutations hit API endpoints |
| Kid selector (active child) | Browser / Client | -- | Pure client-side React context; reads from API data |
| Auth state awareness | Browser / Client | API / Backend | Client calls GET /api/auth/me; server checks session |
| Routing (/challenge/*) | Browser / Client | -- | Wouter nested routes with `nest` prop |

## Standard Stack

### Core (Already Installed -- No New Packages)

| Library | Installed Version | Purpose | Why Standard |
|---------|------------------|---------|--------------|
| express-session | 1.18.1 | Session middleware after magic link verification | Already in package.json, not wired up yet. Industry standard for Express session management. [VERIFIED: node_modules/express-session/package.json] |
| connect-pg-simple | 10.0.0 | Store sessions in PostgreSQL | Already in package.json. Sessions survive Replit restarts (unlike memorystore). [VERIFIED: node_modules/connect-pg-simple/package.json] |
| @sendgrid/mail | 8.1.6 | Send magic link emails | Already integrated in routes.ts, shopRoutes.ts, placementRoutes.ts. Paid account active. [VERIFIED: codebase grep] |
| drizzle-orm | 0.39.3 | New tables (families, kids, challenges) | Already the ORM. Schema in shared/schema.ts. [VERIFIED: node_modules/drizzle-orm/package.json] |
| drizzle-zod | 0.7.0 | createInsertSchema for Zod validation | Already used for all existing tables. [VERIFIED: node_modules/drizzle-zod/package.json] |
| date-fns | 3.6.0 | Age calculation from birthdate | Already installed. `differenceInYears(new Date(), birthdate)` for age track assignment. [VERIFIED: node_modules/date-fns/package.json] |
| wouter | 3.3.5 (installed) | Client routing for /challenge/* | Already the router. `nest` prop handles sub-routes. [VERIFIED: node_modules via npm, Context7 docs confirmed nest prop] |
| Node.js crypto | Built-in | Random token generation | `crypto.randomBytes(32).toString("hex")` -- no package needed. [VERIFIED: Node.js built-in] |

### Supporting (Already Installed)

| Library | Installed Version | Purpose | When to Use |
|---------|------------------|---------|-------------|
| React Hook Form | 7.55.0 | Signup form, kid-add form | All form state management [VERIFIED: package.json] |
| @hookform/resolvers | 3.10.0 | Zod resolver for form validation | Connect Zod schemas to RHF [VERIFIED: package.json] |
| zod | 3.24.2 | Input validation (shared client/server) | All form schemas + API validation [VERIFIED: package.json] |
| @radix-ui/react-select | 2.1.7 | Kid selector dropdown | Multi-kid family kid switcher [VERIFIED: package.json] |
| @radix-ui/react-dialog | 1.1.7 | Kid management modals | Add/edit kid modal from /challenge page [VERIFIED: package.json] |
| @radix-ui/react-checkbox | 1.1.5 | Consent checkbox on signup | Privacy notice acknowledgment [VERIFIED: package.json] |
| framer-motion | 11.18.2 | Kid selector transitions | Smooth switch animation [VERIFIED: package.json] |
| @tanstack/react-query | 5.60.5 | Server state management | Auth state, kids list, challenges data [VERIFIED: package.json] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| crypto.randomBytes + DB | jsonwebtoken (JWT) | JWT adds a dependency; still need DB lookup to find family. Random token is simpler and auto-invalidated. Decision locked in CLAUDE.md. |
| DIY magic link | passport-magic-login | Unnecessary abstraction. Passport isn't used in this codebase. Decision locked in CLAUDE.md. |
| connect-pg-simple | memorystore (in package.json) | memorystore loses sessions on Replit restart. PostgreSQL sessions persist. Decision locked in CLAUDE.md. |

**Installation:**
```bash
# No new packages needed. Everything is already installed.
# After schema changes:
npm run db:push
```

## Architecture Patterns

### System Architecture Diagram

```
[Browser]
    |
    |  1. POST /api/auth/signup { email, consentGiven }
    v
[Express API]
    |-- Generate random token (crypto.randomBytes)
    |-- Store token + expiry in families table
    |-- Send magic link email via SendGrid
    |
    |  2. GET /api/auth/verify?token=abc123
    v
[Express API]
    |-- Look up token in families table
    |-- Verify not expired
    |-- Invalidate token (set to null)
    |-- Create express-session (stored in PostgreSQL via connect-pg-simple)
    |-- Set session cookie (httpOnly, secure, sameSite: lax)
    |-- Redirect to /challenge
    |
    |  3. GET /api/auth/me (on page load)
    v
[Express API]
    |-- Check req.session.familyId
    |-- Return family data + kids list
    |-- Client stores in TanStack Query cache
    |
    |  4. POST /api/kids { firstName, lastName, birthdate }
    v
[Express API]
    |-- Validate with Zod schema
    |-- Calculate age from birthdate (date-fns)
    |-- Assign age track (littlekicks/starter/advanced)
    |-- Generate display name ("First L.")
    |-- Insert into kids table
    |-- Return kid data
    |
    |  5. GET /api/challenges (on page load)
    v
[Express API]
    |-- Query challenges table (seeded at startup)
    |-- Return all 8 weeks of content
    |-- Client filters by active kid's age track
```

### Recommended Project Structure

```
shared/
  schema.ts                    # ADD: families, kids, challenges tables
  challengeValidation.ts       # NEW: Zod schemas for challenge API

server/
  index.ts                     # MODIFY: wire up express-session middleware
  db.ts                        # UNCHANGED: reuse pool for connect-pg-simple
  auth.ts                      # UNCHANGED: existing admin auth stays separate
  challengeAuth.ts             # NEW: family auth middleware (requireFamily)
  challengeRoutes.ts           # NEW: auth + kid + challenge API routes + seed
  
client/src/
  pages/
    challenge/
      index.tsx                # NEW: /challenge hub page (D-10, D-11, D-12)
      signup.tsx               # NEW: /challenge/signup (email + consent form)
  hooks/
    use-auth.tsx               # NEW: auth state hook (TanStack Query)
    use-active-kid.tsx         # NEW: ActiveKidContext provider + hook (D-09)
  components/
    challenge/
      KidSelector.tsx          # NEW: persistent kid selector (D-07, D-08)
      AddKidForm.tsx           # NEW: repeating kid-add form (D-04)
      SignupForm.tsx            # NEW: email + consent form (D-05)
```

### Pattern 1: Session Middleware Setup

**What:** Wire express-session + connect-pg-simple into Express before routes
**When to use:** Server startup, before any route registration
**Example:**
```typescript
// Source: Context7 /voxpelli/node-connect-pg-simple + /expressjs/session
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

const PGStore = connectPgSimple(session);

// Reuse the same pool from db.ts, OR create a separate one
// for session store to avoid coupling
const sessionPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(session({
  store: new PGStore({
    pool: sessionPool,
    tableName: "sessions",
    createTableIfMissing: true,  // auto-creates session table
  }),
  secret: process.env.SESSION_SECRET || "dev-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
}));
```
[VERIFIED: Context7 /expressjs/session + /voxpelli/node-connect-pg-simple]

**Critical placement:** Session middleware MUST be registered in `server/index.ts` AFTER `express.json()` and `express.urlencoded()` but BEFORE `registerRoutes()`. The existing code structure in index.ts has the right shape -- insert session setup between the body parsers and the `registerRoutes` call.

### Pattern 2: Magic Link Token Generation & Verification

**What:** Generate cryptographically secure random token, store with expiry, verify on click
**When to use:** Signup and login flows
**Example:**
```typescript
// Source: Node.js crypto built-in + existing auth.ts HMAC pattern
import { randomBytes } from "crypto";
import { eq, and, gt } from "drizzle-orm";

// Generate
const token = randomBytes(32).toString("hex");
const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
await db.update(families)
  .set({ magicToken: token, tokenExpiresAt: expiresAt })
  .where(eq(families.email, email));

// Verify
const [family] = await db.select().from(families)
  .where(and(
    eq(families.magicToken, token),
    gt(families.tokenExpiresAt, new Date())
  ));

if (!family) {
  return res.status(401).json({ error: "Invalid or expired link" });
}

// Invalidate token + establish session
await db.update(families)
  .set({ magicToken: null, tokenExpiresAt: null })
  .where(eq(families.id, family.id));

req.session.familyId = family.id;
res.redirect("/challenge");
```
[VERIFIED: crypto.randomBytes is Node.js built-in; Drizzle query pattern matches existing codebase]

### Pattern 3: Auto-Seed on Startup

**What:** Idempotent seed that only runs when table is empty
**When to use:** Challenge content initial load
**Example:**
```typescript
// Source: existing coachRoutes.ts seedDivisionsIfEmpty pattern (line 21-26)
const CHALLENGE_SEED = [
  // 8 weeks x 3 tracks = 24 skill rows + 8 fitness rows
  { weekNumber: 1, ageTrack: "littlekicks", type: "skill", title: "First Touch", 
    description: "Toe taps on top of the ball: 3 sets of 30 seconds...", theme: "Ball mastery & control" },
  // ... etc
];

async function seedChallengesIfEmpty() {
  const existing = await db.select({ id: challenges.id }).from(challenges).limit(1);
  if (existing.length > 0) return;
  await db.insert(challenges).values(CHALLENGE_SEED);
  console.log(`Seeded ${CHALLENGE_SEED.length} challenges`);
}

// Called in registerChallengeRoutes()
seedChallengesIfEmpty().catch((e) => console.error("Challenge seed error:", e));
```
[VERIFIED: exact pattern from coachRoutes.ts lines 21-26, confirmed in codebase]

### Pattern 4: Age Track Calculation

**What:** Compute age track from birthdate at kid creation time
**When to use:** POST /api/kids endpoint
**Example:**
```typescript
// Source: date-fns differenceInYears (installed v3.6.0)
import { differenceInYears } from "date-fns";

function getAgeTrack(birthdate: Date): "littlekicks" | "starter" | "advanced" {
  const age = differenceInYears(new Date(), birthdate);
  if (age >= 4 && age <= 6) return "littlekicks";
  if (age >= 7 && age <= 10) return "starter";
  if (age >= 11 && age <= 18) return "advanced";
  throw new Error(`Age ${age} is outside challenge range (4-18)`);
}

function getDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
}
```
[VERIFIED: date-fns v3 differenceInYears API; age ranges from D-03 in CONTEXT.md]

### Pattern 5: Wouter Nested Routes for /challenge/*

**What:** Use `nest` prop on Route to create /challenge sub-routing context
**When to use:** Adding /challenge/* routes to existing App.tsx
**Example:**
```typescript
// Source: Context7 /molefrog/wouter -- confirmed nest prop in v3
import { Route, Switch } from "wouter";

// In App.tsx Router:
<Route path="/challenge" nest>
  <Switch>
    <Route path="/">
      <ChallengeHub />     {/* /challenge */}
    </Route>
    <Route path="/signup">
      <ChallengeSignup />  {/* /challenge/signup */}
    </Route>
  </Switch>
</Route>
```
[VERIFIED: Context7 /molefrog/wouter confirmed nest prop creates relative routing context]

### Pattern 6: Family Auth Middleware

**What:** Express middleware that checks session for familyId, loads family data
**When to use:** All /api/challenge/* routes that require authentication
**Example:**
```typescript
// Source: modeled after existing requireAuth in auth.ts
import type { Request, Response, NextFunction } from "express";

export function requireFamily(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.familyId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}
```
[VERIFIED: pattern consistent with existing auth.ts requireAuth; express-session types already in devDependencies]

### Anti-Patterns to Avoid
- **Sharing the admin HMAC auth for family auth:** Admin uses Bearer token + HMAC. Family auth uses session cookies. These are completely separate auth systems -- do not merge them.
- **Storing session data in memorystore:** Already in package.json but loses data on Replit restart. Use connect-pg-simple exclusively.
- **Creating a separate pool for connect-pg-simple when pool from db.ts is available:** The pool in `server/db.ts` wraps `pg.Pool` and can be shared. However, `db.ts` exports a Drizzle instance, not the raw pool. Either export the pool separately from db.ts, or create a small dedicated pool for sessions. Both are fine -- just don't create a third connection pattern.
- **Using JWT for magic link tokens:** Random token + DB lookup is simpler. JWT adds a dependency and the token still needs DB context (which family?).
- **Parsing the proposal HTML at runtime:** Extract challenge data manually into a TypeScript array at development time. The HTML is a reference document, not a data source.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session storage | Custom cookie parsing/encryption | express-session + connect-pg-simple | Session fixation protection, cookie signing, store abstraction -- all built-in |
| CSRF protection | Nothing (for now) | express-session's cookie config | sameSite: "lax" + httpOnly provides baseline protection for this use case |
| Email delivery | Direct SMTP connection | @sendgrid/mail | Already integrated, handles retries, bounce handling, deliverability |
| Form validation | Manual if/else chains | Zod schemas (shared) + React Hook Form + @hookform/resolvers | Type-safe, shared between client and server, existing pattern |
| Date calculation | Manual date math | date-fns differenceInYears | Handles leap years, timezone edge cases correctly |

**Key insight:** Every tool needed for this phase is already installed. The risk is not missing libraries -- it's incorrect wiring of existing dependencies.

## Common Pitfalls

### Pitfall 1: Session Middleware Ordering
**What goes wrong:** Sessions don't work because middleware is registered after routes, or before body parsers
**Why it happens:** Express middleware is order-dependent. Session middleware must come after body parsers but before route handlers.
**How to avoid:** In server/index.ts, insert session setup between the `app.use(express.json())` block (line ~17) and the `registerRoutes()` call (line ~65). Verify by logging `req.session` in a test route.
**Warning signs:** `req.session` is undefined in route handlers; cookies not being set in browser.

### Pitfall 2: Cookie Secure Flag in Development
**What goes wrong:** Cookies not set in local development because `secure: true` requires HTTPS
**Why it happens:** Replit serves over HTTPS in production, but local dev uses HTTP
**How to avoid:** Use `secure: process.env.NODE_ENV === "production"` -- exactly what the existing codebase does with other environment checks.
**Warning signs:** Login works in Replit but not locally; cookie visible in Network tab but not stored.

### Pitfall 3: connect-pg-simple Table Creation
**What goes wrong:** Session store fails because the `sessions` table doesn't exist
**Why it happens:** connect-pg-simple doesn't auto-create the table by default
**How to avoid:** Use `createTableIfMissing: true` option. This auto-creates the table on first use. [VERIFIED: Context7 /voxpelli/node-connect-pg-simple]
**Warning signs:** PostgreSQL error about missing "sessions" table on first request.

### Pitfall 4: Magic Link Token Expiry Race Condition
**What goes wrong:** User clicks magic link after token expires; gets cryptic error
**Why it happens:** 15-minute token expiry is tight if email delivery is slow
**How to avoid:** Use 15-minute expiry (generous enough for email delays), clear error message ("This link has expired. Request a new one."), and a "resend" button on the error page.
**Warning signs:** Users reporting "link doesn't work" especially with Gmail/Yahoo (which can delay delivery).

### Pitfall 5: Trust Proxy for Secure Cookies Behind Replit Proxy
**What goes wrong:** Secure cookies not set because Express doesn't see the request as HTTPS
**Why it happens:** Replit terminates TLS at the proxy. Express sees HTTP unless `trust proxy` is set.
**How to avoid:** Add `app.set("trust proxy", 1)` in server/index.ts before session middleware when in production. [VERIFIED: Context7 /expressjs/session recommends this for proxy deployments]
**Warning signs:** Set-Cookie header missing `Secure` flag in production; session not persisting on Replit.

### Pitfall 6: Drizzle `date` Column Returns String
**What goes wrong:** `birthdate` column returns a string like "2018-03-15" instead of a Date object
**Why it happens:** Drizzle's `date()` column type returns a string by default in PostgreSQL mode
**How to avoid:** Use `date("birthdate", { mode: "date" })` to get JavaScript Date objects, OR parse the string with `new Date()` when computing age. Either approach works. [VERIFIED: Context7 /drizzle-team/drizzle-orm-docs]
**Warning signs:** `differenceInYears` returning NaN or incorrect values because it receives a string.

### Pitfall 7: Forgetting `credentials: "include"` on Fetch Calls
**What goes wrong:** Session cookie not sent with API requests; user appears unauthenticated
**Why it happens:** Fetch doesn't send cookies by default for cross-origin requests
**How to avoid:** The existing `apiRequest` and `getQueryFn` in `client/src/lib/queryClient.ts` already use `credentials: "include"`. Use these helpers for all challenge API calls -- don't write raw fetch. [VERIFIED: queryClient.ts lines 12 and 33]
**Warning signs:** GET /api/auth/me returns 401 even after successful login.

## Code Examples

### Database Schema (Drizzle)

```typescript
// Source: existing schema.ts patterns (UUID PKs, createInsertSchema, typed exports)
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),  // optional parent name
  magicToken: text("magic_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  consentGivenAt: timestamp("consent_given_at"),
  isRegistered: boolean("is_registered").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const kids = pgTable("kids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  birthdate: date("birthdate", { mode: "date" }).notNull(),
  ageTrack: text("age_track").notNull(),  // "littlekicks" | "starter" | "advanced"
  displayName: text("display_name").notNull(),  // "First L."
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekNumber: integer("week_number").notNull(),
  ageTrack: text("age_track").notNull(),  // "littlekicks" | "starter" | "advanced" | "all" (for fitness)
  type: text("type").notNull(),  // "skill" | "fitness"
  title: text("title").notNull(),
  theme: text("theme"),  // "Ball mastery & control", etc.
  description: text("description").notNull(),
  videoUrl: text("video_url"),  // YouTube instructional embed URL
  weekStart: date("week_start"),  // "2026-06-09" etc.
  weekEnd: date("week_end"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas (matching existing pattern)
export const insertFamilySchema = createInsertSchema(families).omit({
  id: true, createdAt: true, magicToken: true, tokenExpiresAt: true,
});
export const insertKidSchema = createInsertSchema(kids).omit({
  id: true, createdAt: true, ageTrack: true, displayName: true,
});
export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true, createdAt: true,
});

// Types (matching existing pattern)
export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type Family = typeof families.$inferSelect;
export type InsertKid = z.infer<typeof insertKidSchema>;
export type Kid = typeof kids.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
```
[VERIFIED: pattern matches existing schema.ts -- UUID PKs via gen_random_uuid(), createInsertSchema, typed exports]

### SendGrid Magic Link Email

```typescript
// Source: existing SendGrid pattern from routes.ts + shopRoutes.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

async function sendMagicLink(email: string, token: string) {
  const origin = process.env.APP_URL || "https://nipomosc.org";
  const verifyUrl = `${origin}/api/auth/verify?token=${token}`;
  
  await sgMail.send({
    to: email,
    from: "admin@nipomosc.org",  // matches existing from address
    subject: "Your Summer Skills Challenge Login Link",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8B2332; padding: 28px 32px; text-align: center;">
          <p style="margin: 0; color: #F5F5F0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Nipomo Soccer</p>
          <h1 style="margin: 8px 0 0; color: #ffffff; font-size: 24px;">Summer Skills Challenge</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #333; font-size: 16px;">Click the button below to log in:</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #8B2332; color: #F5F5F0; padding: 14px 32px; text-decoration: none; font-weight: 700; font-size: 16px; margin: 16px 0;">
            Log In to Challenge
          </a>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
        </div>
      </div>
    `,
  });
}
```
[VERIFIED: SendGrid pattern matches existing shopRoutes.ts email template; brand colors from CLAUDE.md]

### Express Session Type Declaration

```typescript
// Needed so TypeScript knows about req.session.familyId
declare module "express-session" {
  interface SessionData {
    familyId: string;
  }
}
```
[VERIFIED: @types/express-session in devDependencies; standard TypeScript session augmentation pattern]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| express-session + MemoryStore | express-session + connect-pg-simple | Already in package.json | Sessions survive process restart |
| Passport.js for all auth | DIY for simple flows | Industry trend 2023+ | Passport adds overhead for magic-link-only auth |
| drizzle-zod createInsertSchema | Same (stable API) | drizzle-zod 0.7.0 | No migration needed |
| Wouter v2 without nest | Wouter v3 with nest prop | v3.0.0 (2024) | Enables /challenge/* sub-routing cleanly |

**Deprecated/outdated:**
- `MemoryStore` (express-session default): In-memory, loses data on restart. Never use in production. connect-pg-simple replaces it.
- `passport` + `passport-local`: Already in package.json but not used. Not needed for magic link auth. Do not wire up.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | SendGrid `from: "admin@nipomosc.org"` will work for magic link emails (SPF/DKIM configured) | Code Examples | Medium -- if email deliverability fails, magic links don't arrive. STATE.md flags this as a concern. Mitigated by the fact that 3 existing route files already send from this address successfully. |
| A2 | Replit serves the app over HTTPS in production (needed for secure cookies) | Pitfalls | Low -- Replit Autoscale always uses HTTPS via their proxy. `trust proxy` needed to make Express aware. [ASSUMED] |
| A3 | `APP_URL` env var available (or can be set) for constructing magic link URLs | Code Examples | Low -- can fall back to `req.protocol + "://" + req.get("host")` from the request object. |
| A4 | 50 families x average 2 kids = ~100 kids is the expected scale | Architecture | Low -- if scale is higher, same approach works fine. PostgreSQL handles this trivially. |

## Open Questions

1. **Session secret environment variable**
   - What we know: `server/auth.ts` falls back to `process.env.SESSION_SECRET || process.env.STRIPE_SECRET_KEY || "dev-hmac-secret"`. SESSION_SECRET may or may not be set as its own env var in Replit.
   - What's unclear: Whether SESSION_SECRET is already set in Replit's secrets, or needs to be created.
   - Recommendation: Check Replit secrets. If not set, generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` and add it. Use it for both session signing and the existing HMAC auth.

2. **Fitness bonus challenge structure in DB**
   - What we know: The proposal has one fitness bonus per week, but the bonus varies by age track (e.g., "3 x 20 Jumping Jacks" for Little Kicks vs. "5 min circuit" for Advanced).
   - What's unclear: Should fitness bonuses be stored as 1 row per week (with description containing all 3 variations) or 3 rows per week (one per age track)?
   - Recommendation: 3 rows per week (one per age track) for consistency with skill challenges. Total: 8 weeks x 3 tracks x 2 types = 48 challenge rows. This makes the query pattern identical: `WHERE weekNumber = ? AND ageTrack = ? AND type = ?`.

3. **Edge case: kids whose age falls outside 4-18**
   - What we know: Age tracks are 4-6, 7-10, 11-18. D-03 doesn't mention what happens for kids under 4 or over 18.
   - What's unclear: Should the API reject out-of-range birthdates, or assign to nearest track?
   - Recommendation: Reject with a friendly error: "The Summer Skills Challenge is for kids ages 4-18." Validate birthdate on the form and server.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Everything | Yes | (Replit-managed) | -- |
| PostgreSQL (Neon) | Database | Yes | 16 (via Replit) | -- |
| SendGrid API | Magic link emails | Yes | API key in env | -- |
| express-session | Session management | Yes (installed) | 1.18.1 | -- |
| connect-pg-simple | Session storage | Yes (installed) | 10.0.0 | -- |
| drizzle-kit | Schema push | Yes (installed) | 0.31.4 | -- |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Magic link with crypto.randomBytes(32), 15-min token expiry, single-use tokens (invalidated after verification) |
| V3 Session Management | Yes | express-session with httpOnly, secure, sameSite:lax cookies. 30-day maxAge. connect-pg-simple for server-side storage. |
| V4 Access Control | Yes | requireFamily middleware checks session.familyId. Kids scoped to family via familyId FK. |
| V5 Input Validation | Yes | Zod schemas (shared client/server) for all form inputs. drizzle-zod createInsertSchema for DB validation. |
| V6 Cryptography | No | No encryption needed. Token generation uses Node.js crypto built-in. |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Token guessing (brute force magic link) | Spoofing | 32 bytes of randomness = 2^256 possible tokens. Rate limit /api/auth/signup. |
| Session fixation | Spoofing | express-session regenerates session ID on login by default when using `req.session.regenerate()`. Call it after setting familyId. |
| Token replay (reusing expired magic link) | Replay | Token set to null immediately after successful verification. Expiry checked server-side. |
| CSRF on state-changing endpoints | Tampering | sameSite: "lax" cookie prevents cross-origin POST. All mutations use POST/PATCH, not GET. |
| Email enumeration | Information Disclosure | Return same response for existing and non-existing emails ("If that email is registered, you'll receive a link"). |
| Kids data exposure across families | Elevation of Privilege | All kid queries include `WHERE familyId = req.session.familyId`. Never expose kids from other families. |

## Sources

### Primary (HIGH confidence)
- Context7 `/molefrog/wouter` -- nested routes, `nest` prop, relative path behavior [VERIFIED]
- Context7 `/expressjs/session` -- session middleware configuration, cookie options, trust proxy [VERIFIED]
- Context7 `/voxpelli/node-connect-pg-simple` -- pool sharing, createTableIfMissing, table naming [VERIFIED]
- Context7 `/drizzle-team/drizzle-orm-docs` -- date column with mode: "date", pgTable patterns [VERIFIED]
- Existing codebase `shared/schema.ts` -- UUID PK pattern, createInsertSchema, type exports [VERIFIED: direct read]
- Existing codebase `server/coachRoutes.ts` -- seedDivisionsIfEmpty pattern (lines 21-26) [VERIFIED: direct read]
- Existing codebase `server/auth.ts` -- HMAC admin auth pattern (separate from family auth) [VERIFIED: direct read]
- Existing codebase `client/src/lib/queryClient.ts` -- credentials: "include" already set [VERIFIED: direct read]
- Existing codebase `server/index.ts` -- middleware ordering, route registration flow [VERIFIED: direct read]
- Existing codebase `package.json` -- all dependencies confirmed installed [VERIFIED: direct read + node_modules checks]
- `marketing/summer-skills-challenge-proposal.html` -- 8-week challenge calendar, seed data source [VERIFIED: direct read]

### Secondary (MEDIUM confidence)
- express-session docs on trust proxy for Replit deployment [CITED: Context7 + standard Express proxy pattern]
- SendGrid email template pattern derived from existing shopRoutes.ts [VERIFIED: codebase]

### Tertiary (LOW confidence)
- None -- all claims verified against codebase or Context7 documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- every package verified as already installed, versions confirmed from node_modules
- Architecture: HIGH -- all patterns derived from existing codebase conventions
- Pitfalls: HIGH -- common Express session issues well-documented; Drizzle date mode verified in Context7
- Security: HIGH -- ASVS L1 controls are standard for this stack

**Research date:** 2026-05-28
**Valid until:** 2026-06-28 (stable stack, no fast-moving dependencies)
