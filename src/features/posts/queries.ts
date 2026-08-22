import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "./api";
import { postsKeys } from "./query-keys";
import type { PostInput } from "./types";

const FEED_PAGE_SIZE = 10;
// No dedicated "posts by organization" page size is documented — a single
// generous page keeps the author-profile screen simple until it needs its
// own pagination.
const ORGANIZATION_POSTS_PAGE_SIZE = 50;
// /me/posts caps at perPage 100 — a personal post list is unlikely to need
// real pagination yet, so this fetches it in one page.
const MY_POSTS_PAGE_SIZE = 100;

export function usePostsFeed() {
  return useInfiniteQuery({
    queryKey: postsKeys.feed(),
    queryFn: ({ pageParam }) => postsApi.getFeed({ page: pageParam, perPage: FEED_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.currentPage < lastPage.meta.lastPage
        ? lastPage.meta.currentPage + 1
        : undefined,
  });
}

export function usePostsByOrganization(organizationId?: string) {
  return useQuery({
    queryKey: postsKeys.byOrganization(organizationId),
    queryFn: () =>
      postsApi.getFeed({ organizationId, perPage: ORGANIZATION_POSTS_PAGE_SIZE }),
    enabled: Boolean(organizationId),
  });
}

export function usePost(postId?: string) {
  return useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => postsApi.getPost(postId!),
    enabled: Boolean(postId),
  });
}

export function useCampaign(campaignId?: string | null) {
  return useQuery({
    queryKey: postsKeys.campaign(campaignId),
    queryFn: () => postsApi.getCampaign(campaignId!),
    enabled: Boolean(campaignId),
  });
}

export function useMyPosts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: postsKeys.mine(),
    queryFn: () => postsApi.getMyPosts({ perPage: MY_POSTS_PAGE_SIZE }),
    enabled: options?.enabled ?? true,
  });
}

export function useSavedPosts() {
  return useQuery({
    queryKey: postsKeys.saved(),
    queryFn: () => postsApi.getSavedPosts(),
  });
}

export function useCreatePost() {
  return useMutation({
    mutationFn: (input: PostInput) => postsApi.create(input),
  });
}

export function useUpdatePost() {
  return useMutation({
    mutationFn: ({ postId, input }: { postId: string; input: PostInput }) =>
      postsApi.update(postId, input),
  });
}

export function useSubmitPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.submit(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.mine() });
    },
  });
}

export function useArchivePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.archive(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.mine() });
    },
  });
}

export function useRepostPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.repost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.mine() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.mine() });
    },
  });
}

export function useLikePost() {
  return useMutation({
    mutationFn: ({ postId, like }: { postId: string; like: boolean }) =>
      like ? postsApi.like(postId) : postsApi.unlike(postId),
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, save }: { postId: string; save: boolean }) =>
      save ? postsApi.save(postId) : postsApi.unsave(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsKeys.saved() });
    },
  });
}

export function useReportPost() {
  return useMutation({
    mutationFn: ({
      postId,
      reason,
      details,
    }: {
      postId: string;
      reason: string;
      details?: string;
    }) => postsApi.report(postId, reason, details),
  });
}
