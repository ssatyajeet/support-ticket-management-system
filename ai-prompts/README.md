# AI Prompts — Activity Portfolio

**Project:** Support Ticket Management System  
**Exercise:** JS AI Capability Exercise  
**Date:** 2026-07-16  
**Traceability:** AC-20, DOC-09

Curated prompts grouped by **lifecycle activity** (per submission guideline). This folder is the **primary prompt archive** for reviewer evaluation.

---

## Folder structure

```
ai-prompts/
├── README.md
├── planning.md          # Requirements, scope, execution plan, acceptance criteria
├── design.md            # Technical spec, architecture, design decisions
├── implementation.md    # Backend + frontend code generation
├── testing.md           # Integration tests, manual QA, persistence
├── debugging.md         # Defect discovery and fix
├── code-review.md       # Review and rejection of AI suggestions
└── documentation.md     # README, workflow, reflection, submission artifacts
```

---

## Portfolio scope

| File | Sprints covered | QG evidence |
| ---- | --------------- | ----------- |
| `planning.md` | 1.1, 2.1 | Planning freeze at `implementation-plan.md` v2.0 |
| `design.md` | 2.1 | `design-notes.md` v1.1 |
| `implementation.md` | 3.2–4.4 | Curl/build QG per sprint in `tool-workflow.md` |
| `testing.md` | 5.1, 5.2, 6.2 | `test-results.md`, manual checklist, scripts |
| `debugging.md` | 5.2 | DEF-001 in `debugging-notes.md` |
| `code-review.md` | 2.1, 4.2 | `code-review-notes.md` |
| `documentation.md` | 2.1, 6.1, 6.2 | README, reflection, PR artifact, API reference |

Not every interaction is included. Each entry captures: prompt, AI summary, accepted/changed/rejected, iteration, and context discipline.

---

## Activity index

| Activity | File | Highlights |
| -------- | ---- | ---------- |
| Planning | [planning.md](planning.md) | BA analysis, OQ critique, implementation-plan v1→v2 |
| Design | [design.md](design.md) | design-notes iteration, stack decision |
| Implementation | [implementation.md](implementation.md) | State machine, CRUD, UI three-pass |
| Testing | [testing.md](testing.md) | Integration suite, regression, edge cases |
| Debugging | [debugging.md](debugging.md) | DEF-001 EC-19 |
| Code review | [code-review.md](code-review.md) | Spec review, arch rejections, build hygiene |
| Documentation | [documentation.md](documentation.md) | README, reflection, PR artifact, `docs/api.md` |

---

## Entry fields (per prompt)

- Prompt (verbatim or honest summary)
- AI response summary
- What I accepted / changed
- What I rejected / why
- Iteration (Yes/No)
- Context shared / not shared

---

## Context not shared with AI

| Never pasted into prompts | Where it lives |
| ------------------------- | -------------- |
| Real `DATABASE_URL` credentials | `server/.env` (gitignored) |
| API keys, tokens, passwords | Local `.env` only |

---

## Honesty notes

| Gap | How addressed |
| --- | ------------- |
| Sprint 5.2.1 / 5.2.2 verbatim prompts unavailable | Outcomes in [`docs/manual-regression-checklist.md`](../docs/manual-regression-checklist.md) + `server/scripts/regression-521-api.mjs` + persistence scripts — see `testing.md` Prompt 2 |
| Short prompts (`proceed`, `go ahead`) | Valid when scope is frozen in `implementation-plan.md`; use **continuation template** in [`docs/reusable-workflow.md`](../docs/reusable-workflow.md) §Template I |

---

*Workflow narrative: [`tool-workflow.md`](../tool-workflow.md). Continuation prompt template: [`docs/reusable-workflow.md`](../docs/reusable-workflow.md).*
