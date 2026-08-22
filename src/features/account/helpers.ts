import type { AuthUser } from "@/src/features/auth/types";
import type { ProfileSummary } from "@/src/types/profile";

/** Maps the authenticated `/me` user into the profile header card model. */
export function toProfileSummary(
  user: AuthUser,
  overrides?: Partial<ProfileSummary["stats"]>,
): ProfileSummary {
  const emailLocalPart = user.email.includes("@") ? user.email.split("@")[0] : user.email;

  return {
    id: user.id,
    name: user.name,
    username: user.username?.trim() || emailLocalPart || "user",
    bio: user.bio?.trim() || "",
    city: user.city?.trim() || "",
    verified: Boolean(user.verified),
    stats: {
      postsCount: overrides?.postsCount ?? user.stats?.postsCount ?? 0,
      savedCount: overrides?.savedCount ?? user.stats?.savedCount ?? 0,
      donationsCount: overrides?.donationsCount ?? user.stats?.donationsCount ?? 0,
    },
  };
}
