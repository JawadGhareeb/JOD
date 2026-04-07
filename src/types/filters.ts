import type { CampaignStatusTag, WorkType } from "./models";

export type DateRangeFilter = "all" | "week" | "month";

export interface BaseFilters {
  city: string | null;
}

export interface DonationFilters extends BaseFilters {
  status: CampaignStatusTag | null;
  minGoal: number | null;
  endingSoon: boolean;
}

export interface VolunteeringFilters extends BaseFilters {
  dateRange: DateRangeFilter;
  seatsAvailable: boolean;
}

export interface JobFilters extends BaseFilters {
  workType: WorkType | null;
  experienceYears: number | null;
}
