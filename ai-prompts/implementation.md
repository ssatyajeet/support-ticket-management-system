# Implementation — AI Prompts

**Activity:** Backend and frontend code generation  
**Sprints:** 3.1–3.4 (backend), 4.1–4.4 (frontend)  
**QG evidence:** [`tool-workflow.md`](../tool-workflow.md) — Sprints 3.1–4.4 QG sections

---

## Backend

### Prompt 1 — Task-scoped state machine (3.3.1)

**Source:** sprint-3.3.md — Prompt 1 | **Task:** 3.3.1

**Prompt:** `proceed with 3.3.1`

**AI response summary:** Created `server/src/services/statusTransition.ts` with transition map per BR-02–BR-06.

**What I accepted:** Single source of truth for status rules.  
**What I rejected / why:** N/A.  
**Iteration:** No | **Context shared:** implementation-plan task 3.3.1 | **Context not shared:** `DATABASE_URL`

---

### Prompt 2 — Workflow preference (build at QG only)

**Source:** sprint-3.3.md — Prompt 2 | **Task:** 3.3.2

**Prompt:** `going forword to do not run npm run build on each task… move to next task 3.3.2`

**AI response summary:** `ticketService.changeStatus()` with live DB read (last-write-wins).

**What I accepted:** changeStatus implementation.  
**What I rejected / why:** **Rejected** `npm run build` after every task — sprint QG only.  
**Iteration:** No | **Context shared:** Developer workflow instruction | **Context not shared:** N/A

---

### Prompt 3 — Dedicated status endpoint (3.3.3)

**Source:** sprint-3.3.md — Prompt 3 | **Task:** 3.3.3

**Prompt:** `go ahead with 3.3.3`

**AI response summary:** `PATCH /api/tickets/:id/status` route, validator, controller; curl smoke tests.

**What I accepted:** Separate status endpoint per DD-04 / OQ-09.  
**What I rejected / why:** N/A.  
**Iteration:** No | **Context shared:** Prior 3.3.1–3.3.2 work | **Context not shared:** N/A

---

### Prompt 4 — Ticket CRUD with approval boundaries (3.2)

**Source:** sprint-3.2.md | **Task:** 3.2.x

**Prompt:** `aproved till 3.2.5 and mark that done in @implementation-plan.md once done proceed with 3.2.6`

**AI response summary:** Incremental CRUD; general PATCH rejects `status`; curl verification between tasks.

**What I accepted:** Batch approval with explicit ceiling before next task.  
**What I rejected / why:** N/A.  
**Iteration:** Yes | **Context shared:** `@implementation-plan.md`, design-notes | **Context not shared:** Real DB credentials

---

### Prompt 5 — Comments, search, filter (3.4)

**Source:** sprint-3.4.md | **Task:** 3.4.1–3.4.3

**Prompt:** `proceed with sprint 3.4 tasks`

**AI response summary:** Comment endpoints, ILIKE search, status filter with `INVALID_FILTER` on bad enum.

**What I accepted:** Backend API complete per api-contract.  
**What I rejected / why:** N/A.  
**Iteration:** No | **Context shared:** Frozen design-notes | **Context not shared:** N/A

---

## Frontend

### Prompt 6 — Client scaffold (4.1)

**Source:** sprint-4.1.md | **Task:** 4.1.1–4.1.6

**Prompt:** `proceed with sprint 4.1 tasks from @implementation-plan.md`

**AI response summary:** Vite + React + Router; `client/src/api/` layer; routes; CORS verified.

**What I accepted:** API client centralization (no inline fetch).  
**What I rejected / why:** Deferred UI branding until scaffold complete.  
**Iteration:** No | **Context shared:** `@implementation-plan.md` | **Context not shared:** `client/.env`

---

### Prompt 7 — List UI first pass (rejected)

**Source:** sprint-4.2.md — Prompt 1 | **Task:** 4.2.1–4.2.5

**Prompt:** `please proceed with 4.2.1 4.2.2 4.2.3 4.2.4 and also 4.2.5`

**AI response summary:** `useTickets`, list components, URL params, debounce — functional but plain UI.

**What I accepted:** Core list/search/filter behavior.  
**What I rejected / why:** **Rejected plain UI** — triggered redesign.  
**Iteration:** Yes | **Context shared:** design-notes frontend spec | **Context not shared:** N/A

---

### Prompt 8 — UI iteration (modern + mockup)

**Source:** sprint-4.2.md — Prompts 2–3 | **Task:** UI iteration

**Prompts:**
1. `UI is not looking good redesign the UI with morden design element`
2. `can we make lyout like the image i attached include icons… and the charts`

**AI response summary:** Modern styling pass, then sidebar layout, dashboard chart, table view, status tabs.

**What I accepted:** Mockup-aligned layout — "looks good."  
**What I rejected / why:** Rejected stopping at generic modern UI without mockup alignment.  
**Iteration:** Yes | **Context shared:** Image attachment (mockup) | **Context not shared:** N/A

---

### Prompt 9 — Status UI + error display (4.4)

**Source:** sprint-4.4.md | **Task:** 4.4.x

**Prompt:** `proceed with 4.4 tasks`

**AI response summary:** StatusSelector hints only; invalid transition shows API error (AC-08); comment form.

**What I accepted:** Backend-authoritative status — UI does not enforce transitions.  
**What I rejected / why:** Rejected client-side transition guard.  
**Iteration:** No | **Context shared:** api-contract, acceptance criteria | **Context not shared:** N/A
