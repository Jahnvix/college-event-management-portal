# Phase 1 Architecture

## Intent

Phase 1 establishes a compile-safe foundation for a production-grade College Event Management Portal without leaking future feature complexity into the app shell.

## Decisions

1. Use a single Next.js 15 application with the App Router.
2. Keep all first-party code inside `src/` for clean boundaries and consistent imports.
3. Separate shared cross-cutting code into `components`, `config`, `constants`, `hooks`, and `lib`.
4. Keep domain features isolated inside `src/features` so future student, admin, event, and announcement modules remain cohesive.
5. Install linting, formatting, unit testing, and E2E tooling immediately so every later phase inherits the same guardrails.
6. Keep persistence concerns isolated inside `src/server` and `prisma` so database code stays outside the UI layer.

## Current Structure

```text
src/
  app/                    # Route tree, metadata, global states, route-level error handling
  components/             # Shared primitives, providers, and layout helpers
  config/                 # Site configuration and navigation metadata
  constants/              # Stable route and domain constants
  features/               # Feature-oriented modules
  hooks/                  # Shared React hooks
  lib/                    # Framework-agnostic utilities
  server/                 # Server-only env, database, and backend runtime boundaries
prisma/
  schema.prisma           # Canonical data model for MongoDB + Prisma
tests/
  unit/                   # Jest-based unit coverage
docs/
  architecture.md         # Architecture rationale for this phase
  database.md             # Data-model rationale and database operating notes
```

## Planned Feature Modules

- `src/features/auth`
- `src/features/events`
- `src/features/registrations`
- `src/features/announcements`
- `src/features/dashboard`
- `src/features/admin`
- `src/features/analytics`
- `src/features/profile`

## Quality Gates

- `npm run lint`
- `npm run type-check`
- `npm run build`

These commands must pass at the end of every phase before any new phase begins.
