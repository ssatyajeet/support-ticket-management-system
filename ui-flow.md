# UI Flow — Support Ticket Management System

**Source:** Extracted from [`design-notes.md`](design-notes.md) §9 (Frontend Design)  
**Traceability:** US-01–US-06, US-09–US-15, AC-01–AC-11  
**Implementation:** `client/src/`

---

## Pages

| Page | Route | Purpose | API Calls |
| ---- | ----- | ------- | --------- |
| **TicketListPage** | `/` | List tickets with search and status filter | `GET /api/tickets`, `GET /api/users` (optional cache) |
| **TicketDetailPage** | `/tickets/:id` | View ticket, edit fields, change status, comments | `GET /api/tickets/:id`, `PATCH /api/tickets/:id`, `PATCH /api/tickets/:id/status`, `POST /api/tickets/:id/comments` |
| **CreateTicketPage** | `/tickets/new` | Create new ticket | `POST /api/tickets`, `GET /api/users` |

---

## Components

| Component | Type | Responsibility |
| --------- | ---- | -------------- |
| `TicketCard` | Presentational | Single row/card in list: title, status badge, priority, assignee |
| `TicketList` | Container | Renders ticket array; empty state |
| `TicketForm` | Form | Create/edit: title, description, priority, createdBy, assignedTo |
| `StatusSelector` | Form | Shows only **valid next statuses** for current state (UX hint; backend enforces) |
| `StatusBadge` | Presentational | Color-coded status label |
| `PriorityBadge` | Presentational | Color-coded priority label |
| `CommentList` | Presentational | Chronological comments with author name and timestamp |
| `CommentForm` | Form | Message + createdBy dropdown |
| `SearchBar` | Input | Debounced search term |
| `StatusFilter` | Select | All statuses + individual status values |
| `UserSelect` | Select | Dropdown of seeded users |
| `ErrorAlert` | Feedback | Displays API error message |
| `LoadingSpinner` | Feedback | Loading state |
| `Layout` | Shell | Header, navigation, main content area |

---

## Routing

| Path | Component | Notes |
| ---- | --------- | ----- |
| `/` | `TicketListPage` | Default landing |
| `/tickets/new` | `CreateTicketPage` | |
| `/tickets/:id` | `TicketDetailPage` | Invalid ID → show 404 from API |
| `*` | NotFound fallback | Link back to list |

Router: **React Router** (`BrowserRouter`).

---

## State Management

| Approach | Usage |
| -------- | ----- |
| **Local component state** | Form inputs, UI toggles |
| **Custom hooks** | `useTickets(filters)`, `useTicket(id)`, `useUsers()` — encapsulate fetch + loading + error |
| **URL query params** | Persist `search` and `status` filter on list page (`?search=vpn&status=Open`) |
| **No global store** | Redux/Zustand not required for v1 scope |

**Data flow:** User action → hook calls `api/` → update local state on success → display `ErrorAlert` on failure.

### UX rules

- Display `assignedToName` or **"Unassigned"** when null
- Render user content as text (XSS-safe; no `dangerouslySetInnerHTML`)
- On invalid status transition, show API `error.message` near `StatusSelector`
- Disable submit buttons while request in flight

---

*Full design context: [`design-notes.md`](design-notes.md). API contract: [`api-contract.md`](api-contract.md).*
