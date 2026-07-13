# Reflection — Support Ticket Management System

**Date:** 2026-07-13  
**Exercise:** JS AI Capability Exercise — Part A  
**Primary AI tool:** Cursor  
**Traceability:** AC-23, DOC-10

---

## Purpose

This document is an honest reflection on how AI (Cursor) was used across the full engineering lifecycle — analysis, design, implementation, testing, debugging, and documentation — and what I learned as the developer who reviewed and approved all output.

---

## Summary

The project delivered a working full-stack Support Ticket Management System with backend-enforced status state machine, comments, search/filter, integration tests, and complete exercise artifacts. Cursor accelerated drafting and implementation; **I remained the decision maker** on architecture, open questions, scope, and every Quality Gate.

The exercise goal was not one-shot code generation but **visible, explainable AI-assisted engineering** — prompt history, iteration, defects, and manual verification are all documented.

---

## What AI did well

| Area | AI contribution | Outcome |
| ---- | --------------- | ------- |
| **Requirements** | First draft of `requirement-analysis.md` from assignment | Comprehensive FR/BR/AC coverage; OQs surfaced for human resolution |
| **Design** | Full workflow artifact set (`spec.md`, `tasks.md`, acceptance criteria, cursor rules) | Implementation-ready blueprint before any app code |
| **Backend** | Express + Prisma scaffold, validators, services, state machine | Thin controllers, single `statusTransition.ts` source of truth |
| **Frontend** | React components, hooks, API layer, routing | Consistent patterns; loading/error states |
| **Tests** | Vitest + Supertest integration suite (16 scenarios) | AC-17/AC-18 satisfied |
| **QA artifacts** | Manual regression checklist, API scripts, debugging notes | Repeatable verification; DEF-001 found and fixed |
| **Documentation** | README, testing notes, tool-workflow updates | Faster than writing from scratch; required accuracy review |

**Strongest fit:** Repetitive, pattern-following work — CRUD endpoints, Zod validators, React form components, test matrices — where the spec was already clear.

---

## What required manual correction or human decisions

| Topic | What happened | My action |
| ----- | ------------- | --------- |
| **Open questions (OQ-01–15)** | AI proposed options; not all matched exercise intent | Resolved roles (Agent/Manager/Admin), PostgreSQL, dedicated status endpoint, no delete in v1 |
| **Prisma 7.8** | Generated schema used deprecated `url` in schema file | Added `prisma.config.ts`, `@prisma/adapter-pg`, fixed seed config |
| **Database credentials** | Agent shell had stale `DATABASE_URL`; migrate failed | Ran migrations manually with correct local `.env` |
| **UI design** | Initial list UI was plain | Shared mockup reference; iterated on sidebar, dashboard, table view |
| **Build failure** | Unused import in `PageHeader.tsx` | Removed import before QG |
| **DEF-001 (EC-19)** | Malformed JSON returned 500 | Reviewed root cause; approved `errorHandler` fix |
| **Port alignment** | Local `PORT=3000` vs README default 3001 | Documented that `VITE_API_URL` must match `PORT` |
| **Regression after tests** | API regression failed 23/26 after `npm run test` truncated seed | Re-seeded before final regression — tests and scripts have different DB lifecycle |

**Pattern:** AI output was a **draft**, not truth. I validated against `spec.md`, ran curls/tests, and rejected or iterated when behavior did not match requirements.

---

## Prompt engineering — what worked

1. **Progressive context** — `@` references to `requirement-analysis.md`, `spec.md`, `tasks.md` kept sessions aligned without relying on chat memory alone.
2. **Task-scoped prompts** — One task ID per session (e.g. "proceed with 3.2.1") reduced scope creep.
3. **Role + constraints** — "Senior Business Analyst", "Do NOT implement stretch features" produced structured outputs.
4. **Critique prompts** — Asking AI to challenge OQ decisions (Sprint 1.1) was more valuable than blind acceptance.
5. **Quality Gate stops** — Developer approval between tasks prevented compounding errors.

**What I would do differently:** Run `db:seed` before API regression scripts when integration tests ran recently — document test/seed ordering in README (now noted in troubleshooting).

---

## What I did without AI assistance

- Created PostgreSQL database and local `server/.env` (never committed)
- Final approval on all 15 OQ resolutions and design decisions
- Manual persistence verification (marker ticket survived server restart)
- PostgreSQL service restart (admin-required step)
- Sprint approvals and Quality Gate sign-offs
- Judgment calls on deferred items (ERR-05 / EC-17 DB-unavailable test not run)
- This reflection — structure AI-assisted, judgments mine

---

## Architecture — what I can explain

| Topic | Explanation |
| ----- | ----------- |
| **State machine** | Five valid transitions in `statusTransition.ts`; terminal states (Closed, Cancelled) reject all changes; UI shows hints only |
| **Status endpoint** | `PATCH /api/tickets/:id/status` only — general PATCH rejects `status` → 400 `STATUS_NOT_ALLOWED_HERE` (DD-04) |
| **Layers** | Routes → controllers → services → Prisma; Zod at API boundary |
| **Search** | PostgreSQL `ILIKE` on title + description; invalid status filter → 400 |
| **No auth** | Documented v1 limitation; not a workaround |

---

## Testing philosophy

- **Integration tests** — Mandatory for state machine (AC-17, AC-18); hit HTTP layer, not just unit tests
- **Manual regression** — 33 UI/API cases; catches UX and integration gaps tests miss
- **Edge-case sampling** — EC matrix found DEF-001; fixed before submission
- **Honest deferrals** — EC-17 (DB down) not simulated; logged, not hidden

---

## Lessons for future AI-assisted projects

| Lesson | Detail |
| ------ | ------ |
| **Spec before code** | Phases 1–2 prevented rework; AI implemented faster because constraints were clear |
| **One source of truth** | Status rules in one file — AI tried to add logic in controllers early on; rules caught it |
| **Verify, don't trust** | Every sprint had a Quality Gate with curls, builds, or tests |
| **Document as you go** | `prompt-history/` at sprint end is easier than reconstructing |
| **Iteration is evidence** | Reviewers want to see prompts improved, not perfect first outputs |
| **Environment matters** | Windows paths, ports, and shell env vars caused more friction than AI code quality |

---

## Submission readiness (self-assessment)

| Criterion | Status |
| --------- | ------ |
| Working app (core AC-01–AC-18) | Yes — verified in Sprint 5.2 + final regression |
| Exercise artifacts (AC-19–AC-23) | Yes — this file completes AC-23 |
| Can explain AI vs manual work | Yes — see `tool-workflow.md` and `prompt-history/` |
| Stretch features | Not implemented — core scope prioritized per assignment |

---

## Related artifacts

- [`tool-workflow.md`](../tool-workflow.md) — lifecycle AI workflow narrative
- [`prompt-history/`](../prompt-history/) — verbatim sprint prompt logs
- [`docs/testing-notes.md`](testing-notes.md) — how to run tests
- [`docs/debugging-notes.md`](debugging-notes.md) — defects and fixes
- [`docs/pr-description.md`](pr-description.md) — submission PR artifact

---

*Honest reflection for exercise evaluation. AI accelerated delivery; architectural and quality decisions remained with the developer.*
