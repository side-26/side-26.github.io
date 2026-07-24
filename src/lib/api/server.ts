import "server-only";

import { ApiError } from "@/lib/api/errors";
import { createApiClient } from "@/lib/api/fetch-client";

function getServerApiClient() {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new ApiError("API_BASE_URL is not configured.", {
      code: "CONFIGURATION_ERROR",
    });
  }

  let parsedBaseUrl: URL;

  try {
    parsedBaseUrl = new URL(baseUrl);
  } catch (cause) {
    throw new ApiError("API_BASE_URL must be a valid absolute URL.", {
      cause,
      code: "CONFIGURATION_ERROR",
    });
  }

  if (process.env.NODE_ENV === "production" && parsedBaseUrl.protocol !== "https:") {
    throw new ApiError("API_BASE_URL must use HTTPS in production.", {
      code: "CONFIGURATION_ERROR",
    });
  }

  return createApiClient({
    baseUrl: parsedBaseUrl.href,
    headers: () => {
      const token = process.env.API_BEARER_TOKEN;

      return token ? { authorization: `Bearer ${token}` } : undefined;
    },
    retry: {
      attempts: 2,
      retryUnsafeMethods: false,
    },
    timeoutMs: 10_000,
  });
}

export { getServerApiClient };
