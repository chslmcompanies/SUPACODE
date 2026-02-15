import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Login from './components/Login';
import KPICards from './components/KPICards';
import { WorldMap } from './components/WorldMap';
import SignalTable from './components/SignalTable';
import ProjectDrawer from './components/ProjectDrawer';
import type { Project, Stats } from './types';
import { fetchProjects, fetchStats, signOut } from './services/supabaseService';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const [kpiDateRange, setKpiDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchProjects().then(data => setProjects(data));
    }
  }, [session]);

  const toDateStr = (d: Date) => d.toISOString().split('T')[0];

  const kpiProjects = useMemo(() => {
    if (!kpiDateRange.start && !kpiDateRange.end) return projects;
    return projects.filter(p => {
      const d = p.published_date?.slice(0, 10);
      if (!d) return true;
      if (kpiDateRange.start && d < toDateStr(kpiDateRange.start)) return false;
      if (kpiDateRange.end && d > toDateStr(kpiDateRange.end)) return false;
      return true;
    });
  }, [projects, kpiDateRange]);

  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    fetchStats(kpiProjects).then(setStats);
  }, [kpiProjects]);

  const tableProjects = useMemo(() => {
    if (!filterCountry) return projects;
    return projects.filter(p => p.country === filterCountry);
  }, [projects, filterCountry]);

  if (sessionLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg">Early Lead Signal Radar</h1>
          <button onClick={() => signOut()} className="text-sm text-gray-500">
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full">
        {stats && (
          <KPICards
            stats={stats}
            dateRange={kpiDateRange}
            onDateRangeChange={setKpiDateRange}
          />
        )}

        <WorldMap
          projects={projects}
          onCountryClick={setFilterCountry}
          selectedCountry={filterCountry}
        />

        <SignalTable
          projects={tableProjects}
          onProjectSelect={setSelectedProject}
        />
      </main>

      <ProjectDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default App;