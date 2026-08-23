import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { ApplicationsParams, CampaignApplication, CampaignApplicationInput } from "./types";
export const applicationsApi = {
  apply: async (campaignId: string, input: CampaignApplicationInput) => {
    const response = await apiClient.post<ApiEnvelope<CampaignApplication>>(`/campaigns/${campaignId}/applications`, input);
    return response.data.data;
  },
  list: async (params: ApplicationsParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<CampaignApplication[], PaginationMeta>>(`/me/applications${buildQuery(params)}`);
    return { items: response.data.data, meta: response.data.meta };
  },
  detail: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<CampaignApplication>>(`/me/applications/${id}`);
    return response.data.data;
  },
  withdraw: async (id: string) => {
    const response = await apiClient.delete<ApiEnvelope<CampaignApplication>>(`/me/applications/${id}`);
    return response.data.data;
  },
};
