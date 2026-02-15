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
import { CalendarDays } from 'lucide-react';

// ── Date filter options ──────────────────────────────────────────
const DATE_OPTIONS = [
  { label: 'All Time',    days: null },
  { label: 'Last 7 Days', days: 7    },
  { label: 'Last 30 Days',days: 30   },
  { label: 'Last 90 Days',days: 90   },
] as const;

type DateOption = typeof DATE_OPTIONS[number];

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateOption>(DATE_OPTIONS[0]);

  // ── Auth ─────────────────────────────────────────────────────
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

  // ── Fetch all projects once ───────────────────────────────────
  useEffect(() => {
    if (session) {
      fetchProjects().then(data => setProjects(data));
    }
  }, [session]);

  // ── Filter projects by selected date range ────────────────────
  // This is the single source of truth — both KPI cards and the
  // table use this filtered list, so everything stays in sync.
  const filteredProjects = useMemo(() => {
    if (!dateFilter.days) return projects; // "All Time" — no filter
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - dateFilter.days);
    return projects.filter(p => new Date(p.published_date) >= cutoff);
  }, [projects, dateFilter]);

  // ── Recalculate stats whenever filtered projects change ───────
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    if (filteredProjects.length > 0 || projects.length > 0) {
      fetchStats(filteredProjects).then(setStats);
    }
  }, [filteredProjects]);

  // ── Apply country filter on top of date filter ────────────────
  const tableProjects = useMemo(() => {
    if (!filterCountry) return filteredProjects;
    return filteredProjects.filter(p => p.country === filterCountry);
  }, [filteredProjects, filterCountry]);

  if (sessionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg">Early Lead Signal Radar</h1>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-500"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full">

        {/* Date filter — right-aligned, above KPI cards */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">
              Dashboard Overview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Metrics update based on insight publishing date
            </p>
          </div>

          {/* Filter pill group */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="font-medium">Insight Published:</span>
            </div>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-1 shadow-sm">
              {DATE_OPTIONS.map(option => (
                <button
                  key={option.label}
                  onClick={() => setDateFilter(option)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${dateFilter.label === option.label
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI cards — driven by filtered projects */}
        {stats && <KPICards stats={stats} />}

        {/* Map — driven by filtered projects */}
        <WorldMap
          projects={filteredProjects}
          onCountryClick={setFilterCountry}
          selectedCountry={filterCountry}
        />

        {/* Table — filtered by date AND country */}
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