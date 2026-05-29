import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must consent to the privacy notice to continue",
  }),
});

export type SignupRequest = z.infer<typeof signupSchema>;

export const addKidSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be YYYY-MM-DD format"),
});

export type AddKidRequest = z.infer<typeof addKidSchema>;

export const ageTrackEnum = z.enum(["littlekicks", "starter", "advanced"]);

export type AgeTrack = z.infer<typeof ageTrackEnum>;
