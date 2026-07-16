# Documentation — AI Prompts

**Activity:** README, workflow docs, reflection, PR artifact, reusable workflow  
**Sprints:** 2.1, 6.1, 6.2  
**Source archives:** [`prompt-history/sprint-2.1.md`](../prompt-history/sprint-2.1.md), [`prompt-history/sprint-6.1.md`](../prompt-history/sprint-6.1.md), [`prompt-history/sprint-6.2.md`](../prompt-history/sprint-6.2.md)

---

### Prompt 1 — tool-workflow honesty rule

**Source:** sprint-2.1.md — Prompt 9 | **Activity:** Workflow doc discipline

**Prompt (excerpt):**

> Only document activities that have actually been completed. Do NOT invent future workflow.

**AI response summary:** tool-workflow.md with Pending sections — no fabricated future work.

**What I accepted:** Honest partial documentation pattern.

**What I rejected / why:** **Rejected** speculative future-sprint content.

**Iteration:** No | **Context shared:** Completed work only | **Context not shared:** N/A

---

### Prompt 2 — README and workflow (6.1)

**Source:** sprint-6.1.md — Prompt 1 | **Task:** 6.1.1–6.1.5

**Prompt:**

> please proceed with 6.1 tasks from @implementation-plan.md

**AI response summary:**
- Complete `README.md`; `tool-workflow.md` v1.8; `prompt-history/README.md` updated.
- Verified: 16/16 tests, server + client build, health endpoint.

**What I accepted:** README and workflow sync.

**What I rejected / why:** N/A — verified by following README steps.

**Iteration:** No | **Context shared:** `@implementation-plan.md` | **Context not shared:** Real `.env` credentials

---

### Prompt 3 — Reflection and PR artifact (6.2)

**Source:** sprint-6.2.md — Prompt 1 | **Task:** 6.2.1–6.2.5

**Prompt:** `approved andd proceed with 6.2`

**AI response summary:**
- `reflection.md` (AC-23); `pr-description.md` (DOC-11).
- Final regression; Project Completion Checklist signed off.

**What I accepted:** Submission artifacts structure.

**What I rejected / why:** N/A — developer reviewed for honesty before approval.

**Iteration:** No | **Context shared:** Prior sprint approval | **Context not shared:** N/A

---

### Prompt 4 — Reusable workflow and ai-prompts structure

**Source:** reflection.md, assignment guideline | **Activity:** Meta-documentation

**Developer action:**
- `docs/reusable-workflow.md` — portable prompt templates A–H.
- `ai-prompts/` — activity-grouped portfolio per submission guideline:
  `planning.md`, `design.md`, `implementation.md`, `testing.md`, `debugging.md`, `code-review.md`, `documentation.md`.
- `prompt-history/` retained as sprint verbatim archive.

**What I accepted:** Dual structure — sprint archive + guideline-aligned activity files.

**What I rejected / why:** N/A

**Iteration:** N/A | **Context shared:** Full artifact set | **Context not shared:** N/A
