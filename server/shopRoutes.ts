import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { createHmac, createHash, timingSafeEqual } from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { shopOrders, shopProducts } from "@shared/schema";
import { checkoutRequestSchema, orderStatusSchema } from "@shared/shopValidation";
import { eq, desc, asc } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const HMAC_SECRET = process.env.STRIPE_SECRET_KEY || "dev-hmac-secret";

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.resolve("uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function getDeadline(): Date | null {
  const d = process.env.SHOP_DEADLINE;
  if (!d) return null;
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
}

function isShopOpen(): boolean {
  const deadline = getDeadline();
  if (!deadline) return true;
  return new Date() < deadline;
}

function generateToken(password: string): string | null {
  const hash = createHash("sha256").update(password).digest("hex");
  if (hash !== ADMIN_PASSWORD_HASH) return null;
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  const data = `admin:${expires}`;
  const sig = createHmac("sha256", HMAC_SECRET).update(data).digest("hex");
  return `${data}:${sig}`;
}

function verifyToken(token: string): boolean {
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

function requireAuth(req: Request, res: Response): boolean {
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

// Seed data from the old hardcoded catalog
const SEED_PRODUCTS = [
  {
    name: "Club Hoodie",
    description: "Premium heavyweight hoodie with embroidered Nipomo SC crest.",
    price: 4000,
    sizes: ["YS", "YM", "YL", "YXL", "S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Black", hex: "#0D0D0D" },
      { name: "Burgundy", hex: "#8B1D24" },
    ],
    active: true,
    sortOrder: 0,
  },
  {
    name: "Club T-Shirt",
    description: "Soft cotton tee with printed Nipomo SC logo.",
    price: 2500,
    sizes: ["YS", "YM", "YL", "YXL", "S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Black", hex: "#0D0D0D" },
      { name: "White", hex: "#F4EDE1" },
    ],
    active: true,
    sortOrder: 1,
  },
  {
    name: "Coaches Tee",
    description: "Performance tee for coaching staff.",
    price: 2500,
    sizes: ["S", "M", "L", "XL", "2XL"],
    active: true,
    sortOrder: 2,
  },
  {
    name: "Club Hat",
    description: "Structured snapback with embroidered crest.",
    price: 2000,
    active: true,
    sortOrder: 3,
  },
  {
    name: "Club Scarf",
    description: "Knit scarf with Nipomo SC branding.",
    price: 1500,
    colors: [
      { name: "Black", hex: "#0D0D0D" },
      { name: "Burgundy", hex: "#8B1D24" },
    ],
    active: true,
    sortOrder: 4,
  },
];

async function seedProductsIfEmpty() {
  const existing = await db.select().from(shopProducts).limit(1);
  if (existing.length > 0) return;
  for (const p of SEED_PRODUCTS) {
    await db.insert(shopProducts).values(p);
  }
  console.log("Seeded shop products");
}

export function registerShopRoutes(app: Express) {
  // Seed products on startup
  seedProductsIfEmpty().catch(console.error);

  // Get active products (public)
  app.get("/api/shop/products", async (_req, res) => {
    try {
      const products = await db
        .select()
        .from(shopProducts)
        .where(eq(shopProducts.active, true))
        .orderBy(asc(shopProducts.sortOrder));
      res.json({
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
          sizes: p.sizes,
          colors: p.colors,
          active: p.active,
        })),
        isOpen: isShopOpen(),
        deadline: getDeadline()?.toISOString() ?? null,
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get shop config
  app.get("/api/shop/config", (_req, res) => {
    res.json({
      isOpen: isShopOpen(),
      deadline: getDeadline()?.toISOString() ?? null,
    });
  });

  // Create checkout session
  app.post("/api/shop/create-checkout-session", async (req, res) => {
    try {
      if (!isShopOpen()) {
        return res.status(400).json({ error: "The shop is currently closed for orders." });
      }

      const parsed = checkoutRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid cart data" });
      }

      const { items } = parsed.data;

      // Validate prices server-side against DB
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      const orderItems: Array<{ productId: string; name: string; price: number; size?: string; color?: string; quantity: number }> = [];

      for (const item of items) {
        const [product] = await db
          .select()
          .from(shopProducts)
          .where(eq(shopProducts.id, item.productId))
          .limit(1);

        if (!product || !product.active) {
          return res.status(400).json({ error: `Product "${item.productId}" not found or inactive` });
        }
        if (product.sizes && (product.sizes as string[]).length > 0 && !item.size) {
          return res.status(400).json({ error: `Size is required for "${product.name}"` });
        }
        if (product.colors && (product.colors as any[]).length > 0 && !item.color) {
          return res.status(400).json({ error: `Color is required for "${product.name}"` });
        }

        let desc = "";
        if (item.size) desc += `Size: ${item.size}`;
        if (item.color) desc += `${desc ? " / " : ""}Color: ${item.color}`;

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              ...(desc ? { description: desc } : {}),
            },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        });

        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        });
      }

      // Truncate metadata to fit Stripe's 500-char limit
      let metaItems = JSON.stringify(orderItems);
      if (metaItems.length > 490) {
        metaItems = metaItems.substring(0, 490) + "...";
      }

      const origin = `${req.protocol}://${req.get("host")}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        phone_number_collection: { enabled: true },
        success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop`,
        metadata: {
          order_items: metaItems,
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout session error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe webhook
  app.post("/api/shop/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).send("Webhook secret not configured");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody as Buffer, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      let items: any[] = [];
      try {
        const raw = session.metadata?.order_items;
        if (raw && !raw.endsWith("...")) {
          items = JSON.parse(raw);
        }
      } catch {
        // metadata was truncated, items stored as-is
      }

      try {
        await db.insert(shopOrders).values({
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email || "unknown",
          customerName: session.customer_details?.name || "unknown",
          customerPhone: session.customer_details?.phone || null,
          items: items.length > 0 ? items : session.metadata?.order_items || "[]",
          totalAmount: session.amount_total || 0,
          status: "confirmed",
        });
      } catch (dbErr) {
        console.error("Failed to save order:", dbErr);
      }
    }

    res.json({ received: true });
  });

  // Retrieve (and record) an order from a Stripe session ID — called by the order confirmation page
  app.get("/api/shop/order-from-session", async (req, res) => {
    const sessionId = req.query.session_id as string;
    if (!sessionId) {
      return res.status(400).json({ error: "session_id is required" });
    }
    try {
      // Check if we already recorded this order
      const existing = await db
        .select()
        .from(shopOrders)
        .where(eq(shopOrders.stripeSessionId, sessionId))
        .limit(1);

      if (existing[0]) {
        return res.json({ order: existing[0] });
      }

      // Retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });

      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not completed" });
      }

      let items: any[] = [];
      try {
        const raw = session.metadata?.order_items;
        if (raw && !raw.endsWith("...")) {
          items = JSON.parse(raw);
        } else if (session.line_items?.data) {
          items = session.line_items.data.map((li) => ({
            name: li.description || li.price?.product,
            quantity: li.quantity,
            price: li.amount_total,
          }));
        }
      } catch {
        // keep empty
      }

      const [order] = await db
        .insert(shopOrders)
        .values({
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email || "unknown",
          customerName: session.customer_details?.name || "unknown",
          customerPhone: session.customer_details?.phone || null,
          items: items.length > 0 ? items : session.metadata?.order_items || "[]",
          totalAmount: session.amount_total || 0,
          status: "confirmed",
        })
        .returning();

      res.json({ order });
    } catch (error: any) {
      console.error("Failed to retrieve/save order from session:", error);
      res.status(500).json({ error: "Failed to retrieve order" });
    }
  });

  // Admin login
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }
    const token = generateToken(password);
    if (!token) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.json({ token });
  });

  // ─── Admin Product CRUD ───

  // List all products (admin — includes inactive)
  app.get("/api/admin/products", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const products = await db
        .select()
        .from(shopProducts)
        .orderBy(asc(shopProducts.sortOrder));
      res.json({ products });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Create product
  app.post("/api/admin/products", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { name, description, price, image, imageData, sizes, colors, active, sortOrder, printerNotes } = req.body;
      if (!name || price == null) {
        return res.status(400).json({ error: "Name and price are required" });
      }
      let resolvedImageData = imageData || null;
      if (!resolvedImageData && image) {
        const filename = image.replace("/uploads/", "");
        const localPath = path.resolve("uploads", filename);
        if (fs.existsSync(localPath)) {
          const buf = fs.readFileSync(localPath);
          const ext = path.extname(filename).toLowerCase();
          const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";
          resolvedImageData = `data:${mime};base64,${buf.toString("base64")}`;
        }
      }
      const [product] = await db
        .insert(shopProducts)
        .values({
          name,
          description: description || null,
          price: Number(price),
          image: image || null,
          imageData: resolvedImageData,
          sizes: sizes || null,
          colors: colors || null,
          active: active !== false,
          sortOrder: sortOrder ?? 0,
          printerNotes: printerNotes || null,
        })
        .returning();
      res.json({ product });
    } catch (error) {
      console.error("Failed to create product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Update product
  app.patch("/api/admin/products/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const updates: Record<string, any> = {};
      const allowed = ["name", "description", "price", "image", "imageData", "sizes", "colors", "active", "sortOrder", "printerNotes"];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          if (key === "price" || key === "sortOrder") {
            updates[key] = Number(req.body[key]);
          } else {
            updates[key] = req.body[key];
          }
        }
      }
      if (updates.image && !updates.imageData) {
        const filename = updates.image.replace("/uploads/", "");
        const localPath = path.resolve("uploads", filename);
        if (fs.existsSync(localPath)) {
          const buf = fs.readFileSync(localPath);
          const ext = path.extname(filename).toLowerCase();
          const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".gif" ? "image/gif" : "image/jpeg";
          updates.imageData = `data:${mime};base64,${buf.toString("base64")}`;
        }
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }
      const [product] = await db
        .update(shopProducts)
        .set(updates)
        .where(eq(shopProducts.id, id))
        .returning();
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ product });
    } catch (error) {
      console.error("Failed to update product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/admin/products/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const [deleted] = await db
        .delete(shopProducts)
        .where(eq(shopProducts.id, id))
        .returning();
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/uploads/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const imagePath = `/uploads/${filename}`;
      const [product] = await db
        .select({ imageData: shopProducts.imageData })
        .from(shopProducts)
        .where(eq(shopProducts.image, imagePath))
        .limit(1);
      if (product?.imageData) {
        const matches = product.imageData.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], "base64");
          res.set("Content-Type", mimeType);
          res.set("Cache-Control", "public, max-age=31536000");
          return res.send(buffer);
        }
      }
      const localPath = path.resolve("uploads", filename);
      if (fs.existsSync(localPath)) {
        return res.sendFile(localPath);
      }
      res.status(404).json({ error: "Image not found" });
    } catch {
      res.status(500).json({ error: "Failed to serve image" });
    }
  });

  app.post("/api/admin/upload", (req, res) => {
    if (!requireAuth(req, res)) return;
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const filePath = path.resolve("uploads", req.file.filename);
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = req.file.mimetype;
      const base64 = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
      const imagePath = `/uploads/${req.file.filename}`;

      (req as any)._uploadedImageData = { path: imagePath, data: base64 };

      res.json({ path: imagePath, imageData: base64 });
    });
  });

  // ─── Admin Orders ───

  // List orders (admin)
  app.get("/api/admin/orders", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const orders = await db.select().from(shopOrders).orderBy(desc(shopOrders.createdAt));
      res.json({ orders });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Update order status (admin)
  app.patch("/api/admin/orders/:id", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updates: Record<string, any> = {};
      if (status) {
        const parsed = orderStatusSchema.safeParse(status);
        if (!parsed.success) {
          return res.status(400).json({ error: "Invalid status" });
        }
        updates.status = parsed.data;
      }
      if (notes !== undefined) {
        updates.notes = notes;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const [updated] = await db
        .update(shopOrders)
        .set(updates)
        .where(eq(shopOrders.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ order: updated });
    } catch (error) {
      console.error("Failed to update order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Export orders CSV (admin)
  app.get("/api/admin/orders/export", async (req, res) => {
    if (!requireAuth(req, res)) return;
    try {
      const orders = await db.select().from(shopOrders).orderBy(desc(shopOrders.createdAt));

      // Build a map of product printer notes for the export
      const allProducts = await db.select().from(shopProducts);
      const printerNotesMap = new Map<string, string>();
      for (const p of allProducts) {
        if (p.printerNotes) printerNotesMap.set(p.id, p.printerNotes);
      }

      const headers = ["ID", "Date", "Customer Name", "Email", "Phone", "Items", "Total", "Status", "Notes", "Printer Notes"];
      const rows = orders.map((o) => {
        let itemsSummary = "";
        const notesSet = new Set<string>();
        try {
          const items = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
          if (Array.isArray(items)) {
            itemsSummary = items
              .map((i: any) => {
                let desc = `${i.name} x${i.quantity}`;
                if (i.size) desc += ` (${i.size})`;
                if (i.color) desc += ` [${i.color}]`;
                const pn = printerNotesMap.get(i.productId);
                if (pn) notesSet.add(`${i.name}: ${pn}`);
                return desc;
              })
              .join("; ");
          }
        } catch {
          itemsSummary = String(o.items);
        }
        return [
          o.id,
          new Date(o.createdAt).toISOString(),
          `"${(o.customerName || "").replace(/"/g, '""')}"`,
          o.customerEmail,
          o.customerPhone || "",
          `"${itemsSummary.replace(/"/g, '""')}"`,
          (o.totalAmount / 100).toFixed(2),
          o.status,
          `"${(o.notes || "").replace(/"/g, '""')}"`,
          `"${[...notesSet].join("; ").replace(/"/g, '""')}"`,
        ].join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
      res.send(csv);
    } catch (error) {
      console.error("Failed to export orders:", error);
      res.status(500).json({ error: "Failed to export orders" });
    }
  });
}
