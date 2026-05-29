---
name: connect-pg-simple in bundled production
description: Why session-store auto-create fails in the deployed build and the correct fix
---

# connect-pg-simple `createTableIfMissing` fails in bundled prod

In production, magic-link/session login failed with:
`ENOENT: no such file or directory, open '/home/runner/workspace/dist/table.sql'`
thrown from connect-pg-simple's `_rawEnsureSessionStoreTable`.

**Rule:** Do not rely on `createTableIfMissing: true`. Define the session table in the
Drizzle schema (`shared/schema.ts`) so it is created by `db:push` (dev) and applied to
prod on publish. Set `createTableIfMissing: false`.

Table shape connect-pg-simple expects: `sid varchar PRIMARY KEY`, `sess jsonb`,
`expire timestamp`, plus an index on `expire`.

**Why:** The esbuild server bundle includes JS only, not connect-pg-simple's bundled
`table.sql` asset. So auto-create works in dev (tsx reads node_modules) but crashes in the
deployed `dist/` build. The crash happened *after* the magic token was already consumed,
so the second click reported "expired" -- masking the real session-store failure.

**How to apply:** Any Replit deploy using a pg-backed session store must provision the
session table via schema/migrations, never via runtime auto-create.
