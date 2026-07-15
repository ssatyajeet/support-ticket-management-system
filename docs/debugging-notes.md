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
- [`docs/reusable-workflow.md`](reusable-workflow.md) — Template G (debugging with AI) for future projects

---

## Issue 1 — DEF-001: Malformed JSON returns 500 instead of 400 (EC-19)

| Field | Detail |
| ----- | ------ |
| **ID** | DEF-001 |
| **Edge case** | EC-19 |
| **Acceptance criteria** | ERR-04, AC-13 |
| **Severity** | Medium |
| **Found in** | Task 5.2.3 — `curl -d "{invalid"` against `POST /api/tickets` |
| **Status** | **Fixed** (2026-07-13) |

### Problem

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

**Expected:** `400` with a parse error message per `requirements-analysis.md` EC-19.

### How I Investigated

1. Reproduced with `curl -d "{invalid"` against `POST /api/tickets` (Task 5.2.3 edge-case sampling).
2. Confirmed response was **500** `INTERNAL_ERROR`, not **400**.
3. Traced the failure path: `express.json()` → body-parser throws `SyntaxError` with `status: 400` and `type: 'entity.parse.failed'` when JSON is syntactically invalid.
4. Found `errorHandler.ts` did not handle parse errors — they fell through to the generic `INTERNAL_ERROR` branch.

### How AI Helped

| Step | Detail |
| ---- | ------ |
| **Discovery (Task 5.2.3)** | Cursor built the edge-case matrix (Section M in manual checklist), `edge-cases-523-api.mjs`, and documented EC-19 repro steps. AI output flagged that malformed JSON returned **500** instead of **400**. |
| **Investigation** | AI traced the failure path: body-parser `SyntaxError` not handled before generic `INTERNAL_ERROR` branch in `errorHandler.ts`. |
| **Fix proposal (Task 5.2.4)** | AI proposed `isJsonParseError()` guard returning `400` `VALIDATION_ERROR` — aligned with spec error code set. |

### What I Validated

- Re-ran `curl` with `{invalid` body — confirmed **400** after fix (not 500).
- Ran `cd server && npm run test` — **16/16** integration tests pass, including EC-19 regression test.
- Verified error code matches `design-notes.md` §15 (`VALIDATION_ERROR`, not a new ad-hoc code).

### Final Fix

Added `isJsonParseError()` guard in `server/src/middleware/errorHandler.ts` to detect body-parser parse failures and return:

```json
HTTP 400
{ "error": { "message": "Invalid JSON in request body", "code": "VALIDATION_ERROR" } }
```

Used `VALIDATION_ERROR` to stay within the project's defined error code set (`design-notes.md` §15).

**Verification:**

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

| ID | Item | Notes | Owner action | How AI helped |
| -- | ---- | ----- | ------------ | ------------- |
| ENV-001 | PostgreSQL service restart (L2, DB-09) | `Restart-Service postgresql-x64-17` denied without admin during 5.2.2 | Run verify script after service restart — see checklist Section L | N/A — manual Windows admin step |
| ENV-002 | Tier 2 edge-case script (EC-04–10, 12–13, 15) | PostgreSQL stopped during 5.2.3 sampling | `Start-Service postgresql-x64-17`, `npm run db:seed`, run `edge-cases-523-api.mjs` | N/A — environment blocked script execution |
| ENV-003 | DB unavailable startup (EC-17, ERR-05) | Not exercised in Sprint 5.2 | Set invalid `DATABASE_URL`, confirm graceful startup log without secret leak | N/A — deferred manual test |

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
