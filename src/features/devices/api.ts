import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type { MobileDevice, MobileDeviceInput } from "./types";
export const devicesApi = {
  upsert: async (input: MobileDeviceInput) => { const response = await apiClient.put<ApiEnvelope<MobileDevice>>("/me/devices", input); return response.data.data; },
  remove: async (id: string) => { await apiClient.delete(`/me/devices/${id}`); },
};
