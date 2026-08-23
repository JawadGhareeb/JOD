import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "./api";
import { applicationKeys } from "./query-keys";
import { postKeys } from "@/src/features/posts/query-keys";
import type { ApplicationsParams, CampaignApplicationInput } from "./types";
export function useApplications(params: Omit<ApplicationsParams, "page"> = {}) { return useInfiniteQuery({ queryKey: applicationKeys.list(params), queryFn: ({ pageParam }) => applicationsApi.list({ ...params, page: pageParam, perPage: params.perPage ?? 20 }), initialPageParam: 1, getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined }); }
export function useApplication(id?: string) { return useQuery({ queryKey: applicationKeys.detail(id ?? ""), queryFn: () => applicationsApi.detail(id!), enabled: Boolean(id) }); }
export function useApplyToCampaign() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ campaignId, input }: { campaignId: string; input: CampaignApplicationInput }) => applicationsApi.apply(campaignId, input), onSuccess: (_data, variables) => { qc.invalidateQueries({ queryKey: applicationKeys.all }); qc.invalidateQueries({ queryKey: postKeys.campaign(variables.campaignId) }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
export function useWithdrawApplication() { const qc = useQueryClient(); return useMutation({ mutationFn: applicationsApi.withdraw, onSuccess: (data) => { qc.invalidateQueries({ queryKey: applicationKeys.all }); qc.invalidateQueries({ queryKey: postKeys.campaign(data.campaignId) }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
