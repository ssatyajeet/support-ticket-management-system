# Database Setup Notes — Support Ticket Management System

**Stack:** PostgreSQL 14+ with Prisma ORM  
**Location:** `server/prisma/` (schema, migrations, seed)  
**Traceability:** AC-12, AC-14, DB-09

---

## Prerequisites

| Tool | Notes |
| ---- | ----- |
| PostgreSQL | Local instance (14+ recommended) |
| Node.js | LTS 18+ with npm |

---

## 1. Configure environment

Copy the server example env file:

**macOS / Linux / Git Bash**

```bash
cd server
cp .env.example .env
```

**Windows PowerShell**

```powershell
cd server
Copy-Item .env.example .env
```

Edit `server/.env`:

| Variable | Purpose | Example |
| -------- | ------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/support_tickets` |
| `PORT` | API listen port | `3001` |
| `CLIENT_URL` | CORS allowed origin | `http://localhost:5173` |

> Never commit `server/.env`. Only `server/.env.example` with placeholders is in Git.

---

## 2. Create database

Create an empty PostgreSQL database matching your `DATABASE_URL`:

```sql
CREATE DATABASE support_tickets;
```

---

## 3. Run migrations

```bash
cd server
npm install
npm run db:migrate
```

Applies Prisma migrations from `server/prisma/migrations/` to create `users`, `tickets`, and `comments` tables.

**Schema file:** `server/prisma/schema.prisma`  
**Config:** `server/prisma.config.ts` (Prisma 7.8 — datasource URL in config, not schema)

---

## 4. Seed sample data

```bash
cd server
npm run db:seed
```

Loads:

- 3 users (Agent, Manager, Admin)
- ≥5 tickets across all five statuses
- ≥5 sample comments

**Seed script:** `server/prisma/seed.ts`

---

## 5. Verify

```bash
curl http://localhost:3001/api/health
```

Expected: `200` with `{"status":"ok"}`.

---

## Folder mapping (target structure)

| Target path | Actual location |
| ----------- | --------------- |
| `database/schema-or-migrations/` | `server/prisma/migrations/` + `server/prisma/schema.prisma` |
| `database/seed-data/` | `server/prisma/seed.ts` |
| `database/setup-notes.md` | This file |

---

## Server database commands

| Command | Description |
| ------- | ----------- |
| `npm run db:migrate` | Apply Prisma migrations (`prisma migrate dev`) |
| `npm run db:seed` | Load seed data (`prisma db seed`) |

Run all commands from `server/`.

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `DATABASE_URL` missing | Create `server/.env` from `.env.example` |
| Connection refused | Start PostgreSQL; verify connection string |
| Migration errors | Ensure database exists; check `prisma.config.ts` paths |
| Prisma client out of date | `cd server && npx prisma generate` |

---

*Full app setup: [`README.md`](../README.md). Data model: [`data-model.md`](../data-model.md).*
