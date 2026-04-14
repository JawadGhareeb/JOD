import { HomePostTypeEnum } from "@/src/constants/global";
import { formatRelativeDateAr } from "@/src/helpers/dateTime";

export function formatHomePostRelativeDate(isoDate: string): string {
  return formatRelativeDateAr(isoDate);
}

export const HOME_POST_TYPE_LABELS: Record<HomePostTypeEnum, string> = {
  [HomePostTypeEnum.VolunteerOpportunity]: "فرصة تطوع",
  [HomePostTypeEnum.DonationCampaign]: "حملة تبرع",
  [HomePostTypeEnum.HelpRequest]: "طلب مساعدة",
  [HomePostTypeEnum.CampaignUpdate]: "تحديث حملة",
  [HomePostTypeEnum.Awareness]: "توعوي",
};
