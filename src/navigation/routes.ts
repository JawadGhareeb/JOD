import type { Href } from "expo-router";

const asHref = (value: unknown) => value as Href;

export const ROUTES = {
  home: asHref("/(root)/(tabs)/home"),
  donationsCampaigns: asHref("/(root)/(tabs)/donations-campaigns"),
  donationsTab: asHref({
    pathname: "/(root)/(tabs)/donations-campaigns",
    params: { tab: "donations" },
  }),
  volunteeringTab: asHref({
    pathname: "/(root)/(tabs)/donations-campaigns",
    params: { tab: "volunteering" },
  }),
  jobs: asHref("/(root)/(tabs)/jobs"),
  myApplications: asHref("/(root)/applications"),
  profile: asHref("/(root)/(tabs)/profile"),
  publisherProfile: (id: string) =>
    asHref({ pathname: "/(root)/publisher/[id]", params: { id } }),
  donationDetails: (id: string) =>
    asHref({ pathname: "/(root)/donation/[id]", params: { id } }),
  volunteerDetails: (id: string) =>
    asHref({ pathname: "/(root)/volunteer/[id]", params: { id } }),
  jobDetails: (id: string) =>
    asHref({ pathname: "/(root)/job/[id]", params: { id } }),
  campaignResults: (id: string) =>
    asHref({ pathname: "/(root)/campaign-results/[id]", params: { id } }),
} as const;
