# Code Review Notes — Support Ticket Management System

**Author:** Satyajeet Singh  
**Date:** 2026-07-15 (consolidated); retrospective evidence from Sprints 2.1–5.2  
**Traceability:** Part A (`tool-workflow.md` — code review with AI), AC-19–AC-23, DOC-10  
**Standards used:** `docs/requirements-analysis.md`, `tool-specific/cursor-workflow/design-notes.md`, `.cursor/rules/`

---

## Scope note

This document consolidates **code review activity that actually occurred** during the project. It is **not** a verbatim log of dedicated review-only chat sessions for every module.

| Source | What it covers |
| ------ | -------------- |
| **Retrospective (Sprints 2.1–5.2)** | Quality Gate checks, curl/API verification, build review, and corrections documented in `prompt-history/` and `tool-workflow.md` |
| **Supplemental (2026-07-15)** | Targeted read-only review of high-signal modules before submission — findings recorded in §AI-Assisted Review Summary (Reviews 4–6) |

During Sprints 3–4, implementation followed an approved spec. My review at each Quality Gate was primarily **verification against requirements** rather than large rewrites. Where AI output diverged from spec or build/tests failed, I corrected before approval.

**Related artifacts:** [`reflection.md`](reflection.md) · [`debugging-notes.md`](debugging-notes.md) · [`prompt-history/`](../prompt-history/)

---

## AI-Assisted Review Summary

### Review 1 — Planning documents (Sprint 2.1, retrospective)

**Focus:** `design-notes.md`, `acceptance-criteria.md`, `tool-workflow.md` — structure and anti-patterns before any app code.

**Prompt pattern (representative):** Role-based prompts with explicit constraints — e.g. *"Do not simply copy the acceptance criteria from the requirement analysis — reorganize into a practical verification document"* and *"Only document activities that have actually been completed. Do NOT invent future workflow."*

**AI findings:**

- Initial `acceptance-criteria.md` draft risked duplicating requirements-analysis §15 verbatim.
- `tool-workflow.md` risked speculative future-sprint content if unconstrained.

**Outcome:** Accepted structure after constraint-driven iteration (Sprint 2.1 Prompts 7–9). Planning freeze at `implementation-plan.md` v2.0 before Phase 3 code.

---

### Review 2 — API boundary and CRUD (Sprint 3.2 QG, retrospective)

**Files:** `ticketValidators.ts`, `ticketService.ts`, `ticketController.ts`

**Review method:** Code read + 11 curl cases at Quality Gate (`prompt-history/sprint-3.2.md`).

**AI-assisted implementation; human verification:**

| Check | Result |
| ----- | ------ |
| `assertNoStatusField` before Zod on general PATCH | Verified — `STATUS_NOT_ALLOWED_HERE` on curl #8 |
| Create defaults status to Open (server-side) | Verified — curl #2 |
| Resolved `createdByName` / `assignedToName` on list/detail | Verified — curl #4–5 |
| Zod field limits (title 200, etc.) | Verified — curl #9 |
| No Prisma errors exposed to client | Verified — consistent `ErrorResponse` shape |

**Outcome:** Approved — no structural changes at QG.

---

### Review 3 — State machine (Sprint 3.3 QG, retrospective)

**Files:** `statusTransition.ts`, `ticketService.changeStatus()`

**Review method:** Code read + 13-case curl transition matrix (`prompt-history/sprint-3.3.md`).

**Observations:**

- Single `VALID_TRANSITIONS` map — sole source for BR-02–BR-06.
- `changeStatus()` reads **live DB status** before `validateTransition()` — satisfies BR-17 (last-write-wins against current state).
- Dedicated `PATCH /api/tickets/:id/status` — general PATCH cannot mutate status (DD-04).

**Outcome:** Approved — 13/13 transition matrix passed.

---

### Review 4 — State machine module (supplemental, 2026-07-15)

**Files:** `server/src/services/statusTransition.ts`

**Review prompt (this session):** *Review against BR-02–BR-06 and spec §8. Flag missing transitions, terminal-state leaks, or logic outside this module.*

**Findings:**

| Finding | Severity | Verdict |
| ------- | -------- | ------- |
| Five valid transitions match spec; `Closed` / `Cancelled` have empty allowed arrays | — | **Confirmed correct** |
| `getAllowedTransitions()` exported for UI hints | Low | **Accepted** — display only; backend remains authoritative |
| Suggestion: add transition audit log table | Low | **Rejected** — stretch / out of v1 scope |
| Suggestion: wrap map in a class hierarchy per state | Low | **Rejected** — YAGNI; plain map matches exercise scale |

**Outcome:** No code change required.

---

### Review 5 — Error handling (supplemental, 2026-07-15)

**Files:** `server/src/middleware/errorHandler.ts`

**Review prompt (this session):** *Review error handling for EC-19, Zod failures, and risk of leaking stack traces or Prisma errors.*

**Findings:**

| Finding | Severity | Verdict |
| ------- | -------- | ------- |
| `isJsonParseError()` returns 400 `VALIDATION_ERROR` for malformed JSON | — | **Confirmed** — fixes DEF-001 (found in Sprint 5.2 QA, not this review) |
| `AppError` and `ZodError` branches return structured `ErrorResponse` | — | **Confirmed correct** |
| Unhandled errors log server-side only; client gets generic `INTERNAL_ERROR` | — | **Confirmed correct** |
| Suggestion: add request-id header for correlation | Low | **Rejected** — not in v1 spec |
| Suggestion: return parser line/column in JSON parse errors | Low | **Rejected** — unnecessary detail for internal tool |

**Outcome:** No further change — DEF-001 fix already applied in Sprint 5.2.4.

---

### Review 6 — Frontend data hook (Sprint 4.2 QG + supplemental, 2026-07-15)

**Files:** `client/src/hooks/useTickets.ts`, list page components

**Sprint 4.2 QG (retrospective):** Verified loading, error, abort on unmount, no inline `fetch`, URL param sync (`prompt-history/sprint-4.2.md`).

**Supplemental findings:**

| Finding | Severity | Verdict |
| ------- | -------- | ------- |
| `AbortController` cleanup on filter change / unmount | — | **Confirmed correct** |
| API errors surfaced via `isApiError` → user-visible message | — | **Confirmed correct** |
| All HTTP via `api/tickets.ts` — not inline in components | — | **Confirmed correct** |
| Suggestion: add React Query / SWR | Low | **Rejected** — spec defers global store; custom hooks sufficient |
| Suggestion: client-side status transition guard | Medium | **Rejected** — violates DD-04; UI hints only |

**Outcome:** Approved — no change required.

---

## My Review Observations

These are **my** conclusions as reviewer — including confirmations where no change was needed.

### Architecture and spec alignment

- **Thin controllers, fat services** — business rules stay in `ticketService.ts` and `statusTransition.ts`, not routes.
- **Status is a sub-resource** — `assertNoStatusField()` runs before Zod on general PATCH; this is the most important API design guard in the project.
- **Frontend does not enforce transitions** — status buttons show hints; invalid attempts surface API `INVALID_STATUS_TRANSITION` message (AC-08).
- **Search/filter at DB layer** — `ILIKE` on title + description; invalid status query → `INVALID_FILTER` (not client-side filtering).

### Verification-heavy QG pattern (Sprints 3–4)

Most implementation batches were **approved after verification**, not rewritten:

- Sprint 3.2: 11/11 curl cases before accepting CRUD API.
- Sprint 3.3: 13/13 transition matrix before accepting state machine.
- Sprint 4.2: code review checklist — `useTickets`, URL params, debounce, empty/error states, no inline fetch.
- Sprint 5.1: `npm run test` — 16/16 integration scenarios.

### Issues I caught (implementation corrections)

| Topic | What I noticed | Action |
| ----- | -------------- | ------ |
| Prisma 7.8 schema `url` deprecation | Migrate failed in agent shell | Added `prisma.config.ts` + driver adapter |
| TypeScript `toDto` overload | Build/type confusion on detail responses | Split `toDetailDto()` helper |
| Express 5 `req.params.id` typing | `string \| string[]` in controller | Normalized in controller |
| Unused `cn` import in `PageHeader.tsx` | Client build failed at QG | Removed import |
| Plain initial list UI | Did not meet usability bar | Iteration pass + mockup-aligned layout (Sprint 4.2) |
| Malformed JSON → 500 (EC-19) | Found during edge-case QA, not initial code review | Approved `errorHandler` fix (DEF-001) |

### Workflow preferences (review process, not code)

- **Sprint 3.3:** Rejected running `npm run build` after every task — build only at sprint Quality Gate.
- **Sprint 3.2:** Preferred curl API verification over manual UI for backend tasks.
- **Sprint 4.1:** Deferred UI branding until functional scaffold was complete.

---

## Changes Made After Review

| ID | Sprint | File / area | Finding | Change |
| -- | ------ | ----------- | ------- | ------ |
| CR-01 | 3.1 | `prisma.config.ts`, adapter | Prisma 7.8 config rejected in schema | Added config + `@prisma/adapter-pg` |
| CR-02 | 3.2 | `ticketService.ts` | `toDto` overload unclear | Added `toDetailDto()` |
| CR-03 | 3.2 | `ticketController.ts` | Express 5 param typing | Handle `string \| string[]` for `id` |
| CR-04 | 4.2 | `PageHeader.tsx` | Unused import — build blocker | Removed import |
| CR-05 | 4.2 | List UI / layout | First UI pass too plain | Sidebar, dashboard, table/card views |
| CR-06 | 5.2 | `errorHandler.ts` | EC-19 malformed JSON → 500 (DEF-001) | `isJsonParseError()` → 400 `VALIDATION_ERROR` |
| CR-07 | 6.1 | `README.md` | Port alignment confusion | Documented `PORT` / `VITE_API_URL` coupling |

*Reviews 4–6 (2026-07-15) required no additional code changes — verification only.*

---

## Suggestions Rejected (and why)

| Suggestion | Source | Why rejected |
| ---------- | ------ | ------------ |
| JWT / session authentication | Assignment stretch; AI defaults | Out of v1 scope — documented known limitation |
| Ticket delete or soft delete in v1 | OQ-05 discussion; user initially preferred soft delete | DD-02 — no delete in v1; hard delete blocked at DB |
| Pagination, sorting, priority/assignee filters | Stretch list in assignment | Core scope prioritized; full list acceptable for exercise dataset |
| Enforce status transitions in React | Common AI frontend pattern | Architecture rule — backend only; UI hints + API errors |
| Business logic in route handlers | Early AI scaffolding tendency | Cursor rules — controllers thin, services own logic |
| `npm run build` after every task | Default per-task workflow | Developer choice — sprint QG build only (Sprint 3.3) |
| UI branding in Sprint 4.1 | AI ready to polish early | Deferred — "let it be for now proceed with 4.1.2" |
| DB-unavailable test (EC-17) | Edge-case matrix | Deferred — admin/env friction; logged in debugging notes |
| React Query / Redux for ticket list | Supplemental review 2026-07-15 | YAGNI — custom hooks meet spec |
| Transition audit log table | Supplemental review 2026-07-15 | Stretch — not in FR-C scope |
| Request-id / correlation IDs in errors | Supplemental review 2026-07-15 | Not in v1 spec |

---

## Review coverage summary

| Layer | Modules reviewed | Primary method | Result |
| ----- | ---------------- | -------------- | ------ |
| Planning | spec, tasks, AC, workflow | AI draft + human iteration | Approved at planning freeze |
| Backend validators | `ticketValidators.ts` | Code read + curl | Approved |
| Backend services | `ticketService.ts`, `statusTransition.ts` | Code read + curl + integration tests | Approved |
| Backend middleware | `errorHandler.ts` | QA edge case + supplemental read | Fixed DEF-001; re-verified |
| Frontend hooks | `useTickets.ts` | QG code review + supplemental read | Approved |
| Frontend pages | List, detail, create | Manual regression 33/33 | Approved |

---

## Related artifacts

| Artifact | Relevance |
| -------- | --------- |
| [`prompt-history/sprint-3.2.md`](../prompt-history/sprint-3.2.md) | CRUD curl verification |
| [`prompt-history/sprint-3.3.md`](../prompt-history/sprint-3.3.md) | Transition matrix QG |
| [`prompt-history/sprint-4.2.md`](../prompt-history/sprint-4.2.md) | Frontend hook QG checklist |
| [`prompt-history/sprint-5.2.md`](../prompt-history/sprint-5.2.md) | DEF-001 discovery and fix |
| [`tool-workflow.md`](../tool-workflow.md) | Code Validation + Code Review sections |
| [`reflection.md`](reflection.md) | Lifecycle; manual corrections table |

---

*x`code review log for exercise evaluation. Retrospective QG evidence supplemented with targeted pre-submission module review — no fabricated sessions.*
