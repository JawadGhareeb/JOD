import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { donationsApi } from "./api";
import { donationKeys } from "./query-keys";
import { postKeys } from "@/src/features/posts/query-keys";
import { authKeys } from "@/src/features/auth/query-keys";
import type { DonationInput, DonationParams } from "./types";
export function useDonations(params: Omit<DonationParams, "page"> = {}) { return useInfiniteQuery({ queryKey: donationKeys.list(params), queryFn: ({ pageParam }) => donationsApi.list({ ...params, page: pageParam, perPage: params.perPage ?? 20 }), initialPageParam: 1, getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined }); }
export function useDonation(id?: string) { return useQuery({ queryKey: donationKeys.detail(id ?? ""), queryFn: () => donationsApi.detail(id!), enabled: Boolean(id) }); }
export function useDonateToCampaign() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ campaignId, input }: { campaignId: string; input: DonationInput }) => donationsApi.donate(campaignId, input), onSuccess: (_data, variables) => { qc.invalidateQueries({ queryKey: donationKeys.all }); qc.invalidateQueries({ queryKey: postKeys.campaign(variables.campaignId) }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); qc.invalidateQueries({ queryKey: authKeys.session() }); } }); }
