import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().int().min(1).max(20),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const checkoutRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "ready",
  "picked_up",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
