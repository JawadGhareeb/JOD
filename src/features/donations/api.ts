import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { Donation, DonationInput, DonationParams } from "./types";
export const donationsApi = {
  donate: async (campaignId: string, input: DonationInput) => { const response = await apiClient.post<ApiEnvelope<Donation>>(`/campaigns/${campaignId}/donations`, input); return response.data.data; },
  list: async (params: DonationParams = {}) => { const response = await apiClient.get<ApiEnvelope<Donation[], PaginationMeta>>(`/me/donations${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  detail: async (id: string) => { const response = await apiClient.get<ApiEnvelope<Donation>>(`/me/donations/${id}`); return response.data.data; },
};
