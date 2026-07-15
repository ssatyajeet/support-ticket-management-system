# Prompt History — Sprint 3.3: Status State Machine

**Date:** 2026-07-10
**Sprint:** 3.3 — Status State Machine
**Status:** Complete
**Tasks covered:** 3.3.1 → 3.3.3
**Traceability:** STS-01–09, FR-C-09–13a, BR-02–06, BR-17, AC-06–08

---

> **Recovery notice**
> Prompts in this file are **verbatim** — recovered from the Cursor conversation transcript.
> Typos in original prompts are preserved intentionally.
> AI responses are summarized, not pasted in full.

---

## Goal

Implement backend-enforced ticket status state machine: isolated transition logic, `changeStatus` service method, and dedicated `PATCH /api/tickets/:id/status` endpoint.

---

## Tasks Completed

| Task ID | Summary | Outcome |
| ------- | ------- | ------- |
| 3.3.1 | Status transition service | `statusTransition.ts` — `validateTransition`, `getAllowedTransitions` |
| 3.3.2 | `changeStatus` in ticket service | Load live DB status → validate → update |
| 3.3.3 | Status endpoint + validator | `PATCH /api/tickets/:id/status`; API display status mapping |

---

## Prompts Log

---

### Prompt 1 — Task 3.3.1
**Time:** — | **Task:** 3.3.1

**Actual prompt:**

> proceed with 3.3.1

**AI output:**
- Created `server/src/services/statusTransition.ts` with transition map per BR-02–BR-06
- Stopped for developer review

**What I accepted / changed:** Approved state diagram.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 2 — Task 3.3.2 + workflow note
**Time:** — | **Task:** 3.3.2

**Actual prompt:**

> going forword to do not run npm run build on each task run it when sprint has been completed
>
> note date for future comunication now move to next task 3.3.2

**AI output:**
- `ticketService.changeStatus()` — last-write-wins via live DB read
- Marked 3.3.1 complete
- Noted: build only at sprint QG; date 2026-07-10

**What I accepted / changed:** Approved workflow preference.


**What I rejected / why:** Rejected running `npm run build` after every task — sprint QG only.
**Iteration needed:** No

---

### Prompt 3 — Task 3.3.3
**Time:** — | **Task:** 3.3.3

**Actual prompt:**

> go ahead with 3.3.3

**AI output:**
- `parseChangeStatusInput()` in `ticketValidators.ts`
- `changeTicketStatus` controller; `PATCH /:id/status` route
- curl smoke tests on valid/invalid transitions

**What I accepted / changed:** Approved.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

### Prompt 4 — Sprint 3.3 Quality Gate
**Time:** — | **Task:** QG

**Actual prompt:**

> proceed with 3.3 quality gate

**AI output:**
- Full curl transition matrix (13 cases)
- Documentation sync; `npm run build` at sprint end

**What I accepted / changed:** In progress.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No

---

## What I did without AI assistance

- Reviewed and approved tasks 3.3.1–3.3.3 between prompts

---

## Prompt engineering notes

| Observation | What it shows |
| ---- | ---- |
| Build only at sprint QG | Developer workflow optimization |
| Dedicated status endpoint | BR-15 / DD-04 separation from general PATCH |
| curl + JSON body files on Windows | Reliable API verification pattern |

---

## Files changed

| File | Change |
| --- | ----- |
| `server/src/services/statusTransition.ts` | Created |
| `server/src/services/ticketService.ts` | Added `changeStatus` |
| `server/src/validators/ticketValidators.ts` | Added `parseChangeStatusInput` |
| `server/src/controllers/ticketController.ts` | Added `changeTicketStatus` |
| `server/src/routes/ticketRoutes.ts` | Added `PATCH /:id/status` |

---

## Requirements traced

| ID | Coverage |
|----|----|
| FR-C-09–12 | Status enum + transitions + backend enforcement |
| BR-02–06 | State machine rules |
| BR-17 | Last-write-wins validation against DB |
| STS-01–09 | State machine sprint criteria |
| AC-06–07 | Valid/invalid transitions (API MT) |

---

## Quality Gate result

### curl transition matrix (2026-07-10)

| # | Test | Expected | Pass |
|---|------|----------|------|
| 1 | Open → Resolved | 400 | Pass |
| 2 | Open → Closed | 400 | Pass |
| 3 | Resolved → Open | 400 | Pass |
| 4 | Closed → In Progress | 400 | Pass |
| 5 | Cancelled → Open | 400 | Pass |
| 6 | In Progress → Open | 400 | Pass |
| 7 | Invalid status string | 400 `VALIDATION_ERROR` | Pass |
| 8 | General PATCH with `status` | 400 `STATUS_NOT_ALLOWED_HERE` | Pass |
| 9 | Open → In Progress | 200 | Pass |
| 10 | In Progress → Resolved | 200 | Pass |
| 11 | Resolved → Closed | 200 | Pass |
| 12 | Open → Cancelled | 200 | Pass |
| 13 | In Progress → Cancelled | 200 | Pass |
| — | `npm run build` | Pass | Pass |

**Sprint exit:** Passed. Ready for Sprint 3.4.

---

## Developer review

**Status:** Approved
**Approved by:** Developer — 2026-07-10
**Notes:** Prompts verbatim from transcript. Typos preserved.
