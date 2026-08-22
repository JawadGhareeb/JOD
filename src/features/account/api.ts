import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type { AuthUser } from "@/src/features/auth/types";
import type { ChangePasswordInput, UpdateProfileInput } from "./types";

const ENDPOINTS = {
  profile: "/me/profile",
  changePassword: "/me/change-password",
  permissions: "/me/permissions",
} as const;

export const accountApi = {
  updateProfile: async (input: UpdateProfileInput): Promise<AuthUser> => {
    const response = await apiClient.patch<ApiEnvelope<AuthUser>>(ENDPOINTS.profile, input);
    return response.data.data;
  },

  changePassword: async (input: ChangePasswordInput): Promise<boolean> => {
    const response = await apiClient.patch<ApiEnvelope<{ passwordChanged: boolean }>>(
      ENDPOINTS.changePassword,
      input,
    );
    return response.data.data.passwordChanged;
  },

  /** Entry shape is undocumented server-side (`items: {}` in the contract's
   * schema) — treat entries as opaque until there's a real example to type
   * them from. Don't build role-gated UI off this without confirming first. */
  getPermissions: async (): Promise<unknown[]> => {
    const response = await apiClient.get<ApiEnvelope<unknown[]>>(ENDPOINTS.permissions);
    return response.data.data;
  },
};
