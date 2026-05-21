export interface Campaign {
  id: number;
  title: string;
  description: string;
  category: string;
  goal: bigint;
  deadline: bigint;
  raised: bigint;
  donorCount: number;
  charity: string;
  released: boolean;
  cancelled: boolean;
  imageUrl: string;
}

export interface CampaignDisplay extends Campaign {
  goalEth: string;
  raisedEth: string;
  progressPercent: number;
  daysLeft: number;
  isActive: boolean;
  statusLabel: string;
}

export type CampaignCategory =
  | "Tất cả"
  | "Thiên tai"
  | "Giáo dục"
  | "Y tế"
  | "Môi trường"
  | "Khác";
