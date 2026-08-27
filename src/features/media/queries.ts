import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "./api";
import { mediaKeys } from "./query-keys";
import type { PublicMediaParams } from "./types";
import type { ReportReasonCode } from "@/src/features/lookups/types";

export function usePublicMedia(params: Omit<PublicMediaParams, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: mediaKeys.publicList(params),
    queryFn: ({ pageParam }) => mediaApi.publicList({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta?.currentPage ?? 1;
      const last = lastPage.meta?.lastPage ?? current;
      return current < last ? current + 1 : undefined;
    },
  });
}

export function usePublicMediaItem(id: string, enabled = true) {
  return useQuery({
    queryKey: mediaKeys.publicDetail(id),
    queryFn: () => mediaApi.publicDetail(id),
    enabled: enabled && Boolean(id),
  });
}

export function useOrganizationVideos(
  organizationId: string,
  params: Omit<PublicMediaParams, "page" | "search"> = {},
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: mediaKeys.organizationVideos(organizationId, params),
    queryFn: ({ pageParam }) => mediaApi.organizationVideos(organizationId, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta?.currentPage ?? 1;
      const last = lastPage.meta?.lastPage ?? current;
      return current < last ? current + 1 : undefined;
    },
    enabled: enabled && Boolean(organizationId),
  });
}

function useInvalidateMedia() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: mediaKeys.publicAll });
}

export function useLikeMedia() {
  const invalidate = useInvalidateMedia();
  return useMutation({
    mutationFn: ({ mediaId, like }: { mediaId: string; like: boolean }) =>
      like ? mediaApi.like(mediaId) : mediaApi.unlike(mediaId),
    onSettled: invalidate,
  });
}

export function useSaveMedia() {
  const invalidate = useInvalidateMedia();
  return useMutation({
    mutationFn: ({ mediaId, save }: { mediaId: string; save: boolean }) =>
      save ? mediaApi.save(mediaId) : mediaApi.unsave(mediaId),
    onSettled: invalidate,
  });
}

export function useReportMedia() {
  return useMutation({
    mutationFn: ({ mediaId, reason, details }: { mediaId: string; reason: ReportReasonCode; details?: string }) =>
      mediaApi.report(mediaId, { reason, details }),
  });
}
