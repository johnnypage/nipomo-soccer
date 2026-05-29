import type { Request, Response, NextFunction } from "express";

export function requireFamily(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.familyId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}
