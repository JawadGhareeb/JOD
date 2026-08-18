import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./env";
import { getStoredToken, setStoredToken } from "./token-storage";
import type { ApiErrorBody, ApiValidationDetails } from "@/src/types/api";

const DEFAULT_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";

// These endpoints are called before a session exists — never attach a
// (possibly stale) Authorization header to them.
const ANONYMOUS_ENDPOINTS = [
  "/auth/register",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-reset-code",
  "/auth/reset-password",
];

function isAnonymousEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return ANONYMOUS_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

function readErrorBody(responseData: unknown): ApiErrorBody | null {
  if (!responseData || typeof responseData !== "object") return null;
  const body = responseData as { error?: ApiErrorBody };
  return body.error ?? null;
}

/** Handles both the normal envelope's `error.message` and the bare
 * `{ message }` shape the 401 response uses instead of the envelope. */
function extractErrorMessage(responseData: unknown): string {
  const errorBody = readErrorBody(responseData);

  if (errorBody?.details) {
    const [firstField] = Object.keys(errorBody.details);
    const firstMessage = firstField ? errorBody.details[firstField]?.[0] : undefined;
    if (firstMessage) return firstMessage;
  }

  if (errorBody?.message) return errorBody.message;

  if (responseData && typeof responseData === "object") {
    const message = (responseData as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }

  return DEFAULT_ERROR_MESSAGE;
}

export class ApiClientError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly details: ApiValidationDetails | null;

  constructor(
    message: string,
    status: number | null,
    code: string | null,
    details: ApiValidationDetails | null,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

/** Call once (e.g. from the auth provider) to react to a session becoming
 * invalid — typically by clearing local state and routing to /(auth)/login. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

export function clearUnauthorizedHandler(): void {
  onUnauthorized = null;
}

// Collapses a burst of concurrent requests that all fail with 401 at once
// into a single call to the unauthorized handler.
let hasHandledUnauthorized = false;

async function handleUnauthorized(): Promise<void> {
  if (hasHandledUnauthorized) return;
  hasHandledUnauthorized = true;
  await setStoredToken(null);
  onUnauthorized?.();
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();

    if (!isAnonymousEndpoint(config.url)) {
      const token = await getStoredToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // A successful call proves the token (if any) is still valid — allow
      // the next 401 to trigger the handler again.
      hasHandledUnauthorized = false;
      return response;
    },
    async (error: AxiosError) => {
      const status = error.response?.status ?? null;

      // No refresh endpoint exists in this contract — a 401 just ends the
      // session, it doesn't attempt a silent token refresh.
      if (status === 401) {
        await handleUnauthorized();
      }

      const errorBody = readErrorBody(error.response?.data);
      throw new ApiClientError(
        extractErrorMessage(error.response?.data),
        status,
        errorBody?.code ?? null,
        errorBody?.details ?? null,
      );
    },
  );

  return instance;
}

export const apiClient = createApiClient();
