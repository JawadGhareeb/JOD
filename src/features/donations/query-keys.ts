import type { CampaignDonorsParams, DonationParams } from "./types";
export const donationKeys = {
  all: ["donations"] as const,
  list: (params: DonationParams) => [...donationKeys.all, "list", params] as const,
  detail: (id: string) => [...donationKeys.all, "detail", id] as const,
  campaignDonors: (campaignId: string, params: Omit<CampaignDonorsParams, "page">) => [...donationKeys.all, "campaign", campaignId, "donors", params] as const,
};
