import { apiClient } from "./api-client";
import type { ApiEnvelope } from "@/src/types/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userType: string | null;
  status: string | null;
  organizationId: string | null;
  organization: unknown;
  createdAt: string | null;
  lastActiveAt: string | null;
}

export interface AuthSession {
  token: string;
  tokenType: string;
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

export interface ResetPasswordInput {
  login: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  password: string;
  password_confirmation: string;
}

const ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  forgotPassword: "/auth/forgot-password",
  verifyResetCode: "/auth/verify-reset-code",
  resetPassword: "/auth/reset-password",
  me: "/me",
  changePassword: "/me/change-password",
} as const;

/**
 * Thin wrappers over `apiClient` — no token persistence here. The caller
 * (a future auth provider / mutation hook) decides when to call
 * `setStoredToken` from `token-storage.ts` with the returned `token`.
 */
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

  changePassword: async (input: ChangePasswordInput): Promise<boolean> => {
    const response = await apiClient.patch<ApiEnvelope<{ passwordChanged: boolean }>>(
      ENDPOINTS.changePassword,
      input,
    );
    return response.data.data.passwordChanged;
  },
};
