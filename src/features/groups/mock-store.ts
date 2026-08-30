import { mockGroups } from "./mock-data";
import type { CreateGroupInput, Group } from "./types";

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

const delay = <T,>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const clone = (list: Group[]): Group[] => list.map((group) => ({ ...group }));

const activeGroups = () => groups.filter((group) => group.status === "active");

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

  join: (groupId: string) => {
    groups = groups.map((group) =>
      group.id === groupId
        ? { ...group, isMember: true, membersCount: group.membersCount + 1 }
        : group,
    );
    return delay(true);
  },

  leave: (groupId: string) => {
    groups = groups.map((group) =>
      group.id === groupId
        ? { ...group, isMember: false, membersCount: Math.max(0, group.membersCount - 1) }
        : group,
    );
    return delay(true);
  },

  /**
   * Creates a *pending* group. It deliberately does not enter discovery — a
   * platform admin has to approve it first.
   */
  create: (input: CreateGroupInput) => {
    const created: Group = {
      id: `grp-local-${groups.length + 1}`,
      name: input.name,
      description: input.description,
      category: input.category,
      location: input.location,
      visibility: input.visibility,
      rules: input.rules,
      membersCount: 1,
      postsThisWeek: 0,
      isMember: true,
      organizationName: null,
      isVerifiedOrganization: false,
      status: "pending",
      rejectionReason: null,
    };
    groups = [created, ...groups];
    return delay(created, 600);
  },
};
