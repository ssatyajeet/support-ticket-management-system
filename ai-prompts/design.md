# Design — AI Prompts

**Activity:** Technical specification, architecture, design decisions  
**Sprint:** 2.1  
**Sprints:** 2.1  
**QG evidence:** [`tool-workflow.md`](../tool-workflow.md) — Planning Freeze section

---

### Prompt 1 — Create design-notes.md v1.0

**Source:** sprint-2.1.md — Prompt 3 | **Task:** Pre-2.1.3

**Prompt (excerpt):**

> You are acting as a Senior Solution Architect… Using @docs/requirements-analysis.md… create design-notes.md… Do not repeat requirements word-for-word…

**AI response summary:**
- Full technical spec v1.0: stack, API, Prisma schema, frontend components — but included exact version pins.

**What I accepted:** Section structure and API traceability.

**What I rejected / why:** Rejected version pins in spec; rejected missing Design Decisions and Risks sections.

**Iteration:** Yes | **Context shared:** `@docs/requirements-analysis.md` | **Context not shared:** N/A

---

### Prompt 2 — Structured spec review feedback

**Source:** sprint-2.1.md — Prompt 4 | **Task:** Pre-2.1.3 iteration

**Prompt:**

> i reviewed and lets discuss on these points
> 1. Specification should describe architecture, not lock exact versions.
> 2. Design Decisions… DD-01 REST API over GraphQL…
> 3. Missing Risks & Trade-offs
> 4. Remove Appendix C…

**AI response summary:**
- Asked clarifying questions (OQ cross-refs in DD? update project-context? create tasks now?).

**What I accepted:** Used AI as collaborative reviewer with numbered feedback.

**What I rejected / why:** Did not let AI guess answers — responded precisely in Prompt 3.

**Iteration:** Yes | **Context shared:** Human review findings | **Context not shared:** N/A

---

### Prompt 3 — Apply spec refinements (v1.1)

**Source:** sprint-2.1.md — Prompt 5 | **Task:** Pre-2.1.3

**Prompt:**

> 1. Technical-only with OQ cross-refs, 2. single § Risks & Trade-offs, 3. update project-context.md, 4. implementation-plan in separate step, 5. no

**AI response summary:**
- design-notes.md v1.1: DD-01–11, Risks & Trade-offs, versions removed; project-context.md synced.

**What I accepted:** Compact numbered answers to AI questions.

**What I rejected / why:** N/A.

**Iteration:** No | **Context shared:** Clarification answers | **Context not shared:** N/A

---

### Prompt 4 — Stack decision (React + Express)

**Source:** sprint-2.1.md — Pre-2.1.2 | **Task:** Architecture

**Prompt (pattern):** Developer challenged AI stack comparison; chose React + Express over Next.js full-stack.

**AI response summary:**
- Compared Next.js vs split client/server for exercise scope, testability, and API boundary clarity.

**What I accepted:** Split monorepo per DD-03 — clearer Supertest integration and exercise alignment.

**What I rejected / why:** Rejected Next.js full-stack for this exercise (scope and testing simplicity).

**Iteration:** Yes | **Context shared:** assignment.md, requirements-analysis | **Context not shared:** N/A
