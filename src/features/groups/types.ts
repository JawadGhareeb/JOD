export type GroupVisibility = "public" | "private";

/**
 * Shaped to match what the API is expected to return, so swapping the mock for a
 * real endpoint should only touch the data source — not the components.
 */
export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  visibility: GroupVisibility;
  membersCount: number;
  /** Activity hint shown on cards — posts published in the last 7 days. */
  postsThisWeek: number;
  isMember: boolean;
  /** Set when the group is run by a verified organization. */
  organizationName: string | null;
  isVerifiedOrganization: boolean;
  /** Shown for acknowledgement before joining. Moderators rely on this record. */
  rules: string[];
}
