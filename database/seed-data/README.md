# Seed Data — Location Mapping

**Target structure:** `database/seed-data/`  
**Actual location:** `server/prisma/seed.ts`

**Seed command:**

```bash
cd server
npm run db:seed
```

**Seed contents:** 3 users (Agent, Manager, Admin); ≥5 tickets across all statuses; ≥5 comments.

**Data model requirements:** [`data-model.md`](../../data-model.md) §Seed Data  
**Setup:** [`database/setup-notes.md`](../setup-notes.md)
