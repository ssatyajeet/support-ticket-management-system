# JS - AI Capability Exercise

## Participant Guide — Build & Grow Your AI Workflow

A hands-on exercise every developer in the competency completes to strengthen and show how they work with AI. You'll get a feedback report and a personalized growth path — this is for development, not a graded test.

---

# Contents

1. What This Is
2. Who Takes Part
3. Time and Effort
4. What You Get Out of It
5. How the Exercise is Structured

   * Part A: AI Workflow Foundation
   * Part B: Full-Stack Mini Project
   * Part C: Submission and Reflection
6. Submission Templates
7. Tool-Specific Expectations
8. What Counts as Complete
9. How to Take Part
10. What Good Looks Like
11. Your Growth Path
12. Summary

---

# 1. What This Is

This is a hands-on capability exercise to help you develop—and make visible—how you use AI tools effectively, responsibly, and practically across the software development lifecycle.

Everyone in the competency takes part; it is a shared part of how we build AI capability, not something only a few people are singled out for.

It is **not a graded test**.

You will:

* Build a small full-stack project
* Show your engineering thinking
* Receive a feedback report
* Get a personalized AI workflow growth path

What matters is not only whether the application works, but also how you used AI throughout:

* Requirement analysis
* Planning
* Implementation
* Testing
* Debugging
* Code review
* Documentation
* Reflection

Making your thinking visible is the point.

---

# 2. Who Takes Part

All developers in the competency participate, including:

* SE
* SSE
* TL

Applicable stacks include:

* React
* Node.js
* Full-stack combinations

Everyone is evaluated against the same baseline regardless of stack or role.

---

# 3. Time and Effort

* **Duration:** One week (self-paced)
* **Core project effort:** 8–12 focused hours

The remaining time should be spent on lifecycle artifacts:

* Requirement analysis
* Prompt history
* Testing
* Debugging notes
* Reflection

These artifacts are the primary focus of the feedback.

---

# 4. What You Get Out of It

You'll receive a feedback report covering:

* Strengths
* Growth areas
* Next learning steps
* Current AI capability level
* Recommendations to improve

Feedback focuses on:

* Requirement analysis
* Prompt engineering
* AI workflow
* Full-stack design
* Code quality
* Database design
* Testing
* Debugging
* Code review
* Documentation
* Ownership
* Responsible AI usage

---

# 5. How the Exercise is Structured

| Part | Focus                   | Emphasis |
| ---- | ----------------------- | -------- |
| A    | AI Workflow Foundation  | 20%      |
| B    | Full-Stack Mini Project | 60%      |
| C    | Submission & Reflection | 20%      |

These percentages indicate where to invest effort—not grading weights.

---

# Part A — AI Workflow Foundation

## Objective

Demonstrate practical understanding of using AI throughout an engineering workflow.

## Required Submission

Create a file named:

```text
tool-workflow.md
```

Include:

* Primary AI tool
* Project context provided to AI
* Requirement analysis approach
* Planning & design
* Code generation workflow
* Validation of AI-generated code
* Testing with AI
* Debugging with AI
* Code review with AI
* Information not shared with AI
* How the workflow would be reused

---

# Part B — Full-Stack Mini Project

## Objective

Build a realistic full-stack application using AI-assisted development.

Projects consist of:

* Core (mandatory)
* Stretch (optional)

---

# Common Technical Requirements

Every submission must include:

* Frontend
* Backend API
* Database persistence
* Migration/setup scripts
* Seed data
* Input validation
* Error handling
* Search/filter
* At least one meaningful test tier
* README
* Prompt history
* Planning artifacts
* Design documents
* Testing notes
* Debugging notes
* Reflection
* PR artifacts

---

# Database Requirement

Any supported database may be used:

* PostgreSQL
* MySQL
* MongoDB
* SQLite
* H2

Provide:

* Setup instructions
* Schema/migrations
* Seed data
* `.env.example`
* Local run steps

---

# Authentication

Authentication is optional.

If implemented well, it counts as Stretch evidence.

Examples:

* JWT
* Session auth
* RBAC
* Protected routes

---

# Project

## Support Ticket Management System

## Business Context

Internal application for managing support tickets.

Users should be able to:

* Create tickets
* Update tickets
* Comment
* Search
* Progress tickets through a lifecycle

---

# Core (Mandatory)

## Entities

### User (Seeded)

| Field |
| ----- |
| id    |
| name  |
| email |
| role  |

---

### Ticket

| Field       |
| ----------- |
| id          |
| title       |
| description |
| priority    |
| status      |
| assignedTo  |
| createdBy   |
| createdAt   |
| updatedAt   |

---

### Comment

| Field     |
| --------- |
| id        |
| ticketId  |
| message   |
| createdBy |
| createdAt |

---

# Features

* Create ticket
* List tickets
* Ticket details
* Update ticket
* Change status
* Add comments
* Search
* Status filter
* Persistent storage
* Backend validation
* UI error handling

---

# Status State Machine

```text
Open
   ↓
In Progress
   ↓
Resolved
   ↓
Closed

Open --------> Cancelled
In Progress -> Cancelled
```

Invalid transitions **must** be rejected by the backend.

Frontend should display clear validation errors.

---

# Mandatory Tests

Integration tests proving:

* Valid transitions succeed
* Invalid transitions fail

---

# Stretch (Optional)

Examples:

* Additional entity
* User CRUD
* Authentication
* Authorization
* Pagination
* Sorting
* Priority filters
* Assignee filters
* Unit tests
* Edge-case tests
* Swagger/OpenAPI
* Docker
* CI/CD
* Reusable AI prompt templates

---

# Core Acceptance Criteria

The application must allow users to:

* Create tickets
* View tickets
* Open ticket details
* Update ticket information
* Reassign tickets
* Add comments
* Enforce status transitions
* Reject invalid transitions
* Search
* Filter by status
* Persist data after restart
* Validate backend input
* Keep secrets out of Git
* Pass integration tests

---

# Tool-Specific Expectations

## Kiro

```
tool-specific/
└── kiro-specs/
    ├── requirements.md
    ├── design.md
    └── tasks.md
```

---

## Cursor

```
tool-specific/
└── cursor-workflow/
    ├── project-context.md
    ├── spec.md
    ├── tasks.md
    ├── acceptance-criteria.md
    └── cursor-rules-or-instructions.md
```

---

## Claude / Other AI Tools

```
tool-specific/
└── other-tool-workflow/
    ├── project-context.md
    ├── spec.md
    ├── tasks.md
    ├── acceptance-criteria.md
    └── tool-usage-notes.md
```

Include:

* Project context
* Planning
* Validation
* Requirement traceability

---

# What Counts as Complete

Your repository should contain:

* Working frontend
* Working backend
* Database
* Migration scripts
* Seed data
* README
* Tests
* Prompt history
* Requirement analysis
* Design notes
* Reflection
* PR description

---

# How to Take Part

Submit:

* Repository URL
* Selected project
* Primary AI tool
* Short written answers

Keep:

* Commit history
* Prompt history
* Design decisions

organized and easy to review.

---

# What Good Looks Like

## Strong Work

* Clear requirement understanding
* AI prompt iteration
* Clean architecture
* Working database
* Good tests
* Debugging evidence
* Honest reflection
* Reusable workflow

---

## Weak Work

* Copy-paste AI output
* Missing analysis
* Missing prompts
* Broken setup
* Poor tests
* No debugging
* Generic documentation
* Inability to explain code

The journey and understanding matter as much as the final application.

---

# Your Growth Path

The feedback identifies where you currently stand:

1. Building the basics
2. Solid and growing
3. Strong across the lifecycle
4. Ready to lead

Each level includes recommendations for improving AI-assisted software development.

---

# Summary

Complete a self-paced, one-week AI-assisted full-stack project using an approved AI tool.

Your project should include:

* Frontend
* Backend
* Database
* Validation
* Testing
* Documentation
* Prompt history
* Reflection

Use AI thoughtfully and demonstrate how it helped throughout the engineering lifecycle—from planning to implementation, testing, debugging, review, and documentation.

The objective is not simply to build a working application but to demonstrate responsible, effective, and explainable AI-assisted software development.
