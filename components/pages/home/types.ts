export interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onPress?: () => void;
}

export interface DonationCardProps {
  title: string;
  description: string;
  amount?: string;
  progress?: number;
  type?: "volunteer_campaign" | "donation_campaign";
  onPress?: () => void;
}

export interface OpportunityCardProps {
  title: string;
  description: string;
  location?: string;
  onPress?: () => void;
}
