import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "./api";
import { postKeys } from "./query-keys";
import { authKeys } from "@/src/features/auth/query-keys";
import { mediaApi } from "@/src/features/media/api";
import type { CreatePostInput, GetDiscoveryPostsParams, GetMyPostsParams, MobileImageFile, UpdatePostInput } from "./types";

const invalidatePostLifecycle = (qc: ReturnType<typeof useQueryClient>, postId?: string) => {
  qc.invalidateQueries({ queryKey: postKeys.mineLists() });
  qc.invalidateQueries({ queryKey: postKeys.feeds() });
  if (postId) {
    qc.invalidateQueries({ queryKey: postKeys.detail(postId) });
    qc.invalidateQueries({ queryKey: postKeys.myDetail(postId) });
  }
};

export function usePostsFeed(filters: Omit<GetDiscoveryPostsParams, "page" | "perPage"> = {}) {
  return useInfiniteQuery({ queryKey: postKeys.feed(filters), queryFn: ({ pageParam }) => postsApi.getFeed({ ...filters, page: pageParam, perPage: 10 }), initialPageParam: 1, getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined });
}
export function usePostsByOrganization(organizationId?: string) { return useQuery({ queryKey: postKeys.publisherPosts(organizationId, { perPage: 50 }), queryFn: () => postsApi.getPublisherPosts(organizationId!, { perPage: 50 }), enabled: Boolean(organizationId) }); }
export function usePublisher(id?: string) { return useQuery({ queryKey: postKeys.publisher(id), queryFn: () => postsApi.getPublisher(id!), enabled: Boolean(id) }); }
export function usePublisherPosts(id?: string, filters: Omit<GetDiscoveryPostsParams, "page"> = {}) { return useInfiniteQuery({ queryKey: postKeys.publisherPosts(id, filters), queryFn: ({ pageParam }) => postsApi.getPublisherPosts(id!, { ...filters, page: pageParam, perPage: filters.perPage ?? 20 }), initialPageParam: 1, enabled: Boolean(id), getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined }); }
export function usePost(id?: string) { return useQuery({ queryKey: postKeys.detail(id), queryFn: () => postsApi.getPost(id!), enabled: Boolean(id) }); }
export function useCampaign(id?: string | null) { return useQuery({ queryKey: postKeys.campaign(id), queryFn: () => postsApi.getCampaign(id!), enabled: Boolean(id) }); }
export function useCategories(params = {}) { return useQuery({ queryKey: postKeys.categories(params), queryFn: () => postsApi.getCategories({ perPage: 100, ...(params as object) }) }); }
export function useMyPosts(options?: { enabled?: boolean; params?: GetMyPostsParams }) { const params = options?.params ?? { perPage: 100 }; return useQuery({ queryKey: postKeys.mine(params), queryFn: () => postsApi.getMyPosts(params), enabled: options?.enabled ?? true }); }
export function useMyPost(id?: string) { return useQuery({ queryKey: postKeys.myDetail(id), queryFn: () => postsApi.getMyPost(id!), enabled: Boolean(id) }); }
export function useSavedPosts() { return useInfiniteQuery({ queryKey: postKeys.saved(), queryFn: ({ pageParam }) => postsApi.getSavedPosts({ page: pageParam, perPage: 20 }), initialPageParam: 1, getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined }); }

export function useCreatePost() { const qc = useQueryClient(); return useMutation({ mutationFn: (input: CreatePostInput) => postsApi.create(input), onSuccess: (data) => { invalidatePostLifecycle(qc, data.id); qc.invalidateQueries({ queryKey: authKeys.session() }); } }); }
export function useUpdatePost() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, input }: { postId: string; input: UpdatePostInput }) => postsApi.update(postId, input), onSuccess: (data) => invalidatePostLifecycle(qc, data.id) }); }
export function useSubmitPost() { const qc = useQueryClient(); return useMutation({ mutationFn: postsApi.submit, onSuccess: (data) => invalidatePostLifecycle(qc, data.id) }); }
export function useArchivePost() { const qc = useQueryClient(); return useMutation({ mutationFn: postsApi.archive, onSuccess: (data) => invalidatePostLifecycle(qc, data.id) }); }
export function useRepostPost() { const qc = useQueryClient(); return useMutation({ mutationFn: postsApi.repost, onSuccess: (data) => invalidatePostLifecycle(qc, data.id) }); }
export function useDeletePost() { const qc = useQueryClient(); return useMutation({ mutationFn: postsApi.delete, onSuccess: (_data, id) => { invalidatePostLifecycle(qc, id); qc.invalidateQueries({ queryKey: authKeys.session() }); } }); }
export function useUploadPostImage() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, image }: { postId: string; image: MobileImageFile }) => mediaApi.upload("post", postId, "images", image), onSuccess: (_data, variables) => invalidatePostLifecycle(qc, variables.postId) }); }
export function useReplacePostImage() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ postId, imageId, image }: { postId: string; imageId: string; image: MobileImageFile }) => { await mediaApi.replace("post", postId, "images", imageId, image); return postsApi.getMyPost(postId); }, onSuccess: (data) => invalidatePostLifecycle(qc, data.id) }); }
export function useDeletePostImage() { const qc = useQueryClient(); return useMutation({ mutationFn: async ({ postId, imageId }: { postId: string; imageId: string }) => { await mediaApi.remove("post", postId, "images", imageId); return postsApi.getMyPost(postId); }, onSuccess: (data) => invalidatePostLifecycle(qc, data.id) }); }
export function useLikePost() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, like }: { postId: string; like: boolean }) => like ? postsApi.like(postId) : postsApi.unlike(postId), onSettled: (_data, _error, variables) => { qc.invalidateQueries({ queryKey: postKeys.feeds() }); qc.invalidateQueries({ queryKey: postKeys.detail(variables.postId) }); } }); }
export function useSavePost() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, save }: { postId: string; save: boolean }) => save ? postsApi.save(postId) : postsApi.unsave(postId), onSettled: (_data, _error, variables) => { qc.invalidateQueries({ queryKey: postKeys.feeds() }); qc.invalidateQueries({ queryKey: postKeys.detail(variables.postId) }); qc.invalidateQueries({ queryKey: postKeys.savedLists() }); qc.invalidateQueries({ queryKey: authKeys.session() }); } }); }
export function useReportPost() { return useMutation({ mutationFn: ({ postId, reason, details }: { postId: string; reason: string; details?: string }) => postsApi.report(postId, reason, details) }); }
