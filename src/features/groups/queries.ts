import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "./api";
import { groupKeys } from "./query-keys";
import type { AddGroupCommentInput, CreateGroupInput } from "./types";

export const useMyGroups = () => useQuery({ queryKey: groupKeys.mine(), queryFn: groupsApi.getMine });
export const useSuggestedGroups = () => useQuery({ queryKey: groupKeys.suggested(), queryFn: groupsApi.getSuggested });
export const useDiscoverGroups = () => useQuery({ queryKey: groupKeys.discover(), queryFn: groupsApi.getDiscover });

export const useAdminCandidates = (search: string, enabled = true) =>
  useQuery({
    queryKey: groupKeys.adminCandidates(search),
    queryFn: () => groupsApi.searchAdminCandidates(search),
    enabled,
    placeholderData: (previous) => previous,
  });

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: groupsApi.join, onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }) });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: groupsApi.leave, onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }) });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGroupInput) => groupsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export const useGroup = (groupId?: string) =>
  useQuery({ queryKey: groupKeys.detail(groupId), queryFn: () => groupsApi.getGroup(groupId!), enabled: Boolean(groupId) });

export const useGroupPosts = (groupId?: string, enabled = true) =>
  useQuery({ queryKey: groupKeys.posts(groupId), queryFn: () => groupsApi.getPosts(groupId!), enabled: Boolean(groupId) && enabled });

export const useGroupRecommendations = (groupId?: string, enabled = true) =>
  useQuery({ queryKey: groupKeys.recommendations(groupId), queryFn: () => groupsApi.getRecommendations(groupId!), enabled: Boolean(groupId) && enabled });

export const useGroupComments = (postId?: string, enabled = true) =>
  useQuery({ queryKey: groupKeys.comments(postId), queryFn: () => groupsApi.getComments(postId!), enabled: Boolean(postId) && enabled });

export function useAddGroupComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddGroupCommentInput) => groupsApi.addComment(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

export function useToggleGroupCommentLike(postId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, liked }: { commentId: string; liked: boolean }) => groupsApi.setCommentLike(commentId, liked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.comments(postId) }),
  });
}
