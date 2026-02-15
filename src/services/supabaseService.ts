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
  // 1. Planning/FEED Count
  const planningCount = projects.filter(p => {
    const phase = (p.build_phase || '').toLowerCase();
    return phase.includes('planning') || phase.includes('feed');
  }).length;

  // 2. New Leads (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newLeadsCount = projects.filter(p => new Date(p.published_date) >= sevenDaysAgo).length;

  // 3. Open Opportunities (No Contractor)
  const openCount = projects.filter(p => 
    !p.contractor || p.contractor.toLowerCase() === 'unspecified'
  ).length;

  return {
    early_stage_count: planningCount,
    active_regions: newLeadsCount,
    top_epc_name: 'Strategic Focus',
    top_epc_value: openCount.toString(),
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