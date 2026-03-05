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
