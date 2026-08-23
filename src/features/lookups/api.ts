import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope } from "@/src/types/api";
import type { CityLookupItem, CodeLabelLookupItem, LookupParams, PostTypeLookupItem, ReportReasonLookupItem } from "./types";

const get = async <T>(path: string, params: LookupParams = {}): Promise<T[]> => {
  const response = await apiClient.get<ApiEnvelope<T[]>>(`${path}${buildQuery(params)}`);
  return response.data.data;
};

export const lookupsApi = {
  cities: (params?: LookupParams) => get<CityLookupItem>("/lookups/cities", params),
  reportReasons: (params?: LookupParams) => get<ReportReasonLookupItem>("/lookups/report-reasons", params),
  postTypes: (params?: LookupParams) => get<PostTypeLookupItem>("/lookups/post-types", params),
  postStatuses: (params?: LookupParams) => get<CodeLabelLookupItem>("/lookups/post-statuses", params),
  ctaStates: (params?: LookupParams) => get<CodeLabelLookupItem>("/lookups/cta-states", params),
  notificationTypes: (params?: LookupParams) => get<CodeLabelLookupItem>("/lookups/notification-types", params),
  donationFlows: (params?: LookupParams) => get<CodeLabelLookupItem>("/lookups/donation-flows", params),
  donationStatuses: (params?: LookupParams) => get<CodeLabelLookupItem>("/lookups/donation-statuses", params),
};
