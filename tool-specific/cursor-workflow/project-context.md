# Project Context — Support Ticket Management System

**Purpose:** Persistent AI context for Cursor throughout the project lifecycle.  
**Source of Truth:** `docs/requirement-analysis.md` (v1.1)  
**Last Updated:** July 7, 2026  
**Status:** Active — Pre-Implementation  
**Spec:** `tool-specific/cursor-workflow/spec.md` (v1.1)

> When requirements conflict, **`docs/requirement-analysis.md` wins**. This document translates those requirements into architectural and collaboration guidance for AI-assisted development.

---

## 1. Project Overview

The **Support Ticket Management System** is an internal full-stack web application for managing support requests through a controlled lifecycle: create → assign → progress → resolve → close (or cancel).

### What We Are Building

| Layer | Responsibility |
| ----- | -------------- |
| **Frontend** | Ticket list, detail, create/update forms, status controls, comments, search, status filter, error display |
| **Backend API** | REST endpoints, validation, status state machine enforcement, persistence |
| **Database** | PostgreSQL with migrations, seed data, referential integrity |

### Exercise Context

This project is part of the **JS AI Capability Exercise**. Success is measured by:

1. A **working core application** meeting all mandatory acceptance criteria
2. **Visible engineering lifecycle** — analysis, planning, prompts, tests, debugging notes, reflection
3. **Responsible AI usage** — explainable decisions, validated output, no blind copy-paste

### Core Entities

| Entity | Key Fields |
| ------ | ---------- |
| **User** (seeded) | `id`, `name`, `email`, `role` (Agent \| Manager \| Admin) |
| **Ticket** | `id`, `title`, `description`, `priority`, `status`, `assignedTo`, `createdBy`, `createdAt`, `updatedAt` |
| **Comment** | `id`, `ticketId`, `message`, `createdBy`, `createdAt` |

### Status State Machine (Backend-Enforced)

```
Open → In Progress → Resolved → Closed
Open → Cancelled
In Progress → Cancelled
```

All other transitions are **invalid** and must return **400 Bad Request**.

---

## 2. Business Goal

### Primary Goal

Enable internal support teams to log, track, assign, and resolve issues through an auditable ticket lifecycle with collaboration via comments — reducing lost requests and improving queue visibility.

### Secondary Goal (Exercise)

Demonstrate effective, responsible AI-assisted software development across the full lifecycle: analysis → design → implementation → testing → debugging → review → documentation → reflection.

### Success Measures

| Measure | Target |
| ------- | ------ |
| Lifecycle integrity | Only valid status transitions succeed |
| Data durability | Tickets and comments persist across restarts |
| Discoverability | Search (title + description) and status filter work |
| Integrity | Invalid transitions rejected server-side with clear UI errors |
| Quality | Integration tests pass for valid and invalid transitions |
| Security | No secrets in Git |

---

## 3. Scope

### Core (Mandatory — Build First)

- Create, list, view, and update tickets (no delete)
- Status changes via dedicated endpoint with state machine enforcement
- Add comments on tickets in **any** status
- Search (title + description, case-insensitive partial match)
- Filter by status (invalid status → 400)
- Seeded users (3 users: Agent, Manager, Admin)
- PostgreSQL persistence with migrations and seed data
- Backend input validation and frontend error display
- Integration tests for status transitions
- README, `.env.example`, lifecycle artifacts

### Out of Scope (Core)

- Authentication and authorization
- User CRUD
- Ticket deletion (hard or soft)
- Pagination, sorting, priority filter, assignee filter
- Additional entities beyond User, Ticket, Comment

### Stretch (Optional — Only After Core Is Done)

- JWT/session authentication and RBAC
- User CRUD
- Pagination, sorting, additional filters
- Unit tests, Swagger/OpenAPI, Docker, CI/CD
- Extra entities

### Future Enhancements (Documented, Not v1)

| Enhancement | Notes |
| ----------- | ----- |
| Soft delete | `deletedAt` on tickets; exclude from default queries |
| Optimistic locking | `version` field; 409 Conflict on stale updates |
| Auth-based `createdBy` | Replace dropdown with logged-in user |

---

## 4. Selected Technology Stack

Architectural technology roles for v1. **Exact dependency versions are pinned in `package.json` at implementation time** — not in this document. Rationale for each choice: `spec.md` §5 Design Decisions.

### Stack Summary

| Layer | Technology | Role |
| ----- | ---------- | ---- |
| **Frontend** | React + TypeScript | UI components and pages |
| **Build tool** | Vite | Dev server and production build |
| **Routing** | React Router | List → detail → create navigation |
| **Backend** | Node.js + Express + TypeScript | REST API server |
| **Database** | PostgreSQL | Persistent relational storage |
| **ORM / Migrations** | Prisma | Schema, migrations, seed, type-safe queries |
| **Validation** | Zod | API input validation |
| **API testing** | Vitest + Supertest | Integration tests (HTTP + database) |
| **HTTP client** | `fetch` | Backend API communication |
| **Env management** | dotenv + `.env.example` | Configuration and secrets |

### What We Are Not Using (Unless Stretch)

- Next.js (unnecessary SSR complexity for internal CRUD app)
- MongoDB (relational FK model fits PostgreSQL better)
- GraphQL (REST is sufficient and assignment-aligned)
- Heavy UI libraries (keep UI simple and functional)

### Development Prerequisites

- Node.js (LTS)
- PostgreSQL (local or Docker)
- npm or pnpm

---

## 4a. Design Decisions (Summary)

Full register with rationale: **`spec.md` §5**. Product decisions (OQ-01–OQ-15): `docs/requirement-analysis.md` §16.

| ID | Decision |
| -- | -------- |
| DD-01 | REST API over GraphQL |
| DD-02 | PostgreSQL (OQ-12) |
| DD-03 | Separate `client/` + `server/` over Next.js full-stack |
| DD-04 | Dedicated status endpoint (OQ-09) |
| DD-05 | Prisma ORM |
| DD-06 | Zod validation |
| DD-07 | Vitest + Supertest integration tests |
| DD-08 | No auth in v1 (OQ-08) |
| DD-09 | Last-write-wins concurrency (OQ-14) |
| DD-10 | Local state + hooks (no global store) |
| DD-11 | Native `fetch` |

---

## 4b. Risks & Trade-offs (Summary)

Full register: **`spec.md` §7**. Business risks: `docs/requirement-analysis.md` §13.

**Key trade-offs accepted:**

- No auth → fast delivery, but user impersonation via dropdown
- Last-write-wins → simple code, but concurrent overwrites possible
- No pagination → simple list, but won't scale indefinitely
- Integration tests only → strong API coverage, no UI automation

**Top technical risks to watch:**

- Status logic implemented only on frontend → mitigate with `statusTransition.ts` + integration tests
- `status` accepted on general PATCH → mitigate with explicit rejection + test
- Scope creep → follow `tasks.md` sequencing; core before stretch

---

## 5. High-Level Architecture

### Architecture Style

**Three-tier monorepo** with separated `client/` and `server/` packages, communicating over REST JSON.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React)                       │
│  Pages: TicketList │ TicketDetail │ CreateTicket             │
│  Components: forms, status controls, comments, error alerts  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/JSON (REST)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express API (Node.js)                      │
│  Routes → Controllers → Services → Prisma Client             │
│  Middleware: error handler, validation, CORS                 │
│  Domain: StatusTransitionService (state machine)             │
└──────────────────────────┬──────────────────────────────────┘
                           │ SQL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
│  Tables: users, tickets, comments                            │
│  Constraints: FK, enums, ON DELETE RESTRICT                  │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Does | Does Not |
| ----- | ---- | -------- |
| **Frontend** | UX, form state, display errors, call API | Enforce status rules alone |
| **Routes** | HTTP mapping, request parsing | Business logic |
| **Controllers** | Request/response orchestration | Direct DB queries |
| **Services** | Business rules, state machine, validation orchestration | HTTP concerns |
| **Prisma** | Data access, transactions | Business rule decisions |

### Key Architectural Rules

1. **Status state machine lives in the backend service layer** — single source of truth
2. **Status changes use `PATCH /tickets/:id/status` only** — never via general update
3. **API responses include resolved names** — join/populate creator and assignee
4. **Concurrency: last-write-wins** — validate transitions against current DB state
5. **No auth in core** — `createdBy` selected from seeded user dropdown

### Request Flow Example (Status Change)

```
Client PATCH /tickets/:id/status { status: "In Progress" }
  → Route validates params
  → Controller delegates to TicketService.changeStatus()
  → Service loads current ticket from DB
  → StatusTransitionService.validate(current, requested)
  → If invalid: throw 400 with message
  → If valid: Prisma update, return enriched ticket DTO
```

---

## 6. Folder Structure

Aligns with the repository layout established at project init. Do not introduce alternate top-level folders without reason.

```
support-ticket-management-system/
├── client/                          # React frontend (Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── api/                     # API client functions (fetch wrappers)
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/              # Button, Input, ErrorAlert, Badge, etc.
│   │   │   ├── tickets/             # TicketCard, TicketForm, StatusSelector
│   │   │   └── comments/            # CommentList, CommentForm
│   │   ├── pages/                   # Route-level pages
│   │   │   ├── TicketListPage.tsx
│   │   │   ├── TicketDetailPage.tsx
│   │   │   └── CreateTicketPage.tsx
│   │   ├── types/                   # Shared TS interfaces (mirror API DTOs)
│   │   ├── hooks/                   # Custom hooks (useTickets, useUsers)
│   │   ├── utils/                   # Formatters, error parsing
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                          # Express API (Node.js + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma            # DB schema, enums, relations
│   │   ├── migrations/              # Generated migration files
│   │   └── seed.ts                  # Users, sample tickets, comments
│   ├── src/
│   │   ├── config/                  # Env loading, constants
│   │   ├── controllers/             # HTTP handlers
│   │   ├── services/                # Business logic
│   │   │   └── statusTransition.ts  # State machine (critical)
│   │   ├── routes/                  # Express routers
│   │   ├── validators/              # Zod schemas per endpoint
│   │   ├── middleware/              # errorHandler, validate, asyncHandler
│   │   ├── types/                   # API types, error types
│   │   ├── lib/                     # prisma client singleton
│   │   └── index.ts                 # App entry point
│   ├── tests/
│   │   └── integration/             # Status transition tests (mandatory)
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── assignment.md
│   └── requirement-analysis.md      # Source of truth
│
├── tests/                           # Cross-cutting test notes/fixtures (optional)
│
├── prompt-history/                  # AI prompt log for exercise submission
│
├── tool-specific/
│   └── cursor-workflow/
│       ├── project-context.md       # This file
│       ├── spec.md
│       ├── tasks.md
│       ├── acceptance-criteria.md
│       └── cursor-rules-or-instructions.md
│
├── .env.example                     # Template (no secrets)
├── .gitignore
└── README.md                        # Setup, run, test instructions
```

### File Naming Conventions

| Area | Convention | Example |
| ---- | ---------- | ------- |
| React components | PascalCase | `TicketListPage.tsx` |
| Server modules | camelCase | `ticketService.ts` |
| Routes | kebab or camel | `ticketRoutes.ts` |
| Tests | `*.test.ts` or `*.integration.test.ts` | `statusTransition.integration.test.ts` |

---

## 7. Coding Standards

### General Principles

- **Minimal scope** — smallest correct change; no unrelated refactors
- **Match existing patterns** — consistency over personal preference
- **Backend is authoritative** — never rely on frontend-only validation for business rules
- **Explicit over clever** — readable code for review and exercise demonstration
- **No secrets in code** — environment variables only

### TypeScript

- Strict mode enabled on both client and server
- Prefer `interface` for API DTOs and entity shapes
- Avoid `any`; use `unknown` and narrow when needed
- Shared enums (priority, status, role) defined once on server; mirrored as const/types on client

### Backend Standards

- Async route handlers wrapped with error-handling middleware
- One service class/module per domain area (Ticket, Comment, User)
- State machine logic isolated in `statusTransition.ts` — not scattered in controllers
- Prisma client as singleton (`lib/prisma.ts`)
- All DB timestamps in UTC (`DateTime` with `@default(now())`)

### Frontend Standards

- Functional components with hooks only
- API calls centralized in `src/api/` — not inline in components
- Display backend error messages to users; log technical details to console in dev
- Escape/sanitize user-generated content on render (XSS prevention)
- Show "Unassigned" when `assignedTo` is null

### Git and Commits

- Small, focused commits with clear messages
- Never commit `.env`, `node_modules`, or build artifacts
- Keep `prompt-history/` updated for exercise artifacts

### Dependencies

- Do not add libraries without justification
- Pin versions in `package.json`
- Prefer built-in or already-selected stack over new tools

---

## 8. API Design Principles

### REST Conventions

| Principle | Rule |
| --------- | ---- |
| Base path | `/api` prefix recommended (e.g., `/api/tickets`) |
| Nouns for resources | `/tickets`, `/tickets/:id/comments` |
| HTTP verbs | GET (read), POST (create), PATCH (partial update) |
| Status codes | 200, 201, 400, 404, 500 — use correctly |
| JSON only | `Content-Type: application/json` |

### Endpoint Contract (Authoritative)

| Method | Endpoint | Body / Params | Notes |
| ------ | -------- | ------------- | ----- |
| `GET` | `/api/tickets` | Query: `search?`, `status?` | Returns array with resolved names |
| `POST` | `/api/tickets` | `{ title, description, priority, createdBy, assignedTo? }` | Status auto-set to Open |
| `GET` | `/api/tickets/:id` | — | Ticket + comments + resolved names |
| `PATCH` | `/api/tickets/:id` | `{ title?, description?, priority?, assignedTo? }` | **Reject `status` with 400** |
| `PATCH` | `/api/tickets/:id/status` | `{ status }` | State machine enforced |
| `POST` | `/api/tickets/:id/comments` | `{ message, createdBy }` | Append-only |
| `GET` | `/api/users` | — | List seeded users for dropdowns |

### Response Shape Guidelines

**Ticket list item / detail** should include resolved names:

```json
{
  "id": 1,
  "title": "VPN not connecting",
  "description": "...",
  "priority": "High",
  "status": "Open",
  "assignedTo": 2,
  "assignedToName": "Sam Rivera",
  "createdBy": 1,
  "createdByName": "Alex Chen",
  "createdAt": "2026-07-07T10:00:00.000Z",
  "updatedAt": "2026-07-07T10:00:00.000Z"
}
```

**Comment:**

```json
{
  "id": 1,
  "ticketId": 1,
  "message": "Investigating network logs.",
  "createdBy": 1,
  "createdByName": "Alex Chen",
  "createdAt": "2026-07-07T11:00:00.000Z"
}
```

### Error Response Shape (Consistent)

```json
{
  "error": {
    "message": "Human-readable description",
    "code": "INVALID_STATUS_TRANSITION",
    "details": [{ "field": "status", "message": "Cannot transition from Closed to In Progress" }]
  }
}
```

### API Rules (Non-Negotiable)

1. Validate all inputs on the server with Zod before service layer
2. Invalid status filter → **400**
3. `status` on general PATCH → **400** with directive to use status endpoint
4. Non-existent resource → **404**
5. Invalid transition → **400** with transition-specific message
6. Search: case-insensitive `ILIKE`/`contains` on title AND description
7. Empty search string → no search filter applied

---

## 9. Database Choice

### Selected: PostgreSQL

| Aspect | Decision |
| ------ | -------- |
| Database | PostgreSQL |
| Connection | `DATABASE_URL` in `.env` |
| ORM | Prisma |
| Migrations | Prisma Migrate (`prisma migrate dev`) |
| Seeding | `prisma db seed` |

### Schema Design Notes

**Enums (Prisma or PG native):**

| Enum | Values |
| ---- | ------ |
| `Role` | Agent, Manager, Admin |
| `Priority` | Low, Medium, High, Critical |
| `Status` | Open, InProgress, Resolved, Closed, Cancelled |

> Use consistent display mapping in API (e.g., `In Progress` in JSON, `InProgress` in DB enum if needed).

**Tables:**

| Table | Notes |
| ----- | ----- |
| `users` | Unique email; 3 seeded rows |
| `tickets` | `assignedTo` nullable FK; `createdBy` required FK |
| `comments` | FK to tickets |

**Constraints:**

- All user FKs: `ON DELETE RESTRICT`
- `title` max 200, `description` max 5000, `message` max 2000 (app + DB where practical)
- No ticket delete in v1

**Seed Data Requirements:**

- 3 users (one per role: Agent, Manager, Admin)
- Sample tickets covering all 5 statuses
- At least one comment per sample ticket where practical

### Environment Variables

```env
# .env.example (no real values)
DATABASE_URL="postgresql://user:password@localhost:5432/support_tickets"
PORT=3001
CLIENT_URL=http://localhost:5173
```

---

## 10. Testing Strategy

### Priority: Integration Tests (Mandatory)

The assignment requires integration tests proving:

- Valid status transitions **succeed**
- Invalid status transitions **fail**

**Location:** `server/tests/integration/`

**Approach:**

| Aspect | Approach |
| ------ | -------- |
| Framework | Vitest + Supertest |
| Database | Separate test DB or reset between tests |
| Scope | HTTP API → Service → PostgreSQL (full stack except UI) |
| Setup | Run migrations + seed before test suite |

### Required Test Scenarios (Minimum)

**Valid transitions (expect 200):**

- Open → In Progress
- In Progress → Resolved
- Resolved → Closed
- Open → Cancelled
- In Progress → Cancelled

**Invalid transitions (expect 400):**

- Open → Resolved
- Open → Closed
- Resolved → Open
- Closed → In Progress
- Cancelled → In Progress
- In Progress → Open

**Additional high-value tests:**

- `PATCH /tickets/:id` with `status` field → 400
- Invalid `status` query filter → 400
- Create ticket with missing title → 400
- GET non-existent ticket → 404

### What Not to Prioritize in Core

- Frontend unit tests (stretch)
- E2E browser tests (stretch)
- 100% coverage targets

### Test Commands (Target)

```bash
# From server/
npm run test              # Run integration tests
npm run test:watch        # Dev watch mode
```

### Testing Notes

Document test approach, failures, and fixes in exercise testing notes (per assignment).

---

## 11. Error Handling Strategy

### Backend

| Layer | Responsibility |
| ----- | -------------- |
| **Zod validators** | Request shape and field rules; return 400 with field details |
| **Services** | Business rule violations (invalid transition); throw typed errors |
| **Error middleware** | Catch all; map to consistent JSON response |
| **Prisma** | Map known errors (e.g., record not found) to 404 |

### Error Categories

| Code | HTTP | When |
| ---- | ---- | ---- |
| `VALIDATION_ERROR` | 400 | Invalid input, missing fields, max length exceeded |
| `INVALID_STATUS_TRANSITION` | 400 | State machine violation |
| `STATUS_NOT_ALLOWED_HERE` | 400 | `status` sent on general update endpoint |
| `INVALID_FILTER` | 400 | Invalid status filter value |
| `NOT_FOUND` | 404 | Ticket, user, or comment parent not found |
| `INTERNAL_ERROR` | 500 | Unexpected errors; log stack, generic message to client |

### Frontend

| Scenario | UX |
| -------- | -- |
| 400 validation | Show field-level or banner error from API `message` |
| 400 invalid transition | Show clear message near status control |
| 404 | "Ticket not found" with link back to list |
| Network failure | "Unable to connect to server" |
| 500 | Generic error; don't expose stack trace |

### Logging

- Log unexpected errors server-side with context (route, ticket ID)
- Do not log secrets or full request bodies in production mode

---

## 12. AI Collaboration Rules

How Cursor should assist throughout this project.

### Before Writing Code

1. **Read context first** — `docs/requirement-analysis.md` and this file
2. **Confirm scope** — core vs stretch vs future; do not implement stretch unless asked
3. **Plan before generating** — outline files to create/modify
4. **Ask when ambiguous** — don't guess on unresolved requirements

### During Implementation

| Do | Don't |
| -- | ----- |
| Implement backend state machine before frontend status UI | Put transition logic only in React |
| Generate focused, reviewable diffs | Rewrite unrelated files |
| Follow folder structure in Section 6 | Invent new architecture patterns |
| Add integration tests when changing status logic | Skip tests for state machine changes |
| Use Zod + service layer separation | Put business logic in route handlers |
| Update `prompt-history/` when asked | Fabricate prompt history |
| Match existing code style | Introduce new frameworks mid-project |

### Validation of AI Output

After Cursor generates code, verify:

- [ ] Status transitions enforced server-side
- [ ] `PATCH /tickets/:id` rejects `status`
- [ ] API returns resolved creator/assignee names
- [ ] Field length limits match spec (200/5000/2000)
- [ ] No secrets hardcoded
- [ ] Integration tests still pass
- [ ] Changes are minimal and explainable

### Prompting Guidance for the Developer

When asking Cursor for help, include:

- Which layer (client / server / db / tests)
- Relevant acceptance criteria IDs (AC-01, etc.)
- Business rule IDs when touching status logic (BR-02, etc.)
- "Core only" or "Stretch" explicitly

**Example prompt:**

> Implement `StatusTransitionService` per BR-02 in `docs/requirement-analysis.md`. Valid transitions only. Throw 400 with clear message on invalid. No frontend code.

### Documentation Updates

Cursor may update docs when asked, but should not silently change `requirement-analysis.md`. Implementation details go in `spec.md`, `tasks.md`, or README.

### Exercise Integrity

- Keep prompt history honest and organized
- Be able to explain every AI-generated section
- Reflection should describe what AI helped with and what you validated manually

---

## 13. Definition of Done

A feature or the overall project is **done** when all applicable criteria below are met.

### Per-Feature Done

- [ ] Implements mapped functional requirements from `requirement-analysis.md`
- [ ] Backend validation in place
- [ ] Frontend displays API errors appropriately
- [ ] No secrets committed
- [ ] Integration tests added/updated if status or API contract changed
- [ ] Code is readable and follows Section 7 standards

### Core Project Done (Exercise Submission Ready)

#### Application

- [ ] **AC-01–AC-11:** All ticket, status, comment, search, and filter criteria pass
- [ ] **AC-12:** Data persists after restart
- [ ] **AC-13:** Backend validates inputs; appropriate HTTP errors returned
- [ ] **AC-14:** `.env.example` provided; `.env` gitignored; no secrets in repo
- [ ] **AC-15:** Prisma migrations and seed script work on fresh clone
- [ ] **AC-16:** README documents full local setup (DB, migrate, seed, run client + server, run tests)
- [ ] **AC-17–AC-18:** Integration tests pass for valid and invalid transitions

#### Architecture Compliance

- [ ] PostgreSQL in use with correct FK constraints (`ON DELETE RESTRICT`)
- [ ] Status endpoint separated from general update
- [ ] Search: title + description, case-insensitive partial match
- [ ] API includes resolved user names
- [ ] 3 seeded users (Agent, Manager, Admin)
- [ ] Sample tickets across all statuses with comments
- [ ] No ticket delete endpoint in v1

#### Exercise Artifacts

- [ ] **AC-19:** `docs/requirement-analysis.md` complete
- [ ] **AC-20:** `prompt-history/` maintained
- [ ] **AC-21:** `tool-specific/cursor-workflow/` artifacts present
- [ ] **AC-22:** Testing and debugging notes documented
- [ ] **AC-23:** Reflection document included
- [ ] `tool-workflow.md` or equivalent AI workflow documentation

#### Quality Bar

- [ ] Application runs locally from README instructions
- [ ] Invalid status transitions show clear UI errors
- [ ] Developer can explain architecture and state machine
- [ ] Commit history is clean and incremental

### Explicitly Not Required for Core Done

- Authentication / RBAC
- Pagination / sorting / extra filters
- Soft delete
- Optimistic locking
- Docker / CI/CD / Swagger
- Frontend test suite

---

## Quick Reference Card

| Topic | Decision |
| ----- | -------- |
| Database | PostgreSQL + Prisma |
| Backend | Express + TypeScript + Zod |
| Frontend | React + Vite + TypeScript |
| Status changes | `PATCH /api/tickets/:id/status` only |
| Search | Title + description, case-insensitive partial |
| Priorities | Low, Medium, High, Critical |
| Roles | Agent, Manager, Admin (1 seeded user each) |
| Assignee | Optional (nullable) |
| createdBy | Dropdown (core); logged-in user (stretch) |
| Delete | Not in v1 |
| Concurrency | Last-write-wins |
| Mandatory tests | Status transition integration tests |

---

*This document is the persistent Cursor context for the Support Ticket Management System. Update it when major architectural decisions change. Requirement details: `docs/requirement-analysis.md`. Implementation blueprint: `tool-specific/cursor-workflow/spec.md`. Work sequencing: `tool-specific/cursor-workflow/tasks.md`.*
