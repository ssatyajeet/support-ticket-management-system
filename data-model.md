# Data Model — Support Ticket Management System

**Source:** Extracted from [`design-notes.md`](design-notes.md) §11 (Database Design)  
**Traceability:** `requirements-analysis.md` (entities, validation), FR-C-01–FR-C-15  
**Implementation:** `server/prisma/schema.prisma`, `server/prisma/migrations/`

---

## Tables

### `users`

| Column | Type | Constraints |
| ------ | ---- | ----------- |
| `id` | `SERIAL` or `UUID` | PRIMARY KEY |
| `name` | `VARCHAR(100)` | NOT NULL |
| `email` | `VARCHAR(255)` | NOT NULL, UNIQUE |
| `role` | `Role` enum | NOT NULL |
| `createdAt` | `TIMESTAMPTZ` | DEFAULT now() |

### `tickets`

| Column | Type | Constraints |
| ------ | ---- | ----------- |
| `id` | `SERIAL` or `UUID` | PRIMARY KEY |
| `title` | `VARCHAR(200)` | NOT NULL |
| `description` | `VARCHAR(5000)` | NOT NULL |
| `priority` | `Priority` enum | NOT NULL |
| `status` | `Status` enum | NOT NULL, DEFAULT Open |
| `assignedToId` | FK → users.id | NULLABLE |
| `createdById` | FK → users.id | NOT NULL |
| `createdAt` | `TIMESTAMPTZ` | DEFAULT now() |
| `updatedAt` | `TIMESTAMPTZ` | UPDATED on change |

### `comments`

| Column | Type | Constraints |
| ------ | ---- | ----------- |
| `id` | `SERIAL` or `UUID` | PRIMARY KEY |
| `ticketId` | FK → tickets.id | NOT NULL |
| `message` | `VARCHAR(2000)` | NOT NULL |
| `createdById` | FK → users.id | NOT NULL |
| `createdAt` | `TIMESTAMPTZ` | DEFAULT now() |

---

## Relationships

```
users 1───* tickets (createdById)
users 1───* tickets (assignedToId)  [optional]
users 1───* comments (createdById)
tickets 1───* comments (ticketId)
```

---

## Constraints

| Constraint | Rule |
| ---------- | ---- |
| FK `createdById` | ON DELETE RESTRICT |
| FK `assignedToId` | ON DELETE RESTRICT |
| FK `comments.createdById` | ON DELETE RESTRICT |
| FK `comments.ticketId` | ON DELETE RESTRICT (or CASCADE if ticket delete added later — not v1) |
| `users.email` | UNIQUE |
| Enum values | See below |

### Prisma Enums

| Enum | Values |
| ---- | ------ |
| `Role` | `Agent`, `Manager`, `Admin` |
| `Priority` | `Low`, `Medium`, `High`, `Critical` |
| `Status` | `Open`, `InProgress`, `Resolved`, `Closed`, `Cancelled` |

**API ↔ DB status mapping:** API uses `"In Progress"` (with space) in JSON; map to/from `InProgress` in service layer or use `@map` in Prisma.

---

## Seed Data

| Entity | Count | Requirements |
| ------ | ----- | ------------ |
| Users | 3 | One Agent, one Manager, one Admin |
| Tickets | ≥5 | At least one per status |
| Comments | ≥5 | At least one per sample ticket |

**Seed command:** `cd server && npm run db:seed`  
**Seed file:** [`server/prisma/seed.ts`](server/prisma/seed.ts)  
**Setup:** [`database/setup-notes.md`](database/setup-notes.md)

---

*Full design context: [`design-notes.md`](design-notes.md). API contract: [`api-contract.md`](api-contract.md).*
