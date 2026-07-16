# Prompt History

AI-assisted development log for the Support Ticket Management System exercise (AC-20, DOC-09).

This folder records how AI (Cursor) was used during each sprint — prompts given, iterations made,
decisions taken by the developer, and what was accepted or changed.

**Curated activity view (reviewer-friendly):** [`ai-prompts/README.md`](../ai-prompts/README.md) — `planning.md`, `design.md`, `implementation.md`, `testing.md`, `debugging.md`, `code-review.md`, `documentation.md`.

**Logging policy:** One file per sprint at Quality Gate. Prompts are **verbatim** from the Cursor conversation transcript (see `.cursor/rules/prompt-history-sprint-log.mdc`). Developer review status recorded per session.

---

## Session Index

| Sprint | File | Date | Status |
| ------ | ---- | ---- | ------ |
| 1.1 — Requirements & Scope | [sprint-1.1.md](sprint-1.1.md) | 2026-07-07 | Verbatim (transcript) — Approved |
| 2.1 — Architecture & Spec | [sprint-2.1.md](sprint-2.1.md) | 2026-07-07 | Verbatim (transcript) — Approved |
| 3.1 — Server Foundation | [sprint-3.1.md](sprint-3.1.md) | 2026-07-09 | Verbatim (transcript) — Approved |
| 3.2 — Users & Ticket CRUD | [sprint-3.2.md](sprint-3.2.md) | 2026-07-09 | Verbatim (transcript) — Approved |
| 3.3 — Status State Machine | [sprint-3.3.md](sprint-3.3.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 3.4 — Comments, Search, Filter | [sprint-3.4.md](sprint-3.4.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 4.1 — Client Scaffold | [sprint-4.1.md](sprint-4.1.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 4.2 — Ticket List | [sprint-4.2.md](sprint-4.2.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 4.3 — Create & Detail | [sprint-4.3.md](sprint-4.3.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 4.4 — Update Status & Comments | [sprint-4.4.md](sprint-4.4.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 5.1 — Integration Tests | [sprint-5.1.md](sprint-5.1.md) | 2026-07-10 | Verbatim (transcript) — Approved |
| 5.2 — Manual QA | [sprint-5.2.md](sprint-5.2.md) | 2026-07-13 | Verbatim (transcript) — Approved |
| 6.1 — README & Workflow | [sprint-6.1.md](sprint-6.1.md) | 2026-07-13 | Verbatim (transcript) — Approved |
| 6.2 — Reflection & Submit | [sprint-6.2.md](sprint-6.2.md) | 2026-07-13 | Verbatim (transcript) — Approved |

---

## Session File Format

Each session file uses this structure:

```markdown
# Prompt History — Sprint X.Y: <Title>
**Date / Sprint / Status / Tasks covered / Traceability**

> Retroactive log notice (if applicable)

## Goal
## Tasks Completed  (table: Task ID | Summary | Outcome)
## Prompts Log      (table: # | Reconstructed intent | Output summary | Accepted? | Rejected?)
## Developer decisions made during this sprint
## What I did without AI assistance
## Files changed
## Requirements traced
## Quality Gate result
## Developer review
```

---

## Quick reference — what reviewers look for

- Prompts show **iteration**, not one-shot output
- Developer made **explicit decisions** (especially OQs and arch choices)
- Some AI output was **changed or rejected** (honest ownership) — each prompt logs **What I rejected / why**
- Requirements are **traced** to AC / FR / BR IDs
- History is **honest** — no fabricated sessions
- **Activity portfolio:** [`ai-prompts/`](../ai-prompts/) — curated by lifecycle (requirements → submission)

---

*For requirement authority see `requirements-analysis.md`.
For execution order see `implementation-plan.md`.
For AI collaboration rules see `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`.*
