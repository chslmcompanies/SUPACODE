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
  console.log(`[Supabase] Attempting to fetch from table: ${TABLE_NAME}`);
  
  // 1. Check Session first
  const { data: sessionData } = await supabase.auth.getSession();
  console.log('[Supabase] Current Session:', sessionData.session ? 'Active' : 'None');

  // 2. Fetch Data
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact' })
    .order('published_date', { ascending: false });

  // 3. Debugging Logs
  if (error) {
    console.error(`[Supabase] FATAL ERROR fetching '${TABLE_NAME}':`, error.message, error.details);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn(`[Supabase] WARNING: Request succeeded but returned 0 rows.`);
    console.warn(`[Supabase] CHECK: 1. Does table '${TABLE_NAME}' have data? 2. Do you have an RLS Policy enabled for 'SELECT'?`);
    return [];
  }

  console.log(`[Supabase] SUCCESS: Fetched ${data.length} rows.`);
  console.log('[Supabase] First row raw data:', data[0]);

  return (data || []).map(mapDbToProject);
};

export const fetchStats = async (projects?: Project[]): Promise<Stats> => {
  const sourceData = projects || await fetchProjects();
  
  const regions = new Set(sourceData.map(p => p.region));
  
  const earlyStage = sourceData.filter(p => {
    const phase = (p.build_phase || '').toLowerCase();
    return phase.includes('planning') || 
           phase.includes('feed') || 
           phase.includes('concept') || 
           phase.includes('tender');
  }).length;

  const contractorCounts: Record<string, number> = {};
  sourceData.forEach(p => {
    if (p.contractor && p.contractor !== 'Unspecified' && p.contractor !== 'None') {
      contractorCounts[p.contractor] = (contractorCounts[p.contractor] || 0) + 1;
    }
  });

  const sortedContractors = Object.entries(contractorCounts).sort((a, b) => b[1] - a[1]);
  
  const topEpc: [string, number] = sortedContractors.length > 0 
    ? sortedContractors[0] 
    : ['Various', 0];

  return {
    early_stage_count: earlyStage,
    top_epc_name: topEpc[0],
    top_epc_value: 'High Activity', 
    active_regions: regions.size
  };
};

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};