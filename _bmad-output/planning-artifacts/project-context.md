---
project_name: 'wedding'
user_name: 'Anton'
date: '2026-01-15'
sections_completed: ['technology_stack', 'implementation_rules', 'testing', 'workflow', 'finalized']
status: 'complete'
rule_count: 15
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

-   **Framework:** Next.js v15 (App Router, Server Actions)
-   **Runtime:** Node.js v20+
-   **Database:** MongoDB with Mongoose v8 (Strict Mode)
-   **Language:** TypeScript v5 (Strict Mode)
-   **Styling:** Tailwind CSS v3
-   **Deployment:** Vercel

**Critical Version Constraints:**
-   **Next.js 15:** Must use `use server` for Actions.
-   **Mongoose v8:** Do not use callbacks; use `async/await`.

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)
-   **Strict Mode:** No `any`. Define explicit interfaces for all props and data.
-   **Async/Await:** Always use `async/await` instead of `.then()`.
-   **No Barrel Exports:** Do not use `index.ts` files to re-export components (ruins tree-shaking).

### Framework-Specific Rules (Next.js 15)
-   **Server Components First:** All components are Server Components by default. Add `"use client"` only when needing state/effects.
-   **Server Actions:** Use `actions/` directory. Return `ActionResponse<T>` pattern.
-   **Images:** Use `next/image` only for local assets. For remote, ensure hostname is configured.

### Testing Rules (MVP)
-   **Philosophy:** Tests are deferred for MVP to maximize speed.
-   **Co-location:** If tests ARE added, they must be co-located (e.g., `RsvpCard.test.tsx` next to `RsvpCard.tsx`).

### Code Quality & Style Rules
-   **Naming:** PascalCase for components, camelCase for functions/vars.
-   **Directories:** kebab-case for all directories (e.g., `app/admin-dashboard`).
-   **Styling:** Use standard Tailwind utility classes. Avoid arbitrary values (e.g., `w-[137px]`).
-   **Comments:** Comment complex logic, but prefer self-documenting code.

### Development Workflow Rules
-   **Repo:** Commit directly to `main` for MVP velocity (unless working on a massive breaking change).
-   **Secrets:** NEVER commit `.env` files.

### Critical Don't-Miss Rules
-   **DATA LEAKAGE:** Never import `server-only` code (DB, secrets) into Client Components.
-   **Waterfall Fetching:** Avoid awaiting multiple independent Server Actions sequentially; determine dependencies first.
-   **Hydration Errors:** Ensure HTML rendered on server matches client (avoid random `Math.random()` in render).

---

## Usage Guidelines

**For AI Agents:**
-   Read this file before implementing any code.
-   Follow ALL rules exactly as documented.
-   When in doubt, prefer the more restrictive option (e.g., stricter types).

**For Humans:**
-   Keep this file lean.
-   Update when stack changes.
-   Remove rules that become obvious over time.

Last Updated: 2026-01-15
