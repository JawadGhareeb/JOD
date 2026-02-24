export { default as NotificationCard } from "./notifications/notification-card";

// Home components
export { DonationCard, OpportunityCard, StatisticsCard } from "./home";
export type {
  DonationCardProps,
  OpportunityCardProps,
  StatisticsCardProps,
} from "./home/types";

export { default as SupportCard } from "./support/support-card";
export type { SupportCardProps, SupportOption } from "./support/types";

export { default as PrivacyCard } from "./privacy/privacy-card";
export type { PrivacyCardProps, PrivacySection } from "./privacy/types";

export { default as ContactCard } from "./about/contact-card";
export { default as FeaturesCard } from "./about/features-card";
export { default as InfoCard } from "./about/info-card";
export { default as LegalCard } from "./about/legal-card";
export { default as SocialLinkCard } from "./about/social-link-card";
export { default as StatsCard } from "./about/stats-card";
export type {
  AppInfo,
  ContactItem,
  SocialLink,
  SocialLinkCardProps,
  StatItem,
} from "./about/types";
