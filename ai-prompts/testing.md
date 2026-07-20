# Testing — AI Prompts

**Activity:** Integration tests, manual QA, persistence verification  
**Sprints:** 5.1, 5.2, 6.2 (final regression)  
**QG evidence:** [`tool-workflow.md`](../tool-workflow.md) — Sprints 5.1–5.2, 6.2; [`test-results.md`](../test-results.md); [`docs/manual-regression-checklist.md`](../docs/manual-regression-checklist.md)

---

### Prompt 1 — Integration + unit test suite (5.1)

**Task:** 5.1.1–5.1.7

**Prompt:**

> start the sprint 5.1 all task 5.1.1 5.1.2 to 5.1.7

**AI response summary:**
- Extracted `app.ts` for Supertest; Vitest config; DB truncate/seed harness; 16 integration scenarios; `tests/unit/statusTransition.test.ts` (16 unit cases); `test-strategy.md`; 32/32 passed.

**What I accepted:** Full mandatory matrix (valid/invalid transitions + guards).

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** `.cursor/rules/05-testing-standards.mdc`, design-notes testing scope | **Context not shared:** Real `DATABASE_URL`

---

### Prompt 2 — Manual regression (5.2.1)

**Task:** 5.2.1

**Prompt:** Transcript unavailable — task scoped from `@implementation-plan.md` Task 5.2.1 and `@acceptance-criteria.md`.

**AI response summary:**
- Built 33-case manual regression matrix in [`docs/manual-regression-checklist.md`](../docs/manual-regression-checklist.md) (Sections A–L).
- Created `server/scripts/regression-521-api.mjs` — 26 automated API checks covering list, create, detail, update, status, comments, filters, validation.
- Executed full matrix: **33/33 passed** — no defects found.

**What I accepted:** Checklist structure, API script, pass evidence in `tool-workflow.md`.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** `implementation-plan.md`, acceptance criteria | **Context not shared:** N/A

**Outcomes (verifiable without verbatim prompt):**

| Artifact | Result |
| -------- | ------ |
| Manual checklist Sections A–L | 33/33 pass |
| `regression-521-api.mjs` | 26/26 API cases pass |
| `test-results.md` | Recorded at Sprint 5.2 QG |

**Honesty:** Verbatim prompt not recovered from indexed transcript; outcomes documented in checklist and scripts.

---

### Prompt 3 — Persistence and secrets audit (5.2.2)

**Task:** 5.2.2

**Prompt:** Transcript unavailable — task scoped from `@implementation-plan.md` Task 5.2.2.

**AI response summary:**
- Persistence baseline/verify scripts: `persistence-522-baseline.mjs`, `persistence-522-verify.mjs`.
- Server restart verified — data survives API restart (AC-12).
- Secrets audit: `.env` gitignored; no credentials in git history (AC-14).
- PostgreSQL service restart deferred (ENV-001 — Windows admin required); documented in [`debugging-notes.md`](../debugging-notes.md).

**What I accepted:** Persistence scripts, secrets audit pass, honest ENV-001 deferral.

**What I rejected / why:** N/A — did not claim PG restart tested when admin access blocked.

**Iteration:** No | **Context shared:** `implementation-plan.md`, AC-12, AC-14 | **Context not shared:** Real `DATABASE_URL`

**Outcomes (verifiable without verbatim prompt):**

| Check | Result |
| ----- | ------ |
| AC-12 data persistence (server restart) | Pass |
| AC-14 secrets hygiene | Pass |
| PG service restart (DB-09) | Deferred — ENV-001 |

---

### Prompt 4 — Edge-case sampling (5.2.3)

**Task:** 5.2.3

**Prompt:**

> @…/task_5.2.3_edge_cases_c8173b69.plan.md implement this task

**AI response summary:**
- `edge-cases-523-api.mjs`; Section M EC matrix (22 cases); EC-19 defect logged (malformed JSON → 500).

**What I accepted:** Edge-case coverage artifacts.

**What I rejected / why:** **Rejected** fixing EC-19 in same prompt — deferred to Task 5.2.4.

**Iteration:** Yes | **Context shared:** `@…plan.md` | **Context not shared:** N/A

---

### Prompt 5 — Validation after fix (5.2.4–5.2.5)

**Task:** 5.2.4, 5.2.5

**Prompt:**

> proceed with 5.2.4 , 5.2.5 task from @implementation-plan.md

**AI response summary:**
- DEF-001 fix; EC-19 integration test; acceptance criteria updated; 16/16 tests.

**What I accepted:** Defect fix + criteria sync.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** `@implementation-plan.md` | **Context not shared:** N/A

**Note:** Short continuation prompt — scope frozen in implementation plan; see continuation template in `docs/reusable-workflow.md` §Template I.

---

### Prompt 6 — ERR-05 startup probe (5.2.6)

**Task:** 5.2.6

**Prompt:** Task scoped from `@implementation-plan.md` — add DB startup probe for EC-17.

**AI response summary:**
- `server/src/index.ts` — `$connect()` + `SELECT 1` probe; safe error log; `process.exit(1)` on failure.
- `server/scripts/verify-ec17-startup.ts` for repeatable check; ENV-003 logged in `debugging-notes.md`.
- ERR-05 marked Completed in `acceptance-criteria.md`.

**What I accepted:** Startup fails gracefully without leaking `DATABASE_URL`.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** `implementation-plan.md`, EC-17 | **Context not shared:** Real `DATABASE_URL`

---

### Prompt 7 — Final regression (6.2)

**Task:** 6.2.3

**Prompt:** `approved andd proceed with 6.2`

**AI response summary:** `npm run test` 32/32 (16 integration + 16 unit); API regression 26/26 after re-seed.

**What I accepted:** Submission-ready test evidence.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** Prior sprint context | **Context not shared:** N/A

**Lesson:** Re-seed after integration tests truncate tables.
