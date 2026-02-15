export const Score = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
} as const;

export type Score = string; // Relaxed from enum to string to accept DB values safely

export interface Project {
  id: string;
  name: string; // Mapped from project_name
  country: string; // Mapped from country_of_application
  region: string;
  asset_type: string;
  score: Score;
  published_date: string;
  est_value: string; // Will default to "Undisclosed" if missing in DB
  build_phase: string; // Mapped from lifecycle
  operator: string;
  contractor: string; // Mapped from primary_contractor
  description: string; // Mapped from project_description
  opportunity: string; // Mapped from adhesives_opportunities
  
  // New optional fields from Supabase if needed later
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