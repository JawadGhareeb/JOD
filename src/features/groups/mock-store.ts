import { mockGroupCreatedAt, mockGroups } from "./mock-data";
import { fallbackGroupMembers, mockCurrentMember, mockGroupMembers } from "./mock-members";
import { mockGroupPosts } from "./mock-posts";
import { fallbackRecommendations, mockRecommendationsByCategory } from "./mock-recommendations";
import { mockAdminCandidates } from "./mock-users";
import type {
  CreateGroupInput,
  Group,
  GroupAdminCandidate,
  GroupMember,
  GroupPost,
  GroupProfile,
  GroupRecommendation,
} from "./types";

/**
 * TEMPORARY in-memory store standing in for the groups API.
 *
 * It exists so a group created on one screen is visible on another. State lives
 * here (not in component state) and is read through the query layer, so swapping
 * in real endpoints means replacing `queries.ts` only — screens stay untouched.
 *
 * Resets on app reload, which is fine for a mock.
 */
let groups: Group[] = mockGroups.map((group) => ({ ...group }));

/** Rosters for groups created in-session, which have no seeded membership. */
let localRosters: Record<string, GroupMember[]> = {};

const delay = <T,>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const clone = (list: Group[]): Group[] => list.map((group) => ({ ...group }));

const activeGroups = () => groups.filter((group) => group.status === "active");

const formatCount = (value: number) => value.toLocaleString("ar-SY");

/** Seeded roster first, then anything built at creation time, then just the owner. */
const rosterFor = (groupId: string): GroupMember[] =>
  localRosters[groupId] ?? mockGroupMembers[groupId] ?? fallbackGroupMembers(mockCurrentMember);

/** Same-city items are the better match, so they lead the list. */
const byLocalityFirst = (location: string) => (a: GroupRecommendation, b: GroupRecommendation) =>
  Number(b.location === location) - Number(a.location === location);

/** Other groups in the same category — the most direct "based on this group" match. */
const similarGroupsFor = (group: Group): GroupRecommendation[] =>
  activeGroups()
    .filter((candidate) => candidate.id !== group.id && candidate.category === group.category)
    .slice(0, 3)
    .map((candidate) => ({
      id: `rec-grp-${candidate.id}`,
      kind: "group" as const,
      title: candidate.name,
      subtitle: candidate.organizationName ?? "مجموعة مجتمعية",
      category: candidate.category,
      location: candidate.location,
      reason: `مجموعة أخرى في «${candidate.category}»`,
      metaLabel: `${formatCount(candidate.membersCount)} عضو`,
      targetGroupId: candidate.id,
    }));

const toProfile = (group: Group): GroupProfile => {
  const roster = rosterFor(group.id);
  const owner = roster.find((person) => person.role === "owner") ?? mockCurrentMember;
  return {
    ...group,
    coverImageUrl: null,
    createdAtLabel: mockGroupCreatedAt[group.id] ?? "أُنشئت حديثاً",
    postsCount: mockGroupPosts.filter((post) => post.groupId === group.id).length,
    owner,
    admins: roster.filter((person) => person.role === "admin" || person.role === "moderator"),
    membersPreview: roster.slice(0, 5),
  };
};

export const groupsMockStore = {
  /** Joined groups plus the user's own pending requests, newest request first. */
  myGroups: () => {
    const pending = groups.filter((group) => group.status === "pending");
    const joined = activeGroups().filter((group) => group.isMember);
    return delay(clone([...pending, ...joined]));
  },

  /** Suggested: active, not joined, most active first. */
  suggested: () =>
    delay(
      clone(
        activeGroups()
          .filter((group) => !group.isMember)
          .sort((a, b) => b.postsThisWeek - a.postsThisWeek),
      ),
    ),

  /** Discover: every active group, largest communities first. */
  discover: () =>
    delay(clone(activeGroups().sort((a, b) => b.membersCount - a.membersCount))),

  /** Profile detail. Resolves to `null` for an unknown id so the screen can 404. */
  getById: (groupId: string): Promise<GroupProfile | null> => {
    const group = groups.find((candidate) => candidate.id === groupId);
    return delay(group ? toProfile(group) : null);
  },

  /** The group's own feed. Empty for groups with nothing seeded. */
  posts: (groupId: string): Promise<GroupPost[]> =>
    delay(mockGroupPosts.filter((post) => post.groupId === groupId).map((post) => ({ ...post }))),

  /**
   * Content proposed *because of this group* — matched on its category, then
   * ranked so items in the same city come first. Never personal history.
   */
  recommendations: (groupId: string): Promise<GroupRecommendation[]> => {
    const group = groups.find((candidate) => candidate.id === groupId);
    if (!group) return delay<GroupRecommendation[]>([]);

    const seeds = mockRecommendationsByCategory[group.category] ?? fallbackRecommendations;
    const curated: GroupRecommendation[] = seeds
      .map((seed) => ({ ...seed, reason: `لأن المجموعة في مجال «${group.category}»` }))
      .sort(byLocalityFirst(group.location));

    return delay([...curated, ...similarGroupsFor(group)]);
  },

  join: (groupId: string) => {
    groups = groups.map((group) =>
      group.id === groupId
        ? { ...group, isMember: true, membersCount: group.membersCount + 1, myRole: "member" as const }
        : group,
    );
    return delay(true);
  },

  leave: (groupId: string) => {
    groups = groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            isMember: false,
            membersCount: Math.max(0, group.membersCount - 1),
            myRole: null,
          }
        : group,
    );
    return delay(true);
  },

  /** Stands in for account search when picking group admins. */
  searchAdminCandidates: (query: string): Promise<GroupAdminCandidate[]> => {
    const term = query.trim().toLowerCase();
    const matches = term
      ? mockAdminCandidates.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term),
        )
      : mockAdminCandidates;
    return delay(matches.map((user) => ({ ...user })));
  },

  /**
   * Creates a *pending* group. It deliberately does not enter discovery — a
   * platform admin has to approve it first.
   */
  create: (input: CreateGroupInput) => {
    const id = `grp-local-${groups.length + 1}`;
    const created: Group = {
      id,
      name: input.name,
      description: input.description,
      category: input.category,
      location: input.location,
      visibility: input.visibility,
      rules: input.rules,
      membersCount: 1,
      postsThisWeek: 0,
      isMember: true,
      imageUrl: null,
      organizationName: null,
      isVerifiedOrganization: false,
      status: "pending",
      rejectionReason: null,
      // The creator owns the group; proposed admins are granted their role only
      // after the platform approves the request.
      myRole: "owner",
    };
    groups = [created, ...groups];
    localRosters = {
      ...localRosters,
      [id]: [
        mockCurrentMember,
        ...input.proposedAdmins.map((admin) => ({ ...admin, role: "admin" as const })),
      ],
    };
    return delay(created, 600);
  },
};
