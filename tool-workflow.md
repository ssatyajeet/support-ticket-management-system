# AI Tool Workflow — Support Ticket Management System

**Document Version:** 1.9  
**Last Updated:** July 13, 2026  
**Status:** Living document — update after every major sprint  
**Exercise:** JS AI Capability Exercise — Part A (AI Workflow Foundation)

> Only **completed** activities are documented below. Sections for work not yet started are marked **Pending**.

---

# AI Tool Workflow

## Project Overview

This project is a **Support Ticket Management System** — an internal full-stack web application for creating, tracking, updating, assigning, and progressing support tickets through a controlled lifecycle, with comments, search, and status filtering.

It is being built as part of the **JS AI Capability Exercise**, which evaluates not only whether the application works, but how effectively AI is used across the software development lifecycle: analysis, design, implementation, testing, debugging, and documentation.

**Target stack (approved):** React (Vite) + Express + PostgreSQL + Prisma.

**Current phase:** Phase 6 complete — submission ready (Sprint 6.2 done).

---

## Primary AI Tool Used

### Tool: **Cursor**

Cursor was selected as the primary AI tool for this project because:

| Reason | Benefit for this project |
| ------ | ------------------------ |
| **IDE-integrated pair programming** | Generate and review docs/code in the same workspace |
| **Persistent project context** | `@` references to `requirement-analysis.md`, `spec.md`, and workflow files keep AI aligned across sessions |
| **Custom rules support** | `cursor-rules-or-instructions.md` enforces architecture and engineering standards on every task |
| **Full-lifecycle fit** | Suitable for analysis, specification, task planning, and upcoming implementation sprints |
| **Exercise alignment** | Demonstrates visible, explainable AI-assisted engineering with artifact traceability |

The developer remains the decision maker; Cursor accelerates drafting and implementation. All AI output is reviewed before being treated as approved.

---

## Project Context

### How Context Was Provided to Cursor

Context was supplied **progressively** — each document built on the previous one, with explicit `@` file references in prompts so Cursor did not work from memory alone.

| Document | Role in AI context |
| -------- | ------------------ |
| `docs/assignment.md` | Exercise rules, core vs stretch scope, mandatory deliverables |
| `docs/requirement-analysis.md` | Business requirements, BR/FR rules, resolved OQ decisions, AC-01–AC-23 |
| `tool-specific/cursor-workflow/project-context.md` | Persistent architecture, stack, folder structure, collaboration rules |
| `tool-specific/cursor-workflow/spec.md` | Technical blueprint — API, database, modules, design decisions |
| `tool-specific/cursor-workflow/tasks.md` | Sprint order and execution roadmap |
| `tool-specific/cursor-workflow/acceptance-criteria.md` | Definition of Done and verification checklist |
| `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` | Permanent engineering and AI behavior rules |

### Context Strategy

1. **Start from assignment** — first prompts referenced `docs/assignment.md` only
2. **Layer requirements** — requirement analysis became the business authority for all later docs
3. **Add technical specificity** — `project-context.md` and `spec.md` translated requirements into architecture
4. **Add execution control** — `tasks.md` and `acceptance-criteria.md` constrain *when* and *how* to verify work
5. **Add permanent rules** — `cursor-rules-or-instructions.md` governs all future implementation behavior

### Information Not Shared with Cursor

The following were intentionally excluded from prompts:

- Real database credentials or connection strings (stored in local `server/.env` only)
- Any production or personal secrets
- *(Additional exclusions will be recorded here as implementation begins)*

### Prompt History

`prompt-history/` is organized. Sprints 1.1 through 5.2 logs are complete. See `prompt-history/README.md` for the session index.

---

## Requirement Analysis

### How AI Assisted

Cursor acted as a **Senior Business Analyst and Software Architect** to produce the initial `docs/requirement-analysis.md` from `docs/assignment.md`.

**Completed AI-assisted work:**

- Full requirement analysis covering: overview, goals, functional/non-functional requirements, actors, entities, relationships, business rules, validation, user stories, flows, edge cases, risks, assumptions, and acceptance criteria
- Initial open questions (OQ-01–OQ-15) with recommendations

### Iterative Refinement & Human Review

The first draft was **not** accepted blindly. The developer reviewed open questions and provided explicit decisions:

| Topic | Human decision |
| ----- | -------------- |
| Roles | Agent, Manager, Admin (not admin/agent/user) |
| Ticket delete | Deferred; soft delete as future enhancement |
| Status API | Dedicated endpoint; 400 if `status` on general PATCH |
| Concurrency | Last-write-wins; optimistic locking deferred |
| Database | PostgreSQL |

Cursor then updated `requirement-analysis.md` to **v1.1** with a **Design Decisions (Resolved)** section, replacing open questions with authoritative decisions.

**Human review actions performed:**

- Challenged role naming and scope (e.g., soft delete vs core scope)
- Requested architecture opinion on status endpoint design (Ask mode review)
- Approved final OQ resolutions before design phase proceeded

---

## Planning & System Design

AI was used to produce the full **Cursor workflow artifact set** before any application code was written.

### Project Context (`project-context.md`)

- **AI role:** Senior Solution Architect
- **Completed:** Persistent AI context document covering stack, architecture, folder structure, API principles, testing/error strategies, Definition of Done
- **Human review:** Requested removal of version pins; addition of Design Decisions and Risks summaries aligned with `spec.md`

### Technical Specification (`spec.md`)

- **AI role:** Senior Solution Architect / Technical Lead
- **Completed:** Implementation-ready spec — modules, frontend/backend/database/API contracts, validation, testing scope, security/performance
- **Human review (v1.1 updates):**
  - Architecture over pinned dependency versions
  - New §5 Design Decisions (DD-01–DD-11) with OQ cross-refs
  - New §7 Risks & Trade-offs
  - Removed implementation order (moved to `tasks.md`)
  - Renumbered sections

### Sprint Planning (`tasks.md`)

- **AI role:** Senior Engineering Manager / Agile Delivery Lead
- **Completed:** 6-phase, 13-sprint execution roadmap with Quality Gates, deliverables, commit plans, and Project Completion Checklist
- **Human review:** Approved structure; Appendix C correctly deferred to this tasks file

### Acceptance Criteria (`acceptance-criteria.md`)

- **AI role:** Senior QA Lead / Engineering Manager
- **Completed:** 97 feature-level verification criteria with verification methods (MT/IT/CR/DR), sprint mapping, Final Release Checklist, Quality Standards
- **Human review:** Requested practical verification format — not a copy of requirement analysis AC section

### Engineering Standards (`cursor-rules-or-instructions.md`)

- **AI role:** Principal Engineer / AI Engineering Lead / Security Reviewer
- **Completed:** Permanent Cursor rules — Clean Code, SOLID, backend/frontend/DB/API/security/testing standards, AI collaboration philosophy
- **Human review:** Approved structure aligned with assignment Part A expectations

## Code Generation

**Status: Complete** — Sprints 3.1–3.4 (backend), 4.1–4.4 (frontend), 5.1 (integration tests), 5.2 (manual QA fixes).

### Sprint 3.1 — Server Foundation & Database (Complete)

Cursor implemented the Express + TypeScript + Prisma server scaffold task-by-task with developer approval between each step.

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Package & TypeScript | `server/package.json`, `tsconfig.json` | Pinned deps per spec §10; TS 6 `Node16` module resolution |
| Environment | `server/src/config/env.ts` | Zod validation; fail-fast on missing vars |
| Database | `prisma/schema.prisma`, `prisma.config.ts`, `prisma/migrations/*`, `prisma/seed.ts` | Prisma 7.8 — URL in `prisma.config.ts`; driver adapter required |
| Prisma client | `server/src/lib/prisma.ts` | Singleton + `@prisma/adapter-pg` + `pg` pool |
| Express app | `server/src/index.ts` | CORS to `CLIENT_URL`; `GET /api/health` |
| Error handling | `asyncHandler.ts`, `errorHandler.ts` | `ErrorResponse` shape per spec §15 |
| Docs | `server/.env.example`, `README.md` server section | Placeholders only |

**Developer actions (manual):**

- Created PostgreSQL database and local `server/.env` (gitignored)
- Ran `prisma migrate dev --name initial` after fixing credential issues in agent shell
- Manual Quality Gate: health endpoint, Prisma Studio seed data, restart persistence

**Iterations / corrections:**

| Issue | Resolution |
| ----- | ---------- |
| Prisma 7.8 rejects `url` in schema | Added `prisma.config.ts` |
| `PrismaClient` runtime requires adapter | Added `@prisma/adapter-pg` + `pg`; updated `lib/prisma.ts` |
| Seed command not found | Added `migrations.seed` to `prisma.config.ts` |
| Agent migrate P1000 | Stale shell `DATABASE_URL` override; developer ran migrate manually |

### Sprint 5.2 — Manual QA & Defect Fix (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Manual regression | `docs/manual-regression-checklist.md` | 33 cases across sections A–K |
| API regression script | `server/scripts/regression-521-api.mjs` | 26/26 API cases |
| Persistence scripts | `server/scripts/persistence-522-*.mjs` | AC-12 verification |
| Edge-case script | `server/scripts/edge-cases-523-api.mjs` | EC-04–10, 12–13, 15 |
| Defect fix | `server/src/middleware/errorHandler.ts` | DEF-001: malformed JSON → 400 |
| Debugging docs | `docs/debugging-notes.md` | Defect log and resolution |

**Quality Gate:** 33/33 manual regression pass; DEF-001 fixed; acceptance criteria updated (see `prompt-history/sprint-5.2.md`).

### Sprint 5.1 — Integration Test Suite (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| App extraction | `server/src/app.ts`, `server/src/index.ts` | `createApp()` for Supertest; no `listen()` in tests |
| Vitest setup | `server/vitest.config.ts`, `package.json` scripts | `npm run test`, `test:watch` |
| Test harness | `server/tests/setup.ts`, `tests/helpers/db.ts` | Truncate + seed per test; Prisma disconnect in `afterAll` |
| Integration tests | `server/tests/integration/statusTransition.integration.test.ts` | 15 scenarios: 5 valid, 6 invalid, 4 guards |
| Testing docs | `docs/testing-notes.md` | Setup, coverage matrix, troubleshooting |

**Quality Gate:** `npm run test` — **15/15 passed**; `npm run build` (server) — passed (see `prompt-history/sprint-5.1.md`).

### Sprint 4.4 — Update, Status Change & Comments (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Status hints | `lib/statusTransitions.ts` | Mirrors backend state machine for UX only |
| Status UI | `components/tickets/StatusSelector.tsx` | Valid next statuses; inline error on failure |
| Edit mode | `TicketForm.tsx` (edit), `TicketDetailPage.tsx` | `PATCH /api/tickets/:id` |
| Comments | `components/comments/CommentForm.tsx` | Author dropdown + message; refetch on post |
| Loading / XSS | Detail page | Disabled during mutations; text-only render |

**Quality Gate:** `npm run build` (client) — passed; edit/status/comment flows verified (see `prompt-history/sprint-4.4.md`).

**Phase 4 frontend:** Complete — all core UI flows demo-ready.

### Sprint 4.3 — Create Ticket & Ticket Detail (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Users hook | `hooks/useUsers.ts` | Fetch users for dropdowns |
| User select | `components/common/UserSelect.tsx` | createdBy + assignee; optional Unassigned |
| Ticket form | `components/tickets/TicketForm.tsx` | Client validation; API field errors |
| Create page | `pages/CreateTicketPage.tsx` | `POST /api/tickets`; navigate to detail |
| Ticket hook | `hooks/useTicket.ts` | Single ticket fetch; 404 detection |
| Detail page | `pages/TicketDetailPage.tsx` | Full metadata, description, comments |
| Comments | `components/comments/CommentList.tsx` | Chronological display; text-only render |
| 404 state | `TicketDetailPage.tsx` | Invalid/missing ticket ID |

**Quality Gate:** `npm run build` (client) — passed; create/detail/404/comments verified (see `prompt-history/sprint-4.3.md`).

### Sprint 4.2 — Ticket List, Search & Filter (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Data hook | `hooks/useTickets.ts` | Fetch, loading, error, abort, refetch |
| Dashboard hook | `hooks/useDashboard.ts` | Status counts for tabs and dashboard |
| List UI | `TicketCard`, `TicketList`, `TicketTable`, badges | Table + card views |
| Filters | `SearchBar`, `StatusFilter`, `StatusTabs` | 300ms debounce; URL params |
| Page | `TicketListPage.tsx` | `?search=` & `?status=` via React Router |
| Errors / empty | `ErrorAlert.tsx`, empty state in `TicketList` | API messages shown to user |
| Layout (iteration) | `layout/Sidebar.tsx`, `icons/`, `charts/` | Sidebar + dashboard; mockup-aligned UI |
| Dashboard | `DashboardPage.tsx` | Stat cards + SVG donut chart; `/dashboard` route |

**Quality Gate:** `npm run build` (client) — passed; list/search/filter/URL/empty/error verified (see `prompt-history/sprint-4.2.md`).

**Iterations / corrections:**

| Issue | Resolution |
| ----- | ---------- |
| UI looked plain after initial batch | Modern redesign pass (Inter, cards, skeletons) |
| User shared mockup reference | Sidebar layout, icons, dashboard charts, table view |
| Build failed — unused `cn` import in `PageHeader.tsx` | Removed import; build green at QG |

### Sprint 4.1 — Client Scaffold & API Layer (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Scaffold | `client/package.json`, `vite.config.ts` | Vite + React 19 + TypeScript 6 |
| Types | `client/src/types/*` | DTOs mirroring spec §12.3 |
| API client | `client/src/api/client.ts` | `fetch` wrapper, `ApiError`, env-based URL |
| Resource APIs | `users.ts`, `tickets.ts`, `comments.ts` | All spec §12 endpoints covered |
| Routing | `App.tsx`, `Layout.tsx`, placeholder pages | React Router; spec §9.3 routes |
| Env | `client/.env.example` | `VITE_API_URL` |

**Quality Gate:** `npm run build` + CORS preflight + `GET /api/users` — all passed (see `prompt-history/sprint-4.1.md`).

### Sprint 3.4 — Comments, Search & Filter (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Comments | `commentValidators.ts`, `commentService.ts`, `commentController.ts`, `commentRoutes.ts` | `POST /api/tickets/:id/comments`; append-only |
| Search | `ticketValidators.ts`, `ticketService.ts` | `?search=` ILIKE on title + description |
| Status filter | `ticketValidators.ts`, `ticketService.ts` | `?status=`; invalid → `INVALID_FILTER` |

**Endpoints delivered (Sprint 3.4):**

- `POST /api/tickets/:id/comments`
- `GET /api/tickets` extended with `search` and `status` query params

**Quality Gate:** 6 new curl cases at QG (task-level curls not re-run) + `npm run build` — all passed (see `prompt-history/sprint-3.4.md`).

**Phase 3 backend API:** Complete — all spec §12.1 endpoints implemented.

### Sprint 3.3 — Status State Machine (Complete)

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| State machine | `statusTransition.ts` | Single source for BR-02–BR-06 |
| Service | `ticketService.changeStatus()` | Validates against live DB state (BR-17) |
| Validator | `parseChangeStatusInput()` | API display strings → Prisma `Status` |
| Endpoint | `PATCH /api/tickets/:id/status` | Separate from general PATCH (DD-04) |

**Quality Gate:** curl transition matrix — 13/13 passed (see `prompt-history/sprint-3.3.md`).

**Developer workflow note:** `npm run build` deferred to sprint QG (not per-task).

### Sprint 3.2 — Users & Ticket CRUD API (Complete)

Task-by-task implementation with developer approval between each step (same pattern as 3.1).

**AI-generated (reviewed and approved):**

| Area | Files | Notes |
| ---- | ----- | ----- |
| Validators | `server/src/validators/ticketValidators.ts` | Create/update Zod schemas; `STATUS_NOT_ALLOWED_HERE` on `status` |
| Users API | `userService.ts`, `userController.ts`, `userRoutes.ts` | `GET /api/users` read-only |
| Ticket service | `ticketService.ts` | DTO mappers, create/list/getById/update |
| Ticket API | `ticketController.ts`, `ticketRoutes.ts` | Full CRUD except status change |

**Endpoints delivered:**

- `GET /api/users`
- `GET /api/tickets`, `POST /api/tickets`
- `GET /api/tickets/:id`, `PATCH /api/tickets/:id`

**Quality Gate:** curl verification — 11/11 tests passed (see `prompt-history/sprint-3.2.md`).

**Iterations / corrections:**

| Issue | Resolution |
| ----- | ---------- |
| TypeScript `toDto` overload | Added `toDetailDto()` helper for detail responses |
| Express 5 `req.params.id` type | Handle `string \| string[]` in controller |
| Windows curl JSON escaping | Used `--data-binary @file.json` for POST/PATCH bodies |

---

## Code Validation

**Status: Complete** — Sprints 3.1–3.4, 4.1–4.4, 5.1–5.2 complete

- Task-by-task review against `spec.md` and `cursor-rules-or-instructions.md`
- `npm run build` at sprint QG (server 3.1–3.4; client 4.1–4.4)
- Sprint 3.2: curl CRUD — 11/11
- Sprint 3.3: curl transition matrix — 13/13
- Sprint 3.4: QG curl — 6/6 new cases (task-level curls not re-run)
- Sprint 4.1: build + CORS + users API — passed
- Sprint 4.2: client build — passed; list UI manual checklist
- Sprint 4.3: client build — passed; create/detail manual checklist
- Sprint 4.4: client build — passed; edit/status/comment manual checklist
- Sprint 5.1: `npm run test` — 15/15 passed; server build — passed
- Sprint 5.2.1: manual regression — 33/33 pass (`docs/manual-regression-checklist.md`)
- Sprint 5.2.2: persistence L1/L3 pass; secrets L4–L7 pass; L2 PG restart manual (admin)
- Sprint 5.2.3: edge-case sampling EC-01–EC-22 — Section M in manual checklist; `edge-cases-523-api.mjs` added; EC-19 fixed (DEF-001)
- Sprint 5.2.4: DEF-001 resolved — malformed JSON returns 400 `VALIDATION_ERROR`

---

## Testing

**Status: Complete** — Sprint 5.1 integration suite; Sprint 5.2 manual QA complete (33/33 pass; DEF-001 fixed).

**Sprint 5.2.1 (2026-07-13):**

- Created [`docs/manual-regression-checklist.md`](docs/manual-regression-checklist.md) — 33 cases across sections A–K (AC-01–AC-11)
- API regression: `server/scripts/regression-521-api.mjs` — 26/26 passed
- UI-only cases verified via component code review (7 cases)
- No defects logged; deferred edge cases to Task 5.2.3

**Sprint 5.2.2 (2026-07-13):**

- Marker ticket #184 + comment created; survived Express server restart (AC-12)
- PostgreSQL service restart blocked without admin — manual step documented in checklist Section L
- Secrets audit: `.env` gitignored; only `.env.example` tracked; no hardcoded credentials in source (AC-14)

**Sprint 5.2.3 (2026-07-13):**

- Added [`server/scripts/edge-cases-523-api.mjs`](server/scripts/edge-cases-523-api.mjs) for Tier 2 API cases (EC-04–10, 12–13, 15)
- Documented all 22 edge cases in checklist Section M; DEF-001 fixed (EC-19 malformed JSON → 400)

**Sprint 6.1 (2026-07-13):**

- Completed root `README.md` — full setup, migrate, seed, run client + server, run tests (AC-16, DOC-07)
- Verified README steps: server/client build pass; `npm run test` — 16/16; health endpoint OK
- Updated this document (`tool-workflow.md` v1.8) — implementation sections current through Phase 5
- Organized `prompt-history/` — session index updated; Sprints 5.1–5.2 marked approved

**Next:** Submission — repository ready for exercise hand-in.

**Sprint 6.2 (2026-07-13):**

- `docs/reflection.md` — honest AI usage reflection (AC-23, DOC-10)
- `docs/pr-description.md` — submission PR artifact (DOC-11)
- Final regression: `npm run test` 16/16; API regression 26/26 (after re-seed)
- Project Completion Checklist signed off in `tasks.md`

---

## Debugging

**Status: Complete (Sprint 5.2.4)**

Defects found during manual QA documented in [`docs/debugging-notes.md`](docs/debugging-notes.md).

| Defect | Issue | Resolution |
| ------ | ----- | ---------- |
| DEF-001 | EC-19 malformed JSON → 500 | Fixed — `errorHandler` returns 400 `VALIDATION_ERROR` |

---

## Reflection

**Status: Complete (Sprint 6.2)**

Honest AI usage reflection in [`docs/reflection.md`](docs/reflection.md) (AC-23, DOC-10).

**Highlights:**

- AI excelled at pattern-following implementation when spec was clear
- Human decisions required for OQs, Prisma 7.8 adapter issues, UI iteration, DEF-001 fix
- Prompt iteration and Quality Gates documented in `prompt-history/`
- Submission PR artifact: [`docs/pr-description.md`](docs/pr-description.md)

---

## Current Project Status

### Completed Milestones

| Milestone | Deliverable | Status |
| --------- | ----------- | ------ |
| Repository structure | `client/`, `server/`, `docs/`, `tool-specific/`, etc. | Done |
| Assignment reviewed | `docs/assignment.md` | Done |
| **Phase 1 — Sprint 1.1** | `docs/requirement-analysis.md` v1.1 | Done |
| Project context | `tool-specific/cursor-workflow/project-context.md` | Done |
| Technical specification | `tool-specific/cursor-workflow/spec.md` v1.1 | Done |
| Execution roadmap | `tool-specific/cursor-workflow/tasks.md` | Done |
| Acceptance criteria | `tool-specific/cursor-workflow/acceptance-criteria.md` | Done |
| Engineering rules | `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` | Done |
| **Phase 2 — Sprint 2.1** | Cursor workflow artifacts v2.0; `.gitignore`; prompt history initialized | Done |
| **Phase 3 — Sprint 3.1** | Server foundation: Express, Prisma, migration, seed, health | Done |
| **Phase 3 — Sprint 3.3** | Status state machine + dedicated status endpoint | Done |
| **Phase 3 — Sprint 3.4** | Comments, search, filter API — backend complete | Done |
| **Phase 4 — Sprint 4.1** | Client scaffold, types, API layer, routing | Done |
| **Phase 4 — Sprint 4.2** | Ticket list, search, filter UI; sidebar + dashboard | Done |
| **Phase 4 — Sprint 4.3** | Create ticket + detail pages; CommentList; 404 | Done |
| **Phase 4 — Sprint 4.4** | Edit, status change, comment form; Phase 4 complete | Done |
| **Phase 5 — Sprint 5.1** | Integration test suite; `docs/testing-notes.md` | Done |
| **Phase 5 — Sprint 5.2** | Manual QA; `docs/debugging-notes.md`; DEF-001 fixed | Done |
| **Phase 6 — Sprint 6.2** | Reflection, PR artifact, final regression, submission sign-off | Done |
| `docs/reflection.md` | AC-23 honest AI reflection | Done |
| `docs/pr-description.md` | Submission PR artifact (DOC-11) | Done |
| AI workflow (this doc) | `tool-workflow.md` v1.8 | Done |
| Prompt history | `prompt-history/sprint-5.2.md` | Done |
| Root README | `README.md` — setup, run, test verified | Done |
| `.gitignore` | Root `.gitignore` | Done |
| `server/.env.example` | Placeholder env template | Done |
| `client/.env.example` | `VITE_API_URL` template | Done |

### Not Yet Started

| Item | Notes |
| ---- | ----- |
| Stretch features (S.1) | Optional — not in core scope |

### Phase Summary

| Phase | Status |
| ----- | ------ |
| Phase 1 — Planning & Analysis | **Complete** |
| Phase 2 — System Design | **Complete** |
| Phase 3 — Backend Development | **Complete** — Sprints 3.1–3.4 done |
| Phase 4 — Frontend Development | **Complete** — Sprints 4.1–4.4 done |
| Phase 5 — Integration Testing & QA | **Complete** — Sprints 5.1–5.2 done |
| Phase 6 — Documentation & Submission | **Complete** — Sprints 6.1–6.2 done |

---

## Next Planned Sprint

**Optional — Stretch Sprint S.1** (only after core submission)

Per `tasks.md`, stretch is gated on 100% core Project Completion Checklist. Pick ≤2 items: JWT auth, RBAC, pagination, Docker Compose, or CI pipeline.

---

*Update this document after every major sprint. Last updated after Sprint 6.2 Quality Gate.*
