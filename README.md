# Support Ticket Management System

Internal full-stack ticket management app (React + Express + PostgreSQL). See `docs/requirement-analysis.md` for business requirements and `tool-specific/cursor-workflow/spec.md` for the technical blueprint.

## Prerequisites

- Node.js LTS
- PostgreSQL (local instance)
- npm

## Server setup

1. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Configure environment**

   Copy the example file and set your local PostgreSQL credentials:

   ```bash
   cp .env.example .env
   ```

   Required variables in `server/.env`:

   | Variable | Purpose |
   | -------- | ------- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `PORT` | API listen port (default `3001`) |
   | `CLIENT_URL` | CORS allowed origin (default `http://localhost:5173`) |

3. **Create database**

   Create an empty database matching your `DATABASE_URL` (e.g. `support_tickets`).

4. **Run migrations**

   ```bash
   npm run db:migrate
   ```

5. **Seed sample data**

   ```bash
   npm run db:seed
   ```

6. **Start the API**

   ```bash
   npm run dev
   ```

7. **Smoke test**

   ```bash
   curl http://localhost:3001/api/health
   ```

   Expected: `200` with `{"status":"ok"}`.

## Server scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled output |
| `npm run test` | Run integration tests |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Load seed data |

## Client setup

_Pending — Sprint 4.1._

## License

Exercise project — not for production use.
