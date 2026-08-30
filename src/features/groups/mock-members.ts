import { mockAdminCandidates } from "./mock-users";
import type { GroupMember, GroupMemberRole } from "./types";

/**
 * TEMPORARY — stands in for `GET /groups/{id}/members`. Membership is derived
 * from the same fake account pool the admins picker searches, so a user picked
 * as an admin there is the same person shown here.
 */
const member = (index: number, role: GroupMemberRole): GroupMember => ({
  ...mockAdminCandidates[index],
  role,
});

/** The signed-in user, as they appear in a group they are simply a member of. */
export const mockCurrentMember: GroupMember = {
  id: "usr-me",
  name: "أنت",
  username: "me",
  avatarUrl: null,
  role: "member",
};

export const mockGroupMembers: Record<string, GroupMember[]> = {
  "grp-001": [member(0, "owner"), member(1, "admin"), member(2, "moderator"), member(3, "member"), member(4, "member")],
  "grp-002": [member(1, "owner"), member(5, "admin"), member(0, "member"), member(6, "member")],
  "grp-003": [member(2, "owner"), member(7, "admin"), member(8, "admin"), member(9, "member")],
  "grp-004": [member(9, "owner"), member(3, "admin"), member(5, "member")],
  "grp-005": [member(4, "owner"), member(6, "admin"), member(1, "member"), member(7, "member")],
  "grp-006": [member(0, "owner"), member(9, "admin"), member(2, "member")],
  "grp-007": [member(6, "owner"), member(8, "admin"), member(3, "member"), member(4, "member")],
};

/** Used for groups with no seeded roster — locally created ones, mainly. */
export const fallbackGroupMembers = (owner: GroupMember): GroupMember[] => [owner];

/** The same user in a group they created — used when seeding a new roster. */
export const mockCurrentOwner: GroupMember = { ...mockCurrentMember, role: "owner" };
