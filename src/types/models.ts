export type UserRole = "user" | "publisher";

export type CampaignStatusTag =
  | "عاجلة"
  | "اقتربت من الاكتمال"
  | "اكتملت"
  | `باقي ${number} أيام`;

export type CampaignLifecycleStatus = "active" | "completed";

export type VolunteerJoinStatus = "not_joined" | "pending" | "accepted";

export type WorkType = "دوام كامل" | "دوام جزئي" | "عن بعد";

export type JobApplicationStatus =
  | "submitted"
  | "in_review"
  | "accepted"
  | "rejected";

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
  campaignStatus: CampaignLifecycleStatus;
  donationChannelLabel: string;
  donationChannelUrl?: string;
  followersCount: number;
  resultSummary?: string;
  resultBeneficiaries?: number;
}

export interface VolunteeringCampaign extends BaseItem {
  date: string;
  time: string;
  requiredVolunteers: number;
  joinedVolunteers: number;
  campaignStatus: CampaignLifecycleStatus;
  joinStatus: VolunteerJoinStatus;
}

export interface JobItem extends BaseItem {
  orgName: string;
  workType: WorkType;
  experienceYears: number;
  postedAt: string;
  deadline: string;
  requirements: string[];
  employmentTypeLabel: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  status: JobApplicationStatus;
  appliedAt: string;
}
