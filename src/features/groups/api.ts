import { Platform } from "react-native";
import { apiClient } from "@/src/lib/api-client";
import type { ApiEnvelope } from "@/src/types/api";
import type {
  AddGroupCommentInput,
  CreateGroupInput,
  Group,
  GroupAdminCandidate,
  GroupComment,
  GroupCommentThread,
  GroupPost,
  GroupProfile,
  GroupRecommendation,
} from "./types";

const ENDPOINTS = {
  groups: "/groups",
  suggested: "/groups/suggested",
  mine: "/me/groups",
  group: (id: string) => `/groups/${id}`,
  posts: (id: string) => `/groups/${id}/posts`,
  recommendations: (id: string) => `/groups/${id}/recommendations`,
  comments: (postId: string) => `/groups/posts/${postId}/comments`,
  join: (id: string) => `/groups/${id}/join`,
  commentLike: (id: string) => `/groups/comments/${id}/like`,
  adminCandidates: "/groups/admin-candidates",
} as const;

async function toCreateGroupFormData(input: CreateGroupInput): Promise<FormData> {
  const form = new FormData();
  form.append("name", input.name);
  form.append("description", input.description);
  form.append("category", input.category);
  form.append("location", input.location);
  form.append("purpose", input.purpose);
  input.rules.forEach((rule, index) => form.append(`rules[${index}]`, rule));
  input.proposedAdmins.forEach((admin, index) => form.append(`proposedAdminIds[${index}]`, admin.id));

  if (input.image) {
    if (Platform.OS === "web") {
      const blob = await fetch(input.image.uri).then((response) => response.blob());
      form.append("image", blob, input.image.name);
    } else {
      form.append("image", input.image as unknown as Blob);
    }
  }

  return form;
}

export const groupsApi = {
  getMine: async () => {
    const response = await apiClient.get<ApiEnvelope<Group[]>>(ENDPOINTS.mine);
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
  getPosts: async (id: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupPost[]>>(ENDPOINTS.posts(id));
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
  searchAdminCandidates: async (search: string) => {
    const response = await apiClient.get<ApiEnvelope<GroupAdminCandidate[]>>(ENDPOINTS.adminCandidates, {
      params: search.trim() ? { search: search.trim() } : undefined,
    });
    return response.data.data;
  },
  create: async (input: CreateGroupInput) => {
    const form = await toCreateGroupFormData(input);
    const response = await apiClient.post<ApiEnvelope<GroupProfile>>(ENDPOINTS.groups, form);
    return response.data.data;
  },
  join: async (id: string) => {
    const response = await apiClient.post<ApiEnvelope<Group>>(ENDPOINTS.join(id));
    return response.data.data;
  },
  leave: async (id: string) => {
    const response = await apiClient.delete<ApiEnvelope<Group>>(ENDPOINTS.join(id));
    return response.data.data;
  },
  addComment: async (input: AddGroupCommentInput) => {
    const response = await apiClient.post<ApiEnvelope<GroupComment>>(ENDPOINTS.comments(input.postId), {
      body: input.body,
      parentId: input.parentId,
    });
    return response.data.data;
  },
  setCommentLike: async (commentId: string, liked: boolean) => {
    const response = liked
      ? await apiClient.post<ApiEnvelope<{ isLiked: boolean; likesCount: number }>>(ENDPOINTS.commentLike(commentId))
      : await apiClient.delete<ApiEnvelope<{ isLiked: boolean; likesCount: number }>>(ENDPOINTS.commentLike(commentId));
    return response.data.data;
  },
};
