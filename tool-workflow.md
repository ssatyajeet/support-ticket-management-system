# AI Tool Workflow — Support Ticket Management System

**Document Version:** 1.4  
**Last Updated:** July 10, 2026  
**Status:** Living document — update after every major sprint  
**Exercise:** JS AI Capability Exercise — Part A (AI Workflow Foundation)

> Only **completed** activities are documented below. Sections for work not yet started are marked **Pending**.

---

# AI Tool Workflow

## Project Overview

This project is a **Support Ticket Management System** — an internal full-stack web application for creating, tracking, updating, assigning, and progressing support tickets through a controlled lifecycle, with comments, search, and status filtering.

It is being built as part of the **JS AI Capability Exercise**, which evaluates not only whether the application works, but how effectively AI is used across the software development lifecycle: analysis, design, implementation, testing, debugging, and documentation.

**Target stack (approved):** React (Vite) + Express + PostgreSQL + Prisma.

**Current phase:** Phase 4 frontend in progress (Sprint 4.2 complete); Sprint 4.3 next.

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

`prompt-history/` is initialized. Sprints 1.1 through 4.2 logs are complete. See `prompt-history/README.md` for the session index.

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

### Design Decisions Validated (Not Yet Implemented)

Through Ask-mode review, the developer evaluated **Next.js vs React + Express** and confirmed the split-stack approach in `spec.md` DD-03 — no implementation change; architectural decision recorded.

---

## Code Generation

**Status: In progress** — Sprints 3.1–3.3 complete.

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

**Pending (future sprints):**

- React client pages and components (Phase 4 — list complete; create/detail pending Sprint 4.3)
- Integration tests (Sprint 5.1)

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

**Status: In progress** — Sprints 3.1–3.4, 4.1–4.2

- Task-by-task review against `spec.md` and `cursor-rules-or-instructions.md`
- `npm run build` at sprint QG (server 3.1–3.4; client 4.1–4.2)
- Sprint 3.2: curl CRUD — 11/11
- Sprint 3.3: curl transition matrix — 13/13
- Sprint 3.4: QG curl — 6/6 new cases (task-level curls not re-run)
- Sprint 4.1: build + CORS + users API — passed
- Sprint 4.2: client build — passed; list UI manual checklist

---

## Testing

**Status: Pending**

This section will be completed during Sprint 5.1 onward.

*Placeholder for future updates:*

- Integration test development with AI assistance
- How AI helped write status transition test cases
- Test failures and fixes
- Link to `docs/testing-notes.md`

---

## Debugging

**Status: Pending**

This section will be completed when defects are encountered during implementation and QA.

*Placeholder for future updates:*

- Issues found during manual QA (Sprint 5.2)
- Root cause analysis
- Link to `docs/debugging-notes.md`

---

## Reflection

**Status: Pending**

This section will be completed in Sprint 6.2 before submission.

*Placeholder for future updates:*

- What AI did well vs what required manual correction
- Lessons for future AI-assisted projects
- Link to `docs/reflection.md`

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
| AI workflow (this doc) | `tool-workflow.md` v1.4 | Done |
| Prompt history | `prompt-history/sprint-4.2.md` | Done |
| `client/.env.example` | `VITE_API_URL` template | Done |
| Server README section | `README.md` | Done |
| `.gitignore` | Root `.gitignore` | Done |
| `server/.env.example` | Placeholder env template | Done |

### Not Yet Started

| Item | Notes |
| ---- | ----- |
| Create ticket + detail UI | Sprint 4.3 |
| Integration tests | Pending Sprint 5.1 |
| `docs/testing-notes.md`, `docs/debugging-notes.md`, `docs/reflection.md` | Pending later sprints |

### Phase Summary

| Phase | Status |
| ----- | ------ |
| Phase 1 — Planning & Analysis | **Complete** |
| Phase 2 — System Design | **Complete** |
| Phase 3 — Backend Development | **Complete** — Sprints 3.1–3.4 done |
| Phase 4 — Frontend Development | **In progress** — Sprint 4.2 complete; 4.3 next |

---

## Next Planned Sprint

**Sprint 4.3 — Create Ticket & Ticket Detail** (Phase 4 — Frontend Development)

Per `tasks.md`, the next implementation sprint will:

- Add `useUsers` hook and `UserSelect` component
- Build `TicketForm` and wire `CreateTicketPage`
- Add `useTicket` hook and full `TicketDetailPage` with comments list

Prerequisite: Sprint 4.2 Quality Gate passed.

---

*Update this document after every major sprint. Last updated after Sprint 4.2 Quality Gate.*
