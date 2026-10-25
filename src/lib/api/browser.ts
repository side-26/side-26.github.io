import "client-only";

import { createApiClient } from "@/lib/api/fetch-client";

const contactApiBaseUrl = process.env.NEXT_PUBLIC_CONTACT_API_BASE_URL;

const browserApi = createApiClient({
  baseUrl: contactApiBaseUrl ?? "/api",
  retry: {
    attempts: 2,
    retryUnsafeMethods: false,
  },
  timeoutMs: 10_000,
});

export { browserApi };
