# Code Review — AI Prompts

**Activity:** Reviewing and correcting AI output  
**Sprints:** 2.1, 4.2  
**Sprints:** 2.1, 4.2  
**QG evidence:** [`code-review-notes.md`](../code-review-notes.md)  
**Written review:** [`code-review-notes.md`](../code-review-notes.md)

---

### Prompt 1 — Collaborative spec review (not blind accept)

**Source:** sprint-2.1.md — Prompt 4 | **Activity:** Design review

**Prompt:**

> i reviewed and lets discuss on these points
> 1. Specification should describe architecture, not lock exact versions.
> 2. Design Decisions…
> 3. Missing Risks & Trade-offs…

**AI response summary:** AI asked clarifying questions instead of guessing.

**What I accepted:** Using AI as reviewer after human read of v1.0.

**What I rejected / why:** Rejected version pins and missing DD/Risks in v1.0 spec.

**Iteration:** Yes | **Context shared:** Human-written numbered feedback | **Context not shared:** N/A

---

### Prompt 2 — Anti-pattern constraints (acceptance criteria)

**Source:** sprint-2.1.md — Prompt 7 | **Activity:** QA doc review

**Prompt (excerpt):**

> Do not simply copy acceptance criteria from requirements-analysis — reorganize into a practical verification document…

**AI response summary:** Verification checklist with MT/IT/CR/DR methods.

**What I accepted:** Practical verification structure.

**What I rejected / why:** Rejected verbatim copy from requirements-analysis.

**Iteration:** No | **Context shared:** requirements-analysis, design-notes | **Context not shared:** N/A

---

### Prompt 3 — Architecture review decisions (developer)

**Source:** code-review-notes.md | **Activity:** Implementation review

| Suggestion | Decision |
| ---------- | -------- |
| Client-side status transition guard | **Rejected** — violates DD-04 |
| React Query / SWR | **Rejected** — custom hooks sufficient for v1 |
| Correlation IDs in errors | **Rejected** — out of v1 scope |

**What I accepted:** Thin controllers, separate status endpoint, ILIKE search at DB layer.

**Iteration:** N/A | **Context shared:** design-notes, implemented files | **Context not shared:** N/A

---

### Prompt 4 — Build hygiene catch (4.2 QG)

**Source:** sprint-4.2.md — Prompt 4 | **Activity:** Pre-QG review

**Prompt:** `looks good now move to sprint 4.2 quality gates`

**AI response summary:** Removed unused `cn` import in `PageHeader.tsx` — build blocker.

**What I accepted:** Fix before QG sign-off.

**What I rejected / why:** N/A — caught at build, not shipped.

**Iteration:** No | **Context shared:** QG build step | **Context not shared:** N/A
