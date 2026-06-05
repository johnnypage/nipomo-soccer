import type { Express } from "express";
import { db } from "./db";
import { families, kids, challenges, submissions, drawings } from "@shared/schema";
import { signupSchema, addKidSchema, submitSchema, videoBonusSchema, challengeEditSchema, drawingRequestSchema } from "@shared/challengeValidation";
import { eq, and, gt, desc, gte, lt, count, sql } from "drizzle-orm";
import { requireFamily } from "./challengeAuth";
import { requireAuth } from "./auth";
import { randomBytes, randomInt } from "crypto";
import { differenceInYears, startOfDay, endOfDay, differenceInCalendarDays, subDays } from "date-fns";
import sgMail from "@sendgrid/mail";
import { z } from "zod";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

// -- Helper functions --

function getAgeTrack(birthdate: Date): "littlekicks" | "starter" | "advanced" {
  const age = differenceInYears(new Date(), birthdate);
  if (age >= 4 && age <= 6) return "littlekicks";
  if (age >= 7 && age <= 10) return "starter";
  if (age >= 11 && age <= 18) return "advanced";
  throw new Error(`Age ${age} is outside the challenge range (4-18)`);
}

function getDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
}

async function sendMagicLink(email: string, token: string) {
  const origin = process.env.APP_URL || "https://nipomosc.org";
  const verifyUrl = `${origin}/api/auth/verify?token=${token}`;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || "admin@nipomosc.org";

  await sgMail.send({
    to: email,
    from: { email: fromEmail, name: "Nipomo Soccer" },
    subject: "Your Summer Skills Challenge Login Link",
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4ede1; padding:32px 0;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
            <tr><td style="background-color:#8B1D24; padding:24px 32px;">
              <p style="margin:0;color:#F4EDE1;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Nipomo Soccer</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">Summer Skills Challenge</h1>
            </td></tr>
            <tr><td style="padding:32px;">
              <p style="color:#333;font-size:16px;margin-bottom:16px;">Click the button below to log in to the Summer Skills Challenge:</p>
              <a href="${verifyUrl}" style="display:inline-block;background:#8B2332;color:#F5F5F0;padding:14px 32px;text-decoration:none;font-weight:700;font-size:16px;border-radius:6px;">Log In to Challenge</a>
              <p style="color:#888;font-size:13px;margin-top:24px;">This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>`,
  });
}

// -- Streak and badge computation (Phase 3: PTS-04, PTS-05, PTS-06, PTS-07) --

function computeStreak(submissionDates: Date[]): { current: number; max: number } {
  if (submissionDates.length === 0) return { current: 0, max: 0 };

  // Get unique dates (multiple submissions per day counted once)
  const uniqueDays = Array.from(new Set(
    submissionDates.map(d => startOfDay(d).toISOString())
  )).map(iso => new Date(iso)).sort((a, b) => b.getTime() - a.getTime()); // newest first

  // Current streak: consecutive days starting from most recent submission
  // Allow "yesterday" as valid streak start (streak doesn't break until 2 days pass)
  const today = startOfDay(new Date());
  let current = 0;

  if (differenceInCalendarDays(today, uniqueDays[0]) > 1) {
    current = 0; // streak already broken (most recent submission was 2+ days ago)
  } else {
    let checkDate = uniqueDays[0];
    for (const day of uniqueDays) {
      if (differenceInCalendarDays(checkDate, day) === 0) {
        current++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
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

interface BadgeResult {
  id: string;
  earned: boolean;
}

function computeBadges(
  submissionData: { type: string; weekNumber: number; points: number }[],
  maxStreak: number
): BadgeResult[] {
  const badges: BadgeResult[] = [];

  // Streak badges (PTS-05): awarded based on max streak ever achieved
  const streakThresholds = [
    { id: "streak-3", threshold: 3 },
    { id: "streak-7", threshold: 7 },
    { id: "streak-14", threshold: 14 },
    { id: "streak-21", threshold: 21 },
  ];
  for (const sb of streakThresholds) {
    badges.push({ id: sb.id, earned: maxStreak >= sb.threshold });
  }

  // Perfect Week (PTS-06): 15+ points in any single week
  const pointsByWeek = new Map<number, number>();
  for (const s of submissionData) {
    pointsByWeek.set(s.weekNumber, (pointsByWeek.get(s.weekNumber) ?? 0) + s.points);
  }
  const maxWeekPoints = pointsByWeek.size > 0 ? Math.max(...Array.from(pointsByWeek.values())) : 0;
  badges.push({ id: "perfect-week", earned: maxWeekPoints >= 15 });

  // Fitness All-Star (PTS-06): fitness bonus in all 8 weeks
  const fitnessWeeks = new Set(
    submissionData.filter(s => s.type === "fitness").map(s => s.weekNumber)
  );
  badges.push({ id: "fitness-allstar", earned: fitnessWeeks.size >= 8 });

  // Summer Champion (PTS-07): at least 1 submission (skill or fitness) in all 8 weeks
  const activeWeeks = new Set(
    submissionData.filter(s => s.type === "skill" || s.type === "fitness").map(s => s.weekNumber)
  );
  badges.push({ id: "summer-champion", earned: activeWeeks.size >= 8 });

  return badges;
}

// -- Challenge seed data (8 weeks x 3 tracks x 2 types = 48 rows) --

const CHALLENGE_SEED: {
  weekNumber: number;
  ageTrack: string;
  type: string;
  title: string;
  theme: string;
  description: string;
  weekStart: string;
  weekEnd: string;
}[] = [
  // Week 1 -- First Touch (Ball mastery & control)
  { weekNumber: 1, ageTrack: "littlekicks", type: "skill", title: "First Touch", theme: "Ball mastery & control", description: "Toe taps on top of the ball: 3 sets of 30 seconds. Then roll the ball side to side with the sole of each foot, 2 minutes per foot.", weekStart: "2026-06-09", weekEnd: "2026-06-15" },
  { weekNumber: 1, ageTrack: "starter", type: "skill", title: "First Touch", theme: "Ball mastery & control", description: "Inside-inside touches back and forth across a line, 5 minutes straight. Then sole rolls forward and back, 3 minutes per foot.", weekStart: "2026-06-09", weekEnd: "2026-06-15" },
  { weekNumber: 1, ageTrack: "advanced", type: "skill", title: "First Touch", theme: "Ball mastery & control", description: "10-minute ball mastery circuit: toe taps (2 min), sole rolls (2 min), inside-outside touches (3 min), pull-backs (3 min). Both feet.", weekStart: "2026-06-09", weekEnd: "2026-06-15" },
  { weekNumber: 1, ageTrack: "littlekicks", type: "fitness", title: "Warm-Up Basics", theme: "Ball mastery & control", description: "3 x 20 Jumping Jacks", weekStart: "2026-06-09", weekEnd: "2026-06-15" },
  { weekNumber: 1, ageTrack: "starter", type: "fitness", title: "Warm-Up Basics", theme: "Ball mastery & control", description: "3 x 30 Jumping Jacks + 20 High Knees", weekStart: "2026-06-09", weekEnd: "2026-06-15" },
  { weekNumber: 1, ageTrack: "advanced", type: "fitness", title: "Warm-Up Basics", theme: "Ball mastery & control", description: "5 min: Jumping Jacks, High Knees, Butt Kicks rotating 30 sec each", weekStart: "2026-06-09", weekEnd: "2026-06-15" },

  // Week 2 -- Dribbling (Close control & speed)
  { weekNumber: 2, ageTrack: "littlekicks", type: "skill", title: "Dribbling", theme: "Close control & speed", description: "Set up 3 household objects (shoes, toys, water bottles). Dribble around all 3 and back, 10 trips. Take your time -- control over speed.", weekStart: "2026-06-16", weekEnd: "2026-06-22" },
  { weekNumber: 2, ageTrack: "starter", type: "skill", title: "Dribbling", theme: "Close control & speed", description: "Set up 5 shoes in a line. Weave through and back, 10 full trips. Then free dribble around the yard for 5 minutes -- just keep the ball close.", weekStart: "2026-06-16", weekEnd: "2026-06-22" },
  { weekNumber: 2, ageTrack: "advanced", type: "skill", title: "Dribbling", theme: "Close control & speed", description: "15-minute dribble session: 5-object weave x 15 trips (both feet), then 5 minutes of tight-space dribbling in a 5x5 ft square. Keep the ball within arm's reach.", weekStart: "2026-06-16", weekEnd: "2026-06-22" },
  { weekNumber: 2, ageTrack: "littlekicks", type: "fitness", title: "Leg Strength", theme: "Close control & speed", description: "10 Squats + 10 Calf Raises", weekStart: "2026-06-16", weekEnd: "2026-06-22" },
  { weekNumber: 2, ageTrack: "starter", type: "fitness", title: "Leg Strength", theme: "Close control & speed", description: "20 Squats + 10 Lunges per leg", weekStart: "2026-06-16", weekEnd: "2026-06-22" },
  { weekNumber: 2, ageTrack: "advanced", type: "fitness", title: "Leg Strength", theme: "Close control & speed", description: "3 rounds: 15 Squats, 10 Lunges each leg, 10 Calf Raises", weekStart: "2026-06-16", weekEnd: "2026-06-22" },

  // Week 3 -- Passing (Wall balls & partner passing)
  { weekNumber: 3, ageTrack: "littlekicks", type: "skill", title: "Passing", theme: "Wall balls & partner passing", description: "Roll the ball back and forth with a parent or sibling for 5 minutes -- try to keep a rally going without it getting away. Count your longest streak!", weekStart: "2026-06-23", weekEnd: "2026-06-29" },
  { weekNumber: 3, ageTrack: "starter", type: "skill", title: "Passing", theme: "Wall balls & partner passing", description: "50 wall passes: 25 right foot, 25 left foot. Pass and trap the return each time. Then 5 minutes of partner passing with a parent or sibling.", weekStart: "2026-06-23", weekEnd: "2026-06-29" },
  { weekNumber: 3, ageTrack: "advanced", type: "skill", title: "Passing", theme: "Wall balls & partner passing", description: "100 wall passes: alternate right and left foot, trap with the opposite foot. Then 5 minutes of 1-touch wall returns (pass and return without trapping).", weekStart: "2026-06-23", weekEnd: "2026-06-29" },
  { weekNumber: 3, ageTrack: "littlekicks", type: "fitness", title: "Core Strength", theme: "Wall balls & partner passing", description: "3 x 10 sec Plank", weekStart: "2026-06-23", weekEnd: "2026-06-29" },
  { weekNumber: 3, ageTrack: "starter", type: "fitness", title: "Core Strength", theme: "Wall balls & partner passing", description: "3 x 20 sec Plank + 10 sec Side Plank each side", weekStart: "2026-06-23", weekEnd: "2026-06-29" },
  { weekNumber: 3, ageTrack: "advanced", type: "fitness", title: "Core Strength", theme: "Wall balls & partner passing", description: "1 min Plank + 30 sec Side Plank each side, 2 rounds", weekStart: "2026-06-23", weekEnd: "2026-06-29" },

  // Week 4 -- Shooting (Technique & reps)
  { weekNumber: 4, ageTrack: "littlekicks", type: "skill", title: "Shooting", theme: "Technique & reps", description: "Set up two shoes as a \"goal\" (3 feet apart). Take 20 shots from 5 steps back -- count how many go through! Try both feet.", weekStart: "2026-06-30", weekEnd: "2026-07-06" },
  { weekNumber: 4, ageTrack: "starter", type: "skill", title: "Shooting", theme: "Technique & reps", description: "Makeshift goal (backpacks or chairs, 6 feet wide). Take 30 shots total: 10 right foot, 10 left foot, 10 aiming for each side. Track your score.", weekStart: "2026-06-30", weekEnd: "2026-07-06" },
  { weekNumber: 4, ageTrack: "advanced", type: "skill", title: "Shooting", theme: "Technique & reps", description: "Wall target shooting: mark a spot with chalk or tape. 50 strikes from 8-10 yards -- 25 right foot, 25 left. Track how many hit the target. Then 10 minutes of self-toss volleys against the wall.", weekStart: "2026-06-30", weekEnd: "2026-07-06" },
  { weekNumber: 4, ageTrack: "littlekicks", type: "fitness", title: "Explosive Power", theme: "Technique & reps", description: "10 Star Jumps + 10 Frog Hops", weekStart: "2026-06-30", weekEnd: "2026-07-06" },
  { weekNumber: 4, ageTrack: "starter", type: "fitness", title: "Explosive Power", theme: "Technique & reps", description: "3 x 5 Burpees", weekStart: "2026-06-30", weekEnd: "2026-07-06" },
  { weekNumber: 4, ageTrack: "advanced", type: "fitness", title: "Explosive Power", theme: "Technique & reps", description: "3 rounds: 8 Burpees, 8 Tuck Jumps, 8 Split Squat Jumps", weekStart: "2026-06-30", weekEnd: "2026-07-06" },

  // Week 5 -- Goalkeeper (Between the posts)
  { weekNumber: 5, ageTrack: "littlekicks", type: "skill", title: "Goalkeeper", theme: "Between the posts", description: "Stand between two shoes as posts. Parent rolls the ball to each side, 20 total rolls -- block as many as you can! Any body part counts.", weekStart: "2026-07-07", weekEnd: "2026-07-13" },
  { weekNumber: 5, ageTrack: "starter", type: "skill", title: "Goalkeeper", theme: "Between the posts", description: "10-minute GK session with a partner: 5 minutes of ground saves (partner rolls to each side), then 5 minutes of high saves (partner tosses underhand). Track your total saves.", weekStart: "2026-07-07", weekEnd: "2026-07-13" },
  { weekNumber: 5, ageTrack: "advanced", type: "skill", title: "Goalkeeper", theme: "Between the posts", description: "15-minute GK workout: 5 minutes of ground saves, 5 minutes of reaction saves (partner throws to random sides from 8 feet), 5 minutes of self-toss off a wall and react to the bounce. 50+ saves total.", weekStart: "2026-07-07", weekEnd: "2026-07-13" },
  { weekNumber: 5, ageTrack: "littlekicks", type: "fitness", title: "Lateral Agility", theme: "Between the posts", description: "20 Lateral Hops (side to side over a shoe)", weekStart: "2026-07-07", weekEnd: "2026-07-13" },
  { weekNumber: 5, ageTrack: "starter", type: "fitness", title: "Lateral Agility", theme: "Between the posts", description: "3 x 15 Lateral Hops + 10 Lateral Shuffles", weekStart: "2026-07-07", weekEnd: "2026-07-13" },
  { weekNumber: 5, ageTrack: "advanced", type: "fitness", title: "Lateral Agility", theme: "Between the posts", description: "3 rounds: 20 Lateral Hops, 10 Lateral Bounds, 10 Drop-and-Recover (drop to ground, pop up)", weekStart: "2026-07-07", weekEnd: "2026-07-13" },

  // Week 6 -- Juggling (Touch & control)
  { weekNumber: 6, ageTrack: "littlekicks", type: "skill", title: "Juggling", theme: "Touch & control", description: "Drop the ball from your hands, kick it up, and catch it. Do this for 5 minutes -- count how many successful kick-and-catches you get!", weekStart: "2026-07-14", weekEnd: "2026-07-20" },
  { weekNumber: 6, ageTrack: "starter", type: "skill", title: "Juggling", theme: "Touch & control", description: "Juggle for 10 minutes. Track your longest streak. Every time you drop it, pick it up and start again. The goal is time on the ball, not perfection.", weekStart: "2026-07-14", weekEnd: "2026-07-20" },
  { weekNumber: 6, ageTrack: "advanced", type: "skill", title: "Juggling", theme: "Touch & control", description: "15 minutes of juggling: 10 minutes feet-only (track best streak), then 5 minutes freestyle using thighs, head, and shoulders. Post your best streak.", weekStart: "2026-07-14", weekEnd: "2026-07-20" },
  { weekNumber: 6, ageTrack: "littlekicks", type: "fitness", title: "Balance & Ankle Strength", theme: "Touch & control", description: "20 Calf Raises + 10 sec balance on each foot", weekStart: "2026-07-14", weekEnd: "2026-07-20" },
  { weekNumber: 6, ageTrack: "starter", type: "fitness", title: "Balance & Ankle Strength", theme: "Touch & control", description: "30 Calf Raises + 20 sec Single-Leg Balance each foot", weekStart: "2026-07-14", weekEnd: "2026-07-20" },
  { weekNumber: 6, ageTrack: "advanced", type: "fitness", title: "Balance & Ankle Strength", theme: "Touch & control", description: "3 rounds: 15 Single-Leg Calf Raises + 30 sec Single-Leg Balance (eyes closed) each foot", weekStart: "2026-07-14", weekEnd: "2026-07-20" },

  // Week 7 -- 1v1 Moves (Fakes & changes of direction)
  { weekNumber: 7, ageTrack: "littlekicks", type: "skill", title: "1v1 Moves", theme: "Fakes & changes of direction", description: "Set up a shoe as a \"defender.\" Dribble up, fake one way, go the other way. Do 10 on each side -- 20 total fakes.", weekStart: "2026-07-21", weekEnd: "2026-07-27" },
  { weekNumber: 7, ageTrack: "starter", type: "skill", title: "1v1 Moves", theme: "Fakes & changes of direction", description: "Watch the video and pick one move (stepover, scissors, or Cruyff turn). Practice it 20 times past a shoe \"defender\" -- 10 each direction. Then try it 5 times against a parent or sibling.", weekStart: "2026-07-21", weekEnd: "2026-07-27" },
  { weekNumber: 7, ageTrack: "advanced", type: "skill", title: "1v1 Moves", theme: "Fakes & changes of direction", description: "15-minute moves session: practice 3 different moves, 15 reps each past a household object. Then 5 minutes of live 1v1 against a parent, sibling, or friend. Film the best one.", weekStart: "2026-07-21", weekEnd: "2026-07-27" },
  { weekNumber: 7, ageTrack: "littlekicks", type: "fitness", title: "Quick Feet", theme: "Fakes & changes of direction", description: "30 sec Quick Feet (run in place as fast as you can!), 3 times", weekStart: "2026-07-21", weekEnd: "2026-07-27" },
  { weekNumber: 7, ageTrack: "starter", type: "fitness", title: "Quick Feet", theme: "Fakes & changes of direction", description: "3 x 30 sec Quick Feet + 5 Lateral Shuffles each way", weekStart: "2026-07-21", weekEnd: "2026-07-27" },
  { weekNumber: 7, ageTrack: "advanced", type: "fitness", title: "Quick Feet", theme: "Fakes & changes of direction", description: "5 min circuit: 30 sec Quick Feet, 30 sec Lateral Shuffle, 30 sec Backpedal, 30 sec Sprint in Place -- repeat 2.5 rounds", weekStart: "2026-07-21", weekEnd: "2026-07-27" },

  // Week 8 -- Freestyle (Show us your summer)
  { weekNumber: 8, ageTrack: "littlekicks", type: "skill", title: "Freestyle", theme: "Show us your summer", description: "10 minutes of your favorite drills from the summer. Do whatever you loved most -- ball taps, dribbling, passing with a parent. Show us what you learned!", weekStart: "2026-07-28", weekEnd: "2026-08-03" },
  { weekNumber: 8, ageTrack: "starter", type: "skill", title: "Freestyle", theme: "Show us your summer", description: "12-minute \"best of\" session: pick your 3 favorite drills from the summer and do each one for 4 minutes. Film it and show us how far you've come.", weekStart: "2026-07-28", weekEnd: "2026-08-03" },
  { weekNumber: 8, ageTrack: "advanced", type: "skill", title: "Freestyle", theme: "Show us your summer", description: "15-minute highlight session: combine your best wall-ball work, juggling, and moves into one video. This is your summer reel.", weekStart: "2026-07-28", weekEnd: "2026-08-03" },
  { weekNumber: 8, ageTrack: "littlekicks", type: "fitness", title: "The Full Circuit", theme: "Show us your summer", description: "The Full Circuit! One move from each week: jumping jacks, squats, plank, star jumps, lateral hops, calf raises, quick feet. Do each for 20 sec. One round.", weekStart: "2026-07-28", weekEnd: "2026-08-03" },
  { weekNumber: 8, ageTrack: "starter", type: "fitness", title: "The Full Circuit", theme: "Show us your summer", description: "The Full Circuit! One move from each week: jumping jacks, squats, plank, star jumps, lateral hops, calf raises, quick feet. Do each for 25 sec. Two rounds.", weekStart: "2026-07-28", weekEnd: "2026-08-03" },
  { weekNumber: 8, ageTrack: "advanced", type: "fitness", title: "The Full Circuit", theme: "Show us your summer", description: "The Full Circuit! One move from each week: jumping jacks, squats, plank, star jumps, lateral hops, calf raises, quick feet. Do each for 30 sec. Three rounds.", weekStart: "2026-07-28", weekEnd: "2026-08-03" },
];

// -- Seed function (idempotent) --

async function seedChallengesIfEmpty() {
  const existing = await db.select({ id: challenges.id }).from(challenges).limit(1);
  if (existing.length > 0) return;
  await db.insert(challenges).values(CHALLENGE_SEED);
  console.log(`Seeded ${CHALLENGE_SEED.length} challenges`);
}

// -- Route registration --

export function registerChallengeRoutes(app: Express) {
  seedChallengesIfEmpty().catch((e) => console.error("Challenge seed error:", e));

  // POST /api/auth/signup -- Magic link signup (D-01 Step 1, AUTH-01, PRIV-01)
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const parseResult = signupSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Please provide a valid email and consent to continue" });
      }

      const email = parseResult.data.email.trim().toLowerCase();
      const token = randomBytes(32).toString("hex");
      const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Check if family already exists
      const [existingFamily] = await db.select().from(families).where(eq(families.email, email));

      if (existingFamily) {
        // Existing family -- generate new token (login flow)
        await db.update(families)
          .set({ magicToken: token, tokenExpiresAt })
          .where(eq(families.id, existingFamily.id));
      } else {
        // New family -- insert with consent
        await db.insert(families).values({
          email,
          consentGivenAt: new Date(),
          magicToken: token,
          tokenExpiresAt,
        });
      }

      await sendMagicLink(email, token);

      // Same response whether email exists or not (prevents enumeration, T-02-03)
      res.json({ success: true, message: "Check your email for a login link" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to send login link. Please try again." });
    }
  });

  // POST /api/auth/login -- Resend magic link for existing accounts
  app.post("/api/auth/login", async (req, res) => {
    try {
      const parseResult = z.object({ email: z.string().email() }).safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      const email = parseResult.data.email.trim().toLowerCase();

      const [family] = await db.select().from(families).where(eq(families.email, email));

      if (family) {
        const token = randomBytes(32).toString("hex");
        const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await db.update(families)
          .set({ magicToken: token, tokenExpiresAt })
          .where(eq(families.id, family.id));
        await sendMagicLink(email, token);
      }

      // Same response whether email exists or not (prevents enumeration, T-02-03)
      res.json({ success: true, message: "Check your email for a login link" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to send login link. Please try again." });
    }
  });

  // GET /api/auth/verify -- Verify magic link token (D-01 Step 2, D-10)
  app.get("/api/auth/verify", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: "Missing token" });
      }

      const [family] = await db.select().from(families).where(
        and(
          eq(families.magicToken, token),
          gt(families.tokenExpiresAt, new Date())
        )
      );

      if (!family) {
        return res.redirect("/challenge/signup?error=expired");
      }

      // Invalidate token immediately (T-02-02, T-02-07)
      await db.update(families)
        .set({ magicToken: null, tokenExpiresAt: null })
        .where(eq(families.id, family.id));

      // Session fixation protection: regenerate session before setting familyId
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regenerate error:", err);
          return res.redirect("/challenge/signup?error=session");
        }
        req.session.familyId = family.id;
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.redirect("/challenge/signup?error=session");
          }
          res.redirect("/challenge");
        });
      });
    } catch (error) {
      console.error("Verify error:", error);
      res.redirect("/challenge/signup?error=server");
    }
  });

  // GET /api/auth/me -- Get current family data + kids (D-12, AUTH-03)
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.familyId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const [family] = await db.select({
        id: families.id,
        email: families.email,
        name: families.name,
        isRegistered: families.isRegistered,
        createdAt: families.createdAt,
      }).from(families).where(eq(families.id, req.session.familyId));

      if (!family) {
        return res.status(401).json({ error: "Family not found" });
      }

      const familyKids = await db.select().from(kids)
        .where(eq(kids.familyId, family.id))
        .orderBy(kids.createdAt);

      res.json({ family, kids: familyKids });
    } catch (error) {
      console.error("Auth me error:", error);
      res.status(500).json({ error: "Failed to load account data" });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  // POST /api/kids -- Add a kid (AUTH-04, D-02, D-03, D-06)
  app.post("/api/kids", requireFamily, async (req, res) => {
    try {
      const parseResult = addKidSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Please provide first name, last name, and birthdate (YYYY-MM-DD)" });
      }

      const data = parseResult.data;
      const birthdate = new Date(data.birthdate);

      let ageTrack: string;
      try {
        ageTrack = getAgeTrack(birthdate);
      } catch {
        return res.status(400).json({ error: "The Summer Skills Challenge is for kids ages 4-18" });
      }

      const displayName = getDisplayName(data.firstName, data.lastName);

      const [kid] = await db.insert(kids).values({
        familyId: req.session.familyId!,
        firstName: data.firstName,
        lastName: data.lastName,
        birthdate,
        ageTrack,
        displayName,
      }).returning();

      res.json(kid);
    } catch (error) {
      console.error("Add kid error:", error);
      res.status(500).json({ error: "Failed to add kid" });
    }
  });

  // PATCH /api/kids/:id -- Edit a kid (D-13)
  app.patch("/api/kids/:id", requireFamily, async (req, res) => {
    try {
      const { id } = req.params;

      // Verify kid belongs to this family (T-02-04)
      const [existingKid] = await db.select().from(kids).where(
        and(eq(kids.id, id), eq(kids.familyId, req.session.familyId!))
      );

      if (!existingKid) {
        return res.status(404).json({ error: "Kid not found" });
      }

      const updates: Partial<{ firstName: string; lastName: string; birthdate: Date; ageTrack: string; displayName: string }> = {};

      if (req.body.firstName) updates.firstName = req.body.firstName;
      if (req.body.lastName) updates.lastName = req.body.lastName;

      if (req.body.birthdate) {
        const birthdate = new Date(req.body.birthdate);
        try {
          updates.ageTrack = getAgeTrack(birthdate);
        } catch {
          return res.status(400).json({ error: "The Summer Skills Challenge is for kids ages 4-18" });
        }
        updates.birthdate = birthdate;
      }

      // Recompute display name if name changed
      const firstName = updates.firstName || existingKid.firstName;
      const lastName = updates.lastName || existingKid.lastName;
      if (updates.firstName || updates.lastName) {
        updates.displayName = getDisplayName(firstName, lastName);
      }

      const [updatedKid] = await db.update(kids)
        .set(updates)
        .where(eq(kids.id, id))
        .returning();

      res.json(updatedKid);
    } catch (error) {
      console.error("Update kid error:", error);
      res.status(500).json({ error: "Failed to update kid" });
    }
  });

  // DELETE /api/kids/:id
  app.delete("/api/kids/:id", requireFamily, async (req, res) => {
    try {
      const { id } = req.params;

      // Verify kid belongs to this family (T-02-04)
      const [existingKid] = await db.select().from(kids).where(
        and(eq(kids.id, id), eq(kids.familyId, req.session.familyId!))
      );

      if (!existingKid) {
        return res.status(404).json({ error: "Kid not found" });
      }

      await db.delete(kids).where(eq(kids.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete kid error:", error);
      res.status(500).json({ error: "Failed to delete kid" });
    }
  });

  // GET /api/challenges -- Public challenge content (CHAL-05)
  app.get("/api/challenges", async (_req, res) => {
    try {
      const allChallenges = await db.select().from(challenges)
        .orderBy(challenges.weekNumber, challenges.ageTrack);
      res.json({ challenges: allChallenges });
    } catch (error) {
      console.error("Challenges error:", error);
      res.status(500).json({ error: "Failed to load challenges" });
    }
  });

  // POST /api/submissions -- Record a video submission (SUB-03, SUB-04, SUB-05, PTS-01)
  app.post("/api/submissions", requireFamily, async (req, res) => {
    try {
      const parseResult = submitSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid submission data" });
      }

      const { kidId, challengeId, weekNumber, type, cloudinaryId, cloudinaryUrl, thumbnailUrl } = parseResult.data;

      // Verify kid belongs to this family (T-02-04)
      const [kid] = await db.select().from(kids).where(
        and(eq(kids.id, kidId), eq(kids.familyId, req.session.familyId!))
      );
      if (!kid) return res.status(404).json({ error: "Kid not found" });

      // Verify challenge exists
      const [challenge] = await db.select().from(challenges).where(eq(challenges.id, challengeId));
      if (!challenge) return res.status(404).json({ error: "Challenge not found" });

      // Daily cap check per D-04, D-15: max 1 skill + 1 fitness per child per day, globally
      const today = new Date();
      const dayStart = startOfDay(today);
      const dayEnd = endOfDay(today);

      const [existing] = await db
        .select({ count: count() })
        .from(submissions)
        .where(and(
          eq(submissions.kidId, kidId),
          eq(submissions.type, type),
          gte(submissions.submittedAt, dayStart),
          lt(submissions.submittedAt, dayEnd)
        ));

      if (existing.count >= 1) {
        return res.status(409).json({ error: "Already submitted today. Come back tomorrow!" });
      }

      // Insert submission -- points defaults to 1 per PTS-01
      const [submission] = await db.insert(submissions).values({
        kidId, challengeId, familyId: req.session.familyId!,
        weekNumber, type, cloudinaryId, cloudinaryUrl, thumbnailUrl,
      }).returning();

      // Get updated total points for this kid (PTS-03 cumulative)
      const [total] = await db
        .select({ totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)` })
        .from(submissions)
        .where(eq(submissions.kidId, kidId));

      res.json({ success: true, points: 1, totalPoints: total.totalPoints });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ error: "Failed to record submission" });
    }
  });

  // POST /api/video-bonus -- Record a video bonus point (PTS-02, D-05, D-06, D-07)
  app.post("/api/video-bonus", requireFamily, async (req, res) => {
    try {
      const parseResult = videoBonusSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid video bonus data" });
      }

      const { kidId, challengeId, weekNumber } = parseResult.data;

      // Verify kid belongs to this family
      const [kid] = await db.select().from(kids).where(
        and(eq(kids.id, kidId), eq(kids.familyId, req.session.familyId!))
      );
      if (!kid) return res.status(404).json({ error: "Kid not found" });

      // Verify challenge exists and has a video (D-07)
      const [challenge] = await db.select().from(challenges).where(eq(challenges.id, challengeId));
      if (!challenge) return res.status(404).json({ error: "Challenge not found" });
      if (!challenge.videoUrl) return res.status(400).json({ error: "No video available for this challenge" });

      // Check if video bonus already claimed this week (D-06: 1 per kid per week)
      const [existingBonus] = await db
        .select({ count: count() })
        .from(submissions)
        .where(and(
          eq(submissions.kidId, kidId),
          eq(submissions.weekNumber, weekNumber),
          eq(submissions.type, "video_bonus")
        ));

      if (existingBonus.count >= 1) {
        return res.status(409).json({ error: "Video bonus already claimed this week" });
      }

      // Insert video bonus as submission row (type="video_bonus", no cloudinary fields)
      const [bonus] = await db.insert(submissions).values({
        kidId, challengeId, familyId: req.session.familyId!,
        weekNumber, type: "video_bonus",
      }).returning();

      // Get updated total points
      const [total] = await db
        .select({ totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)` })
        .from(submissions)
        .where(eq(submissions.kidId, kidId));

      res.json({ success: true, points: 1, totalPoints: total.totalPoints });
    } catch (error) {
      console.error("Video bonus error:", error);
      res.status(500).json({ error: "Failed to record video bonus" });
    }
  });

  // GET /api/submissions/status -- Per-kid submission state for client display (LDR-04)
  app.get("/api/submissions/status", requireFamily, async (req, res) => {
    try {
      const kidId = req.query.kidId as string;
      if (!kidId) return res.status(400).json({ error: "kidId query parameter required" });

      // Verify kid belongs to this family (T-02-07)
      const [kid] = await db.select().from(kids).where(
        and(eq(kids.id, kidId), eq(kids.familyId, req.session.familyId!))
      );
      if (!kid) return res.status(404).json({ error: "Kid not found" });

      const today = new Date();
      const dayStart = startOfDay(today);
      const dayEnd = endOfDay(today);

      // Today's submissions by type (for daily cap display)
      const todaySubmissions = await db.select({
        type: submissions.type,
        weekNumber: submissions.weekNumber,
      }).from(submissions).where(and(
        eq(submissions.kidId, kidId),
        gte(submissions.submittedAt, dayStart),
        lt(submissions.submittedAt, dayEnd),
      ));

      // All submissions for this kid (for past week status indicators)
      const allSubmissions = await db.select({
        weekNumber: submissions.weekNumber,
        type: submissions.type,
      }).from(submissions).where(eq(submissions.kidId, kidId));

      // Total points
      const [total] = await db
        .select({ totalPoints: sql<number>`cast(coalesce(sum(${submissions.points}), 0) as int)` })
        .from(submissions)
        .where(eq(submissions.kidId, kidId));

      res.json({
        todaySubmissions,
        allSubmissions,
        totalPoints: total.totalPoints,
      });
    } catch (error) {
      console.error("Submission status error:", error);
      res.status(500).json({ error: "Failed to load submission status" });
    }
  });

  // GET /api/leaderboard -- Public ranked leaderboard (LDR-01, LDR-04, LDR-05, LDR-06, PRIV-02, PRIV-03)
  // NOTE: No requireFamily -- this is a public endpoint per D-08
  // NOTE: No cloudinaryUrl or cloudinaryId in response -- privacy boundary (PRIV-03)
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

      // Fetch all submissions for streak/badge computation (single query, <1200 rows at scale)
      const allSubmissions = await db.select({
        kidId: submissions.kidId,
        type: submissions.type,
        weekNumber: submissions.weekNumber,
        points: submissions.points,
        submittedAt: submissions.submittedAt,
      }).from(submissions);

      // Group submissions by kid
      const submissionsByKid = new Map<string, typeof allSubmissions>();
      for (const s of allSubmissions) {
        const existing = submissionsByKid.get(s.kidId) ?? [];
        existing.push(s);
        submissionsByKid.set(s.kidId, existing);
      }

      // Add rank, streak, badge count to each entry
      const ranked = leaderboard.map((entry, index) => {
        const kidSubs = submissionsByKid.get(entry.kidId) ?? [];
        const dates = kidSubs.map(s => new Date(s.submittedAt));
        const streak = computeStreak(dates);
        const badges = computeBadges(kidSubs, streak.max);
        const badgeCount = badges.filter(b => b.earned).length;
        return {
          rank: index + 1,
          ...entry,
          currentStreak: streak.current,
          badgeCount,
        };
      });

      // Get aggregate stats for hero section
      const [stats] = await db
        .select({
          totalSubmissions: count(),
          totalPlayers: sql<number>`cast(count(distinct ${submissions.kidId}) as int)`,
        })
        .from(submissions);

      res.json({
        leaderboard: ranked,
        stats: {
          totalSubmissions: stats?.totalSubmissions ?? 0,
          totalPlayers: stats?.totalPlayers ?? 0,
        },
      });
    } catch (error) {
      console.error("Leaderboard error:", error);
      res.status(500).json({ error: "Failed to load leaderboard" });
    }
  });

  // GET /api/player/:id -- Public player profile (PROF-01, PROF-02, PROF-03)
  // NOTE: No requireFamily -- public endpoint like leaderboard
  app.get("/api/player/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Get kid info (public fields only -- no familyId, no lastName per T-03-01)
      const [kid] = await db.select({
        id: kids.id,
        displayName: kids.displayName,
        ageTrack: kids.ageTrack,
      }).from(kids).where(eq(kids.id, id));

      if (!kid) return res.status(404).json({ error: "Player not found" });

      // Get all submissions for this kid (with challenge title for history)
      const kidSubmissions = await db.select({
        type: submissions.type,
        weekNumber: submissions.weekNumber,
        points: submissions.points,
        submittedAt: submissions.submittedAt,
        challengeTitle: challenges.title,
      })
      .from(submissions)
      .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
      .where(eq(submissions.kidId, id))
      .orderBy(desc(submissions.submittedAt));

      // Compute total points
      const totalPoints = kidSubmissions.reduce((sum, s) => sum + s.points, 0);

      // Compute streak (PTS-04)
      const dates = kidSubmissions.map(s => new Date(s.submittedAt));
      const streak = computeStreak(dates);

      // Compute badges (PTS-05, PTS-06, PTS-07)
      const badges = computeBadges(kidSubmissions, streak.max);

      // Check NSC registration status
      const [family] = await db.select({ isRegistered: families.isRegistered })
        .from(families)
        .innerJoin(kids, eq(kids.familyId, families.id))
        .where(eq(kids.id, id));

      // Submission history (PROF-03: dates and challenge names, not videos per T-03-04)
      const history = kidSubmissions
        .filter(s => s.type !== "video_bonus")
        .map(s => ({
          date: s.submittedAt,
          challengeTitle: s.challengeTitle,
          type: s.type,
          weekNumber: s.weekNumber,
        }));

      res.json({
        kid: { ...kid, isRegistered: family?.isRegistered ?? false },
        totalPoints,
        currentStreak: streak.current,
        maxStreak: streak.max,
        badges: badges.filter(b => b.earned).map(b => b.id),
        allBadges: badges,
        history,
      });
    } catch (error) {
      console.error("Player profile error:", error);
      res.status(500).json({ error: "Failed to load player profile" });
    }
  });

  // -- Admin Challenge Endpoints (Phase 4: ADM-01, ADM-02, ADM-04) --

  // ADM-01: View all submissions with Cloudinary video URLs
  app.get("/api/admin/challenge/submissions", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const allSubmissions = await db.select({
        id: submissions.id,
        kidName: kids.displayName,
        ageTrack: kids.ageTrack,
        familyEmail: families.email,
        challengeTitle: challenges.title,
        weekNumber: submissions.weekNumber,
        type: submissions.type,
        points: submissions.points,
        cloudinaryUrl: submissions.cloudinaryUrl,
        thumbnailUrl: submissions.thumbnailUrl,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .innerJoin(kids, eq(submissions.kidId, kids.id))
      .innerJoin(families, eq(kids.familyId, families.id))
      .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
      .orderBy(desc(submissions.submittedAt));

      res.json({ submissions: allSubmissions });
    } catch (error) {
      console.error("Admin submissions error:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // ADM-02: Get all challenges for admin editing
  app.get("/api/admin/challenge/challenges", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const allChallenges = await db.select().from(challenges)
        .orderBy(challenges.weekNumber, challenges.ageTrack, challenges.type);
      res.json({ challenges: allChallenges });
    } catch (error) {
      console.error("Admin challenges error:", error);
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  });

  // ADM-02: Edit challenge content (PATCH -- only update provided fields)
  app.patch("/api/admin/challenge/challenges/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const parseResult = challengeEditSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid challenge data", details: parseResult.error.flatten() });
      }

      const data = parseResult.data;
      const updates: Record<string, any> = {};
      if (data.title !== undefined) updates.title = data.title;
      if (data.description !== undefined) updates.description = data.description;
      if (data.videoUrl !== undefined) updates.videoUrl = data.videoUrl;
      if (data.active !== undefined) updates.active = data.active;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const [challenge] = await db.update(challenges).set(updates).where(eq(challenges.id, id)).returning();
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      res.json({ challenge });
    } catch (error) {
      console.error("Admin challenge update error:", error);
      res.status(500).json({ error: "Failed to update challenge" });
    }
  });

  // ADM-04: Toggle NSC Player (isRegistered on families table)
  // Note per RESEARCH Pitfall 4: isRegistered is on families, not kids.
  // Toggling affects ALL kids in that family.
  app.get("/api/admin/challenge/kids", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const allKids = await db.select({
        kidId: kids.id,
        kidName: kids.displayName,
        ageTrack: kids.ageTrack,
        familyId: families.id,
        familyEmail: families.email,
        familyName: families.name,
        isRegistered: families.isRegistered,
      })
      .from(kids)
      .innerJoin(families, eq(kids.familyId, families.id))
      .orderBy(families.email, kids.displayName);

      res.json({ kids: allKids });
    } catch (error) {
      console.error("Admin kids error:", error);
      res.status(500).json({ error: "Failed to fetch kids" });
    }
  });

  app.patch("/api/admin/challenge/families/:id/registered", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const { isRegistered } = req.body;

      if (typeof isRegistered !== "boolean") {
        return res.status(400).json({ error: "isRegistered must be a boolean" });
      }

      const [family] = await db.update(families)
        .set({ isRegistered })
        .where(eq(families.id, id))
        .returning();

      if (!family) {
        return res.status(404).json({ error: "Family not found" });
      }

      res.json({ family: { id: family.id, email: family.email, name: family.name, isRegistered: family.isRegistered } });
    } catch (error) {
      console.error("Admin toggle registered error:", error);
      res.status(500).json({ error: "Failed to update registration status" });
    }
  });

  // -- Prize Drawing & Email Export (Phase 4: ADM-03, ADM-05) --

  // ADM-03: Trigger weighted prize drawing
  app.post("/api/admin/challenge/drawing", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const parseResult = drawingRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid drawing request", details: parseResult.error.flatten() });
      }

      const { type, weekNumber } = parseResult.data;

      // Build points-per-kid query, filtered by weekNumber for weekly drawings
      const conditions = weekNumber ? eq(submissions.weekNumber, weekNumber) : undefined;

      const entries = await db.select({
        kidId: submissions.kidId,
        totalPoints: sql<number>`cast(sum(${submissions.points}) as int)`,
      })
      .from(submissions)
      .where(conditions)
      .groupBy(submissions.kidId);

      if (entries.length === 0) {
        return res.status(400).json({ error: "No entries found for this drawing" });
      }

      // Build weighted pool: each point = 1 entry
      const totalEntries = entries.reduce((sum, e) => sum + e.totalPoints, 0);

      // Pick random entry using crypto.randomInt (CSPRNG)
      const pick = randomInt(0, totalEntries);
      let running = 0;
      let winnerId = entries[entries.length - 1].kidId; // fallback
      for (const entry of entries) {
        running += entry.totalPoints;
        if (pick < running) {
          winnerId = entry.kidId;
          break;
        }
      }

      // Get winner name for denormalized storage
      const [winner] = await db.select({ displayName: kids.displayName }).from(kids).where(eq(kids.id, winnerId));

      // Store drawing result
      const [drawing] = await db.insert(drawings).values({
        weekNumber: weekNumber ?? null,
        type,
        winnerKidId: winnerId,
        winnerName: winner?.displayName ?? "Unknown",
        totalEntries,
      }).returning();

      res.json({
        drawing,
        message: `${winner?.displayName ?? "Unknown"} wins the ${type} drawing with ${totalEntries} total entries!`,
      });
    } catch (error) {
      console.error("Admin drawing error:", error);
      res.status(500).json({ error: "Failed to run prize drawing" });
    }
  });

  // ADM-03: Get drawing history
  app.get("/api/admin/challenge/drawings", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const allDrawings = await db.select().from(drawings).orderBy(desc(drawings.drawnAt));
      res.json({ drawings: allDrawings });
    } catch (error) {
      console.error("Admin drawings history error:", error);
      res.status(500).json({ error: "Failed to fetch drawing history" });
    }
  });

  // ADM-05: View email list
  app.get("/api/admin/challenge/emails", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const emailList = await db.select({
        id: families.id,
        email: families.email,
        name: families.name,
        isRegistered: families.isRegistered,
        kidCount: sql<number>`cast(count(${kids.id}) as int)`,
        createdAt: families.createdAt,
      })
      .from(families)
      .leftJoin(kids, eq(kids.familyId, families.id))
      .groupBy(families.id, families.email, families.name, families.isRegistered, families.createdAt)
      .orderBy(desc(families.createdAt));

      res.json({ emails: emailList, total: emailList.length });
    } catch (error) {
      console.error("Admin emails error:", error);
      res.status(500).json({ error: "Failed to fetch email list" });
    }
  });

  // ADM-05: Export email list as CSV
  app.get("/api/admin/challenge/emails/export", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const emailList = await db.select({
        email: families.email,
        name: families.name,
        isRegistered: families.isRegistered,
        kidCount: sql<number>`cast(count(${kids.id}) as int)`,
        createdAt: families.createdAt,
      })
      .from(families)
      .leftJoin(kids, eq(kids.familyId, families.id))
      .groupBy(families.id, families.email, families.name, families.isRegistered, families.createdAt)
      .orderBy(desc(families.createdAt));

      const headers = ["Email", "Name", "NSC Player", "Kids", "Signed Up"];
      const rows = emailList.map((f) => [
        f.email,
        `"${(f.name || "").replace(/"/g, '""')}"`,
        f.isRegistered ? "Yes" : "No",
        f.kidCount,
        new Date(f.createdAt).toISOString(),
      ].join(","));

      const csv = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=challenge-emails.csv");
      res.send(csv);
    } catch (error) {
      console.error("Admin email export error:", error);
      res.status(500).json({ error: "Failed to export email list" });
    }
  });
}
