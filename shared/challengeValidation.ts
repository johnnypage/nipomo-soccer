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

export const submissionTypeEnum = z.enum(["skill", "fitness", "video_bonus"]);
export type SubmissionType = z.infer<typeof submissionTypeEnum>;

export const submitSchema = z.object({
  kidId: z.string().min(1, "Kid selection is required"),
  challengeId: z.string().min(1, "Challenge ID is required"),
  weekNumber: z.number().int().min(1).max(8),
  type: z.enum(["skill", "fitness"]),
  cloudinaryId: z.string().min(1, "Upload ID is required"),
  cloudinaryUrl: z.string().url("Invalid upload URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL"),
});
export type SubmitRequest = z.infer<typeof submitSchema>;

export const videoBonusSchema = z.object({
  kidId: z.string().min(1, "Kid selection is required"),
  challengeId: z.string().min(1, "Challenge ID is required"),
  weekNumber: z.number().int().min(1).max(8),
});
export type VideoBonusRequest = z.infer<typeof videoBonusSchema>;
