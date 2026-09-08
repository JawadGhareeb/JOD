import { Platform } from "react-native";
import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type {
  AddGroupCommentInput,
  CreateGroupInput,
  Group,
  GroupComment,
  GroupCommentThread,
  GroupInvitation,
  GroupInviteCandidate,
  GroupMember,
  GroupPost,
  GroupPostStatus,
  GroupProfile,
  GroupRecommendation,
  MyGroupsScope,
  UpdateGroupInput,
} from "./types";

const ENDPOINTS = {
  groups: "/groups",
  suggested: "/groups/suggested",
  mine: "/me/groups",
  invitations: "/me/group-invitations",
  group: (id: string) => `/groups/${id}`,
  posts: (id: string) => `/groups/${id}/posts`,
  recommendations: (id: string) => `/groups/${id}/recommendations`,
  comments: (postId: string) => `/groups/posts/${postId}/comments`,
  join: (id: string) => `/groups/${id}/join`,
  postLike: (id: string) => `/groups/posts/${id}/like`,
  commentLike: (id: string) => `/groups/comments/${id}/like`,
  candidates: "/groups/user-candidates",
  invite: (id: string) => `/groups/${id}/invitations`,
  acceptInvite: (id: string) => `/group-invitations/${id}/accept`,
  declineInvite: (id: string) => `/group-invitations/${id}/decline`,
  member: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}`,
  approvePost: (groupId: string, postId: string) => `/groups/${groupId}/posts/${postId}/approve`,
  rejectPost: (groupId: string, postId: string) => `/groups/${groupId}/posts/${postId}/reject`,
  deletePost: (groupId: string, postId: string) => `/groups/${groupId}/posts/${postId}`,
  vote: (postId: string) => `/groups/posts/${postId}/poll/vote`,
  campaigns: (groupId: string) => `/groups/${groupId}/campaigns`,
  applications: (groupId: string) => `/groups/${groupId}/applications`,
  donations: (groupId: string) => `/groups/${groupId}/donations`,
} as const;

async function appendMedia(form: FormData, field: string, file: CreateGroupInput["image"]) {
  if (!file) return;
  if (Platform.OS === "web") {
    const blob = await fetch(file.uri).then((response) => response.blob());
    form.append(field, blob, file.name);
  } else {
    form.append(field, file as unknown as Blob);
  }
}

async function toGroupFormData(input: CreateGroupInput | UpdateGroupInput): Promise<FormData> {
  const form = new FormData();
  if (input.name !== undefined) form.append("name", input.name);
  if (input.description !== undefined) form.append("description", input.description);
  if (input.location !== undefined) form.append("location", input.location ?? "");
  if (input.purpose !== undefined) form.append("purpose", input.purpose);
  if (input.requiresPostApproval !== undefined) form.append("requiresPostApproval", input.requiresPostApproval ? "1" : "0");
  input.categories?.forEach((category, index) => form.append(`categories[${index}]`, category));
  input.rules?.forEach((rule, index) => form.append(`rules[${index}]`, rule));
  input.invitedUsers?.forEach((user, index) => form.append(`invitedUserIds[${index}]`, user.id));
  await appendMedia(form, "image", input.image ?? null);
  await appendMedia(form, "cover", input.cover ?? null);
  return form;
}

export const groupsApi = {
  getMine: async (scope: MyGroupsScope = "all") => {
    const response = await apiClient.get<ApiEnvelope<Group[]>>(ENDPOINTS.mine, { params: { scope } });
    return response.data.data;
  },
  getSuggested: async () => {
    const response = await apiClient.get<ApiEnvelope<Group[]>>(ENDPOINTS.suggested);
    return response.data.data;
  },
  getDiscover: async () => {
    const response = await apiClient.get<ApiEnvelope<Group[]>>(ENDPOINTS.groups);
    return response.data.data;
  },
  getGroup: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupProfile>>(ENDPOINTS.group(id));
    return response.data.data;
  },
  getMembers: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupMember[]>>(`/groups/${id}/members`);
    return response.data.data;
  },
  getPosts: async (id: string, status: GroupPostStatus = "published") => {
    const response = await apiClient.get<ApiEnvelope<GroupPost[]>>(ENDPOINTS.posts(id), { params: { status } });
    return response.data.data;
  },
  getRecommendations: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupRecommendation[]>>(ENDPOINTS.recommendations(id));
    return response.data.data;
  },
  getComments: async (postId: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupCommentThread[]>>(ENDPOINTS.comments(postId));
    return response.data.data;
  },
  getInvitations: async () => {
    const response = await apiClient.get<ApiEnvelope<GroupInvitation[]>>(ENDPOINTS.invitations);
    return response.data.data;
  },
  searchInviteCandidates: async (search: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupInviteCandidate[]>>(ENDPOINTS.candidates, { params: search.trim() ? { search: search.trim() } : undefined });
    return response.data.data;
  },
  searchAdminCandidates: async (search: string) => groupsApi.searchInviteCandidates(search),
  create: async (input: CreateGroupInput) => {
    const form = await toGroupFormData(input);
    const response = await apiClient.post<ApiEnvelope<GroupProfile>>(ENDPOINTS.groups, form);
    return response.data.data;
  },
  update: async (groupId: string, input: UpdateGroupInput) => {
    const form = await toGroupFormData(input);
    form.append("_method", "PATCH");
    const response = await apiClient.post<ApiEnvelope<GroupProfile>>(ENDPOINTS.group(groupId), form);
    return response.data.data;
  },
  delete: async (groupId: string) => apiClient.delete(ENDPOINTS.group(groupId)),
  join: async (id: string) => (await apiClient.post<ApiEnvelope<Group>>(ENDPOINTS.join(id))).data.data,
  leave: async (id: string) => (await apiClient.delete<ApiEnvelope<Group>>(ENDPOINTS.join(id))).data.data,
  invite: async (groupId: string, userIds: string[]) => (await apiClient.post<ApiEnvelope<GroupInvitation[]>>(ENDPOINTS.invite(groupId), { userIds })).data.data,
  acceptInvitation: async (id: string) => (await apiClient.post<ApiEnvelope<GroupInvitation>>(ENDPOINTS.acceptInvite(id))).data.data,
  declineInvitation: async (id: string) => (await apiClient.post<ApiEnvelope<GroupInvitation>>(ENDPOINTS.declineInvite(id))).data.data,
  removeMember: async (groupId: string, userId: string) => (await apiClient.delete<ApiEnvelope<GroupProfile>>(ENDPOINTS.member(groupId, userId))).data.data,
  createCampaign: async (groupId: string, input: { title: string; summary?: string | null; content?: string | null; categoryId?: string | null; location?: string | null; goalAmount: number; startDate?: string | null; endDate?: string | null; audience?: "general" | "students" }) => {
    const response = await apiClient.post<ApiEnvelope<{ id: string; title: string }>>(ENDPOINTS.campaigns(groupId), input);
    return response.data.data;
  },
  setPostLike: async (postId: string, liked: boolean) => {
    const response = liked ? await apiClient.post<ApiEnvelope<{ isLiked: boolean; likesCount: number }>>(ENDPOINTS.postLike(postId)) : await apiClient.delete<ApiEnvelope<{ isLiked: boolean; likesCount: number }>>(ENDPOINTS.postLike(postId));
    return response.data.data;
  },
  approvePost: async (groupId: string, postId: string) => (await apiClient.post<ApiEnvelope<GroupPost>>(ENDPOINTS.approvePost(groupId, postId))).data.data,
  rejectPost: async (groupId: string, postId: string, reason: string) => (await apiClient.post<ApiEnvelope<GroupPost>>(ENDPOINTS.rejectPost(groupId, postId), { reason })).data.data,
  deletePost: async (groupId: string, postId: string) => apiClient.delete(ENDPOINTS.deletePost(groupId, postId)),
  vote: async (postId: string, optionIds: string[]) => (await apiClient.post<ApiEnvelope<GroupPost>>(ENDPOINTS.vote(postId), { optionIds })).data.data,
  addComment: async (input: AddGroupCommentInput) => (await apiClient.post<ApiEnvelope<GroupComment>>(ENDPOINTS.comments(input.postId), { body: input.body, parentId: input.parentId })).data.data,
  setCommentLike: async (commentId: string, liked: boolean) => {
    const response = liked ? await apiClient.post<ApiEnvelope<{ isLiked: boolean; likesCount: number }>>(ENDPOINTS.commentLike(commentId)) : await apiClient.delete<ApiEnvelope<{ isLiked: boolean; likesCount: number }>>(ENDPOINTS.commentLike(commentId));
    return response.data.data;
  },
};
