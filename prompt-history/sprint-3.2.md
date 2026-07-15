# Prompt History — Sprint 3.2: Users & Ticket CRUD API

**Date:** 2026-07-09
**Sprint:** 3.2 — Users & Ticket CRUD API
**Status:** Complete
**Tasks covered:** 3.2.1 → 3.2.6
**Traceability:** FR-C-01–08, FR-C-19, BR-15–16, USR-01–04, TKT-01–10, VAL-01–07 (partial), AC-01, AC-04–05, AC-13

---

> **Recovery notice**
> Prompts in this file are **verbatim** — recovered from the Cursor conversation transcript.
> Typos in original prompts are preserved intentionally.
> AI responses are summarized, not pasted in full.

---

## Goal

Deliver read-only users API and full ticket CRUD (create, list, detail, update) with Zod validation, DTO mappers with resolved names, and rejection of `status` on general PATCH.

---

## Tasks Completed

| Task ID | Summary | Outcome |
| ------- | ------- | ------- |
| 3.2.1 | Zod validators | `ticketValidators.ts` — create/update schemas; `STATUS_NOT_ALLOWED_HERE` |
| 3.2.2 | GET /api/users | `userService`, `userController`, `userRoutes` |
| 3.2.3 | Ticket DTO mapper | `toDto()` / `toDetailDto()` with resolved names |
| 3.2.4 | Create + list | `POST /api/tickets`, `GET /api/tickets` |
| 3.2.5 | Detail with comments | `GET /api/tickets/:id` — comments ASC |
| 3.2.6 | Update (no status) | `PATCH /api/tickets/:id` — BR-15 enforced |

---

## Prompts Log

---

### Prompt 1 — Start Sprint 3.2
**Time:** — | **Task:** 3.2.1

**Actual prompt:**

> proceed with Sprint 3.2 in simmalar way we did 3.1

**AI output:**
- Implemented Task 3.2.1 — Zod validators for ticket create/update
- Stopped for developer review

**What I accepted / changed:** Approved validation rules.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 2 — Task 3.2.2
**Time:** — | **Task:** 3.2.2

**Actual prompt:**

> proceed with 3.2.2

**AI output:**
- `userService.list()`, `userController.listUsers`, `userRoutes`
- `GET /api/users` → 200 with 3 seeded users

**What I accepted / changed:** Approved via proceed.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 3 — Task 3.2.3
**Time:** — | **Task:** 3.2.3

**Actual prompt:**

> approved to mark 3.2.2 complete and proceed to Task 3.2.3 — Ticket DTO mapper

**AI output:**
- `ticketService.ts` — DTO types, Prisma includes, `toDto()` / `toDetailDto()`
- Status display: `InProgress` → `"In Progress"`

**What I accepted / changed:** Approved.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 4 — Tasks 3.2.4 & 3.2.5
**Time:** — | **Task:** 3.2.4, 3.2.5

**Actual prompt:**

> proceed with 3.2.4 & 3.2.5 both

**AI output:**
- `ticketService.create/list/getById`
- `ticketController`, `ticketRoutes` wired in `index.ts`
- Manual API tests passed

**What I accepted / changed:** Approved.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** Yes — TypeScript overload fix for `toDetailDto()`

---

### Prompt 5 — Task 3.2.6
**Time:** — | **Task:** 3.2.6

**Actual prompt:**

> aproved till 3.2.5 and mark that done in @tool-specific/cursor-workflow/implementation-plan.md once done proceed with 3.2.6

**AI output:**
- `ticketService.update()`, `PATCH /api/tickets/:id`
- `status` in body → 400 `STATUS_NOT_ALLOWED_HERE`

**What I accepted / changed:** Approved.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 6 — Quality Gate
**Time:** — | **Task:** Sprint 3.2 QG

**Actual prompt:**

> proceed with sprint 3.2 Quality gates

**AI output:**
- curl verification of all endpoints
- Documentation sync

**What I accepted / changed:** Requested curl instead of manual UI testing.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

## What I did without AI assistance

- Reviewed and approved each task between prompts
- Server running locally with seeded PostgreSQL

---

## Prompt engineering notes

| Observation | What it shows |
| ---- | ---- |
| One-task-at-a-time with "proceed" / "approved" | Controlled scope; developer gate between tasks |
| Combined 3.2.4 + 3.2.5 in one prompt | Explicit batching when tasks are tightly coupled |
| curl + JSON file bodies on Windows | PowerShell inline JSON escaping unreliable for curl |

---

## Files changed

| File | Change |
| --- | ----- |
| `server/src/validators/ticketValidators.ts` | Created |
| `server/src/services/userService.ts` | Created |
| `server/src/services/ticketService.ts` | Created / Updated |
| `server/src/controllers/userController.ts` | Created |
| `server/src/controllers/ticketController.ts` | Created |
| `server/src/routes/userRoutes.ts` | Created |
| `server/src/routes/ticketRoutes.ts` | Created |
| `server/src/index.ts` | Updated |

---

## Requirements traced

| ID | Coverage |
|----|----|
| FR-C-01–08 | Ticket CRUD API (no status change) |
| FR-C-19 | Users list |
| BR-01, BR-15–16 | Open on create; status rejected on PATCH; resolved names |
| USR-01–02, USR-04 | Users API |
| TKT-01–10 | Ticket API behaviors |
| VAL-01–04, VAL-06–07 | Zod validation |
| STS-06 | Status on general PATCH → 400 |
| ERR-01, ERR-03 | ErrorResponse shape; 404 on missing ticket |

---

## Quality Gate result

### curl verification summary (2026-07-09)

| # | Test | Expected | Actual | Pass |
|---|------|----------|--------|------|
| 1 | `GET /api/users` | 200 | HTTP 200; 3 users | Pass |
| 2 | `POST /api/tickets` valid | 201; status Open | HTTP 201; `status:"Open"` | Pass |
| 3 | `POST` no assignee | 201; assignedTo null | HTTP 201; `assignedTo:null` | Pass |
| 4 | `GET /api/tickets` | 200; names resolved | HTTP 200; `createdByName` present | Pass |
| 5 | `GET /api/tickets/1` | 200; comments ASC | HTTP 200; 2 comments ordered | Pass |
| 6 | `PATCH` title/priority | 200; updatedAt changes | HTTP 200; `updatedAt` changed | Pass |
| 7 | `PATCH` unassign | 200; status unchanged | HTTP 200; status still Open | Pass |
| 8 | `PATCH` with status | 400 STATUS_NOT_ALLOWED_HERE | HTTP 400; correct code | Pass |
| 9 | `POST` no title | 400 VALIDATION_ERROR | HTTP 400; correct code | Pass |
| 10 | `POST` bad createdBy | 404 NOT_FOUND | HTTP 404; correct code | Pass |
| 11 | `GET /api/tickets/99999` | 404 NOT_FOUND | HTTP 404; correct code | Pass |
| — | `npm run build` | Pass | Exit 0 | Pass |

| Check | Result |
|----|-----|
| All Tasks 3.2.1–3.2.6 complete | Passed |
| curl API verification | Passed (11/11) |
| Documentation sync | Passed |

**Sprint exit:** Passed. Ready for Sprint 3.3.

---

## Developer review

**Status:** Approved
**Approved by:** Developer — 2026-07-09
**Notes:** Prompts verbatim from transcript. Typos preserved. curl tests used JSON body files on Windows.
