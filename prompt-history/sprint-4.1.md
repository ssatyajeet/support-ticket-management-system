# Prompt History — Sprint 4.1: Client Scaffold & API Layer

**Date:** 2026-07-10
**Sprint:** 4.1 — Client Scaffold & API Layer
**Status:** Complete
**Tasks covered:** 4.1.1 → 4.1.6
**Traceability:** FE-01–03, FND-04, spec §9, DD-10, DD-11

---

> **Recovery notice**
> Prompts in this file are **verbatim** — recovered from the Cursor conversation transcript.
> Typos in original prompts are preserved intentionally.
> AI responses are summarized, not pasted in full.

---

## Goal

Scaffold the React client: Vite + TypeScript, shared DTO types, centralized API client with error parsing, resource API modules, React Router shell, and `VITE_API_URL` env template.

---

## Tasks Completed

| Task ID | Summary | Outcome |
| ------- | ------- | ------- |
| 4.1.1 | Init Vite + React + TS | `client/` scaffold; port 5173 |
| 4.1.2 | Shared TypeScript DTOs | `client/src/types/*` mirroring spec §12.3 |
| 4.1.3 | API client base | `client.ts` — `fetch`, `ApiError`, `apiGet/Post/Patch` |
| 4.1.4 | Resource API modules | `users.ts`, `tickets.ts`, `comments.ts` |
| 4.1.5 | Layout + React Router | Routes `/`, `/tickets/new`, `/tickets/:id`, 404 |
| 4.1.6 | `client/.env.example` | `VITE_API_URL=http://localhost:3001/api` |

---

## Prompts Log

---

### Prompt 1 — Start Phase 4
**Time:** 4:05 PM | **Task:** 4.1.1

**Actual prompt:**

> proceed with 4.1

**AI output:**
- `npm create vite@latest client -- --template react-ts`
- Customized package name, minimal App, vite port 5173

**What I accepted / changed:** Approved.

**Iteration needed:** No

---

### Prompt 2 — Task 4.1.2
**Time:** 4:32 PM | **Task:** 4.1.2

**Actual prompt:**

> approved move to next 4.1.2

**AI output:**
- Created `client/src/types/*` (enums, user, comment, ticket, api)

**What I accepted / changed:** Approved.

**Iteration needed:** No

---

### Prompt 3 — Visual design deferred
**Time:** 4:36 PM | **Task:** —

**Actual prompt:**

> let it be for now proceed with 4.1.2

**AI output:**
- Confirmed no brand/mockup decisions; marked 4.1.2 complete

**What I accepted / changed:** Deferred UI branding.

**Iteration needed:** No

---

### Prompt 4 — Task 4.1.3
**Time:** 4:47 PM | **Task:** 4.1.3

**Actual prompt:**

> approved to proceed to 4.1.3

**AI output:**
- `client/src/api/client.ts` with `ApiError`, env-based URL, error parsing

**What I accepted / changed:** Approved.

**Iteration needed:** No

---

### Prompt 5 — Tasks 4.1.4–4.1.6
**Time:** 4:57 PM | **Task:** 4.1.4–4.1.6

**Actual prompt:**

> proceed with task 4.1.4 4.1.5 4.1.6

**AI output:**
- Resource API modules, React Router + Layout + placeholder pages
- `react-router-dom` installed; `client/.env.example`

**What I accepted / changed:** Approved batch.

**Iteration needed:** No

---

### Prompt 6 — Sprint 4.1 Quality Gate
**Time:** 5:20 PM | **Task:** QG

**Actual prompt:**

> approved run the Sprint 4.1 Quality Gate,

**AI output:**
- Build + CORS + users API verification
- Documentation sync; this sprint log

**What I accepted / changed:** In progress.

**Iteration needed:** No

---

## What I did without AI assistance

- Created `client/.env` from `.env.example`
- Reviewed and approved tasks between prompts

---

## Prompt engineering notes

| Observation | What it shows |
| ---- | ---- |
| Batched 4.1.4–4.1.6 in one prompt | Faster scaffold sprint when tasks are independent |
| "let it be for now" on visual design | Pragmatic deferral — functional UI first |
| Build skipped mid-sprint, run at QG | Consistent with backend sprint workflow |

---

## Files changed

| File | Change |
| --- | ----- |
| `client/package.json` | Created / updated |
| `client/vite.config.ts` | Created |
| `client/src/types/*` | Created |
| `client/src/api/*` | Created |
| `client/src/components/common/Layout.tsx` | Created |
| `client/src/pages/*` | Created (placeholders) |
| `client/src/App.tsx` | React Router |
| `client/.env.example` | Created |
| `README.md` | Client setup section |
| `tool-specific/cursor-workflow/tasks.md` | Sprint 4.1 complete |
| `tool-specific/cursor-workflow/acceptance-criteria.md` | FE-01–03, FND-04 |
| `tool-workflow.md` | Sprint 4.1 section |

---

## Requirements traced

| ID | Coverage |
|----|----|
| FE-01 | Routes configured per spec §9.3 |
| FE-02 | API centralized in `client/src/api/` |
| FE-03 | No global store; hooks deferred to 4.2+ |
| FND-04 | CORS smoke test passed |
| DD-10 | Hooks + local state architecture |
| DD-11 | Native `fetch` via API client |

---

## Quality Gate result

| Check | Result |
|-------|--------|
| `npm run build` (client) | Pass |
| `GET /api/users` → 200 (3 users) | Pass |
| CORS `OPTIONS` from `http://localhost:5173` | Pass — 204 + Allow-Origin |
| Routes in `App.tsx` | Pass — `/`, `/tickets/new`, `/tickets/:id`, `*` |
| FE-02 — no inline fetch in components | Pass — only `api/client.ts` |
| spec §9 folder structure | Pass |

**Note:** QG API tests used server on port **3000** (live dev instance). Ensure `VITE_API_URL` in `client/.env` matches your server `PORT`.

**Sprint exit:** Passed. Ready for Sprint 4.2.

---

## Developer review

**Status:** Approved
**Approved by:** Developer — 2026-07-10
**Notes:** Prompts verbatim from Cursor conversation transcript. Typos preserved.
