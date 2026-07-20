# API Reference — Support Ticket Management System

**Document Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Approved — matches implemented API  
**Base URL:** `http://localhost:3001/api`  
**Content-Type:** `application/json`  
**CORS:** Restricted to `CLIENT_URL` (default `http://localhost:5173`)

**Full contract:** [`api-contract.md`](../api-contract.md) (per-endpoint request/response detail)  
**Architecture:** [`design-notes.md`](../design-notes.md) §12

---

## Error response shape

All API errors return:

```json
{
  "error": {
    "message": "Human-readable message",
    "code": "ERROR_CODE",
    "details": [{ "field": "title", "message": "Required" }]
  }
}
```

`details` is optional (present on Zod validation failures).

| Code | HTTP | When |
| ---- | ---- | ---- |
| `VALIDATION_ERROR` | 400 | Invalid body, malformed JSON, field limits |
| `INVALID_STATUS_TRANSITION` | 400 | Illegal status change |
| `STATUS_NOT_ALLOWED_HERE` | 400 | `status` sent on general `PATCH /tickets/:id` |
| `INVALID_FILTER` | 400 | Invalid `status` query parameter |
| `NOT_FOUND` | 404 | Ticket or resource not found |
| `INTERNAL_ERROR` | 500 | Unhandled server error (no stack trace exposed) |

---

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/health` | Health check |
| `GET` | `/users` | List seeded users |
| `GET` | `/tickets` | List tickets (`search`, `status` query params) |
| `POST` | `/tickets` | Create ticket (status auto-set to Open) |
| `GET` | `/tickets/:id` | Ticket detail + comments |
| `PATCH` | `/tickets/:id` | Update fields (no `status`) |
| `PATCH` | `/tickets/:id/status` | Change status (state machine) |
| `POST` | `/tickets/:id/comments` | Add comment |

---

## Status state machine

Valid transitions (backend-enforced in `server/src/services/statusTransition.ts`):

| From | Allowed next |
| ---- | ------------ |
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |
| Closed | *(terminal)* |
| Cancelled | *(terminal)* |

Invalid transitions return `400` `INVALID_STATUS_TRANSITION`.

---

## curl examples

Replace `1` with a real ticket/user ID from your seed data.

### Health check

```bash
curl -s http://localhost:3001/api/health
```

Expected: `{"status":"ok"}`

### List users

```bash
curl -s http://localhost:3001/api/users
```

### List tickets (search + filter)

```bash
curl -s "http://localhost:3001/api/tickets?search=vpn&status=Open"
```

### Create ticket

```bash
curl -s -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Printer offline\",\"description\":\"Floor 2 printer not responding\",\"priority\":\"Medium\",\"createdBy\":1}"
```

Expected: `201` with `"status":"Open"`

### Get ticket detail

```bash
curl -s http://localhost:3001/api/tickets/1
```

### Update ticket (no status)

```bash
curl -s -X PATCH http://localhost:3001/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d "{\"priority\":\"High\",\"assignedTo\":2}"
```

### Reject status on general PATCH

```bash
curl -s -X PATCH http://localhost:3001/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"In Progress\"}"
```

Expected: `400` `STATUS_NOT_ALLOWED_HERE`

### Change status (valid transition)

```bash
curl -s -X PATCH http://localhost:3001/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"In Progress\"}"
```

Expected: `200` with updated status

### Invalid status transition

```bash
curl -s -X PATCH http://localhost:3001/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"Closed\"}"
```

Expected: `400` `INVALID_STATUS_TRANSITION` (when ticket is Open)

### Add comment

```bash
curl -s -X POST http://localhost:3001/api/tickets/1/comments \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Investigating now\",\"createdBy\":1}"
```

### Malformed JSON (EC-19)

```bash
curl -s -X POST http://localhost:3001/api/tickets \
  -H "Content-Type: application/json" \
  -d "{invalid"
```

Expected: `400` `VALIDATION_ERROR`

### Invalid status filter

```bash
curl -s "http://localhost:3001/api/tickets?status=Invalid"
```

Expected: `400` `INVALID_FILTER`

### Not found

```bash
curl -s http://localhost:3001/api/tickets/99999
```

Expected: `404` `NOT_FOUND`

---

## Related documents

| Document | Purpose |
| -------- | ------- |
| [`api-contract.md`](../api-contract.md) | Full per-endpoint contracts |
| [`data-model.md`](../data-model.md) | Database schema |
| [`test-strategy.md`](../test-strategy.md) | How API behavior is tested |
| [`docs/manual-regression-checklist.md`](manual-regression-checklist.md) | Manual QA matrix |
