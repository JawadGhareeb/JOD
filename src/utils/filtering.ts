import type { DonationFilters, JobFilters, VolunteeringFilters } from "@/src/types/filters";
import type {
  DonationCampaign,
  JobItem,
  VolunteeringCampaign,
} from "@/src/types/models";
import { isEndingSoon, isWithinRange } from "@/src/utils/date";

const matchesText = (text: string, query: string) =>
  text.toLowerCase().includes(query.toLowerCase().trim());

export const filterDonations = (
  campaigns: DonationCampaign[],
  query: string,
  filters: DonationFilters,
) =>
  campaigns.filter((campaign) => {
    const normalizedQuery = query.trim();
    const matchesSearch =
      !normalizedQuery ||
      matchesText(campaign.title, normalizedQuery) ||
      matchesText(campaign.orgName, normalizedQuery) ||
      matchesText(campaign.city, normalizedQuery);

    const matchesCity = !filters.city || campaign.city === filters.city;
    const matchesStatus =
      !filters.status || campaign.campaignStatus === filters.status;
    const matchesGoal =
      filters.minGoal === null || campaign.goalAmount >= filters.minGoal;
    const matchesEndingSoon =
      !filters.endingSoon || isEndingSoon(campaign.endDate, 10);

    return (
      matchesSearch &&
      matchesCity &&
      matchesStatus &&
      matchesGoal &&
      matchesEndingSoon
    );
  });

export const filterVolunteering = (
  campaigns: VolunteeringCampaign[],
  query: string,
  filters: VolunteeringFilters,
) =>
  campaigns.filter((campaign) => {
    const normalizedQuery = query.trim();
    const matchesSearch =
      !normalizedQuery ||
      matchesText(campaign.title, normalizedQuery) ||
      matchesText(campaign.city, normalizedQuery);

    const matchesCity = !filters.city || campaign.city === filters.city;

    const matchesDate =
      filters.dateRange === "all"
        ? true
        : isWithinRange(campaign.date, filters.dateRange);

    const matchesSeats =
      !filters.seatsAvailable ||
      campaign.requiredVolunteers > campaign.joinedVolunteers;

    return matchesSearch && matchesCity && matchesDate && matchesSeats;
  });

export const filterJobs = (
  jobs: JobItem[],
  query: string,
  filters: JobFilters,
) =>
  jobs.filter((job) => {
    const normalizedQuery = query.trim();
    const matchesSearch =
      !normalizedQuery ||
      matchesText(job.title, normalizedQuery) ||
      matchesText(job.orgName, normalizedQuery) ||
      matchesText(job.city, normalizedQuery);

    const matchesCity = !filters.city || job.city === filters.city;
    const matchesType = !filters.workType || job.workType === filters.workType;
    const matchesExperience =
      filters.experienceYears === null ||
      job.experienceYears <= filters.experienceYears;

    return matchesSearch && matchesCity && matchesType && matchesExperience;
  });

export const donationActiveFiltersCount = (filters: DonationFilters) => {
  let count = 0;
  if (filters.city) count += 1;
  if (filters.status) count += 1;
  if (filters.minGoal !== null) count += 1;
  if (filters.endingSoon) count += 1;
  return count;
};

export const volunteeringActiveFiltersCount = (
  filters: VolunteeringFilters,
) => {
  let count = 0;
  if (filters.city) count += 1;
  if (filters.dateRange !== "all") count += 1;
  if (filters.seatsAvailable) count += 1;
  return count;
};

export const jobsActiveFiltersCount = (filters: JobFilters) => {
  let count = 0;
  if (filters.city) count += 1;
  if (filters.workType) count += 1;
  if (filters.experienceYears !== null) count += 1;
  return count;
};
