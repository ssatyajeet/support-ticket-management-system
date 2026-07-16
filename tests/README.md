# Tests — Location Mapping

**Target structure:** `tests/` at repository root  
**Actual location:** `server/tests/`

Integration tests for this project live under `server/tests/` because the Express API and Vitest config are in the `server/` package.

| Path | Contents |
| ---- | -------- |
| `server/tests/integration/` | Status state machine integration tests (AC-17, AC-18) |
| `server/tests/helpers/` | DB truncate/seed helpers |
| `server/tests/setup.ts` | Vitest setup (env, Prisma disconnect) |

**Run tests:**

```bash
cd server
npm run test
```

**Strategy and results:** [`test-strategy.md`](../test-strategy.md) · [`test-results.md`](../test-results.md)
