import type { ApiError } from "@/lib/api/errors";

type MaybePromise<T> = T | Promise<T>;
type QueryPrimitive = boolean | number | string;
type QueryValue =
  QueryPrimitive | null | readonly (QueryPrimitive | null | undefined)[] | undefined;
type ApiQuery = Readonly<Record<string, QueryValue>>;
type ApiResponseType = "arrayBuffer" | "blob" | "json" | "response" | "text";

type ApiFieldMessages = {
  messages: string[];
  name: string;
};

type ApiErrorData = {
  code: string;
  messages?: ApiFieldMessages[];
  [key: string]: unknown;
};

type ApiErrorResponse<TData extends ApiErrorData = ApiErrorData> = {
  data: TData;
  id: string;
  message: string;
};

type ApiNextOptions = {
  revalidate?: false | number;
  tags?: string[];
};

type ApiRetryOptions = {
  attempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryUnsafeMethods: boolean;
  statuses: readonly number[];
};

type ApiRequestOptions<TBody = unknown> = Omit<
  RequestInit,
  "body" | "headers" | "method" | "signal"
> & {
  body?: TBody;
  headers?: HeadersInit;
  next?: ApiNextOptions;
  query?: ApiQuery;
  responseType?: ApiResponseType;
  retry?: number | Partial<ApiRetryOptions>;
  signal?: AbortSignal;
  timeoutMs?: false | number;
};

type ApiClientConfig = {
  baseUrl: string;
  fetch?: typeof fetch;
  headers?: HeadersInit | (() => MaybePromise<HeadersInit | undefined>);
  retry?: number | Partial<ApiRetryOptions>;
  timeoutMs?: false | number;
};

type ApiClient = {
  delete<TResponse = void>(path: string, options?: ApiRequestOptions<never>): Promise<TResponse>;
  get<TResponse>(path: string, options?: ApiRequestOptions<never>): Promise<TResponse>;
  patch<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  post<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown>(
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
  request<TResponse, TBody = unknown>(
    method: string,
    path: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse>;
};

type ApiErrorCallback = (error: ApiError) => MaybePromise<void>;

export type {
  ApiClient,
  ApiClientConfig,
  ApiErrorData,
  ApiErrorCallback,
  ApiErrorResponse,
  ApiFieldMessages,
  ApiNextOptions,
  ApiQuery,
  ApiRequestOptions,
  ApiResponseType,
  ApiRetryOptions,
  MaybePromise,
  QueryValue,
};
