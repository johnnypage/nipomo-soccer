import type { Request, Response } from "express";
import { createHmac, createHash, timingSafeEqual } from "crypto";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const HMAC_SECRET = process.env.SESSION_SECRET || process.env.STRIPE_SECRET_KEY || "dev-hmac-secret";

export function generateToken(password: string): string | null {
  const hash = createHash("sha256").update(password).digest("hex");
  if (hash !== ADMIN_PASSWORD_HASH) return null;
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  const data = `admin:${expires}`;
  const sig = createHmac("sha256", HMAC_SECRET).update(data).digest("hex");
  return `${data}:${sig}`;
}

export function verifyToken(token: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [role, expiresStr, sig] = parts;
  const expires = parseInt(expiresStr, 10);
  if (isNaN(expires) || Date.now() > expires) return false;
  const data = `${role}:${expiresStr}`;
  const expected = createHmac("sha256", HMAC_SECRET).update(data).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function requireAuth(req: Request, res: Response): boolean {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  if (!verifyToken(auth.slice(7))) {
    res.status(401).json({ error: "Invalid or expired token" });
    return false;
  }
  return true;
}
