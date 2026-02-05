export enum Score {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

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
  coordinates?: { x: number; y: number }; // For map placement if needed, or country mapping
}

export interface Stats {
  early_stage_count: number;
  top_epc: string;
  top_epc_desc: string;
  lead_region: string;
  lead_region_desc: string;
}

export interface CountryPath {
  id: string;
  name: string;
  path: string;
  viewBox?: string;
}