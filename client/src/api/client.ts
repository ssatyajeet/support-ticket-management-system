import type { ApiErrorDetail, ErrorResponse } from '../types/api';
import type { ErrorCode } from '../types/enums';

export type ClientErrorCode = ErrorCode | 'NETWORK_ERROR';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: ClientErrorCode;
  readonly details?: ApiErrorDetail[];

  constructor(
    statusCode: number,
    code: ClientErrorCode,
    message: string,
    details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static fromResponse(statusCode: number, body: ErrorResponse): ApiError {
    return new ApiError(
      statusCode,
      body.error.code,
      body.error.message,
      body.error.details,
    );
  }

  static network(): ApiError {
    return new ApiError(0, 'NETWORK_ERROR', 'Unable to connect to server');
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new Error(
      'VITE_API_URL is not configured. Copy client/.env.example to client/.env.',
    );
  }

  return baseUrl;
}

function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (value === null || typeof value !== 'object' || !('error' in value)) {
    return false;
  }

  const error = (value as ErrorResponse).error;

  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error.message === 'string' &&
    typeof error.code === 'string'
  );
}

async function parseErrorResponse(response: Response): Promise<ErrorResponse | null> {
  try {
    const data: unknown = await response.json();
    return isErrorResponse(data) ? data : null;
  } catch {
    return null;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  signal?: AbortSignal;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;
  const url = joinUrl(getApiBaseUrl(), path);

  const init: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    signal,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw ApiError.network();
  }

  if (!response.ok) {
    const errorBody = await parseErrorResponse(response);

    if (errorBody) {
      throw ApiError.fromResponse(response.status, errorBody);
    }

    throw new ApiError(
      response.status,
      'INTERNAL_ERROR',
      `Request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: 'GET', signal });
}

export function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: 'POST', body, signal });
}

export function apiPatch<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  return request<T>(path, { method: 'PATCH', body, signal });
}
