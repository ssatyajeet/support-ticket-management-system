# Manual Regression Checklist — Task 5.2.1

**Sprint:** 5.2 — Manual QA & Defect Fix  
**Task:** 5.2.1 — Execute full manual regression  
**Date:** 2026-07-13  
**Tester:** Developer (AI-assisted execution)  
**Environment:** PostgreSQL seeded; API default `http://localhost:3001` (`server/.env.example`); client `http://localhost:5173`  
**Note:** Original 5.2.1 session used `PORT=3000` on the developer machine. Re-run instructions below use the canonical default **3001**.  
**Pre-flight:** `npm run db:seed` + `npm run test` (15/15) before regression  
**Overall result:** **PASS** — 33/33 cases passed (26 API-automated, 7 UI code-review verified)

---

## How to re-run

1. Seed: `cd server && npm run db:seed`
2. Start API: `npm run dev` (note your `PORT` in `.env`)
3. Start client: `cd client && npm run dev`
4. API regression: `API_BASE=http://localhost:3001/api node scripts/regression-521-api.mjs` (or set `API_BASE` to match your `PORT`)
5. UI spot-check: walk sections marked **UI** in browser

---

## Section A — Navigation and layout (FE-01)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| A1 | FE-01 | Open app; use sidebar links Dashboard, All Tickets, Create Ticket | Each route loads without error | **Pass** | UI/CR — routes in `Sidebar.tsx`, `App.tsx` |
| A2 | FE-01 | Navigate to `/tickets/abc` | 404 fallback page | **Pass** | UI/CR — `NotFoundPage` via `path="*"` |
| A3 | FE-01 | Open `/tickets/99999` | Not-found / error on detail | **Pass** | API — `GET /tickets/99999` → 404 `NOT_FOUND` |

---

## Section B — Ticket list (AC-02, TKT-04, FE-08)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| B1 | AC-02 | Go to `/` | Seeded tickets with title, status, priority | **Pass** | API — 5 tickets returned |
| B2 | FE-08 | Reload list page | Brief loading state, then data | **Pass** | UI/CR — `useTickets` + `loading` in `TicketListPage` |
| B3 | SRC-05 | Search `zzznomatchxyz123` | Empty state message | **Pass** | API — empty array; UI shows empty via `showEmpty` |

---

## Section C — Search and filter (AC-10, AC-11, SRC-*, FE-04)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| C1 | AC-10 | Search `vpn` | Matching tickets only (title) | **Pass** | API — VPN ticket returned |
| C2 | AC-10 | Search `home network` | Match in description | **Pass** | API — VPN ticket (description) |
| C3 | SRC-02 | Clear search | Full list returns | **Pass** | API — 5 tickets |
| C4 | AC-11 | Filter status **Open** | Only Open tickets | **Pass** | API — 1 Open ticket |
| C5 | FE-04 | Apply search + filter; refresh browser | URL `?search=` / `?status=` preserved | **Pass** | UI/CR — `useSearchParams` sync in `TicketListPage` |

---

## Section D — Create ticket (AC-01, TKT-01–03, TKT-08)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| D1 | AC-01 | Create ticket with title, description, priority, createdBy | Redirect to detail; ticket saved | **Pass** | API — `POST /tickets` → 201 |
| D2 | TKT-02 | After create, check status | **Open** | **Pass** | API — `status: Open` |
| D3 | TKT-08 | Create without assignee | **Unassigned** on detail | **Pass** | API — `assignedTo: null` |
| D4 | VAL-03 | Submit without title | Inline validation error | **Pass** | API — 400 `VALIDATION_ERROR`; UI `TicketForm` |
| D5 | FE-08 | Submit create form | Button disabled while in flight | **Pass** | UI/CR — `submitting` state in `CreateTicketPage` |

---

## Section E — Detail view (AC-03, TKT-05)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| E1 | AC-03 | Open ticket detail | All fields, names, timestamps, comments | **Pass** | API — detail DTO complete |
| E2 | CMT-04 | View seeded Open ticket comments | Oldest first, author names | **Pass** | API — 2 comments ASC on VPN ticket |

---

## Section F — Edit title and description (AC-04, TKT-06)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| F1 | AC-04 | Edit mode → change title + description → Save | Persists on refresh | **Pass** | API — `PATCH /tickets/:id` |
| F2 | TKT-06 | After save | `updatedAt` changes | **Pass** | API — timestamp updated |

---

## Section G — Ticket Information panel: status (AC-06–08, STS-10)

Uses **ConfirmableSelect** in `TicketInfoPanel` (select → Save/Cancel).

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| G1 | AC-06 | Open ticket → In Progress → Save | Status persists | **Pass** | API — `PATCH .../status` |
| G2 | AC-06 | In Progress → Resolved → Closed | Happy path completes | **Pass** | API — chain 200 |
| G3 | AC-06 | Open ticket → Cancelled → Save | Terminal Cancelled | **Pass** | API — 200 Cancelled |
| G4 | AC-07/08 | On Closed ticket, attempt status change | Rejected / disabled | **Pass** | API — 400 `INVALID_STATUS_TRANSITION` |
| G5 | STS-10 | Open → Resolved (skip) | API error message returned | **Pass** | API — 400 + message |
| G6 | FE-05 | Open ticket status dropdown | Current + valid next only | **Pass** | UI/CR — `getAllowedTransitions` in `TicketInfoPanel` |

---

## Section H — Ticket Information panel: priority and assignee (AC-05, TKT-07)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| H1 | AC-05 | Change assignee → Save | Name updates; status unchanged | **Pass** | API — BR-09 verified |
| H2 | TKT-07 | Set **Unassigned** → Save | Shows Unassigned | **Pass** | API — `assignedTo: null` |
| H3 | AC-04 | Change priority → Save | Persists | **Pass** | API — `priority: Critical` |

---

## Section I — Comments (AC-09, CMT-01, CMT-03)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| I1 | AC-09 | Add comment with author | Appears in list | **Pass** | API — `POST` + `GET` verify |
| I2 | CMT-03 | Comment on **Closed** ticket | Succeeds | **Pass** | API — 201 on closed ticket |

---

## Section J — Dashboard (smoke)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| J1 | — | Open `/dashboard` | Status cards/charts load | **Pass** | API — all 5 statuses in data; UI `DashboardPage` + `ErrorAlert` |

---

## Section K — Error display (ERR-02)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| K1 | ERR-02 | List API failure | `ErrorAlert` visible (no devtools) | **Pass** | UI/CR — `error` from `useTickets` → `ErrorAlert` on list page |

---

## Section L — Persistence & secrets (Task 5.2.2)

**Date:** 2026-07-13  
**Marker ticket ID:** 184  
**Marker title:** `Persistence check 5.2.2 — 2026-07-13`  
**Baseline ticket count:** 6 (5 seeded + 1 marker)  
**API base:** `http://localhost:3001/api` (default; match your `server/.env` `PORT`)

| ID | Ref | Steps | Expected | Result | Notes |
| -- | --- | ----- | -------- | ------ | ----- |
| L1 | AC-12 | Stop/start Express; `GET /tickets/184` | Marker ticket + comment unchanged | **Pass** | Server stopped (PID 41296); restarted; `persistence-522-verify.mjs` pass |
| L2 | DB-09 | Restart PostgreSQL; fetch marker ticket | Data unchanged | **Manual** | `Restart-Service postgresql-x64-17` denied (admin). Marker verified while DB running. **Developer:** restart service via Windows Services, then re-run verify script |
| L3 | AC-12 | List + detail after server restart | Marker visible | **Pass** | API — `inList: true`, detail 200; UI spot-check recommended |
| L4 | FND-02 | `git check-ignore` on `server/.env`, `client/.env` | Both ignored | **Pass** | `.gitignore:5:.env` |
| L5 | AC-14 | `git ls-files` / `git status` | No `.env` tracked or staged | **Pass** | Only `*.env.example` tracked |
| L6 | FND-03 | Review `.env.example` files | Placeholders only | **Pass** | Generic `user:password` + `localhost` URLs |
| L7 | AC-14 | Source scan `server/src`, `client/src` | No hardcoded secrets | **Pass** | `DATABASE_URL` / `VITE_API_URL` from env only |

### L2 manual completion (developer)

```powershell
# Run as administrator, or use services.msc
Restart-Service -Name postgresql-x64-17 -Force
$env:API_BASE='http://localhost:3001/api'
$env:TICKET_ID='184'
node server/scripts/persistence-522-verify.mjs
```

Expect `pass: true`. No `npm run db:seed` or `npm run test` before verifying.

---

## Section M — Edge cases (Task 5.2.3)

**Date:** 2026-07-13  
**Traceability:** EC-01–EC-22 (`requirements-analysis.md` §12)  
**API base:** `http://localhost:3001/api` (default; match your `server/.env` `PORT`)  
**Tier 1:** `cd server && npm run test` (Sprint 5.1 IT)  
**Tier 2:** `API_BASE=http://localhost:3001/api node server/scripts/edge-cases-523-api.mjs`  
**Environment note:** PostgreSQL service `postgresql-x64-17` was **Stopped** during sampling (admin required to start). Tier 2 script and Tier 1 re-run blocked; EC-19 curl executed against live API.

| ID | Scenario | Tier | Result | Notes |
| -- | -------- | ---- | ------ | ----- |
| EC-01 | Closed → any status | 1 + 3 | **Pass** | IT — `Closed → In Progress` → 400 `INVALID_STATUS_TRANSITION` (Sprint 5.1). UI/CR — `TicketInfoPanel` disables status when `isTerminalStatus` (Closed/Cancelled). |
| EC-02 | Cancelled → any status | 1 + 3 | **Pass** | IT — `Cancelled → In Progress/Closed` → 400. UI/CR — same terminal disable in `TicketInfoPanel`. |
| EC-03 | Open → Resolved (skip) | 1 | **Pass** | IT — 400 `INVALID_STATUS_TRANSITION` (Sprint 5.1). |
| EC-04 | In Progress → Closed (skip) | 2 | **Blocked** | Script ready; not executed — PG stopped. Re-run `edge-cases-523-api.mjs` after seed. |
| EC-05 | Resolved → In Progress (revert) | 2 | **Blocked** | Same as EC-04. |
| EC-06 | Empty title or description | 1 + 2 + 3 | **Pass** (partial) | IT — no title → 400 `VALIDATION_ERROR`. UI/CR — `TicketForm.validate()` inline errors for blank title/description. Tier 2 (empty description API) blocked — PG stopped. |
| EC-07 | Invalid priority | 2 | **Blocked** | Script ready; PG stopped. |
| EC-08 | Non-existent user ID | 2 | **Blocked** | Script ready; PG stopped. Expected 404 `NOT_FOUND` per `ticketService.assertUserExists`. |
| EC-09 | Comment on missing ticket | 2 | **Blocked** | Script ready; PG stopped. |
| EC-10 | Empty comment message | 2 | **Blocked** | Script ready; PG stopped. |
| EC-11 | Search no matches | 1 + 3 | **Pass** | 5.2.1 B3 API — empty array. UI/CR — `TicketList` shows "No tickets found". |
| EC-12 | Filter status, zero results | 2 + 3 | **Blocked** (API) / **Pass** (UI/CR) | API script blocked — PG stopped. UI/CR — same `showEmpty` path as EC-11 in `TicketList`. |
| EC-13 | Concurrent status updates | 2 | **Blocked** | Script ready; PG stopped. |
| EC-14 | Unassigned ticket | 1 + 3 | **Pass** | 5.2.1 D3 API — `assignedTo: null`. UI/CR — "Unassigned" in `TicketTable`, `TicketCard`, `UserSelect`. Seed: cancelled ticket unassigned. |
| EC-15 | Over max length | 2 | **Blocked** | Script ready; PG stopped. |
| EC-16 | HTML/special chars (XSS) | 3 | **Pass** (UI/CR) | No `dangerouslySetInnerHTML` in `client/src`. React renders user content as text. **Developer:** spot-check `<b>test</b>` in browser. |
| EC-17 | DB unavailable on startup | 3 | **Manual** | **Developer:** set invalid `DATABASE_URL`, run `npm run dev`, confirm clear console error without secret leak; restore `.env`. |
| EC-18 | Duplicate email in seed | 3 | **Pass** | Schema review — `User.email @unique` in `server/prisma/schema.prisma`. |
| EC-19 | Malformed JSON | 2 + 3 | **Pass** | Fixed Task 5.2.4 — `errorHandler` returns 400 `VALIDATION_ERROR`; IT + curl verified |
| EC-20 | Non-existent ticket GET | 1 | **Pass** | IT — `GET /tickets/99999` → 404 `NOT_FOUND` (Sprint 5.1). |
| EC-21 | `status` on general PATCH | 1 | **Pass** | IT — 400 `STATUS_NOT_ALLOWED_HERE` (Sprint 5.1). |
| EC-22 | Invalid status filter | 1 | **Pass** | IT — `GET /tickets?status=Invalid` → 400 `INVALID_FILTER` (Sprint 5.1). |

### Tier 2 re-run (after PostgreSQL start)

```powershell
# As administrator
Start-Service -Name postgresql-x64-17
cd server
npm run db:seed
$env:API_BASE='http://localhost:3001/api'
node scripts/edge-cases-523-api.mjs
```

### Tier 3 manual completion (developer)

| ID | Step |
| -- | ---- |
| EC-01/02 | Open Closed/Cancelled seeded ticket → status control disabled |
| EC-06 | Create ticket with blank title → inline error |
| EC-11/12 | Search/filter with no matches → empty state |
| EC-14 | View cancelled ticket → "Unassigned" |
| EC-16 | Title `<b>test</b>` → literal text, no HTML execution |
| EC-17 | Invalid `DATABASE_URL` startup log review |

---

## Defects found

None during Task 5.2.1 regression.

**Task 5.2.2:** No code defects. L2 PostgreSQL restart requires manual admin step on this machine.

**Task 5.2.3:** DEF-001 (EC-19 malformed JSON) fixed in Task 5.2.4 — see [`debugging-notes.md`](../debugging-notes.md).

**Blocked (environment):** EC-04–08, EC-09–10, EC-12–13, EC-15 Tier 2 API script — PostgreSQL stopped during sampling. Re-run script after service start + seed.

---

## Traceability

| AC | Covered by |
| -- | ---------- |
| AC-01 | D1–D3 |
| AC-02 | B1 |
| AC-03 | E1 |
| AC-04 | F1, H3 |
| AC-05 | H1 |
| AC-06 | G1–G3 |
| AC-07 | G4 |
| AC-08 | G4, G5 |
| AC-09 | I1 |
| AC-10 | C1–C3 |
| AC-11 | C4 |
| AC-12 | L1, L3 |
| AC-14 | L4–L7 |

---

## Automation reference

API cases executed via [`server/scripts/regression-521-api.mjs`](../server/scripts/regression-521-api.mjs) on 2026-07-13 — **26/26 passed**.

Set `API_BASE` to match your server port (default `http://localhost:3001/api` per `server/.env.example`).
