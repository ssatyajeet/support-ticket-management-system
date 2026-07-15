# Test Strategy — Support Ticket Management System

**Document Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Approved — core scope complete  
**Traceability:** AC-17, AC-18, TST-01–09, FR-C-11, NFR-07

**Related documents:**

| Document | Role |
| -------- | ---- |
| [`docs/testing-notes.md`](testing-notes.md) | Setup, commands, troubleshooting |
| [`docs/test-run-evidence.md`](test-run-evidence.md) | Recorded Vitest output |
| [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) | Sprint 5.2 manual QA matrix |
| [`docs/debugging-notes.md`](debugging-notes.md) | Defects found during QA |
| [`tool-specific/cursor-workflow/acceptance-criteria.md`](../tool-specific/cursor-workflow/acceptance-criteria.md) | Verification checklist |

---

## Test Scope

### In scope (v1 core)

| Area | Method | Goal |
| ---- | ------ | ---- |
| Status state machine | Automated integration (Vitest + Supertest) | Prove valid transitions succeed and invalid transitions fail (AC-17, AC-18) |
| API guards | Automated integration | `status` rejected on general PATCH; invalid filter; validation; 404 |
| Business rules via HTTP | Integration + API scripts | Backend is authoritative — not UI-only enforcement |
| Edge cases (EC-01–EC-22) | Tiered: automated, API script, manual/browser | Sample all requirement-analysis edge cases |
| Full user flows | Manual regression (Sprint 5.2) | AC-01–AC-16 UI + API happy paths |
| Data persistence | Manual procedure | AC-12 — data survives server/DB restart |
| Secrets hygiene | Manual Git checks | AC-14 — no `.env` in version control |

### Out of scope (v1)

See **Tests Not Covered** below.

### Test environments

| Layer | Tooling |
| ----- | ------- |
| API integration | Vitest + Supertest against Express app (`server/src/app.ts`) |
| Database | PostgreSQL via Prisma; truncate + seed per test in `server/tests/helpers/db.ts` |
| Manual / edge scripts | Node `.mjs` scripts under `server/scripts/` |
| Client manual QA | Browser against Vite dev server (`http://localhost:5173`) |

**Recommended:** Use a dedicated test database (`support_tickets_test`) via `DATABASE_URL` for CI and to avoid polluting dev data.

---

## Unit Tests

### Strategy

Unit tests are **not implemented in v1**. Business logic that would be unit-tested (e.g. `statusTransition.ts`) is verified through **integration tests** that exercise the full HTTP → service → database path.

### Rationale

| Factor | Decision |
| ------ | -------- |
| Exercise requirement | At least one meaningful test tier — integration tests satisfy AC-17/AC-18 |
| Highest risk area | Status state machine — integration tests prove real API behavior |
| Time budget | 8–12 hours core app effort; unit suite deferred to stretch (FR-S-08) |

### Future (stretch)

- Unit tests for `statusTransition.validateTransition()` in isolation
- Unit tests for Zod schemas and DTO mappers
- Target: fast feedback without database round-trips

### Current coverage

| Module | Unit tests | Verified instead by |
| ------ | ---------- | ------------------- |
| `statusTransition.ts` | None | Integration tests (16 cases) |
| Zod validators | None | Integration + manual regression |
| React components/hooks | None | Manual QA + code review |

---

## Component Tests

### Strategy

Frontend **component tests are not implemented in v1** (no React Testing Library / Vitest client suite).

### Rationale

| Factor | Decision |
| ------ | -------- |
| Scope | Core AC focus on backend state machine and end-to-end manual flows |
| UI complexity | Moderate — list, create, detail, forms; manual regression sufficient for exercise |
| Stretch | FR-S-08 allows unit/edge tests beyond mandatory integration tier |

### How UI quality is verified instead

| Method | Coverage |
| ------ | -------- |
| Manual regression (5.2.1) | 33 cases — navigation, list, search, filter, create, detail, edit, status, comments |
| Code review | Loading states, error display, URL param persistence (FE-04, FE-08) |
| API integration | Backend errors surfaced in UI tested manually (AC-08, ERR-02) |

### Future (stretch)

- Component tests for `StatusSelector`, `TicketForm`, `CommentForm`
- Hook tests for `useTickets`, `useTicket` with mocked `api/` layer

---

## API / Integration Tests

### Strategy

**Mandatory suite** — must pass before release. Tests real HTTP requests against the Express app with a live PostgreSQL database.

| Attribute | Value |
| --------- | ----- |
| **Location** | `server/tests/integration/statusTransition.integration.test.ts` |
| **Framework** | Vitest + Supertest |
| **Command** | `cd server && npm run test` |
| **Count** | 16 tests (latest evidence: 16/16 passed) |

### Scenarios covered

#### Valid transitions (5) — expect `200`

| From | To |
| ---- | -- |
| Open | In Progress |
| In Progress | Resolved |
| Resolved | Closed |
| Open | Cancelled |
| In Progress | Cancelled |

#### Invalid transitions (6) — expect `400` `INVALID_STATUS_TRANSITION`

| From | To |
| ---- | -- |
| Open | Resolved |
| Open | Closed |
| Resolved | Open |
| Closed | In Progress |
| Cancelled | In Progress |
| Cancelled | Closed |

#### API guards (5)

| Scenario | Expected |
| -------- | -------- |
| `PATCH /api/tickets/:id` with `status` field | `400` `STATUS_NOT_ALLOWED_HERE` |
| `GET /api/tickets?status=Invalid` | `400` `INVALID_FILTER` |
| `POST /api/tickets` without title | `400` `VALIDATION_ERROR` |
| `GET /api/tickets/99999` | `404` `NOT_FOUND` |
| `POST /api/tickets` with malformed JSON | `400` `VALIDATION_ERROR` (EC-19) |

### Test data strategy

- `beforeEach`: truncate `comments`, `tickets`, `users`; seed minimal users + one Open ticket
- Each test is isolated — no ordering dependency between cases
- App exported from `server/src/app.ts` without `listen()` — no port conflicts

### Traceability

| ID | Coverage |
| ---- | -------- |
| AC-17 | Valid transition tests |
| AC-18 | Invalid transition tests |
| TST-01–07 | Full integration suite |
| FR-C-11 | State machine enforced via HTTP |
| NFR-07 | Testable without manual UI |

---

## Edge Case Tests

### Strategy

All **22 edge cases** (EC-01–EC-22) from `docs/requirements-analysis.md` §12 are addressed using a **three-tier** approach:

| Tier | Method | Cases |
| ---- | ------ | ----- |
| **1 — Automated** | Vitest integration tests | EC-01–03, 06 (title), 19–22 |
| **2 — API script** | `server/scripts/edge-cases-523-api.mjs` | EC-04–10, 12–13, 15 |
| **3 — Manual / review** | Browser, schema, persistence scripts | EC-01–02, 06, 11–12, 14, 16–18 |

### Edge case matrix (summary)

| ID | Scenario | Tier | Result |
| -- | -------- | ---- | ------ |
| EC-01 | Closed → any status | 1 + 3 | 400 |
| EC-02 | Cancelled → any status | 1 + 3 | 400 |
| EC-03 | Open → Resolved (skip) | 1 | 400 |
| EC-04 | In Progress → Closed (skip) | 2 | 400 |
| EC-05 | Resolved → In Progress (revert) | 1 | 400 |
| EC-06 | Empty title/description | 1 + 2 | 400 |
| EC-07 | Invalid priority | 2 | 400 |
| EC-08 | Invalid user ID | 2 | 400/404 |
| EC-09 | Comment on missing ticket | 2 | 404 |
| EC-10 | Empty comment | 2 | 400 |
| EC-11 | Search no matches | 2 + 3 | Empty list |
| EC-12 | Filter no matches | 2 + 3 | Empty list |
| EC-13 | Concurrent status updates | 3 | Last-write-wins |
| EC-14 | Unassigned ticket | 3 | "Unassigned" |
| EC-15 | Max length exceeded | 2 | 400 |
| EC-16 | XSS in user content | 3 | Text render, no `dangerouslySetInnerHTML` |
| EC-17 | DB unavailable | 3 | Graceful failure (ERR-05 deferred) |
| EC-18 | Duplicate seed email | 3 | Unique constraint |
| EC-19 | Malformed JSON | 1 | 400 (DEF-001 fixed) |
| EC-20 | Non-existent ticket | 1 | 404 |
| EC-21 | `status` on general PATCH | 1 | 400 |
| EC-22 | Invalid status filter | 1 | 400 |

Full manual matrix: [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) Section M.

### Running edge-case API script

```bash
cd server
npm run db:seed
API_BASE=http://localhost:3001/api node scripts/edge-cases-523-api.mjs
```

---

## Tests Not Covered (and why)

| Area | Not covered | Why |
| ---- | ----------- | --- |
| **Frontend unit tests** | Component/hook isolated tests | Exercise mandates one meaningful tier; integration + manual QA sufficient for v1; stretch FR-S-08 |
| **E2E browser automation** | Playwright/Cypress full flows | Time budget; manual regression (33 cases) covers AC-01–AC-11 |
| **Load / performance tests** | Throughput, latency SLAs | Internal tool; modest dataset; NFR-11 has no SLA |
| **100% code coverage** | Line/branch coverage targets | Not required; focus on state machine and API contract |
| **Auth / RBAC tests** | Login, role restrictions | Out of core scope (DD-08); stretch only |
| **Pagination / sorting tests** | List paging | Not in v1 API |
| **Comment edit/delete tests** | Update/remove comments | BR-11 — append-only in v1 |
| **Ticket delete tests** | Hard/soft delete | OQ-05 — deferred |
| **Optimistic locking tests** | 409 on stale version | OQ-14 — last-write-wins in v1 |
| **DB unavailable (EC-17)** | Automated failure test | ERR-05 marked Not Started; manual observation only |
| **CI pipeline tests** | Automated run on every push | Stretch FR-S-10 |

### Accepted trade-off

v1 prioritizes **proving the state machine and API contract** over broad test pyramid coverage. The highest business risk (invalid status transitions reaching production) is mitigated by mandatory integration tests and manual regression.

### When to expand

After AC-01–AC-18 pass and submission is complete, stretch sprint S.1 may add unit tests, E2E, Docker, and CI — without breaking existing integration suite.

---

*Operational runbook: [`docs/testing-notes.md`](testing-notes.md). Design context: [`tool-specific/cursor-workflow/design-notes.md`](../tool-specific/cursor-workflow/design-notes.md) § Testing Strategy Link.*
