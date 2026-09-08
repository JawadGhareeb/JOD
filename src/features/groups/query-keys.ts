import type { GroupPostStatus, MyGroupsScope } from "./types";

export const groupKeys = {
  all: ["groups"] as const,
  mine: (scope: MyGroupsScope = "all") => [...groupKeys.all, "mine", scope] as const,
  invitations: () => [...groupKeys.all, "invitations"] as const,
  suggested: () => [...groupKeys.all, "suggested"] as const,
  discover: () => [...groupKeys.all, "discover"] as const,
  detail: (groupId?: string) => [...groupKeys.all, "detail", groupId] as const,
  members: (groupId?: string) => [...groupKeys.all, "members", groupId] as const,
  posts: (groupId?: string, status: GroupPostStatus = "published") => [...groupKeys.all, "posts", groupId, status] as const,
  recommendations: (groupId?: string) => [...groupKeys.all, "recommendations", groupId] as const,
  comments: (postId?: string) => [...groupKeys.all, "comments", postId] as const,
  candidates: (search: string) => [...groupKeys.all, "candidates", search] as const,
  adminCandidates: (search: string) => [...groupKeys.all, "candidates", search] as const,
};
