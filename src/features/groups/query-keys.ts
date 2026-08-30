export const groupKeys = {
  all: ["groups"] as const,
  mine: () => [...groupKeys.all, "mine"] as const,
  suggested: () => [...groupKeys.all, "suggested"] as const,
  discover: () => [...groupKeys.all, "discover"] as const,
  detail: (groupId?: string) => [...groupKeys.all, "detail", groupId] as const,
  posts: (groupId?: string) => [...groupKeys.all, "posts", groupId] as const,
  recommendations: (groupId?: string) => [...groupKeys.all, "recommendations", groupId] as const,
  adminCandidates: (search: string) => [...groupKeys.all, "admin-candidates", search] as const,
};
