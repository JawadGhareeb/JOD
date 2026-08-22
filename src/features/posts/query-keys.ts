export const postsKeys = {
  feed: () => ["posts", "feed"] as const,
  detail: (postId?: string) => ["posts", "detail", postId] as const,
  campaign: (campaignId?: string | null) => ["posts", "campaign", campaignId] as const,
  byOrganization: (organizationId?: string) => ["posts", "byOrganization", organizationId] as const,
  mine: () => ["posts", "mine"] as const,
  saved: () => ["posts", "saved"] as const,
};
