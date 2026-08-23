import { useQuery } from "@tanstack/react-query";
import { lookupsApi } from "./api";
import { lookupKeys } from "./query-keys";

const options = { staleTime: 10 * 60_000 } as const;
export const useCities = () => useQuery({ queryKey: lookupKeys.cities(), queryFn: () => lookupsApi.cities({ status: "active" }), ...options });
export const useReportReasons = () => useQuery({ queryKey: lookupKeys.reportReasons(), queryFn: () => lookupsApi.reportReasons({ status: "active" }), ...options });
export const usePostTypesLookup = () => useQuery({ queryKey: lookupKeys.postTypes(), queryFn: () => lookupsApi.postTypes({ status: "active" }), ...options });
export const usePostStatusesLookup = () => useQuery({ queryKey: lookupKeys.postStatuses(), queryFn: () => lookupsApi.postStatuses({ status: "active" }), ...options });
export const useCtaStatesLookup = () => useQuery({ queryKey: lookupKeys.ctaStates(), queryFn: () => lookupsApi.ctaStates({ status: "active" }), ...options });
export const useNotificationTypesLookup = () => useQuery({ queryKey: lookupKeys.notificationTypes(), queryFn: () => lookupsApi.notificationTypes({ status: "active" }), ...options });
export const useDonationFlowsLookup = () => useQuery({ queryKey: lookupKeys.donationFlows(), queryFn: () => lookupsApi.donationFlows({ status: "active" }), ...options });
export const useDonationStatusesLookup = () => useQuery({ queryKey: lookupKeys.donationStatuses(), queryFn: () => lookupsApi.donationStatuses({ status: "active" }), ...options });
