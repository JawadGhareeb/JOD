import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./env";
import {
  clearStoredTokens,
  getStoredRefreshToken,
  getStoredToken,
  setStoredTokens,
} from "./token-storage";
import type { ApiEnvelope, ApiErrorBody, ApiValidationDetails } from "@/src/types/api";

const DEFAULT_ERROR_MESSAGE = "حدث خطأ غير متوقع. حاول مرة أخرى.";
const API_REQUEST_TIMEOUT_MS = 12_000;
const ANONYMOUS_ENDPOINTS = [
  "/auth/register",
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/verify-reset-code",
  "/auth/reset-password",
];

type RetryableRequestConfig = InternalAxiosRequestConfig & { _jodRetried?: boolean };

type RefreshPayload = {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  expiresAt: string;
  refreshExpiresAt: string;
};

function isAnonymousEndpoint(url?: string): boolean {
  return Boolean(url && ANONYMOUS_ENDPOINTS.some((endpoint) => url.includes(endpoint)));
}

function readErrorBody(responseData: unknown): ApiErrorBody | null {
  if (!responseData || typeof responseData !== "object") return null;
  return (responseData as { error?: ApiErrorBody }).error ?? null;
}

function firstValidationMessage(details?: ApiValidationDetails | null): string | null {
  if (!details) return null;
  const first = Object.values(details)[0];
  if (Array.isArray(first)) return first[0] ?? null;
  return typeof first === "string" ? first : null;
}

function extractErrorMessage(responseData: unknown): string {
  const errorBody = readErrorBody(responseData);
  const validationMessage = firstValidationMessage(errorBody?.details);
  if (validationMessage) return validationMessage;
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

  constructor(message: string, status: number | null, code: string | null, details: ApiValidationDetails | null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;
let refreshPromise: Promise<string | null> | null = null;
let hasHandledUnauthorized = false;

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

export function clearUnauthorizedHandler(): void {
  onUnauthorized = null;
}

async function endInvalidSession(): Promise<void> {
  if (hasHandledUnauthorized) return;
  hasHandledUnauthorized = true;
  await clearStoredTokens();
  onUnauthorized?.();
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post<ApiEnvelope<RefreshPayload>>(
        "/auth/refresh",
        { refreshToken },
        {
          baseURL: getApiBaseUrl(),
          timeout: API_REQUEST_TIMEOUT_MS,
          headers: { Accept: "application/json", "Content-Type": "application/json" },
        },
      );
      const tokens = response.data.data;
      await setStoredTokens({ token: tokens.token, refreshToken: tokens.refreshToken });
      return tokens.token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    timeout: API_REQUEST_TIMEOUT_MS,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers.delete?.("Content-Type");
    }

    if (!isAnonymousEndpoint(config.url)) {
      const token = await getStoredToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      hasHandledUnauthorized = false;
      return response;
    },
    async (error: AxiosError) => {
      const status = error.response?.status ?? null;
      const original = error.config as RetryableRequestConfig | undefined;

      if (status === 401 && original && !original._jodRetried && !isAnonymousEndpoint(original.url)) {
        original._jodRetried = true;
        const token = await refreshAccessToken();
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
          return instance.request(original);
        }
        await endInvalidSession();
      } else if (status === 401 && !isAnonymousEndpoint(original?.url)) {
        await endInvalidSession();
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
