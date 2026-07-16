# AI Prompts — Activity Portfolio

**Project:** Support Ticket Management System  
**Exercise:** JS AI Capability Exercise  
**Date:** 2026-07-16  
**Traceability:** AC-20, DOC-09

Curated prompts grouped by **lifecycle activity** (per submission guideline). Each file links back to verbatim sprint logs in `prompt-history/` when available.

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

## Relationship to `prompt-history/`

| Folder | Purpose |
| ------ | ------- |
| **`prompt-history/`** | Sprint-by-sprint **verbatim archive** (source of truth) |
| **`ai-prompts/`** | **Activity-grouped portfolio** for reviewer evaluation |

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
| Documentation | [documentation.md](documentation.md) | README, reflection, PR artifact |

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
| Sprint 5.2.1 / 5.2.2 verbatim prompts unavailable | Outcomes in `manual-regression-checklist.md` + persistence scripts |
| Short prompts (`proceed`, `go ahead`) | Valid when scope is in `implementation-plan.md` |

---

*Sprint archive: [`prompt-history/README.md`](../prompt-history/README.md). Workflow: [`tool-workflow.md`](../tool-workflow.md).*
