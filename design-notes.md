# Design Notes — Support Ticket Management System

**Document Version:** 1.2  
**Date:** July 15, 2026  
**Role:** Solution Architecture & Technical Lead  
**Status:** Approved for Implementation  
**Traceability:** `requirements-analysis.md` (v1.1), `tool-specific/cursor-workflow/project-context.md`

### Design sections

| Section | Location in this document |
| ------- | ------------------------- |
| **Architecture Overview** | Three-tier diagram — frontend, backend, database |
| **Frontend Design** | [`ui-flow.md`](ui-flow.md) — pages, components, routing, state |
| **Backend Design** | Layers, modules, state machine (below) |
| **Database Design** | [`data-model.md`](data-model.md) — schema, enums, relationships, seed |
| **Validation Strategy** | Zod + service-layer rules |
| **Error Handling Strategy** | `ErrorResponse` shape and middleware |
| **Testing Strategy Link** | Scope summary + links to testing docs |

Supporting sections (goals, stack, API contract, traceability) follow the design sections above.

---

## 1. Executive Summary

This specification defines the technical blueprint for an internal **Support Ticket Management System** — a three-tier full-stack application built as part of the JS AI Capability Exercise. The system enables support staff to create, view, update, assign, search, filter, and progress tickets through a enforced lifecycle, with threaded comments for collaboration.

**Architecture:** React (Vite) frontend + Express REST API + PostgreSQL (Prisma ORM), deployed as a local monorepo (`client/` + `server/`).

**Critical design constraint:** Ticket status transitions are enforced exclusively on the backend via a dedicated API endpoint and a centralized state machine service. Integration tests for valid/invalid transitions are mandatory.

**Delivery target:** Core features first (8–12 focused hours); stretch features only after core acceptance criteria (AC-01–AC-18) are met.

---

## 2. Project Goals

| Goal | Description | Traceability |
| ---- | ----------- | ------------ |
| **Operational** | Provide auditable ticket lifecycle management with search, filter, and comments | FR-C-01–FR-C-18, BR-01–BR-17 |
| **Data integrity** | Persist all data in PostgreSQL; enforce FK constraints and status rules server-side | NFR-01, NFR-02, AC-12 |
| **Quality** | Pass mandatory status-transition integration tests | AC-17, AC-18 |
| **Exercise** | Demonstrate explainable AI-assisted full-stack delivery with lifecycle artifacts | NFR-10, AC-19–AC-23 |
| **Security hygiene** | No secrets in version control | NFR-05, AC-14 |

---

## 3. System Scope

### In Scope (v1 Core)

| Area | Capabilities |
| ---- | ------------ |
| Tickets | Create, list, detail, update (title, description, priority, assignee) — **no delete** |
| Status | Five statuses; five valid transitions; dedicated status endpoint |
| Comments | Add on any ticket status; chronological display |
| Discovery | Search (title + description); filter by status |
| Users | Three seeded users (Agent, Manager, Admin) for dropdowns |
| Infrastructure | Migrations, seed data, `.env.example`, README, integration tests |

### Explicitly Excluded from v1

Authentication, authorization, user CRUD, ticket deletion, pagination, sorting, priority/assignee filters, additional entities, Docker/CI/CD/Swagger (unless stretch).

---

## 4. Technology Stack

Describes architectural technology **roles** — not pinned dependency versions. Exact versions are resolved in `package.json` at implementation time.

| Layer | Technology | Role |
| ----- | ---------- | ---- |
| Runtime | Node.js (LTS) | Server runtime |
| Frontend framework | React + TypeScript | UI components and pages |
| Build tool | Vite | Frontend dev server and production build |
| Client routing | React Router | Multi-page navigation |
| Backend framework | Express + TypeScript | REST API server |
| Database | PostgreSQL | Persistent relational storage |
| ORM / migrations | Prisma | Schema, migrations, seeding, type-safe queries |
| Request validation | Zod | API input validation |
| API testing | Vitest + Supertest | Integration tests (HTTP + database) |
| HTTP client (frontend) | `fetch` | Backend API communication |
| Environment | dotenv | Configuration and secrets loading |

> See **§5 Design Decisions** for rationale behind each choice.

---

## 5. Design Decisions

Technical and architectural decisions for v1. Product-level decisions (field lengths, seed data, etc.) remain in `requirements-analysis.md` §16 (OQ-01–OQ-15). Cross-references noted where applicable.

### DD-01 — REST API over GraphQL

**Reason:** Simple CRUD application with well-defined resources (tickets, comments, users). REST maps directly to assignment requirements (frontend + backend API) and supports straightforward Supertest integration tests.

### DD-02 — PostgreSQL over document/NoSQL stores

**Reason:** Relational model with foreign keys, enums, and `ON DELETE RESTRICT` integrity rules.  
**Cross-ref:** OQ-12

### DD-03 — Separate `client/` + `server/` monorepo over Next.js full-stack

**Reason:** Clear API boundary between frontend and backend; aligns with exercise structure; simpler HTTP-level integration testing; avoids SSR complexity unnecessary for an internal CRUD tool.

### DD-04 — Dedicated `PATCH /tickets/:id/status` endpoint

**Reason:** Isolates state machine logic; prevents status changes via general update; enables focused integration tests.  
**Cross-ref:** OQ-09, BR-15

### DD-05 — Prisma as ORM and migration tool

**Reason:** Schema-as-code, migration workflow, seed script support, and type-safe queries reduce boilerplate for a three-table relational model.

### DD-06 — Zod for request validation

**Reason:** Declarative validation at the API boundary; consistent 400 error shape; integrates cleanly with Express middleware.

### DD-07 — Vitest + Supertest for mandatory integration tests

**Reason:** Tests exercise real HTTP endpoints against a live database — satisfying the assignment's integration test requirement without browser automation.

### DD-08 — No authentication in v1

**Reason:** Reduces core scope; `createdBy` selected via seeded user dropdown is acceptable for the exercise. Auth deferred to stretch.  
**Cross-ref:** OQ-08, A-03

### DD-09 — Last-write-wins concurrency over optimistic locking

**Reason:** Simpler implementation for v1; status transitions always validated against current database state. Optimistic locking deferred to future enhancements.  
**Cross-ref:** OQ-14, BR-17

### DD-10 — Local component state + custom hooks (no global store)

**Reason:** Application state is page-scoped (list filters, form inputs, fetch status). Redux/Zustand adds complexity without benefit at v1 scale.

### DD-11 — `fetch` over HTTP client libraries

**Reason:** Native browser API; no extra dependency for a small set of API calls.

---

## Architecture Overview

Three-tier **monorepo** — frontend (React), backend (Express), database (PostgreSQL).

### Pattern

Clear separation between presentation, application, and data layers.

```
┌──────────────────────────────────────────────────────────┐
│  CLIENT (React + Vite)          Port: 5173               │
│  Pages → Components → api/ → fetch                       │
└────────────────────────┬─────────────────────────────────┘
                         │ REST JSON  /api/*
                         ▼
┌──────────────────────────────────────────────────────────┐
│  SERVER (Express + TS)          Port: 3001             │
│  Routes → Controllers → Services → Prisma                │
│  Middleware: CORS, validate, errorHandler                │
└────────────────────────┬─────────────────────────────────┘
                         │ SQL via Prisma
                         ▼
┌──────────────────────────────────────────────────────────┐
│  PostgreSQL                     DATABASE_URL             │
│  users | tickets | comments                              │
└──────────────────────────────────────────────────────────┘
```

### Cross-Cutting Concerns

| Concern | Implementation |
| ------- | -------------- |
| CORS | Allow `CLIENT_URL` origin |
| Validation | Zod middleware before controllers |
| Errors | Central `errorHandler` middleware |
| Timestamps | UTC in DB; display in local or UTC consistently |
| Concurrency | Last-write-wins; validate against live DB state (BR-17) |

---

## 7. Risks & Trade-offs

Single register of accepted architectural trade-offs and technical risks. Full business risk register: `requirements-analysis.md` §13.

### Trade-offs (Accepted)

| Decision | Benefit | Cost |
| -------- | ------- | ---- |
| No auth in v1 (DD-08) | Faster delivery; simpler UX | Any user can act as any seeded user |
| Last-write-wins (DD-09) | No version column; simpler code | Concurrent edits may silently overwrite |
| No pagination | Simple list API and UI | Performance degrades as ticket volume grows |
| Split client/server (DD-03) | Clear boundaries; testable API | Two processes; CORS configuration required |
| `ILIKE` partial search | Simple query implementation | Slower than full-text search at scale |
| Prisma ORM (DD-05) | Migrations, seeding, type safety | Enum/display mapping layer needed (`In Progress` ↔ `InProgress`) |
| Integration tests only | Focused quality gate on state machine | No automated UI regression coverage |
| No ticket delete in v1 | Reduced scope | No way to remove erroneous tickets |

### Technical Risks

Severity scale: see `requirements-analysis.md` §13. **High** = Medium likelihood × High impact, or Low likelihood × High impact.

| Risk | Likelihood | Impact | Severity | Mitigation | Verified by |
| ---- | ---------- | ------ | -------- | ---------- | ----------- |
| Status logic implemented only on frontend | Medium | High | **High** | `statusTransition.ts` service; mandatory integration tests (AC-17, AC-18) | 16/16 IT; `changeStatus()` reads live DB state |
| General PATCH accepts `status` and bypasses state machine | Medium | High | **High** | Explicit rejection in `ticketService.update`; integration test | `STATUS_NOT_ALLOWED_HERE` guard IT |
| Enum mapping bugs between API and database | Medium | Medium | Medium | Single mapper layer; test all five statuses | All five statuses in seed + API responses |
| Scope creep into stretch features | Medium | High | **High** | §20 Out of Scope; sequencing in `implementation-plan.md` | Core AC complete; S.1 not started |
| Test database pollution between runs | Medium | Medium | Medium | Separate test `DATABASE_URL` or truncate between tests | `server/tests/helpers/db.ts` truncate/seed |
| Secrets committed to Git | Low | High | **High** | `.env.example` + `.gitignore`; AC-14 | Secrets audit Sprint 5.2.2 |
| Prisma/schema drift from API contracts | Low | Medium | Medium | DTO mappers; seed data as contract smoke test | `api-contract.md` matches implemented API |

### Top 5 technical risks (aligned with `requirements-analysis.md` §13)

| Rank | Severity | Risk | Verification |
| ---- | -------- | ---- | ------------ |
| 1 | **High** | State machine untested or frontend-only | `statusTransition.ts` + 16/16 IT |
| 2 | **High** | Status bypass via general PATCH | Dedicated status endpoint + guard IT |
| 3 | **High** | Secrets in version control | `.gitignore`; AC-14 audit |
| 4 | **High** | Scope creep into stretch | QG gates; checklist sign-off |
| 5 | **High** | Insufficient transition edge-case coverage | AC-17/AC-18 matrix complete |

---

## 8. Module Breakdown

### Repository Modules

| Module | Path | Responsibility |
| ------ | ---- | -------------- |
| **Client App** | `client/` | UI, routing, API consumption, error display |
| **API Server** | `server/` | REST API, business logic, persistence |
| **Database Layer** | `server/prisma/` | Schema, migrations, seed |
| **Integration Tests** | `server/tests/integration/` | HTTP + DB status transition tests |
| **Documentation** | `docs/`, `tool-specific/` | Requirements, spec, workflow artifacts |

### Server Domain Modules

| Module | Files (planned) | Responsibility |
| ------ | --------------- | -------------- |
| **Ticket** | `ticketService`, `ticketController`, `ticketRoutes`, `ticketValidators` | CRUD (no delete), list/search/filter |
| **Status** | `statusTransition.ts` | State machine validation (isolated) |
| **Comment** | `commentService`, `commentController`, `commentRoutes`, `commentValidators` | Append comments |
| **User** | `userService`, `userController`, `userRoutes` | Read-only list for dropdowns |
| **Shared** | `lib/prisma`, `middleware/*`, `types/*`, `config/*` | Infrastructure |

### Client Feature Modules

| Module | Path | Responsibility |
| ------ | ---- | -------------- |
| **Tickets** | `pages/`, `components/tickets/` | List, detail, create, edit, status |
| **Comments** | `components/comments/` | List and add comments |
| **Common** | `components/common/` | Reusable UI primitives |
| **API Client** | `api/` | Typed fetch wrappers per resource |
| **Types** | `types/` | DTOs mirroring API contracts |

---

## Frontend Design

> **Canonical spec:** [`ui-flow.md`](ui-flow.md) — pages, components, routing, state management, UX rules (US-01–US-15, AC-01–AC-11).

---

## Backend Design

### 10.1 Modules

| Module | Exports | Depends On |
| ------ | ------- | ---------- |
| `config` | `env`, constants | dotenv |
| `lib/prisma` | Prisma client singleton | @prisma/client |
| `services/statusTransition` | `validateTransition`, `getAllowedTransitions` | — |
| `services/ticketService` | CRUD + status change + search | prisma, statusTransition |
| `services/commentService` | create, list by ticket | prisma |
| `services/userService` | list all | prisma |
| `validators/*` | Zod schemas | zod |
| `controllers/*` | HTTP handlers | services, validators |
| `routes/*` | Express routers | controllers, middleware |
| `middleware` | errorHandler, validate, asyncHandler | — |

### 10.2 Services

#### `statusTransition.ts` (Critical)

| Function | Input | Output | Rules |
| -------- | ----- | ------ | ----- |
| `validateTransition(current, next)` | Two status enums | `void` or throw `INVALID_STATUS_TRANSITION` | BR-02–BR-06 |
| `getAllowedTransitions(current)` | Current status | Array of valid next statuses | For frontend hints |

**Valid transition map:**

| From | Allowed To |
| ---- | ---------- |
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | — (terminal) |
| Cancelled | — (terminal) |

#### `ticketService.ts`

| Method | Description |
| ------ | ----------- |
| `list({ search?, status? })` | Query with ILIKE on title/description; optional status filter |
| `getById(id)` | Ticket + comments + resolved names |
| `create(data)` | Set status=Open, timestamps; validate user FKs |
| `update(id, data)` | Reject if `status` in payload; update allowed fields |
| `changeStatus(id, status)` | Load current → validate transition → update |
| `toDto(ticket)` | Map Prisma model to API response with resolved names |

#### `commentService.ts`

| Method | Description |
| ------ | ----------- |
| `create(ticketId, data)` | Verify ticket exists; append comment |
| `listByTicket(ticketId)` | Ordered by `createdAt` ASC |

#### `userService.ts`

| Method | Description |
| ------ | ----------- |
| `list()` | All seeded users for dropdowns |

### 10.3 Controllers

| Controller | Handlers |
| ---------- | -------- |
| `ticketController` | `listTickets`, `getTicket`, `createTicket`, `updateTicket`, `changeStatus` |
| `commentController` | `addComment` |
| `userController` | `listUsers` |

Controllers: parse request → call service → map to HTTP status → send JSON. No business logic.

### 10.4 Routes

| Router | Mount Path | Routes |
| ------ | ---------- | ------ |
| `ticketRoutes` | `/api/tickets` | See Section 12 |
| `commentRoutes` | `/api/tickets/:id/comments` | `POST /` |
| `userRoutes` | `/api/users` | `GET /` |
| `healthRoutes` | `/api/health` | `GET /` (optional, for smoke test) |

**Middleware chain per route:** `asyncHandler` → `validate(schema)` → `controller`

---

## Database Design

> **Canonical spec:** [`data-model.md`](data-model.md) — tables, relationships, constraints, enums, seed requirements.  
> **Setup:** [`database/setup-notes.md`](database/setup-notes.md). **Implementation:** `server/prisma/`.

---

## 12. API Specification

> **Standalone contract:** Per-endpoint Request / Response / Validation / Errors — [`api-contract.md`](api-contract.md)

**Base URL:** `http://localhost:3001/api`  
**Content-Type:** `application/json`

### 12.1 Endpoint Summary

| Method | Endpoint | Description | FR / BR |
| ------ | -------- | ----------- | ------- |
| `GET` | `/health` | Health check | — |
| `GET` | `/users` | List seeded users | FR-C-19 |
| `GET` | `/tickets` | List with optional `search`, `status` | FR-C-04, FR-C-17, FR-C-18 |
| `POST` | `/tickets` | Create ticket | FR-C-01–03 |
| `GET` | `/tickets/:id` | Ticket detail + comments | FR-C-05 |
| `PATCH` | `/tickets/:id` | Update ticket fields (no status) | FR-C-06, FR-C-07, BR-15 |
| `PATCH` | `/tickets/:id/status` | Change status | FR-C-09–13, BR-02 |
| `POST` | `/tickets/:id/comments` | Add comment | FR-C-14–16 |

### 12.2 Request/Response Contracts

#### `GET /api/users`

**Response 200:**

| Field | Type | Description |
| ----- | ---- | ----------- |
| `[].id` | number | User ID |
| `[].name` | string | Display name |
| `[].email` | string | Email |
| `[].role` | string | Agent \| Manager \| Admin |

---

#### `GET /api/tickets`

**Query parameters:**

| Param | Type | Required | Validation |
| ----- | ---- | -------- | ---------- |
| `search` | string | No | Empty = ignored; partial match title + description |
| `status` | string | No | Valid status enum; invalid → 400 |

**Response 200:** Array of `TicketSummary`

---

#### `POST /api/tickets`

**Request body:**

| Field | Type | Required | Validation |
| ----- | ---- | -------- | ---------- |
| `title` | string | Yes | Trimmed, 1–200 chars |
| `description` | string | Yes | Trimmed, 1–5000 chars |
| `priority` | string | Yes | Low \| Medium \| High \| Critical |
| `createdBy` | number | Yes | Valid user ID |
| `assignedTo` | number | No | Valid user ID or omit/null |

**Response 201:** `TicketDetail` (status = Open, timestamps set)

---

#### `GET /api/tickets/:id`

**Response 200:** `TicketDetail` with nested `comments[]`  
**Response 404:** Ticket not found

---

#### `PATCH /api/tickets/:id`

**Request body (all optional, at least one required):**

| Field | Type | Validation |
| ----- | ---- | ---------- |
| `title` | string | 1–200 chars |
| `description` | string | 1–5000 chars |
| `priority` | string | Valid enum |
| `assignedTo` | number \| null | Valid user ID or null to unassign |
| `status` | — | **FORBIDDEN** → 400 `STATUS_NOT_ALLOWED_HERE` |

**Response 200:** Updated `TicketDetail`

---

#### `PATCH /api/tickets/:id/status`

**Request body:**

| Field | Type | Required |
| ----- | ---- | -------- |
| `status` | string | Yes — valid target status |

**Response 200:** Updated `TicketDetail`  
**Response 400:** Invalid transition (`INVALID_STATUS_TRANSITION`)

---

#### `POST /api/tickets/:id/comments`

**Request body:**

| Field | Type | Required | Validation |
| ----- | ---- | -------- | ---------- |
| `message` | string | Yes | Trimmed, 1–2000 chars |
| `createdBy` | number | Yes | Valid user ID |

**Response 201:** `Comment`  
**Response 404:** Ticket not found

---

### 12.3 Shared DTOs

#### `TicketSummary` / `TicketDetail`

| Field | Type | Notes |
| ----- | ---- | ----- |
| `id` | number | |
| `title` | string | |
| `description` | string | |
| `priority` | string | |
| `status` | string | Display format: `In Progress` |
| `assignedTo` | number \| null | User ID |
| `assignedToName` | string \| null | Resolved name; null if unassigned |
| `createdBy` | number | User ID |
| `createdByName` | string | Resolved name |
| `createdAt` | string (ISO 8601) | UTC |
| `updatedAt` | string (ISO 8601) | UTC |
| `comments` | `Comment[]` | Detail only; ordered ASC |

#### `Comment`

| Field | Type |
| ----- | ---- |
| `id` | number |
| `ticketId` | number |
| `message` | string |
| `createdBy` | number |
| `createdByName` | string |
| `createdAt` | string (ISO 8601) |

#### `ErrorResponse`

| Field | Type |
| ----- | ---- |
| `error.message` | string |
| `error.code` | string |
| `error.details` | `{ field, message }[]` (optional) |

---

## Validation Strategy

Validation occurs in **Zod schemas** (request shape) and **services** (business rules). All errors return consistent `ErrorResponse`.

### Input Validation (Zod)

| Endpoint | Field | Rule |
| -------- | ----- | ---- |
| Create ticket | `title` | Required, trim, max 200 |
| Create ticket | `description` | Required, trim, max 5000 |
| Create ticket | `priority` | Enum: Low, Medium, High, Critical |
| Create ticket | `createdBy` | Positive integer |
| Create ticket | `assignedTo` | Optional positive integer or null |
| Update ticket | All fields | Same as create where applicable; reject `status` key |
| Change status | `status` | Valid status enum |
| Add comment | `message` | Required, trim, max 2000 |
| Add comment | `createdBy` | Positive integer |
| List tickets | `status` | If present, valid status enum else 400 |
| List tickets | `search` | Optional string; empty ignored |

### Referential Validation (Service)

| Check | Error |
| ----- | ----- |
| User ID not found | 404 `NOT_FOUND` |
| Ticket ID not found | 404 `NOT_FOUND` |
| Invalid status transition | 400 `INVALID_STATUS_TRANSITION` |

**Traceability:** Section 9 of requirements-analysis; OQ-10, OQ-15

---

## 14. Business Rules

Implementation must enforce these in the **service layer** (not UI alone).

| ID | Rule | Implementation Location |
| -- | ---- | ----------------------- |
| BR-01 | New tickets start as Open | `ticketService.create` |
| BR-02–BR-06 | Status state machine | `statusTransition.validateTransition` |
| BR-07 | Assignee optional on create | Schema + service |
| BR-08–BR-09 | Reassign anytime; no status side-effect | `ticketService.update` |
| BR-10 | Comments on all statuses | `commentService.create` (no status check) |
| BR-11 | Comments append-only | No update/delete endpoints |
| BR-12 | Comments ASC by createdAt | `commentService.listByTicket` orderBy |
| BR-13–BR-14 | Seeded users only | No user write endpoints |
| BR-15 | Status only via status endpoint | `ticketService.update` rejects `status` |
| BR-16 | Resolved names in responses | `toDto` mappers with Prisma `include` |
| BR-17 | Last-write-wins concurrency | Always read current status before transition |

---

## Error Handling Strategy

### Backend Error Pipeline

```
Request → Zod validate → Controller → Service
                ↓              ↓           ↓
              400           throw       AppError
                                    ↓
                            errorHandler middleware
                                    ↓
                              JSON ErrorResponse
```

### Error Code Catalog

| Code | HTTP | Trigger |
| ---- | ---- | ------- |
| `VALIDATION_ERROR` | 400 | Zod failure, empty fields, max length |
| `INVALID_STATUS_TRANSITION` | 400 | State machine violation |
| `STATUS_NOT_ALLOWED_HERE` | 400 | `status` on PATCH `/tickets/:id` |
| `INVALID_FILTER` | 400 | Invalid `status` query param |
| `NOT_FOUND` | 404 | Missing ticket or user |
| `INTERNAL_ERROR` | 500 | Unhandled exception |

### Frontend Error Display

| HTTP | UI Behavior |
| ---- | ----------- |
| 400 | Show `error.message`; field details near form fields |
| 404 | Dedicated not-found state with link to list |
| 500 | Generic "Something went wrong" |
| Network | "Unable to connect to server" |

### Logging

- Log 500 errors with stack trace and request path (server console)
- Never log `DATABASE_URL` or secrets

---

## Testing Strategy Link

**Detailed testing documentation:**

| Document | Purpose |
| -------- | ------- |
| [`test-strategy.md`](test-strategy.md) | Formal strategy — scope, tiers, gaps, operational runbook |
| [`test-results.md`](test-results.md) | Recorded test run output (AC-17, AC-18) |
| [`docs/manual-regression-checklist.md`](docs/manual-regression-checklist.md) | Sprint 5.2 manual QA checklist |
| [`debugging-notes.md`](debugging-notes.md) | Issues found and fixes during QA |

### Scope summary (mandatory v1)

| Suite | Location | Framework | Coverage |
| ----- | -------- | --------- | -------- |
| Status transition integration | `server/tests/integration/` | Vitest + Supertest | AC-17, AC-18 |

**Test database:** Separate `DATABASE_URL` for tests or truncate tables between tests.

### Required Scenarios

| Category | Cases | Expected |
| -------- | ----- | -------- |
| Valid transitions | Open→In Progress, In Progress→Resolved, Resolved→Closed, Open→Cancelled, In Progress→Cancelled | 200 |
| Invalid transitions | Open→Resolved, Open→Closed, Resolved→Open, Closed→In Progress, Cancelled→In Progress, In Progress→Open | 400 |
| API guard | PATCH ticket with `status` field | 400 |
| Filter guard | GET tickets `?status=Invalid` | 400 |
| Validation | POST ticket without title | 400 |
| Not found | GET `/tickets/99999` | 404 |

### Out of Test Scope (v1)

Frontend unit tests, E2E browser tests, load tests, 100% coverage targets.

### Test Execution

```bash
cd server && npm run test
```

Document approach and failures in [`test-strategy.md`](test-strategy.md).

---

## 17. Security Considerations

| Area | v1 Approach | Notes |
| ---- | ----------- | ----- |
| **Authentication** | None | Known limitation (R-04); stretch adds JWT/session |
| **Authorization** | None | All users share access; roles informational only |
| **Secrets** | `.env` gitignored; `.env.example` template | AC-14 |
| **Input validation** | Server-side Zod + length limits | Prevents basic injection |
| **XSS** | React text escaping; no raw HTML rendering | EC-16 |
| **CORS** | Restrict to `CLIENT_URL` | Prevent open CORS in production |
| **SQL injection** | Prisma parameterized queries | ORM default |
| **Rate limiting** | Not required | Internal tool, modest load |

---

## 18. Performance Considerations

| Area | v1 Approach | Rationale |
| ---- | ----------- | --------- |
| **Pagination** | Not implemented | Full list returned; acceptable for exercise dataset (A-11) |
| **Indexing** | Index `tickets.status`, `tickets.createdAt` | Optional; improves filter/sort if added later |
| **Search** | `ILIKE %term%` on title + description | Sufficient for internal modest volume |
| **N+1 queries** | Use Prisma `include` for users and comments | Single query per endpoint where possible |
| **Caching** | None in v1 | Users list may be fetched once per session |
| **Response time** | No SLA | NFR-11: reasonable for local internal use |

---

## 19. Assumptions

| ID | Assumption |
| -- | ---------- |
| A-01 | Internal use only; single-tenant |
| A-02 | No authentication in v1 |
| A-03 | `createdBy` / comment author selected via user dropdown |
| A-04 | PostgreSQL available locally or via Docker |
| A-05 | Client and server run concurrently during development |
| A-06 | Timestamps stored UTC; displayed consistently |
| A-07 | Last-write-wins for concurrent edits |
| A-08 | Developer has Node.js LTS and a package manager installed |
| A-09 | Exercise artifacts maintained alongside code |
| A-10 | Implementation sequencing defined in `implementation-plan.md` |

---

## 20. Out of Scope

| Item | Notes |
| ---- | ----- |
| Authentication / RBAC | Stretch (FR-S-02) |
| User CRUD | Stretch (FR-S-01) |
| Ticket delete (hard or soft) | Future enhancement (OQ-05) |
| Pagination, sorting | Stretch (FR-S-03, FR-S-04) |
| Priority / assignee filters | Stretch (FR-S-05, FR-S-06) |
| Additional entities | Stretch (FR-S-07) |
| Swagger / OpenAPI | Stretch (FR-S-09) |
| Docker / CI/CD | Stretch (FR-S-10) |
| Frontend unit / E2E tests | Stretch (FR-S-08) |
| Optimistic locking | Future enhancement (OQ-14) |
| Email notifications | Not planned |
| File attachments | Not planned |

---

## 21. Future Enhancements

| Enhancement | Description | Trigger |
| ----------- | ----------- | ------- |
| **Soft delete** | `deletedAt` on tickets; exclude from queries; no hard delete | Post-v1 |
| **Optimistic locking** | `version` column; 409 on stale update | Post-v1 concurrency hardening |
| **Authentication** | JWT/session; auto-set `createdBy` | Stretch |
| **RBAC** | Role-based permissions using Agent/Manager/Admin | Stretch |
| **Pagination & sorting** | List performance at scale | Stretch |
| **OpenAPI docs** | Auto-generated API reference | Stretch |
| **Docker Compose** | One-command local stack (app + Postgres) | Stretch |
| **CI pipeline** | Automated test on push | Stretch |
| **Audit log entity** | Track status change history | Optional new entity |

---

## Appendix A: Traceability Matrix (Spec → Requirements)

| Spec Section | Requirement IDs |
| ------------ | --------------- |
| Design Decisions (§5) | OQ-08, OQ-09, OQ-12, OQ-14 |
| Risks & Trade-offs (§7) | R-01, R-06, R-08, R-09, R-11 |
| Frontend Pages | US-01–US-08, US-14–US-15, AC-01–AC-11 |
| Status API | FR-C-09–13a, BR-02–BR-06, BR-15, AC-06–AC-08 |
| Comments API | FR-C-14–16, BR-10–BR-12, AC-09 |
| Search/Filter | FR-C-17–18, A-10, AC-10–AC-11 |
| Database | FR-C-21–23, OQ-06, OQ-12, OQ-13, AC-12, AC-15 |
| Integration Tests | FR-C-11, NFR-07, AC-17–AC-18 |
| Security | NFR-05, AC-14 |

---

## Appendix B: Environment Configuration

| Variable | Location | Example |
| -------- | -------- | ------- |
| `DATABASE_URL` | `server/.env` | `postgresql://user:pass@localhost:5432/support_tickets` |
| `PORT` | `server/.env` | `3001` |
| `CLIENT_URL` | `server/.env` | `http://localhost:5173` |
| `VITE_API_URL` | `client/.env` | `http://localhost:3001/api` |

---

*These design notes are the implementation blueprint for developers and AI assistants. Implementation sequencing: `implementation-plan.md`. Business rules authority: `requirements-analysis.md`. Collaboration conventions: `tool-specific/cursor-workflow/project-context.md`. Full API contract: [`api-contract.md`](api-contract.md). UI flow: [`ui-flow.md`](ui-flow.md). Data model: [`data-model.md`](data-model.md).*
