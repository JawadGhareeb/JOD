import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type {
  MediaEngagementState,
  MediaReportResult,
  PublicMediaItem,
  PublicMediaParams,
} from "./types";
import type { ReportReasonCode } from "@/src/features/lookups/types";
import { normalizePublicMediaItem } from "./helpers";

export const mediaApi = {
  publicList: async (params: PublicMediaParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<PublicMediaItem[], PaginationMeta>>(
      `/discovery/media${buildQuery(params)}`,
    );
    return { items: response.data.data.map(normalizePublicMediaItem), meta: response.data.meta };
  },
  publicDetail: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<PublicMediaItem>>(`/discovery/media/${id}`);
    return normalizePublicMediaItem(response.data.data);
  },
  organizationVideos: async (organizationId: string, params: PublicMediaParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<PublicMediaItem[], PaginationMeta>>(
      `/discovery/organizations/${organizationId}/videos${buildQuery(params)}`,
    );
    return { items: response.data.data.map(normalizePublicMediaItem), meta: response.data.meta };
  },
  like: async (id: string) => {
    const response = await apiClient.post<ApiEnvelope<MediaEngagementState>>(`/media/${id}/like`);
    return response.data.data;
  },
  unlike: async (id: string) => {
    const response = await apiClient.delete<ApiEnvelope<MediaEngagementState>>(`/media/${id}/like`);
    return response.data.data;
  },
  save: async (id: string) => {
    const response = await apiClient.post<ApiEnvelope<MediaEngagementState>>(`/media/${id}/save`);
    return response.data.data;
  },
  unsave: async (id: string) => {
    const response = await apiClient.delete<ApiEnvelope<MediaEngagementState>>(`/media/${id}/save`);
    return response.data.data;
  },
  report: async (id: string, input: { reason: ReportReasonCode; details?: string }) => {
    const response = await apiClient.post<ApiEnvelope<MediaReportResult>>(`/media/${id}/reports`, input);
    return response.data.data;
  },
};
