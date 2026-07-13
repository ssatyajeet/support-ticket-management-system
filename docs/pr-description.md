# Pull Request — Support Ticket Management System (Submission Artifact)

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

## What was built

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
| Requirement analysis v1.1 | `docs/requirement-analysis.md` |
| Technical spec | `tool-specific/cursor-workflow/spec.md` |
| Sprint playbook | `tool-specific/cursor-workflow/tasks.md` |
| Acceptance criteria | `tool-specific/cursor-workflow/acceptance-criteria.md` |
| AI workflow | `tool-workflow.md` |
| Prompt history | `prompt-history/sprint-*.md` |
| Testing notes | `docs/testing-notes.md` |
| Debugging notes | `docs/debugging-notes.md` |
| Reflection | `docs/reflection.md` |
| Setup guide | `README.md` |

---

## Architecture highlights

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

---

## API endpoints (spec §12)

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

---

## Test plan

### Automated

```bash
cd server
npm run test
```

**Expected:** 16/16 integration tests pass (valid/invalid transitions + API guards).

### API regression (optional)

```bash
cd server
npm run dev   # in separate terminal
node scripts/regression-521-api.mjs
```

**Expected:** 26/26 pass. Set `API_BASE` if not using default port 3001.

> **Note:** Run `npm run db:seed` if integration tests ran recently (tests truncate tables).

### Manual

- Follow [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) — 33 cases
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

## Known limitations

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

Details: [`docs/debugging-notes.md`](debugging-notes.md)

---

## AI usage summary

- **Tool:** Cursor (IDE-integrated)
- **Approach:** Task-by-task implementation with developer approval between tasks
- **Evidence:** `prompt-history/` (verbatim prompts per sprint), `tool-workflow.md`, `docs/reflection.md`

The developer reviewed all AI output, made architectural decisions on open questions, ran Quality Gates, and manually verified behavior before marking criteria complete.

---

## Checklist for reviewer

- [ ] README setup works on fresh clone
- [ ] `npm run test` passes
- [ ] Ticket list, create, detail, edit, status, comments work in UI
- [ ] Invalid status transition shows API error in UI
- [ ] `prompt-history/` shows iteration, not one-shot generation
- [ ] `docs/reflection.md` present and honest

---

## Related links

- Requirement authority: `docs/requirement-analysis.md`
- Technical blueprint: `tool-specific/cursor-workflow/spec.md`
- Sprint execution: `tool-specific/cursor-workflow/tasks.md`

---

*Submission artifact for JS AI Capability Exercise — Part A. Not an actual GitHub PR unless opened by developer.*
