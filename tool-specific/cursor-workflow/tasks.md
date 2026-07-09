# Execution Playbook — Support Ticket Management System

**Document Version:** 2.0  
**Date:** July 7, 2026  
**Owner:** Single developer (AI-assisted)  
**Status:** Living document — **progress updates only** after v2.0 (see Planning Freeze)  
**Sources:** `docs/requirement-analysis.md`, `project-context.md`, `spec.md`, `acceptance-criteria.md`, `cursor-rules-or-instructions.md`

> **How to use:** Find the next incomplete **Task ID**. Implement **only that task**. Pass **Developer Review** and **Quality Gate** before proceeding. Update progress checkboxes, `acceptance-criteria.md`, and `prompt-history/` after each sprint.

---

# Standard Cursor Implementation Workflow

Apply this workflow for **every implementation task** (Sprint 3.1 onward):

| Step | Action |
| ---- | ------ |
| 1 | Read authoritative docs: `requirement-analysis.md`, `spec.md`, `acceptance-criteria.md`, `cursor-rules-or-instructions.md`, this playbook |
| 2 | Identify the **next incomplete Task ID** (lowest number not marked complete) |
| 3 | Verify **Definition of Ready** for that task |
| 4 | Implement **ONLY** that task — no future tasks, no scope creep |
| 5 | Follow engineering standards (Clean Code, SOLID pragmatic, security, spec architecture) |
| 6 | Complete **AI Validation Checklist** |
| 7 | **Stop.** Summarize changes, decisions, assumptions, security, performance, trade-offs |
| 8 | **Wait for developer approval** before starting the next task |
| 9 | After approval: update `tasks.md`, `acceptance-criteria.md` (if verified), `tool-workflow.md`, `prompt-history/`, README (if setup changed) |
| 10 | Proceed to next task only after approval |

**Hard rules:**

- One task per Cursor session unless developer explicitly approves batching
- Never skip Developer Review checkpoint
- Never implement stretch features until Project Completion Checklist core items pass
- If Quality Gate fails → apply **Rollback Rule** (see each sprint)

---

# Development Rules

The following rules govern every implementation task throughout the project.

## Task Execution Rules

- `tasks.md` is the single source of truth for implementation.
- Never skip a task.
- Never reorder tasks unless the developer explicitly approves.
- Never merge multiple tasks into one implementation.
- Implement only one task at a time.
- Do not implement future sprint work.
- Do not change project scope or architecture.
- Do not regenerate planning documents.

## Review Rules

Before starting any task:

- Review the previous completed task.
- Review any developer feedback.
- Verify all dependencies are satisfied.
- Verify the Definition of Ready.
- Resolve any unresolved issues before continuing.

## Implementation Rules

During implementation:

- Follow all engineering standards defined in `cursor-rules-or-instructions.md`.
- Follow the architecture defined in `spec.md`.
- Keep changes limited to the current task.
- Avoid unnecessary refactoring outside the current task.
- Keep commits focused on one logical change.

## Completion Rules

After completing the task:

- Stop immediately.
- Summarize all changes.
- Explain important engineering decisions.
- Explain security considerations.
- Explain performance considerations.
- Explain assumptions and trade-offs.
- Request developer review.
- Wait for explicit approval before continuing.

# Generic Cursor Implementation Prompt

You are implementing the Support Ticket Management System.

Before making any changes:

1. Read the following documents:

- docs/requirement-analysis.md
- tool-specific/cursor-workflow/project-context.md
- tool-specific/cursor-workflow/spec.md
- tool-specific/cursor-workflow/acceptance-criteria.md
- tool-specific/cursor-workflow/cursor-rules-or-instructions.md
- tool-specific/cursor-workflow/tasks.md

2. Review the previously completed task.

3. Review any developer feedback from the previous task.

4. Verify:

- Previous task is complete.
- Developer has approved the previous implementation.
- Dependencies for the next task are satisfied.
- Definition of Ready has been met.

5. Identify the next incomplete Task ID (lowest numbered incomplete task).

6. Implement ONLY that task.

Rules:

- Never skip tasks.
- Never implement future tasks.
- Never merge multiple tasks.
- Do not change project scope.
- Do not modify architecture.
- Do not regenerate planning documents.
- Keep changes focused only on the current task.
- Follow all engineering standards defined in cursor-rules-or-instructions.md.

After implementation:

1. Summarize all changes.
2. List all modified files.
3. Explain important engineering decisions.
4. Explain security considerations.
5. Explain performance considerations.
6. Explain assumptions.
7. Explain trade-offs.
8. List the Acceptance Criteria addressed.
9. List any remaining work for the current sprint.
10. Ask the developer to review the implementation.
11. Stop and wait for explicit approval before proceeding.

---

# Developer Commands

Use these commands during implementation:

- **Start Next Task** — Implement the next incomplete task.
- **Retry Current Task** — Re-implement the current task using the latest feedback.
- **Review Current Task** — Review the current implementation without making changes.
- **Refactor Current Task** — Improve the current task without changing functionality.
- **Run Quality Gate** — Perform all Quality Gate checks for the current sprint.
- **Update Documentation** — Update tasks.md, acceptance-criteria.md, tool-workflow.md, README, and prompt-history where applicable.
- **Prepare Commit** — Summarize completed work and suggest a Git commit message.

-----

# Planning Freeze

**Effective:** Document v2.0 (July 7, 2026)

| Rule | Detail |
| ---- | ------ |
| **Frozen artifacts** | `requirement-analysis.md`, `project-context.md`, `spec.md`, `acceptance-criteria.md` (structure), `cursor-rules-or-instructions.md` |
| **Allowed updates** | Progress checkboxes in this file; criterion **Status** in `acceptance-criteria.md`; `tool-workflow.md` pending sections; `README.md`; `prompt-history/`; testing/debugging/reflection docs |
| **Not allowed** | Regenerating planning docs; changing OQ decisions; changing stack (DD-01–DD-11); adding features without requirement change |
| **Exception** | If assignment requirements change, update `requirement-analysis.md` first, then propagate to spec with developer approval |

Future work = **execute tasks + update progress**, not re-plan.

---

# AI Validation Checklist

Complete after **every implementation task** before requesting developer review:

### AI Validation

- [ ] AI output reviewed by developer (not blindly accepted)
- [ ] Architecture verified against `spec.md`
- [ ] Business rules verified (BR/FR references for this task)
- [ ] Security reviewed (input validation, no secrets, CORS, XSS)
- [ ] Performance reviewed (queries, N+1, unnecessary re-renders)
- [ ] Tests executed or manual verification performed (as applicable)
- [ ] Documentation updated (`tasks.md`, `prompt-history/`, others if applicable)
- [ ] Acceptance criteria IDs identified and verifiable
- [ ] No future sprint work included in this task

---

# Git Strategy

| Rule | Guidance |
| ---- | -------- |
| **When to commit** | After developer approves a task OR after Quality Gate passes (sprint end) |
| **Commit size** | One logical change per commit; match Suggested Git Commit Plan where possible |
| **Commit message** | `feat(scope):`, `fix:`, `test:`, `docs:`, `chore:` prefixes |
| **Never commit** | `.env`, secrets, broken code, failing tests (unless WIP branch explicitly agreed) |
| **Branching** | Feature branch per sprint recommended; merge when Quality Gate passes |
| **History** | Readable, incremental — aligned with task IDs |

---

# Project Summary

## Project Objective

Deliver a working **Support Ticket Management System** (core scope) and complete all **JS AI Capability Exercise** lifecycle artifacts — demonstrating responsible, explainable AI-assisted development from analysis through submission.

**Core application outcomes:**

- Full-stack app: React client + Express API + PostgreSQL
- Ticket lifecycle with backend-enforced status state machine
- Comments, search, status filter, seeded users
- Mandatory integration tests for status transitions

**Exercise outcomes:**

- Visible prompt history, testing/debugging notes, reflection, PR artifacts
- Ability to explain architecture, decisions, and AI usage

## Delivery Approach

| Aspect | Approach |
| ------ | -------- |
| **Methodology** | Agile — phased delivery with atomic tasks and sprint Quality Gates |
| **Prioritization** | Core requirements (AC-01–AC-18) before stretch |
| **AI usage** | Cursor for generation; developer validates every task |
| **Quality** | Mandatory Quality Gate + Rollback Rule at end of every sprint |
| **Traceability** | Tasks mapped to FR / BR / AC / acceptance-criteria IDs |
| **Execution** | One task at a time with developer approval |

**Estimated total effort:** 8–12 hours (core application) + 4–6 hours (artifacts) = **~12–18 hours** self-paced.

## Assumptions

- [ ] Single developer with Node.js LTS, PostgreSQL, and Cursor available locally
- [x] Core planning artifacts approved before implementation sprints
- [ ] Stretch features **not** started until Project Completion Checklist core items pass
- [x] `prompt-history/` updated honestly after meaningful AI interactions
- [x] No secrets committed to Git (`.env` gitignored)

## Overall Implementation Strategy

1. **Plan & design first** — complete (Phases 1–2)
2. **Backend before frontend** — API + state machine + tests before UI
3. **State machine is sacred** — `statusTransition.ts` + integration tests before status UI
4. **Atomic tasks** — one logical step per task; developer review between tasks
5. **Document as you go** — sync docs after each sprint
6. **Quality Gate every sprint** — no unverified carry-forward

**Dependency chain:**

```
Planning ✓ → Design ✓ → DB schema → API (users → tickets → status → comments → search)
  → Integration tests → Frontend (list → create → detail → edit → status → comments)
  → E2E manual QA → Submission artifacts
```

---

# Enhanced Quality Gate Template

Every sprint ends with this gate. Sprint-specific traceability items are listed per sprint.

### Quality Gate Checklist (All Sprints)

- [ ] **Requirements:** Sprint deliverables mapped to FR/BR/AC verified
- [ ] **Acceptance criteria:** Relevant IDs in `acceptance-criteria.md` updated to Completed
- [ ] **Engineering standards:** `cursor-rules-or-instructions.md` followed
- [ ] **Architecture compliance:** Matches `spec.md` (layers, endpoints, schema)
- [ ] **SOLID / Clean Code:** Thin controllers, services own logic, no duplication
- [ ] **Security review:** Validation server-side; no secrets; CORS; XSS considered
- [ ] **Performance review:** No obvious N+1; reasonable query patterns
- [ ] **API consistency:** Error shape, status codes, DTO contracts per spec §12
- [ ] **Tests:** Manual and/or automated per sprint — all passing
- [ ] **AI Validation Checklist:** Completed for all tasks in sprint
- [ ] **Documentation:** `tasks.md`, `tool-workflow.md`, `prompt-history/` updated
- [ ] **README:** Updated if setup/run steps changed
- [ ] **Developer review:** All sprint tasks approved

### Rollback Rule (All Sprints)

**If Quality Gate fails:**

1. **Stop** implementation — do not start next sprint
2. **Fix** issues identified in gate review
3. **Re-run** applicable tests and manual verification
4. **Repeat** Quality Gate until all items pass
5. **Only then** proceed to next sprint

---

# Delivery Roadmap

---

## Phase 1 — Planning & Analysis

**Phase goal:** Establish business and technical understanding; approve scope and decisions.  
**Phase status:** [x] Complete

### Sprint 1.1 — Requirements & Scope Baseline

**Sprint status:** [x] Complete  
**Sprint goal:** Approved requirement analysis with resolved OQ-01–OQ-15 and AC traceability.  
**Estimated effort:** 2–3 hours

#### Prerequisites

- [x] `docs/assignment.md` reviewed
- [x] Repository initialized

#### Atomic Tasks (Completed)

| Task ID | Summary | Status |
| ------- | ------- | ------ |
| 1.1.1 | Analyze assignment scope (core vs stretch) | [x] |
| 1.1.2 | Document FR, NFR, entities, relationships | [x] |
| 1.1.3 | Define business rules, validation, user stories | [x] |
| 1.1.4 | Resolve OQ-01–OQ-15 with developer review | [x] |
| 1.1.5 | Produce `docs/requirement-analysis.md` v1.1 | [x] |
| 1.1.6 | Define AC-01–AC-23 | [x] |

#### Quality Gate — Sprint 1.1

- [x] Requirements verified against assignment
- [x] OQ decisions documented (§16)
- [x] AC-01–AC-23 traceable
- [ ] Prompt history updated (deferred to Sprint 2.1 closeout)

#### Deliverables

- [x] `docs/requirement-analysis.md` v1.1

#### Git Commit Plan

```
docs: add requirement analysis v1.1 with resolved design decisions
```

#### Sprint Exit Criteria

- [x] All OQ-01–OQ-15 resolved
- [x] Ready for system design

---

## Phase 2 — System Design

**Phase goal:** Implementation-ready architecture and Cursor workflow artifacts.  
**Phase status:** [x] Complete

### Sprint 2.1 — Architecture & Technical Specification

**Sprint status:** [x] Complete  
**Sprint goal:** Complete Cursor workflow artifacts; close design phase for implementation.  
**Estimated effort:** 2–3 hours  
**Traceability:** AC-19, AC-21, DOC-01–DOC-08, FND-05

#### Prerequisites

- [x] Sprint 1.1 complete
- [x] `requirement-analysis.md` approved

---

#### Sprint 2.1 Notes

**Task 2.1.1 — Gap review (2026-07-07): PASS**

- All FR-C-01 through FR-C-24 mapped to `spec.md` sections; no blocking gaps.
- All BR-01 through BR-17 reflected in spec §14; OQ-01 through OQ-15 aligned.
- No contradictions on status API, field lengths, search, concurrency, or deferred features.
- Optional doc polish only (Appendix A granularity); no spec edits required.
- **Developer approval:** Approved.

**Task 2.1.2 — Folder structure and env plan (2026-07-07): CONFIRMED**

- Repository layout matches `spec.md` §8 and `project-context.md` §6.
- Top-level: `client/`, `server/`, `docs/`, `tool-specific/`, `prompt-history/`, root `README.md`, `.gitignore`, `.env.example` (created in Sprint 3.1 / 6.1).
- `client/`: Vite + React + TS — `src/api`, `components/`, `pages/`, `types/`, `hooks/`, `utils/`.
- `server/`: Express + TS — `src/{config,controllers,services,routes,validators,middleware,types,lib}`, `prisma/`, `tests/integration/`.
- **Environment variables (for `.env.example` in Sprint 3.1):**

| Variable | Location | Purpose | Example |
| -------- | -------- | ------- | ------- |
| `DATABASE_URL` | `server/.env` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/support_tickets` |
| `PORT` | `server/.env` | API listen port | `3001` |
| `CLIENT_URL` | `server/.env` | CORS allowed origin | `http://localhost:5173` |
| `VITE_API_URL` | `client/.env` | Frontend API base URL | `http://localhost:3001/api` |

- Secrets stay in `.env` (gitignored); only `.env.example` templates committed.
- **Developer approval:** Approved.

---

#### Task 2.1.1 — Gap review: spec vs requirements

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | AC-21, NFR-10 |

**Objective:** Confirm `spec.md` covers all FR-C requirements with no contradictions.

**Expected output:** Short gap list (or "none") documented in sprint notes; any gaps fixed in spec with developer approval.

**Files expected to change:** `tool-specific/cursor-workflow/spec.md` (only if gaps found)

**Dependencies:** Task 1.1.5

**Definition of ready:** `requirement-analysis.md` v1.1 and `spec.md` v1.1 exist.

**Definition of done:** Every FR-C-01–24 mapped to spec section; no unresolved contradictions.

**Developer review required:** Summarize mapping; list any spec edits; wait for approval.

---

#### Task 2.1.2 — Confirm folder structure and env plan

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | FND-01, spec §8 |

**Objective:** Validate `client/` and `server/` layout matches spec; document env variable plan.

**Expected output:** Confirmed folder plan; env vars listed for `.env.example` (no files created yet unless approved).

**Files expected to change:** None (planning only) or sprint notes in this file

**Dependencies:** Task 2.1.1

**Definition of ready:** Spec §8 reviewed.

**Definition of done:** Developer confirms structure; `DATABASE_URL`, `PORT`, `CLIENT_URL`, `VITE_API_URL` documented.

**Developer review required:** Present env plan; wait for approval.

---

#### Task 2.1.3 — Create root `.gitignore`

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | FND-02, AC-14 |

**Objective:** Prevent secrets and build artifacts from being committed.

**Expected output:** Root `.gitignore` excluding `.env`, `node_modules`, `dist`, build output.

**Files expected to change:** `.gitignore`

**Dependencies:** Task 2.1.2

**Definition of ready:** Env plan agreed.

**Definition of done:** `.gitignore` covers server and client patterns; verified not ignoring required files.

**Developer review required:** Show `.gitignore` contents; security rationale; wait for approval.

---

#### Task 2.1.4 — Finalize `acceptance-criteria.md`

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | AC-21, DOC-05 |

**Objective:** Verification checklist usable throughout implementation.

**Expected output:** `acceptance-criteria.md` with feature criteria, sprint mapping, release checklist.

**Files expected to change:** `tool-specific/cursor-workflow/acceptance-criteria.md`

**Dependencies:** Task 1.1.6

**Definition of ready:** AC-01–AC-23 defined in requirement analysis.

**Definition of done:** Document complete; planning-phase DOC items marked appropriately.

**Developer review required:** *(Completed — confirm still accurate.)*

---

#### Task 2.1.5 — Finalize `cursor-rules-or-instructions.md`

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | AC-21, DOC-06 |

**Objective:** Permanent Cursor engineering rules for implementation phase.

**Expected output:** Complete cursor rules document.

**Files expected to change:** `tool-specific/cursor-workflow/cursor-rules-or-instructions.md`

**Dependencies:** Task 2.1.1

**Definition of done:** Rules align with spec architecture and assignment Part A.

**Developer review required:** *(Completed — confirm still accurate.)*

---

#### Task 2.1.6 — Create `tool-workflow.md`

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | AC-21, DOC-08, Part A assignment |

**Objective:** Record completed AI workflow; mark implementation sections Pending.

**Expected output:** Root `tool-workflow.md` v1.0.

**Files expected to change:** `tool-workflow.md`

**Definition of done:** Only completed work documented; Code Generation+ marked Pending.

**Developer review required:** *(Completed — confirm still accurate.)*

---

#### Task 2.1.7 — Initialize `prompt-history/`

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | AC-20, DOC-09 |

**Objective:** Create prompt log structure for exercise submission.

**Expected output:** `prompt-history/README.md` or first session log with date, purpose, prompts summary.

**Files expected to change:** `prompt-history/*`

**Dependencies:** Tasks 2.1.4–2.1.6

**Definition of done:** Folder exists with at least one entry covering planning phase.

**Developer review required:** Show structure; wait for approval.

---

#### Task 2.1.8 — Refactor `tasks.md` to execution playbook v2.0

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | DOC-04 |

**Objective:** Single execution guide for remainder of project.

**Expected output:** This document v2.0.

**Developer review required:** *(This task — confirm playbook acceptable.)*

---

#### Documentation Sync — Sprint 2.1

- [x] `tool-workflow.md` — no update needed (v1.0 accurate)
- [x] `prompt-history/` — initialized (Task 2.1.7)
- [x] `acceptance-criteria.md` — DOC-04, DOC-05, DOC-06, DOC-08, DOC-09 updated
- [x] `tasks.md` — sprint status and Progress Tracker updated

#### Quality Gate — Sprint 2.1

Apply **Enhanced Quality Gate Template** plus:

- [x] All Cursor workflow files present and consistent
- [x] `acceptance-criteria.md` mirrors verifiable AC-01–AC-23
- [x] Developer can explain DD-01–DD-11
- [x] `.gitignore` in place
- [x] `prompt-history/` initialized
- [x] **Rollback Rule:** if fail → complete Tasks 2.1.1–2.1.7 before Sprint 3.1

#### Deliverables

- [x] `project-context.md`, `spec.md`, `tasks.md` v2.0
- [x] `acceptance-criteria.md`, `cursor-rules-or-instructions.md`, `tool-workflow.md`
- [x] `.gitignore`
- [x] `prompt-history/` initialized

#### Git Commit Plan

```
docs: finalize cursor workflow and execution playbook v2.0
chore: add root gitignore
docs: initialize prompt history
```

#### Sprint Exit Criteria

- [x] All Task 2.1.x complete and developer-approved
- [x] Ready to scaffold `server/` (Sprint 3.1)

---

## Phase 3 — Backend Development

**Phase goal:** Working REST API with PostgreSQL, validation, status state machine.  
**Phase status:** [ ] Not started

### Sprint 3.1 — Server Foundation & Database

**Sprint status:** [ ] Not started  
**Sprint goal:** Express skeleton, Prisma schema, migrations, seed data.  
**Estimated effort:** 2–3 hours  
**Traceability:** FR-C-21–23, DB-01–09, FND-01–04, AC-12, AC-15

#### Prerequisites

- [ ] Sprint 2.1 exit criteria met
- [ ] PostgreSQL running locally or via Docker

---

#### Task 3.1.1 — Initialize server package

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | FND-01, spec §10 |

**Objective:** Create `server/package.json` with Express, TypeScript, Prisma, Zod, dotenv dependencies.

**Expected output:** `server/package.json`, `server/package-lock.json` (or pnpm-lock), install succeeds.

**Files expected to change:** `server/package.json`, lockfile

**Dependencies:** Sprint 2.1 complete

**Definition of ready:** Node.js LTS installed; `server/` directory exists.

**Definition of done:** `npm install` in `server/` succeeds; scripts placeholder present.

**Developer review required:** List dependencies; justify each; no unnecessary packages; wait for approval.

---

#### Task 3.1.2 — Configure TypeScript and dev scripts

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | spec §10 |

**Objective:** Enable TypeScript strict compilation and dev server entry.

**Expected output:** `server/tsconfig.json`; dev script (`tsx watch` or equivalent).

**Files expected to change:** `server/tsconfig.json`, `server/package.json`

**Dependencies:** Task 3.1.1

**Definition of done:** `npm run dev` starts without application logic (may exit or show stub).

**Developer review required:** Explain TS config choices; wait for approval.

---

#### Task 3.1.3 — Environment config module

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | FND-03, AC-14 |

**Objective:** Load and validate `DATABASE_URL`, `PORT`, `CLIENT_URL`.

**Expected output:** `server/src/config/env.ts`; fails fast on missing vars.

**Files expected to change:** `server/src/config/env.ts`

**Dependencies:** Task 3.1.2

**Definition of done:** Module exports typed config; no secrets hardcoded.

**Developer review required:** Security — no logging of secrets; wait for approval.

---

#### Task 3.1.4 — Prisma client singleton

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | spec §10, DD-05 |

**Objective:** Create reusable Prisma client instance.

**Expected output:** `server/src/lib/prisma.ts`

**Files expected to change:** `server/src/lib/prisma.ts`

**Dependencies:** Task 3.1.1

**Definition of done:** Singleton pattern; disconnect helper for tests (optional stub).

**Developer review required:** Explain singleton; wait for approval.

---

#### Task 3.1.5 — Prisma schema (models and enums)

| Field | Value |
| ----- | ----- |
| **Status** | [x] |
| **Traceability** | DB-02–04, OQ-01–02, OQ-10, OQ-12 |

**Objective:** Define User, Ticket, Comment models with enums and FK constraints.

**Expected output:** `server/prisma/schema.prisma` with `ON DELETE RESTRICT` on user FKs.

**Files expected to change:** `server/prisma/schema.prisma`

**Dependencies:** Task 3.1.4

**Definition of done:** Schema matches spec §11; field lengths match OQ-10.

**Developer review required:** Walk through enums, FKs, restrict rules; wait for approval.

---

#### Task 3.1.6 — Initial migration

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | DB-05, FR-C-22, AC-15 |

**Objective:** Apply schema to PostgreSQL.

**Expected output:** `server/prisma/migrations/*`; DB tables created.

**Files expected to change:** `server/prisma/migrations/`

**Dependencies:** Task 3.1.5; `DATABASE_URL` in `server/.env` (local, not committed)

**Definition of done:** `prisma migrate dev` succeeds on empty DB.

**Developer review required:** Confirm migration SQL; wait for approval.

---

#### Task 3.1.7 — Seed script

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | DB-06–08, FR-C-23, OQ-13 |

**Objective:** Seed 3 users, ≥5 tickets (all statuses), comments.

**Expected output:** `server/prisma/seed.ts`; seed command in `package.json`.

**Files expected to change:** `server/prisma/seed.ts`, `server/package.json`

**Dependencies:** Task 3.1.6

**Definition of done:** `prisma db seed` runs; data visible in Prisma Studio.

**Developer review required:** Show seed counts per status; wait for approval.

---

#### Task 3.1.8 — Express app skeleton and health route

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | FND-04, BE-01 |

**Objective:** Express app with CORS, JSON parser, `GET /api/health`.

**Expected output:** `server/src/index.ts`; server starts on `PORT`.

**Files expected to change:** `server/src/index.ts`

**Dependencies:** Task 3.1.3

**Definition of done:** `GET /api/health` returns 200.

**Developer review required:** CORS config; security; wait for approval.

---

#### Task 3.1.9 — Error middleware stubs

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | ERR-01, BE-01 |

**Objective:** `asyncHandler` and `errorHandler` middleware scaffolding.

**Expected output:** `server/src/middleware/asyncHandler.ts`, `errorHandler.ts`

**Files expected to change:** `server/src/middleware/*`, wire in `index.ts`

**Dependencies:** Task 3.1.8

**Definition of done:** Consistent `ErrorResponse` shape per spec §15.

**Developer review required:** Error shape; no stack leak; wait for approval.

---

#### Task 3.1.10 — Server `.env.example` and README skeleton

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | FND-03, AC-15, AC-16 |

**Objective:** Document server env vars; add server setup section to README.

**Expected output:** `server/.env.example`; README server section (skeleton).

**Files expected to change:** `server/.env.example`, `README.md`

**Dependencies:** Task 3.1.3

**Definition of done:** Placeholder values only; README describes migrate/seed/run at high level.

**Developer review required:** No real credentials; wait for approval.

---

#### Testing — Sprint 3.1

- [ ] Manual: `GET /api/health` → 200
- [ ] Manual: Prisma Studio shows seed data
- [ ] Manual: Restart server + DB — data persists (DB-09)

#### Documentation Sync — Sprint 3.1

- [ ] `README.md` — server setup section
- [ ] `tool-workflow.md` — Code Generation section (partial)
- [ ] `prompt-history/`
- [ ] `acceptance-criteria.md` — DB-*, FND-* criteria
- [ ] `tasks.md` — task statuses

#### Quality Gate — Sprint 3.1

Apply **Enhanced Quality Gate Template** plus FR-C-21–23, AC-12, AC-15 partial.

**Rollback Rule:** Fix migration/seed/server issues before Sprint 3.2.

#### Git Commit Plan

```
feat(server): initialize package and typescript config
feat(db): add prisma schema and initial migration
feat(db): add seed data for users tickets and comments
feat(server): add express app health endpoint and middleware stubs
chore(server): add env example and readme server section
```

#### Sprint Exit Criteria

- [ ] All Tasks 3.1.1–3.1.10 complete and approved
- [ ] Server starts; migrations + seed work on fresh DB

---

### Sprint 3.2 — Users & Ticket CRUD API

**Sprint status:** [ ] Not started  
**Sprint goal:** Users list + ticket create, list, detail, update (no status).  
**Estimated effort:** 2–3 hours  
**Traceability:** FR-C-01–08, FR-C-19, BR-15–16, USR-01–04, TKT-01–10, AC-01, AC-04–05, AC-13

#### Prerequisites

- [ ] Sprint 3.1 complete

---

#### Task 3.2.1 — Zod validators for ticket create/update

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | VAL-01–07, OQ-10 |

**Objective:** Request validation schemas for POST/PATCH ticket.

**Expected output:** `server/src/validators/ticketValidators.ts`

**Files expected to change:** `server/src/validators/ticketValidators.ts`

**Dependencies:** Task 3.1.9

**Definition of done:** Length limits, priority enum, reject `status` on update schema.

**Developer review required:** Validation rules vs OQ-10; wait for approval.

---

#### Task 3.2.2 — User service and GET /api/users

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | USR-01–02, FR-C-19 |

**Objective:** Read-only user list endpoint.

**Expected output:** `userService.ts`, `userController.ts`, `userRoutes.ts`; `GET /api/users`

**Files expected to change:** `server/src/services/userService.ts`, `controllers/`, `routes/`

**Dependencies:** Task 3.1.7

**Definition of done:** Returns 3 seeded users with id, name, email, role.

**Developer review required:** No write endpoints; wait for approval.

---

#### Task 3.2.3 — Ticket DTO mapper

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | USR-04, BR-16 |

**Objective:** `toDto()` with `createdByName`, `assignedToName`.

**Expected output:** Mapper in `ticketService.ts` or `server/src/types/`

**Files expected to change:** `server/src/services/ticketService.ts`

**Dependencies:** Task 3.2.2

**Definition of done:** Prisma `include` for users; null assignee handled.

**Developer review required:** N+1 consideration; wait for approval.

---

#### Task 3.2.4 — Ticket create and list (basic)

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | TKT-01–04, BR-01, FR-C-01–04 |

**Objective:** `POST /api/tickets`, `GET /api/tickets` (no search/filter yet).

**Expected output:** `ticketService.create/list`, routes wired.

**Files expected to change:** `ticketService.ts`, `ticketController.ts`, `ticketRoutes.ts`

**Dependencies:** Tasks 3.2.1, 3.2.3

**Definition of done:** Create sets Open status; list returns DTOs with names.

**Developer review required:** BR-01 enforcement; wait for approval.

---

#### Task 3.2.5 — Ticket getById with comments

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | TKT-05, FR-C-05, AC-03 |

**Objective:** `GET /api/tickets/:id` with comments ascending.

**Expected output:** Detail endpoint with nested comments.

**Dependencies:** Task 3.2.4

**Definition of done:** 404 for missing id; comments ordered ASC.

**Developer review required:** Wait for approval.

---

#### Task 3.2.6 — Ticket update (reject status field)

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | TKT-06–09, BR-15, STS-06, FR-C-06–08 |

**Objective:** `PATCH /api/tickets/:id` for title, description, priority, assignedTo only.

**Expected output:** Update endpoint; 400 if `status` in body.

**Dependencies:** Task 3.2.1

**Definition of done:** `updatedAt` changes; `STATUS_NOT_ALLOWED_HERE` error code.

**Developer review required:** BR-15 critical path; wait for approval.

---

#### Testing — Sprint 3.2

- [ ] Manual: users, create, list, detail, update, status-on-patch → 400, validation errors

#### Documentation Sync — Sprint 3.2

- [ ] `prompt-history/`, `acceptance-criteria.md` (USR-*, TKT-*), `tasks.md`

#### Quality Gate — Sprint 3.2

Enhanced template + FR-C-01–08, BR-15–16, AC-01, AC-04–05, AC-13.

**Rollback Rule:** Do not start 3.3 until CRUD verified.

#### Git Commit Plan

```
feat(api): add zod validators for tickets
feat(api): add GET /api/users
feat(api): add ticket create list detail endpoints
feat(api): add ticket update with status field rejection
```

#### Sprint Exit Criteria

- [ ] Tasks 3.2.1–3.2.6 approved; CRUD works except status change

---

### Sprint 3.3 — Status State Machine

**Sprint status:** [ ] Not started  
**Sprint goal:** `statusTransition.ts` + `PATCH /api/tickets/:id/status`  
**Estimated effort:** 2 hours  
**Traceability:** STS-01–09, FR-C-09–13a, BR-02–06, BR-17, AC-06–08

#### Prerequisites

- [ ] Sprint 3.2 complete

---

#### Task 3.3.1 — Status transition service

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | STS-07, BR-02–06 |

**Objective:** `validateTransition()` and `getAllowedTransitions()` in isolated module.

**Expected output:** `server/src/services/statusTransition.ts`

**Dependencies:** None (pure logic; unit-testable)

**Definition of done:** All valid/invalid transitions per spec; terminal states enforced.

**Developer review required:** State diagram walkthrough; wait for approval.

---

#### Task 3.3.2 — changeStatus in ticket service

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | STS-09, BR-17 |

**Objective:** Load current status from DB; validate; update.

**Expected output:** `ticketService.changeStatus()`

**Dependencies:** Task 3.3.1

**Definition of done:** Validates against live DB state; updates `updatedAt`.

**Developer review required:** Last-write-wins behavior; wait for approval.

---

#### Task 3.3.3 — Status endpoint and validator

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | STS-05, FR-C-12, AC-06–07 |

**Objective:** `PATCH /api/tickets/:id/status` with Zod validator.

**Expected output:** Route, controller handler, descriptive 400 errors.

**Files expected to change:** `validators/`, `ticketRoutes.ts`, `ticketController.ts`

**Dependencies:** Task 3.3.2

**Definition of done:** Manual tests: 5 valid + ≥6 invalid transitions.

**Developer review required:** Error messages; wait for approval.

---

#### Testing — Sprint 3.3

- [ ] Manual: all transition matrix cases from requirement-analysis §9.3

#### Quality Gate — Sprint 3.3

Enhanced template + state machine only in `statusTransition.ts`.

**Rollback Rule:** Fix state machine before 3.4.

#### Git Commit Plan

```
feat(api): add status transition service
feat(api): add PATCH /tickets/:id/status endpoint
```

#### Sprint Exit Criteria

- [ ] All transition rules enforced; no status via general PATCH

---

### Sprint 3.4 — Comments, Search & Filter

**Sprint status:** [ ] Not started  
**Sprint goal:** Complete backend API.  
**Estimated effort:** 1.5–2 hours  
**Traceability:** CMT-01–06, SRC-01–06, FR-C-14–18, BR-10–12, AC-09–11

#### Prerequisites

- [ ] Sprint 3.3 complete

---

#### Task 3.4.1 — Comment service and endpoint

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | CMT-01–05, BR-10–12 |

**Objective:** `POST /api/tickets/:id/comments`; append-only.

**Expected output:** `commentService.ts`, `commentController.ts`, routes.

**Definition of done:** Comments on all statuses; 404 if ticket missing.

**Developer review required:** Wait for approval.

---

#### Task 3.4.2 — Search on ticket list

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | SRC-01–02, FR-C-17, OQ-03 |

**Objective:** `search` query param — title + description, case-insensitive partial.

**Expected output:** Extended `ticketService.list()`

**Definition of done:** Empty search ignored; ILIKE/contains implementation.

**Developer review required:** Performance note; wait for approval.

---

#### Task 3.4.3 — Status filter on ticket list

| Field | Value |
| ----- | ----- |
| **Status** | [ ] |
| **Traceability** | SRC-03–04, FR-C-18, OQ-15 |

**Objective:** `status` query param; 400 on invalid value.

**Dependencies:** Task 3.4.2

**Definition of done:** Filter works; invalid → 400 `INVALID_FILTER`.

**Developer review required:** Wait for approval.

---

#### Quality Gate — Sprint 3.4

Enhanced template + all spec §12 endpoints functional.

**Rollback Rule:** Backend must be complete before Phase 4.

#### Git Commit Plan

```
feat(api): add comment creation endpoint
feat(api): add ticket search and status filter
```

#### Sprint Exit Criteria

- [ ] All API endpoints implemented; FR-C API support complete

---

## Phase 4 — Frontend Development

**Phase goal:** React UI with full error handling.  
**Phase status:** [ ] Not started

### Sprint 4.1 — Client Scaffold & API Layer

**Sprint status:** [ ] Not started  
**Estimated effort:** 1.5–2 hours  
**Traceability:** FE-01–03, FND-04, AC-02 (partial)

#### Prerequisites

- [ ] Sprint 3.4 complete

| Task ID | Objective (summary) | Key files | Status |
| ------- | ------------------- | --------- | ------ |
| **4.1.1** | Init Vite + React + TS | `client/package.json`, `vite.config.ts` | [ ] |
| **4.1.2** | Shared TypeScript DTOs | `client/src/types/*` | [ ] |
| **4.1.3** | API client base + error parsing | `client/src/api/client.ts` | [ ] |
| **4.1.4** | Resource API modules | `api/tickets.ts`, `users.ts`, `comments.ts` | [ ] |
| **4.1.5** | Layout + React Router | `Layout.tsx`, `App.tsx`, routes | [ ] |
| **4.1.6** | `client/.env.example` | `VITE_API_URL` | [ ] |

*Each task: full Developer Review checkpoint per Standard Workflow.*

#### Quality Gate — Sprint 4.1

Enhanced template + spec §9 structure; CORS smoke test.

#### Sprint Exit Criteria

- [ ] Client runs; fetches users; routes work

---

### Sprint 4.2 — Ticket List, Search & Filter

**Sprint status:** [ ] Not started  
**Traceability:** FE-04, FE-07–08, TKT-04, SRC-*, AC-02, AC-10–11

| Task ID | Objective | Key files | Status |
| ------- | --------- | --------- | ------ |
| **4.2.1** | `useTickets` hook | `hooks/useTickets.ts` | [ ] |
| **4.2.2** | List components (Card, List, Badges) | `components/tickets/*` | [ ] |
| **4.2.3** | SearchBar + StatusFilter | `components/tickets/*` | [ ] |
| **4.2.4** | TicketListPage + URL params | `pages/TicketListPage.tsx` | [ ] |
| **4.2.5** | Empty state + ErrorAlert | `components/common/ErrorAlert.tsx` | [ ] |

#### Sprint Exit Criteria

- [ ] List, search, filter E2E; AC-02, AC-10–11 manual pass

---

### Sprint 4.3 — Create Ticket & Ticket Detail

**Sprint status:** [ ] Not started  
**Traceability:** TKT-01–05, CMT-04, USR-03, AC-01, AC-03

| Task ID | Objective | Key files | Status |
| ------- | --------- | --------- | ------ |
| **4.3.1** | `useUsers` + UserSelect | `hooks/useUsers.ts`, `components/common/UserSelect.tsx` | [ ] |
| **4.3.2** | TicketForm component | `components/tickets/TicketForm.tsx` | [ ] |
| **4.3.3** | CreateTicketPage | `pages/CreateTicketPage.tsx` | [ ] |
| **4.3.4** | `useTicket` + TicketDetailPage | `hooks/useTicket.ts`, `pages/TicketDetailPage.tsx` | [ ] |
| **4.3.5** | CommentList + 404 state | `components/comments/CommentList.tsx` | [ ] |

#### Sprint Exit Criteria

- [ ] Create + detail work; AC-01, AC-03 manual pass

---

### Sprint 4.4 — Update, Status Change & Comments

**Sprint status:** [ ] Not started  
**Traceability:** TKT-06–09, STS-10, CMT-01, FE-05–06, AC-04–09

| Task ID | Objective | Key files | Status |
| ------- | --------- | --------- | ------ |
| **4.4.1** | Edit mode on detail (fields + reassign) | `TicketDetailPage.tsx` | [ ] |
| **4.4.2** | StatusSelector + status API wire | `components/tickets/StatusSelector.tsx` | [ ] |
| **4.4.3** | Invalid transition error display | detail page UX | [ ] |
| **4.4.4** | CommentForm + submit | `components/comments/CommentForm.tsx` | [ ] |
| **4.4.5** | Loading states + XSS-safe render | various | [ ] |

#### Sprint Exit Criteria

- [ ] AC-01–AC-11 manual pass; full happy path demo-ready

---

## Phase 5 — Integration Testing & Quality Assurance

**Phase status:** [ ] Not started

### Sprint 5.1 — Integration Test Suite

**Sprint status:** [ ] Not started  
**Traceability:** TST-01–07, AC-17–18, FR-C-11

| Task ID | Objective | Key files | Status |
| ------- | --------- | --------- | ------ |
| **5.1.1** | Vitest + Supertest setup | `vitest.config.ts`, test scripts | [ ] |
| **5.1.2** | Test DB setup/teardown | `tests/setup.ts` | [ ] |
| **5.1.3** | Valid transition tests (5) | `statusTransition.integration.test.ts` | [ ] |
| **5.1.4** | Invalid transition tests (≥6) | same | [ ] |
| **5.1.5** | Guard tests (status on PATCH, filter, 404) | same | [ ] |
| **5.1.6** | `docs/testing-notes.md` | docs | [ ] |

#### Sprint Exit Criteria

- [ ] `npm run test` passes; AC-17, AC-18 satisfied

---

### Sprint 5.2 — Manual QA & Defect Fix

**Sprint status:** [ ] Not started  
**Traceability:** AC-01–AC-18, TST-09

| Task ID | Objective | Status |
| ------- | --------- | ------ |
| **5.2.1** | Execute full manual regression script | [ ] |
| **5.2.2** | Persistence + secrets verification (AC-12, AC-14) | [ ] |
| **5.2.3** | Edge case sampling (EC-01–EC-22) | [ ] |
| **5.2.4** | Log/fix defects; `docs/debugging-notes.md` | [ ] |
| **5.2.5** | Update `acceptance-criteria.md` statuses | [ ] |

#### Sprint Exit Criteria

- [ ] AC-01–AC-18 pass; no critical open defects

---

## Phase 6 — Documentation, Review & Submission

**Phase status:** [ ] Not started

### Sprint 6.1 — README & Workflow Documentation

**Sprint status:** [ ] Not started  
**Traceability:** AC-15–16, DOC-07–09

| Task ID | Objective | Status |
| ------- | --------- | ------ |
| **6.1.1** | Complete README (setup, run, test) | [ ] |
| **6.1.2** | Verify README by fresh follow-through | [ ] |
| **6.1.3** | Update `tool-workflow.md` implementation sections | [ ] |
| **6.1.4** | Organize `prompt-history/` | [ ] |
| **6.1.5** | Final workflow doc consistency review | [ ] |

#### Sprint Exit Criteria

- [ ] README verified; assignment doc requirements met

---

### Sprint 6.2 — Reflection, PR & Final Submission

**Sprint status:** [ ] Not started  
**Traceability:** AC-23, DOC-10–11

| Task ID | Objective | Status |
| ------- | --------- | ------ |
| **6.2.1** | `docs/reflection.md` | [ ] |
| **6.2.2** | PR description artifact | [ ] |
| **6.2.3** | Final regression (manual + tests) | [ ] |
| **6.2.4** | Project Completion Checklist sign-off | [ ] |
| **6.2.5** | Mark all sprints complete in this file | [ ] |

#### Sprint Exit Criteria

- [ ] Submission ready; can explain architecture and AI usage

---

## Optional — Stretch Sprint S.1

> **Gate:** Project Completion Checklist core items 100% first.

| Task ID | Objective (pick ≤2) | Status |
| ------- | ------------------- | ------ |
| S.1.1 | JWT auth + protected routes | [ ] |
| S.1.2 | RBAC by role | [ ] |
| S.1.3 | Pagination + sorting | [ ] |
| S.1.4 | Docker Compose | [ ] |
| S.1.5 | CI pipeline | [ ] |

**Stretch exit:** Core AC-01–AC-18 still pass; integration tests green.

---

# Project Completion Checklist

> Required before submission. See also `acceptance-criteria.md` Final Release Checklist.

## Application (Required)

- [ ] Working frontend — all pages functional
- [ ] Working backend API — all spec §12 endpoints
- [ ] PostgreSQL persisting data
- [ ] Migrations work on fresh DB
- [ ] Seed: 3 users, tickets (all statuses), comments
- [ ] Backend validation (Zod + lengths)
- [ ] Error handling — API + UI
- [ ] Search (title + description) and status filter
- [ ] Status state machine — dedicated endpoint
- [ ] Integration tests — AC-17, AC-18

## Configuration (Required)

- [ ] `.env.example` (server + client)
- [x] `.gitignore` — no secrets in Git
- [ ] No secrets in Git history

## Documentation — `docs/` (Required)

- [ ] `assignment.md`, `requirement-analysis.md` v1.1
- [ ] `testing-notes.md`, `debugging-notes.md`, `reflection.md`

## Documentation — Root & Workflow (Required)

- [ ] `README.md` (AC-16)
- [x] `tool-workflow.md`
- [x] All `tool-specific/cursor-workflow/*` artifacts current
- [x] `prompt-history/` organized (AC-20)
- [ ] PR description (AC-21)

## Acceptance Criteria AC-01–AC-23

- [ ] AC-01 through AC-11 — features
- [ ] AC-12 through AC-16 — infrastructure
- [ ] AC-17 through AC-18 — tests
- [ ] AC-19 through AC-23 — artifacts

## Quality Bar (Required)

- [ ] Runs from README alone
- [ ] Can explain state machine and architecture
- [ ] Clean incremental commits
- [ ] Can explain AI vs manual work

## Stretch (Optional)

- [ ] Auth / RBAC / pagination / Docker / CI

---

# Sprint Progress Tracker

| Phase | Sprint | Status | Completed Date | Notes |
| ----- | ------ | ------ | -------------- | ----- |
| 1 | 1.1 Requirements | [x] Complete | | requirement-analysis v1.1 |
| 2 | 2.1 Architecture & Spec | [x] Complete | 2026-07-07 | All Tasks 2.1.1–2.1.8 done; Quality Gate passed |
| 3 | 3.1 Server Foundation | [ ] Not started | | Tasks 3.1.1–3.1.10 |
| 3 | 3.2 Users & Ticket CRUD | [ ] Not started | | |
| 3 | 3.3 Status State Machine | [ ] Not started | | |
| 3 | 3.4 Comments Search Filter | [ ] Not started | | |
| 4 | 4.1 Client Scaffold | [ ] Not started | | |
| 4 | 4.2 Ticket List | [ ] Not started | | |
| 4 | 4.3 Create & Detail | [ ] Not started | | |
| 4 | 4.4 Update Status Comments | [ ] Not started | | |
| 5 | 5.1 Integration Tests | [ ] Not started | | |
| 5 | 5.2 Manual QA | [ ] Not started | | |
| 6 | 6.1 README & Workflow | [ ] Not started | | |
| 6 | 6.2 Reflection & Submit | [ ] Not started | | |
| S | S.1 Stretch (optional) | [ ] Not started | | |

---

# Document Self-Review (v2.0)

| Check | Result |
| ----- | ------ |
| No duplicated tasks | ✓ Each Task ID unique |
| Logical task order | ✓ Dependencies chain correctly |
| No missing dependencies | ✓ Sprint prerequisites documented |
| No contradictory instructions | ✓ Aligned with spec, cursor-rules, freeze |
| Consistent formatting | ✓ Task template applied |
| Agile execution ready | ✓ Atomic tasks, Quality Gates, Rollback |
| Traceability preserved | ✓ FR/BR/AC/acceptance-criteria IDs per sprint |
| Planning freeze clear | ✓ Progress-only updates after v2.0 |

---

*Living document — update task Status and Progress Tracker after each approved task and Quality Gate. Authority: `docs/requirement-analysis.md`. Blueprint: `spec.md`. Verification: `acceptance-criteria.md`.*
