# Nipomo Soccer Club — Swag Shop Build Brief

## Context

I have an existing website for Nipomo Soccer Club built on Replit. I need to add a swag shop / merchandise store to it. The shop needs to handle quarterly pre-order windows for fan gear, practice jerseys, hoodies, and coaches apparel. Currently we use Venmo + Google Forms which requires painful manual reconciliation. This shop replaces that with an integrated Stripe Checkout flow where the order and the payment are captured together.

Volume: ~100-200 orders per quarter, not high-traffic e-commerce. This is a community youth soccer club.

Tech preferences: Keep it simple. Use what is already in the Replit project where possible. Stripe Checkout Sessions (hosted by Stripe) for payment — we are NOT building a custom payment form.

## Architecture Overview

### Pages to Build

- Shop Page (/shop) — Public-facing product catalog
- Cart / Checkout Flow — Browser-side cart → Stripe Checkout
- Order Confirmation Page (/order-confirmation) — Post-payment success page
- Admin Dashboard (/admin) — Password-protected order management

### Core Flow

Customer browses shop → adds items to cart (with size selection) → clicks Checkout → frontend sends cart to backend → backend creates Stripe Checkout Session with line items → customer is redirected to Stripes hosted checkout page → customer pays → Stripe redirects back to /order-confirmation → Stripe fires webhook to backend with order details → backend stores complete order record (items + payment + customer info) → admin views orders in dashboard, marks as delivered when fulfilled

## Product Catalog

### Line 1: Rise Practice Shirts
- Type: Tri-blend t-shirt
- Sizes: Youth S, M, L, XL
- Colors: Black, Burgundy (two separate products or variants)
- Price: $25 placeholder
- Note: May also be distributed via registration — include in shop as optional purchase

### Line 2: Reign Practice Jerseys
- Type: Dry-fit jersey
- Sizes: Youth S, M, L, XL
- Colors: Black, Burgundy/Red, White (three separate products)
- Price: $30 placeholder
- Note: Logo on front chest, single-color treatment

### Line 3: Wall Ball Champions Club Shirts
- Type: Dry-fit shirt
- Sizes: Custom (only 3 shirts — Johnny provides exact sizes)
- Price: $25 placeholder
- Note: Micro-batch, include as hidden/invite-only product or skip for now

### Line 4: Sideline Siblings Collection
- Item A: Tri-blend t-shirt ($20 placeholder)
- Item B: Hoodie ($35 placeholder)
- Sizes: Youth/Kid sizes (2T, 3T, 4T, YXS, YS, YM, YL)
- Design: Sideline Sibling + I am Just Here for the Snacks with Reign logo

### Line 5: Limited Edition Fan T-Shirt
- Type: Tri-blend t-shirt
- Sizes: Youth S, M, L, XL AND Adult S, M, L, XL, 2XL
- Price: $28 placeholder
- Note: New design each quarter. Only one active design at a time. When ordering window closes, this product is no longer available until next quarter drop.

### Line 6: Standard Club Hoodies
- Item A: Black hoodie with Reign logo centered
- Item B: Burgundy hoodie
- Sizes: Youth S, M, L, XL AND Adult S, M, L, XL, 2XL
- Price: $40 placeholder

### Line 7: Coaches Gear
- Item A: Coaches t-shirt(s) — 1-2 options, tri-blend, adult sizing ($25 placeholder)
- Item B: Coaches zip-up hoodie, adult sizing ($50 placeholder)
- Sizes: Adult S, M, L, XL, 2XL
- Note: Start with public visibility

## Technical Spec

### Frontend — Shop Page

- Display products in a clean grid/card layout
- Each product card shows: product image, name, price, available colors (if multiple), and a size selector dropdown
- Add to Cart button on each card
- Cart icon/indicator in the nav showing item count
- Cart drawer or page showing all items, sizes, quantities, line totals, and a grand total
- Ability to update quantity or remove items from cart
- Checkout button that triggers the Stripe flow
- Pre-order deadline: Display a countdown banner or date. After the deadline, disable the checkout button and show Pre-order window closed — check back next quarter!
- The deadline date should be configurable (env variable or admin setting)

### Frontend — Cart

- Cart state lives in the browser (localStorage or React state, whatever fits the existing stack)
- Each cart item stores: productId, name, size, color (if applicable), quantity, unitPrice
- Cart persists across page navigation but does not need to persist across sessions (though localStorage would be nice)

### Backend — Stripe Checkout

- When customer clicks Checkout, frontend POSTs cart contents to backend endpoint POST /api/create-checkout-session
- Backend validates cart, builds array of Stripe line items, creates Stripe Checkout Session
- Prices are defined on the backend, not sent from the client — prevents price tampering
- Return the session URL to the frontend, which redirects the customer to it

### Backend — Webhook

- Set up Stripe webhook endpoint POST /api/webhook for checkout.session.completed events
- Extract full order details (line items, customer email, amount paid, session ID)
- Store order in database with status: paid
- Stripe webhook secret stored as env variable STRIPE_WEBHOOK_SECRET

### Backend — Order Storage

- Use whatever database is already in the Replit project (Replit DB, SQLite, or JSON file store)
- Each order record includes:
  - orderId (unique, generated)
  - stripeSessionId
  - customerEmail
  - customerName (from Stripe checkout)
  - items (array: productName, size, color, quantity, unitPrice)
  - totalAmount
  - status (paid | processing | delivered)
  - createdAt (timestamp)
  - notes (optional, for admin use)

## Admin Dashboard (/admin)

- Password-protected (simple password gate — store password hash in env variable)
- Table view of all orders, sortable by date, status
- Filter by status: All / Paid / Processing / Delivered
- Click an order to see full details
- Ability to update order status
- Summary stats: total orders, total revenue, orders by status
- Export: Button to download all orders as CSV
- Optional: Search by customer name or email

## Pre-Order Window Logic

- Store ordering deadline as config variable (date/time)
- If before deadline: shop is active, checkout works, show countdown
- If after deadline: shop displays products for browsing but checkout is disabled, show Pre-order window closed message
- Admin should be able to update deadline without redeploying

## Environment Variables / Replit Secrets Needed

- STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
- STRIPE_WEBHOOK_SECRET=whsec_...
- ADMIN_PASSWORD=... (for admin dashboard access)
- SHOP_DEADLINE=2026-04-15T23:59:59Z (pre-order cutoff date)

## Design Notes

- Match the existing sites look and feel (colors, fonts, layout patterns)
- Club colors: Burgundy (#6B1D2A), Black (#333333), with gold/cream accents
- Keep it clean and mobile-friendly — most parents will order from their phones
- Product images will be added later (use placeholder images for now)
- The shop should feel professional but not over-engineered

## What to Build First (Priority Order)

1. Product catalog page with hardcoded products (get the layout right)
2. Cart functionality (add/remove/update items with size selection)
3. Stripe Checkout integration (backend session creation + redirect)
4. Webhook handler (receive payment confirmation, store orders)
5. Order confirmation page (thank you + order summary)
6. Admin dashboard (view orders, update status, export CSV)
7. Pre-order deadline logic (countdown + auto-disable)

## Testing

- Use Stripe test mode (sk_test_...) during development
- Test card: 4242 4242 4242 4242, any future expiry, any CVC
- Verify full flow: add items → checkout → pay → webhook fires → order appears in admin
- Test edge cases: empty cart checkout, deadline passed, duplicate webhook delivery

## Files to NOT Touch

- Do not modify existing pages/routes on the site unless necessary for navigation integration
- Add the shop as new routes/pages alongside existing content
- Add a Shop link to the existing site navigation

## Questions to Ask Me

If you need clarity, ask about:
- The existing tech stack / framework in use
- Database setup
- Existing authentication patterns
- Where product images will come from
- Specific product pricing once finalized
