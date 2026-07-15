# Support Ticket Management System

Internal full-stack ticket management app built with **React + Vite**, **Express + TypeScript**, and **PostgreSQL (Prisma)**.

- Business requirements: [`docs/requirements-analysis.md`](docs/requirements-analysis.md)
- Technical blueprint: [`tool-specific/cursor-workflow/design-notes.md`](tool-specific/cursor-workflow/design-notes.md)
- AI workflow log: [`tool-workflow.md`](tool-workflow.md)

## Prerequisites

| Tool | Notes |
| ---- | ----- |
| **Node.js** | LTS (18+ recommended) |
| **npm** | Bundled with Node.js |
| **PostgreSQL** | Local instance (14+ recommended) |

## Repository structure

```
support-ticket-management-system/
├── client/          # React + Vite frontend
├── server/          # Express API + Prisma
├── docs/            # Requirement analysis, testing, debugging notes
├── prompt-history/  # AI-assisted development log (AC-20)
└── tool-specific/   # Cursor workflow artifacts (spec, tasks, AC)
```

## Quick start

From a fresh clone, run these steps in order:

1. **Server** — install, configure env, migrate, seed, start API (see [Server setup](#server-setup))
2. **Client** — install, configure env, start dev server (see [Client setup](#client-setup))
3. **Verify** — open `http://localhost:5173` and confirm the ticket list loads
4. **Tests** — run `npm run test` in `server/` (see [Testing](#testing))

> **Port alignment:** Default API port is `3001` (`server/.env.example`). If you change `PORT`, update `VITE_API_URL` in `client/.env` to match (e.g. `http://localhost:3001/api`).

---

## Server setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Copy the example file and set your local PostgreSQL credentials:

**macOS / Linux / Git Bash**

```bash
cp .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

Edit `server/.env`:

| Variable | Purpose | Example |
| -------- | ------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/support_tickets` |
| `PORT` | API listen port | `3001` |
| `CLIENT_URL` | CORS allowed origin | `http://localhost:5173` |

### 3. Create database

Create an empty PostgreSQL database matching your `DATABASE_URL` (e.g. `support_tickets`).

```sql
CREATE DATABASE support_tickets;
```

### 4. Run migrations

```bash
npm run db:migrate
```

Applies Prisma migrations to create `users`, `tickets`, and `comments` tables.

### 5. Seed sample data

```bash
npm run db:seed
```

Loads 3 users (Agent, Manager, Admin), tickets across all five statuses, and sample comments.

### 6. Start the API

```bash
npm run dev
```

API listens on `http://localhost:<PORT>` (default `3001`).

### 7. Smoke test

```bash
curl http://localhost:3001/api/health
```

Expected: `200` with `{"status":"ok"}`.

**Windows PowerShell alternative:**

```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/health -UseBasicParsing
```

### Server scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start API with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled output (`node dist/index.js`) |
| `npm run test` | Run integration tests (Vitest + Supertest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate dev`) |
| `npm run db:seed` | Load seed data (`prisma db seed`) |

---

## Client setup

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Configure environment

**macOS / Linux / Git Bash**

```bash
cp .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

Edit `client/.env`:

| Variable | Purpose | Example |
| -------- | ------- | ------- |
| `VITE_API_URL` | Backend API base URL **including `/api`** | `http://localhost:3001/api` |

`VITE_API_URL` must match your server `PORT`.

### 3. Start the client

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

### Client scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint |

---

## Running the application

Use **two terminals**:

| Terminal | Directory | Command |
| -------- | --------- | ------- |
| 1 | `server/` | `npm run dev` |
| 2 | `client/` | `npm run dev` |

Then open `http://localhost:5173`.

### Routes

| Path | Page |
| ---- | ---- |
| `/` | Ticket list (search + status filter) |
| `/dashboard` | Status summary dashboard |
| `/tickets/new` | Create ticket |
| `/tickets/:id` | Ticket detail (edit, status change, comments) |

---

## Testing

### Integration tests (required — AC-17, AC-18)

Prerequisites: PostgreSQL running, `server/.env` configured, migrations applied.

```bash
cd server
npm run test
```

Expected: all tests pass (status state machine — valid/invalid transitions and API guards).

See [`docs/test-run-evidence.md`](docs/test-run-evidence.md) for committed run results (16/16) and [`docs/testing-notes.md`](docs/testing-notes.md) for setup and coverage matrix.

### Manual regression

Full UI/API regression checklist: [`docs/manual-regression-checklist.md`](docs/manual-regression-checklist.md).

Helper scripts (optional):

```bash
cd server
node scripts/regression-521-api.mjs    # API regression (26 cases)
node scripts/edge-cases-523-api.mjs   # Edge-case sampling
```

### Build verification

```bash
cd server && npm run build
cd client && npm run build
```

Both should complete without errors.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| `P1001` / connection refused | PostgreSQL not running | Start PostgreSQL service |
| `P1000` authentication failed | Wrong `DATABASE_URL` credentials | Update `server/.env` |
| CORS error in browser | `CLIENT_URL` mismatch | Set `CLIENT_URL=http://localhost:5173` in `server/.env` |
| API calls fail (network error) | `VITE_API_URL` wrong port | Match `VITE_API_URL` to server `PORT` |
| Empty ticket list after seed | Seed not run | `cd server && npm run db:seed` |
| Tests fail on first run | Migrations not applied | `cd server && npm run db:migrate` |

For defects found during QA, see [`docs/debugging-notes.md`](docs/debugging-notes.md).

---

## Documentation index

| Document | Purpose |
| -------- | ------- |
| [`docs/candidate-info.md`](docs/candidate-info.md) | Candidate and submission overview |
| [`docs/code-review-notes.md`](docs/code-review-notes.md) | AI-assisted and developer code review log |
| [`docs/reusable-workflow.md`](docs/reusable-workflow.md) | Portable prompt and workflow template for reuse |
| [`docs/requirements-analysis.md`](docs/requirements-analysis.md) | Business requirements (FR/BR/AC) |
| [`docs/testing-notes.md`](docs/testing-notes.md) | Integration test setup and coverage |
| [`docs/test-run-evidence.md`](docs/test-run-evidence.md) | Committed Vitest run results (16/16) |
| [`docs/debugging-notes.md`](docs/debugging-notes.md) | Defects and resolutions |
| [`docs/reflection.md`](docs/reflection.md) | Honest AI usage reflection (AC-23) |
| [`docs/pr-description.md`](docs/pr-description.md) | Submission PR artifact |
| [`docs/manual-regression-checklist.md`](docs/manual-regression-checklist.md) | Manual QA script |
| [`tool-workflow.md`](tool-workflow.md) | AI-assisted development workflow |
| [`prompt-history/`](prompt-history/) | Sprint-by-sprint prompt logs |
| [`tool-specific/cursor-workflow/design-notes.md`](tool-specific/cursor-workflow/design-notes.md) | API, schema, architecture |

---

## Known limitations (v1)

- **No authentication** — all endpoints are open; suitable for local exercise use only
- **No pagination** — full ticket list returned (acceptable for exercise dataset)
- **No ticket delete** — deferred per design decision DD-02
- **Last-write-wins** — no optimistic locking on concurrent edits

---

## License

Exercise project — not for production use.
