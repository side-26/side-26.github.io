import "client-only";

import { createApiClient } from "@/lib/api/fetch-client";

const browserApi = createApiClient({
  baseUrl: "/api",
  retry: {
    attempts: 2,
    retryUnsafeMethods: false,
  },
  timeoutMs: 10_000,
});

export { browserApi };
