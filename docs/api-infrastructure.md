# API Infrastructure

The project uses the native Web `fetch` API through a small typed wrapper in
`src/lib/api/fetch-client.ts`.

## Why fetch

| Consideration    | Native fetch                                                                                 | Ky                                         | Axios                                          |
| ---------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------- |
| Browser bundle   | No added dependency                                                                          | Small dependency                           | Largest option                                 |
| Next.js support  | Native cache, revalidation, tags, and optional render memoization                            | Wraps fetch but obscures framework options | Does not use Next.js fetch extensions          |
| Features here    | JSON bodies, query parameters, timeouts, cancellation, retries, typed errors, response modes | Many are built in                          | Many are built in                              |
| Security surface | No additional package or transitive runtime dependencies                                     | One additional package                     | One additional package and broader API surface |
| Scaling model    | Separate immutable clients per upstream service                                              | Client instances                           | Client instances                               |

Native fetch gives this application the smallest bundle and keeps the Next.js data-cache
features available. The wrapper supplies the missing ergonomics without owning application data
or authentication state.

## Files

- `fetch-client.ts`: environment-neutral client factory.
- `browser.ts`: same-origin `/api` client for Client Components.
- `server.ts`: server-only upstream client using private environment variables.
- `errors.ts`: normalized errors safe to branch on.
- `route-handler.ts`: consistent Route Handler responses and bounded JSON parsing.
- `app/api/health/route.ts`: minimal infrastructure health endpoint.

Import from the concrete file you need. Avoid a barrel import so client code cannot accidentally
pull server-only modules into its bundle.

## Entity-oriented application layer

`src/lib/api/` is the transport layer, not the domain layer. Put application operations inside
`src/entities/<entity>/` using injected service factories, entity-owned types or DTOs, and
colocated tests. Client-side server-state hooks belong to the same entity and should wrap the
service with TanStack Query.

Follow the complete [Entity API Workflow](./entity-api-workflow.md) whenever creating or changing
an API client, entity service, query hook, Route Handler, API contract, or related test.

## Server-side request

Server Components should fetch the actual data source directly instead of making an HTTP request
to this application's own Route Handler.

```ts
import { getServerApiClient } from "@/lib/api/server";

type Project = {
  id: string;
  title: string;
};

const api = getServerApiClient();
const projects = await api.get<Project[]>("/projects", {
  next: {
    revalidate: 300,
    tags: ["projects"],
  },
});
```

Set `API_BASE_URL` in the server environment. `API_BEARER_TOKEN` is optional and is read only on
the server. Production upstream URLs must use HTTPS.

Requests use a 10-second timeout by default. A timeout requires an abort signal, which opts that
individual request out of Next.js render-pass memoization. For a safe, cacheable GET where
framework memoization matters more than the client timeout, pass `timeoutMs: false`; the hosting
platform should still enforce an upper execution limit.

## Client-side request

Use the same-origin client only when data depends on browser state or must be fetched after an
interaction:

```ts
import { browserApi } from "@/lib/api/browser";

type HealthResponse = {
  data: {
    service: string;
    status: string;
  };
};

const health = await browserApi.get<HealthResponse>("/health");
```

For persistent client-side server state, use this client as the query function for the project's
chosen cache library rather than fetching in an effect.

## Mutation

```ts
const result = await api.post<Project, CreateProjectInput>("/projects", {
  body: input,
});
```

POST and PATCH requests are not retried by default because replaying a non-idempotent mutation can
duplicate side effects. Opt in only when the endpoint implements idempotency keys.

## Route Handler

```ts
import { apiError, apiSuccess, createRequestId, parseJsonRequest } from "@/lib/api/route-handler";

export async function POST(request: Request) {
  const requestId = createRequestId();

  try {
    const input = await parseJsonRequest(request, validateInput);
    const result = await createProject(input);
    return apiSuccess(result, { status: 201 });
  } catch (error) {
    return apiError(error, {
      requestId,
      onError: reportServerError,
    });
  }
}
```

`parseJsonRequest` requires a JSON content type, limits request size to 64 KiB by default, and
requires an explicit validation function. `apiError` returns known public errors but replaces
unknown failures with a generic 500 response.

## Operational rules

- Keep tokens and private upstream URLs in server-only variables.
- Pass only relative paths to a configured client. Absolute and parent-directory paths are
  rejected to reduce accidental cross-origin requests.
- Use `next.revalidate` and `next.tags` for cacheable GET requests. Use `cache: "no-store"` for
  user-specific or sensitive data.
- Parallelize independent server requests with `Promise.all`.
- Authenticate and authorize every protected Route Handler; never rely on the UI or proxy alone.
- Rate-limit public mutations at the hosting layer and in the handler where appropriate.
- Do not forward incoming headers wholesale to an upstream service.
