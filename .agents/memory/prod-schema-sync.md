---
name: Production schema sync on Replit
description: The only supported way to apply dev schema changes to the production database
---

# Syncing schema to the production database

Replit applies schema changes to production **only** via the Publish flow. On publish it
diffs dev vs prod, asks the user to confirm any renames in the Publish UI, and applies the
diff to production.

**Rule:** Never run DDL directly against prod, never write a migration script targeting
prod, never add deploy-build `db:push` hooks or startup-time DDL. The correct flow is:
change `shared/schema.ts`, run `npm run db:push` (dev), verify, then tell the user to
re-publish.

**Why:** Direct prod DDL and deploy/startup migrations are unsafe (run on every release,
risk data loss). The publish-time diff is the only path Replit supports and protects live
data via rename confirmation.

**How to apply:** When prod shows "relation/column does not exist", the answer is
re-publish -- not a script. New tables (not renames) sync with no prompts and no data risk.
