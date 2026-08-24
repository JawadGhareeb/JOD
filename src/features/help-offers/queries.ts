import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/src/features/posts/query-keys";
import { helpOffersApi } from "./api";
import { helpOfferKeys } from "./query-keys";
import type { HelpOfferInput, HelpOffersParams, HelpRequestStatus } from "./types";

export function useHelpOffers(params: Omit<HelpOffersParams, "page"> = {}) { return useInfiniteQuery({ queryKey: helpOfferKeys.list(params), queryFn: ({ pageParam }) => helpOffersApi.list({ ...params, flow: params.flow ?? "made", page: pageParam, perPage: params.perPage ?? 20 }), initialPageParam: 1, getNextPageParam: (last) => last.meta.currentPage < last.meta.lastPage ? last.meta.currentPage + 1 : undefined }); }
export function useHelpOffer(id?: string) { return useQuery({ queryKey: helpOfferKeys.detail(id ?? ""), queryFn: () => helpOffersApi.detail(id!), enabled: Boolean(id) }); }
function useOfferMutation<T extends { id: string }>(fn: (id: string) => Promise<unknown>) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id }: T) => fn(id), onSuccess: () => { qc.invalidateQueries({ queryKey: helpOfferKeys.all }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
export function useCreateHelpOffer() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, input }: { postId: string; input: HelpOfferInput }) => helpOffersApi.create(postId, input), onSuccess: (_data, { postId }) => { qc.invalidateQueries({ queryKey: helpOfferKeys.all }); qc.invalidateQueries({ queryKey: postKeys.detail(postId) }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
export const useAcceptHelpOffer = () => useOfferMutation(helpOffersApi.accept);
export const useContactHelpOffer = () => useOfferMutation(helpOffersApi.contact);
export const useAgreeHelpOffer = () => useOfferMutation(helpOffersApi.agree);
export const useConfirmProvided = () => useOfferMutation(helpOffersApi.confirmProvided);
export const useConfirmReceived = () => useOfferMutation(helpOffersApi.confirmReceived);
export function useRejectHelpOffer() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, reason }: { id: string; reason?: string }) => helpOffersApi.reject(id, reason), onSuccess: () => { qc.invalidateQueries({ queryKey: helpOfferKeys.all }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
export function useCancelHelpOffer() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, reason }: { id: string; reason: string }) => helpOffersApi.cancel(id, reason), onSuccess: () => { qc.invalidateQueries({ queryKey: helpOfferKeys.all }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
export function useUpdateHelpRequestStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ postId, status }: { postId: string; status: Extract<HelpRequestStatus, "open" | "fulfilled"> }) => helpOffersApi.updateRequestStatus(postId, status), onSuccess: (_data, { postId }) => { qc.invalidateQueries({ queryKey: helpOfferKeys.all }); qc.invalidateQueries({ queryKey: postKeys.detail(postId) }); qc.invalidateQueries({ queryKey: postKeys.feeds() }); } }); }
