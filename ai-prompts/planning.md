# Planning — AI Prompts

**Activity:** Requirements analysis, scope, execution plan, acceptance criteria  
**Sprints:** 1.1, 2.1 (planning portions)  
**Source archive:** [`prompt-history/sprint-1.1.md`](../prompt-history/sprint-1.1.md), [`prompt-history/sprint-2.1.md`](../prompt-history/sprint-2.1.md)

---

### Prompt 1 — Project structure (context only)

**Source:** sprint-1.1.md — Prompt 1 | **Task:** Pre-sprint

**Prompt:**

> Create the initial project structure… Do not generate application code. Do not create React or Express projects. Only create the project structure.

**AI response summary:**
- Created folder scaffold (`client/`, `server/`, `docs/`, `prompt-history/`, `tool-specific/cursor-workflow/`) and empty placeholder files.

**What I accepted:** Folder layout and explicit no-code constraint worked — prevented premature scaffolding.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** Folder/file list | **Context not shared:** N/A

---

### Prompt 2 — Full requirement analysis (BA persona)

**Source:** sprint-1.1.md — Prompt 2 | **Task:** 1.1.1–1.1.3

**Prompt:**

> You are acting as a Senior Business Analyst and Software Architect… Read docs/assignment.md… Perform a complete requirement analysis… Include: Project Overview, FR, NFR, Actors, Entities… Open Questions…

**AI response summary:**
- Produced `docs/requirements-analysis.md` v1.0 with FR-C/S, BR, validation, user stories, AC-01–23, OQ-01–15 as open questions.

**What I accepted:** Overall structure and traceability tables.

**What I rejected / why:** Left OQ-02 role naming and OQ-09/14 architecture as open — intentional; needed human round.

**Iteration:** Yes | **Context shared:** `@docs/assignment.md` | **Context not shared:** N/A

---

### Prompt 3 — OQ decisions + “keep me honest” critique

**Source:** sprint-1.1.md — Prompt 3 | **Task:** 1.1.4

**Prompt (excerpt):**

> OQ-01 Define as: Low, Medium, High, Critical… OQ-05 yes but soft delete… OQ-09 think like an architect… review it and keep me honest about my decisions

**AI response summary:**
- Critiqued OQ-02 (`user` role ambiguous), flagged OQ-05 soft delete as scope creep, compared status API patterns for OQ-09, explained concurrency for OQ-14.

**What I accepted:** Separate status endpoint; last-write-wins; defer soft delete.

**What I rejected / why:** Rejected soft delete in v1; rejected ambiguous `user` role label.

**Iteration:** Yes | **Context shared:** Numbered OQ answers | **Context not shared:** N/A

---

### Prompt 4 — Finalize OQ decisions and apply to document

**Source:** sprint-1.1.md — Prompts 4–5 | **Task:** 1.1.4–1.1.5

**Prompt:**

> O2 - go with recomendet one… Q5 - defer the delete… Q12 - PostgreSQL… do update the docs/requirements-analysis.md only

**AI response summary:**
- All 15 OQs finalized; `requirements-analysis.md` v1.1 Approved with §16 Design Decisions (Resolved).

**What I accepted:** All recommendations after Prompt 3 critique.

**What I rejected / why:** N/A — decisions closed.

**Iteration:** No | **Context shared:** Prior OQ thread | **Context not shared:** N/A

---

### Prompt 5 — implementation-plan v1.0 (rejected as final)

**Source:** sprint-2.1.md — Prompt 6 | **Task:** 2.1.8 predecessor

**Prompt (excerpt):**

> Create a comprehensive execution plan… implementation-plan.md… include check box… Agile… phases and sprints…

**AI response summary:**
- implementation-plan.md v1.0 — 6 phases, 14 sprints, coarse task checkboxes.

**What I accepted:** Phase/sprint structure as starting point.

**What I rejected / why:** **Rejected v1.0 as final** — tasks too coarse; needed atomic task IDs, Generic Cursor Prompt, Planning Freeze.

**Iteration:** Yes | **Context shared:** requirements-analysis, project-context, design-notes | **Context not shared:** N/A

---

### Prompt 6 — Refactor to execution playbook v2.0

**Source:** sprint-2.1.md — Prompt 10 | **Task:** 2.1.8

**Prompt (excerpt):**

> Refactor and improve implementation-plan.md into a production-quality execution playbook… 14 numbered improvements… Generic Cursor Prompt… Planning Freeze…

**AI response summary:**
- v2.0: atomic tasks (3.1.1…), Standard Workflow, AI Validation Checklist, Enhanced QG, Rollback Rule.

**What I accepted:** Entire v2.0 as planning freeze baseline.

**What I rejected / why:** N/A — addressed v1 rejection.

**Iteration:** No | **Context shared:** All workflow docs | **Context not shared:** N/A

---

### Prompt 7 — Acceptance criteria (anti-copy constraint)

**Source:** sprint-2.1.md — Prompt 7 | **Task:** 2.1.4

**Prompt (excerpt):**

> Do not simply copy acceptance criteria from requirements-analysis — reorganize into a practical verification document…

**AI response summary:**
- acceptance-criteria.md with verification methods (MT/IT/CR/DR), sprint mapping, release checklist.

**What I accepted:** Verification-focused reorganisation.

**What I rejected / why:** Rejected verbatim AC copy from requirements doc.

**Iteration:** No | **Context shared:** requirements-analysis, design-notes | **Context not shared:** N/A
