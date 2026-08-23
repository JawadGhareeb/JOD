import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope } from "@/src/types/api";
import type { GlobalSearchData, GlobalSearchMeta, GlobalSearchParams } from "./types";

export const searchApi = {
  search: async (params: GlobalSearchParams): Promise<{ data: GlobalSearchData; meta: GlobalSearchMeta }> => {
    const response = await apiClient.get<ApiEnvelope<GlobalSearchData, GlobalSearchMeta>>(`/search${buildQuery(params)}`);
    return { data: response.data.data, meta: response.data.meta };
  },
};
