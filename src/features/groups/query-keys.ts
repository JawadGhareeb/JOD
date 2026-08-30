export const groupKeys = {
  all: ["groups"] as const,
  mine: () => [...groupKeys.all, "mine"] as const,
  suggested: () => [...groupKeys.all, "suggested"] as const,
  discover: () => [...groupKeys.all, "discover"] as const,
  adminCandidates: (search: string) => [...groupKeys.all, "admin-candidates", search] as const,
};
