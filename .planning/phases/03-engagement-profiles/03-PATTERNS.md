# Phase 3: Engagement & Profiles - Pattern Map

**Mapped:** 2026-05-29
**Files analyzed:** 8 (3 new, 5 modified)
**Analogs found:** 8 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `server/challengeRoutes.ts` (MODIFY) | controller | request-response | `server/challengeRoutes.ts` (self -- GET /api/leaderboard) | exact |
| `client/src/pages/challenge/player.tsx` (NEW) | page | request-response | `client/src/pages/challenge/leaderboard.tsx` | exact |
| `client/src/components/challenge/BadgeIcon.tsx` (NEW) | component | transform | `client/src/components/challenge/PodiumCard.tsx` | role-match |
| `client/src/components/challenge/StreakBadge.tsx` (NEW) | component | transform | `client/src/components/challenge/TrackPill.tsx` | role-match |
| `client/src/components/challenge/PlayerRow.tsx` (MODIFY) | component | transform | `client/src/components/challenge/PlayerRow.tsx` (self) | exact |
| `client/src/components/challenge/PodiumCard.tsx` (MODIFY) | component | transform | `client/src/components/challenge/PodiumCard.tsx` (self) | exact |
| `client/src/lib/badges.ts` (NEW) | utility | transform | `client/src/lib/queryClient.ts` | role-match |
| `client/src/App.tsx` (MODIFY) | config | routing | `client/src/App.tsx` (self -- /challenge nest) | exact |

## Pattern Assignments

### `server/challengeRoutes.ts` (controller, request-response) -- MODIFY

**Analog:** Self -- `GET /api/leaderboard` endpoint at lines 585-626

**Imports pattern** (lines 1-9):
```typescript
import type { Express } from "express";
import { db } from "./db";
import { families, kids, challenges, submissions } from "@shared/schema";
import { eq, and, gt, desc, gte, lt, count, sql } from "drizzle-orm";
import { requireFamily } from "./challengeAuth";
import { randomBytes } from "crypto";
import { differenceInYears, startOfDay, endOfDay } from "date-fns";
import sgMail from "@sendgrid/mail";
import { z } from "zod";
```

**Public endpoint pattern (no auth)** (lines 585-626):
```typescript
// GET /api/leaderboard -- Public ranked leaderboard (LDR-01, LDR-04, LDR-05, LDR-06, PRIV-02, PRIV-03)
// NOTE: No requireFamily -- this is a public endpoint per D-08
app.get("/api/leaderboard", async (_req, res) => {
  try {
    const leaderboard = await db
      .select({
        kidId: kids.id,
        displayName: kids.displayName,
        ageTrack: kids.ageTrack,
        totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)`,
        isRegistered: families.isRegistered,
      })
      .from(submissions)
      .innerJoin(kids, eq(submissions.kidId, kids.id))
      .innerJoin(families, eq(kids.familyId, families.id))
      .groupBy(kids.id, kids.displayName, kids.ageTrack, families.isRegistered)
      .orderBy(desc(sql`sum(${submissions.points})`));

    // Add rank numbers
    const ranked = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.json({
      leaderboard: ranked,
      stats: { ... },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});
```

**Drizzle JOIN query pattern** (POST /api/submissions approach at lines 422-476):
```typescript
// Verify entity exists then query with JOIN
const [kid] = await db.select().from(kids).where(eq(kids.id, kidId));
if (!kid) return res.status(404).json({ error: "Kid not found" });

// Query with innerJoin
const kidSubmissions = await db.select({
  type: submissions.type,
  weekNumber: submissions.weekNumber,
  points: submissions.points,
  submittedAt: submissions.submittedAt,
})
.from(submissions)
.innerJoin(challenges, eq(submissions.challengeId, challenges.id))
.where(eq(submissions.kidId, kidId))
.orderBy(desc(submissions.submittedAt));
```

**Error handling pattern** (consistent across all endpoints):
```typescript
} catch (error) {
  console.error("[Context] error:", error);
  res.status(500).json({ error: "Human-friendly error message" });
}
```

**Key conventions for new GET /api/player/:id:**
- No `requireFamily` middleware (public endpoint like leaderboard)
- Use `_req` parameter name when request body is unused
- Use destructured params: `const { id } = req.params;`
- Return 404 with `{ error: "..." }` if entity not found
- All routes registered inside `registerChallengeRoutes(app: Express)` function body

---

### `client/src/pages/challenge/player.tsx` (page, request-response) -- NEW

**Analog:** `client/src/pages/challenge/leaderboard.tsx`

**Imports pattern** (lines 1-11):
```typescript
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import * as Tabs from "@radix-ui/react-tabs";
import { Trophy } from "lucide-react";
import LeaderboardHero from "@/components/challenge/LeaderboardHero";
import PodiumCard from "@/components/challenge/PodiumCard";
import PlayerRow from "@/components/challenge/PlayerRow";
import type { Challenge } from "@shared/schema";
```

**TanStack Query data fetching pattern** (lines 53-58):
```typescript
const { data: leaderboardData, isLoading } = useQuery<LeaderboardResponse>({
  queryKey: ["/api/leaderboard"],
  queryFn: getQueryFn({ on401: "returnNull" }),
  staleTime: 30 * 1000,
  refetchOnWindowFocus: true,
});
```

**Loading state pattern** (lines 96-102):
```typescript
if (isLoading) {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

**Page shell pattern** (lines 104-191):
```typescript
return (
  <div className="min-h-screen bg-night">
    <Header />
    {/* Hero section */}
    <main className="max-w-2xl mx-auto px-4 pt-28 pb-8">
      {/* Page content */}
    </main>
    <Footer />
  </div>
);
```

**Key conventions for new player.tsx:**
- Default export: `export default function PlayerProfile()`
- Use `useParams` from wouter for route param
- Use `getQueryFn({ on401: "returnNull" })` since it's a public page
- Follow same bg-night + Header/Footer shell
- `max-w-2xl mx-auto px-4` container pattern
- Interface types defined above component

---

### `client/src/components/challenge/BadgeIcon.tsx` (component, transform) -- NEW

**Analog:** `client/src/components/challenge/PodiumCard.tsx`

**Framer Motion animation pattern** (lines 56-61):
```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1.0 }}
  transition={{ duration: 0.4, type: "spring", delay: (rank - 1) * 0.1 }}
  className={`...`}
>
```

**Component interface + default export pattern** (lines 9-13, 47):
```typescript
interface PodiumCardProps {
  rank: number;
  displayName: string;
  ageTrack: string;
  totalPoints: number;
  isRegistered: boolean;
}

export default function PodiumCard({ ... }: PodiumCardProps) {
```

**Lucide icon usage** (from LeaderboardHero.tsx line 1):
```typescript
import { Trophy } from "lucide-react";
// Used as: <Trophy className="w-4 h-4 text-gold" />
```

**Key conventions for BadgeIcon.tsx:**
- Single component per file with default export
- Interface defined above component
- Framer Motion for entrance animations with staggered delay
- Lucide icons imported by name (Flame, Star, Award, Crown, Trophy)
- Tailwind color classes applied directly

---

### `client/src/components/challenge/StreakBadge.tsx` (component, transform) -- NEW

**Analog:** `client/src/components/challenge/TrackPill.tsx`

**Small display component pattern** (lines 9-35):
```typescript
interface TrackPillProps {
  challenge: Challenge;
  isActive: boolean;
}

export default function TrackPill({ challenge, isActive }: TrackPillProps) {
  return (
    <div
      className={`rounded-lg p-3 ${
        isActive
          ? "bg-crimson/10 border border-crimson/30"
          : "bg-warmwhite/5 border border-warmwhite/8"
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-crimson">
        {AGE_TRACK_LABELS[challenge.ageTrack] ?? challenge.ageTrack}
      </span>
    </div>
  );
}
```

**Key conventions for StreakBadge.tsx:**
- Simple props interface (streak count number, optional size variant)
- Conditional styling with template literals
- Compact component, no state, pure render
- Follow same text-xs font-bold uppercase pattern for labels

---

### `client/src/components/challenge/PlayerRow.tsx` (component, transform) -- MODIFY

**Current file:** `client/src/components/challenge/PlayerRow.tsx` (99 lines)

**Existing structure** (lines 35-99):
```typescript
interface PlayerRowProps {
  rank: number;
  kidId: string;
  displayName: string;
  ageTrack: string;
  totalPoints: number;
  isRegistered: boolean;
  index: number;
}

export default function PlayerRow({
  rank, kidId, displayName, ageTrack, totalPoints, isRegistered, index,
}: PlayerRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.03 }}
      className="flex items-center gap-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg px-4 py-3 hover:border-crimson transition-colors"
    >
      {/* Rank */}
      {/* Avatar */}
      {/* Name + age track */}
      {/* NSC Player badge */}
      {/* Points */}
    </motion.div>
  );
}
```

**Modification plan:**
- Add `currentStreak` and `badgeCount` to PlayerRowProps interface
- Wrap `<motion.div>` in a `<Link href={...}>` from wouter
- Add streak/badge indicators between NSC badge and Points sections
- Import `Link` from "wouter" and `Flame` from "lucide-react"

**Link wrapping pattern** (from Footer/Header -- verified in codebase):
```typescript
import { Link } from "wouter";
// Wrap as: <Link href={`/challenge/player/${kidId}`}>...</Link>
```

---

### `client/src/components/challenge/PodiumCard.tsx` (component, transform) -- MODIFY

**Current file:** `client/src/components/challenge/PodiumCard.tsx` (99 lines)

**Existing structure** (lines 47-99):
```typescript
export default function PodiumCard({
  rank, displayName, ageTrack, totalPoints, isRegistered,
}: PodiumCardProps) {
  const config = RANK_CONFIG[rank] ?? RANK_CONFIG[3];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1.0 }}
      transition={{ duration: 0.4, type: "spring", delay: (rank - 1) * 0.1 }}
      className={`bg-warmwhite/5 border-2 ${config.border} rounded-lg p-4 text-center relative`}
    >
      {/* Rank badge, Avatar, Name, Age track, Points, NSC badge */}
    </motion.div>
  );
}
```

**Modification plan:**
- Add `kidId`, `currentStreak`, `badgeCount` to PodiumCardProps
- Wrap `<motion.div>` in `<Link href={...}>` from wouter
- Add streak indicator below Points section
- Import `Link` from "wouter" and `Flame` from "lucide-react"

---

### `client/src/lib/badges.ts` (utility, transform) -- NEW

**Analog:** `client/src/lib/queryClient.ts`

**Lib file pattern** (lines 1-57):
```typescript
// Pure exports, no side effects at module level
// Named exports (not default export)
// TypeScript types exported alongside values

import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Constants + utility functions + type exports
export async function apiRequest(...) { ... }
export const getQueryFn: <T>(...) => ...;
export const queryClient = new QueryClient({ ... });
```

**Key conventions for badges.ts:**
- Named exports only (no default export)
- Export TypeScript types alongside values
- `as const` for constant arrays (enables type narrowing)
- No side effects -- pure definitions
- No React imports (this is shared logic)

---

### `client/src/App.tsx` (config, routing) -- MODIFY

**Current /challenge nest** (lines 58-70):
```typescript
<Route path="/challenge" nest>
  <Switch>
    <Route path="/">
      <ChallengeHub />
    </Route>
    <Route path="/signup">
      <ChallengeSignup />
    </Route>
    <Route path="/leaderboard">
      <Leaderboard />
    </Route>
  </Switch>
</Route>
```

**Modification plan:**
- Add `import PlayerProfile from "@/pages/challenge/player";` at top
- Add new route inside the /challenge nest Switch:
```typescript
<Route path="/player/:id">
  <PlayerProfile />
</Route>
```
- Pattern: dynamic param route uses `:id` syntax in Wouter

---

## Shared Patterns

### Page Shell (Header + Footer + bg-night)
**Source:** `client/src/pages/challenge/leaderboard.tsx` lines 104-191
**Apply to:** `player.tsx`
```typescript
return (
  <div className="min-h-screen bg-night">
    <Header />
    {/* Hero/header section */}
    <main className="max-w-2xl mx-auto px-4 pt-28 pb-8">
      {/* Content */}
    </main>
    <Footer />
  </div>
);
```

### TanStack Query Public Data Fetch
**Source:** `client/src/pages/challenge/leaderboard.tsx` lines 53-58
**Apply to:** `player.tsx`
```typescript
const { data, isLoading } = useQuery<ResponseType>({
  queryKey: ["/api/endpoint"],
  queryFn: getQueryFn({ on401: "returnNull" }),
  staleTime: 30 * 1000,
  refetchOnWindowFocus: true,
});
```

### Public API Endpoint (No Auth)
**Source:** `server/challengeRoutes.ts` lines 585-626
**Apply to:** New GET /api/player/:id endpoint
```typescript
// No requireFamily middleware -- public endpoint
app.get("/api/player/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // ... query logic ...
    res.json({ ... });
  } catch (error) {
    console.error("[Context] error:", error);
    res.status(500).json({ error: "Human-friendly message" });
  }
});
```

### Framer Motion Stagger Animation
**Source:** `client/src/components/challenge/PodiumCard.tsx` lines 56-61
**Apply to:** `BadgeIcon.tsx`, badge grid on player profile
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1.0 }}
  transition={{ duration: 0.4, type: "spring", delay: index * 0.1 }}
>
```

### Component Structure
**Source:** All challenge components
**Apply to:** `BadgeIcon.tsx`, `StreakBadge.tsx`
```typescript
// 1. Imports
import { motion } from "framer-motion";
import { IconName } from "lucide-react";

// 2. Constants (if any)
const LABELS: Record<string, string> = { ... };

// 3. Interface
interface ComponentProps { ... }

// 4. Default export function
export default function Component({ ... }: ComponentProps) {
  return ( ... );
}
```

### Wouter Link Navigation
**Source:** Verified in codebase (Header.tsx, Footer.tsx use `<Link>` from "wouter")
**Apply to:** `PlayerRow.tsx`, `PodiumCard.tsx` modifications
```typescript
import { Link } from "wouter";
// Wrap clickable content:
<Link href={`/challenge/player/${kidId}`}>
  <motion.div className="... cursor-pointer">
    {/* existing content */}
  </motion.div>
</Link>
```

### Drizzle Select with Type-Safe Columns
**Source:** `server/challengeRoutes.ts` lines 268-270 (GET /api/auth/me)
**Apply to:** GET /api/player/:id -- select only public fields
```typescript
const [kid] = await db.select({
  id: kids.id,
  displayName: kids.displayName,
  ageTrack: kids.ageTrack,
}).from(kids).where(eq(kids.id, id));
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| -- | -- | -- | All files have close analogs in the existing codebase |

## Metadata

**Analog search scope:** `/Users/johnnypage/Projects/nipomo-soccer-website/` (server/, client/src/pages/challenge/, client/src/components/challenge/, client/src/lib/, shared/)
**Files scanned:** 22
**Pattern extraction date:** 2026-05-29
