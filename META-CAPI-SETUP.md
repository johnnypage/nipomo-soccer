# Spond → Meta Conversions API forwarder

Sends completed Spond registrations to the Meta pixel as `CompleteRegistration` events,
server-side. There's no pixel on Spond's domain, so without this Meta can only see
click-throughs to Spond, not actual sign-ups. This lets the ad sets eventually optimize
on real registrations.

The **server** hashes all contact fields with SHA-256 before sending — Meta never receives
raw email/phone/name. An admin just uploads the weekly Spond Members export.

## Files

- `server/metaCapi.ts` — pure logic: parse .xlsx/.csv, map rows, hash PII (unit-testable)
- `server/metaCapiRoutes.ts` — admin endpoints + the CAPI POST + dedup ledger writes
- `shared/schema.ts` — `meta_capi_sent` dedup table
- `client/src/pages/MetaCapiManager.tsx` — the "Meta Ads" admin tab
- depends on `exceljs` (added to package.json)

## One-time setup

1. **Set Replit Secrets** (Tools → Secrets):
   - `META_API_TOKEN` — the system-user token (same one in the ops repo `.env`).
     The code also accepts `META_ACCESS_TOKEN`; either name works.
   - `META_PIXEL_ID` — `1509394684211814` (also the built-in default)
2. **Install + migrate** after pulling on Replit:
   ```bash
   npm install            # picks up exceljs
   npm run db:push        # creates the meta_capi_sent table
   ```
3. Republish.

## Weekly use

1. In Spond, export the **Members** list (`.xlsx`).
2. Go to `/admin` → **Meta Ads** tab.
3. **Choose Spond export** → **Preview**. Confirm "New to send" matches the number of
   kids enrolled, and that the matched contact column is **Payment contact email**.
4. First time only: grab a code from **Events Manager → Test events**, paste it into the
   test-event-code box, and click **Send (test)**. Verify the events + match quality land
   in the Test Events tab.
5. Clear the test code and click **Send to Meta** for the real send.

Re-uploading the same (cumulative) Members export each week is safe — the `meta_capi_sent`
ledger skips anyone already sent, and siblings on one parent email each count via a unique
`order_id`.

## Notes

- **One event per registered kid.** Counts each child; doesn't collapse siblings.
- **All programs by default.** The API accepts an optional `groupFilter` form field
  (e.g. `Roots Fall 2026`) to scope to one program; the UI sends all members.
- **PII never leaves the server unhashed**, and uploaded files are deleted from disk right
  after parsing.
- **Dataset-building, not the optimization switch.** Switching the ad sets to optimize on
  `CompleteRegistration` is a separate change, done once enough events accumulate.
