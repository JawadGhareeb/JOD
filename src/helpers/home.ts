import { HomePostTypeEnum } from "@/src/constants/global";

export function formatHomePostRelativeDate(isoDate: string): string {
  const now = Date.now();
  const created = new Date(isoDate).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;

  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export const HOME_POST_TYPE_LABELS: Record<HomePostTypeEnum, string> = {
  [HomePostTypeEnum.VolunteerOpportunity]: "فرصة تطوع",
  [HomePostTypeEnum.DonationCampaign]: "حملة تبرع",
  [HomePostTypeEnum.HelpRequest]: "طلب مساعدة",
  [HomePostTypeEnum.CampaignUpdate]: "تحديث حملة",
  [HomePostTypeEnum.Awareness]: "توعوي",
};
