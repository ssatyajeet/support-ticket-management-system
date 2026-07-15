# Prompt History — Sprint 3.4: Comments, Search & Filter

**Date:** 2026-07-10
**Sprint:** 3.4 — Comments, Search & Filter
**Status:** Complete
**Tasks covered:** 3.4.1 → 3.4.3
**Traceability:** CMT-01–06, SRC-01–06, VAL-05, BE-02–03, FR-C-14–18, BR-10–12, AC-09–11

---

> **Recovery notice**
> Prompts in this file are **verbatim** — recovered from the Cursor conversation transcript.
> Typos in original prompts are preserved intentionally.
> AI responses are summarized, not pasted in full.

---

## Goal

Complete the backend API: comment creation endpoint, ticket list search (title + description ILIKE), and status filter with `INVALID_FILTER` on invalid values.

---

## Tasks Completed

| Task ID | Summary | Outcome |
| ------- | ------- | ------- |
| 3.4.1 | Comment service and endpoint | `POST /api/tickets/:id/comments`; append-only; 404 if ticket missing |
| 3.4.2 | Search on ticket list | `?search=` query — case-insensitive partial on title + description |
| 3.4.3 | Status filter on ticket list | `?status=` filter; invalid → 400 `INVALID_FILTER` |

---

## Prompts Log

---

### Prompt 1 — Start Sprint 3.4
**Time:** 2:13 PM | **Task:** 3.4.1

**Actual prompt:**

> yes continue

**AI output:**
- Marked Sprint 3.4 In progress
- Created `commentValidators.ts`, `commentService.ts`, `commentController.ts`, `commentRoutes.ts`
- Mounted `/:id/comments` in `ticketRoutes.ts`
- curl smoke: 201 valid comment, 404 missing ticket, comment on detail

**What I accepted / changed:** Approved implementation.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 2 — Task 3.4.2
**Time:** 2:43 PM | **Task:** 3.4.2

**Actual prompt:**

> approved and proceed with 3.4.2

**AI output:**
- `parseListTicketsQuery()` and `list(filters)` with Prisma `contains` + `mode: 'insensitive'`
- curl smoke: vpn, outlook, corporate, empty search, trimmed whitespace

**What I accepted / changed:** Approved.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 3 — Task 3.4.3
**Time:** 3:31 PM | **Task:** 3.4.3

**Actual prompt:**

> proceed with 3.4.3

**AI output:**
- Extended `parseListTicketsQuery()` with status mapping via `API_TO_PRISMA_STATUS`
- `ticketService.list()` applies `where.status`
- curl smoke: In Progress, Cancelled, Invalid, empty, combined search+status

**What I accepted / changed:** Approved implicitly by proceeding to QG.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 4 — Sprint 3.4 Quality Gate
**Time:** 3:38 PM | **Task:** QG

**Actual prompt:**

> proceed with 3.4 but make sure do not run curl which have been already tested and havoing no change during this sprint 3.4

**AI output:**
- QG with 6 new curl cases only (skipped task-level duplicates)
- `npm run build` passed
- Documentation sync: `implementation-plan.md`, `acceptance-criteria.md`, `tool-workflow.md`, this file

**What I accepted / changed:** In progress.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

## What I did without AI assistance

- Reviewed and approved tasks 3.4.1–3.4.3 between prompts
- Directed QG to skip redundant curl re-runs

---

## Prompt engineering notes

| Observation | What it shows |
| ---- | ---- |
| "do not run curl which have been already tested" | Efficient QG — avoid duplicate verification |
| Task-by-task approval between 3.4.1–3.4.3 | Same workflow as prior backend sprints |
| Build only at sprint QG | Continued from Sprint 3.3 preference |

---

## Files changed

| File | Change |
| --- | ----- |
| `server/src/validators/commentValidators.ts` | Created |
| `server/src/services/commentService.ts` | Created |
| `server/src/controllers/commentController.ts` | Created |
| `server/src/routes/commentRoutes.ts` | Created |
| `server/src/routes/ticketRoutes.ts` | Mount comment routes |
| `server/src/validators/ticketValidators.ts` | `parseListTicketsQuery`, search + status filters |
| `server/src/services/ticketService.ts` | `list(filters)` with search and status |
| `server/src/controllers/ticketController.ts` | Parse query in `listTickets` |
| `tool-specific/cursor-workflow/implementation-plan.md` | Sprint 3.4 complete |
| `tool-specific/cursor-workflow/acceptance-criteria.md` | CMT, SRC, VAL-05, BE-02–03 |
| `tool-workflow.md` | Sprint 3.4 section |

---

## Requirements traced

| ID | Coverage |
|----|----|
| FR-C-14–16 | Comment create API + DTO + chronological detail |
| FR-C-17 | Search title + description ILIKE |
| FR-C-18 | Status filter on list |
| BR-10–12 | Comments all statuses; append-only; ASC order |
| CMT-01–06 | Comment sprint criteria |
| SRC-01–06 | Search/filter criteria (API verified) |
| BE-03 | All spec §12.1 endpoints functional |

---

## Quality Gate result

### Task-level curl (verified during 3.4.1–3.4.3 — not re-run at QG)

| Area | Tests | Result |
|------|-------|--------|
| Comments | POST 201, 404 missing ticket, visible on GET detail | Pass |
| Search | title match, description match, case-insensitive, empty ignored | Pass |
| Status filter | In Progress, Cancelled, Invalid, empty, combined with search | Pass |

### QG-only curl (2026-07-10)

| # | Test | Expected | Pass |
|---|------|----------|------|
| 1 | POST comment on Closed ticket (id 4) | 201 | Pass |
| 2 | POST empty message | 400 `VALIDATION_ERROR` | Pass |
| 3 | POST invalid `createdBy` (99999) | 404 `NOT_FOUND` | Pass |
| 4 | PATCH `/comments/:id` | 404 | Pass |
| 5 | DELETE `/comments/:id` | 404 | Pass |
| 6 | `?search=zzzznomatchxyz` | 200 `[]` | Pass |
| — | `npm run build` | Pass | Pass |

**Sprint exit:** Passed. Ready for Sprint 4.1.

---

## Developer review

**Status:** Approved
**Approved by:** Developer — 2026-07-10
**Notes:** Prompts verbatim from Cursor conversation transcript. Typos preserved.
