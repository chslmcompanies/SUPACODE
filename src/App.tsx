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
import { CalendarDays, X, ChevronDown } from 'lucide-react';

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const toInputVal = (d: Date | null) => {
  if (!d) return '';
  return d.toISOString().split('T')[0];
};

const toDateStr = (d: Date) => d.toISOString().split('T')[0];

const PRESETS = [
  { label: 'Last 7 days',    days: 7 },
  { label: 'Last 30 days',   days: 30 },
  { label: 'Last 3 months',  days: 90 },
  { label: 'Last 6 months',  days: 180 },
  { label: 'Last 12 months', days: 365 },
];

function getPresetRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

function DatePickerDropdown({
  dateRange,
  onChange,
  onClose,
  label,
}: {
  dateRange: { start: Date | null; end: Date | null };
  onChange: (range: { start: Date | null; end: Date | null }) => void;
  onClose: () => void;
  label: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 w-72"
    >
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{label}</p>

      {/* Presets */}
      <div className="flex flex-col gap-1 mb-4">
        {PRESETS.map(p => {
          const range = getPresetRange(p.days);
          const isActive =
            dateRange.start && dateRange.end &&
            toInputVal(dateRange.start) === toInputVal(range.start) &&
            toInputVal(dateRange.end) === toInputVal(range.end);
          return (
            <button
              key={p.days}
              onClick={() => onChange(getPresetRange(p.days))}
              className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom range</p>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">From</label>
          <input
            type="date"
            value={toInputVal(dateRange.start)}
            max={toInputVal(dateRange.end) || undefined}
            onChange={e => onChange({ ...dateRange, start: e.target.value ? new Date(e.target.value) : null })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400
                       bg-gray-50 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">To</label>
          <input
            type="date"
            value={toInputVal(dateRange.end)}
            min={toInputVal(dateRange.start) || undefined}
            onChange={e => onChange({ ...dateRange, end: e.target.value ? new Date(e.target.value) : null })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-800
                       focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400
                       bg-gray-50 transition-all"
          />
        </div>
      </div>

      {(dateRange.start || dateRange.end) && (
        <button
          onClick={() => { onChange({ start: null, end: null }); onClose(); }}
          className="mt-4 w-full text-xs font-semibold text-slate-500 hover:text-red-500
                     py-2 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}

function DateFilterButton({
  dateRange,
  onChange,
  summaryPrefix,
  dropdownLabel,
}: {
  dateRange: { start: Date | null; end: Date | null };
  onChange: (range: { start: Date | null; end: Date | null }) => void;
  summaryPrefix: string;
  dropdownLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const hasFilter = dateRange.start || dateRange.end;

  const summary = () => {
    if (!dateRange.start && !dateRange.end) return 'All Time';
    if (dateRange.start && dateRange.end)
      return `${fmtDate(dateRange.start)} – ${fmtDate(dateRange.end)}`;
    if (dateRange.start) return `From ${fmtDate(dateRange.start)}`;
    if (dateRange.end) return `Until ${fmtDate(dateRange.end)}`;
    return 'All Time';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
          border shadow-sm transition-all
          ${hasFilter
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300 hover:text-slate-800'}
        `}
      >
        <CalendarDays className="w-3.5 h-3.5" />
        <span>{summaryPrefix}</span>
        <span className={hasFilter ? 'text-lime-300' : 'text-slate-400'}>{summary()}</span>
        {hasFilter ? (
          <span
            role="button"
            onClick={e => { e.stopPropagation(); onChange({ start: null, end: null }); }}
            className="ml-1 text-slate-300 hover:text-white"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <DatePickerDropdown
          dateRange={dateRange}
          onChange={r => { onChange(r); }}
          onClose={() => setOpen(false)}
          label={dropdownLabel}
        />
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const [kpiDateRange, setKpiDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null, end: null,
  });

  const [mapTableDateRange, setMapTableDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null, end: null,
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

  const mapTableProjects = useMemo(() => {
    let result = projects;
    if (mapTableDateRange.start || mapTableDateRange.end) {
      result = result.filter(p => {
        const d = p.published_date?.slice(0, 10);
        if (!d) return true;
        if (mapTableDateRange.start && d < toDateStr(mapTableDateRange.start)) return false;
        if (mapTableDateRange.end && d > toDateStr(mapTableDateRange.end)) return false;
        return true;
      });
    }
    if (filterCountry) {
      result = result.filter(p => p.country === filterCountry);
    }
    return result;
  }, [projects, mapTableDateRange, filterCountry]);

  if (sessionLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
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

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">Oil &amp; Gas Dashboard Overview</h2>
          <p className="text-sm text-slate-400 mt-1">Global project intelligence · Early Lead Signal Radar</p>
        </div>

        {/* SCORECARD SECTION */}
        <section className="mb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">At a Glance — Scorecard</h3>
              <p className="text-xs text-slate-400 mt-0.5">Metrics update based on insight publishing date</p>
            </div>
            <DateFilterButton
              dateRange={kpiDateRange}
              onChange={setKpiDateRange}
              summaryPrefix="Insight Published:"
              dropdownLabel="Filter scorecard by published date"
            />
          </div>
          {stats && (
            <KPICards stats={stats} />
          )}
        </section>

        {/* VISUAL DIVIDER */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#f8fafc] px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Global Signals
            </span>
          </div>
        </div>

        {/* MAP + TABLE SECTION */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Signals Heatmap</h3>
              <p className="text-xs text-slate-400 mt-0.5">Date filter applies to both the map and the table below</p>
            </div>
            <DateFilterButton
              dateRange={mapTableDateRange}
              onChange={setMapTableDateRange}
              summaryPrefix="Published:"
              dropdownLabel="Filter map & table by published date"
            />
          </div>

          <WorldMap
            projects={mapTableProjects}
            onCountryClick={setFilterCountry}
            selectedCountry={filterCountry}
          />

          <SignalTable
            projects={mapTableProjects}
            onProjectSelect={setSelectedProject}
          />
        </section>
      </main>

      <ProjectDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default App;