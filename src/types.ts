export const Score = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const;

export type Score = string;

export interface Project {
  id: string;
  name: string;              // project_name
  country: string;           // country_of_application
  region: string;
  asset_type: string;
  score: Score;
  published_date: string;
  est_value: string;         // defaults to "Undisclosed"
  build_phase: string;       // build_phase (Greenfield/Brownfield)
  lifecycle: string;         // lifecycle (Planning/FEED, Tender/ITT etc)
  time_horizon: string;      // time_horizon
  operator: string;
  contractor: string;        // primary_contractor
  description: string;       // project_description
  opportunity: string;       // adhesives_opportunities
  technical_trigger: string; // technical_trigger
  url?: string;
  urgency?: string;
}

export interface Stats {
  contractor_gap: number;
  high_priority: number;
  feed_count: number;
  tender_count: number;
  hottest_region: string;
  hottest_region_count: number;
}