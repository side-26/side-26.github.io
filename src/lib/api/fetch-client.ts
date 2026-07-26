import { ApiError, isApiError, isApiErrorResponse } from "./errors.ts";
import type {
  ApiClient,
  ApiClientConfig,
  ApiQuery,
  ApiRequestOptions,
  ApiResponseType,
  ApiRetryOptions,
} from "./types.ts";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRY_OPTIONS: ApiRetryOptions = {
  attempts: 2,
  baseDelayMs: 250,
  maxDelayMs: 4_000,
  retryUnsafeMethods: false,
  statuses: [408, 425, 429, 500, 502, 503, 504],
};
const IDEMPOTENT_METHODS = new Set(["DELETE", "GET", "HEAD", "OPTIONS", "PUT"]);
const MAX_ERROR_BODY_LENGTH = 8_192;
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+.-]*:/i;

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: false | number;
    tags?: string[];
  };
};

function createConfigurationError(message: string) {
  return new ApiError(message, { code: "CONFIGURATION_ERROR" });
}

function validateBaseUrl(baseUrl: string) {
  if (!baseUrl.trim()) {
    throw createConfigurationError("The API base URL cannot be empty.");
  }

  if (baseUrl.startsWith("//")) {
    throw createConfigurationError("Protocol-relative API base URLs are not allowed.");
  }

  if (ABSOLUTE_URL_PATTERN.test(baseUrl)) {
    const url = new URL(baseUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw createConfigurationError("The API base URL must use HTTP or HTTPS.");
    }
  } else if (!baseUrl.startsWith("/")) {
    throw createConfigurationError("A relative API base URL must begin with a slash.");
  }
}

function validatePath(path: string) {
  if (!path.trim()) {
    throw createConfigurationError("The API request path cannot be empty.");
  }

  if (ABSOLUTE_URL_PATTERN.test(path) || path.startsWith("//") || path.includes("\\")) {
    throw createConfigurationError(
      "API request paths must be relative to the configured base URL.",
    );
  }

  const pathname = path.split(/[?#]/, 1)[0];
  let decodedPathname: string;

  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    throw createConfigurationError("The API request path contains invalid URL encoding.");
  }

  if (decodedPathname.split("/").some((segment) => segment === "..")) {
    throw createConfigurationError("API request paths cannot contain parent-directory segments.");
  }
}

function appendQuery(url: string, query?: ApiQuery) {
  if (!query) {
    return url;
  }

  const isAbsolute = ABSOLUTE_URL_PATTERN.test(url);
  const parsedUrl = new URL(url, "https://api.local");

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }

    parsedUrl.searchParams.delete(key);
    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item !== undefined && item !== null) {
        parsedUrl.searchParams.append(key, String(item));
      }
    }
  }

  return isAbsolute ? parsedUrl.href : `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}

function createUrl(baseUrl: string, path: string, query?: ApiQuery) {
  validatePath(path);
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  return appendQuery(`${cleanBaseUrl}/${cleanPath}`, query);
}

function isNativeBody(value: unknown): value is BodyInit {
  return (
    typeof value === "string" ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    (typeof Blob !== "undefined" && value instanceof Blob) ||
    (typeof FormData !== "undefined" && value instanceof FormData) ||
    (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) ||
    (typeof ReadableStream !== "undefined" && value instanceof ReadableStream)
  );
}

function serializeBody(body: unknown, headers: Headers) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) {
    throw createConfigurationError(
      "Streaming request bodies are not supported by this client. Use fetch directly.",
    );
  }

  if (isNativeBody(body)) {
    return body;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return JSON.stringify(body);
}

function mergeHeaders(defaultHeaders?: HeadersInit, requestHeaders?: HeadersInit) {
  const headers = new Headers(defaultHeaders);

  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }

  new Headers(requestHeaders).forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
}

function resolveRetryOptions(retry: number | Partial<ApiRetryOptions> | undefined, method: string) {
  const resolved =
    typeof retry === "number"
      ? { ...DEFAULT_RETRY_OPTIONS, attempts: retry }
      : { ...DEFAULT_RETRY_OPTIONS, ...retry };
  const canRetryMethod = IDEMPOTENT_METHODS.has(method) || resolved.retryUnsafeMethods;

  return {
    ...resolved,
    attempts: canRetryMethod ? Math.max(0, Math.floor(resolved.attempts)) : 0,
    baseDelayMs: Math.max(0, resolved.baseDelayMs),
    maxDelayMs: Math.max(0, resolved.maxDelayMs),
  };
}

function getRetryAfterMs(response: Response) {
  const retryAfter = response.headers.get("retry-after");

  if (!retryAfter) {
    return undefined;
  }

  const seconds = Number(retryAfter);

  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1_000);
  }

  const date = Date.parse(retryAfter);

  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function getRetryDelay(attempt: number, response: Response | undefined, options: ApiRetryOptions) {
  const retryAfterMs = response ? getRetryAfterMs(response) : undefined;

  if (retryAfterMs !== undefined) {
    return Math.min(retryAfterMs, options.maxDelayMs);
  }

  const exponentialDelay = options.baseDelayMs * 2 ** attempt;
  const jitter = 0.75 + Math.random() * 0.5;

  return Math.min(exponentialDelay * jitter, options.maxDelayMs);
}

function wait(delayMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function createAttemptSignal(externalSignal: AbortSignal | undefined, timeoutMs: false | number) {
  if (!externalSignal && timeoutMs === false) {
    return {
      cleanup() {},
      didTimeOut() {
        return false;
      },
      signal: undefined,
    };
  }

  const controller = new AbortController();
  let timedOut = false;

  const abortFromExternalSignal = () => {
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal?.aborted) {
    abortFromExternalSignal();
  } else {
    externalSignal?.addEventListener("abort", abortFromExternalSignal, { once: true });
  }

  const timeoutId =
    timeoutMs === false
      ? undefined
      : setTimeout(() => {
          timedOut = true;
          controller.abort(new DOMException("The API request timed out.", "TimeoutError"));
        }, timeoutMs);

  return {
    cleanup() {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      externalSignal?.removeEventListener("abort", abortFromExternalSignal);
    },
    didTimeOut() {
      return timedOut;
    },
    signal: controller.signal,
  };
}

function sanitizeUrl(url: string) {
  try {
    const parsedUrl = new URL(url, "https://api.local");
    return parsedUrl.pathname;
  } catch {
    return undefined;
  }
}

async function readErrorPayload(response: Response) {
  const contentLength = Number(response.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_ERROR_BODY_LENGTH) {
    return undefined;
  }

  const body = (await response.text()).slice(0, MAX_ERROR_BODY_LENGTH);

  if (!body) {
    return undefined;
  }

  if (response.headers.get("content-type")?.includes("json")) {
    try {
      return JSON.parse(body) as unknown;
    } catch {
      return body;
    }
  }

  return body;
}

async function parseResponse<TResponse>(response: Response, responseType: ApiResponseType) {
  if (responseType === "response") {
    return response as TResponse;
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as TResponse;
  }

  switch (responseType) {
    case "arrayBuffer":
      return (await response.arrayBuffer()) as TResponse;
    case "blob":
      return (await response.blob()) as TResponse;
    case "text":
      return (await response.text()) as TResponse;
    case "json":
      try {
        return (await response.json()) as TResponse;
      } catch (cause) {
        throw new ApiError("The API returned an invalid JSON response.", {
          cause,
          code: "INVALID_RESPONSE",
          requestId: response.headers.get("x-request-id") ?? undefined,
          status: response.status,
        });
      }
  }
}

function shouldRetry(error: ApiError, retryOptions: ApiRetryOptions) {
  if (!error.retryable) {
    return false;
  }

  return error.status === undefined || retryOptions.statuses.includes(error.status);
}

function createApiClient(config: ApiClientConfig): ApiClient {
  validateBaseUrl(config.baseUrl);
  const fetchImplementation = config.fetch ?? fetch;

  async function request<TResponse, TBody = unknown>(
    methodInput: string,
    path: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const method = methodInput.toUpperCase();
    const {
      body,
      headers: requestHeaders,
      query,
      responseType = "json",
      retry = config.retry,
      signal: externalSignal,
      timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      ...requestInit
    } = options;

    if ((method === "GET" || method === "HEAD") && body !== undefined) {
      throw createConfigurationError(`${method} requests cannot include a body.`);
    }

    if (timeoutMs !== false && (!Number.isFinite(timeoutMs) || timeoutMs <= 0)) {
      throw createConfigurationError("The API request timeout must be a positive number.");
    }

    const resolvedDefaultHeaders =
      typeof config.headers === "function" ? await config.headers() : config.headers;
    const headers = mergeHeaders(resolvedDefaultHeaders, requestHeaders);
    const serializedBody = serializeBody(body, headers);
    const url = createUrl(config.baseUrl, path, query);
    const safeUrl = sanitizeUrl(url);
    const retryOptions = resolveRetryOptions(retry, method);
    let attempt = 0;

    while (true) {
      const attemptSignal = createAttemptSignal(externalSignal, timeoutMs);
      let response: Response | undefined;

      try {
        const init: NextFetchInit = {
          ...requestInit,
          body: serializedBody,
          headers,
          method,
          signal: attemptSignal.signal,
        };

        response = await fetchImplementation(url, init);

        if (!response.ok) {
          const errorPayload = await readErrorPayload(response.clone());
          const problem = isApiErrorResponse(errorPayload) ? errorPayload : undefined;

          throw new ApiError(
            problem?.message ?? "The server could not complete the request. Please try again.",
            {
              code: "HTTP_ERROR",
              data: problem?.data,
              method,
              requestId: problem?.id ?? response.headers.get("x-request-id") ?? undefined,
              retryable: retryOptions.statuses.includes(response.status),
              status: response.status,
              statusText: response.statusText,
              url: safeUrl,
            },
          );
        }

        return await parseResponse<TResponse>(response, responseType);
      } catch (cause) {
        let error: ApiError;

        if (isApiError(cause)) {
          error = cause;
        } else if (attemptSignal.didTimeOut()) {
          error = new ApiError("The request took too long. Check your connection and try again.", {
            cause,
            code: "TIMEOUT",
            method,
            retryable: true,
            url: safeUrl,
          });
        } else if (externalSignal?.aborted) {
          error = new ApiError("The request was cancelled.", {
            cause,
            code: "ABORTED",
            method,
            url: safeUrl,
          });
        } else {
          error = new ApiError(
            "The server could not be reached. Check your connection and try again.",
            {
              cause,
              code: "NETWORK_ERROR",
              method,
              retryable: true,
              url: safeUrl,
            },
          );
        }

        if (attempt >= retryOptions.attempts || !shouldRetry(error, retryOptions)) {
          throw error;
        }

        const delayMs = getRetryDelay(attempt, response, retryOptions);
        attempt += 1;
        await wait(delayMs);
      } finally {
        attemptSignal.cleanup();
      }
    }
  }

  return {
    delete: (path, options) => request("DELETE", path, options),
    get: (path, options) => request("GET", path, options),
    patch: (path, options) => request("PATCH", path, options),
    post: (path, options) => request("POST", path, options),
    put: (path, options) => request("PUT", path, options),
    request,
  };
}

export { createApiClient };
