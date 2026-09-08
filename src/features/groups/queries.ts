import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "./api";
import { groupKeys } from "./query-keys";
import type { AddGroupCommentInput, CreateGroupInput, GroupPostStatus, MyGroupsScope, UpdateGroupInput } from "./types";

const invalidateGroups = (queryClient: ReturnType<typeof useQueryClient>, groupId?: string) => {
  queryClient.invalidateQueries({ queryKey: groupKeys.all });
  if (groupId) queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) });
};

export const useMyGroups = (scope: MyGroupsScope = "all") => useQuery({ queryKey: groupKeys.mine(scope), queryFn: () => groupsApi.getMine(scope) });
export const useGroupInvitations = () => useQuery({ queryKey: groupKeys.invitations(), queryFn: groupsApi.getInvitations });
export const useSuggestedGroups = () => useQuery({ queryKey: groupKeys.suggested(), queryFn: groupsApi.getSuggested });
export const useDiscoverGroups = () => useQuery({ queryKey: groupKeys.discover(), queryFn: groupsApi.getDiscover });
export const useGroup = (id?: string) => useQuery({ queryKey: groupKeys.detail(id), queryFn: () => groupsApi.getGroup(id!), enabled: Boolean(id) });
export const useGroupMembers = (id?: string) => useQuery({ queryKey: groupKeys.members(id), queryFn: () => groupsApi.getMembers(id!), enabled: Boolean(id) });
export const useGroupPosts = (id?: string, status: GroupPostStatus = "published") => useQuery({ queryKey: groupKeys.posts(id, status), queryFn: () => groupsApi.getPosts(id!, status), enabled: Boolean(id) });
export const useGroupRecommendations = (id?: string) => useQuery({ queryKey: groupKeys.recommendations(id), queryFn: () => groupsApi.getRecommendations(id!), enabled: Boolean(id) });
export const useGroupComments = (postId?: string, enabled = true) => useQuery({ queryKey: groupKeys.comments(postId), queryFn: () => groupsApi.getComments(postId!), enabled: enabled && Boolean(postId) });
export const useAdminCandidates = (search: string, enabled = true) => useQuery({ queryKey: groupKeys.candidates(search), queryFn: () => groupsApi.searchInviteCandidates(search), enabled: enabled && search.trim().length >= 1 });
export const useGroupInviteCandidates = useAdminCandidates;

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (input: CreateGroupInput) => groupsApi.create(input), onSuccess: () => invalidateGroups(qc) });
}
export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ groupId, input }: { groupId: string; input: UpdateGroupInput }) => groupsApi.update(groupId, input), onSuccess: (_data, vars) => invalidateGroups(qc, vars.groupId) });
}
export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (groupId: string) => groupsApi.delete(groupId), onSuccess: () => invalidateGroups(qc) });
}
export function useJoinGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groupsApi.join, onSuccess: (_data, id) => invalidateGroups(qc, id) });
}
export function useLeaveGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: groupsApi.leave, onSuccess: (_data, id) => invalidateGroups(qc, id) });
}
export function useInviteGroupUsers() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ groupId, userIds }: { groupId: string; userIds: string[] }) => groupsApi.invite(groupId, userIds), onSuccess: (_data, vars) => invalidateGroups(qc, vars.groupId) });
}
export function useRespondGroupInvitation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, accept }: { id: string; accept: boolean }) => accept ? groupsApi.acceptInvitation(id) : groupsApi.declineInvitation(id), onSuccess: () => invalidateGroups(qc) });
}
export function useRemoveGroupMember() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => groupsApi.removeMember(groupId, userId), onSuccess: (_data, vars) => invalidateGroups(qc, vars.groupId) });
}
export function useToggleGroupPostLike() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ postId, liked }: { postId: string; liked: boolean }) => groupsApi.setPostLike(postId, liked), onSettled: () => qc.invalidateQueries({ queryKey: groupKeys.all }) });
}
export function useApproveGroupPost() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ groupId, postId }: { groupId: string; postId: string }) => groupsApi.approvePost(groupId, postId), onSuccess: (_data, vars) => invalidateGroups(qc, vars.groupId) });
}
export function useRejectGroupPost() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ groupId, postId, reason }: { groupId: string; postId: string; reason: string }) => groupsApi.rejectPost(groupId, postId, reason), onSuccess: (_data, vars) => invalidateGroups(qc, vars.groupId) });
}
export function useDeleteGroupPost() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ groupId, postId }: { groupId: string; postId: string }) => groupsApi.deletePost(groupId, postId), onSuccess: (_data, vars) => invalidateGroups(qc, vars.groupId) });
}
export function useVoteGroupPoll() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ postId, optionIds }: { postId: string; optionIds: string[] }) => groupsApi.vote(postId, optionIds), onSuccess: () => qc.invalidateQueries({ queryKey: groupKeys.all }) });
}
export function useAddGroupComment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (input: AddGroupCommentInput) => groupsApi.addComment(input), onSuccess: (_data, input) => qc.invalidateQueries({ queryKey: groupKeys.comments(input.postId) }) });
}
export function useToggleGroupCommentLike(postId?: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ commentId, liked }: { commentId: string; liked: boolean; postId?: string }) => groupsApi.setCommentLike(commentId, liked), onSettled: (_data, _error, vars) => qc.invalidateQueries({ queryKey: groupKeys.comments(vars.postId ?? postId) }) });
}
