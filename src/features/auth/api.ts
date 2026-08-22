import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type { AuthSession, AuthUser, LoginInput, RegisterInput, ResetPasswordInput } from "./types";

const ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  forgotPassword: "/auth/forgot-password",
  verifyResetCode: "/auth/verify-reset-code",
  resetPassword: "/auth/reset-password",
  me: "/me",
} as const;

/** Thin wrappers over `apiClient` — no token persistence here, see `session.ts`. */
export const authApi = {
  register: async (input: RegisterInput): Promise<AuthSession> => {
    const response = await apiClient.post<ApiEnvelope<AuthSession>>(ENDPOINTS.register, input);
    return response.data.data;
  },

  login: async (input: LoginInput): Promise<AuthSession> => {
    const response = await apiClient.post<ApiEnvelope<AuthSession>>(ENDPOINTS.login, input);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.logout);
  },

  forgotPassword: async (login: string): Promise<boolean> => {
    const response = await apiClient.post<ApiEnvelope<{ resetCodeSent: boolean }>>(
      ENDPOINTS.forgotPassword,
      { login },
    );
    return response.data.data.resetCodeSent;
  },

  verifyResetCode: async (login: string, code: string): Promise<boolean> => {
    const response = await apiClient.post<ApiEnvelope<{ resetCodeVerified: boolean }>>(
      ENDPOINTS.verifyResetCode,
      { login, code },
    );
    return response.data.data.resetCodeVerified;
  },

  resetPassword: async (input: ResetPasswordInput): Promise<boolean> => {
    const response = await apiClient.post<ApiEnvelope<{ resetPasswordUpdated: boolean }>>(
      ENDPOINTS.resetPassword,
      input,
    );
    return response.data.data.resetPasswordUpdated;
  },

  /** Used to hydrate the session on app launch from a stored token. */
  me: async (): Promise<AuthUser> => {
    const response = await apiClient.get<ApiEnvelope<AuthUser>>(ENDPOINTS.me);
    return response.data.data;
  },
};
