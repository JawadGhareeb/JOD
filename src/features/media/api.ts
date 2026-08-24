import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import { getApiRootUrl } from "@/src/lib/env";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type {
  MediaItem,
  MediaModel,
  MediaProp,
  MediaUploadFile,
  PublicMediaItem,
  PublicMediaParams,
} from "./types";

type MediaResponse = { data: MediaItem };

const target = (model: MediaModel, modelId: string, prop: MediaProp) =>
  `${getApiRootUrl()}/api/v1/media/${model}/${modelId}/${prop}`;

const toFormData = (file: MediaUploadFile) => {
  const form = new FormData();
  form.append("file", file as unknown as Blob);
  return form;
};

export const mediaApi = {
  listPublic: async (params: PublicMediaParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<PublicMediaItem[], PaginationMeta>>(
      `/discovery/media${buildQuery(params)}`,
    );
    return { items: response.data.data, meta: response.data.meta };
  },

  getPublic: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<PublicMediaItem>>(`/discovery/media/${id}`);
    return response.data.data;
  },

  listOrganizationVideos: async (
    organizationId: string,
    params: Omit<PublicMediaParams, "search"> = {},
  ) => {
    const response = await apiClient.get<ApiEnvelope<PublicMediaItem[], PaginationMeta>>(
      `/discovery/organizations/${organizationId}/videos${buildQuery(params)}`,
    );
    return { items: response.data.data, meta: response.data.meta };
  },

  upload: async (model: MediaModel, modelId: string, prop: MediaProp, file: MediaUploadFile) => {
    const response = await apiClient.post<MediaResponse>(target(model, modelId, prop), toFormData(file));
    return response.data.data;
  },

  replace: async (
    model: MediaModel,
    modelId: string,
    prop: MediaProp,
    mediaId: string,
    file: MediaUploadFile,
  ) => {
    const response = await apiClient.post<MediaResponse>(
      `${target(model, modelId, prop)}/${mediaId}/replace`,
      toFormData(file),
    );
    return response.data.data;
  },

  remove: async (model: MediaModel, modelId: string, prop: MediaProp, mediaId: string) => {
    await apiClient.delete(`${target(model, modelId, prop)}/${mediaId}`);
  },
};
