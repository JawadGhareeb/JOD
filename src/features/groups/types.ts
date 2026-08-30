export type GroupVisibility = "public" | "private";

/**
 * A user-created group is a *request* until a platform admin approves it, so it
 * never appears in discovery while pending.
 */
export type GroupStatus = "active" | "pending" | "rejected";

/**
 * The person who created the group is its `owner` — a single, non-transferable
 * role. `admin` is a delegated role the owner grants to others.
 */
export type GroupMemberRole = "owner" | "admin" | "moderator" | "member";

export const GROUP_ROLE_LABELS: Record<GroupMemberRole, string> = {
  owner: "المالك",
  admin: "مشرف",
  moderator: "مراقب",
  member: "عضو",
};

/** A user picked from the platform's account search, proposed as a group admin. */
export interface GroupAdminCandidate {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
}

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
  status: GroupStatus;
  /** Set when the platform admin rejects the creation request. */
  rejectionReason: string | null;
  /** The viewer's role in this group, or null when not a member. */
  myRole: GroupMemberRole | null;
}

/** Payload the create form submits. */
export interface CreateGroupInput {
  name: string;
  description: string;
  category: string;
  location: string;
  visibility: GroupVisibility;
  rules: string[];
  /** Reviewer-facing justification — not shown to members. */
  purpose: string;
  /**
   * Users proposed as admins, picked from account search. The creator is always
   * the owner and is never part of this list.
   */
  proposedAdmins: GroupAdminCandidate[];
}

export const GROUP_CATEGORIES = [
  "تطوع",
  "تعليم",
  "إغاثة",
  "صحة",
  "كفالات",
  "توظيف",
  "تمكين اقتصادي",
  "أخرى",
] as const;
