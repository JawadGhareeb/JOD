import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { ArticleParams, MobileArticle } from "./types";
export const articlesApi = {
  list: async (params: ArticleParams = {}) => {
    const response = await apiClient.get<ApiEnvelope<MobileArticle[], PaginationMeta>>(`/discovery/articles${buildQuery(params)}`);
    return { items: response.data.data, meta: response.data.meta };
  },
  detail: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<MobileArticle>>(`/discovery/articles/${id}`);
    return response.data.data;
  },
};
