# Prompt History

AI-assisted development log for the Support Ticket Management System exercise (AC-20, DOC-09).

This folder records how AI (Cursor) was used during each sprint — prompts given, iterations made,
decisions taken by the developer, and what was accepted or changed.

**Logging policy:** One file per sprint. Retroactive entries are clearly marked.
Prompts are summarized by intent (not pasted verbatim). Developer review status recorded per session.

---

## Session Index

| Sprint | File | Date | Status |
| ------ | ---- | ---- | ------ |
| 1.1 — Requirements & Scope | [sprint-1.1.md](sprint-1.1.md) | 2026-07-07 | Verbatim (transcript) — Approved |
| 2.1 — Architecture & Spec | [sprint-2.1.md](sprint-2.1.md) | 2026-07-07 | Verbatim (transcript) — Approved |
| 3.1 — Server Foundation | [sprint-3.1.md](sprint-3.1.md) | 2026-07-09 | Verbatim (transcript) — Approved |
| 3.2 — Users & Ticket CRUD | *(coming)* | — | Pending |
| 3.3 — Status State Machine | *(coming)* | — | Pending |
| 3.4 — Comments, Search, Filter | *(coming)* | — | Pending |
| 4.1 — Client Scaffold | *(coming)* | — | Pending |
| 4.2 — Ticket List | *(coming)* | — | Pending |
| 4.3 — Create & Detail | *(coming)* | — | Pending |
| 4.4 — Update Status & Comments | *(coming)* | — | Pending |
| 5.1 — Integration Tests | *(coming)* | — | Pending |
| 5.2 — Manual QA | *(coming)* | — | Pending |
| 6.1 — README & Workflow | *(coming)* | — | Pending |
| 6.2 — Reflection & Submit | *(coming)* | — | Pending |

---

## Session File Format

Each session file uses this structure:

```markdown
# Prompt History — Sprint X.Y: <Title>
**Date / Sprint / Status / Tasks covered / Traceability**

> Retroactive log notice (if applicable)

## Goal
## Tasks Completed  (table: Task ID | Summary | Outcome)
## Prompts Log      (table: # | Reconstructed intent | Output summary | Accepted?)
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
- Some AI output was **changed or rejected** (honest ownership)
- Requirements are **traced** to AC / FR / BR IDs
- History is **honest** — no fabricated sessions

---

*For requirement authority see `docs/requirement-analysis.md`.
For execution order see `tool-specific/cursor-workflow/tasks.md`.
For AI collaboration rules see `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`.*
