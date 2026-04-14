import { appIcons } from "@/src/components/layout/iconMap";

export const icons = {
  ...appIcons,
  x: appIcons.close,
  bell: appIcons.notification,
} as const;
