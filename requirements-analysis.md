# Requirement Analysis — Support Ticket Management System

**Document Version:** 1.1  
**Date:** July 7, 2026  
**Author:** Business Analysis & Architecture  
**Source:** `docs/assignment.md` — JS AI Capability Exercise (Part B: Full-Stack Mini Project)  
**Status:** Approved — Design Decisions Resolved

---

## 1. Project Overview

The Support Ticket Management System is an internal web application designed to manage the lifecycle of customer or employee support requests. It enables users to create, track, update, comment on, search, and filter support tickets through a defined status workflow.

This project is being built as part of the **JS AI Capability Exercise** — a competency-wide, hands-on exercise focused on demonstrating effective AI-assisted software development across the full engineering lifecycle. The application itself is a realistic full-stack mini project; the broader exercise also requires workflow artifacts (requirement analysis, design documents, prompt history, testing notes, reflection, and PR artifacts).

### Scope Summary

| Category | Description |
| -------- | ----------- |
| **In Scope (Core)** | Ticket create/read/update (no delete), status lifecycle enforcement, comments, search, status filter, seeded users, PostgreSQL persistence, backend validation, UI error handling, integration tests for status transitions |
| **Out of Scope (Core)** | Authentication, authorization, user CRUD, ticket deletion, pagination, sorting, priority/assignee filters, additional entities |
| **Optional (Stretch)** | Auth (JWT/session), RBAC, user CRUD, pagination, sorting, additional filters, unit tests, Swagger/OpenAPI, Docker, CI/CD |
| **Future Enhancements** | Soft delete for tickets, optimistic locking for concurrent updates |

### Technical Context

The system must be delivered as a full-stack application comprising:

- A **frontend** (React is an approved stack)
- A **backend API** (Node.js is an approved stack)
- A **persistent database** — **PostgreSQL** (selected; see Section 16)
- Database **migration/setup scripts** and **seed data**
- A **`.env.example`** file with local run instructions
- At least one **meaningful test tier** (integration tests for status transitions are mandatory)

### 1.5 My Understanding (in your own words)

*Author: Satyajeet Singh — human summary before design and implementation.*

I understand this project as an **internal** support ticket tool for a small team (agents, managers, admins) — not a public customer portal. The core value is tracking work through a **fixed status lifecycle** where the **backend** decides which transitions are legal; the UI can hint at next steps but must not be the authority.

For v1, I am deliberately **not** building login, ticket delete, or pagination. That keeps scope aligned with the exercise core requirements and avoids stretch work before AC-01–AC-18 are proven. Users are seeded; `createdBy` comes from a dropdown today, with auth documented as a future improvement. Tickets persist in **PostgreSQL** so restarts and manual QA are meaningful.

What matters most to me architecturally: **one state machine** (`statusTransition.ts`), **status changes only on a dedicated API endpoint**, and **integration tests** that prove invalid transitions return 400. Search and filter should hit the database (title + description, case-insensitive), not filter only in the browser.

This exercise is not only “make it work.” I also need to show **how** AI was used — prompts, iteration, Quality Gates, debugging notes, and honest reflection — so reviewers can see developer judgment, not copy-paste output.

---

## 2. Business Goal

### Primary Goal

Provide an internal tool that allows support teams to efficiently log, track, assign, and resolve support issues through a controlled, auditable lifecycle — reducing lost requests, improving visibility into ticket status, and enabling collaboration via comments.

### Exercise Goal (Secondary)

Demonstrate responsible, explainable, and effective AI-assisted software development — including requirement analysis, planning, implementation, testing, debugging, code review, and documentation — not merely delivering a working application.

### Success Measures

| Measure | Target |
| ------- | ------ |
| Ticket creation to resolution tracking | All tickets progress through valid status transitions only |
| Data durability | All ticket and comment data persists across application restarts |
| Discoverability | Users can search tickets and filter by status |
| Data integrity | Invalid status transitions are rejected by the backend with clear UI feedback |
| Quality assurance | Integration tests pass for valid and invalid status transitions |
| Security hygiene | Secrets are excluded from version control |

---

## 3. Functional Requirements

Functional requirements are numbered for traceability. **FR-C** = Core (mandatory); **FR-S** = Stretch (optional).

### 3.1 Ticket Management

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-C-01 | The system shall allow users to create a new support ticket with a title, description, and priority. | Core |
| FR-C-02 | The system shall automatically set the initial ticket status to **Open** upon creation. | Core |
| FR-C-03 | The system shall record `createdBy` (reference to a seeded user) and `createdAt` timestamp on ticket creation. | Core |
| FR-C-04 | The system shall display a list of all tickets. | Core |
| FR-C-05 | The system shall display full ticket details including title, description, priority, status, assignee, creator, timestamps, and associated comments. | Core |
| FR-C-06 | The system shall allow users to update ticket information (title, description, priority). | Core |
| FR-C-07 | The system shall allow users to reassign a ticket to a different seeded user (`assignedTo`). | Core |
| FR-C-08 | The system shall update `updatedAt` whenever a ticket is modified. | Core |

### 3.2 Status Lifecycle

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-C-09 | The system shall support the following ticket statuses: **Open**, **In Progress**, **Resolved**, **Closed**, **Cancelled**. | Core |
| FR-C-10 | The system shall enforce the following valid status transitions: Open → In Progress; In Progress → Resolved; Resolved → Closed; Open → Cancelled; In Progress → Cancelled. | Core |
| FR-C-11 | The system shall reject any status transition not defined in the state machine at the backend API level. | Core |
| FR-C-12 | The system shall return a clear, actionable error message when an invalid status transition is attempted. | Core |
| FR-C-13 | The frontend shall display backend validation errors for invalid transitions in a user-friendly manner. | Core |
| FR-C-13a | Status changes shall be processed exclusively via `PATCH /tickets/:id/status`; the general update endpoint shall reject requests that include a `status` field with **400 Bad Request**. | Core |

### 3.3 Comments

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-C-14 | The system shall allow users to add comments to a ticket. | Core |
| FR-C-15 | Each comment shall be associated with a ticket (`ticketId`), contain a message, record `createdBy`, and `createdAt`. | Core |
| FR-C-16 | Comments shall be visible on the ticket detail view, ordered chronologically. | Core |

### 3.4 Search and Filter

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-C-17 | The system shall allow users to search tickets by **title and description** using case-insensitive partial match. | Core |
| FR-C-18 | The system shall allow users to filter the ticket list by status. | Core |

### 3.5 User Management

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-C-19 | The system shall provide a pre-seeded set of users (id, name, email, role) for use as ticket creators and assignees. | Core |
| FR-C-20 | Users shall not be creatable or editable through the UI in the core scope (seeded only). | Core |
| FR-S-01 | The system may provide full User CRUD operations. | Stretch |
| FR-S-02 | The system may implement authentication (JWT, session) and authorization (RBAC, protected routes). | Stretch |

### 3.6 Data Persistence and Setup

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-C-21 | All tickets and comments shall be persisted in a database and survive application restarts. | Core |
| FR-C-22 | The system shall provide database migration/setup scripts. | Core |
| FR-C-23 | The system shall provide seed data for users, sample tickets, and sample comments. | Core |
| FR-C-24 | The system shall provide a `.env.example` and README with local setup and run instructions. | Core |

### 3.7 Stretch Features (Optional)

| ID | Requirement | Priority |
| -- | ----------- | -------- |
| FR-S-03 | Pagination of ticket list. | Stretch |
| FR-S-04 | Sorting of ticket list (e.g., by date, priority). | Stretch |
| FR-S-05 | Filter by priority. | Stretch |
| FR-S-06 | Filter by assignee. | Stretch |
| FR-S-07 | Additional entity beyond User, Ticket, and Comment. | Stretch |
| FR-S-08 | Unit tests and edge-case tests beyond mandatory integration tests. | Stretch |
| FR-S-09 | Swagger/OpenAPI documentation. | Stretch |
| FR-S-10 | Docker containerization and/or CI/CD pipeline. | Stretch |

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
| -- | -------- | ----------- |
| NFR-01 | **Reliability** | Data must not be lost on application restart; database is the single source of truth. |
| NFR-02 | **Data Integrity** | Status transitions must be enforced server-side; the frontend must not be the sole enforcement layer. |
| NFR-03 | **Validation** | All user inputs must be validated on the backend before persistence. |
| NFR-04 | **Usability** | Validation and error messages must be clear and displayed in the UI without requiring developer tools to diagnose. |
| NFR-05 | **Security** | Secrets (database credentials, API keys) must not be committed to Git; use `.env` and `.env.example`. |
| NFR-06 | **Maintainability** | Codebase must follow clean architecture principles suitable for review and extension. |
| NFR-07 | **Testability** | Status transition logic must be testable via integration tests without manual UI interaction. |
| NFR-08 | **Portability** | Application must run locally with documented setup steps using PostgreSQL. |
| NFR-09 | **Documentation** | README must include setup, run, and test instructions. |
| NFR-10 | **Traceability** | Requirement analysis, design notes, prompt history, and acceptance criteria must be maintained as lifecycle artifacts. |
| NFR-11 | **Performance** | Acceptable for internal use with a modest dataset; no specific SLA defined (reasonable response for list/detail operations). |
| NFR-12 | **Accessibility** | Not explicitly required; basic usability expected for internal tool. |

---

## 5. Actors

| Actor | Description | Core Interactions |
| ----- | ----------- | ----------------- |
| **Support Agent** | Internal user who handles support requests. Creates tickets, updates details, changes status, adds comments, searches and filters. | Create, read, update tickets; add comments; change status; search/filter |
| **Support Manager** | Internal user who oversees ticket workload. May reassign tickets and monitor status. In core scope, behaves identically to Support Agent (no role-based restrictions unless stretch auth is implemented). | All Support Agent actions; reassign tickets |
| **System Administrator** | Sets up database, runs migrations, seeds data, deploys locally. Not an in-app actor in core scope. | Database setup, migration, seeding |
| **Seeded User (Data Entity)** | Pre-populated user record used as `createdBy` and `assignedTo` references. Not a login identity in core scope. | Referenced by tickets and comments |
| **Integration Test Runner** | Automated test process that validates status transition rules via API. | Execute valid/invalid transition scenarios |

> **Note:** In the core scope, there is no login/authentication. All users of the application share the same access level. The `role` field on seeded users is informational unless stretch authorization is implemented.

---

## 6. Entities

### 6.1 User (Seeded)

Pre-populated reference data. Not user-managed in core scope.

| Attribute | Type (Logical) | Required | Description |
| --------- | -------------- | -------- | ----------- |
| `id` | Identifier | Yes | Unique user identifier (UUID or auto-increment integer) |
| `name` | String | Yes | Display name of the user |
| `email` | String | Yes | Email address; should be unique |
| `role` | Enum | Yes | User role: **Agent**, **Manager**, or **Admin** (one seeded user per role) |

### 6.2 Ticket

Primary business entity representing a support request.

| Attribute | Type (Logical) | Required | Description |
| --------- | -------------- | -------- | ----------- |
| `id` | Identifier | Yes | Unique ticket identifier |
| `title` | String | Yes | Short summary of the issue |
| `description` | String | Yes | Detailed description of the issue |
| `priority` | Enum | Yes | Priority level: **Low**, **Medium**, **High**, **Critical** |
| `status` | Enum | Yes | Current lifecycle status: Open, In Progress, Resolved, Closed, Cancelled |
| `assignedTo` | FK → User.id | No | User assigned to handle the ticket; may be null/unassigned |
| `createdBy` | FK → User.id | Yes | User who created the ticket |
| `createdAt` | DateTime | Yes | Timestamp of creation (system-generated) |
| `updatedAt` | DateTime | Yes | Timestamp of last modification (system-generated) |

### 6.3 Comment

Collaboration record attached to a ticket.

| Attribute | Type (Logical) | Required | Description |
| --------- | -------------- | -------- | ----------- |
| `id` | Identifier | Yes | Unique comment identifier |
| `ticketId` | FK → Ticket.id | Yes | Parent ticket reference |
| `message` | String | Yes | Comment body text |
| `createdBy` | FK → User.id | Yes | User who authored the comment |
| `createdAt` | DateTime | Yes | Timestamp of creation (system-generated) |

---

## 7. Relationships

```
User (1) ──────< creates ────── (N) Ticket
User (1) ──────< assigned ───── (N) Ticket        [assignedTo, optional]
User (1) ──────< authors ────── (N) Comment
Ticket (1) ────< has ────────── (N) Comment
```

| Relationship | Cardinality | Description |
| ------------ | ----------- | ----------- |
| User → Ticket (createdBy) | 1:N | A user may create many tickets; each ticket has exactly one creator |
| User → Ticket (assignedTo) | 1:N | A user may be assigned many tickets; a ticket may have zero or one assignee |
| Ticket → Comment | 1:N | A ticket may have many comments; each comment belongs to exactly one ticket |
| User → Comment (createdBy) | 1:N | A user may author many comments; each comment has exactly one author |

### Referential Integrity Rules

- `Ticket.createdBy` must reference an existing User.
- `Ticket.assignedTo`, if set, must reference an existing User.
- `Comment.ticketId` must reference an existing Ticket.
- `Comment.createdBy` must reference an existing User.
- User foreign keys (`createdBy`, `assignedTo`, comment `createdBy`) shall use **ON DELETE RESTRICT** — users referenced by tickets or comments cannot be deleted.
- Ticket deletion is **not in scope** for v1 (deferred as a future enhancement; see Section 16).

---

## 8. Business Rules

### 8.1 Ticket Lifecycle Rules

| Rule ID | Rule |
| ------- | ---- |
| BR-01 | Every new ticket is created with status **Open**. |
| BR-02 | Only the following transitions are permitted: Open → In Progress; In Progress → Resolved; Resolved → Closed; Open → Cancelled; In Progress → Cancelled. |
| BR-03 | Transitions from **Resolved**, **Closed**, or **Cancelled** to any other status are prohibited. |
| BR-04 | Direct transitions that skip intermediate states are prohibited (e.g., Open → Resolved, Open → Closed, In Progress → Closed). |
| BR-05 | **Cancelled** is a terminal state; no further transitions are allowed. |
| BR-06 | **Closed** is a terminal state; no further transitions are allowed. |

### 8.2 Status State Machine (Visual)

```
        ┌─────────────┐
        │    Open     │
        └──────┬──────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐  ┌───────────┐
│ In Progress │  │ Cancelled │  (terminal)
└──────┬──────┘  └───────────┘
       │
   ┌───┴───┐
   ▼       ▼
┌────────┐ ┌───────────┐
│Resolved│ │ Cancelled │
└───┬────┘ └───────────┘
    ▼
┌────────┐
│ Closed │  (terminal)
└────────┘
```

### 8.3 Assignment Rules

| Rule ID | Rule |
| ------- | ---- |
| BR-07 | A ticket may be created without an assignee (`assignedTo` = null). |
| BR-08 | A ticket may be reassigned to any seeded user at any time, regardless of status (unless restricted by a future authorization layer). |
| BR-09 | Reassignment does not automatically change ticket status. |

### 8.4 Comment Rules

| Rule ID | Rule |
| ------- | ---- |
| BR-10 | Comments may be added to a ticket in **any status**, including Closed and Cancelled (audit trail). |
| BR-11 | Comments are append-only in core scope; editing or deleting comments is not required. |
| BR-12 | Comments are ordered by `createdAt` ascending (oldest first) on the detail view. |

### 8.5 User Rules

| Rule ID | Rule |
| ------- | ---- |
| BR-13 | Users are pre-seeded; no in-app user registration or management in core scope. |
| BR-14 | `createdBy` on tickets and comments must reference a valid seeded user ID. |
| BR-15 | Status changes must use `PATCH /tickets/:id/status` only; sending `status` on `PATCH /tickets/:id` is rejected with **400 Bad Request**. |
| BR-16 | API list and detail responses shall include resolved creator and assignee **names** (not IDs alone). |
| BR-17 | Concurrent updates resolve by **last-write-wins**; status transitions are always validated against the current database state. |

---

## 9. Validation Rules

### 9.1 Ticket Validation

| Field | Rule | Error Behavior |
| ----- | ---- | -------------- |
| `title` | Required; non-empty after trim; max **200** characters | 400 Bad Request with field-level message |
| `description` | Required; non-empty after trim; max **5000** characters | 400 Bad Request with field-level message |
| `priority` | Required; must be one of: Low, Medium, High, Critical | 400 Bad Request |
| `status` | Valid only via `PATCH /tickets/:id/status`; must be a valid enum value; transition must comply with state machine | 400 Bad Request with transition-specific message |
| `status` (on general update) | Must not be accepted on `PATCH /tickets/:id` | 400 Bad Request — direct client to status endpoint |
| `assignedTo` | If provided, must reference an existing user ID | 400 Bad Request / 404 if user not found |
| `createdBy` | Required on create; must reference an existing user ID | 400 Bad Request / 404 if user not found |

### 9.2 Comment Validation

| Field | Rule | Error Behavior |
| ----- | ---- | -------------- |
| `ticketId` | Required; must reference an existing ticket | 404 Not Found if ticket does not exist |
| `message` | Required; non-empty after trim; max **2000** characters | 400 Bad Request |
| `createdBy` | Required; must reference an existing user ID | 400 Bad Request / 404 if user not found |

### 9.3 Status Transition Validation

| Scenario | Expected Backend Response |
| -------- | ------------------------- |
| Open → In Progress | 200 OK |
| In Progress → Resolved | 200 OK |
| Resolved → Closed | 200 OK |
| Open → Cancelled | 200 OK |
| In Progress → Cancelled | 200 OK |
| Open → Resolved | 400 Bad Request — invalid transition |
| Open → Closed | 400 Bad Request — invalid transition |
| Resolved → Open | 400 Bad Request — invalid transition |
| Closed → any | 400 Bad Request — terminal state |
| Cancelled → any | 400 Bad Request — terminal state |
| In Progress → Open (revert) | 400 Bad Request — invalid transition |

### 9.4 Search and Filter Validation

| Field | Rule | Error Behavior |
| ----- | ---- | -------------- |
| `status` (filter) | If provided, must be a valid status enum value | **400 Bad Request** |
| `search` (query) | Optional; case-insensitive partial match against title and description; empty string treated as no filter | Return all tickets (or status-filtered set) |

---

## 10. User Stories

Stories are written from the perspective of an internal support team member. Acceptance criteria are summarized; full criteria are in Section 15.

### Epic 1: Ticket Creation and Listing

| ID | Story | Priority |
| -- | ----- | -------- |
| US-01 | As a support agent, I want to create a new ticket with a title, description, and priority so that I can log a support request. | Must Have |
| US-02 | As a support agent, I want new tickets to start in **Open** status so that they enter the workflow at the correct entry point. | Must Have |
| US-03 | As a support agent, I want to see a list of all tickets so that I can monitor the support queue. | Must Have |
| US-04 | As a support agent, I want to filter the ticket list by status so that I can focus on tickets in a specific state. | Must Have |
| US-05 | As a support agent, I want to search tickets so that I can quickly find a specific request. | Must Have |

### Epic 2: Ticket Detail and Update

| ID | Story | Priority |
| -- | ----- | -------- |
| US-06 | As a support agent, I want to view full ticket details including comments so that I have complete context. | Must Have |
| US-07 | As a support agent, I want to update a ticket's title, description, and priority so that I can keep information accurate. | Must Have |
| US-08 | As a support manager, I want to reassign a ticket to another team member so that workload can be distributed. | Must Have |

### Epic 3: Status Lifecycle

| ID | Story | Priority |
| -- | ----- | -------- |
| US-09 | As a support agent, I want to move a ticket from Open to In Progress when I start working on it. | Must Have |
| US-10 | As a support agent, I want to mark a ticket as Resolved when the issue is fixed. | Must Have |
| US-11 | As a support agent, I want to close a Resolved ticket to confirm completion. | Must Have |
| US-12 | As a support agent, I want to cancel a ticket that is no longer needed. | Must Have |
| US-13 | As a support agent, I want to see a clear error if I attempt an invalid status change so that I understand what went wrong. | Must Have |

### Epic 4: Collaboration

| ID | Story | Priority |
| -- | ----- | -------- |
| US-14 | As a support agent, I want to add comments to a ticket so that I can document progress and communicate with the team. | Must Have |
| US-15 | As a support agent, I want to see all comments on a ticket in chronological order so that I can follow the conversation history. | Must Have |

### Epic 5: System Setup (Administrator)

| ID | Story | Priority |
| -- | ----- | -------- |
| US-16 | As a developer/administrator, I want seed data for users so that tickets can reference valid creators and assignees. | Must Have |
| US-17 | As a developer/administrator, I want migration scripts and setup documentation so that I can run the application locally. | Must Have |

### Epic 6: Stretch (Optional)

| ID | Story | Priority |
| -- | ----- | -------- |
| US-18 | As a user, I want to log in securely so that actions are tied to my identity. | Could Have |
| US-19 | As a manager, I want role-based access so that only authorized users can perform certain actions. | Could Have |
| US-20 | As a support agent, I want paginated and sortable ticket lists so that I can navigate large volumes efficiently. | Could Have |

---

## 11. Functional Flow

### 11.1 Create Ticket Flow

```
User → Frontend: Fill ticket form (title, description, priority, createdBy, optional assignedTo)
Frontend → Backend API: POST /tickets (validated payload)
Backend: Validate input fields
Backend: Set status = Open, createdAt = now, updatedAt = now
Backend → Database: Insert ticket record
Backend → Frontend: 201 Created with ticket object
Frontend: Redirect to ticket detail or refresh list
```

### 11.2 View Ticket List Flow

```
User → Frontend: Navigate to ticket list
Frontend → Backend API: GET /tickets (?status=filter&search=query)
Backend → Database: Query tickets with optional filters
Backend → Frontend: 200 OK with ticket array (includes resolved creator/assignee names)
Frontend: Render list with status badges, priority, assignee
```

### 11.3 View Ticket Detail Flow

```
User → Frontend: Select a ticket from the list
Frontend → Backend API: GET /tickets/:id
Backend → Database: Fetch ticket + related comments + user references
Backend → Frontend: 200 OK with ticket and comments
Frontend: Render detail view with status controls, comment form
```

### 11.4 Update Ticket Flow

```
User → Frontend: Edit ticket fields (title, description, priority, assignedTo) and submit
Frontend → Backend API: PATCH /tickets/:id (must NOT include status)
Backend: If status field present → 400 Bad Request
Backend: Validate fields; update updatedAt
Backend → Database: Update record
Backend → Frontend: 200 OK with updated ticket (includes resolved creator/assignee names)
Frontend: Refresh detail view; show success or error
```

### 11.5 Change Status Flow

```
User → Frontend: Select new status (e.g., Open → In Progress)
Frontend → Backend API: PATCH /tickets/:id/status { "status": "In Progress" }
Backend: Validate transition against current DB state and state machine
  ├─ Valid: Update status and updatedAt → 200 OK
  └─ Invalid: Return 400 with descriptive error message
Frontend: Display result or validation error
```

### 11.6 Add Comment Flow

```
User → Frontend: Enter comment text and submit
Frontend → Backend API: POST /tickets/:id/comments
Backend: Validate message and createdBy; verify ticket exists
Backend → Database: Insert comment with createdAt = now
Backend → Frontend: 201 Created with comment object
Frontend: Append comment to detail view
```

### 11.7 Search and Filter Flow

```
User → Frontend: Enter search term and/or select status filter
Frontend → Backend API: GET /tickets?search=...&status=...
Backend → Database: Apply search (title/description) and status filter
Backend → Frontend: 200 OK with filtered results
Frontend: Update list display
```

---

## 12. Edge Cases

| ID | Scenario | Expected Behavior |
| -- | -------- | ----------------- |
| EC-01 | Attempt to transition Closed ticket to any status | Backend rejects with 400; UI shows error |
| EC-02 | Attempt to transition Cancelled ticket to any status | Backend rejects with 400; UI shows error |
| EC-03 | Attempt Open → Resolved (skip In Progress) | Backend rejects with 400 |
| EC-04 | Attempt In Progress → Closed (skip Resolved) | Backend rejects with 400 |
| EC-05 | Attempt Resolved → In Progress (revert) | Backend rejects with 400 |
| EC-06 | Create ticket with empty title or description | Backend rejects with 400; UI shows field error |
| EC-07 | Create ticket with invalid priority value | Backend rejects with 400 |
| EC-08 | Assign ticket to non-existent user ID | Backend rejects with 400/404 |
| EC-09 | Add comment to non-existent ticket | Backend rejects with 404 |
| EC-10 | Add comment with empty message | Backend rejects with 400 |
| EC-11 | Search with no matching results | Return empty list; UI shows "no tickets found" |
| EC-12 | Filter by status with no matching tickets | Return empty list |
| EC-13 | Concurrent status updates on same ticket | Last-write-wins; each request validated against current DB state (optimistic locking deferred — see Section 16) |
| EC-14 | Ticket with no assignee | Display as "Unassigned"; allow later assignment |
| EC-15 | Very long title/description/comment exceeding max length | Backend rejects with 400 |
| EC-16 | Special characters / HTML in title, description, comment | Sanitize or escape on display to prevent XSS |
| EC-17 | Database unavailable on startup | Application should fail gracefully with clear error in logs |
| EC-18 | Duplicate email in seed data | Prevent via unique constraint on email |
| EC-19 | API request with malformed JSON | Return 400 with parse error message |
| EC-20 | Request for non-existent ticket ID | Return 404 Not Found |
| EC-21 | `status` field sent on general ticket update (`PATCH /tickets/:id`) | Return 400 with message directing client to `PATCH /tickets/:id/status` |
| EC-22 | Invalid status value in filter query parameter | Return 400 Bad Request |

---

## 13. Risks

### Severity scale

Composite **Severity** from Likelihood × Impact:

| Likelihood \ Impact | Low | Medium | High |
| ------------------- | --- | ------ | ---- |
| High | Medium | High | Critical |
| Medium | Low | Medium | **High** |
| Low | Low | Medium | **High** |

### Full risk register

| ID | Risk | Likelihood | Impact | Severity | Mitigation | Verified by |
| -- | ---- | ---------- | ------ | -------- | ---------- | ----------- |
| R-01 | Status transition logic implemented only on frontend | Medium | High | **High** | Enforce exclusively on backend; mandatory integration tests | `statusTransition.ts`; Sprint 5.1 — 16/16 IT (AC-17, AC-18) |
| R-02 | Ambiguous search behavior leads to inconsistent implementation | Low | Medium | Medium | **Resolved:** search title + description, case-insensitive partial match | `ticketService.list` ILIKE; manual QA AC-09 |
| R-03 | Priority enum values not defined, causing seed/UI mismatch | Low | Medium | Medium | **Resolved:** Low, Medium, High, Critical | Prisma enum + seed; UI badges verified |
| R-04 | No authentication in core scope — any user can modify any ticket | High (by design) | Low (exercise scope) | Medium | Document as known limitation; implement auth as stretch if needed | README Known limitations; `reflection.md` |
| R-05 | `createdBy` selection in UI without auth — user impersonation | Medium | Low | Low | Acceptable for exercise; use dropdown of seeded users | `UserSelect` dropdown; seed users only |
| R-06 | Scope creep into stretch features delays core delivery | Medium | High | **High** | Prioritize core acceptance criteria; treat stretch as time-permitting | Core AC-01–AC-18 complete; S.1 stretch not started |
| R-07 | Database choice impacts migration tooling and test setup | Low | Low | Low | **Resolved:** PostgreSQL selected; document setup in README | README + `database/setup-notes.md`; migrations applied |
| R-08 | Insufficient test coverage for status machine edge cases | Medium | High | **High** | Mandatory integration tests are non-negotiable; cover all invalid transitions | Sprint 5.1 — 32/32 tests (16 IT + 16 unit); 33/33 manual regression |
| R-09 | Secrets accidentally committed to Git | Low | High | **High** | Use `.env.example`; add `.env` to `.gitignore`; review before push | `.gitignore`; no `.env` in git history; AC-14 audit |
| R-10 | Poor error message design leads to confusing UX | Medium | Medium | Medium | Define error response schema in API design; test error paths | `ErrorResponse` shape; ERR-01–04 verified in QA |
| R-11 | Status change via general update bypasses state machine | Medium | High | **High** | **Resolved:** separate status endpoint; reject `status` on general update with 400 | `STATUS_NOT_ALLOWED_HERE` IT; dedicated `PATCH …/status` |
| R-12 | Time constraint (8–12 hours core effort) limits quality | Medium | Medium | Medium | Focus on core features; maintain artifact quality for exercise evaluation | All core sprints QG-passed; submission artifacts complete |

### Top 5 risks by severity

| Rank | ID | Severity | Risk (summary) | Verification evidence |
| ---- | -- | -------- | -------------- | ----------------------- |
| 1 | R-08 | **High** | Insufficient state-machine test coverage | 32/32 tests (16 IT + 16 unit); invalid-transition matrix (AC-18) |
| 2 | R-01 | **High** | Status logic enforced only on frontend | `server/src/services/statusTransition.ts`; backend-only transitions |
| 3 | R-11 | **High** | Status change bypasses state machine via general PATCH | `assertNoStatusField`; IT guard scenario |
| 4 | R-09 | **High** | Secrets committed to Git | `.env` gitignored; `.env.example` placeholders only |
| 5 | R-06 | **High** | Scope creep delays core delivery | Stretch deferred; Project Completion Checklist signed off |

---

## 14. Assumptions

| ID | Assumption |
| -- | ---------- |
| A-01 | The application is for internal use only; no public-facing deployment is required. |
| A-02 | A single shared application instance serves all users; multi-tenancy is not required. |
| A-03 | Authentication and authorization are out of scope for core delivery unless implemented as stretch. |
| A-04 | Core: `createdBy` and `assignedTo` are selected from a dropdown of seeded users. Stretch/auth: `createdBy` is automatically set to the logged-in user. |
| A-05 | Priority values are fixed: **Low**, **Medium**, **High**, **Critical**. |
| A-06 | Role values are fixed: **Agent**, **Manager**, **Admin** — one seeded user per role; roles are informational in core scope and do not enforce permissions. |
| A-07 | The frontend and backend communicate via REST API over HTTP. |
| A-08 | Timestamps are stored in UTC and displayed in the user's local timezone (or UTC consistently). |
| A-09 | One meaningful test tier (integration tests for status transitions) satisfies the exercise minimum. |
| A-10 | Search matches **title and description** using case-insensitive partial match. |
| A-11 | Ticket list returns all matching tickets without pagination in core scope; API responses include resolved creator and assignee names. |
| A-12 | Comments cannot be edited or deleted in core scope; comments are allowed on tickets in all statuses. |
| A-13 | The exercise evaluation prioritizes lifecycle artifacts (analysis, prompts, reflection) alongside working code. |
| A-14 | React (frontend) and Node.js (backend) are the preferred technology stack. |
| A-15 | **PostgreSQL** is the selected database; connection via `DATABASE_URL` in `.env`. |
| A-16 | Ticket deletion is not supported in v1; soft delete is a documented future enhancement. |
| A-17 | Concurrent updates use last-write-wins; optimistic locking is a documented future enhancement. |

---

## 15. Acceptance Criteria

Derived from the assignment's Core Acceptance Criteria and expanded for testability.

### 15.1 Ticket Operations

- [ ] **AC-01:** User can create a ticket with title, description, and priority; ticket is saved with status **Open**.
- [ ] **AC-02:** User can view a list of all tickets.
- [ ] **AC-03:** User can open a ticket detail view showing all ticket fields and comments.
- [ ] **AC-04:** User can update ticket title, description, and priority.
- [ ] **AC-05:** User can reassign a ticket to a different seeded user.

### 15.2 Status Lifecycle

- [ ] **AC-06:** Valid transitions (Open→In Progress, In Progress→Resolved, Resolved→Closed, Open→Cancelled, In Progress→Cancelled) succeed and persist.
- [ ] **AC-07:** Invalid transitions are rejected by the backend API.
- [ ] **AC-08:** Frontend displays clear validation errors for invalid transitions.

### 15.3 Comments

- [ ] **AC-09:** User can add a comment to a ticket; comment appears on the detail view with author and timestamp.

### 15.4 Search and Filter

- [ ] **AC-10:** User can search tickets and see matching results.
- [ ] **AC-11:** User can filter tickets by status.

### 15.5 Data and Infrastructure

- [ ] **AC-12:** All data persists after application restart.
- [ ] **AC-13:** Backend validates all inputs and returns appropriate error responses.
- [ ] **AC-14:** Secrets are not committed to Git (`.env` excluded; `.env.example` provided).
- [ ] **AC-15:** Database migrations/setup scripts and seed data are provided and documented.
- [ ] **AC-16:** README contains local setup and run instructions.

### 15.6 Testing

- [ ] **AC-17:** Integration tests prove valid status transitions succeed.
- [ ] **AC-18:** Integration tests prove invalid status transitions fail.

### 15.7 Exercise Artifacts

- [ ] **AC-19:** Requirement analysis document exists (`docs/requirements-analysis.md`).
- [ ] **AC-20:** Prompt history maintained (`ai-prompts/` activity portfolio).
- [ ] **AC-21:** Design notes and tool-specific workflow artifacts are present.
- [ ] **AC-22:** Testing and debugging notes are documented.
- [ ] **AC-23:** Reflection document is included.

---

## 16. Design Decisions (Resolved)

All open questions from the initial analysis have been resolved. Decisions below are authoritative for implementation.

### 16.1 Resolved Decisions

| ID | Topic | Decision |
| -- | ----- | -------- |
| OQ-01 | Priority enum | **Low**, **Medium**, **High**, **Critical** |
| OQ-02 | Role enum & seed users | **Agent**, **Manager**, **Admin** — seed exactly **3 users**, one per role |
| OQ-03 | Search scope | Match **title and description**; case-insensitive partial match |
| OQ-04 | Comments on terminal tickets | **Allowed** on all statuses (audit trail) |
| OQ-05 | Ticket deletion | **Deferred** — not in v1; soft delete noted as future enhancement |
| OQ-06 | User deletion | **ON DELETE RESTRICT** on all user foreign keys; user delete not allowed if referenced by any ticket or comment |
| OQ-07 | Assignee on create | **Optional** — tickets may be unassigned (`assignedTo` = null) |
| OQ-08 | `createdBy` selection | Core: dropdown of seeded users; stretch/auth: automatically set to logged-in user |
| OQ-09 | Status change API | Dedicated **`PATCH /tickets/:id/status`**; general **`PATCH /tickets/:id`** rejects `status` field with **400 Bad Request** |
| OQ-10 | Field length limits | Title: **200**; Description: **5000**; Comment: **2000** characters |
| OQ-11 | API response shape | Include resolved **creator and assignee names** (join/populate), not IDs alone |
| OQ-12 | Database | **PostgreSQL** |
| OQ-13 | Seed data | Include **users, sample tickets, and sample comments** |
| OQ-14 | Concurrent updates | **Last-write-wins** for v1; transitions validated against current DB state |
| OQ-15 | Invalid status filter | Return **400 Bad Request** |

### 16.2 Seed Data Plan

| User (example) | Role | Purpose |
| -------------- | ---- | ------- |
| Agent user | Agent | Creates and handles tickets |
| Manager user | Manager | Reassigns tickets, oversees queue |
| Admin user | Admin | Stretch auth / admin scenarios |

Sample tickets should cover multiple statuses (**Open**, **In Progress**, **Resolved**, **Closed**, **Cancelled**) with at least one comment per ticket where practical, to support demos and manual testing.

### 16.3 API Endpoint Summary

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `GET` | `/tickets` | List tickets; query params: `search`, `status` |
| `POST` | `/tickets` | Create ticket (status set to Open) |
| `GET` | `/tickets/:id` | Ticket detail with comments and resolved names |
| `PATCH` | `/tickets/:id` | Update title, description, priority, `assignedTo` only — **no `status`** |
| `PATCH` | `/tickets/:id/status` | Change status (state machine enforced) |
| `POST` | `/tickets/:id/comments` | Add comment |

### 16.4 Future Enhancements (Out of Scope for v1)

| Enhancement | Description |
| ----------- | ----------- |
| **Soft delete** | Add `deletedAt` to tickets; exclude from default list/search; no hard delete |
| **Optimistic locking** | Add `version` field on Ticket; return **409 Conflict** when client version is stale |
| **Authentication** | Replace `createdBy` dropdown with logged-in user; implement RBAC by role |

---

## Appendix A: Requirement Traceability Matrix

| User Story | Functional Req | Business Rule | Acceptance Criteria |
| ---------- | -------------- | ------------- | ------------------- |
| US-01 | FR-C-01, FR-C-02 | BR-01 | AC-01 |
| US-03 | FR-C-04 | — | AC-02 |
| US-06 | FR-C-05, FR-C-16 | BR-12 | AC-03 |
| US-07 | FR-C-06 | — | AC-04 |
| US-08 | FR-C-07 | BR-08, BR-09 | AC-05 |
| US-09–12 | FR-C-09, FR-C-10 | BR-02–BR-06 | AC-06, AC-07, AC-08 |
| US-14 | FR-C-14, FR-C-15 | BR-10, BR-11 | AC-09 |
| US-05 | FR-C-17 | — | AC-10 |
| US-04 | FR-C-18 | — | AC-11 |
| US-16, US-17 | FR-C-19, FR-C-21–24 | BR-13, BR-14 | AC-12–AC-16 |
| — | FR-C-11 | BR-02–BR-06 | AC-17, AC-18 |

---

## Appendix B: Glossary

| Term | Definition |
| ---- | ---------- |
| **Ticket** | A support request record tracking an issue from creation to resolution or cancellation |
| **Status** | The current stage of a ticket in its lifecycle (Open, In Progress, Resolved, Closed, Cancelled) |
| **Transition** | A change from one status to another; must comply with the state machine |
| **Terminal State** | A status from which no further transitions are permitted (Closed, Cancelled) |
| **Seeded User** | A pre-populated user record in the database, not created through the application UI |
| **Stretch** | Optional features that demonstrate additional capability beyond core requirements |
| **Integration Test** | Automated test verifying API behavior end-to-end, including database interaction |
| **Last-Write-Wins** | Concurrency strategy where the last successful database write prevails; transitions always validated against current state |
| **Soft Delete** | Marking a record as deleted (e.g., via `deletedAt`) without removing it from the database — planned future enhancement |

---

*End of Requirement Analysis Document*
