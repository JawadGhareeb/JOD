import { HomePostTypeEnum } from "@/src/constants/global";
import { mockHomePayload } from "@/src/data/mockHome";
import type { ProfilePayload, ProfilePostStatus } from "@/src/types/profile";

const profileStatuses: ProfilePostStatus[] = ["posted", "unposted", "archived"];

const myPosts = mockHomePayload.posts
  .slice(0, 8)
  .map((post, index) => ({
    ...post,
    id: `my-${post.id}`,
    publisher: {
      id: "me",
      name: "جواد",
      username: "jawad.user",
      verified: true,
    },
    postType: [
      HomePostTypeEnum.VolunteerOpportunity,
      HomePostTypeEnum.DonationCampaign,
      HomePostTypeEnum.HelpRequest,
      HomePostTypeEnum.CampaignUpdate,
    ][index % 4],
    saved: index % 3 === 0,
    profileStatus: profileStatuses[index % profileStatuses.length],
  }));

export const mockProfilePayload: ProfilePayload = {
  summary: {
    id: "me",
    name: "جواد",
    username: "jawad.user",
    bio: "مهتم بالعمل الإنساني والتطوعي، وبشارك منشورات وحملات لدعم المجتمع المحلي.",
    city: "دمشق",
    verified: true,
    stats: {
      postsCount: myPosts.length,
      savedCount: 14,
      donationsCount: 9,
    },
  },
  posts: myPosts,
};
