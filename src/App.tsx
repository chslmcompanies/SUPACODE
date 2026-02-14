import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchProjects().then(data => {
        setProjects(data);
        fetchStats(data).then(setStats);
      });
    }
  }, [session]);

  if (sessionLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg">Early Lead Signal Radar</h1>
          <button onClick={() => signOut()} className="text-sm text-gray-500">Sign Out</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8 w-full">
        {stats && <KPICards stats={stats} projects={projects} />}
        <WorldMap projects={projects} onCountryClick={setFilterCountry} selectedCountry={filterCountry} />
        <SignalTable projects={filterCountry ? projects.filter(p => p.country === filterCountry) : projects} onProjectSelect={setSelectedProject} />
      </main>
      <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
};

export default App;