# Final AI Usage Summary — Support Ticket Management System

**Exercise:** JS AI Capability Exercise  
**Primary AI tool:** Cursor  
**Date:** 2026-07-16  
**Traceability:** AC-20, AC-23, DOC-09, DOC-10

Concise rollup of AI usage across the project lifecycle. Full detail in [`tool-workflow.md`](tool-workflow.md) and [`reflection.md`](reflection.md).

---

## Tool and approach

| Item | Detail |
| ---- | ------ |
| **Tool** | Cursor (IDE-integrated pair programming) |
| **Developer role** | Decision maker on architecture, scope, OQ resolutions, every Quality Gate |
| **Context strategy** | Progressive `@` file references — assignment → requirements → design → implementation plan → cursor rules |
| **Task discipline** | One implementation-plan task per session; stop for developer approval |

---

## Lifecycle coverage

| Phase | AI contribution | Human validation |
| ----- | --------------- | ---------------- |
| **Analysis** | Drafted `requirements-analysis.md` from assignment; surfaced OQ-01–15 | Resolved roles, PostgreSQL, dedicated status endpoint, no delete in v1 |
| **Design** | design-notes, implementation-plan, acceptance-criteria, cursor rules | v1.1 updates: DD-01–11, risks, removed version pins |
| **Implementation** | Backend + frontend task-by-task code generation | Curl/build/test at each sprint QG |
| **Testing** | 16 integration tests, regression scripts, manual checklist | 16/16 pass; 33/33 manual regression |
| **Debugging** | Edge-case matrix; DEF-001 root-cause trace | Approved `errorHandler` fix |
| **Code review** | Spec review, architecture rejections | Documented in `code-review-notes.md` |
| **Documentation** | README, PR description, reflection, prompt history | Accuracy review before submission |

---

## What AI helped most

- Repetitive pattern work: CRUD endpoints, Zod validators, React forms, test matrices
- First drafts of planning artifacts before any app code
- Faster documentation than writing from scratch

---

## What AI got wrong (corrected)

| Issue | Resolution |
| ----- | ---------- |
| Prisma 7.8 `url` in schema | `prisma.config.ts` + `@prisma/adapter-pg` (CR-01) |
| Malformed JSON → 500 (DEF-001) | `errorHandler` parse guard (CR-06) |
| UI first pass too plain | Iterated layout in Sprint 4.2 (CR-05) |
| Scope drift (auth, pagination, soft delete) | Rejected — v1 core only |
| Unused import build failure | Removed before QG (CR-04) |

See [`review-fixes.md`](review-fixes.md) for full fix log.

---

## Information not shared with AI

| Never pasted | Where it lives |
| ------------ | -------------- |
| Real `DATABASE_URL` credentials | `server/.env` (gitignored) |
| API keys, tokens, passwords | Local `.env` only |

---

## Prompt history and portfolio

| Location | Purpose |
| -------- | ------- |
| [`prompt-history/`](prompt-history/) | Sprint-by-sprint **verbatim archive** (Sprints 1.1–6.2) — source of truth |
| [`ai-prompts/`](ai-prompts/) | **Activity-grouped portfolio** for reviewer evaluation |

**Honesty note:** Sprint 5.2.1/5.2.2 verbatim prompts unavailable — outcomes in `docs/manual-regression-checklist.md` + persistence scripts. Short prompts (`proceed`, `go ahead`) valid when scope is in `implementation-plan.md`.

---

## Reuse for future projects

Portable playbook: [`docs/reusable-workflow.md`](docs/reusable-workflow.md)  
Cursor execution template: [`implementation-plan.md`](implementation-plan.md) §Generic Cursor Implementation Prompt

---

*Full lifecycle narrative: [`tool-workflow.md`](tool-workflow.md). Honest reflection: [`reflection.md`](reflection.md).*
