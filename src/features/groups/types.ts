import type { MediaUploadFile } from "@/src/features/media/types";

export type GroupStatus = "active" | "pending" | "rejected" | "suspended" | "archived";
export type GroupMemberRole = "owner" | "admin" | "moderator" | "member";
export type GroupPostStatus = "published" | "pending" | "rejected";
export type MyGroupsScope = "all" | "owned" | "joined";

export const GROUP_ROLE_LABELS: Record<GroupMemberRole, string> = {
  owner: "المالك",
  admin: "مشرف",
  moderator: "مراقب",
  member: "عضو",
};

export interface GroupAdminCandidate {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  avatarUrl?: string | null;
}
export type GroupInviteCandidate = GroupAdminCandidate;

export interface GroupInvitation {
  id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  group?: { id: string; name: string; imageUrl?: string | null; status: GroupStatus };
  invitedBy?: { id: string; name: string };
  user?: GroupMember | null;
  createdAt?: string | null;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  categories: string[];
  location: string;
  membersCount: number;
  postsThisWeek: number;
  postsCount?: number;
  isMember: boolean;
  isOwner?: boolean;
  canManage?: boolean;
  canCreatePost?: boolean;
  canCreateCampaign?: boolean;
  requiresPostApproval: boolean;
  imageUrl: string | null;
  coverImageUrl?: string | null;
  organizationName: string | null;
  isVerifiedOrganization: boolean;
  rules: string[];
  status: GroupStatus;
  rejectionReason: string | null;
  suspensionReason?: string | null;
  myRole: GroupMemberRole | null;
}

export interface GroupMember extends GroupAdminCandidate { role: GroupMemberRole; }

export interface GroupProfile extends Group {
  coverImageUrl: string | null;
  createdAtLabel: string;
  postsCount: number;
  owner: GroupMember;
  admins: GroupMember[];
  membersPreview: GroupMember[];
  invitations?: GroupInvitation[];
}

export interface GroupPollOption { id: string; label: string; votesCount: number; percentage: number; }
export interface GroupPoll {
  id: string;
  question: string;
  allowsMultipleChoices: boolean;
  endsAt: string | null;
  totalVotes: number;
  selectedOptionIds: string[];
  options: GroupPollOption[];
}

export interface GroupPost {
  id: string;
  groupId: string;
  author: GroupMember;
  title?: string | null;
  body: string;
  type?: string;
  status?: GroupPostStatus;
  rejectionReason?: string | null;
  createdAt?: string | null;
  createdAtLabel: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
  images?: string[];
  poll?: GroupPoll | null;
}

export type GroupRecommendationKind = "group" | "opportunity" | "campaign";
export interface GroupRecommendation {
  id: string;
  kind: GroupRecommendationKind;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  reason: string;
  metaLabel: string | null;
  targetGroupId?: string;
}

export interface CreateGroupInput {
  name: string;
  description: string;
  categories: string[];
  location?: string;
  rules: string[];
  purpose: string;
  invitedUsers: GroupInviteCandidate[];
  requiresPostApproval: boolean;
  image: MediaUploadFile | null;
  cover?: MediaUploadFile | null;
}
export type UpdateGroupInput = Partial<CreateGroupInput>;

export const GROUP_CATEGORIES = ["تطوع", "تعليم", "إغاثة", "صحة", "كفالات", "توظيف", "تمكين اقتصادي", "أخرى"] as const;

export interface GroupComment {
  id: string;
  postId: string;
  parentId: string | null;
  author: GroupMember;
  body: string;
  createdAtLabel: string;
  likesCount: number;
  isLiked: boolean;
}
export interface GroupCommentThread extends GroupComment { replies: GroupComment[]; }
export interface AddGroupCommentInput { postId: string; parentId: string | null; body: string; }
