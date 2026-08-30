import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsMockStore } from "./mock-store";
import { groupKeys } from "./query-keys";
import type { AddGroupCommentInput, CreateGroupInput } from "./types";

// TODO: swap `groupsMockStore` for the real groups API. Nothing outside this
// file should need to change when that happens.

export const useMyGroups = () =>
  useQuery({ queryKey: groupKeys.mine(), queryFn: groupsMockStore.myGroups });

export const useSuggestedGroups = () =>
  useQuery({ queryKey: groupKeys.suggested(), queryFn: groupsMockStore.suggested });

export const useDiscoverGroups = () =>
  useQuery({ queryKey: groupKeys.discover(), queryFn: groupsMockStore.discover });

/** Account search for the admins picker. Swap for the real endpoint later. */
export const useAdminCandidates = (search: string, enabled = true) =>
  useQuery({
    queryKey: groupKeys.adminCandidates(search),
    queryFn: () => groupsMockStore.searchAdminCandidates(search),
    enabled,
    placeholderData: (previous) => previous,
  });

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupsMockStore.join(groupId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupsMockStore.leave(groupId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGroupInput) => groupsMockStore.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

/** Group profile detail. Resolves to `null` when the id is unknown. */
export const useGroup = (groupId?: string) =>
  useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => groupsMockStore.getById(groupId!),
    enabled: Boolean(groupId),
  });

/** The group's own feed. Gated by `enabled` so private groups skip the fetch. */
export const useGroupPosts = (groupId?: string, enabled = true) =>
  useQuery({
    queryKey: groupKeys.posts(groupId),
    queryFn: () => groupsMockStore.posts(groupId!),
    enabled: Boolean(groupId) && enabled,
  });

/** Content recommended from the group's own category and location. */
export const useGroupRecommendations = (groupId?: string, enabled = true) =>
  useQuery({
    queryKey: groupKeys.recommendations(groupId),
    queryFn: () => groupsMockStore.recommendations(groupId!),
    enabled: Boolean(groupId) && enabled,
  });

/** Comment threads on a group post. */
export const useGroupComments = (postId?: string, enabled = true) =>
  useQuery({
    queryKey: groupKeys.comments(postId),
    queryFn: () => groupsMockStore.comments(postId!),
    enabled: Boolean(postId) && enabled,
  });

/** Posts a comment or a reply, then refreshes the thread and the post counter. */
export function useAddGroupComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddGroupCommentInput) => groupsMockStore.addComment(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

export function useToggleGroupCommentLike(postId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => groupsMockStore.toggleCommentLike(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.comments(postId) }),
  });
}
