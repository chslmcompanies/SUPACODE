export const Score = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const;

export type Score = typeof Score[keyof typeof Score];

export interface Project {
  id: string;
  name: string;
  country: string;
  region: string;
  asset_type: string;
  score: Score;
  published_date: string;
  est_value: string;
  build_phase: string;
  operator: string;
  contractor: string;
  description: string;
  opportunity: string;
}

export interface Stats {
  early_stage_count: number;
  top_epc_name: string;
  top_epc_value: string;
  active_regions: number;
}