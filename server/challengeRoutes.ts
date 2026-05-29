import type { Express } from "express";
import { db } from "./db";
import { families, kids, challenges, submissions } from "@shared/schema";
import { signupSchema, addKidSchema, submitSchema, videoBonusSchema } from "@shared/challengeValidation";
import { eq, and, gt, desc, gte, lt, count, sql } from "drizzle-orm";
import { requireFamily } from "./challengeAuth";
import { randomBytes } from "crypto";
import { differenceInYears, startOfDay, endOfDay } from "date-fns";
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
}
