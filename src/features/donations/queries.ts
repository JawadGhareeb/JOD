import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { donationsApi } from "./api";
import { donationKeys } from "./query-keys";
import type { DonationInput, DonationParams } from "./types";

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

export function useDonation(id?: string) {
  return useQuery({ queryKey: donationKeys.detail(id ?? ""), queryFn: () => donationsApi.detail(id!), enabled: Boolean(id) });
}

export function useDonateToCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, input }: { campaignId: string; input: DonationInput }) => donationsApi.donate(campaignId, input),
    onSuccess: () => {
      // Creating an intent never changes campaign totals. Only refresh donation history.
      qc.invalidateQueries({ queryKey: donationKeys.all });
    },
  });
}
