# Testing Notes — Support Ticket Management System

**Last updated:** 2026-07-13  
**Sprint:** 5.1 — Integration Test Suite; 5.2.2 — Persistence & secrets; 5.2.3 — Edge case sampling; 5.2.4 — Defect fix

---

## Overview

Formal test strategy: [`docs/test-strategy.md`](test-strategy.md).

Integration tests exercise the Express API over HTTP with Supertest against a live PostgreSQL database. They focus on the **status state machine** (AC-17, AC-18) and related API guards required by the exercise.

**Location:** `server/tests/integration/`  
**Command:** `cd server && npm run test`

---

## Prerequisites

1. PostgreSQL running locally
2. `server/.env` configured (copy from `server/.env.example`)
3. Migrations applied: `cd server && npm run db:migrate`
4. Prisma client generated: `npx prisma generate` (runs with migrate)

### Environment variables

| Variable | Purpose |
| -------- | ------- |
| `DATABASE_URL` | PostgreSQL connection for dev **and** tests |
| `PORT` | API port (default `3001`) |
| `CLIENT_URL` | CORS origin (default `http://localhost:5173`) |

**Test database strategy:** Tests truncate `comments`, `tickets`, and `users` before each test case and re-seed minimal fixtures. You may use a dedicated test database by pointing `DATABASE_URL` to e.g. `support_tickets_test` — recommended for CI.

---

## Test stack

| Tool | Role |
| ---- | ---- |
| **Vitest** | Test runner (`server/vitest.config.ts`) |
| **Supertest** | HTTP assertions against Express app |
| **Prisma** | Direct DB seed/reset in `tests/helpers/db.ts` |

The Express app is exported from `server/src/app.ts` (no `listen()` in tests).

---

## What is covered (Sprint 5.1)

### Valid transitions (5) — expect `200`

| From | To |
| ---- | -- |
| Open | In Progress |
| In Progress | Resolved |
| Resolved | Closed |
| Open | Cancelled |
| In Progress | Cancelled |

### Invalid transitions (6) — expect `400` `INVALID_STATUS_TRANSITION`

| From | To |
| ---- | -- |
| Open | Resolved |
| Open | Closed |
| Resolved | Open |
| Closed | In Progress |
| Cancelled | In Progress |
| Cancelled | Closed |

### Guards (4)

| Scenario | Expected |
| -------- | -------- |
| `PATCH /api/tickets/:id` with `status` field | `400` `STATUS_NOT_ALLOWED_HERE` |
| `GET /api/tickets?status=Invalid` | `400` `INVALID_FILTER` |
| `POST /api/tickets` without title | `400` `VALIDATION_ERROR` |
| `GET /api/tickets/99999` | `404` `NOT_FOUND` |

---

## Running tests

```bash
cd server
npm run test
```

Watch mode (optional):

```bash
npm run test:watch
```

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `DATABASE_URL is required` | Create `server/.env` from `.env.example` |
| Connection refused | Start PostgreSQL; verify connection string |
| Migration errors | Run `npm run db:migrate` |
| Tests pollute dev data | Use a separate test database in `DATABASE_URL` |
| Port conflicts | Tests do not start HTTP server; port only needed for env validation |

---

## Persistence & secrets (Task 5.2.2 — AC-12, AC-14)

Verifies data survives restarts and secrets are not committed.

### Persistence procedure

1. **Do not** run `npm run test` or `npm run db:seed` after creating marker data.
2. Create marker ticket + comment:
   ```bash
   API_BASE=http://localhost:<PORT>/api node server/scripts/persistence-522-baseline.mjs
   ```
   Note the `ticketId` from output.
3. **Server restart:** stop Express (`Ctrl+C` or stop process on `PORT`), then `npm run dev`.
4. Verify:
   ```bash
   API_BASE=http://localhost:<PORT>/api TICKET_ID=<id> node server/scripts/persistence-522-verify.mjs
   ```
5. **Database restart:** restart PostgreSQL service (Windows: `postgresql-x64-*` in Services, or `Restart-Service` as admin). Re-run verify script.

### Secrets procedure

```powershell
git check-ignore -v server/.env client/.env
git ls-files | Select-String "\.env"   # only *.env.example expected
git log --all --full-history -- "**/.env"   # should be empty
```

Confirm `server/.env.example` and `client/.env.example` use placeholders only.

### Traceability

| ID | Coverage |
| ---- | -------- |
| AC-12 | Server restart + marker verify (L1, L3) |
| DB-09 | PostgreSQL restart + marker verify (L2) |
| AC-14, FND-02, FND-03 | Git ignore + example env files (L4–L7) |

See also [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) Section L.

---

## Edge cases (Task 5.2.3 — EC-01–EC-22)

Samples all 22 edge cases from `docs/requirements-analysis.md` §12 using three tiers:

| Tier | Method | Cases |
| ---- | ------ | ----- |
| 1 | Cite Sprint 5.1 Vitest (`statusTransition.integration.test.ts`) | EC-01–03, 06 (title), 20–22 |
| 2 | API script + curl | EC-04–10, 12–13, 15, 19 |
| 3 | Browser / schema review | EC-01–02, 06, 11–12, 14, 16–18 |

### API edge-case script

```bash
cd server
npm run db:seed   # if dev data was wiped
API_BASE=http://localhost:<PORT>/api node scripts/edge-cases-523-api.mjs
```

Covers EC-04, 05, 06 (description), 07, 08, 09, 10, 12, 13, 15. Exits non-zero on failure.

### Malformed JSON (EC-19)

```powershell
curl.exe -X POST http://localhost:3001/api/tickets -H "Content-Type: application/json" -d "{invalid"
```

Expected: `400` with parse error. **Fixed (2026-07-13, Task 5.2.4):** returns `400` `VALIDATION_ERROR` — see [`docs/debugging-notes.md`](debugging-notes.md) DEF-001.

### Results

Full matrix: [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) Section M.

---

## Out of scope (v1)

- Frontend unit/E2E tests
- Load/performance tests
- 100% code coverage targets

Manual QA and full regression are covered in Sprint 5.2.

---

## Traceability

| ID | Coverage |
| ---- | -------- |
| AC-17 | Valid transition integration tests |
| AC-18 | Invalid transition integration tests |
| TST-01–07 | Status + guard scenarios in `statusTransition.integration.test.ts` |
| FR-C-11 | Backend-enforced state machine verified via HTTP |
