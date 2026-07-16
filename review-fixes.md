# Review Fixes — Support Ticket Management System

**Purpose:** Consolidated log of code and documentation changes made after AI-assisted or Quality Gate review.  
**Traceability:** AC-19–AC-23, TST-09, ERR-04  
**Detail:** [`code-review-notes.md`](code-review-notes.md) (review narrative) · [`debugging-notes.md`](debugging-notes.md) (DEF-001 investigation)

---

## Code fixes after review

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

## Defect fix (debugging)

### DEF-001 — Malformed JSON returns 500 instead of 400 (EC-19)

| Field | Detail |
| ----- | ------ |
| **Sprint** | 5.2.4 |
| **Severity** | Medium |
| **Status** | **Fixed** (2026-07-13) |

**Problem:** `POST /api/tickets` with body `{invalid` returned `500 INTERNAL_ERROR`.

**Root cause:** `express.json()` body-parser throws `SyntaxError` on malformed JSON; `errorHandler.ts` did not handle parse errors before the generic `INTERNAL_ERROR` branch.

**Fix:** Added `isJsonParseError()` guard in `server/src/middleware/errorHandler.ts` → `400 VALIDATION_ERROR`.

**Files changed:**

- `server/src/middleware/errorHandler.ts`
- `server/tests/integration/statusTransition.integration.test.ts` (EC-19 regression test)

**Verification:** `curl -d "{invalid"` → 400; `npm run test` → 16/16 passed.

---

## Documentation fixes

| ID | Sprint | Change |
| -- | ------ | ------ |
| DOC-PORT | 6.1 | README port alignment (`PORT` vs `VITE_API_URL`) |
| DOC-TEST | 6.1 | Test run evidence committed (`test-results.md`) |

---

## Deferred (not fixed in v1)

| Item | Reason |
| ---- | ------ |
| EC-17 DB-unavailable startup test | Manual env friction; logged in `debugging-notes.md` |
| ENV-001 PostgreSQL service restart | Windows admin required during 5.2.2 |
| ENV-002 Tier 2 edge-case script | PostgreSQL stopped during 5.2.3 sampling |

---

*Review narrative and rejected suggestions: [`code-review-notes.md`](code-review-notes.md).*
