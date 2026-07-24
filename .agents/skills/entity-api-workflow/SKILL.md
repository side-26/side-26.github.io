---
name: entity-api-workflow
description: Enforce Portfolio Front's entity-oriented service architecture and API workflow. Use whenever creating, changing, moving, reviewing, or testing fetch clients, API contracts, entity folders, services, DTOs, schemas, TanStack Query hooks or keys, contexts, stores, helpers, Next.js Route Handlers, or API tests.
---

# Entity API Workflow

Apply the project entity architecture consistently and keep tests synchronized with behavior.

## Load the canonical workflow

Before acting, read `docs/entity-api-workflow.md` completely. Treat it as the source of truth for
file placement, naming, dependency direction, server/client boundaries, implementation order, and
verification.

For Next.js API work, read the relevant current guide in `node_modules/next/dist/docs/` before
editing. For query hooks, also use the project `tanstack-query` skill.

## Classify ownership

Identify:

1. The entity that owns the behavior.
2. Whether the change belongs to transport, service, schema, DTO, mapper, hook, use case, or Route
   Handler.
3. Whether request-scoped server data or client-side server-state is involved.
4. Every contract and test affected by the change.

Do not create a new entity when an existing entity owns the behavior. Put multi-entity
orchestration in `src/features/` or `src/use-cases/`.

## Enforce module boundaries

- Keep transport mechanics in `src/lib/api/`.
- Keep domain operations and contracts in `src/entities/<entity>/`.
- Keep Next.js routing in `src/app/`.
- Prevent entities from importing `src/app/` or page-level components.
- Use direct file imports; do not add broad barrel exports.
- Use `.types.ts` or `.dto.ts` for application types, not `.d.ts`.
- Add optional context, store, mapper, selector, or helper modules only for real responsibilities.

## Implement in order

1. Define or update types, DTOs, schemas, and mappers.
2. Implement an injected service factory using `ApiClient`.
3. Add query keys and TanStack Query hooks only for client-side server-state.
4. Add a use case when multiple entities must be coordinated.
5. Keep Route Handlers and UI files as thin consumers.
6. Update all affected tests in the same change.

Do not keep request-scoped credentials in mutable singletons. A shared immutable browser client is
allowed; create server clients per request when authentication depends on cookies, headers,
sessions, or user tokens.

## Enforce test parity

- Service change: update `<entity>.service.test.ts`.
- Hook or key change: update the matching hook or key tests.
- Schema or mapper change: update focused tests.
- Route Handler change: update adjacent `route.test.ts`.
- API contract change: update every affected DTO, service, hook, route, and test.

Mock transport boundaries. Never call live external services from tests. Do not mark API work
complete while behavior and tests disagree.

## Verify

Run:

```bash
pnpm test
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js .
node node_modules/next/dist/bin/next build
git diff --check
```

Restore generated-only file changes after the build. Report any verification that could not run.
