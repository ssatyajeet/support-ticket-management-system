# Candidate Information

**Name:** Satyajeet Singh  
**Role:** Senior Software Engineer  
**Primary Technology Stack:** React, TypeScript, Node.js, Express, PostgreSQL, Prisma  

**Primary AI Tool Used:** Cursor  
**Project Option Selected:** Support Ticket Management System (JS AI Capability Exercise — Part B)  

**Assessment Start Date:** 2026-07-07  
**Submission Date:** 2026-07-13  

---

## Project Summary

This repository delivers a full-stack **Support Ticket Management System** — an internal web application for creating, tracking, updating, commenting on, searching, and filtering support tickets through a backend-enforced status lifecycle.

The exercise demonstrates AI-assisted engineering across the full lifecycle: requirement analysis, design and planning, implementation, integration testing, manual QA, debugging, documentation, and reflection — not only a working application.

**Core scope delivered:** AC-01–AC-18 — ticket CRUD (no delete), dedicated status endpoint with state machine, comments, search/filter, PostgreSQL persistence, input validation, 16 integration tests, and complete exercise artifacts.

**Out of scope (v1):** Authentication, pagination, ticket deletion, stretch features.

**Related submission artifacts:** [`pr-description.md`](pr-description.md) · [`reflection.md`](reflection.md) · [`requirements-analysis.md`](requirements-analysis.md)

---

## Tools Used

| Category | Tool / Technology | Purpose |
| -------- | ----------------- | ------- |
| **AI assistant** | Cursor | Requirement drafting, implementation, tests, documentation, sprint prompt history |
| **Frontend** | React 19, Vite, TypeScript, React Router, Tailwind CSS | Ticket list, dashboard, create/detail views |
| **Backend** | Node.js, Express, TypeScript, Zod | REST API, validation, error handling |
| **Database** | PostgreSQL, Prisma ORM | Schema, migrations, seed data |
| **Testing** | Vitest, Supertest | Integration tests for status state machine (AC-17, AC-18) |
| **Version control** | Git | Sprint-aligned feature branches |
| **Local environment** | Windows 10, PowerShell, npm | Development and manual regression |

**Workflow artifacts:** [`tool-workflow.md`](../tool-workflow.md) · [`tool-specific/cursor-workflow/`](../tool-specific/cursor-workflow/) · [`prompt-history/`](../prompt-history/)

---

## Setup Summary

Full run instructions are in [`README.md`](../README.md). Condensed steps:

1. **Prerequisites** — Node.js LTS (18+), npm, PostgreSQL (14+).
2. **Server** — `cd server && npm install` → copy `.env.example` to `.env` → set `DATABASE_URL`, `PORT` (default `3001`), `CLIENT_URL` → create database → `npm run db:migrate` → `npm run db:seed` → `npm run dev`.
3. **Client** — `cd client && npm install` → copy `.env.example` to `.env` → set `VITE_API_URL=http://localhost:3001/api` (must match server `PORT`) → `npm run dev`.
4. **Verify** — Open `http://localhost:5173`; confirm ticket list loads.
5. **Tests** — `cd server && npm run test` (16 integration scenarios).

**Port alignment:** Default API port is `3001` per `server/.env.example`. If `PORT` is changed, update `VITE_API_URL` in `client/.env` accordingly.

**Secrets:** `.env` files are gitignored; only `.env.example` with placeholders is committed.

---

*Submission artifact — JS AI Capability Exercise, Part C.*
