export const lookupKeys = {
  all: ["lookups"] as const,
  cities: () => [...lookupKeys.all, "cities"] as const,
  reportReasons: () => [...lookupKeys.all, "report-reasons"] as const,
  postTypes: () => [...lookupKeys.all, "post-types"] as const,
  postStatuses: () => [...lookupKeys.all, "post-statuses"] as const,
  ctaStates: () => [...lookupKeys.all, "cta-states"] as const,
  notificationTypes: () => [...lookupKeys.all, "notification-types"] as const,
  donationFlows: () => [...lookupKeys.all, "donation-flows"] as const,
  donationStatuses: () => [...lookupKeys.all, "donation-statuses"] as const,
};
