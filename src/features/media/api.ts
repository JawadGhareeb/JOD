import { apiClient } from "@/src/lib/api-client";
import { getApiRootUrl } from "@/src/lib/env";
import type { MediaItem, MediaModel, MediaProp, MediaUploadFile } from "./types";

type MediaResponse = { data: MediaItem };

const target = (model: MediaModel, modelId: string, prop: MediaProp) =>
  `${getApiRootUrl()}/api/v1/media/${model}/${modelId}/${prop}`;

const toFormData = (file: MediaUploadFile) => {
  const form = new FormData();
  form.append("file", file as unknown as Blob);
  return form;
};

export const mediaApi = {
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
