# Test Results — Support Ticket Management System

**Purpose:** Committed proof that the mandatory integration test suite passes (AC-17, AC-18, TST-08).  
**Test files:** `server/tests/integration/statusTransition.integration.test.ts`, `server/tests/unit/statusTransition.test.ts`  
**Command:** `cd server && npm run test`

---

## Latest run (Sprint 6.2 final regression)

| Field | Value |
| ----- | ----- |
| **Date** | 2026-07-13 |
| **Runner** | Satyajeet Singh (local) |
| **Environment** | Windows 10; Node.js; PostgreSQL; `server/.env` configured |
| **Vitest** | v4.1.10 |
| **Result** | **32 / 32 passed** (16 integration + 16 unit) |
| **Duration** | ~4.1s |
| **Exit code** | 0 |

### Console output (excerpt)

```text
> support-ticket-server@1.0.0 test
> vitest run

 RUN  v4.1.10 .../server

 Test Files  2 passed (2)
      Tests  32 passed (32)
   Duration  4.08s
```

**Note:** A `pg` client deprecation warning may appear in output; it does not affect test results.

---

## Previous run (pre-submission refresh)

| Field | Value |
| ----- | ----- |
| **Date** | 2026-07-15 |
| **Result** | **16 / 16 passed** (integration only) |
| **Duration** | ~2.25s |

---

## Final submission run (Sprint 6.2)

| Field | Value |
| ----- | ----- |
| **Date** | 2026-07-13 |
| **Context** | Sprint 6.2.3 final regression before hand-in |
| **Result** | **16 / 16 passed** |
| **Traceability** | [`ai-prompts/testing.md`](ai-prompts/testing.md), [`pr-description.md`](pr-description.md) |

API regression script (separate from Vitest): `regression-521-api.mjs` — **26/26** on 2026-07-13 (after re-seed). See [`docs/manual-regression-checklist.md`](docs/manual-regression-checklist.md).

---

## Scenarios covered

### Unit tests — `statusTransition.ts` (16 tests)

| Category | Count |
| -------- | ----- |
| `getAllowedTransitions` | 3 |
| Valid transitions (AC-17) | 5 |
| Invalid transitions (AC-18) | 6 |
| Terminal state guards | 2 |

### Integration tests (16 tests)

#### Valid transitions (AC-17) — 5 tests

| # | Transition | Expected |
| - | ---------- | -------- |
| 1 | Open → In Progress | 200 |
| 2 | In Progress → Resolved | 200 |
| 3 | Resolved → Closed | 200 |
| 4 | Open → Cancelled | 200 |
| 5 | In Progress → Cancelled | 200 |

#### Invalid transitions (AC-18) — 6 tests

| # | Transition | Expected |
| - | ---------- | -------- |
| 6 | Open → Resolved (skip) | 400 `INVALID_STATUS_TRANSITION` |
| 7 | Open → Closed (skip) | 400 `INVALID_STATUS_TRANSITION` |
| 8 | Resolved → Open (revert) | 400 `INVALID_STATUS_TRANSITION` |
| 9 | Closed → In Progress | 400 `INVALID_STATUS_TRANSITION` |
| 10 | Cancelled → In Progress | 400 `INVALID_STATUS_TRANSITION` |
| 11 | Cancelled → Closed | 400 `INVALID_STATUS_TRANSITION` |

#### API guards and validation — 5 tests

| # | Scenario | Expected |
| - | -------- | -------- |
| 12 | `PATCH /tickets/:id` with `status` field | 400 `STATUS_NOT_ALLOWED_HERE` |
| 13 | `GET /tickets?status=Invalid` | 400 `INVALID_FILTER` |
| 14 | `POST /tickets` without title | 400 `VALIDATION_ERROR` |
| 15 | `GET /tickets/99999` | 404 `NOT_FOUND` |
| 16 | `POST /tickets` malformed JSON (EC-19) | 400 `VALIDATION_ERROR` |

---

## How to reproduce

```bash
cd server
# Prerequisites: PostgreSQL running, migrations applied, server/.env set
npm run test
```

Expected: `Tests 32 passed (32)`, exit code 0.

Further detail: [`test-strategy.md`](test-strategy.md).

---

*Honest test evidence for exercise evaluation. Re-run and update the "Latest run" section before final hand-in if code changes.*
