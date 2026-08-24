import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { mediaApi } from "./api";
import { mediaKeys } from "./query-keys";
import type { PublicMediaParams } from "./types";

export function usePublicMedia(params: Omit<PublicMediaParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: mediaKeys.publicList(params),
    queryFn: ({ pageParam }) => mediaApi.listPublic({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
  });
}

export function usePublicMediaItem(id?: string) {
  return useQuery({
    queryKey: mediaKeys.publicDetail(id ?? ""),
    queryFn: () => mediaApi.getPublic(id!),
    enabled: Boolean(id),
  });
}

export function useOrganizationVideos(
  organizationId?: string,
  params: Omit<PublicMediaParams, "page" | "search"> = {},
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: mediaKeys.organizationVideos(organizationId ?? "", params),
    queryFn: ({ pageParam }) =>
      mediaApi.listOrganizationVideos(organizationId!, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
    enabled: Boolean(organizationId) && enabled,
  });
}
