import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  program: text("program").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export const tournamentInterests = pgTable("tournament_interests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clubName: text("club_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  divisions: text("divisions").notNull(),
  teamCount: text("team_count").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTournamentInterestSchema = createInsertSchema(tournamentInterests).omit({
  id: true,
  createdAt: true,
});

export type InsertTournamentInterest = z.infer<typeof insertTournamentInterestSchema>;
export type TournamentInterest = typeof tournamentInterests.$inferSelect;

export const shopOrders = pgTable("shop_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  items: jsonb("items").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShopOrder = typeof shopOrders.$inferSelect;

export const shopProducts = pgTable("shop_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  image: text("image"),
  imageData: text("image_data"),
  sizes: jsonb("sizes").$type<string[]>(),
  colors: jsonb("colors").$type<{ name: string; hex: string }[]>(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  printerNotes: text("printer_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShopProduct = typeof shopProducts.$inferSelect;

export const coachApplications = pgTable("coach_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  city: text("city"),
  playingExperience: text("playing_experience"),
  coachingExperience: text("coaching_experience").notNull(),
  certifications: text("certifications"),
  coachingRole: text("coaching_role"),
  programs: text("programs").notNull(),
  ageGroups: text("age_groups").notNull(),
  genderPreference: text("gender_preference"),
  hasChildren: text("has_children"),
  childrenAges: text("children_ages"),
  willingToCoachMultiple: boolean("willing_to_coach_multiple"),
  whyCoach: text("why_coach"),
  additionalNotes: text("additional_notes"),
  backgroundCheckConsent: boolean("background_check_consent").notNull(),
  showOnBoard: boolean("show_on_board").notNull().default(false),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCoachApplicationSchema = createInsertSchema(coachApplications).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertCoachApplication = z.infer<typeof insertCoachApplicationSchema>;
export type CoachApplication = typeof coachApplications.$inferSelect;

export const divisions = pgTable("divisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ageGroup: text("age_group").notNull(),
  gender: text("gender").notNull(),
  headCoachesNeeded: integer("head_coaches_needed").notNull().default(0),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertDivisionSchema = createInsertSchema(divisions).omit({
  id: true,
});

export type InsertDivision = z.infer<typeof insertDivisionSchema>;
export type Division = typeof divisions.$inferSelect;

export const coachAssignments = pgTable("coach_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coachApplicationId: text("coach_application_id"),
  divisionId: text("division_id").notNull(),
  role: text("role").notNull(),
  displayName: text("display_name").notNull(),
  headAssignmentId: text("head_assignment_id").references((): any => coachAssignments.id, { onDelete: "set null" }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCoachAssignmentSchema = createInsertSchema(coachAssignments).omit({
  id: true,
  createdAt: true,
});

export type InsertCoachAssignment = z.infer<typeof insertCoachAssignmentSchema>;
export type CoachAssignment = typeof coachAssignments.$inferSelect;

export const volunteerApplications = pgTable("volunteer_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roleId: text("role_id").notNull(),
  roleTitle: text("role_title").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  whyGoodFit: text("why_good_fit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).omit({
  id: true,
  createdAt: true,
});

export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;
export type VolunteerApplication = typeof volunteerApplications.$inferSelect;

export const placementRequests = pgTable("placement_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submitterRole: text("submitter_role").notNull(),
  submitterName: text("submitter_name").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  submitterPhone: text("submitter_phone").notNull(),
  playerName: text("player_name").notNull(),
  requestType: text("request_type").notNull(),
  otherPlayerName: text("other_player_name"),
  relationship: text("relationship"),
  coachName: text("coach_name"),
  connectionReason: text("connection_reason"),
  availableDays: text("available_days"),
  unavailableDays: text("unavailable_days"),
  scheduleReason: text("schedule_reason"),
  additionalPlayerNames: text("additional_player_names"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlacementRequestSchema = createInsertSchema(placementRequests).omit({
  id: true,
  createdAt: true,
  status: true,
  adminNotes: true,
});

export type InsertPlacementRequest = z.infer<typeof insertPlacementRequestSchema>;
export type PlacementRequest = typeof placementRequests.$inferSelect;
