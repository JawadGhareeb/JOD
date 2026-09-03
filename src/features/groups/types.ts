import type { MediaUploadFile } from "@/src/features/media/types";

export type GroupStatus = "active" | "pending" | "rejected";
export type GroupMemberRole = "owner" | "admin" | "moderator" | "member";

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
  avatarUrl?: string | null;
}

/** Every group in JOD is one public volunteer group/team type. */
export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  membersCount: number;
  postsThisWeek: number;
  isMember: boolean;
  imageUrl: string | null;
  organizationName: string | null;
  isVerifiedOrganization: boolean;
  rules: string[];
  status: GroupStatus;
  rejectionReason: string | null;
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
}

export interface GroupPost {
  id: string;
  groupId: string;
  author: GroupMember;
  body: string;
  createdAtLabel: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
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
  category: string;
  location: string;
  rules: string[];
  purpose: string;
  proposedAdmins: GroupAdminCandidate[];
  image: MediaUploadFile | null;
}

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
