# Testing — AI Prompts

**Activity:** Integration tests, manual QA, persistence verification  
**Sprints:** 5.1, 5.2, 6.2 (final regression)  
**Source archives:** [`prompt-history/sprint-5.1.md`](../prompt-history/sprint-5.1.md), [`prompt-history/sprint-5.2.md`](../prompt-history/sprint-5.2.md), [`prompt-history/sprint-6.2.md`](../prompt-history/sprint-6.2.md)

---

### Prompt 1 — Integration test suite (5.1)

**Source:** sprint-5.1.md — Prompt 1 | **Task:** 5.1.1–5.1.6

**Prompt:**

> start the sprint 5.1 all task 5.1.1 5.1.2 to 5.1.6

**AI response summary:**
- Extracted `app.ts` for Supertest; Vitest config; DB truncate/seed harness; 15 integration scenarios; `docs/testing-notes.md`; 15/15 passed.

**What I accepted:** Full mandatory matrix (valid/invalid transitions + guards).

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** `.cursor/rules/05-testing-standards.mdc`, design-notes testing scope | **Context not shared:** Real `DATABASE_URL`

---

### Prompt 2 — Manual regression (5.2.1–5.2.2)

**Source:** sprint-5.2.md — Prompt 1 | **Task:** 5.2.1, 5.2.2

**Prompt:** Transcript unavailable — outcomes documented in `manual-regression-checklist.md` and persistence scripts.

**AI response summary:**
- 33-case manual matrix; `regression-521-api.mjs` (26 API cases); persistence marker scripts; secrets audit.

**What I accepted:** Regression and persistence artifacts.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** acceptance criteria, implementation-plan | **Context not shared:** N/A

**Honesty:** Verbatim prompt not recovered from indexed transcript.

---

### Prompt 3 — Edge-case sampling (5.2.3)

**Source:** sprint-5.2.md — Prompt 2 | **Task:** 5.2.3

**Prompt:**

> @…/task_5.2.3_edge_cases_c8173b69.plan.md implement this task

**AI response summary:**
- `edge-cases-523-api.mjs`; Section M EC matrix (22 cases); EC-19 defect logged (malformed JSON → 500).

**What I accepted:** Edge-case coverage artifacts.

**What I rejected / why:** **Rejected** fixing EC-19 in same prompt — deferred to Task 5.2.4.

**Iteration:** Yes | **Context shared:** `@…plan.md` | **Context not shared:** N/A

---

### Prompt 4 — Validation after fix (5.2.4–5.2.5)

**Source:** sprint-5.2.md — Prompt 3 | **Task:** 5.2.4, 5.2.5

**Prompt:**

> proceed with 5.2.4 , 5.2.5 task from @implementation-plan.md

**AI response summary:**
- DEF-001 fix; EC-19 integration test; acceptance criteria updated; 16/16 tests.

**What I accepted:** Defect fix + criteria sync.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** `@implementation-plan.md` | **Context not shared:** N/A

---

### Prompt 5 — Final regression (6.2)

**Source:** sprint-6.2.md | **Task:** 6.2.3

**Prompt:** `approved andd proceed with 6.2`

**AI response summary:** `npm run test` 16/16; API regression 26/26 after re-seed.

**What I accepted:** Submission-ready test evidence.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** Prior sprint context | **Context not shared:** N/A

**Lesson:** Re-seed after integration tests truncate tables.
