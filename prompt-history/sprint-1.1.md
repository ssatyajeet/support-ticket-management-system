# Prompt History — Sprint 1.1: Requirements & Scope Baseline

**Date:** 2026-07-07
**Sprint:** 1.1 — Requirements & Scope Baseline
**Status:** Complete
**Tasks covered:** 1.1.1 → 1.1.6
**Traceability:** AC-19, AC-20, NFR-10, DOC-01

---

> **Recovery notice**
> Prompts in this file are **verbatim** — recovered from the Cursor conversation transcript.
> Typos in original prompts are preserved intentionally (they reflect real input).
> AI responses are summarized, not pasted in full.

---

## Goal

Analyze `docs/assignment.md`, establish approved business and technical scope, resolve all
open design questions (OQ-01–OQ-15), and produce `docs/requirements-analysis.md` v1.1 ready
to drive system design in Sprint 2.1.

---

## Tasks Completed

| Task ID | Summary | Outcome |
| ------- | ------- | ------- |
| Pre-sprint | Initialize folder and file structure | Folders + empty placeholder files created |
| 1.1.1 | Analyze assignment scope (core vs stretch) | Scope table, FR-C vs FR-S split |
| 1.1.2 | Document FR, NFR, entities, relationships | FR-C-01–24, NFR-01–12, entities, ERD |
| 1.1.3 | Define business rules, validation, user stories | BR-01–17, validation tables, US-01–17 |
| 1.1.4 | Resolve OQ-01–OQ-15 with developer review | 2 prompt rounds; all 15 OQs closed |
| 1.1.5 | Produce `docs/requirements-analysis.md` v1.1 | Final document approved |
| 1.1.6 | Define AC-01–AC-23 | Included in Prompt 2 output; §15 + Appendix A |

---

## Prompts Log

---

### Prompt 1 — Project structure setup
**Time:** 12:45 PM

**Actual prompt:**

> Create the initial project structure for a full-stack Support Ticket Management System.
>
> Create these folders:
>
> client/
> server/
> docs/
> tests/
> prompt-history/
> tool-specific/cursor-workflow/
>
> Create these empty files:
>
> README.md
>
> tool-specific/cursor-workflow/project-context.md
> tool-specific/cursor-workflow/design-notes.md
> tool-specific/cursor-workflow/implementation-plan.md
> tool-specific/cursor-workflow/acceptance-criteria.md
> tool-specific/cursor-workflow/cursor-rules-or-instructions.md
>
> Do not generate application code.
> Do not create React or Express projects.
> Only create the project structure.

**AI output:** All folders and empty placeholder files created exactly as listed.

**What I accepted / changed:** Accepted as-is. Explicit constraints ("do not generate application code") were essential — without them, AI tools often scaffold boilerplate.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No.

---

### Prompt 2 — Full requirement analysis
**Time:** 1:11 PM

**Actual prompt:**

> You are acting as a Senior Business Analyst and Software Architect.
>
> I am building a Support Ticket Management System for an AI Capability Exercise.
>
> Read docs/assignment.md carefully.
>
> Do NOT generate code.
>
> Perform a complete requirement analysis and save it as:
>
> docs/requirements-analysis.md
>
> Include:
>
> - Project Overview
> - Business Goal
> - Functional Requirements
> - Non-Functional Requirements
> - Actors
> - Entities
> - Relationships
> - Business Rules
> - Validation Rules
> - User Stories
> - Functional Flow
> - Edge Cases
> - Risks
> - Assumptions
> - Acceptance Criteria
> - Open Questions
>
> Think like a Business Analyst preparing documentation before development.

**AI output:**
- `docs/requirements-analysis.md` v1.0 (Draft) created
- FR-C-01–24 across §3.1–3.6; FR-S-03–10 in §3.7
- NFR-01–12 in §4
- Actors (§5), Entities with attribute tables (§6), Relationships + ERD (§7)
- BR-01–17 across §8.1–8.5 including status state machine diagram
- Validation tables for tickets, comments, transitions, search/filter (§9)
- US-01–17 grouped into epics (§10)
- Functional flows, edge cases, risks, assumptions (§11–§14)
- AC-01–23 in §15 with sprint mapping
- OQ-01–15 in §16 as open questions (decisions pending)

**What I accepted / changed:** Accepted overall structure. The role enum in OQ-02 had `user` as a label — I flagged this in the next prompt as potentially ambiguous for an internal tool. OQ-09 and OQ-14 were left as questions rather than decisions, which was correct — those needed deliberate architectural thought.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** Yes — OQ decisions required a separate round (Prompts 3 & 4).

---

### Prompt 3 — Resolve OQ-01–15 (first pass, with critique request)
**Time:** 3:00 PM

**Actual prompt:**

> OQ-01 Define as: Low, Medium, High, Critical
> 02 - role should be admin agent and user and we will create all three user with 3 different role
> 03 - Search both title and description (case-insensitive partial match)
> 04 - Allow comments on all statuses (audit trail)
> 05 - yes but it should be a soft delete ticket should remain in db for history
> 06 - Use on Delete restrict bcs deleting user not allowed in case he/she involve in any ticket
> 07 - tickets can be unassigned
> 08 - initially created by select from dropdown of user list and once we inmplement authentication then it should be logged in user
> 09 - think like an artitech and let me know the possible way to do that and cons pros and the recomended one
> 10 - Title: 200; Description: 5000; Comment: 2000 characters
> 11. Include resolved names (join/populate) for usability
> 12. To be decided in design phase
> 13. Include sample tickets and comments for easier demonstration
> 14. lets dicuss more i dont understand the question
> 15. Return 400 for invalid filter value
>
> here is my response review it and keep me honest about my dicisions is this the best and ideal for this project?

**AI output:**
- Critique table for all 15 OQs — flagged OQ-02 naming (`user` ambiguous for internal tool), OQ-05 scope risk (soft delete adds work not required by assignment), challenged nothing else
- OQ-09: Full architecture comparison — 3 patterns (separate status endpoint, single general update, transition action endpoint) with pros/cons table; recommended `PATCH /tickets/:id/status` with general PATCH rejecting `status` with 400
- OQ-14: Explained concurrent update problem with example scenario; compared last-write-wins vs optimistic locking vs pessimistic locking; recommended last-write-wins for core with optimistic locking noted as future enhancement

**What I accepted / changed:**
- OQ-02: AI challenged my `user` label as ambiguous — agreed to reconsider (finalized in Prompt 4)
- OQ-05: AI recommended deferring soft delete — agreed it was scope creep for core
- OQ-09: Asked AI to present options; accepted recommended architecture (separate endpoint)
- OQ-14: Asked AI to explain what concurrent updates means; accepted last-write-wins recommendation
- OQ-12: Deferred database decision to Prompt 4


**What I rejected / why:** Rejected soft delete in v1 (OQ-05 — scope creep); rejected ambiguous `user` role label (OQ-02) — finalized as Agent/Manager/Admin in Prompt 4.
**Iteration needed:** Yes — deliberate two-round design. Wanted AI critique before finalizing irreversible decisions.

---

### Prompt 4 — Finalize OQ decisions (second pass)
**Time:** 3:09 PM

**Actual prompt:**

> O2 - go with recomendet one
> Q5 - defer the delete and note it as future enhancement
> Q9 - return 400 — don't silently apply it.
> Q14. last write win is fine but keep it noted as future enhancement
> Q12 - PostgreSQL

**AI output:** Consolidated decision log with all 15 OQs finalized; brief rationale for each updated decision:
- OQ-02: Updated to `Agent`, `Manager`, `Admin` (recommended naming, clearer for internal support tool)
- OQ-05: Deferred — no delete in v1; `deletedAt` noted as future enhancement
- OQ-09: `PATCH /tickets/:id/status` for status; general `PATCH /tickets/:id` returns 400 if `status` sent
- OQ-12: PostgreSQL
- OQ-14: Last-write-wins; optimistic locking noted as post-v1 enhancement

**What I accepted / changed:** Accepted all AI recommendations. This was a deliberate choice — the AI's reasoning for each was sound and I had reviewed it in Prompt 3 before committing.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No — decisions closed.

---

### Prompt 5 — Apply decisions to document
**Time:** 3:11 PM

**Actual prompt:**

> do update the docs/requirements-analysis.md only and confirm me once you are done

**AI output:**
- `requirements-analysis.md` updated to **v1.1, Status: Approved**
- §16 rewritten: "Open Questions" → "Design Decisions (Resolved)" with all 15 OQs resolved
- §16.1 decisions table, §16.2 seed data plan, §16.3 API endpoint summary added
- BR-15 (status endpoint rule), BR-16 (resolved names), BR-17 (last-write-wins) added
- EC-21, EC-22 added to edge cases
- Glossary updated (Last-Write-Wins, Soft Delete, Integration Test entries)
- Version bumped to 1.1

**What I accepted / changed:** Accepted as-is after reviewing the diff. Prompt was intentionally minimal ("do update… and confirm me once you are done") because the decisions were already finalized — no risk of AI misinterpreting scope.


**What I rejected / why:** N/A — output verified at QG; no changes needed.
**Iteration needed:** No.

---

## What I did without AI assistance

- Reviewed the assignment (`docs/assignment.md`) myself before starting any prompts
- Deliberately chose to ask AI to **critique my OQ decisions** (Prompt 3) rather than accepting the first-draft document at face value — this was my design discipline, not AI-initiated
- Made the final call on all 15 OQ decisions after reading AI reasoning (Prompt 4)
- Reviewed `requirements-analysis.md` v1.1 before approving it

---

## Prompt engineering notes (honest reflection)

| Observation | What it shows |
|-------------|---------------|
| Prompt 2 used a role persona ("Senior Business Analyst") + explicit section list + a "Do NOT" constraint | Structured prompting — role, task, constraints, output format |
| Prompt 3 asked AI to critique decisions rather than just execute them | Using AI as a reviewer, not just a generator |
| OQ-09 and OQ-14 were deliberately left open for AI to explain options | Recognizing when a decision needed architectural reasoning before committing |
| Prompt 5 was intentionally short — decisions already made, just apply them | Knowing when a tight prompt is correct — less ambiguity = fewer errors |
| Two-round OQ design (Prompt 3 + 4) | Iteration — core prompt engineering skill |

---

## Files changed

| File | Change |
|------|--------|
| `client/`, `server/`, `docs/`, `tests/`, `prompt-history/`, `tool-specific/cursor-workflow/` | Folders created (pre-sprint) |
| `README.md`, `tool-specific/cursor-workflow/*.md` | Empty placeholder files created (pre-sprint) |
| `docs/requirements-analysis.md` | v1.0 created (Prompt 2) → v1.1 Approved (Prompt 5) |

---

## Requirements traced

| ID | Coverage |
|----|----------|
| FR-C-01–24 | All documented in §3 |
| FR-S-03–10 | Documented in §3.7 (stretch, not core) |
| NFR-01–12 | All documented in §4 |
| BR-01–17 | All documented in §8; BR-15/16/17 added in v1.1 update |
| AC-01–23 | All defined in §15; Appendix A traceability matrix |
| OQ-01–15 | All resolved in §16.1 |

---

## Quality Gate result

| Check | Result |
|-------|--------|
| Requirements verified against assignment | Passed |
| OQ decisions documented (§16) | Passed |
| AC-01–23 traceable | Passed |
| Prompt history updated | Completed retroactively — prompts recovered from transcript |

**Sprint exit:** Passed. Ready for Sprint 2.1 (Architecture & Spec).

---

## Developer review

**Status:** Approved
**Approved by:** Developer — 2026-07-07
**Notes:** Prompts are verbatim from Cursor conversation transcript. Typos in prompts preserved.
All OQ decisions verified as accurately recorded in `requirements-analysis.md` v1.1.
