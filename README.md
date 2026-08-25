
**A civic accountability platform for South African communities.**

Report a pothole, water leak, or power outage in your street. Get a tracking code. Watch your ward councillor respond — publicly, on the record. Rate whether it actually got fixed.

*Built by Team Binary Brains. See the [pitch deck](./BinaryBrains_Pitch.pptx) for the full concept, business model, and rollout plan.*

---

## The Problem

Residents in South Africa currently report service delivery issues — potholes, water leaks, power outages, faulty infrastructure — through fragmented, informal channels: phone calls, WhatsApp groups, word of mouth. This creates real, measurable failures:

- **No transparency.** Once you report something, there's no way to check what's actually happening with it.
- **No accountability.** There's no public record of how fast — or whether — a ward or municipality responds.
- **No collective voice.** Communities have no way to validate the quality of work once something is "fixed," or to demand change when it isn't.

Meanwhile, most South African municipalities are financially distressed — 62 currently carry Auditor-General "going concern" warnings, and only 15% achieved a clean audit in 2024/25. Any solution that depends on municipalities paying for it, or having spare capacity to adopt complex new systems, is starting from an unrealistic assumption.

## What Civix Does

Civix gives residents and their ward councillor a shared, public record for exactly one thing: **did this get fixed, and how long did it take.**

**The core loop:**

```
Report an issue  →  Get a tracking code  →  Ward responds & updates status  →  Community rates the outcome
```

- **Residents** report issues with a photo, an auto-detected address and ward, and a short description — no account setup friction beyond a simple sign-up.
- **Every report gets a unique, tamper-proof tracking code** (e.g. `WD1576-8842`), generated server-side the moment it's submitted, so residents can follow their own report's status over time.
- **Ward-level transparency**: every report is publicly visible on the "My Ward" board — not hidden in a private ticket only the reporter can see.
- **Community feedback**: once marked resolved, residents can validate whether the work was actually done and done well.

This isn't built to replace municipal systems — it's built to sit on top of the reality residents already face: fragmented reporting, no follow-up, no accountability. See the [pitch deck](./BinaryBrains_Pitch.pptx) for the full business case, monetization model (deliberately not dependent on municipal budgets), and phased rollout strategy starting with a single pilot ward.

## How It Works

| Step | What happens |
|---|---|
| 1. Register | Resident signs up with their address — their ward is auto-detected from it (Google Places + point-in-boundary matching) |
| 2. Report | Photo, category, address (autocomplete or "use current location"), description |
| 3. Track | An auto-generated tracking code lets the resident follow the report's status over time |
| 4. Respond | The ward councillor sees it on their dashboard, prioritized by how many people reported the same issue, and updates its status |
| 5. Close the loop | Resident sees the status change and can validate whether it was actually resolved |

## Features

| Feature | Status |
|---|---|
| Resident registration & login, with auto-detected ward | ✅ Working |
| Report an issue (photo, category, description) | ✅ Working |
| Address autocomplete + auto-detected ward (Google Places) | ✅ Working — needs a Google API key |
| Auto-generated tracking code per report | ✅ Working (Postgres trigger, not client-side) |
| "Use current location" → auto-filled real address | ✅ Working (reverse geocoding) |
| My Reports — track your own submissions | ✅ Working |
| Ward community board (post + read) | ✅ Working |
| Ward councillor dashboard (view, prioritize, resolve reports) | 🚧 In progress |
| Upvote/downvote on resolved reports | 🚧 Database ready, UI not built |
| Report flagging / moderation | 🚧 Database ready, UI not built |
| Duplicate-report clustering | ⏳ Not started (see Roadmap) |

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Backend:** Supabase (Postgres, Auth, Storage, Row-Level Security) — no separate API server. Server-side logic (like tracking-code generation) runs as Postgres triggers instead of API endpoints.
- **Address & location:** Google Places API (New) + Geocoding API
- **Hosting:** Vercel (frontend) — Supabase hosts the database/auth/storage
