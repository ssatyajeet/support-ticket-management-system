# Schema & Migrations — Location Mapping

**Target structure:** `database/schema-or-migrations/`  
**Actual location:** `server/prisma/`

| File / folder | Path |
| ------------- | ---- |
| Prisma schema | `server/prisma/schema.prisma` |
| Migrations | `server/prisma/migrations/` |
| Prisma config | `server/prisma.config.ts` |

**Apply migrations:**

```bash
cd server
npm run db:migrate
```

**Data model:** [`data-model.md`](../../data-model.md)  
**Setup:** [`database/setup-notes.md`](../setup-notes.md)
