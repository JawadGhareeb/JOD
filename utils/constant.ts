import { ROUTES } from "@/constants/routers";

export const tabs = [
  {
    name: ROUTES.TABS.HOME,
    route: ROUTES.TABS.HOME,
    title: "الرئيسية",
    iconName: "home" as const,
    isCenter: false,
  },
  {
    name: ROUTES.TABS.DONATIONS,
    route: ROUTES.TABS.DONATIONS,
    title: "التبرعات و الحملات",
    iconName: "heart" as const,
    isCenter: false,
  },
  {
    name: ROUTES.TABS.OPPORTUNITIES,
    route: ROUTES.TABS.OPPORTUNITIES,
    title: "فرص العمل",
    iconName: "briefcase" as const,
    isCenter: false,
  },
  {
    name: ROUTES.TABS.ACCOUNT,
    route: ROUTES.TABS.ACCOUNT,
    title: "حسابي",
    iconName: "person" as const,
    isCenter: false,
  },
];
