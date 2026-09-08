import { useInfiniteQuery,useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { donationKeys } from "@/src/features/donations/query-keys";
import { postKeys } from "@/src/features/posts/query-keys";
import { personalCampaignsApi } from "./api";
import { personalCampaignKeys } from "./query-keys";
import type { PersonalCampaignInput,PersonalCampaignParams } from "./types";
export function usePersonalCampaigns(params:Omit<PersonalCampaignParams,"page">={}){return useInfiniteQuery({queryKey:personalCampaignKeys.list(params),queryFn:({pageParam})=>personalCampaignsApi.list({...params,page:pageParam,perPage:params.perPage??20}),initialPageParam:1,getNextPageParam:last=>last.meta.currentPage<last.meta.lastPage?last.meta.currentPage+1:undefined})}
export function usePersonalCampaign(id?:string){return useQuery({queryKey:personalCampaignKeys.detail(id??""),queryFn:()=>personalCampaignsApi.detail(id!),enabled:Boolean(id)})}
export function useCreatePersonalCampaign(){const qc=useQueryClient();return useMutation({mutationFn:(input:PersonalCampaignInput)=>personalCampaignsApi.create(input),onSuccess:()=>qc.invalidateQueries({queryKey:personalCampaignKeys.all})})}
export function useClosePersonalCampaign(){const qc=useQueryClient();return useMutation({mutationFn:({id,reason}:{id:string;reason:string})=>personalCampaignsApi.close(id,reason),onSuccess:data=>{qc.invalidateQueries({queryKey:personalCampaignKeys.all});qc.invalidateQueries({queryKey:donationKeys.all});qc.invalidateQueries({queryKey:postKeys.feeds()});qc.setQueryData(personalCampaignKeys.detail(data.id),data)}})}
