import type { PublicMediaParams } from "./types";

export const mediaKeys = {
  publicAll: ["public-media"] as const,
  publicList: (params: Omit<PublicMediaParams, "page"> = {}) =>
    [...mediaKeys.publicAll, "list", params] as const,
  publicDetail: (id: string) => [...mediaKeys.publicAll, "detail", id] as const,
  organizationVideos: (organizationId: string, params: Omit<PublicMediaParams, "page" | "search"> = {}) =>
    ["organization", organizationId, "videos", params] as const,
};
