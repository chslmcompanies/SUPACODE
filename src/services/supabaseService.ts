import { supabase } from '../lib/supabase';
import type { Project, Stats } from '../types';

const TABLE_NAME = 'signals'; 

const mapDbToProject = (data: any): Project => ({
  id: data.id,
  name: data.project_name || 'Untitled Project',
  country: data.country_of_application || 'Unknown',
  region: data.region || 'Global',
  asset_type: data.asset_type || 'Other',
  score: data.score || 'Low',
  published_date: data.published_date,
  est_value: 'Undisclosed', 
  build_phase: data.lifecycle || data.build_phase || 'Unspecified',
  operator: data.operator || 'Unspecified',
  contractor: data.primary_contractor || 'Unspecified',
  description: data.project_description || '',
  opportunity: data.adhesives_opportunities || 'No specific opportunities listed.',
  url: data.url,
  urgency: data.urgency
});

export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('published_date', { ascending: false });

  if (error) return [];
  return (data || []).map(mapDbToProject);
};

export const fetchStats = async (projects: Project[]): Promise<Stats> => {
  // Card 1 — Contractor Gap
  const contractorGap = projects.filter(p => {
    const c = (p.contractor || '').toLowerCase().trim();
    return !c || c === 'unspecified' || c === 'tbc' || c === 'tbd'
        || c === 'n/a' || c === '-' || c === 'unknown';
  }).length;

  // Card 2 — High Priority
  const highPriority = projects.filter(p => {
    const s = (p.score || '').toLowerCase().trim();
    const num = parseInt(s, 10);
    if (!isNaN(num)) return num >= 80;
    return s === 'high' || s === 'critical' || s === 'a';
  }).length;

  // Card 3 — Phase Breakdown
  const feedCount = projects.filter(p =>
    (p.build_phase || '').toLowerCase().includes('planning/feed') ||
    (p.build_phase || '').toLowerCase().includes('planning') ||
    (p.build_phase || '').toLowerCase().includes('feed')
  ).length;

  const tenderCount = projects.filter(p =>
    (p.build_phase || '').toLowerCase().includes('tender') ||
    (p.build_phase || '').toLowerCase().includes('itt')
  ).length;

  // Card 4 — Hottest Region
  const regionCounts: Record<string, number> = {};
  projects.forEach(p => {
    const r = p.region || 'Unknown';
    regionCounts[r] = (regionCounts[r] || 0) + 1;
  });
  const hottestRegion = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])[0] || ['No data', 0];

  return {
    contractor_gap: contractorGap,
    high_priority: highPriority,
    feed_count: feedCount,
    tender_count: tenderCount,
    hottest_region: hottestRegion[0] as string,
    hottest_region_count: hottestRegion[1] as number,
  };
};
 

// CRITICAL EXPORT: This is what Vercel is complaining about
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};