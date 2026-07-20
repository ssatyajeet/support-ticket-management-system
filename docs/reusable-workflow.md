# Reusable AI Workflow — Template from Support Ticket Management System

**Author:** Satyajeet Singh  
**Date:** 2026-07-15  
**Source project:** Support Ticket Management System (JS AI Capability Exercise)  
**Primary AI tool:** Cursor  
**Traceability:** `assignment.md` Part A — “How the workflow would be reused”; stretch list — “Reusable AI prompt templates”

---

## Purpose

This document is a **portable playbook** extracted from a completed exercise. Use it to start the next full-stack, AI-assisted project without rebuilding the workflow from scratch.

It is a **floor, not a ceiling** — adapt names, stack details, and sprint breakdown to the new assignment. The patterns below were validated on this repository (`ai-prompts/` portfolio, Sprint 2.1 planning freeze, Sprints 3–5 implementation).

**Companion artifacts in this repo (reference implementations):**

| Artifact | Location |
| -------- | -------- |
| Execution playbook | `implementation-plan.md` (v2.0 — Generic Cursor Prompt, QG template) |
| Permanent engineering rules | `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` |
| Lifecycle narrative | `tool-workflow.md` |
| Activity prompt portfolio | `ai-prompts/` (curated by lifecycle — primary reviewer view) |
| Code review pattern | `code-review-notes.md` |

---

## Quick start — new project in 30 minutes

1. Copy the **folder skeleton** (§Folder structure).
2. Paste `docs/assignment.md` (or equivalent brief) into the repo.
3. Run **Prompt Template A** (requirement analysis) — resolve open questions before design.
4. Run **Prompt Templates B–D** (design pack) — freeze planning before code.
5. Add `.cursor/rules/` from `cursor-rules-or-instructions.md` (adapt stack sections).
6. Create `implementation-plan.md` v1 → refactor to v2 with **Prompt Template E** (atomic tasks + generic implementation prompt).
7. Implement **one task at a time** with **Prompt Template F**; stop for developer approval each task.
8. At each sprint end: Quality Gate + update relevant `ai-prompts/{activity}.md` entry.
9. Before submission: reflection, code-review-notes, reusable-workflow (update this file for the new project).

---

## Folder structure (copy for next project)

```text
<project-root>/
├── client/                          # Frontend (maps to target src/)
├── server/                          # Backend API (maps to src/, tests/, database/)
├── database/                        # setup-notes.md + pointers to server/prisma/
├── tests/                           # README pointer to server/tests/
├── docs/
│   ├── assignment.md                # Exercise / product brief (input)
│   ├── manual-regression-checklist.md
│   ├── reusable-workflow.md       # This file
│   └── screenshots/
├── requirements-analysis.md         # Business authority (FR/BR/AC)
├── design-notes.md
├── api-contract.md
├── data-model.md
├── ui-flow.md
├── implementation-plan.md
├── acceptance-criteria.md
├── test-strategy.md
├── test-results.md
├── debugging-notes.md
├── code-review-notes.md
├── review-fixes.md
├── reflection.md
├── final-ai-usage-summary.md
├── pr-description.md
├── candidate-info.md
├── ai-prompts/
│   ├── README.md
│   ├── planning.md … documentation.md
├── tool-specific/
│   └── cursor-workflow/
│       ├── README.md                # Pointer to root docs
│       ├── project-context.md
│       └── cursor-rules-or-instructions.md
├── tool-workflow.md
├── .cursor/rules/
└── README.md
```

---

## Progressive context strategy

Supply context in **layers** — never ask AI to “remember” prior chats.

| Phase | `@` references in prompts |
| ----- | ------------------------- |
| Analysis | `docs/assignment.md` only |
| Requirements | `assignment.md` → output `requirements-analysis.md` |
| Design | `requirements-analysis.md`, `project-context.md`, `design-notes.md` |
| Implementation | Above + `implementation-plan.md`, `acceptance-criteria.md`, `cursor-rules-or-instructions.md` |
| Review / QA | `design-notes.md`, relevant source files, `acceptance-criteria.md` |

**Rule:** Each document is authoritative for its layer. Implementation prompts must not regenerate planning docs.

---

## Information not shared with AI

Carry this exclusion list to every project:

| Never paste into prompts | Where it lives |
| ------------------------ | -------------- |
| Real `DATABASE_URL` credentials | Local `.env` (gitignored) |
| API keys, tokens, passwords | Secret manager / `.env` only |
| Production URLs or customer data | N/A for exercises |
| Personal access tokens | Developer machine only |

Commit only `.env.example` with placeholders.

---

## Prompt templates

Replace `{PROJECT_NAME}`, `{TASK_ID}`, and paths as needed. Constraints in **bold** are the highest-value lines — they prevent common AI failures.

---

### Template A — Requirement analysis (Phase 1)

```text
You are acting as a Senior Business Analyst and Software Architect.

I am building {PROJECT_NAME}.

Read docs/assignment.md carefully.

Do NOT generate code.

Perform a complete requirement analysis and save it as requirements-analysis.md.

Include: overview, goals, functional/non-functional requirements, actors, entities,
relationships, business rules, validation, user stories, flows, edge cases, risks,
assumptions, acceptance criteria, and open questions (OQ-01…).

Think like a BA preparing documentation before development.
```

**Follow-up (human):** Resolve every open question in a separate prompt. Ask AI to challenge your decisions: *“Review my OQ resolutions — keep me honest.”*

---

### Template B — Technical specification (Phase 2)

```text
You are acting as a Senior Solution Architect.

Read requirements-analysis.md (approved v1.1).

Do NOT generate application code.

Produce design-notes.md: architecture, API contract, database schema,
modules, error handling, validation strategy, design decisions (DD-01…), and traceability to FR/BR.

Do not repeat the requirements-analysis document word-for-word.
```

---

### Template C — Acceptance criteria (verification doc)

```text
You are acting as a Senior QA Lead.

Read requirements-analysis.md and design-notes.md.

Do NOT generate application code.

Produce acceptance-criteria.md as a practical verification
checklist (MT / IT / CR / DR methods).

Do not simply copy the acceptance criteria from the requirement analysis —
reorganize into a verification document a developer can run sprint by sprint.
```

---

### Template D — Execution playbook v1 → v2 refactor

Use after a first `implementation-plan.md` draft exists. This project's **Prompt 10** in `ai-prompts/planning.md` produced `implementation-plan.md` v2.0 with atomic tasks and the Generic Implementation Prompt.

```text
You are acting as Principal Engineering Manager and AI Engineering Reviewer.

Review as single source of truth:
- requirements-analysis.md
- tool-specific/cursor-workflow/project-context.md
- design-notes.md
- acceptance-criteria.md
- tool-specific/cursor-workflow/cursor-rules-or-instructions.md
- implementation-plan.md (current)

Do NOT generate application code.
Do NOT rewrite project scope.

Refactor implementation-plan.md into a production-quality execution playbook:
1. Atomic task IDs (e.g. 3.1.1, 3.1.2)
2. Every task: objective, output, files, DoR, DoD
3. Developer review checkpoint after every task
4. Enhanced Quality Gate template + Rollback Rule
5. Standard Cursor Workflow (10 steps)
6. Generic Cursor Implementation Prompt (reusable for all implementation tasks)
7. Planning Freeze section
8. AI Validation Checklist
9. Git strategy (small logical commits)
10. Preserve FR/BR/AC traceability
```

---

### Template E — Generic implementation (every task)

**Canonical copy** lives in `implementation-plan.md` §Generic Cursor Implementation Prompt. Short form:

```text
You are implementing {PROJECT_NAME}.

Read: requirements-analysis.md, project-context.md, design-notes.md, acceptance-criteria.md,
cursor-rules-or-instructions.md, implementation-plan.md.

Identify the next incomplete Task ID. Implement ONLY that task.

Rules:
- Never skip or merge tasks
- No scope creep or stretch features unless approved
- Follow cursor-rules-or-instructions.md
- Stop after summarizing changes — wait for developer approval
```

**Developer command shortcuts** (from `implementation-plan.md`): `Start Next Task` · `Retry Current Task` · `Review Current Task` · `Run Quality Gate` · `Update Documentation`

---

### Template F — Code review (pre-QG or pre-submit)

```text
Review @{path/to/module} against @{design-notes.md or requirements-analysis.md §X}.

List: spec violations, security issues, architecture drift, and stretch suggestions.

For each finding: severity and recommended fix.

Do not change code — review only. I will accept or reject each suggestion.
```

Log outcomes in `code-review-notes.md`.

---

### Template G — Debugging with AI

```text
Defect: {symptom}
Expected: {from requirements-analysis or AC}
Actual: {HTTP status / error / behavior}
Repro: {curl or steps}

Read @{relevant service/controller/middleware}.

Root cause analysis only first — then propose minimal fix aligned with design-notes.md.
```

Log in `debugging-notes.md` with: Problem · Investigation · How AI helped · Validation · Final fix.

---

### Template H — Documentation honesty constraint

Use whenever AI drafts lifecycle docs (`tool-workflow.md`, reflection, `ai-prompts/` summaries):

```text
Only document activities that have actually been completed.
Do NOT invent future workflow or speculative sprints.
```

This constraint prevented fabricated content in Sprint 2.1 (`ai-prompts/planning.md`, Prompt 9).

---

### Template I — Continuation prompt (scope frozen)

Use when resuming work with a short directive — **never** send bare `proceed` without context:

```text
Proceed with Task {X.Y.Z} per @implementation-plan.md.

Context: Sprint {X.Y} QG passed for tasks through {X.Y.N-1} / artifact version {v}.
Constraints: Follow @.cursor/rules/{relevant-rule}.mdc — no stretch features.
Verify before marking complete: {test command | curl cases | checklist section}.
Acceptance criteria: {AC-IDs or criterion IDs for this task}.
```

**Example (this project):**

```text
Proceed with Task 5.2.4 per @implementation-plan.md.

Context: Sprint 5.2.3 edge-case sampling complete; DEF-001 logged in debugging-notes.md.
Constraints: Follow @.cursor/rules/03-backend-standards.mdc — minimal fix only.
Verify: curl malformed JSON returns 400 VALIDATION_ERROR; npm run test 32/32.
Acceptance criteria: ERR-04, EC-19.
```

Short prompts are acceptable when scope is frozen, but this template preserves auditability for reviewers.

---

## Per-task developer workflow

From `implementation-plan.md` §Standard Cursor Implementation Workflow:

| Step | Action |
| ---- | ------ |
| 1 | Read authoritative docs |
| 2 | Next incomplete Task ID only |
| 3 | Verify Definition of Ready |
| 4 | Implement one task |
| 5 | Complete AI Validation Checklist |
| 6 | Summarize + stop |
| 7 | Wait for developer approval |
| 8 | Update tasks, AC, tool-workflow, ai-prompts |
| 9 | Proceed |

---

## AI Validation Checklist (per task)

Copy into each task completion note:

- [ ] AI output reviewed — not blindly accepted
- [ ] Architecture matches `design-notes.md`
- [ ] Business rules (BR/FR) verified for this task
- [ ] Security: validation, no secrets, CORS/XSS considered
- [ ] Performance: N+1, query patterns, render loops
- [ ] Tests or manual verification run
- [ ] Docs updated (`implementation-plan.md`, `ai-prompts/`)
- [ ] Acceptance criteria IDs identified
- [ ] No future-sprint work included

---

## Sprint Quality Gate (end of every sprint)

Use **Enhanced Quality Gate Template** in `implementation-plan.md`:

- Requirements + AC verified
- Engineering standards + architecture compliance
- Security + performance review
- Tests passing
- Documentation sync (`implementation-plan.md`, `tool-workflow.md`, `ai-prompts/`)
- Developer review approved

**Rollback rule:** If QG fails → stop → fix → re-run → repeat. Do not start next sprint.

---

## Prompt portfolio discipline

At **sprint Quality Gate**, add or update the relevant file in `ai-prompts/` (e.g. `testing.md` after QA sprint). Use **Template I** for continuation prompts when scope is frozen in `implementation-plan.md`. See this repo's `ai-prompts/README.md`.

| Field per prompt | Content |
| ---------------- | ------- |
| Actual prompt | Verbatim from transcript |
| AI output | Summary (not full paste) |
| What I accepted / changed | Honest |
| Iteration needed | Yes / No |
| What I rejected + why | Required for strong submissions |

**Meaningful prompts to include:** context setting, iteration, review, correction, testing, debugging — skip one-word `proceed` unless it closes a documented task.

---

## Cursor rules pattern

1. Author `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` (human-reviewed).
2. Mirror into `.cursor/rules/*.mdc` for IDE enforcement.
3. Topics to cover: development workflow, backend, frontend, testing, git, documentation, project context.

Rules should encode **non-negotiables** (e.g. dedicated status endpoint, no secrets in Git) so implementation prompts stay short.

---

## Adaptation checklist — new project

| Step | Action |
| ---- | ------ |
| 1 | Replace `assignment.md` with new brief |
| 2 | Re-run Template A; resolve all OQs before code |
| 3 | Regenerate spec, AC, project-context for new domain |
| 4 | Build `implementation-plan.md` v2 with Template D |
| 5 | Update `.cursor/rules/` stack and domain language |
| 6 | Reset `ai-prompts/` activity index |
| 7 | Keep **workflow mechanics** (one task, QG, rollback, prompt logs) unchanged |

---

## What this project proved works

| Pattern | Evidence |
| ------- | -------- |
| Spec before code | Phases 1–2 complete before Sprint 3.1 |
| Generic implementation prompt | `implementation-plan.md` v2.0 — reduced need for long per-task prompts |
| Planning freeze | No scope drift after July 7, 2026 |
| Quality Gates | curl matrices (3.2, 3.3), integration tests (5.1), manual regression (5.2) |
| Constraint-heavy planning prompts | Sprint 2.1 — anti-copy, anti-speculation |
| Progressive `@` context | `tool-workflow.md` §Project Context |
| Honest deferrals | EC-17, stretch features — documented not hidden |

---

## What to improve next time

| Gap in this project | Reuse adjustment |
| ------------------- | ---------------- |
| Shallow per-task prompts (`proceed with X`) | Add one-line **task context** to Template E: objective + AC IDs |
| Mega-commits | Commit after each approved task per `implementation-plan.md` Git strategy |
| Code review not isolated early | Run Template F at mid-sprint, not only at submit |
| PORT / env drift | Add env alignment check to QG checklist |

---

## Related artifacts

- [`tool-workflow.md`](../tool-workflow.md) — how this workflow was applied on this project
- [`reflection.md`](reflection.md) — lessons learned
- [`implementation-plan.md`](../implementation-plan.md) — full Generic Prompt + QG template
- [`ai-prompts/planning.md`](../ai-prompts/planning.md) — playbook refactor prompts

---

*Reusable workflow template — derived from a completed exercise. Update this file when adapting for the next project.*
