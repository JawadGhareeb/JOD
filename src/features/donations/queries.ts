import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { donationsApi } from "./api";
import { donationKeys } from "./query-keys";
import { postKeys } from "@/src/features/posts/query-keys";
import type { CampaignDonorsParams, DonationInput, DonationParams } from "./types";

export function useDonations(
  params: Omit<DonationParams, "page"> = {},
  options: { enabled?: boolean } = {},
) {
  return useInfiniteQuery({
    queryKey: donationKeys.list(params),
    queryFn: ({ pageParam }) => donationsApi.list({ ...params, flow: params.flow ?? "contributed", page: pageParam, perPage: params.perPage ?? 20 }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
    enabled: options.enabled ?? true,
  });
}

export function useCampaignDonors(
  campaignId?: string,
  params: Omit<CampaignDonorsParams, "page"> = {},
) {
  return useInfiniteQuery({
    queryKey: donationKeys.campaignDonors(campaignId ?? "", params),
    queryFn: ({ pageParam }) => donationsApi.campaignDonors(campaignId!, { ...params, page: pageParam, perPage: params.perPage ?? 10 }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined,
    enabled: Boolean(campaignId),
  });
}

export function useDonation(id?: string) {
  return useQuery({ queryKey: donationKeys.detail(id ?? ""), queryFn: () => donationsApi.detail(id!), enabled: Boolean(id) });
}

function useDonationOwnerAction<T extends { id: string }>(fn: (id: string) => Promise<unknown>) { const qc=useQueryClient(); return useMutation({ mutationFn:(vars:T)=>fn(vars.id), onSuccess:()=>{ qc.invalidateQueries({queryKey:donationKeys.all}); qc.invalidateQueries({queryKey:postKeys.all}); } }); }
export const useAcceptDonation = () => useDonationOwnerAction(donationsApi.accept);
export const useContactDonation = () => useDonationOwnerAction(donationsApi.contact);
export const useAgreeDonation = () => useDonationOwnerAction(donationsApi.agree);
export function useCompleteDonation(){const qc=useQueryClient();return useMutation({mutationFn:({id,confirmedAmount}:{id:string;confirmedAmount:number})=>donationsApi.complete(id,confirmedAmount),onSuccess:()=>{qc.invalidateQueries({queryKey:donationKeys.all});qc.invalidateQueries({queryKey:postKeys.all});}})}
export function useCancelDonation(){const qc=useQueryClient();return useMutation({mutationFn:({id,reason}:{id:string;reason:string})=>donationsApi.cancel(id,reason),onSuccess:()=>{qc.invalidateQueries({queryKey:donationKeys.all});qc.invalidateQueries({queryKey:postKeys.all});}})}

export function useDonateToCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, input }: { campaignId: string; input: DonationInput }) => donationsApi.donate(campaignId, input),
    onSuccess: (_donation, variables) => {
      // Creating an intent does not change totals, but it changes the viewer-specific CTA state.
      qc.invalidateQueries({ queryKey: donationKeys.all });
      qc.invalidateQueries({ queryKey: postKeys.feeds() });
      qc.invalidateQueries({ queryKey: postKeys.campaign(variables.campaignId) });
      qc.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
