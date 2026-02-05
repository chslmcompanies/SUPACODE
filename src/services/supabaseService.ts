import { Project, Score, Stats } from '../types';

// NOTE: In a real scenario, you would import createClient from @supabase/supabase-js
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Mock Data to match the screenshots exactly
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Deepwater Horizon II',
    country: 'Nigeria',
    region: 'Africa',
    asset_type: 'Offshore Platform',
    score: Score.HIGH,
    published_date: 'Jan 15, 2024',
    est_value: '$2.4B',
    build_phase: 'Planning / FEED',
    operator: 'Shell Nigeria',
    contractor: 'TechnipFMC',
    description: 'Major deepwater exploration project in the Niger Delta basin with significant pre-salt potential.',
    opportunity: 'High-performance structural adhesives for subsea equipment bonding, corrosion-resistant coatings.'
  },
  {
    id: '2',
    name: 'Santos Basin Expansion',
    country: 'Brazil',
    region: 'South America',
    asset_type: 'FPSO',
    score: Score.HIGH,
    published_date: 'Jan 14, 2024',
    est_value: '$1.8B',
    build_phase: 'EPC Tender',
    operator: 'Petrobras',
    contractor: 'Modec',
    description: 'Expansion of the pre-salt Santos Basin production capacity with a new FPSO unit.',
    opportunity: 'Advanced thermal insulation for flowlines and risers.'
  },
  {
    id: '3',
    name: 'Permian Midstream Hub',
    country: 'United States',
    region: 'North America',
    asset_type: 'Processing Facility',
    score: Score.HIGH,
    published_date: 'Jan 13, 2024',
    est_value: '$950M',
    build_phase: 'Planning',
    operator: 'Chevron',
    contractor: 'Bechtel',
    description: 'New gas processing hub to handle increased output from Permian basin assets.',
    opportunity: 'Automation control systems and heavy-duty compression units.'
  },
  {
    id: '4',
    name: 'Browse FLNG',
    country: 'Australia',
    region: 'Asia Pacific',
    asset_type: 'FLNG',
    score: Score.MEDIUM,
    published_date: 'Jan 8, 2024',
    est_value: '$12B',
    build_phase: 'Feasibility',
    operator: 'Woodside Energy',
    contractor: 'KBR',
    description: 'Development of the Brecknock, Calliance and Torosa fields using Floating LNG technology.',
    opportunity: 'Cryogenic insulation materials and large-scale heat exchangers.'
  },
  {
    id: '5',
    name: 'Coral South Expansion',
    country: 'Mozambique',
    region: 'Africa',
    asset_type: 'LNG Terminal',
    score: Score.MEDIUM,
    published_date: 'Jan 5, 2024',
    est_value: '$4.2B',
    build_phase: 'Pre-FEED',
    operator: 'Eni',
    contractor: 'Saipem',
    description: 'Second phase of the Coral South project to increase LNG export capacity.',
    opportunity: 'Marine logistics services and specialized drilling fluids.'
  },
  {
    id: '6',
    name: 'Rosebank Field',
    country: 'United Kingdom',
    region: 'Europe',
    asset_type: 'FPSO',
    score: Score.MEDIUM,
    published_date: 'Jan 2, 2024',
    est_value: '$3.8B',
    build_phase: 'Approval',
    operator: 'Equinor',
    contractor: 'Aker Solutions',
    description: 'Development of the Rosebank oil and gas field west of Shetland.',
    opportunity: 'Subsea umbilical, risers and flowlines (SURF) packages.'
  },
  {
    id: '7',
    name: 'Johan Castberg',
    country: 'Norway',
    region: 'Europe',
    asset_type: 'FPSO',
    score: Score.LOW,
    published_date: 'Dec 28, 2023',
    est_value: '$6B',
    build_phase: 'Construction',
    operator: 'Equinor',
    contractor: 'Aker Solutions',
    description: 'Large scale development in the Barents Sea.',
    opportunity: 'Maintenance and operational support services.'
  }
];

const MOCK_STATS: Stats = {
  early_stage_count: 5,
  top_epc: 'TechnipFMC',
  top_epc_desc: 'Most active contractor',
  lead_region: 'South America',
  lead_region_desc: 'Highest project count'
};

export const fetchStats = async (): Promise<Stats> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_STATS), 500);
  });
  
  // Real Supabase implementation:
  // const { data, error } = await supabase.from('stats').select('*').single();
  // if (error) throw error;
  // return data;
};

export const fetchProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PROJECTS), 600);
  });
  
  // Real Supabase implementation:
  // const { data, error } = await supabase.from('projects').select('*');
  // if (error) throw error;
  // return data;
};