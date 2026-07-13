# Debugging Notes — Support Ticket Management System

**Last updated:** 2026-07-13  
**Sprint:** 5.2 — Manual QA & Defect Fix (Task 5.2.4)

---

## Overview

This document records defects found during manual regression and edge-case sampling (Sprint 5.2), their root causes, fixes applied, and any deferred items requiring developer follow-up.

**Related artifacts:**

- [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) — Sections L (persistence), M (edge cases)
- [`docs/testing-notes.md`](testing-notes.md) — Test setup and edge-case procedures
- [`server/scripts/edge-cases-523-api.mjs`](../server/scripts/edge-cases-523-api.mjs) — Tier 2 API sampler

---

## Defect log

### DEF-001 — Malformed JSON returns 500 instead of 400 (EC-19)

| Field | Detail |
| ----- | ------ |
| **ID** | DEF-001 |
| **Edge case** | EC-19 |
| **Acceptance criteria** | ERR-04, AC-13 |
| **Severity** | Medium |
| **Found in** | Task 5.2.3 — `curl -d "{invalid"` against `POST /api/tickets` |
| **Status** | **Fixed** (2026-07-13) |

#### Symptom

```http
POST /api/tickets
Content-Type: application/json

{invalid
```

**Before fix:**

```json
HTTP 500
{ "error": { "message": "Internal server error", "code": "INTERNAL_ERROR" } }
```

**Expected:** `400` with a parse error message per `requirement-analysis.md` EC-19.

#### Root cause

`express.json()` delegates body parsing to `body-parser`. When JSON is syntactically invalid, the parser throws a `SyntaxError` with `status: 400` and `type: 'entity.parse.failed'`. This error was not handled in `errorHandler.ts` and fell through to the generic `INTERNAL_ERROR` branch.

#### Fix

Added `isJsonParseError()` guard in `server/src/middleware/errorHandler.ts` to detect body-parser parse failures and return:

```json
HTTP 400
{ "error": { "message": "Invalid JSON in request body", "code": "VALIDATION_ERROR" } }
```

Used `VALIDATION_ERROR` to stay within the project's defined error code set (`spec.md` §15).

#### Verification

| Method | Result |
| ------ | ------ |
| `curl -d "{invalid"` | 400 `VALIDATION_ERROR` |
| Integration test `POST /tickets with malformed JSON` | 16/16 tests pass |

**Files changed:**

- `server/src/middleware/errorHandler.ts` — parse error handling
- `server/tests/integration/statusTransition.integration.test.ts` — EC-19 regression test

---

## Environment / manual follow-ups (not code defects)

These items were blocked or require admin/manual steps on the developer machine. They are **not** open code defects.

| ID | Item | Notes | Owner action |
| -- | ---- | ----- | ------------ |
| ENV-001 | PostgreSQL service restart (L2, DB-09) | `Restart-Service postgresql-x64-17` denied without admin during 5.2.2 | Run verify script after service restart — see checklist Section L |
| ENV-002 | Tier 2 edge-case script (EC-04–10, 12–13, 15) | PostgreSQL stopped during 5.2.3 sampling | `Start-Service postgresql-x64-17`, `npm run db:seed`, run `edge-cases-523-api.mjs` |
| ENV-003 | DB unavailable startup (EC-17, ERR-05) | Not exercised in Sprint 5.2 | Set invalid `DATABASE_URL`, confirm graceful startup log without secret leak |

---

## Sprint 5.2 summary

| Category | Count |
| -------- | ----- |
| Defects found | 1 (DEF-001) |
| Defects fixed | 1 |
| Open critical/high defects | 0 |
| Environment follow-ups | 3 (manual) |

**Regression (5.2.1):** 33/33 cases passed — no defects.  
**Persistence (5.2.2):** Secrets audit passed; server restart verified; PG restart deferred (ENV-001).  
**Edge cases (5.2.3):** 1 code defect (DEF-001); Tier 2 API cases blocked by ENV-002.

---

## Traceability

| ID | Coverage |
| ---- | -------- |
| TST-09 | This document |
| ERR-04 | DEF-001 fix + verification |
| EC-19 | DEF-001 |
| AC-13 | Input validation includes malformed JSON rejection |
