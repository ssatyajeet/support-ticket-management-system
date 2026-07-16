# API Contract — Support Ticket Management System

**Document Version:** 1.0  
**Date:** July 15, 2026  
**Status:** Approved — matches implemented API  
**Base URL:** `http://localhost:3001/api`  
**Content-Type:** `application/json`  
**Authority:** `design-notes.md` (architecture); `requirements-analysis.md` (business rules)

### Shared types

#### `TicketSummary` / `TicketDetail`

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "priority": "Low | Medium | High | Critical",
  "status": "Open | In Progress | Resolved | Closed | Cancelled",
  "assignedTo": 2,
  "assignedToName": "string | null",
  "createdBy": 1,
  "createdByName": "string",
  "createdAt": "2026-07-15T12:00:00.000Z",
  "updatedAt": "2026-07-15T12:00:00.000Z",
  "comments": []
}
```

`comments` appears on **detail** responses only, ordered ascending by `createdAt`.

#### `Comment`

```json
{
  "id": 1,
  "ticketId": 1,
  "message": "string",
  "createdBy": 1,
  "createdByName": "string",
  "createdAt": "2026-07-15T12:00:00.000Z"
}
```

#### `User`

```json
{
  "id": 1,
  "name": "string",
  "email": "string",
  "role": "Agent | Manager | Admin"
}
```

#### `ErrorResponse`

```json
{
  "error": {
    "message": "string",
    "code": "VALIDATION_ERROR | INVALID_STATUS_TRANSITION | STATUS_NOT_ALLOWED_HERE | INVALID_FILTER | NOT_FOUND | INTERNAL_ERROR",
    "details": [{ "field": "string", "message": "string" }]
  }
}
```

`details` is optional.

---

## Endpoint: `GET` `/health` — Health check

**Purpose:** Verify the API server is running.

### Request

No body. No query parameters.

### Response

**200 OK**

```json
{ "status": "ok" }
```

### Validation Rules

None.

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `GET` `/users` — List seeded users

**Purpose:** Return all pre-seeded users for `createdBy` and `assignedTo` dropdowns.  
**Traceability:** FR-C-19, BR-13

### Request

No body. No query parameters.

### Response

**200 OK** — array of `User`

```json
[
  {
    "id": 1,
    "name": "Alex Agent",
    "email": "alex@example.com",
    "role": "Agent"
  }
]
```

### Validation Rules

None (read-only list).

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `GET` `/tickets` — List tickets (search + filter)

**Purpose:** Return all tickets with optional case-insensitive search (title + description) and status filter.  
**Traceability:** FR-C-04, FR-C-17, FR-C-18

### Request

**Query parameters:**

| Param | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `search` | string | No | Partial match on title and description; empty ignored |
| `status` | string | No | Filter by status enum |

No body.

### Response

**200 OK** — array of `TicketSummary` (no `comments` field)

```json
[
  {
    "id": 1,
    "title": "VPN not connecting",
    "description": "User cannot connect to corporate VPN",
    "priority": "High",
    "status": "Open",
    "assignedTo": null,
    "assignedToName": null,
    "createdBy": 1,
    "createdByName": "Alex Agent",
    "createdAt": "2026-07-15T10:00:00.000Z",
    "updatedAt": "2026-07-15T10:00:00.000Z"
  }
]
```

### Validation Rules

| Field | Rule |
| ----- | ---- |
| `search` | Optional string; empty string treated as no filter |
| `status` | If provided, must be valid status enum |

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 400 | `INVALID_FILTER` | Invalid `status` query value |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `POST` `/tickets` — Create ticket

**Purpose:** Create a new support ticket; server sets status to **Open** and timestamps.  
**Traceability:** FR-C-01, FR-C-02, FR-C-03, BR-01

### Request

```json
{
  "title": "string",
  "description": "string",
  "priority": "Low | Medium | High | Critical",
  "createdBy": 1,
  "assignedTo": 2
}
```

| Field | Type | Required |
| ----- | ---- | -------- |
| `title` | string | Yes |
| `description` | string | Yes |
| `priority` | string | Yes |
| `createdBy` | number | Yes |
| `assignedTo` | number \| null | No |

### Response

**201 Created** — `TicketDetail` with `status: "Open"`

```json
{
  "id": 6,
  "title": "New issue",
  "description": "Details here",
  "priority": "Medium",
  "status": "Open",
  "assignedTo": null,
  "assignedToName": null,
  "createdBy": 1,
  "createdByName": "Alex Agent",
  "createdAt": "2026-07-15T12:00:00.000Z",
  "updatedAt": "2026-07-15T12:00:00.000Z",
  "comments": []
}
```

### Validation Rules

| Field | Rule |
| ----- | ---- |
| `title` | Required; trimmed; 1–200 characters |
| `description` | Required; trimmed; 1–5000 characters |
| `priority` | Enum: Low, Medium, High, Critical |
| `createdBy` | Positive integer; must reference existing user |
| `assignedTo` | Optional; if set, must reference existing user |

Server auto-sets `status = Open`, `createdAt`, `updatedAt`.

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 400 | `VALIDATION_ERROR` | Missing/empty title or description; invalid priority; invalid field shape |
| 404 | `NOT_FOUND` | `createdBy` or `assignedTo` user ID not found |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `GET` `/tickets/:id` — Ticket detail

**Purpose:** Return full ticket with comments (oldest first) and resolved user names.  
**Traceability:** FR-C-05, BR-12, BR-16

### Request

**Path parameter:** `id` — ticket ID (integer)

No body. No query parameters.

### Response

**200 OK** — `TicketDetail` with `comments[]`

```json
{
  "id": 1,
  "title": "VPN not connecting",
  "description": "User cannot connect to corporate VPN",
  "priority": "High",
  "status": "In Progress",
  "assignedTo": 2,
  "assignedToName": "Morgan Manager",
  "createdBy": 1,
  "createdByName": "Alex Agent",
  "createdAt": "2026-07-15T10:00:00.000Z",
  "updatedAt": "2026-07-15T11:00:00.000Z",
  "comments": [
    {
      "id": 1,
      "ticketId": 1,
      "message": "Investigating network logs",
      "createdBy": 1,
      "createdByName": "Alex Agent",
      "createdAt": "2026-07-15T10:30:00.000Z"
    }
  ]
}
```

### Validation Rules

| Field | Rule |
| ----- | ---- |
| `id` | Positive integer path param |

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 404 | `NOT_FOUND` | Ticket ID does not exist |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `PATCH` `/tickets/:id` — Update ticket (no status)

**Purpose:** Update title, description, priority, or assignee. **Status changes are forbidden here.**  
**Traceability:** FR-C-06, FR-C-07, FR-C-08, BR-08, BR-09, BR-15

### Request

**Path parameter:** `id` — ticket ID

```json
{
  "title": "string",
  "description": "string",
  "priority": "Low | Medium | High | Critical",
  "assignedTo": 2
}
```

All body fields optional; at least one field required.

| Field | Type | Notes |
| ----- | ---- | ----- |
| `title` | string | 1–200 chars |
| `description` | string | 1–5000 chars |
| `priority` | string | Valid enum |
| `assignedTo` | number \| null | Valid user ID or `null` to unassign |
| `status` | — | **FORBIDDEN** on this endpoint |

### Response

**200 OK** — updated `TicketDetail`

### Validation Rules

| Field | Rule |
| ----- | ---- |
| `title` | If provided: trimmed, 1–200 characters |
| `description` | If provided: trimmed, 1–5000 characters |
| `priority` | If provided: valid enum |
| `assignedTo` | If provided: valid user ID or `null` |
| `status` | Must not appear in body → 400 `STATUS_NOT_ALLOWED_HERE` |

Reassignment does not change ticket status (BR-09). Server updates `updatedAt`.

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 400 | `VALIDATION_ERROR` | Invalid field values; empty body |
| 400 | `STATUS_NOT_ALLOWED_HERE` | Request body includes `status` field |
| 404 | `NOT_FOUND` | Ticket or assignee user not found |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `PATCH` `/tickets/:id/status` — Change ticket status

**Purpose:** Apply a status transition via the backend state machine.  
**Traceability:** FR-C-09–FR-C-13, BR-02–BR-06, BR-15, BR-17

### Request

**Path parameter:** `id` — ticket ID

```json
{
  "status": "In Progress"
}
```

| Field | Type | Required |
| ----- | ---- | -------- |
| `status` | string | Yes — target status enum |

**Valid transitions:**

| From | To |
| ---- | -- |
| Open | In Progress, Cancelled |
| In Progress | Resolved, Cancelled |
| Resolved | Closed |

Terminal states (**Closed**, **Cancelled**) reject all further transitions.

### Response

**200 OK** — updated `TicketDetail` with new `status` and `updatedAt`

### Validation Rules

| Rule | Detail |
| ---- | ------ |
| `status` | Required; must be valid status enum value |
| Transition | Must comply with `statusTransition.ts` against **current DB state** |
| Concurrency | Last-write-wins; each request validated against live status (BR-17) |

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 400 | `VALIDATION_ERROR` | Missing or invalid `status` value |
| 400 | `INVALID_STATUS_TRANSITION` | Transition not allowed (e.g. Open→Resolved, Closed→any) |
| 404 | `NOT_FOUND` | Ticket ID does not exist |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Endpoint: `POST` `/tickets/:id/comments` — Add comment

**Purpose:** Add a comment to a ticket (allowed in **all** statuses including Closed/Cancelled).  
**Traceability:** FR-C-14, FR-C-15, FR-C-16, BR-10, BR-11

### Request

**Path parameter:** `id` — ticket ID

```json
{
  "message": "string",
  "createdBy": 1
}
```

| Field | Type | Required |
| ----- | ---- | -------- |
| `message` | string | Yes |
| `createdBy` | number | Yes |

### Response

**201 Created** — `Comment`

```json
{
  "id": 7,
  "ticketId": 1,
  "message": "Customer confirmed fix",
  "createdBy": 1,
  "createdByName": "Alex Agent",
  "createdAt": "2026-07-15T14:00:00.000Z"
}
```

### Validation Rules

| Field | Rule |
| ----- | ---- |
| `message` | Required; trimmed; 1–2000 characters |
| `createdBy` | Positive integer; must reference existing user |
| Parent ticket | Must exist |

### Error Responses

| HTTP | Code | When |
| ---- | ---- | ---- |
| 400 | `VALIDATION_ERROR` | Empty message; invalid field shape |
| 404 | `NOT_FOUND` | Ticket or `createdBy` user not found |
| 500 | `INTERNAL_ERROR` | Unhandled server failure |

---

## Global error catalog

| Code | HTTP | Typical trigger |
| ---- | ---- | ---------------- |
| `VALIDATION_ERROR` | 400 | Zod failure, empty fields, max length exceeded |
| `INVALID_STATUS_TRANSITION` | 400 | State machine violation |
| `STATUS_NOT_ALLOWED_HERE` | 400 | `status` field on `PATCH /tickets/:id` |
| `INVALID_FILTER` | 400 | Invalid `status` query on `GET /tickets` |
| `NOT_FOUND` | 404 | Missing ticket or user |
| `INTERNAL_ERROR` | 500 | Unhandled exception |

Malformed JSON body → **400** with parse error message (EC-19).

---

*Full design context: `design-notes.md`. Verification checklist: `acceptance-criteria.md`.*
