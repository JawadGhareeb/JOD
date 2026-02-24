export interface SocialLink {
  name: string;
  url: string;
  icon: any;
  color: string;
}

export interface AppInfo {
  name: string;
  version: string;
  build: string;
  developer: string;
  website: string;
  email: string;
}

export interface SocialLinkCardProps {
  link: SocialLink;
  onPress: (url: string) => void;
}

export interface ContactItem {
  icon: any;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ContactCardProps {
  title: string;
  items: ContactItem[];
}

export interface FeaturesCardProps {
  title: string;
  features: string[];
}

export interface InfoCardProps {
  title: string;
  content: string;
}

export interface LegalCardProps {
  copyright: string;
  description: string;
}

export interface StatsCardProps {
  title: string;
  stats: StatItem[];
}
