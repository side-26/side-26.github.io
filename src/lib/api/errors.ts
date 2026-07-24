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
  data?: unknown;
  method?: string;
  requestId?: string;
  retryable?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
};

class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly data?: unknown;
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

export { ApiError, isApiError, type ApiErrorCode, type ApiErrorOptions };
