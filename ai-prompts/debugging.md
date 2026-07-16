# Debugging — AI Prompts

**Activity:** Defect discovery and fix  
**Sprint:** 5.2  
**Source archive:** [`prompt-history/sprint-5.2.md`](../prompt-history/sprint-5.2.md)  
**Defect log:** [`debugging-notes.md`](../debugging-notes.md) — DEF-001

---

### Prompt 1 — Discover DEF-001 (EC-19)

**Source:** sprint-5.2.md — Prompt 2 | **Task:** 5.2.3

**Prompt:**

> @…/task_5.2.3_edge_cases_c8173b69.plan.md implement this task

**AI response summary:**
- Built edge-case sampler and EC matrix.
- **Flagged:** malformed JSON on `POST /api/tickets` returned **500** instead of **400**.

**What I accepted:** Defect logging and repro steps (`curl -d "{invalid"`).

**What I rejected / why:** Rejected immediate fix in 5.2.3 — separated to Task 5.2.4.

**Iteration:** Yes | **Context shared:** Edge-case plan file | **Context not shared:** N/A

---

### Prompt 2 — Root-cause investigation and fix (5.2.4)

**Source:** sprint-5.2.md — Prompt 3 | **Task:** 5.2.4

**Prompt:**

> proceed with 5.2.4 , 5.2.5 task from @implementation-plan.md

**AI response summary:**
- Traced: body-parser `SyntaxError` not handled in `errorHandler.ts` → 500.
- Proposed `isJsonParseError()` guard → 400 `VALIDATION_ERROR`.
- Created `docs/debugging-notes.md`; 16/16 tests pass.

**What I accepted:** Fix aligned with design-notes error code catalog.

**What I rejected / why:** N/A — validated with curl + integration test before approval.

**Iteration:** No | **Context shared:** `@implementation-plan.md` | **Context not shared:** N/A

---

### Prompt 3 — What I validated

| Check | Result |
| ----- | ------ |
| `curl -d "{invalid"` | 400 `VALIDATION_ERROR` |
| `npm run test` | 16/16 including EC-19 regression |
| Error code in catalog | `VALIDATION_ERROR` per design-notes |

---

### Deferred (honest gap)

| Item | Status |
| ---- | ------ |
| EC-17 DB unavailable (ERR-05) | Not simulated — logged in debugging-notes ENV-003 |
