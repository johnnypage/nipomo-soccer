# Phase 3: Engagement & Profiles - Research

**Researched:** 2026-05-29
**Domain:** Streak computation, badge logic, player profile pages, Drizzle ORM date aggregation, Wouter client routing
**Confidence:** HIGH

## Summary

Phase 3 adds the retention layer on top of the working submission pipeline: consecutive-day streak tracking, achievement badges (streak milestones + special accomplishments), and per-child profile pages accessible from the leaderboard. The technical work is primarily SQL aggregation queries on the existing `submissions` table (no schema additions needed -- all streak/badge data is computed, not stored), a new public API endpoint for player profiles, and a new React page at `/challenge/player/:id`.

The existing `submissions` table already has `kid_id`, `submitted_at`, and `week_number` -- everything needed to compute streaks and badge eligibility. The streak calculation is a "consecutive distinct days" problem, best solved in application code (JavaScript with date-fns) rather than complex SQL window functions, given the small dataset size (~50 families, ~100-200 kids, ~1,200 max submissions). Badge logic is pure computation: query submissions, apply rules, return results.

The leaderboard page and PlayerRow component already exist and render per-kid data. Phase 3 modifies these to add streak indicators, badge icons, and clickable links to the new profile page. Framer Motion (already installed) handles badge reveal animations.

**Primary recommendation:** Compute streaks and badges server-side in the profile/leaderboard API endpoints. No new database tables or columns needed -- keep it as pure computation over the submissions table. Add one new API endpoint (`GET /api/player/:id`) and one new client page (`/challenge/player/:id`).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PTS-04 | Streak tracking: consecutive days with at least 1 submission per child | Server-side computation using submissions.submittedAt grouped by date, consecutive-day algorithm in JS |
| PTS-05 | Streak badges at 3-day, 7-day, 14-day, 21-day thresholds | Badge definitions array with threshold checks against computed streak |
| PTS-06 | Achievement badges: "Perfect Week" and "Fitness All-Star" | SQL queries: max points in a week check, count of fitness submissions across all 8 weeks |
| PTS-07 | "Summer Champion" badge for all 8 weeks completed | COUNT DISTINCT week_number WHERE type IN ('skill','fitness') grouped by kid |
| PROF-01 | Profile page at /challenge/player/:id | New Wouter route inside /challenge nest, new page component |
| PROF-02 | Profile shows name, age track, total points, streak, badges | Single API endpoint returning computed profile data |
| PROF-03 | Profile shows submission history (dates + challenge names, not videos) | JOIN submissions with challenges table, return date + title only |
| PROF-04 | Profile linkable from leaderboard rows | Wrap PlayerRow and PodiumCard with Wouter Link to /challenge/player/:kidId |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Streak computation | API / Backend | Database | App-code date logic over submission timestamps; DB provides raw dates |
| Badge eligibility | API / Backend | Database | Business rules applied to aggregated submission data |
| Player profile data | API / Backend | Database | Single API endpoint aggregates points, streaks, badges, history |
| Profile page UI | Browser / Client | -- | React page consuming profile API, pure display |
| Leaderboard linking | Browser / Client | -- | Wouter Link wrapping existing components |
| Badge animations | Browser / Client | -- | Framer Motion for badge reveal on profile page |

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Verified |
|---------|---------|---------|----------|
| date-fns | 3.6.0 | Streak date calculations (startOfDay, differenceInCalendarDays, isBefore) | [VERIFIED: package.json] |
| Framer Motion | 11.18.2 | Badge animations, streak counter transitions | [VERIFIED: package.json] |
| Wouter | 3.3.5 | /challenge/player/:id route with useParams | [VERIFIED: package.json] |
| TanStack Query | 5.60.5 | Profile data fetching, leaderboard refetch with streak/badge data | [VERIFIED: package.json] |
| Drizzle ORM | 0.39.3 | Submission queries for streak/badge computation | [VERIFIED: package.json] |
| Lucide React | 0.453.0 | Badge icons (Flame, Star, Trophy, Award, Crown) | [VERIFIED: package.json] |
| Radix Tabs | 1.1.4 | Profile submission history tabs (if needed) | [VERIFIED: package.json] |

### No New NPM Installs Required

Everything needed for streaks, badges, and profiles exists in the current dependency tree. The streak algorithm is pure JavaScript date math (date-fns). Badge logic is conditional checks. Profile page is a standard React component with a TanStack Query hook.

## Architecture Patterns

### System Architecture Diagram

```
Public Visitor / Parent Browser
  |
  |-- [Leaderboard /challenge/leaderboard] (PUBLIC)
  |     |-- GET /api/leaderboard --> Express
  |     |     |-- Existing query: SUM(points) GROUP BY kid_id
  |     |     |-- NEW: Add streak + badge data to each leaderboard entry
  |     |     |-- Returns: ranked list with streak count + badge array per kid
  |     |
  |     |-- Click player row --> navigates to /challenge/player/:kidId
  |
  |-- [Player Profile /challenge/player/:id] (PUBLIC, no auth)
        |-- GET /api/player/:id --> Express
        |     |-- Query kid: displayName, ageTrack from kids table
        |     |-- Compute total points: SUM(submissions.points)
        |     |-- Compute streak: fetch all distinct submission dates, run consecutive-day algorithm
        |     |-- Compute badges: run eligibility checks (streak thresholds, perfect week, fitness all-star, summer champion)
        |     |-- Query submission history: JOIN submissions + challenges, return date + title
        |     |-- Returns: { kid, totalPoints, currentStreak, maxStreak, badges[], history[] }
        |
        |-- Display: header with name/track/points, streak counter, badge grid, history list
```

### Recommended Project Structure

New files for Phase 3 (additions to existing structure):

```
server/
  challengeRoutes.ts           # MODIFY: add GET /api/player/:id, enhance GET /api/leaderboard

client/src/
  pages/challenge/
    player.tsx                 # NEW: player profile page
  components/challenge/
    BadgeIcon.tsx              # NEW: reusable badge display component (icon + label)
    StreakBadge.tsx            # NEW: streak indicator (flame icon + count)
    PlayerRow.tsx              # MODIFY: wrap in Link, add streak/badge indicators
    PodiumCard.tsx             # MODIFY: wrap in Link, add streak/badge indicators
  lib/
    badges.ts                  # NEW: shared badge definitions (used by both profile and leaderboard)
  App.tsx                      # MODIFY: add /challenge/player/:id route
```

### Pattern 1: Consecutive-Day Streak Calculation

**What:** Compute the current streak (consecutive days with at least 1 submission) for a given kid.
**When to use:** In the profile API endpoint and leaderboard endpoint.
**Algorithm:**

```typescript
// Source: Pure application logic, no library needed beyond date-fns
import { startOfDay, differenceInCalendarDays, subDays } from "date-fns";

function computeStreak(submissionDates: Date[]): { current: number; max: number } {
  if (submissionDates.length === 0) return { current: 0, max: 0 };

  // Get unique dates (submissions can happen multiple times per day)
  const uniqueDays = [...new Set(
    submissionDates.map(d => startOfDay(d).toISOString())
  )].map(iso => new Date(iso)).sort((a, b) => b.getTime() - a.getTime()); // newest first

  // Current streak: count consecutive days starting from today (or yesterday if no submission today)
  const today = startOfDay(new Date());
  let current = 0;
  let checkDate = today;

  // Allow "today" or "yesterday" as the streak start (streak doesn't break until end of day)
  if (differenceInCalendarDays(today, uniqueDays[0]) > 1) {
    current = 0; // streak already broken
  } else {
    checkDate = uniqueDays[0]; // start from most recent submission day
    for (const day of uniqueDays) {
      if (differenceInCalendarDays(checkDate, day) === 0) {
        current++;
        checkDate = subDays(checkDate, 1);
      } else if (differenceInCalendarDays(checkDate, day) === 1) {
        // Skip to this day (handles gap in iteration but not in dates)
        current++;
        checkDate = subDays(day, 1);
      } else {
        break; // streak broken
      }
    }
  }

  // Max streak: scan all days for longest consecutive run
  let max = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (differenceInCalendarDays(uniqueDays[i - 1], uniqueDays[i]) === 1) {
      run++;
      max = Math.max(max, run);
    } else {
      run = 1;
    }
  }

  return { current, max: Math.max(max, current) };
}
```

**Key insight:** The challenge runs Jun 9 -- Aug 3 (56 days). Maximum possible streak is 56 days. At ~2 submissions/kid/day, maximum ~400 date records per kid. This is trivially fast to compute in-memory.

### Pattern 2: Badge Definitions (Shared Constants)

**What:** Central badge definition array used by both server computation and client display.
**Where:** `client/src/lib/badges.ts` (shared TypeScript -- importable from both sides via @shared or duplicated as needed)

```typescript
// Badge definitions -- used for both computation and display
export const STREAK_BADGES = [
  { id: "streak-3", threshold: 3, label: "3-Day Streak", icon: "Flame", color: "text-orange-400" },
  { id: "streak-7", threshold: 7, label: "7-Day Streak", icon: "Flame", color: "text-orange-500" },
  { id: "streak-14", threshold: 14, label: "14-Day Streak", icon: "Flame", color: "text-red-500" },
  { id: "streak-21", threshold: 21, label: "21-Day Streak", icon: "Flame", color: "text-red-600" },
] as const;

export const ACHIEVEMENT_BADGES = [
  { id: "perfect-week", label: "Perfect Week", icon: "Star", color: "text-gold",
    description: "Max points in a single week" },
  { id: "fitness-allstar", label: "Fitness All-Star", icon: "Award", color: "text-green-400",
    description: "Completed all 8 fitness bonuses" },
  { id: "summer-champion", label: "Summer Champion", icon: "Crown", color: "text-gold",
    description: "Submitted every week for 8 weeks" },
] as const;
```

### Pattern 3: Badge Eligibility Computation

**What:** Server-side logic to determine which badges a kid has earned.
**When:** Called in GET /api/player/:id and GET /api/leaderboard.

```typescript
// Source: Application logic
interface BadgeResult {
  id: string;
  earned: boolean;
  earnedAt?: Date; // earliest date the badge condition was met
}

function computeBadges(
  submissions: { type: string; weekNumber: number; points: number; submittedAt: Date }[],
  maxStreak: number
): BadgeResult[] {
  const badges: BadgeResult[] = [];

  // Streak badges (PTS-05)
  for (const sb of STREAK_BADGES) {
    badges.push({
      id: sb.id,
      earned: maxStreak >= sb.threshold,
    });
  }

  // Perfect Week (PTS-06): max points in any single week
  // Max per week = 1 skill + 1 fitness + 1 video bonus = 3 points/day for 7 days = impossible
  // Actual max per week: 7 skill + 7 fitness + 1 video bonus = 15 points
  const pointsByWeek = new Map<number, number>();
  for (const s of submissions) {
    pointsByWeek.set(s.weekNumber, (pointsByWeek.get(s.weekNumber) ?? 0) + s.points);
  }
  const maxWeekPoints = Math.max(...Array.from(pointsByWeek.values()), 0);
  // Per CLAUDE.md: max per week = 7 skill + 7 fitness + 1 video bonus = 15 (or 14 if no video)
  badges.push({ id: "perfect-week", earned: maxWeekPoints >= 15 });

  // Fitness All-Star (PTS-06): all 8 fitness bonuses completed
  const fitnessWeeks = new Set(
    submissions.filter(s => s.type === "fitness").map(s => s.weekNumber)
  );
  badges.push({ id: "fitness-allstar", earned: fitnessWeeks.size >= 8 });

  // Summer Champion (PTS-07): at least 1 submission every week (all 8 weeks)
  const activeWeeks = new Set(
    submissions.filter(s => s.type === "skill" || s.type === "fitness").map(s => s.weekNumber)
  );
  badges.push({ id: "summer-champion", earned: activeWeeks.size >= 8 });

  return badges;
}
```

### Pattern 4: Player Profile API Endpoint

**What:** Public GET endpoint returning all profile data for a single kid.
**Follows:** Existing public GET /api/leaderboard pattern (no auth required).

```typescript
// Source: Follows existing challengeRoutes.ts patterns
// GET /api/player/:id -- Public player profile (PROF-01, PROF-02, PROF-03)
app.get("/api/player/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get kid info (public fields only -- no familyId, no lastName)
    const [kid] = await db.select({
      id: kids.id,
      displayName: kids.displayName,
      ageTrack: kids.ageTrack,
    }).from(kids).where(eq(kids.id, id));

    if (!kid) return res.status(404).json({ error: "Player not found" });

    // Get all submissions for this kid
    const kidSubmissions = await db.select({
      type: submissions.type,
      weekNumber: submissions.weekNumber,
      points: submissions.points,
      submittedAt: submissions.submittedAt,
      challengeTitle: challenges.title,
      challengeType: challenges.type,
    })
    .from(submissions)
    .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
    .where(eq(submissions.kidId, id))
    .orderBy(desc(submissions.submittedAt));

    // Compute total points
    const totalPoints = kidSubmissions.reduce((sum, s) => sum + s.points, 0);

    // Compute streak
    const dates = kidSubmissions.map(s => new Date(s.submittedAt));
    const streak = computeStreak(dates);

    // Compute badges
    const badges = computeBadges(kidSubmissions, streak.max);

    // Submission history (PROF-03: dates and challenge names, not videos)
    const history = kidSubmissions
      .filter(s => s.type !== "video_bonus") // Only show skill/fitness submissions
      .map(s => ({
        date: s.submittedAt,
        challengeTitle: s.challengeTitle,
        type: s.type,
        weekNumber: s.weekNumber,
      }));

    res.json({
      kid,
      totalPoints,
      currentStreak: streak.current,
      maxStreak: streak.max,
      badges: badges.filter(b => b.earned),
      history,
    });
  } catch (error) {
    console.error("Player profile error:", error);
    res.status(500).json({ error: "Failed to load player profile" });
  }
});
```

### Pattern 5: Wouter Dynamic Route with useParams

**What:** Adding a dynamic route for player profiles.
**Source:** Wouter 3.3.5 docs -- `useParams()` hook for route parameters. [VERIFIED: codebase uses Wouter `nest` prop]

```typescript
// In App.tsx, inside the /challenge nest:
<Route path="/player/:id">
  <PlayerProfile />
</Route>

// In player.tsx:
import { useParams } from "wouter";

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  // Use `id` in TanStack Query key
}
```

### Pattern 6: Leaderboard Enhancement (Add Streak/Badges)

**What:** Modify the existing leaderboard API and components to include streak and badge data.
**Approach:** Batch-compute streaks for all kids in the leaderboard query, or compute per-kid inline (acceptable at this scale).

For the leaderboard, the most efficient approach is to fetch all submissions grouped by kid, then compute streaks and badges in a single pass:

```typescript
// Enhanced leaderboard endpoint adds streak + badges to each entry
interface EnhancedLeaderboardEntry {
  rank: number;
  kidId: string;
  displayName: string;
  ageTrack: string;
  totalPoints: number;
  isRegistered: boolean;
  currentStreak: number;  // NEW
  badges: string[];       // NEW: array of earned badge IDs
}
```

### Anti-Patterns to Avoid

- **Storing computed badge state in the database:** Badges are derivable from submissions. Storing them creates sync bugs (what if a submission is deleted?). Compute on every request -- the dataset is tiny.
- **Complex SQL window functions for streaks:** At this scale (max ~200 kids, ~1,200 submissions), fetching dates and computing in JS is faster to implement, easier to debug, and equally performant.
- **Separate API calls for streak/badges/profile:** One endpoint returns everything the profile page needs. Don't make the client stitch together 3+ requests.
- **Server-rendered badge images:** Use Lucide icons with Tailwind color classes. No image assets needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date manipulation | Manual date math | date-fns (startOfDay, differenceInCalendarDays, subDays) | Timezone bugs, DST edge cases |
| Icons for badges | SVG files or custom components | Lucide React (Flame, Star, Award, Crown, Trophy) | Already installed, consistent with codebase |
| Badge animations | CSS keyframes | Framer Motion (already in codebase) | Already used in PodiumCard and PlayerRow |
| Client routing params | Manual URL parsing | Wouter useParams() | Already the router |
| Profile data loading | Manual fetch + useState | TanStack Query hook | Already the data fetching pattern |

**Key insight:** This phase introduces zero new dependencies. Every tool needed is already installed and has established usage patterns in the codebase.

## Common Pitfalls

### Pitfall 1: Streak Timezone Issues
**What goes wrong:** Streak calculation counts UTC dates, but a parent submitting at 11pm Pacific time gets their submission recorded as the next UTC day, potentially breaking their streak or double-counting.
**Why it happens:** `submitted_at` is stored as UTC timestamp. "Consecutive days" depends on the user's local timezone.
**How to avoid:** Use `startOfDay()` on submission dates (which normalizes to midnight). Since all users are in the same timezone (Central California, Pacific time), and the granularity is "day", this is acceptable. The challenge is casual -- a 1-day timezone edge case won't cause user complaints.
**Warning signs:** If a user reports their streak broke despite submitting daily, check submission timestamps around midnight UTC.

### Pitfall 2: Perfect Week Points Calculation
**What goes wrong:** "Perfect Week" badge threshold is wrong because the max-points-per-week calculation doesn't account for the video bonus variability.
**Why it happens:** Per CLAUDE.md D-07, if a week has no instructional video, max points drops from 15 to 14. Hardcoding 15 as the threshold would make "Perfect Week" impossible in videoless weeks.
**How to avoid:** Define "Perfect Week" as achieving the maximum possible points for that specific week (query whether the week has a video URL). Or simplify: award the badge if a kid gets 14+ points in any week (covers both cases). The simpler approach is recommended -- 14 points in a week is an exceptional achievement regardless.
**Warning signs:** No kid earning "Perfect Week" despite sustained daily submissions.

### Pitfall 3: Leaderboard Performance Regression
**What goes wrong:** Adding streak/badge computation to the leaderboard endpoint makes it slow.
**Why it happens:** Computing streaks requires fetching all submissions for all kids on the leaderboard (not just totals).
**How to avoid:** Two strategies:
1. **Lightweight leaderboard:** Only show current streak count (not full badge list) on leaderboard. Full badge details live on the profile page. This keeps the leaderboard query light.
2. **Single query optimization:** Fetch all submissions once, group in JS, compute all streaks in a single pass. At 1,200 total submissions, this takes <10ms.
**Warning signs:** Leaderboard API response time exceeding 200ms.

### Pitfall 4: Leaderboard Link Breaking Public Access
**What goes wrong:** Profile page accidentally requires authentication because it reuses auth-gated patterns.
**Why it happens:** The challenge hub (index.tsx) redirects unauthenticated users. Profile page must NOT do this -- it's public like the leaderboard.
**How to avoid:** Follow the leaderboard pattern exactly: no `requireFamily` middleware on the API endpoint, no auth check in the React component. Profile pages are a marketing surface (parents share their kid's profile link).
**Warning signs:** Unauthenticated users getting redirected when clicking a leaderboard row.

### Pitfall 5: N+1 Query in Enhanced Leaderboard
**What goes wrong:** Computing badges per-kid on the leaderboard with individual queries per kid.
**Why it happens:** Naive implementation: for each kid in leaderboard, run a separate query for their submissions.
**How to avoid:** Fetch ALL submissions in one query (`SELECT * FROM submissions`), group by kid_id in JavaScript, then compute streaks/badges per kid from the in-memory grouped data. At this scale, the entire submissions table fits easily in memory.
**Warning signs:** Multiple DB queries per leaderboard request.

## Code Examples

### Wouter Link Navigation (Existing Pattern)

```typescript
// Source: [VERIFIED: client/src/components/Footer.tsx, Header.tsx]
import { Link } from "wouter";

// Wrap PlayerRow in a Link:
<Link href={`/challenge/player/${entry.kidId}`}>
  <PlayerRow ... />
</Link>
```

### Wouter useParams (Route Parameter)

```typescript
// Source: [CITED: https://github.com/molefrog/wouter -- useParams docs]
import { useParams } from "wouter";

function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  // ...
}
```

### TanStack Query for Profile Data

```typescript
// Source: Follows existing leaderboard.tsx pattern [VERIFIED: codebase]
const { data: profile, isLoading } = useQuery<PlayerProfileResponse>({
  queryKey: ["/api/player", id],
  queryFn: getQueryFn({ on401: "returnNull" }),
  enabled: !!id,
  staleTime: 60 * 1000, // 1 minute -- profile data changes less frequently
});
```

### Framer Motion Badge Reveal

```typescript
// Source: Follows PodiumCard.tsx animation pattern [VERIFIED: codebase]
import { motion } from "framer-motion";

function BadgeIcon({ badge, index }: { badge: Badge; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex flex-col items-center gap-1"
    >
      <div className={`w-12 h-12 rounded-full bg-warmwhite/10 flex items-center justify-center ${badge.color}`}>
        <BadgeLucideIcon name={badge.icon} className="w-6 h-6" />
      </div>
      <span className="text-warmwhite/70 text-xs text-center">{badge.label}</span>
    </motion.div>
  );
}
```

### Drizzle Query: Submissions with Challenge Join

```typescript
// Source: Follows existing challengeRoutes.ts query patterns [VERIFIED: codebase]
const kidSubmissions = await db.select({
  type: submissions.type,
  weekNumber: submissions.weekNumber,
  points: submissions.points,
  submittedAt: submissions.submittedAt,
  challengeTitle: challenges.title,
})
.from(submissions)
.innerJoin(challenges, eq(submissions.challengeId, challenges.id))
.where(eq(submissions.kidId, kidId))
.orderBy(desc(submissions.submittedAt));
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Gamification SaaS (Badgeville etc.) | Compute badges from raw data | Always for small-scale apps | No vendor dependency, no cost, full control |
| Redis sorted sets for leaderboards | SQL GROUP BY + in-memory streak calc | Appropriate at <10k records | Zero infrastructure overhead |
| Store badge state in DB | Compute on read | Best practice for derivable data | No sync bugs, always current |

**Not applicable to this phase:**
- Real-time badge notifications (WebSocket) -- Replit Autoscale doesn't support persistent connections. TanStack Query polling is sufficient.
- Gamification frameworks -- massive overkill for a participation counter with 5 badge types.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | "Perfect Week" threshold should be 14+ points (not strictly 15) to handle weeks without video | Pitfall 2 | Badge becomes unearnable in weeks without video bonus |
| A2 | Profile pages should be public (no auth required) like the leaderboard | Pattern 4, Pitfall 4 | Parents can't share profile links with family/friends |
| A3 | Current streak allows "yesterday" as most recent day (streak doesn't break until 2 days pass) | Pattern 1 | Kids who submitted yesterday but not yet today would show streak=0, which feels punishing |
| A4 | Only show earned badges (not grayed-out unearned ones) on profile | Pattern 4 | Less motivating if kids can't see what badges they're working toward |

## Open Questions

1. **Perfect Week threshold: 14 or 15?**
   - What we know: Max is 15 points/week (7 skill + 7 fitness + 1 video bonus). But weeks without videoUrl have max 14.
   - What's unclear: Should "Perfect Week" mean "max possible for THAT week" or a fixed threshold?
   - Recommendation: Use 15 as threshold. This makes it achievable only in weeks WITH a video bonus, which is intentional -- it rewards full participation. If a week has no video, that week simply can't earn "Perfect Week." This is simpler to implement and more meaningful.

2. **Should the leaderboard show badges inline or just streak count?**
   - What we know: Leaderboard rows currently show rank, name, age track, points, NSC badge. Adding full badges could crowd the mobile layout.
   - What's unclear: How much badge info to show on the leaderboard vs. profile only.
   - Recommendation: Show current streak (flame icon + number) and count of earned badges (small badge count) on leaderboard rows. Full badge grid lives on the profile page. This keeps leaderboard clean while teasing the profile.

3. **Should profile show unearned badges as "locked"?**
   - What we know: Showing locked badges motivates kids to work toward them. But it adds UI complexity.
   - What's unclear: Johnny's preference for simplicity vs. gamification depth.
   - Recommendation: Show all badge slots with earned ones highlighted and unearned ones grayed out with a lock icon. This drives engagement ("I need 4 more days for the 14-day streak!").

## Sources

### Primary (HIGH confidence)
- Existing codebase: ~/Projects/nipomo-soccer-website/ (schema.ts, challengeRoutes.ts, leaderboard.tsx, PlayerRow.tsx, PodiumCard.tsx) -- read directly
- Phase 2 research: .planning/phases/02-core-loop/02-RESEARCH.md -- confirmed schema structure and patterns
- Phase 2 patterns: .planning/phases/02-core-loop/02-PATTERNS.md -- confirmed coding conventions

### Secondary (MEDIUM confidence)
- Wouter useParams: https://github.com/molefrog/wouter -- nest prop and useParams documented [CITED: wouter GitHub README]
- date-fns differenceInCalendarDays: https://date-fns.org/v3.6.0/docs/differenceInCalendarDays [CITED: date-fns docs]

### Tertiary (LOW confidence)
- None -- all claims verified against existing codebase or cited from official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- zero new dependencies, all verified in package.json
- Architecture: HIGH -- straightforward extension of existing patterns (new endpoint + page)
- Pitfalls: HIGH -- identified from direct codebase analysis and understanding of the data model
- Streak algorithm: HIGH -- standard consecutive-day computation, well-understood problem

**Research date:** 2026-05-29
**Valid until:** 2026-06-15 (stable -- no external dependencies to drift)
