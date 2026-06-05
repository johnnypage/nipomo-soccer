import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as AppleStrategy } from "passport-apple";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { families } from "@shared/schema";
import { eq } from "drizzle-orm";

type OAuthUser = {
  provider: "google" | "apple";
  sub: string;
  email: string;
  name?: string;
};

declare global {
  namespace Express {
    interface User extends OAuthUser {}
  }
}

const APP_URL = process.env.APP_URL || "https://nipomosc.org";
const SIGNUP_PATH = "/challenge/signup";
const SUCCESS_PATH = "/challenge";

function isConfigured(...envVars: string[]) {
  return envVars.every((v) => typeof process.env[v] === "string" && process.env[v]!.length > 0);
}

function configureGoogle() {
  if (!isConfigured("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET")) {
    console.warn("[oauth] Google strategy not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
    return false;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${APP_URL}/api/auth/google/callback`,
        scope: ["openid", "email", "profile"],
      },
      (_accessToken, _refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error("Google profile missing email"));
        }
        const user: OAuthUser = {
          provider: "google",
          sub: profile.id,
          email,
          name: profile.displayName || undefined,
        };
        done(null, user);
      },
    ),
  );

  return true;
}

function normalizeApplePrivateKey(raw: string): string {
  // Replit's Secrets UI sometimes stores newlines as the two-character
  // sequence \n. jsonwebtoken needs real newlines or it throws
  // "PEM_read_bio_PrivateKey".
  let key = raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
  // Strip surrounding quotes if the secret was pasted with them.
  key = key.replace(/^["']|["']$/g, "");
  // Strip a UTF-8 BOM if one snuck in.
  if (key.charCodeAt(0) === 0xfeff) key = key.slice(1);
  return key.trim();
}

// Round-trip the key through Node's crypto layer. This canonicalizes any
// minor formatting issues (extra whitespace, missing newline before END,
// non-standard line wrapping) and surfaces a clear error at startup if the
// key really is broken -- rather than letting jsonwebtoken fail silently
// inside the OAuth handshake with "secretOrPrivateKey must be an asymmetric
// key when using ES256".
function canonicalizeApplePrivateKey(pem: string): string {
  const keyObject = crypto.createPrivateKey({
    key: pem,
    format: "pem",
  });
  if (keyObject.asymmetricKeyType !== "ec") {
    throw new Error(
      `Expected an EC private key for ES256, got ${keyObject.asymmetricKeyType ?? "unknown"}`,
    );
  }
  return keyObject.export({ format: "pem", type: "pkcs8" }).toString();
}

function configureApple() {
  if (!isConfigured("APPLE_CLIENT_ID", "APPLE_TEAM_ID", "APPLE_KEY_ID", "APPLE_PRIVATE_KEY")) {
    console.warn("[oauth] Apple strategy not configured (missing one of APPLE_CLIENT_ID/TEAM_ID/KEY_ID/PRIVATE_KEY)");
    return false;
  }

  const rawKey = normalizeApplePrivateKey(process.env.APPLE_PRIVATE_KEY!);
  if (!rawKey.includes("BEGIN PRIVATE KEY")) {
    console.error("[oauth] APPLE_PRIVATE_KEY does not look like a PEM block. Did the .p8 contents get truncated?");
    return false;
  }

  let privateKey: string;
  try {
    privateKey = canonicalizeApplePrivateKey(rawKey);
    console.log(`[oauth] Apple private key parsed OK (length ${privateKey.length} bytes, type EC)`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[oauth] Apple private key REJECTED by crypto.createPrivateKey: ${msg}`);
    console.error(`[oauth]   raw length=${rawKey.length}, starts="${rawKey.slice(0, 32)}", ends="${rawKey.slice(-32)}"`);
    return false;
  }

  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID!,
        teamID: process.env.APPLE_TEAM_ID!,
        keyID: process.env.APPLE_KEY_ID!,
        privateKeyString: privateKey,
        callbackURL: `${APP_URL}/api/auth/apple/callback`,
        passReqToCallback: true,
      },
      (req, _accessToken, _refreshToken, idToken, _profile, done) => {
        try {
          const decoded = jwt.decode(idToken) as
            | { sub?: string; email?: string }
            | null;
          if (!decoded?.sub || !decoded.email) {
            return done(new Error("Apple idToken missing sub or email"));
          }

          // Apple posts a `user` form field with first/last name only on the
          // first authentication. Subsequent sign-ins omit it.
          let name: string | undefined;
          const userField = (req.body as { user?: string } | undefined)?.user;
          if (typeof userField === "string" && userField.length > 0) {
            try {
              const parsed = JSON.parse(userField) as {
                name?: { firstName?: string; lastName?: string };
              };
              const first = parsed.name?.firstName?.trim();
              const last = parsed.name?.lastName?.trim();
              name = [first, last].filter(Boolean).join(" ") || undefined;
            } catch {
              // Malformed -- ignore; not fatal.
            }
          }

          const user: OAuthUser = {
            provider: "apple",
            sub: decoded.sub,
            email: decoded.email.toLowerCase(),
            name,
          };
          done(null, user);
        } catch (e) {
          done(e instanceof Error ? e : new Error("Apple verify failed"));
        }
      },
    ),
  );

  return true;
}

async function findOrLinkOrCreate(user: OAuthUser): Promise<string> {
  const providerColumn = user.provider === "google" ? families.googleId : families.appleId;

  // 1. Provider ID match -- existing linked account
  const [byProvider] = await db.select().from(families).where(eq(providerColumn, user.sub));
  if (byProvider) return byProvider.id;

  // 2. Email match -- link this provider to the existing family
  const [byEmail] = await db.select().from(families).where(eq(families.email, user.email));
  if (byEmail) {
    const patch: Record<string, string> = {};
    patch[user.provider === "google" ? "googleId" : "appleId"] = user.sub;
    if (!byEmail.name && user.name) patch.name = user.name;
    await db.update(families).set(patch).where(eq(families.id, byEmail.id));
    return byEmail.id;
  }

  // 3. New family -- record consent at signup (PRIV-01)
  const [created] = await db
    .insert(families)
    .values({
      email: user.email,
      name: user.name ?? null,
      consentGivenAt: new Date(),
      googleId: user.provider === "google" ? user.sub : null,
      appleId: user.provider === "apple" ? user.sub : null,
    })
    .returning({ id: families.id });

  return created.id;
}

function completeLogin(familyId: string, req: Request, res: Response) {
  req.session.regenerate((err) => {
    if (err) {
      console.error("[oauth] session regenerate failed", err);
      return res.redirect(`${SIGNUP_PATH}?error=session`);
    }
    req.session.familyId = familyId;
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("[oauth] session save failed", saveErr);
        return res.redirect(`${SIGNUP_PATH}?error=session`);
      }
      res.redirect(SUCCESS_PATH);
    });
  });
}

export function registerOAuthRoutes(app: Express) {
  const googleReady = configureGoogle();
  const appleReady = configureApple();

  app.use(passport.initialize());

  app.get("/api/auth/oauth-status", (_req, res) => {
    res.json({ google: googleReady, apple: appleReady });
  });

  if (googleReady) {
    app.get(
      "/api/auth/google",
      passport.authenticate("google", {
        scope: ["openid", "email", "profile"],
        session: false,
      }),
    );

    app.get(
      "/api/auth/google/callback",
      (req, res, next) => {
        passport.authenticate("google", { session: false }, async (err: unknown, user: OAuthUser | false) => {
          if (err || !user) {
            console.error("[oauth] google callback failed", err);
            return res.redirect(`${SIGNUP_PATH}?error=oauth`);
          }
          try {
            const familyId = await findOrLinkOrCreate(user);
            completeLogin(familyId, req, res);
          } catch (e) {
            console.error("[oauth] google find-or-create failed", e);
            res.redirect(`${SIGNUP_PATH}?error=server`);
          }
        })(req, res, next);
      },
    );
  }

  if (appleReady) {
    app.get(
      "/api/auth/apple",
      passport.authenticate("apple", { session: false }),
    );

    const appleCallback = (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate("apple", { session: false }, async (err: unknown, user: OAuthUser | false, info: unknown) => {
        if (err || !user) {
          const errMsg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
          console.error(`[oauth] apple callback failed: err=${errMsg} info=${JSON.stringify(info)} body-keys=${Object.keys(req.body || {}).join(",")}`);
          return res.redirect(`${SIGNUP_PATH}?error=oauth`);
        }
        try {
          const familyId = await findOrLinkOrCreate(user);
          completeLogin(familyId, req, res);
        } catch (e) {
          const errMsg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
          console.error(`[oauth] apple find-or-create failed: ${errMsg}`);
          res.redirect(`${SIGNUP_PATH}?error=server`);
        }
      })(req, res, next);
    };

    // Apple uses form_post response mode -- callback arrives as POST.
    app.post("/api/auth/apple/callback", appleCallback);
    // Some Apple flows / older configs fall back to GET; tolerate both.
    app.get("/api/auth/apple/callback", appleCallback);
  }
}
