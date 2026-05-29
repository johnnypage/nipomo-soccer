# Phase 1: Family Auth & Data Foundation - Pattern Map

**Mapped:** 2026-05-28
**Files analyzed:** 12 new/modified files
**Analogs found:** 12 / 12

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `shared/schema.ts` | model | CRUD | `shared/schema.ts` (self -- extend) | exact |
| `shared/challengeValidation.ts` | utility | transform | `shared/shopValidation.ts` | exact |
| `server/index.ts` | config | request-response | `server/index.ts` (self -- modify) | exact |
| `server/challengeAuth.ts` | middleware | request-response | `server/auth.ts` | role-match |
| `server/challengeRoutes.ts` | controller | CRUD + request-response | `server/coachRoutes.ts` | exact |
| `client/src/pages/challenge/signup.tsx` | component | request-response | `client/src/pages/TeamPlacement.tsx` | role-match |
| `client/src/pages/challenge/index.tsx` | component | request-response | `client/src/pages/TeamPlacement.tsx` | role-match |
| `client/src/hooks/use-auth.tsx` | hook | request-response | `client/src/lib/queryClient.ts` | role-match |
| `client/src/hooks/use-active-kid.tsx` | provider | transform | `client/src/hooks/use-cart.tsx` | exact |
| `client/src/components/challenge/KidSelector.tsx` | component | transform | `client/src/components/Header.tsx` | partial |
| `client/src/components/challenge/AddKidForm.tsx` | component | request-response | `client/src/pages/TeamPlacement.tsx` | role-match |
| `client/src/components/challenge/SignupForm.tsx` | component | request-response | `client/src/pages/TeamPlacement.tsx` | role-match |

## Pattern Assignments

### `shared/schema.ts` (model, CRUD) -- MODIFY

**Analog:** `shared/schema.ts` (extend existing file)

**Imports pattern** (lines 1-4):
```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
```

**Table definition pattern** (lines 6-10, representative example):
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

**Insert schema + type export pattern** (lines 12-18, representative example):
```typescript
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
```

**Key conventions to follow:**
- UUID primary keys via `varchar("id").primaryKey().default(sql\`gen_random_uuid()\`)`
- `timestamp("created_at").defaultNow().notNull()` for creation timestamps
- `createInsertSchema` with `.omit()` or `.pick()` for insert validation
- Exported types: `InsertX` (from schema) and `X` (from `$inferSelect`)
- Column naming: snake_case in DB, camelCase in TypeScript (Drizzle auto-maps)
- `boolean` columns use `.notNull().default(false)` or `.default(true)`
- No `references()` on existing FK columns (e.g., `coachAssignments.divisionId` uses `text` not FK) -- but new tables CAN use `.references()` since RESEARCH.md shows it

---

### `shared/challengeValidation.ts` (utility, transform) -- NEW

**Analog:** `shared/shopValidation.ts`

**Full file pattern** (lines 1-27):
```typescript
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
```

**Key conventions to follow:**
- Plain Zod schemas (not drizzle-zod) for API-specific validation
- Schema and inferred type exported side-by-side
- `z.enum()` for string union types
- File is small, focused, and shared between client and server

---

### `server/index.ts` (config, request-response) -- MODIFY

**Analog:** `server/index.ts` (self -- modify to add session middleware)

**Middleware setup zone** (lines 17-25) -- session middleware goes AFTER these:
```typescript
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));
```

**Route registration** (line 65) -- session middleware goes BEFORE this:
```typescript
await registerRoutes(httpServer, app);
```

**Error handler pattern** (lines 67-73):
```typescript
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  throw err;
});
```

**Key conventions to follow:**
- Session middleware MUST go between body parsers (line 25) and `registerRoutes` (line 65)
- Existing `declare module "http"` augmentation pattern (lines 11-15) -- use same style for `declare module "express-session"`
- The `log()` function (lines 27-36) is the project's logging convention
- Trust proxy needed for Replit: `app.set("trust proxy", 1)` before session setup

---

### `server/challengeAuth.ts` (middleware, request-response) -- NEW

**Analog:** `server/auth.ts`

**Auth middleware pattern** (lines 31-42):
```typescript
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
```

**Key conventions to follow:**
- Existing admin auth returns a boolean and caller does `if (!requireAuth(req, res)) return;`
- Family auth will use a different mechanism (session-based, not Bearer token) but should follow the same error response shape: `{ error: "..." }`
- Import types: `import type { Request, Response } from "express";`
- New middleware can use Express `NextFunction` pattern (more standard) since it's a separate auth system

---

### `server/challengeRoutes.ts` (controller, CRUD + request-response) -- NEW

**Analog:** `server/coachRoutes.ts` (primary), `server/shopRoutes.ts` (secondary for SendGrid)

**Route file structure pattern** (coachRoutes.ts lines 1-6):
```typescript
import type { Express } from "express";
import { db } from "./db";
import { divisions, coachAssignments, coachApplications } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "./auth";
```

**Seed data + seed function pattern** (coachRoutes.ts lines 7-26):
```typescript
const DIVISION_SEED = [
  { ageGroup: "prek", gender: "coed", headCoachesNeeded: 8, sortOrder: 0 },
  { ageGroup: "g12", gender: "girls", headCoachesNeeded: 6, sortOrder: 1 },
  // ... more rows
];

async function seedDivisionsIfEmpty() {
  const existing = await db.select({ id: divisions.id }).from(divisions).limit(1);
  if (existing.length > 0) return;
  await db.insert(divisions).values(DIVISION_SEED.map((d) => ({ ...d, active: true })));
  console.log("Seeded 11 divisions");
}
```

**Route registration + seed call pattern** (coachRoutes.ts lines 28-29):
```typescript
export function registerCoachRoutes(app: Express) {
  seedDivisionsIfEmpty().catch((e) => console.error("Division seed error:", e));
```

**Public GET route pattern** (coachRoutes.ts lines 31-59):
```typescript
app.get("/api/coaching-board", async (_req, res) => {
  try {
    const allDivisions = await db
      .select()
      .from(divisions)
      .where(eq(divisions.active, true))
      .orderBy(divisions.sortOrder);
    // ... data transformation ...
    res.json({ divisions: grouped });
  } catch (error) {
    console.error("Coaching board error:", error);
    res.status(500).json({ error: "Failed to load coaching board" });
  }
});
```

**Admin-protected route pattern** (coachRoutes.ts lines 61-74):
```typescript
app.get("/api/admin/coach-applications", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
    // ... query ...
    res.json(results);
  } catch (error) {
    console.error("List applications error:", error);
    res.status(500).json({ error: "Failed to load applications" });
  }
});
```

**POST with body validation pattern** (routes.ts lines 96-104):
```typescript
app.post("/api/tournament-interest", async (req, res) => {
  try {
    const parseResult = insertTournamentInterestSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const { clubName, contactName, email, phone, divisions, teamCount, notes } = parseResult.data;
```

**SendGrid email pattern** (shopRoutes.ts lines 6, 13, 96-101):
```typescript
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

// ... inside function:
await sgMail.send({
  to: order.customerEmail,
  from: { email: fromEmail, name: "Nipomo Soccer Shop" },
  subject: "Your Nipomo SC Order is Confirmed!",
  html,
});
```

**Route registration call** (routes.ts lines 23-25):
```typescript
registerShopRoutes(app);
registerCoachRoutes(app);
registerPlacementRoutes(app);
```

**Key conventions to follow:**
- Each domain gets its own `register{X}Routes(app: Express)` function
- Called from `routes.ts` `registerRoutes()` function
- Seed function is async, called at top of `register*` function with `.catch(console.error)`
- Error pattern: `try/catch` with `console.error` then `res.status(500).json({ error: "..." })`
- Zod `.safeParse()` for input validation on POST routes
- Success responses: `res.json({ data })` or `res.json({ success: true })`

---

### `client/src/pages/challenge/signup.tsx` (component, request-response) -- NEW

**Analog:** `client/src/pages/TeamPlacement.tsx`

**Page component structure** (TeamPlacement.tsx lines 1-6, 24, 137-140, 455-457):
```typescript
import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

export default function TeamPlacement() {
  // ...
  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* content */}
      </main>
      <Footer />
    </div>
  );
}
```

**Form submission pattern** (TeamPlacement.tsx lines 68-131):
```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault();

  // validation checks with toast
  if (!requestType) {
    toast({ title: "Please select a request type", variant: "destructive" });
    return;
  }

  setSubmitting(true);
  try {
    const body: Record<string, any> = { /* ... */ };

    const res = await fetch("/api/placement-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Submission failed");
    }

    setSubmitted(true);
  } catch (err: any) {
    toast({ title: err.message || "Something went wrong", variant: "destructive" });
  } finally {
    setSubmitting(false);
  }
}
```

**Success state pattern** (TeamPlacement.tsx lines 141-164):
```typescript
{submitted ? (
  <div className="text-center py-16">
    <div className="w-16 h-16 rounded-full bg-risegreen/20 text-risegreen flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-8 h-8" />
    </div>
    <h1 className="font-display text-4xl uppercase tracking-wide text-warmwhite mb-3">Request Received</h1>
    <p className="text-warmwhite/55 max-w-md mx-auto mb-8">
      {/* success message */}
    </p>
  </div>
) : (
  /* form content */
)}
```

**Input styling convention** (TeamPlacement.tsx line 135):
```typescript
const inputClasses = "w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold";
```

**Key conventions to follow:**
- Tailwind classes on the dark theme: `bg-night`, `text-warmwhite`, `text-warmwhite/55`, `border-warmwhite/12`
- Brand colors: `bg-crimson`, `text-gold`, `border-gold`, `bg-gold/10`
- Font display class: `font-display` for headlines, `uppercase tracking-wide`
- Submit button: `bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark`
- Toast for validation errors: `toast({ title: "...", variant: "destructive" })`
- `Header` + `Footer` wrap every page
- max-w-2xl centered layout for form pages
- NOTE: This page uses raw `useState` for form state. The challenge forms should use React Hook Form + Zod resolver (as documented in CONTEXT.md) since that pattern is already installed.

---

### `client/src/pages/challenge/index.tsx` (component, request-response) -- NEW

**Analog:** `client/src/pages/TeamPlacement.tsx` (layout), `client/src/hooks/use-cart.tsx` (context consumption)

Uses the same page layout pattern as signup.tsx above. Additionally consumes context:

**Context consumption pattern** (Header.tsx lines 12-13, 23):
```typescript
import { useCart } from "@/hooks/use-cart";
// inside component:
const { totalItems } = useCart();
```

**Key conventions to follow:**
- Same `<Header />` + `<Footer />` wrapper
- Uses TanStack Query for data fetching (see `queryClient.ts` patterns below)
- Will consume `useAuth()` and `useActiveKid()` hooks
- Conditional rendering based on auth state and kid data

---

### `client/src/hooks/use-auth.tsx` (hook, request-response) -- NEW

**Analog:** `client/src/lib/queryClient.ts`

**Query function with 401 handling** (queryClient.ts lines 27-42):
```typescript
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
```

**API mutation helper** (queryClient.ts lines 10-24):
```typescript
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}
```

**Key conventions to follow:**
- `credentials: "include"` is already set on all fetch calls -- cookie auth works automatically
- Use `getQueryFn({ on401: "returnNull" })` for the auth check query (`GET /api/auth/me`) so unauthenticated users get `null` instead of an error
- Use `apiRequest` for mutations (POST /api/auth/signup, POST /api/kids)
- TanStack Query default config (queryClient.ts lines 44-57): `staleTime: Infinity`, `retry: false`, `refetchOnWindowFocus: false`
- Auth hook should override `staleTime` for the `/api/auth/me` query to enable refetch on window focus

---

### `client/src/hooks/use-active-kid.tsx` (provider, transform) -- NEW

**Analog:** `client/src/hooks/use-cart.tsx`

**Context + Provider + Hook pattern** (use-cart.tsx lines 1-100):
```typescript
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  // ... more methods
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  // ... state management logic

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
```

**Provider wiring in App.tsx** (App.tsx lines 42-53):
```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
```

**Key conventions to follow:**
- Context initialized with `null`, hook throws if used outside provider
- Provider wraps `children` in App.tsx at the appropriate nesting level
- Hook name matches file name: `use-cart.tsx` exports `useCart()`
- ActiveKidProvider should be nested inside AuthProvider (needs kid data from auth query)
- Local storage used in cart for persistence -- active kid should NOT use localStorage (session-scoped)

---

### `client/src/components/challenge/KidSelector.tsx` (component, transform) -- NEW

**Analog:** `client/src/components/Header.tsx` (partial -- for persistent top-level UI component pattern)

**Persistent UI component pattern** (Header.tsx lines 1-14):
```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
```

**Key conventions to follow:**
- Uses Radix UI primitives (Select component for dropdown, already installed)
- Framer Motion for transitions (already installed)
- Consumes `useActiveKid()` context
- Pinned at top of /challenge/* pages (not in global Header -- it's challenge-specific)

---

### `client/src/components/challenge/AddKidForm.tsx` (component, request-response) -- NEW

**Analog:** `client/src/pages/TeamPlacement.tsx` (form fields pattern)

**Form field pattern** (TeamPlacement.tsx lines 234-283):
```typescript
<div className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-warmwhite/70 text-sm mb-1.5">Your name</label>
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className={inputClasses}
      />
    </div>
    <div>
      <label className="block text-warmwhite/70 text-sm mb-1.5">Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={inputClasses}
      />
    </div>
  </div>
</div>
```

**Key conventions to follow:**
- Should use React Hook Form + Zod resolver instead of raw useState (upgrade from TeamPlacement pattern)
- Repeating field group for multi-kid ("add another kid" button, per D-04)
- `inputClasses` convention for consistent input styling
- Grid layout for side-by-side fields on desktop

---

### `client/src/components/challenge/SignupForm.tsx` (component, request-response) -- NEW

**Analog:** `client/src/pages/TeamPlacement.tsx` (form pattern)

Uses same patterns as AddKidForm above. Additionally:

**Checkbox pattern** -- use Radix Checkbox (already installed):
```typescript
import { Checkbox } from "@/components/ui/checkbox";
// Per D-05: consent checkbox required before magic link send
```

---

### Client Routing (in `client/src/App.tsx`) -- MODIFY

**Analog:** `client/src/App.tsx` (self)

**Existing route registration pattern** (App.tsx lines 21-39):
```typescript
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reign" component={Reign} />
      <Route path="/rise" component={Rise} />
      <Route path="/roots" component={RootsPage} />
      {/* ... more routes ... */}
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

**Nested route pattern** (from RESEARCH.md, Wouter v3 `nest` prop):
```typescript
<Route path="/challenge" nest>
  <Switch>
    <Route path="/">
      <ChallengeHub />     {/* /challenge */}
    </Route>
    <Route path="/signup">
      <ChallengeSignup />  {/* /challenge/signup */}
    </Route>
  </Switch>
</Route>
```

**Provider nesting in App** (App.tsx lines 42-53):
```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
```

---

## Shared Patterns

### Error Handling (Server)
**Source:** `server/coachRoutes.ts` lines 31-59, `server/shopRoutes.ts` lines 211-236
**Apply to:** All route handlers in `challengeRoutes.ts`
```typescript
try {
  // ... operation ...
  res.json({ /* result */ });
} catch (error) {
  console.error("Descriptive error:", error);
  res.status(500).json({ error: "Failed to {action}" });
}
```

### Error Handling (Client)
**Source:** `client/src/pages/TeamPlacement.tsx` lines 89-131
**Apply to:** All client form submissions
```typescript
try {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Submission failed");
  }
  // success
} catch (err: any) {
  toast({ title: err.message || "Something went wrong", variant: "destructive" });
}
```

### SendGrid Email Template
**Source:** `server/shopRoutes.ts` lines 46-101, `server/placementRoutes.ts` lines 16-50
**Apply to:** `server/challengeRoutes.ts` (magic link email)
```typescript
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const fromEmail = process.env.SENDGRID_FROM_EMAIL || "admin@nipomosc.org";

await sgMail.send({
  to: email,
  from: { email: fromEmail, name: "Nipomo Soccer" },
  subject: "Subject here",
  html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4ede1; padding:32px 0;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
          <tr><td style="background-color:#8B1D24; padding:24px 32px;">
            <p style="margin:0;color:#F4EDE1;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Nipomo Soccer</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;">Title</h1>
          </td></tr>
          <tr><td style="padding:32px;">
            <!-- content -->
          </td></tr>
        </table>
      </td></tr>
    </table>`,
});
```

### Zod Validation on POST Routes
**Source:** `server/routes.ts` lines 96-104
**Apply to:** All POST endpoints in `challengeRoutes.ts`
```typescript
const parseResult = insertTournamentInterestSchema.safeParse(req.body);
if (!parseResult.success) {
  return res.status(400).json({ error: "All required fields must be filled" });
}
const data = parseResult.data;
```

### Auto-Seed Pattern
**Source:** `server/coachRoutes.ts` lines 21-26 (seedDivisionsIfEmpty), `server/shopRoutes.ts` lines 197-208 (seedProductsIfEmpty)
**Apply to:** `seedChallengesIfEmpty()` in `challengeRoutes.ts`
```typescript
async function seedChallengesIfEmpty() {
  const existing = await db.select({ id: challenges.id }).from(challenges).limit(1);
  if (existing.length > 0) return;
  await db.insert(challenges).values(CHALLENGE_SEED);
  console.log(`Seeded ${CHALLENGE_SEED.length} challenges`);
}

// Called at top of registerChallengeRoutes():
seedChallengesIfEmpty().catch((e) => console.error("Challenge seed error:", e));
```

### Database Access
**Source:** `server/db.ts` (lines 1-9)
**Apply to:** `server/challengeRoutes.ts`
```typescript
import { db } from "./db";
// Pool is not directly exported. For connect-pg-simple, either:
// 1. Export pool from db.ts, OR
// 2. Create a small dedicated pool in index.ts for sessions
```

### Route Registration
**Source:** `server/routes.ts` lines 19-25
**Apply to:** `routes.ts` must be modified to call `registerChallengeRoutes(app)`
```typescript
import { registerChallengeRoutes } from "./challengeRoutes";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  registerShopRoutes(app);
  registerCoachRoutes(app);
  registerPlacementRoutes(app);
  registerChallengeRoutes(app);  // ADD THIS
```

### Page Layout
**Source:** `client/src/pages/TeamPlacement.tsx` lines 137-140, 455-457
**Apply to:** All challenge page components
```typescript
<div className="min-h-screen bg-night">
  <Header />
  <main className="max-w-2xl mx-auto px-4 py-16">
    {/* page content */}
  </main>
  <Footer />
</div>
```

### Tailwind Design Tokens
**Source:** All existing page components
**Apply to:** All challenge UI components
- Dark background: `bg-night`
- Primary text: `text-warmwhite`
- Muted text: `text-warmwhite/55`, `text-warmwhite/70`
- Borders: `border-warmwhite/12`, `border-warmwhite/20`
- Brand accent: `bg-crimson`, `text-crimson`, `hover:bg-crimson-dark`
- Highlight: `text-gold`, `border-gold`, `bg-gold/10`
- Headlines: `font-display text-4xl uppercase tracking-wide text-warmwhite`
- Input: `bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold`
- Submit button: `bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50`

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| (none) | -- | -- | All files have analogs in the existing codebase |

## Metadata

**Analog search scope:** `~/Projects/nipomo-soccer-website/` (server/, shared/, client/src/)
**Files scanned:** 15 (schema.ts, auth.ts, index.ts, db.ts, routes.ts, coachRoutes.ts, shopRoutes.ts, placementRoutes.ts, App.tsx, queryClient.ts, use-cart.tsx, use-toast.ts, Header.tsx, TeamPlacement.tsx, shopValidation.ts)
**Pattern extraction date:** 2026-05-28
