# Acceptance Criteria — Support Ticket Management System

**Document Version:** 1.0  
**Date:** July 7, 2026  
**Role:** QA Lead / Solution Architect / Engineering Manager  
**Status:** Living document — update after every sprint  
**Sources:** `docs/requirement-analysis.md`, `spec.md`, `project-context.md`, `tasks.md`

---

# Overview

## Purpose

This document is the project's **Definition of Done** and **quality verification checklist**. It translates business requirements into verifiable, feature-level criteria that developers and reviewers use during — not just at the end of — implementation.

## How to Use This Document

| When | Action |
| ---- | ------ |
| **Start of sprint** | Identify which criteria the sprint targets (see Sprint Acceptance Mapping) |
| **During development** | Set criteria to **In Progress** as work begins |
| **End of sprint (Quality Gate)** | Verify criteria using listed methods; set **Completed** only when all verification methods pass |
| **Before submission** | Complete the Final Release Checklist |
| **After defects found** | Revert affected criteria to **In Progress** until re-verified |

## Relationship to Other Documents

| Document | Role |
| -------- | ---- |
| `docs/requirement-analysis.md` | **Authority** for business rules, FR/BR/AC definitions |
| `spec.md` | **Blueprint** for how criteria are implemented |
| `tasks.md` | **Execution order** — when criteria are delivered |
| **This document** | **Verification** — how to prove criteria are met |

## Status Legend

| Status | Meaning |
| ------ | ------- |
| **Not Started** | No implementation or verification attempted |
| **In Progress** | Work underway; not fully verified |
| **Completed** | All verification methods for the criterion passed |

---

# Definition of Done

A sprint, feature, or the full project is **done** only when **all** applicable items below are true.

## Per-Feature Done

- [ ] Implements mapped requirements from `requirement-analysis.md`
- [ ] Backend validation in place (where API is involved)
- [ ] Frontend displays API errors appropriately (where UI is involved)
- [ ] No secrets committed; env vars used correctly
- [ ] Integration tests updated if status logic or API contract changed
- [ ] Relevant rows in this document marked **Completed**
- [ ] `tasks.md` sprint Quality Gate checklist completed
- [ ] `prompt-history/` updated for meaningful AI-assisted work

## Sprint Done

- [ ] All sprint-targeted acceptance criteria **Completed**
- [ ] Quality Gate in `tasks.md` passed
- [ ] No open **critical** or **high** defects for sprint scope
- [ ] Sprint Progress Tracker in `tasks.md` updated

## Release Done (Submission Ready)

- [ ] All **Core** feature criteria **Completed**
- [ ] Final Release Checklist (below) fully checked
- [ ] AC-01–AC-23 satisfied
- [ ] Application runs from README on a clean environment
- [ ] Developer can explain architecture, state machine, and AI usage

---

# Feature Acceptance Criteria

> **Verification key:** MT = Manual Test · IT = Integration Test · CR = Code Review · DR = Documentation Review

---

## Project Foundation

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| FND-01 | FR-C-24, AC-16 | Monorepo contains `client/` and `server/` per spec §8 | CR | Not Started |
| FND-02 | NFR-05, AC-14 | `.gitignore` excludes `.env`, `node_modules`, build artifacts | CR | Not Started |
| FND-03 | FR-C-24, AC-14 | `server/.env.example` and `client/.env.example` exist with no real secrets | DR, CR | Not Started |
| FND-04 | A-04, spec §6 | Client and server start independently; CORS allows `CLIENT_URL` | MT | Not Started |
| FND-05 | AC-21 | Cursor workflow artifacts present (`project-context`, `spec`, `tasks`, this file, `cursor-rules`) | DR | In Progress |

---

## Database

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| DB-01 | OQ-12, FR-C-21 | PostgreSQL is the active database | CR, MT | Not Started |
| DB-02 | FR-C-22, AC-15 | Prisma schema defines `users`, `tickets`, `comments` with correct enums | CR | Not Started |
| DB-03 | OQ-06, spec §11 | All user FKs use `ON DELETE RESTRICT` | CR | Not Started |
| DB-04 | OQ-10 | Column limits enforced: title 200, description 5000, message 2000 | CR, IT | Not Started |
| DB-05 | FR-C-22, AC-15 | Migrations apply cleanly on empty database (`prisma migrate`) | MT | Not Started |
| DB-06 | OQ-13, FR-C-23 | Seed creates 3 users (Agent, Manager, Admin) — one per role | MT | Not Started |
| DB-07 | OQ-13 | Seed creates sample tickets covering all 5 statuses | MT | Not Started |
| DB-08 | OQ-13 | Seed creates sample comments on tickets | MT | Not Started |
| DB-09 | AC-12, NFR-01 | Data survives server and database restart | MT | Not Started |

---

## Users

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| USR-01 | FR-C-19, BR-13 | `GET /api/users` returns all seeded users (id, name, email, role) | MT, IT | Not Started |
| USR-02 | FR-C-20, BR-13 | No API endpoints to create, update, or delete users | CR | Not Started |
| USR-03 | OQ-08 | UI provides user dropdown for `createdBy` and comment author | MT | Not Started |
| USR-04 | BR-16, OQ-11 | Ticket responses include resolved `createdByName` and `assignedToName` | MT, IT | Not Started |

---

## Tickets

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| TKT-01 | FR-C-01, AC-01 | User can create ticket with title, description, priority | MT | Not Started |
| TKT-02 | FR-C-02, BR-01, AC-01 | New ticket status is always **Open** | MT, IT | Not Started |
| TKT-03 | FR-C-03 | `createdBy` and `createdAt` recorded on create | MT, IT | Not Started |
| TKT-04 | FR-C-04, AC-02 | `GET /api/tickets` returns list; UI displays all tickets | MT | Not Started |
| TKT-05 | FR-C-05, AC-03 | Detail view shows all fields, timestamps, resolved names, comments | MT | Not Started |
| TKT-06 | FR-C-06, AC-04 | User can update title, description, priority | MT | Not Started |
| TKT-07 | FR-C-07, BR-08, AC-05 | User can reassign ticket (`assignedTo`); null = unassigned | MT | Not Started |
| TKT-08 | OQ-07, BR-07 | Ticket can be created without assignee; UI shows "Unassigned" | MT | Not Started |
| TKT-09 | FR-C-08 | `updatedAt` changes on every ticket modification | MT, IT | Not Started |
| TKT-10 | OQ-05 | No ticket delete endpoint exists in v1 | CR | Not Started |

---

## Ticket Status Management

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| STS-01 | FR-C-09 | System supports: Open, In Progress, Resolved, Closed, Cancelled | CR, MT | Not Started |
| STS-02 | FR-C-10, BR-02, AC-06 | Valid transitions succeed: Open→In Progress, In Progress→Resolved, Resolved→Closed, Open→Cancelled, In Progress→Cancelled | IT, MT | Not Started |
| STS-03 | FR-C-11, AC-07 | Invalid transitions rejected by backend with 400 | IT, MT | Not Started |
| STS-04 | FR-C-12, AC-08 | Error message is clear and transition-specific | MT | Not Started |
| STS-05 | OQ-09, BR-15, FR-C-13a | Status changes only via `PATCH /api/tickets/:id/status` | IT, CR | Not Started |
| STS-06 | BR-15, EC-21 | `PATCH /api/tickets/:id` with `status` field returns 400 | IT | Not Started |
| STS-07 | NFR-02 | State machine logic isolated in `statusTransition.ts` — not in routes or UI alone | CR | Not Started |
| STS-08 | BR-03–BR-06 | Terminal states (Closed, Cancelled) reject all further transitions | IT | Not Started |
| STS-09 | BR-17, OQ-14 | Transitions validated against current DB state (last-write-wins) | CR, IT | Not Started |
| STS-10 | FR-C-13, AC-08 | UI shows backend error on invalid status attempt | MT | Not Started |

---

## Comments

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| CMT-01 | FR-C-14, AC-09 | User can add comment via `POST /api/tickets/:id/comments` | MT, IT | Not Started |
| CMT-02 | FR-C-15 | Comment stores ticketId, message, createdBy, createdAt | IT, CR | Not Started |
| CMT-03 | OQ-04, BR-10 | Comments allowed on tickets in **all** statuses including Closed/Cancelled | MT | Not Started |
| CMT-04 | BR-12, FR-C-16 | Comments displayed chronologically (oldest first) with author name | MT | Not Started |
| CMT-05 | BR-11 | No comment edit or delete endpoints in v1 | CR | Not Started |
| CMT-06 | EC-09 | Comment on non-existent ticket returns 404 | IT | Not Started |

---

## Search & Filter

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| SRC-01 | FR-C-17, OQ-03, AC-10 | Search matches title **and** description; case-insensitive partial | MT, IT | Not Started |
| SRC-02 | OQ-03 | Empty search string returns unfiltered results | MT | Not Started |
| SRC-03 | FR-C-18, AC-11 | Status filter returns only matching tickets | MT | Not Started |
| SRC-04 | OQ-15, EC-22 | Invalid status filter value returns 400 | IT | Not Started |
| SRC-05 | EC-11 | No matches returns empty list; UI shows empty state | MT | Not Started |
| SRC-06 | A-11 | List returns all matches without pagination in v1 | MT, CR | Not Started |

---

## Validation

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| VAL-01 | NFR-03, AC-13 | All API inputs validated with Zod before service layer | CR | Not Started |
| VAL-02 | OQ-01 | Priority must be: Low, Medium, High, Critical | IT, MT | Not Started |
| VAL-03 | OQ-10 | Title required, max 200 chars after trim | IT, MT | Not Started |
| VAL-04 | OQ-10 | Description required, max 5000 chars after trim | IT, MT | Not Started |
| VAL-05 | OQ-10 | Comment message required, max 2000 chars after trim | IT, MT | Not Started |
| VAL-06 | EC-08 | Invalid `createdBy` or `assignedTo` user ID returns 400/404 | IT | Not Started |
| VAL-07 | EC-06, EC-07 | Empty or invalid priority on create returns 400 | IT | Not Started |

---

## Error Handling

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| ERR-01 | spec §15 | API returns consistent `ErrorResponse` JSON (`message`, `code`, optional `details`) | IT, CR | Not Started |
| ERR-02 | NFR-04 | UI displays API error messages without requiring dev tools | MT | Not Started |
| ERR-03 | EC-20 | Non-existent ticket ID returns 404 | IT | Not Started |
| ERR-04 | EC-19 | Malformed JSON body returns 400 | MT | Not Started |
| ERR-05 | EC-17 | Database unavailable — server fails gracefully with logged error | MT | Not Started |
| ERR-06 | EC-16 | User content rendered safely (no XSS via raw HTML) | CR, MT | Not Started |

---

## Frontend

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| FE-01 | spec §9 | Routes: `/`, `/tickets/new`, `/tickets/:id`, 404 fallback | MT | Not Started |
| FE-02 | spec §9 | API calls centralized in `client/src/api/` — not inline in components | CR | Not Started |
| FE-03 | DD-10 | State via hooks + local state; no unnecessary global store | CR | Not Started |
| FE-04 | spec §9 | Search and status filter persisted in URL query params | MT | Not Started |
| FE-05 | STS-10 | StatusSelector shows valid next statuses as UX hint | MT | Not Started |
| FE-06 | NFR-04 | Form validation errors shown near relevant fields | MT | Not Started |
| FE-07 | EC-14 | Unassigned tickets display "Unassigned" | MT | Not Started |
| FE-08 | — | Loading and submit-disabled states during API calls | MT | Not Started |

---

## Backend

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| BE-01 | spec §10 | Layered architecture: routes → controllers → services → Prisma | CR | Not Started |
| BE-02 | DD-01 | REST API under `/api` prefix with correct HTTP verbs and status codes | CR, IT | Not Started |
| BE-03 | spec §12 | All endpoints from spec §12.1 implemented and functional | MT, IT | Not Started |
| BE-04 | BR-16 | DTO mappers populate resolved user names on list and detail | IT, CR | Not Started |
| BE-05 | BR-09 | Reassignment does not auto-change ticket status | MT, IT | Not Started |
| BE-06 | DD-04 | General update and status change are separate code paths | CR | Not Started |

---

## Testing

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| TST-01 | AC-17, FR-C-11 | Integration tests: all 5 valid transitions return 200 | IT | Not Started |
| TST-02 | AC-18, FR-C-11 | Integration tests: invalid transitions return 400 | IT | Not Started |
| TST-03 | STS-06 | Integration test: `status` on general PATCH returns 400 | IT | Not Started |
| TST-04 | SRC-04 | Integration test: invalid status filter returns 400 | IT | Not Started |
| TST-05 | VAL-03 | Integration test: create ticket without title returns 400 | IT | Not Started |
| TST-06 | ERR-03 | Integration test: GET non-existent ticket returns 404 | IT | Not Started |
| TST-07 | NFR-07 | Tests run via `npm run test` in `server/` without manual steps | MT | Not Started |
| TST-08 | AC-22 | `docs/testing-notes.md` documents approach, setup, and how to run tests | DR | Not Started |
| TST-09 | AC-22 | `docs/debugging-notes.md` documents issues found and fixes | DR | Not Started |

---

## Documentation

| ID | Requirement Ref | Acceptance Criteria | Verification | Status |
| -- | --------------- | ------------------- | ------------ | ------ |
| DOC-01 | AC-19 | `docs/requirement-analysis.md` complete and approved (v1.1) | DR | Completed |
| DOC-02 | AC-21 | `tool-specific/cursor-workflow/project-context.md` complete | DR | Completed |
| DOC-03 | AC-21 | `tool-specific/cursor-workflow/spec.md` complete (v1.1) | DR | Completed |
| DOC-04 | AC-21 | `tool-specific/cursor-workflow/tasks.md` maintained and current | DR | Completed |
| DOC-05 | AC-21 | `tool-specific/cursor-workflow/acceptance-criteria.md` (this file) maintained | DR | Completed |
| DOC-06 | AC-21 | `tool-specific/cursor-workflow/cursor-rules-or-instructions.md` complete | DR | Completed |
| DOC-07 | AC-16, FR-C-24 | Root `README.md` — setup, migrate, seed, run client + server, run tests | DR, MT | Not Started |
| DOC-08 | Part A | `tool-workflow.md` — AI workflow foundation per assignment | DR | Completed |
| DOC-09 | AC-20 | `prompt-history/` organized and updated after AI sessions | DR | In Progress |
| DOC-10 | AC-23 | `docs/reflection.md` — honest AI usage reflection | DR | Not Started |
| DOC-11 | PR artifacts | PR description or equivalent submission artifact | DR | Not Started |

---

# Sprint Acceptance Mapping

Maps each sprint from `tasks.md` to the feature criteria it must satisfy before exit.

| Sprint | Primary Criteria IDs | Exit Summary |
| ------ | -------------------- | ------------ |
| **1.1** Requirements | DOC-01 | Requirement analysis approved; OQs resolved |
| **2.1** Architecture & Spec | DOC-02, DOC-03, DOC-04, DOC-05, DOC-06, DOC-08, DOC-09, FND-05 | All design artifacts complete; prompt history started |
| **3.1** Server Foundation | FND-01–03, DB-01–09, FND-04 | Server runs; DB migrated and seeded; data persists |
| **3.2** Users & Ticket CRUD | USR-01–04, TKT-01–10, BE-01–04, VAL-01–07 (partial) | CRUD API complete; status rejected on general PATCH |
| **3.3** Status State Machine | STS-01–09, BE-05–06 | State machine enforced; all transition rules pass manual API tests |
| **3.4** Comments, Search, Filter | CMT-01–06, SRC-01–06, BE-03 | Full backend API complete |
| **4.1** Client Scaffold | FND-04, FE-01–03 | Client runs; routing and API layer work |
| **4.2** Ticket List | TKT-04, SRC-01–06, FE-04, FE-07–08, ERR-02 | List, search, filter work in UI |
| **4.3** Create & Detail | TKT-01–05, CMT-04, USR-03, FE-06–08 | Create and detail pages functional |
| **4.4** Update, Status, Comments | TKT-06–09, STS-10, CMT-01–05, FE-05–06 | Full UI flows; all AC-01–AC-11 pass manually |
| **5.1** Integration Tests | TST-01–07, STS-02–03, STS-06, SRC-04, VAL-03, ERR-03 | Automated tests green; testing notes written |
| **5.2** Manual QA | All core MT-verified criteria; TST-09; AC-12–AC-13 | Full regression; defects fixed; acceptance doc updated |
| **6.1** README & Workflow | DOC-07–09, FND-02–03, AC-14–AC-16 | README verified; workflow docs complete |
| **6.2** Reflection & Submit | DOC-10–11, all release checklist items | Submission ready |
| **S.1** Stretch (optional) | Stretch features only — must not break core criteria | Core AC-01–AC-18 still pass |

---

# Final Release Checklist

Complete before submission. Every item must be checked.

## Application Core

- [ ] Frontend runs and all pages work (`/`, `/tickets/new`, `/tickets/:id`)
- [ ] Backend API runs; all spec §12 endpoints respond correctly
- [ ] PostgreSQL connected; migrations and seed succeed on fresh DB
- [ ] Ticket create, list, detail, update, reassign work (TKT-01–09)
- [ ] Status state machine enforced server-side (STS-01–09)
- [ ] Comments work on all ticket statuses (CMT-01–05)
- [ ] Search and status filter work (SRC-01–06)
- [ ] Backend validation and error responses correct (VAL-01–07, ERR-01–06)
- [ ] UI displays errors clearly (ERR-02, STS-10)
- [ ] Integration tests pass (`npm run test`) (TST-01–07)
- [ ] Data persists after restart (DB-09, AC-12)

## Security & Configuration

- [ ] No `.env` or secrets in Git (FND-02, AC-14)
- [ ] `.env.example` files present for server and client (FND-03)
- [ ] CORS restricted to configured client origin (FND-04)

## Documentation & Exercise Artifacts

- [ ] `docs/requirement-analysis.md` (DOC-01)
- [ ] `docs/testing-notes.md` (TST-08)
- [ ] `docs/debugging-notes.md` (TST-09)
- [ ] `docs/reflection.md` (DOC-10)
- [ ] `README.md` — full setup verified by following steps (DOC-07)
- [ ] `tool-workflow.md` (DOC-08)
- [ ] All `tool-specific/cursor-workflow/` files complete (DOC-02–06)
- [ ] `prompt-history/` organized (DOC-09)
- [ ] PR description or submission artifact (DOC-11)

## Acceptance Criteria AC-01–AC-23

- [ ] AC-01 through AC-11 — feature criteria Completed
- [ ] AC-12 through AC-16 — infrastructure criteria Completed
- [ ] AC-17 through AC-18 — integration tests Completed
- [ ] AC-19 through AC-23 — artifact criteria Completed

## Reviewer Readiness

- [ ] Can demonstrate full happy path: create → in progress → resolved → closed
- [ ] Can demonstrate invalid transition rejection in UI and API
- [ ] Can explain status state machine and why it lives on the backend
- [ ] Can explain what AI generated and what was manually verified
- [ ] Commit history is incremental and readable

---

# Quality Standards

Standards applied at every Quality Gate and before marking any criterion **Completed**.

## Code Quality

| Standard | Check |
| -------- | ----- |
| Layer separation | Business logic in services; not in routes or React components |
| Minimal scope | Changes solve only the task at hand; no unrelated refactors |
| TypeScript strict | No unjustified `any`; types mirror API DTOs |
| Naming | Matches conventions in `project-context.md` §7 |
| State machine | Single implementation in `statusTransition.ts` |
| Readability | Code explainable in a review conversation |

## Documentation Quality

| Standard | Check |
| -------- | ----- |
| Accuracy | Docs match actual behavior — not aspirational |
| Setup works | README steps verified by following literally |
| Traceability | FR/BR/AC references correct in this document |
| Living docs | `tasks.md` and this file updated after each sprint |
| No secrets | Examples use placeholders only |

## AI-Generated Code Validation

Before marking criteria **Completed** when AI assisted:

| Check | Action |
| ----- | ------ |
| Status rules | Confirm enforcement is server-side, not UI-only |
| API contract | Confirm matches `spec.md` §12 |
| Field limits | Confirm 200 / 5000 / 2000 |
| Security | No hardcoded secrets or credentials |
| Tests | Run integration suite after AI changes to status logic |
| Explainability | Developer can explain the generated code |
| Prompt log | Meaningful prompts recorded in `prompt-history/` |

## Testing Quality

| Standard | Check |
| -------- | ----- |
| Mandatory coverage | All 5 valid + ≥6 invalid transitions tested (TST-01, TST-02) |
| HTTP-level | Integration tests hit API, not just unit-tested services |
| Deterministic | Tests pass reliably on repeated runs |
| Independence | No test order dependency |
| Guard tests | Status-on-PATCH and invalid filter tests included |
| Notes | Failures and fixes documented in `debugging-notes.md` |

## Git Hygiene

| Standard | Check |
| -------- | ----- |
| Commit size | Small, focused commits per logical change |
| Messages | Describe *why*, not just *what* |
| No secrets | Pre-commit review for `.env` and credentials |
| Branch safety | No force-push to main; use feature branches |
| History | Reviewable progression aligned with `tasks.md` sprints |

## Security Checks

| Standard | Check |
| -------- | ----- |
| Secrets | `.env` gitignored; only `.env.example` committed |
| Input validation | All user input validated server-side |
| XSS | React text rendering; no unsanitized HTML |
| CORS | Not wide open (`*`) in production config |
| SQL injection | Prisma parameterized queries only |
| Auth gap | Documented known limitation — no auth in v1 |

---

# Progress Summary

| Feature Area | Total | Completed | In Progress | Not Started |
| ------------ | ----- | --------- | ----------- | ----------- |
| Project Foundation | 5 | 0 | 1 | 4 |
| Database | 9 | 0 | 0 | 9 |
| Users | 4 | 0 | 0 | 4 |
| Tickets | 10 | 0 | 0 | 10 |
| Status Management | 10 | 0 | 0 | 10 |
| Comments | 6 | 0 | 0 | 6 |
| Search & Filter | 6 | 0 | 0 | 6 |
| Validation | 7 | 0 | 0 | 7 |
| Error Handling | 6 | 0 | 0 | 6 |
| Frontend | 8 | 0 | 0 | 8 |
| Backend | 6 | 0 | 0 | 6 |
| Testing | 9 | 0 | 0 | 9 |
| Documentation | 11 | 7 | 1 | 3 |
| **Total** | **97** | **7** | **1** | **89** |

*Update Progress Summary when criterion statuses change.*

---

*Living document — update statuses after each sprint Quality Gate. Authority for requirement definitions: `docs/requirement-analysis.md`. Execution order: `tool-specific/cursor-workflow/tasks.md`.*
