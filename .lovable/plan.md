
## Goal

Ship four production-ready systems on top of the existing PBTW platform without breaking auth, booking, or dashboards. New admin: `skyluper@gmail.com` (granted in Slice 1).

---

## Slice 1 — Driver Partner Application + Admin Review

**DB migration**
- `driver_applications` table (user_id, full_name, mobile, email, address, vehicle_number, vehicle_type enum, aadhaar_number, pan_number, aadhaar_url, pan_url, dl_url, rc_url, terms_accepted_at, status enum: pending/approved/rejected/suspended, review_note, reviewed_by, reviewed_at).
- `customer_terms_acceptances` table (user_id, accepted_at, version).
- Add `terms_accepted_at` column to `profiles`.
- RLS: applicants see/insert own; admins read/update all.
- Storage bucket `driver-docs` (private), policies: user uploads to own folder, admins read all.

**Routes**
- `/become-driver` — public form (after auth) with file uploads, mandatory T&C checkbox, validation (Zod).
- `/_authenticated/admin/drivers` — admin-only list, document viewer, Approve / Reject / Suspend with note.
- Update `/auth` signup flow to require T&C checkbox + record acceptance.

**Notifications row inserted on status change.**

---

## Slice 2 — HydraAssist Floating Chatbot (Lovable AI)

- Server route `src/routes/api/chat.ts` streaming via Gemini (Lovable AI Gateway).
- Floating `<HydraAssist />` mounted in `__root.tsx`, bottom-right, open/close animation.
- Quick actions: Book Tanker, Track Order, Become Driver, Wallet, Contact.
- System prompt with PBTW context (pricing, coverage, contact).
- Persist last session to localStorage (no DB — one conversation per browser).

---

## Slice 3 — Live GPS Tracking + Driver↔Customer Chat

**DB**
- `driver_locations` (driver_id, lat, lng, heading, updated_at) — realtime enabled, last-write-wins.
- `chat_messages` (order_id, sender_id, sender_role, body, read_at, created_at) — realtime + RLS scoped to order participants.

**Driver portal updates**
- "Go Online" requires `navigator.geolocation` permission; streams every 10s while online + order is active.
- Chat panel per active order.

**Customer dashboard updates**
- Live map on Track tab showing driver marker + ETA (haversine / Google distance).
- Chat panel mirroring driver.

---

## Slice 4 — Wallet Recharge with Admin Approval + Invoices on Every Order

**DB**
- `wallet_recharge_requests` (user_id, amount, screenshot_url, upi_ref, status, reviewed_by, reviewed_at, note).
- Storage bucket `wallet-screenshots` (private).
- Invoices: generate on `delivered` status (already partial in driver flow) — extend to ALL completed orders + downloadable PDF link (server function using `pdf-lib`).

**Routes**
- `/_authenticated/wallet/recharge` — upload screenshot + UPI ref.
- `/_authenticated/admin/recharges` — approve/reject, credits wallet on approve.
- "Download Invoice" button on Customer dashboard Invoices tab.

---

## Out of scope (explicitly deferred)
- Phone OTP login (email + Google already work).
- SMS notifications.
- Full README rewrite (will note key env vars only).
- Rate limiting middleware (left to Cloudflare defaults).

## Execution
Slice 1 ships this turn. After you confirm it works, I'll move to Slice 2, then 3, then 4. Each slice is independently mergeable.
