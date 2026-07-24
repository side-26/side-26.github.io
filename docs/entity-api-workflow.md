# Entity API Workflow

This document defines the required modular architecture for API-backed domain entities in
Portfolio Front.

## Architecture

Use an entity-oriented service architecture:

```text
src/lib/api
    ↓
src/entities/<entity>
    ↓
src/features or src/use-cases
    ↓
src/app and src/components
```

- `src/lib/api/` owns transport concerns such as fetch, headers, retries, timeouts, parsing, and
  normalized transport errors.
- `src/entities/` owns domain contracts, validation, API operations, query keys, and client hooks.
- `src/features/` or `src/use-cases/` orchestrates workflows spanning multiple entities.
- `src/app/` owns Next.js routing, pages, Server Components, and Route Handlers.
- `src/components/` consumes entity APIs but does not own server-state behavior.

An entity must not import from `src/app/` or page-level components. Avoid direct entity-to-entity
dependencies when a feature or use case can coordinate them instead.

## Entity structure

Create a singular, kebab-case folder:

```text
src/entities/project/
├── project.types.ts
├── project.dto.ts
├── project.schema.ts
├── project.service.ts
├── project.service.test.ts
├── project.keys.ts
├── project.hook.ts
└── project.hook.test.tsx
```

Only `*.types.ts` and `*.service.ts` are normally required for an API-backed entity. Add the
remaining files when their responsibilities exist.

### File responsibilities

| File                       | Responsibility                                          |
| -------------------------- | ------------------------------------------------------- |
| `<entity>.types.ts`        | Domain models and entity-owned TypeScript types         |
| `<entity>.dto.ts`          | API request and response transport contracts            |
| `<entity>.schema.ts`       | Runtime validation and input normalization              |
| `<entity>.service.ts`      | Raw entity operations using an injected `ApiClient`     |
| `<entity>.service.test.ts` | Service contract, request, response, and error tests    |
| `<entity>.keys.ts`         | Hierarchical TanStack Query key factory                 |
| `<entity>.hook.ts`         | Client-only TanStack Query hooks calling the service    |
| `<entity>.hook.test.tsx`   | Hook caching, invalidation, and state tests             |
| `<entity>.context.tsx`     | Subtree-scoped React state that cannot be derived       |
| `<entity>.store.ts`        | Complex client UI state, never remote server-state      |
| `<entity>.mapper.ts`       | DTO-to-domain and domain-to-DTO transformations         |
| `<entity>.selector.ts`     | Reusable derived-state selectors                        |
| `<entity>.helper.ts`       | Small entity-specific pure helpers with no clearer name |

Do not use `<entity>.d.ts` for normal domain types. Declaration files are reserved for ambient
module or global declarations.

Prefer responsibility-specific tests. A single `<entity>.test.ts` is acceptable only while the
entity is very small; split it into service, hook, mapper, or schema tests as responsibilities
grow.

## Service pattern

Use factory functions with dependency injection instead of mutable singleton classes:

```ts
import type { ApiClient } from "@/lib/api/types";

import type { Project, ProjectInput } from "./project.types";

function createProjectService(api: ApiClient) {
  return {
    create(input: ProjectInput) {
      return api.post<Project, ProjectInput>("/projects", { body: input });
    },
    list() {
      return api.get<Project[]>("/projects", {
        next: { revalidate: 300, tags: ["projects"] },
      });
    },
  };
}

export { createProjectService };
```

Services must:

- Contain entity API operations, not React state or UI behavior.
- Receive the transport client through dependency injection.
- Return typed domain results or normalized errors.
- Keep secrets and request-scoped authentication out of module-level mutable state.
- Avoid calling this application's own Route Handlers from Server Components.
- Parallelize independent operations at the caller with `Promise.all`.

The immutable browser client may be shared. Create server clients per request whenever headers,
cookies, sessions, or user tokens are request-scoped.

## Hook pattern

Create hooks only for client-side server-state. Use TanStack Query rather than `useEffect` or a
client store for fetching:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { browserApi } from "@/lib/api/browser";

import { projectKeys } from "./project.keys";
import { createProjectService } from "./project.service";

const projectService = createProjectService(browserApi);

function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectService.list(),
  });
}

export { useProjects };
```

- Keep query keys hierarchical and deterministic.
- Invalidate every affected key after successful mutations.
- Use `enabled` for conditional queries.
- Use `select` to subscribe to only the data a component needs.
- Never import server-only clients or private environment variables into a hook.

## Route Handler pattern

Keep Route Handlers thin:

1. Authenticate and authorize.
2. Parse and validate the request boundary.
3. Call one entity service or cross-entity use case.
4. Map the result to a consistent response.
5. Convert internal failures to safe public errors.

Every new or changed Route Handler must have an adjacent `route.test.ts`. Do not expose upstream
payloads, private URLs, credentials, or stack traces.

## Workflow

### 1. Classify the change

Determine:

- The owning entity.
- Whether the work is transport, entity service, client hook, cross-entity use case, or Route
  Handler behavior.
- Whether it crosses a server/client boundary.
- Which existing contracts and tests must change.

Create a new entity only when no existing entity owns the behavior.

### 2. Read current framework guidance

Before editing Next.js APIs, read the relevant local guide in `node_modules/next/dist/docs/`.
When hooks or query behavior are involved, apply the project `tanstack-query` skill.

### 3. Define contracts first

- Put domain models in `<entity>.types.ts`.
- Put wire contracts in `<entity>.dto.ts` when they differ from domain models.
- Add runtime schemas at every untrusted boundary.
- Add explicit mappers when transport and domain shapes differ.

### 4. Implement the service

- Inject `ApiClient`.
- Keep methods small and named after domain operations.
- Configure caching per GET request.
- Do not retry unsafe mutations unless the endpoint implements idempotency.
- Do not add global mutable interceptors.

### 5. Add client hooks only when needed

- Call the entity service from TanStack Query.
- Keep components unaware of URLs and transport details.
- Keep server-state out of Context and client stores.

### 6. Add optional modules deliberately

Create `context`, `store`, `mapper`, `selector`, or `helper` files only when a concrete
responsibility requires them. Do not create empty placeholders.

### 7. Keep routes and UI as consumers

- Route Handlers call services or use cases.
- Server Components call services directly.
- Client Components call hooks.
- UI files must not call the transport client directly when an entity owns the operation.

### 8. Update tests with behavior

Tests are part of the change, not follow-up work:

- Service change → update `<entity>.service.test.ts`.
- Hook or query-key change → update the hook/key tests.
- Schema or mapper change → update its focused tests.
- Route Handler change → update adjacent `route.test.ts`.
- API contract change → update every affected DTO, service, hook, route, and test in the same
  change.

Use dependency injection and mock the transport boundary. Tests must not call live external
services.

### 9. Verify

Run, at minimum:

```bash
pnpm test
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js .
node node_modules/next/dist/bin/next build
git diff --check
```

Restore generated-only changes such as `next-env.d.ts` when the build rewrites them.

## Completion checklist

- Ownership is inside one entity or an explicit cross-entity use case.
- Required files exist; optional files exist only for real responsibilities.
- `.types.ts` or `.dto.ts` is used instead of an application `.d.ts`.
- Services use dependency injection and contain no React state.
- Hooks use TanStack Query and import no server-only code.
- Server-state is not duplicated in Context or a client store.
- Routes and components remain thin consumers.
- No secrets are exposed to browser bundles or public errors.
- Every changed behavior has a matching changed test.
- Tests, TypeScript, ESLint, build, and diff checks pass.
