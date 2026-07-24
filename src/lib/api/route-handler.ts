type ApiProblem = {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

type ApiSuccess<TData> = {
  data: TData;
};

type JsonRequestOptions = {
  maxBytes?: number;
};

type ErrorResponseOptions = {
  onError?: (error: unknown) => void;
  requestId?: string;
};

class ApiRouteError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(status: number, code: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiRouteError";
    this.code = code;
    this.status = status;
  }
}

function createRequestId() {
  return crypto.randomUUID();
}

function apiSuccess<TData>(data: TData, init?: ResponseInit) {
  return Response.json({ data } satisfies ApiSuccess<TData>, init);
}

function apiError(error: unknown, options: ErrorResponseOptions = {}) {
  options.onError?.(error);
  const routeError =
    error instanceof ApiRouteError
      ? error
      : new ApiRouteError(500, "INTERNAL_ERROR", "An unexpected server error occurred.");
  const headers = new Headers({ "cache-control": "no-store" });

  if (options.requestId) {
    headers.set("x-request-id", options.requestId);
  }

  return Response.json(
    {
      error: {
        code: routeError.code,
        message: routeError.message,
        requestId: options.requestId,
      },
    } satisfies ApiProblem,
    {
      headers,
      status: routeError.status,
    },
  );
}

async function readBodyWithLimit(request: Request, maxBytes: number) {
  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteLength = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    byteLength += value.byteLength;

    if (byteLength > maxBytes) {
      await reader.cancel();
      throw new ApiRouteError(413, "PAYLOAD_TOO_LARGE", "The request payload is too large.");
    }

    text += decoder.decode(value, { stream: true });
  }

  return text + decoder.decode();
}

async function parseJsonRequest<TData>(
  request: Request,
  validate: (value: unknown) => Promise<TData> | TData,
  options: JsonRequestOptions = {},
) {
  const maxBytes = options.maxBytes ?? 64 * 1024;
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim();

  if (contentType !== "application/json" && !contentType?.endsWith("+json")) {
    throw new ApiRouteError(415, "UNSUPPORTED_MEDIA_TYPE", "Content-Type must be JSON.");
  }

  const declaredLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ApiRouteError(413, "PAYLOAD_TOO_LARGE", "The request payload is too large.");
  }

  const text = await readBodyWithLimit(request, maxBytes);

  let value: unknown;

  try {
    value = JSON.parse(text) as unknown;
  } catch (cause) {
    throw new ApiRouteError(400, "INVALID_JSON", "The request body contains invalid JSON.", {
      cause,
    });
  }

  try {
    return await validate(value);
  } catch (cause) {
    if (cause instanceof ApiRouteError) {
      throw cause;
    }

    throw new ApiRouteError(422, "VALIDATION_ERROR", "The request payload is invalid.", {
      cause,
    });
  }
}

export {
  ApiRouteError,
  apiError,
  apiSuccess,
  createRequestId,
  parseJsonRequest,
  type ApiProblem,
  type ApiSuccess,
};
