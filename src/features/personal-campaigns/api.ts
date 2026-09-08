import { Platform } from "react-native";
import { apiClient } from "@/src/lib/api-client";
import { buildQuery } from "@/src/lib/build-query";
import type { ApiEnvelope, PaginationMeta } from "@/src/types/api";
import type { PersonalCampaign, PersonalCampaignInput, PersonalCampaignParams } from "./types";

async function appendFile(form: FormData, field: string, file: NonNullable<PersonalCampaignInput["images"]>[number]) { if (Platform.OS === "web") { const blob=await fetch(file.uri).then(r=>r.blob()); form.append(field,blob,file.name); } else form.append(field,file as unknown as Blob); }
async function toFormData(input: PersonalCampaignInput) { const form=new FormData(); form.append("title",input.title); form.append("summary",input.summary); if(input.content)form.append("content",input.content); form.append("categoryId",input.categoryId); form.append("audience",input.audience??"general"); form.append("location",input.location); form.append("goalAmount",String(input.goalAmount)); form.append("beneficiariesCount",String(input.beneficiariesCount??1)); if(input.startDate)form.append("startDate",input.startDate); if(input.endDate)form.append("endDate",input.endDate); for(let i=0;i<(input.images?.length??0);i+=1)await appendFile(form,`images[${i}]`,input.images![i]); return form; }
export const personalCampaignsApi={
  list:async(params:PersonalCampaignParams={})=>{const r=await apiClient.get<ApiEnvelope<PersonalCampaign[],PaginationMeta>>(`/me/campaigns${buildQuery(params)}`);return{items:r.data.data,meta:r.data.meta}},
  detail:async(id:string)=>(await apiClient.get<ApiEnvelope<PersonalCampaign>>(`/me/campaigns/${id}`)).data.data,
  create:async(input:PersonalCampaignInput)=>(await apiClient.post<ApiEnvelope<PersonalCampaign>>("/me/campaigns",await toFormData(input))).data.data,
  update:async(id:string,input:PersonalCampaignInput)=>{const form=await toFormData(input);form.append("_method","PATCH");return(await apiClient.post<ApiEnvelope<PersonalCampaign>>(`/me/campaigns/${id}`,form)).data.data},
  close:async(id:string,reason:string)=>(await apiClient.post<ApiEnvelope<PersonalCampaign>>(`/me/campaigns/${id}/close`,{reason})).data.data,
};
