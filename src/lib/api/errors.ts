import type { ApiErrorData, ApiErrorResponse, ApiFieldMessages } from "./types.ts";

type ApiErrorCode =
  | "ABORTED"
  | "CONFIGURATION_ERROR"
  | "HTTP_ERROR"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR"
  | "TIMEOUT";

type ApiErrorOptions = {
  cause?: unknown;
  code: ApiErrorCode;
  data?: ApiErrorData;
  method?: string;
  requestId?: string;
  retryable?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
};

class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly data?: ApiErrorData;
  readonly method?: string;
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly status?: number;
  readonly statusText?: string;
  readonly url?: string;

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.code = options.code;
    this.data = options.data;
    this.method = options.method;
    this.requestId = options.requestId;
    this.retryable = options.retryable ?? false;
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
  }
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    typeof response.id === "string" &&
    Boolean(response.id) &&
    typeof response.message === "string" &&
    Boolean(response.message) &&
    typeof response.data === "object" &&
    response.data !== null &&
    "code" in response.data &&
    typeof response.data.code === "string"
  );
}

function getApiFieldMessages(error: ApiError): ApiFieldMessages[] {
  const messages = error.data?.messages;

  if (!Array.isArray(messages)) {
    return [];
  }

  return messages.filter(
    (entry): entry is ApiFieldMessages =>
      typeof entry === "object" &&
      entry !== null &&
      "name" in entry &&
      typeof entry.name === "string" &&
      Boolean(entry.name.trim()) &&
      "messages" in entry &&
      Array.isArray(entry.messages) &&
      entry.messages.every((message) => typeof message === "string" && Boolean(message.trim())),
  );
}

export {
  ApiError,
  getApiFieldMessages,
  isApiError,
  isApiErrorResponse,
  type ApiErrorCode,
  type ApiErrorOptions,
};
