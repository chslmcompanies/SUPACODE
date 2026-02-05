import { Score } from '../types';
import type { Project, Stats } from '../types';

// MOCK DATA
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
    operator: 'Woodside',
    contractor: 'KBR',
    description: 'Floating LNG facility development off the coast of Western Australia.',
    opportunity: 'Cryogenic insulation and marine-grade protective coatings.'
  },
  {
    id: '5',
    name: 'North Sea Wind-to-Hydrogen',
    country: 'United Kingdom',
    region: 'Europe',
    asset_type: 'Green Hydrogen',
    score: Score.MEDIUM,
    published_date: 'Jan 20, 2024',
    est_value: '$3.1B',
    build_phase: 'Pre-FEED',
    operator: 'BP',
    contractor: 'Aker Solutions',
    description: 'Integration of offshore wind farms with electrolysis plants for green hydrogen production.',
    opportunity: 'Electrolyzer components and hydrogen-compatible pipeline materials.'
  },
  {
    id: '6',
    name: 'Qatar LNG Train 5',
    country: 'Qatar',
    region: 'Middle East',
    asset_type: 'LNG Plant',
    score: Score.HIGH,
    published_date: 'Jan 22, 2024',
    est_value: '$8.5B',
    build_phase: 'Construction',
    operator: 'QatarEnergy',
    contractor: 'Chiyoda / Technip',
    description: 'Expansion of the North Field East project with an additional LNG train.',
    opportunity: 'Specialized cryogenic valves and large-scale heat exchangers.'
  }
];

const MOCK_STATS: Stats = {
  early_stage_count: 142,
  top_epc_name: 'TechnipFMC',
  top_epc_value: '$4.2B',
  active_regions: 6
};

// SIMULATE API CALLS
export const fetchProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROJECTS);
    }, 800);
  });
};

export const fetchStats = async (): Promise<Stats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATS);
    }, 800);
  });
};