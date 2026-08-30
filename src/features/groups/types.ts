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
  /** Square group picture. `null` falls back to the first letter of the name. */
  imageUrl: string | null;
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

/** A member row rendered on the group profile. */
export interface GroupMember extends GroupAdminCandidate {
  role: GroupMemberRole;
}

/**
 * Everything the profile screen needs on top of the card-level `Group`. Kept as
 * a separate type so list endpoints stay cheap and only the detail view pays for
 * members and counters.
 */
export interface GroupProfile extends Group {
  /** Wide banner behind the header. `null` renders the tinted placeholder. */
  coverImageUrl: string | null;
  /** Pre-formatted on purpose — the mock has no real timestamps to format. */
  createdAtLabel: string;
  postsCount: number;
  owner: GroupMember;
  /** Owner excluded — it is carried separately above. */
  admins: GroupMember[];
  /** A short slice of the membership, for the avatar row. */
  membersPreview: GroupMember[];
}

/** A post published inside a group. */
export interface GroupPost {
  id: string;
  groupId: string;
  author: GroupMember;
  body: string;
  createdAtLabel: string;
  likesCount: number;
  commentsCount: number;
}

/**
 * What a recommendation points at. `group` rows are navigable; the rest are
 * inert until the matching real features are wired to groups.
 */
export type GroupRecommendationKind = "group" | "opportunity" | "campaign";

/**
 * Content proposed to a member *because of the group they are in* — matched on
 * the group's own category and location, never on personal history.
 */
export interface GroupRecommendation {
  id: string;
  kind: GroupRecommendationKind;
  title: string;
  /** Who is behind it — organization or publisher name. */
  subtitle: string;
  category: string;
  location: string;
  /** Explains the match to the member, e.g. "لأن المجموعة في مجال تطوع". */
  reason: string;
  /** Right-hand stat: remaining days, member count, seats left… */
  metaLabel: string | null;
  /** Set only for `kind: "group"`, so the card can navigate to that profile. */
  targetGroupId?: string;
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
