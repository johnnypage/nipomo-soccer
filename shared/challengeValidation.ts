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

// -- Admin validation schemas (Phase 4: ADM-02, ADM-03) --

export const challengeEditSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  description: z.string().min(1, "Description is required").max(2000).optional(),
  videoUrl: z.string().url("Must be a valid URL").optional().nullable(),
  active: z.boolean().optional(),
});

export type ChallengeEditRequest = z.infer<typeof challengeEditSchema>;

export const drawingRequestSchema = z.object({
  type: z.enum(["weekly", "grand"]),
  weekNumber: z.number().int().min(1).max(8).optional(),
}).refine(
  (data) => data.type === "grand" || (data.type === "weekly" && data.weekNumber !== undefined),
  { message: "weekNumber is required for weekly drawings" }
);

export type DrawingRequest = z.infer<typeof drawingRequestSchema>;
