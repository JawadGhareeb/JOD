import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { HelpOffer, HelpOfferInput, HelpOffersParams, HelpRequestStatus } from "./types";

export const helpOffersApi = {
  create: async (postId: string, input: HelpOfferInput) => { const response = await apiClient.post<ApiEnvelope<HelpOffer>>(`/posts/${postId}/help-offers`, input); return response.data.data; },
  list: async (params: HelpOffersParams = {}) => { const response = await apiClient.get<ApiEnvelope<HelpOffer[], PaginationMeta>>(`/me/help-offers${buildQuery(params)}`); return { items: response.data.data, meta: response.data.meta }; },
  detail: async (id: string) => { const response = await apiClient.get<ApiEnvelope<HelpOffer>>(`/me/help-offers/${id}`); return response.data.data; },
  accept: async (id: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/accept`)).data.data,
  reject: async (id: string, reason?: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/reject`, reason ? { reason } : {})).data.data,
  contact: async (id: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/contact`)).data.data,
  agree: async (id: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/agree`)).data.data,
  cancel: async (id: string, reason: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/cancel`, { reason })).data.data,
  confirmProvided: async (id: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/confirm-provided`)).data.data,
  confirmReceived: async (id: string) => (await apiClient.patch<ApiEnvelope<HelpOffer>>(`/help-offers/${id}/confirm-received`)).data.data,
  updateRequestStatus: async (postId: string, status: Extract<HelpRequestStatus, "open" | "fulfilled">) => (await apiClient.patch<ApiEnvelope<{ id: string; helpStatus: HelpRequestStatus }>>(`/posts/${postId}/help-status`, { status })).data.data,
};
