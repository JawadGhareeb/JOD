import type { HomePost } from "@/src/features/posts/types";

export type DonationStatus = "active" | "completed" | "scheduled";
export type DonationFlow = "contributed" | "received";

export type MyDonationItem = {
  id: string;
  campaignTitle: string;
  organization: string;
  donatedAmount: number;
  targetAmount: number;
  date: string;
  status: DonationStatus;
  flow: DonationFlow;
};

export type MenuDataPayload = {
  savedPosts: HomePost[];
  myDonations: MyDonationItem[];
};
