export type UserRole = "user" | "publisher";

export type CampaignStatusTag =
  | "عاجلة"
  | "اقتربت من الاكتمال"
  | "اكتملت"
  | `باقي ${number} أيام`;

export type WorkType = "دوام كامل" | "دوام جزئي" | "عن بعد";

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  city: string;
  statusTag: CampaignStatusTag;
  publisherId: string;
}

export interface DonationCampaign extends BaseItem {
  orgName: string;
  verified: boolean;
  endDate: string;
  goalAmount: number;
  raisedAmount: number;
}

export interface VolunteeringCampaign extends BaseItem {
  date: string;
  time: string;
  requiredVolunteers: number;
  joinedVolunteers: number;
}

export interface JobItem extends BaseItem {
  orgName: string;
  workType: WorkType;
  experienceYears: number;
  postedAt: string;
}
