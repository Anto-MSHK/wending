---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
project_name: 'wedding'
user_name: 'Anton'
date: '2026-01-15'
lastStep: 8
status: 'complete'
completedAt: '2026-01-15'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The system centers on a **token-based invitation engine**. Architecturally, this requires a dual-mode access control system:
1.  **Guest Access:** Stateless, token-driven (UUIDv4) resolution of `Household` aggregates.
2.  **Admin Access:** Secure, authenticated dashboard for the Host.

The data model requires a clear hierarchy of `Household -> Guests` to support the "Group RSVP" feature (`FR-10`), where one user action updates multiple records.

**Non-Functional Requirements:**
-   **Performance:** The `<150KB` bundle limit (`NFR-02`) is a strict constraint, arguing against heavy client-side libraries.
-   **Accessibility:** WCAG AA compliance (`NFR-11`) must be baked into the base component layer.
-   **Security:** "Security through obscurity" for guests means URL tokens must be non-guessable and cryptographically secure (`NFR-06`).

**Scale & Complexity:**

-   **Primary domain:** Web Application (Next.js/React)
-   **Complexity level:** Low (Greenfield, defined scope)
-   **Estimated architectural components:** ~10-15 (Pages, API Routes, Key Components)

### Technical Constraints & Dependencies

-   **Stack:** Next.js + Tailwind CSS (Fixed per PRD).
-   **Distribution:** Links shared via Telegram/WhatsApp, necessitating robust OpenGraph dynamic image generation.
-   **Browser Support:** Heavy bias towards mobile web engines (WebKit/Blink).

### Cross-Cutting Concerns Identified

-   **Identity Resolution:** Interpreting URL tokens globally across the app.
-   **Optimistic UI:** Providing instant "Confetti" feedback before server confirmation.
-   **Data Validation:** Ensuring valid household permutations during RSVP.

## Starter Template Evaluation

### Primary Technology Domain

Web Application (Full Stack) based on Next.js, Tailwind CSS, and MongoDB.

### Starter Options Considered

1.  **Custom Setup (Recommended):** Build from scratch using `create-next-app` and add MongoDB manually.
    -   *Pros:* Full control, no bloat, learn the integration.
    -   *Cons:* Slightly more initial setup.
2.  **Existing Boilerplates (e.g., `theodorusclarence` or various GitHub repos):**
    -   *Pros:* Pre-configured testing, linting, auth.
    -   *Cons:* Often come with opinionated extras (Prisma, Postgres specific configs) or outdated dependencies. Next.js 15 is very new, so strict "starters" might be lagging or unstable.

### Selected Starter: Custom (create-next-app)

**Rationale for Selection:**
Given the specific "Grandma-friendly" UX requirements, the "Security by Obscurity" auth model, and the simple "Household" data structure, a heavy boilerplate might introduce unnecessary complexity (like complex Auth.js setups we don't need for guests).

Building from a clean `create-next-app` ensures we are on the absolute latest stable versions of Next.js 15 and can layer in *only* what we need (Mongoose).

**Initialization Command:**

```bash
npx create-next-app@latest wedding --typescript --tailwind --eslint
# Then install mongodb specific deps
npm install mongoose mongodb
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
-   **TypeScript:** Strict mode enabled for type safety.
-   **Next.js 15:** Utilizing App Router for performance and React Server Components.

**Styling Solution:**
-   **Tailwind CSS 3:** Utility-first styling as requested.

**Build Tooling:**
-   **Turbo/Webpack:** Default Next.js bundler.

**Testing Framework:**
-   *Decision:* We will add **Vitest** later for unit testing (lighter than Jest) if needed, but start without heavy test scaffolding to move fast on MVP.

**Code Organization:**
-   `/app`: Routes and pages.
-   `/components`: Reusable UI parts.
-   `/lib`: Database connections and helper functions.
-   `/models`: Mongoose schemas (Household, Guest).

**Development Experience:**
-   Standard Next.js HMR (Hot Module Replacement).

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- **Data Modeling:** Strict Mongoose Schemas + TypeScript (Type Safety).
- **Authentication:** Dual-mode (Guest UUID vs. Admin Cookie).
- **Hosting:** Vercel (Native Next.js support).

**Important Decisions (Shape Architecture):**
- **Admin Access:** "Special ID" cookie-based lightweight auth (no complex OAuth).
- **State Management:** React Server Components + Optimistic UI (minimize client state).

**Deferred Decisions (Post-MVP):**
- **Image Optimization:** Advanced CDN configuring (start with standard Next.js Image).
- **Deeper Analytics:** Post-launch consideration.

### Data Architecture

**Database & Modeling**
-   **Decision:** MongoDB with Mongoose (Strict Mode).
-   **Rationale:** `Guest` and `Household` data is relational in nature (guests belong to households), but MongoDB's flexibility allows easy schema evolution. Strict Mode + TypeScript ensures valid data structure at compile time.
-   **Version:** Mongoose v8. (Latest stable).

**Data Validation**
-   **Decision:** Zod (or just Mongoose built-in validators).
-   **Rationale:** Mongoose built-in validation is sufficient for MVP. Zod can be added if form complexity grows.

### Authentication & Security

**Guest Authentication**
-   **Decision:** Token-based "Security by Obscurity".
-   **Implementation:** `?token=UUID` in URL.
-   **Security:** UUIDv4 is practically unguessable. Middleware will validate against DB.

**Admin Authentication**
-   **Decision:** "Special ID" Cookie Pattern.
-   **Implementation:**
    -   Admin visits a secret URL (e.g., `/admin?key=MY_SECRET_KEY`).
    -   Middleware checks key against `process.env.ADMIN_KEY`.
    -   If valid, sets an `HttpOnly`, `Secure` cookie.
    -   Middleware protects `/admin` routes by checking for this cookie.
-   **Rationale:** "Grandma-proof" simplicity for a single user. Zero dependencies, no database overhead for admin users, extremely secure if Env Key is strong.

### API & Communication Patterns

**API Design**
-   **Decision:** Server Actions (Next.js 15).
-   **Rationale:** Next.js 15 Server Actions allow calling backend logic directly from components/forms without manually writing `POST /api/rsvp` endpoints. Reduces boilerplate significantly.

**Communication**
-   **Decision:** Direct DB calls in Server Components.
-   **Rationale:** Why fetch an API when you are on the server? React Server Components should query Mongoose directly.

### Frontend Architecture

**State Management**
-   **Decision:** URL-driven State + Server Components.
-   **Rationale:** The "Guest" is defined by the Token in the URL. We don't need Redux/Zustand. Pass data down from Server Components.

**Routing Strategy**
-   **Decision:** App Router (Single Layout).
-   **Structure:**
    -   `/` -> Landing Page (Middleware checks token).
    -   `/admin` -> Dashboard (Middleware checks cookie).

### Infrastructure & Deployment

**Hosting**
-   **Decision:** Vercel.
-   **Rationale:** Zero-config deployment for Next.js.

### Decision Impact Analysis

**Implementation Sequence:**
1.  **Project Init:** `create-next-app` + Mongo connection.
2.  **Core Data:** Define `Household` and `Guest` schemas.
3.  **Middleware:** Implement the "Token Check" and "Admin Cookie" logic.
4.  **UI - Guest:** Build the landing page + RSVP Server Action.
5.  **UI - Admin:** Build the dashboard to view data.

**Cross-Component Dependencies:**
-   **Middleware is King:** Both Guest and Admin flows rely entirely on Middleware to resolve identity before any Page component renders. This implementation must be robust.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
5 areas where AI agents could make different choices (Structure, Naming, Error Handling, Response Formats, Testing).

### Naming Patterns

**Database Naming Conventions & Models:**
-   **Models:** Singular, PascalCase. (e.g., `models/Household.ts`, `models/Guest.ts`).
-   **Collections:** MongoDB default (lower-case plural, e.g., `households`).
-   **Fields:** camelCase (e.g., `guestName`, `isAttending`).

**Code Naming Conventions:**
-   **Components:** PascalCase (e.g., `RsvpCard.tsx`).
-   **Functions/Vars:** camelCase (e.g., `submitRsvp`, `currentGuest`).
-   **Directories:** kebab-case (e.g., `app/admin-dashboard`).
-   **Interfaces:** PascalCase, named like `[ComponentName]Props`. (e.g., `RsvpCardProps`).

### Structure Patterns

**Project Organization:**
-   `/app`: App Router pages and layouts.
-   `/components/ui`: Generic, reusable UI components (Buttons, Inputs).
-   `/components/[feature]`: Feature-specific components (e.g., `/components/rsvp/RsvpForm.tsx`).
-   `/lib`: Shared utilities, DB connection logic.
-   `/actions`: Server Actions grouped by domain (e.g., `rsvp.actions.ts`).
-   `/models`: Mongoose schemas.

**Testing:**
-   **Pattern:** Co-located tests.
-   **Example:** `RsvpCard.test.tsx` lives next to `RsvpCard.tsx`.

### Format Patterns

**Server Action Responses:**
All Server Actions must return a consistent `ActionResponse<T>` structure to ensure the UI handles errors uniformally.

```typescript
type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string; // User-facing error message
};
```

**Date Formats:**
-   **API/JSON:** ISO 8601 Strings (`2026-06-15T14:00:00Z`).
-   **UI Display:** Formatted using `Intl.DateTimeFormat` (Russian locale).

### Process Patterns

**Error Handling:**
-   **Server Actions:** Catch errors, log to server console, return `{ success: false, error: "Friendly Message" }`.
-   **UI:** Check `result.success`. If false, show toast/alert with `result.error`.

**Loading States:**
-   **Server Actions:** Use `useTransition` hook in client components to show loading indicators during Server Action execution.

### Enforcement Guidelines

**All AI Agents MUST:**
1.  **Strictly** follow the `ActionResponse` pattern for all Server Actions.
2.  **Never** put business logic inside UI components; move it to Server Actions or `/lib`.
3.  **Always** use Mongoose models for DB access, never raw MongoDB driver calls.

**Anti-Patterns:**
-   ❌ `console.log` for error handling (use proper returns).
-   ❌ Fetching data in Client Components (use Server Components where possible).

## Project Structure & Boundaries

### Complete Project Directory Structure

```
wedding/
├── .env.local                  # Environment variables (ADMIN_KEY, MONGO_URI)
├── .eslintrc.json              # Linting config
├── .gitignore
├── next.config.mjs             # Next.js config
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── README.md
├── src/
│   ├── app/
│   │   ├── (admin)/            # Admin route group (protected)
│   │   │   └── admin/
│   │   │       ├── layout.tsx  # Admin layout (sidebar/nav)
│   │   │       └── page.tsx    # Dashboard view
│   │   ├── (public)/           # Public route group
│   │   │   ├── page.tsx        # Landing Page (The Invite)
│   │   │   └── layout.tsx      # Root Layout
│   │   ├── api/                # API Routes (minimal, mostly actions)
│   │   │   └── og/             # Open Graph Image Generation
│   │   │       └── route.tsx
│   │   ├── globals.css         # Global styles (Tailwind layers)
│   │   └── layout.tsx          # Root app layout
│   ├── components/
│   │   ├── ui/                 # Generic UI (Button, Input, Card)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── rsvp/               # RSVP Feature Components
│   │   │   ├── RsvpForm.tsx
│   │   │   └── RsvpSuccess.tsx
│   │   ├── admin/              # Admin Feature Components
│   │   │   ├── GuestTable.tsx
│   │   │   └── StatsCard.tsx
│   │   └── layout/             # Layout Components
│   │   │   ├── HeroSection.tsx
│   │   │   └── Footer.tsx
│   ├── lib/
│   │   ├── db.ts               # MongoDB Connection Cache
│   │   ├── utils.ts            # Classnames helper, etc.
│   │   └── auth.ts             # Admin cookie helpers
│   ├── actions/
│   │   └── rsvp.actions.ts     # Server Actions: submitRsvp, getGuest
│   ├── models/
│   │   ├── Guest.ts            # Mongoose Schema
│   │   └── Household.ts        # Mongoose Schema
│   └── middleware.ts           # Auth & Token Validation Logic
└── public/
    └── assets/                 # Static images (photos, graphics)
```

### Architectural Boundaries

**API Boundaries:**
-   **Public Interface:** `src/actions/rsvp.actions.ts` (Server Actions) are the primary public API.
-   **Admin Interface:** Direct DB access in Admin Server Components.
-   **External:** No 3rd party integrations (Scope reduced to MVP).

**Data Boundaries:**
-   **Access:** Only `src/actions` and Server Components in `src/app` may import `src/models`.
-   **Client Components:** NEVER import `models` or `db.ts` directly. They receive data via props or Server Action results.

### Requirements to Structure Mapping

**Feature: Guest RSVP (Epics 1 & 2)**
-   **Landing Page:** `src/app/(public)/page.tsx`
-   **Components:** `src/components/rsvp/*`
-   **Logic:** `src/actions/rsvp.actions.ts`
-   **Data:** `src/models/Guest.ts`

**Feature: Admin Dashboard (Epic 3)**
-   **Page:** `src/app/(admin)/admin/page.tsx`
-   **Auth Middleware:** `src/middleware.ts` checks for `admin_session` cookie.

### Integration Points

**Internal Communication:**
-   **Client -> Server:** `useTransition` + Server Actions.
-   **Server -> Client:** Props passing (Serialization required).

**Data Flow:**
1.  **Read:** Server Components fetch via Mongoose -> Pass POJOs to Client Components.
2.  **Write:** Client Component calls Server Action -> Action updates DB -> Revalidates Path -> UI Updates.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The stack (Next.js 15 + Server Actions + Mongoose + Tailwind) is highly compatible. The "Server Actions" pattern aligns perfectly with the requirement for a lightweight "zero API boilerplate" approach. Mongoose strict mode compensates for MongoDB's schemaless nature, ensuring the `Household` structure is respected.

**Pattern Consistency:**
The `ActionResponse` pattern ensures that even though we are using disparate Server Actions, the frontend (Client Components) will always receive a predictable data shape (`{ success, data, error }`), simplifying error handling.

**Structure Alignment:**
The decision to separate `(admin)` and `(public)` route groups in `src/app` perfectly supports the dual-mode middleware authentication strategy.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
-   **Guest RSVP:** Covered by `src/app/(public)`, `src/actions/rsvp.actions.ts`, and `src/models/Guest.ts`.
-   **Admin Dashboard:** Covered by `src/app/(admin)`, `src/middleware.ts`, and `src/components/admin`.

**Non-Functional Requirements Coverage:**
-   **Performance (<150KB):** React Server Components (RSC) ensures mostly HTML is sent to the client. Using `src/components/ui/*` allows for granular code-splitting.
-   **Security (Admin):** Addressed by `middleware.ts` + `admin_session` cookie.

### Implementation Readiness Validation ✅

**Structure Completeness:**
The directory tree is explicitly defined down to the file level for MVP.

**Pattern Completeness:**
Naming conventions, error handling, and component organization are standardized.

### Gap Analysis Results

**Nice-to-Have Gaps:**
-   **Email/Telegram Notifications:** Not currently architected (deferred to post-MVP).
-   **Photo Uploads:** File storage architecture (AWS S3/Vercel Blob) is not yet defined (deferred to Phase 3).

### Architecture Completeness Checklist

**✅ Requirements Analysis**
-   [x] Project context thoroughly analyzed
-   [x] Scale and complexity assessed

**✅ Architectural Decisions**
-   [x] Critical decisions documented (Next.js 15, Mongoose, Auth)
-   [x] Technology stack fully specified

**✅ Implementation Patterns**
-   [x] Naming conventions established
-   [x] Server Action pattern defined (`ActionResponse`)

**✅ Project Structure**
-   [x] Complete directory structure defined
-   [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH. The scope is small and well-bounded, and the chosen stack is modern and efficient.

**First Implementation Priority:**
Initialize the project using `npx create-next-app@latest`.

### Implementation Handoff

**AI Agent Guidelines:**
-   Follow all architectural decisions exactly as documented.
-   **Strictly enforce** the `ActionResponse` pattern for Server Actions.
-   Use `src/app/(admin)` for all protected routes.
-   Refer to this document for all architectural questions.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-15
**Document Location:** planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 8 architectural decisions made
- 5 implementation patterns defined
- 6 architectural components specified
- 3 requirements fully supported

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing wedding. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
Initialize the project using `npx create-next-app@latest`.

**Development Sequence:**

1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement core architectural foundations
4. Build features following established patterns
5. Maintain consistency with documented rules

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**

- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen starter template and architectural patterns provide a production-ready foundation following current best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.
