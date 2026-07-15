# Reflection — Support Ticket Management System

**Date:** 2026-07-13  
**Exercise:** JS AI Capability Exercise — Part A  
**Primary AI tool:** Cursor  
**Traceability:** AC-23, DOC-10

---

## What I Built

The project delivered a working full-stack **Support Ticket Management System** with backend-enforced status state machine, comments, search/filter, integration tests, and complete exercise artifacts.

| Layer | Deliverable |
| ----- | ----------- |
| **Backend** | Express REST API — users, tickets CRUD, dedicated status endpoint, comments, search/filter |
| **State machine** | `statusTransition.ts` — 5 valid transitions; terminal states; invalid → 400 |
| **Frontend** | React (Vite) — list, dashboard, create, detail, edit, status change, comments |
| **Database** | PostgreSQL + Prisma — migrations, seed (3 users, 5 tickets, 6 comments) |
| **Tests** | 16 integration tests (Vitest + Supertest) — AC-17, AC-18 |
| **Artifacts** | Requirements, design notes, implementation plan, prompt history, testing/debugging/reflection docs |

The exercise goal was not one-shot code generation but **visible, explainable AI-assisted engineering** — prompt history, iteration, defects, and manual verification are all documented.

### Architecture — what I can explain

| Topic | Explanation |
| ----- | ----------- |
| **State machine** | Five valid transitions in `statusTransition.ts`; terminal states (Closed, Cancelled) reject all changes; UI shows hints only |
| **Status endpoint** | `PATCH /api/tickets/:id/status` only — general PATCH rejects `status` → 400 `STATUS_NOT_ALLOWED_HERE` (DD-04) |
| **Layers** | Routes → controllers → services → Prisma; Zod at API boundary |
| **Search** | PostgreSQL `ILIKE` on title + description; invalid status filter → 400 |
| **No auth** | Documented v1 limitation; not a workaround |

### Testing philosophy

- **Integration tests** — Mandatory for state machine (AC-17, AC-18); hit HTTP layer, not just unit tests
- **Manual regression** — 33 UI/API cases; catches UX and integration gaps tests miss
- **Edge-case sampling** — EC matrix found DEF-001; fixed before submission
- **Honest deferrals** — EC-17 (DB down) not simulated; logged, not hidden

---

## How I Used AI (across the lifecycle)

Cursor was used across analysis, design, implementation, testing, debugging, and documentation. **I remained the decision maker** on architecture, open questions, scope, and every Quality Gate.

| Phase | How AI was used |
| ----- | --------------- |
| **Analysis** | Drafted `requirements-analysis.md` from assignment; surfaced OQ-01–15 |
| **Design** | Produced design notes, implementation plan, acceptance criteria, cursor rules |
| **Implementation** | Task-by-task code generation (backend → frontend) with developer approval between tasks |
| **Testing** | Integration test suite, regression scripts, manual checklist |
| **Debugging** | Edge-case matrix; root-cause trace for DEF-001 |
| **Documentation** | README, testing notes, PR description, this reflection |

---

## What AI Helped With Most

| Area | AI contribution | Outcome |
| ---- | --------------- | ------- |
| **Requirements** | First draft of `requirements-analysis.md` from assignment | Comprehensive FR/BR/AC coverage; OQs surfaced for human resolution |
| **Design** | Full workflow artifact set (`design-notes.md`, `implementation-plan.md`, acceptance criteria, cursor rules) | Implementation-ready blueprint before any app code |
| **Backend** | Express + Prisma scaffold, validators, services, state machine | Thin controllers, single `statusTransition.ts` source of truth |
| **Frontend** | React components, hooks, API layer, routing | Consistent patterns; loading/error states |
| **Tests** | Vitest + Supertest integration suite (16 scenarios) | AC-17/AC-18 satisfied |
| **QA artifacts** | Manual regression checklist, API scripts, debugging notes | Repeatable verification; DEF-001 found and fixed |
| **Documentation** | README, testing notes, tool-workflow updates | Faster than writing from scratch; required accuracy review |

**Strongest fit:** Repetitive, pattern-following work — CRUD endpoints, Zod validators, React form components, test matrices — where the spec was already clear.

---

## What AI Got Wrong

Summary of AI mistakes or gaps that required human correction. Detail per item: see **How I Validated AI Output** below.

| AI mistake / gap | What happened |
| ---------------- | ------------- |
| **Prisma 7.8 schema** | Generated `url` in `schema.prisma` — deprecated; migrate failed until `prisma.config.ts` + adapter |
| **DEF-001 (EC-19)** | Initial `errorHandler` missed JSON parse errors — 500 until edge-case QA in Sprint 5.2.3 |
| **UI first pass** | List UI too plain — needed iteration and mockup-aligned layout (Sprint 4.2) |
| **Scope drift** | AI suggested soft delete, auth, pagination — rejected to keep v1 core scope |
| **Build hygiene** | Unused import in `PageHeader.tsx` — caught at client QG build |
| **Environment** | Agent shell had stale `DATABASE_URL` — migrations failed until local `.env` fixed |

---

## How I Validated AI Output

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

**Pattern:** AI output was a **draft**, not truth. I validated against `design-notes.md`, ran curls/tests, and rejected or iterated when behavior did not match requirements.

**Also validated manually (no AI):**

- Created PostgreSQL database and local `server/.env` (never committed)
- Final approval on all 15 OQ resolutions and design decisions
- Manual persistence verification (marker ticket survived server restart)
- PostgreSQL service restart (admin-required step)
- Sprint approvals and Quality Gate sign-offs
- Judgment calls on deferred items (ERR-05 / EC-17 DB-unavailable test not run)

---

## What I Would Improve Next

### Prompt and workflow

1. **Progressive context** — `@` references to `requirements-analysis.md`, `design-notes.md`, `implementation-plan.md` kept sessions aligned without relying on chat memory alone.
2. **Task-scoped prompts** — One task ID per session (e.g. "proceed with 3.2.1") reduced scope creep.
3. **Role + constraints** — "Senior Business Analyst", "Do NOT implement stretch features" produced structured outputs.
4. **Critique prompts** — Asking AI to challenge OQ decisions (Sprint 1.1) was more valuable than blind acceptance.
5. **Quality Gate stops** — Developer approval between tasks prevented compounding errors.

**What I would do differently:** Run `db:seed` before API regression scripts when integration tests ran recently — document test/seed ordering in README (now noted in troubleshooting).

### Lessons for future projects

| Lesson | Detail |
| ------ | ------ |
| **Spec before code** | Phases 1–2 prevented rework; AI implemented faster because constraints were clear |
| **One source of truth** | Status rules in one file — AI tried to add logic in controllers early on; rules caught it |
| **Verify, don't trust** | Every sprint had a Quality Gate with curls, builds, or tests |
| **Document as you go** | `prompt-history/` at sprint end is easier than reconstructing |
| **Iteration is evidence** | Reviewers want to see prompts improved, not perfect first outputs |
| **Environment matters** | Windows paths, ports, and shell env vars caused more friction than AI code quality |

---

## Reusable Workflow (prompts, rules, specs, templates)

The workflow used on this project is **documented as a portable template** for the next exercise or greenfield app.

| Reuse asset | Location | What it provides |
| ----------- | -------- | ---------------- |
| **Reusable workflow playbook** | [`docs/reusable-workflow.md`](reusable-workflow.md) | Folder skeleton, 8 prompt templates (A–H), validation/QG checklists, adaptation guide |
| **Generic implementation prompt** | `tool-specific/cursor-workflow/implementation-plan.md` | Copy-paste prompt for every implementation task |
| **Permanent Cursor rules** | `.cursor/rules/` + `cursor-rules-or-instructions.md` | Stack and architecture enforcement |
| **Sprint prompt logs** | `prompt-history/` | Pattern for honest verbatim logging at Quality Gate |

**How I would reuse it:** Copy folder structure → run requirement analysis template → freeze planning (`implementation-plan.md` v2) → one-task-at-a-time implementation with developer approval → sprint QG + prompt history → submission artifacts (reflection, code-review-notes, this template updated for the new domain).

See [`docs/reusable-workflow.md`](reusable-workflow.md) for full copy-paste prompts and the new-project checklist.

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
- [`docs/reusable-workflow.md`](reusable-workflow.md) — portable prompt and workflow template

---

*Honest reflection for exercise evaluation. AI accelerated delivery; architectural and quality decisions remained with the developer.*
