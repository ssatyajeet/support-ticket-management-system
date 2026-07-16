# PR Description — Support Ticket Management System

**Artifact type:** PR description equivalent (DOC-11, AC-21)  
**Date:** 2026-07-13  
**Branch:** `main` / feature branches per sprint (`cursor/<sprint>-<summary>`)  
**Status:** Submission-ready — core scope complete

---

## Summary

This PR delivers the **Support Ticket Management System** — a full-stack internal ticket app for the JS AI Capability Exercise — plus all required lifecycle artifacts (requirement analysis, design docs, prompt history, testing/debugging notes, reflection).

**Stack:** React (Vite) + Express (TypeScript) + PostgreSQL (Prisma)

**Scope:** Core requirements AC-01–AC-18. Stretch features (auth, pagination, Docker, CI) not included.

---

## Features Implemented

### Application

| Layer | Deliverable |
| ----- | ----------- |
| **Backend** | REST API — users, tickets CRUD, dedicated status endpoint, comments, search/filter |
| **State machine** | Backend-enforced transitions in `statusTransition.ts` (5 valid, terminal states, invalid → 400) |
| **Frontend** | List, dashboard, create, detail — edit, status change, comments |
| **Database** | Prisma schema, migrations, seed (3 users, 5 tickets all statuses, 6 comments) |
| **Tests** | 16 integration tests (Vitest + Supertest) — AC-17, AC-18 |

### Exercise artifacts

| Artifact | Location |
| -------- | -------- |
| Requirement analysis v1.1 | `requirements-analysis.md` |
| Design notes | `design-notes.md` |
| API contract | `api-contract.md` |
| Implementation plan | `implementation-plan.md` |
| Test strategy | `test-strategy.md` |
| Acceptance criteria | `acceptance-criteria.md` |
| AI workflow | `tool-workflow.md` |
| Prompt history (sprint archive) | `prompt-history/sprint-*.md` |
| AI prompts (activity portfolio) | `ai-prompts/` |
| Test results | `test-results.md` |
| Debugging notes | `debugging-notes.md` |
| Reflection | `reflection.md` |
| Setup guide | `README.md` |

---

## Technical Changes

### Architecture

```
client/ (React)  ──HTTP──►  server/ (Express)
                              │
                              ├── controllers (thin)
                              ├── services (business logic)
                              ├── statusTransition.ts (state machine)
                              └── Prisma → PostgreSQL
```

**Key design decisions:**

- Status changes only via `PATCH /api/tickets/:id/status` — general PATCH rejects `status` field
- Search: case-insensitive partial match on title + description (`ILIKE`)
- No authentication in v1 (documented limitation)
- No ticket delete in v1 (deferred per DD-02)

### API endpoints

| Method | Endpoint | Notes |
| ------ | -------- | ----- |
| GET | `/api/health` | Health check |
| GET | `/api/users` | Read-only user list |
| GET | `/api/tickets` | List; `?search=` and `?status=` filters |
| POST | `/api/tickets` | Create; status auto-set to Open |
| GET | `/api/tickets/:id` | Detail with comments |
| PATCH | `/api/tickets/:id` | Update fields; **rejects status** |
| PATCH | `/api/tickets/:id/status` | State machine transitions |
| POST | `/api/tickets/:id/comments` | Append comment |

Full contract: [`api-contract.md`](api-contract.md)

### Key files

| Area | Paths |
| ---- | ----- |
| State machine | `server/src/services/statusTransition.ts` |
| Error handling | `server/src/middleware/errorHandler.ts` |
| API client | `client/src/api/` |
| Integration tests | `server/tests/integration/statusTransition.integration.test.ts` |

---

## Database Changes

| Item | Detail |
| ---- | ------ |
| **Engine** | PostgreSQL |
| **ORM** | Prisma — `server/prisma/schema.prisma` |
| **Tables** | `users`, `tickets`, `comments` |
| **Enums** | `Role`, `Priority`, `Status` |
| **Integrity** | `ON DELETE RESTRICT` on all user foreign keys |
| **Migrations** | `server/prisma/migrations/` |
| **Seed** | 3 users (Agent, Manager, Admin); 5 tickets (all statuses); 6 comments |
| **Commands** | `npm run db:migrate` · `npm run db:seed` |

---

## Testing Done

### Automated

```bash
cd server
npm run test
```

**Expected:** 16/16 integration tests pass (valid/invalid transitions + API guards).

Evidence: [`test-results.md`](test-results.md) (latest run 2026-07-15; Sprint 6.2 run 2026-07-13).

Strategy: [`test-strategy.md`](test-strategy.md)

### API regression (optional)

```bash
cd server
npm run dev   # in separate terminal
node scripts/regression-521-api.mjs
```

**Expected:** 26/26 pass. Set `API_BASE` if not using default port 3001.

> **Note:** Run `npm run db:seed` if integration tests ran recently (tests truncate tables).

### Manual

- Follow [`docs/manual-regression-checklist.md`](docs/manual-regression-checklist.md) — 33 cases
- Demo happy path: create → In Progress → Resolved → Closed
- Demo invalid transition rejection in UI and API

### Build

```bash
cd server && npm run build
cd client && npm run build
```

---

## Setup (reviewer quick start)

See [`README.md`](../README.md) for full instructions.

1. `cd server && npm install && cp .env.example .env` — configure `DATABASE_URL`
2. Create PostgreSQL database → `npm run db:migrate && npm run db:seed`
3. `npm run dev` (server)
4. `cd client && npm install && cp .env.example .env` — set `VITE_API_URL`
5. `npm run dev` (client) → open `http://localhost:5173`

---

## Known Limitations

- No authentication / RBAC
- No pagination (full list returned)
- No ticket delete
- Last-write-wins on concurrent edits
- ERR-05 (EC-17 DB-unavailable graceful failure) — not manually tested; deferred

---

## Defects fixed during QA

| ID | Issue | Fix |
| -- | ----- | --- |
| DEF-001 | Malformed JSON → 500 | `errorHandler.ts` returns 400 `VALIDATION_ERROR` |

Details: [`debugging-notes.md`](debugging-notes.md)

---

## AI Usage Summary

- **Tool:** Cursor (IDE-integrated)
- **Approach:** Task-by-task implementation with developer approval between tasks
- **Evidence:** `prompt-history/` (sprint logs), [`ai-prompts/`](ai-prompts/) (`planning.md` … `documentation.md`), `tool-workflow.md`, `reflection.md`

The developer reviewed all AI output, made architectural decisions on open questions, ran Quality Gates, and manually verified behavior before marking criteria complete.

---

## Screenshots / Demo Notes

**Screenshots:** Optional. You may add images under `docs/screenshots/` later. Below is a text demo walkthrough sufficient for review.

| Item | Detail |
| ---- | ------ |
| **Client** | `http://localhost:5173` |
| **API health** | `http://localhost:3001/api/health` (default per `server/.env.example`; match your `PORT`) |
| **Dashboard** | `http://localhost:5173/dashboard` — status summary cards and chart |

### Demo script (happy path)

1. Open ticket list at `/` — seeded tickets visible in table or card view.
2. Use search box and status tabs — URL updates with `?search=` and `?status=`.
3. Create ticket at `/tickets/new` — redirect to detail; status is **Open**.
4. On detail page: change status **Open → In Progress → Resolved → Closed** via status control.
5. Add a comment — appears in chronological list with author name.

### Demo script (error path)

1. Open a **Closed** ticket — attempt invalid transition (e.g. back to Open).
2. UI shows API error message (`INVALID_STATUS_TRANSITION`) near the status control (AC-08).

### Build / test smoke

```bash
cd server && npm run test    # 16/16 integration tests
cd client && npm run build   # production build
```

---

## Future Improvements

Deferred intentionally for v1 — documented, not hidden:

| Area | Improvement | Source |
| ---- | ----------- | ------ |
| **Auth** | JWT or session login; replace author dropdown with logged-in user | Assignment stretch |
| **Pagination / sorting** | List API pagination, sort by date/priority | Assignment stretch |
| **Ticket delete** | Soft delete with `deletedAt` for audit trail | OQ-05 / DD-02 future |
| **Concurrency** | Optimistic locking on concurrent edits | OQ-14 future |
| **Ops** | Docker Compose, CI pipeline, OpenAPI/Swagger | Assignment stretch |
| **Resilience** | EC-17 — graceful startup when DB unavailable (ERR-05) | Deferred in Sprint 5.2 |
| **Observability** | Request correlation IDs in errors | Rejected in code review — out of v1 scope |

See also [`code-review-notes.md`](code-review-notes.md) §Suggestions Rejected for architecture-level deferrals.

---

## Checklist for reviewer

- [ ] README setup works on fresh clone
- [ ] `npm run test` passes
- [ ] Ticket list, create, detail, edit, status, comments work in UI
- [ ] Invalid status transition shows API error in UI
- [ ] `prompt-history/` and `ai-prompts/` show iteration, not one-shot generation
- [ ] `reflection.md` present and honest

---

## Related links

- Requirement authority: `requirements-analysis.md`
- Technical blueprint: `design-notes.md`
- Sprint execution: `implementation-plan.md`

---

*Submission artifact for JS AI Capability Exercise — Part A. Not an actual GitHub PR unless opened by developer.*
