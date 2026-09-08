import type { PersonalCampaignParams } from "./types";
export const personalCampaignKeys={all:["personal-campaigns"] as const,lists:()=>["personal-campaigns","list"] as const,list:(params:Omit<PersonalCampaignParams,"page">={})=>["personal-campaigns","list",params] as const,detail:(id:string)=>["personal-campaigns","detail",id] as const};
