export interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
}

export interface SupportCardProps {
  option: SupportOption;
}
