import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, FilterX, Download, ChevronUp, ChevronDown, ChevronsUpDown, Filter, X } from 'lucide-react';
import { Score } from '../types';
import type { Project } from '../types';

interface SignalTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

type SortKey = keyof Pick<Project, 'name' | 'country' | 'region' | 'asset_type' | 'build_phase' | 'lifecycle' | 'time_horizon' | 'contractor' | 'operator' | 'score'>;
type SortDir = 'asc' | 'desc' | null;

interface ColFilter {
  [col: string]: Set<string>;
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name',        label: 'Project Name' },
  { key: 'country',     label: 'Country' },
  { key: 'score',       label: 'Score' },
  { key: 'lifecycle',   label: 'Lifecycle' },
  { key: 'operator',    label: 'Operator' },
  { key: 'contractor',  label: 'Primary Contractor' },
  { key: 'time_horizon',label: 'Time Horizon' },
  { key: 'region',      label: 'Region' },
  { key: 'asset_type',  label: 'Asset Type' },
  { key: 'build_phase', label: 'Build Phase' },
];

function scoreColor(score: string) {
  if (score === Score.HIGH) return { bg: '#cce594', text: 'rgb(50,80,10)', border: '#a8c870' };
  if (score === Score.MEDIUM) return { bg: '#f4df9e', text: 'rgb(100,75,10)', border: '#e0c870' };
  return { bg: '#e2e8f0', text: '#475569', border: '#cbd5e1' };
}

function ColFilterDropdown({
  allValues,
  selected,
  onToggle,
  onClose,
  onSelectAll,
  onClear,
}: {
  colKey: string;
  allValues: string[];
  selected: Set<string>;
  onToggle: (val: string) => void;
  onClose: () => void;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filtered = allValues.filter(v => v.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl w-56 overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-2 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50"
          />
        </div>
      </div>
      <div className="p-1.5 border-b border-slate-100 flex gap-1">
        <button
          onClick={onSelectAll}
          className="flex-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Select All
        </button>
        <button
          onClick={onClear}
          className="flex-1 text-[10px] font-semibold text-red-400 hover:text-red-600 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto py-1">
        {filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-3">No options</p>
        )}
        {filtered.map(val => {
          const checked = selected.size === 0 || selected.has(val);
          return (
            <label
              key={val}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(val)}
                className="w-3.5 h-3.5 rounded accent-slate-700 cursor-pointer"
              />
              <span className="text-xs text-slate-700 truncate flex-1">{val || '(blank)'}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

const SignalTable: React.FC<SignalTableProps> = ({ projects, onProjectSelect }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [colFilters, setColFilters] = useState<ColFilter>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const colValues = useMemo(() => {
    const result: Record<string, string[]> = {};
    COLUMNS.forEach(({ key }) => {
      const vals = [...new Set(projects.map(p => String(p[key] ?? '')))].sort();
      result[key] = vals;
    });
    return result;
  }, [projects]);

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return; }
    if (sortDir === 'asc') { setSortDir('desc'); return; }
    setSortKey(null); setSortDir(null);
  };

  const toggleFilterValue = useCallback((col: string, val: string) => {
    setColFilters(prev => {
      const cur = new Set(prev[col] ?? []);
      const allVals = colValues[col] ?? [];
      if (cur.size === 0) {
        const next = new Set(allVals.filter(v => v !== val));
        return { ...prev, [col]: next };
      }
      if (cur.has(val)) cur.delete(val);
      else cur.add(val);
      if (cur.size === allVals.length) return { ...prev, [col]: new Set() };
      return { ...prev, [col]: cur };
    });
  }, [colValues]);

  const selectAll = useCallback((col: string) => {
    setColFilters(prev => ({ ...prev, [col]: new Set() }));
  }, []);

  const clearFilter = useCallback((col: string) => {
    setColFilters(prev => ({ ...prev, [col]: new Set(['__none__']) }));
  }, []);

  const hasActiveFilter = (col: string) => {
    const s = colFilters[col];
    return s && s.size > 0;
  };

  const filtered = useMemo(() => {
    let result = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        COLUMNS.some(({ key }) => String(p[key] ?? '').toLowerCase().includes(q))
      );
    }
    Object.entries(colFilters).forEach(([col, vals]) => {
      if (!vals || vals.size === 0) return;
      result = result.filter(p => vals.has(String(p[col as SortKey] ?? '')));
    });
    if (sortKey && sortDir) {
      result = [...result].sort((a, b) => {
        const av = String(a[sortKey] ?? '').toLowerCase();
        const bv = String(b[sortKey] ?? '').toLowerCase();
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return result;
  }, [projects, search, colFilters, sortKey, sortDir]);

  const exportCSV = () => {
    const headers = COLUMNS.map(c => c.label).join(',');
    const rows = filtered.map(p =>
      COLUMNS.map(({ key }) => `"${String(p[key] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signals.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setSearch('');
    setColFilters({});
    setSortKey(null);
    setSortDir(null);
  };

  const anyFilterActive = search.trim() || Object.values(colFilters).some(s => s && s.size > 0);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 opacity-30" />;
    if (sortDir === 'asc') return <ChevronUp className="w-3 h-3 text-slate-800" />;
    return <ChevronDown className="w-3 h-3 text-slate-800" />;
  }

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">

      {/* TOOLBAR */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50/60">
        <div className="flex items-center gap-2 mr-auto">
          <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-800">Priority Signals</h2>
          <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
            {filtered.length} / {projects.length}
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all columns…"
            className="pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 w-56 placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {anyFilterActive && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-all"
          >
            <FilterX className="w-3.5 h-3.5" />
            Reset filters
          </button>
        )}

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {COLUMNS.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <div className="relative flex items-center gap-1">
                    <button
                      onClick={() => handleSort(key)}
                      className="flex items-center gap-1 hover:text-slate-800 transition-colors group"
                    >
                      {label}
                      <SortIcon col={key} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setOpenFilter(openFilter === key ? null : key); }}
                      className={`ml-0.5 p-0.5 rounded transition-colors ${
                        hasActiveFilter(key)
                          ? 'text-slate-900 bg-slate-200'
                          : 'text-slate-300 hover:text-slate-600'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                    </button>
                    {openFilter === key && (
                      <ColFilterDropdown
                        colKey={key}
                        allValues={colValues[key] ?? []}
                        selected={colFilters[key] ?? new Set()}
                        onToggle={val => toggleFilterValue(key, val)}
                        onSelectAll={() => selectAll(key)}
                        onClear={() => clearFilter(key)}
                        onClose={() => setOpenFilter(null)}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filtered.map(project => {
              const sc = scoreColor(project.score);
              return (
                <tr
                  key={project.id}
                  onClick={() => onProjectSelect(project)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px] group-hover:text-slate-700">
                      {project.name}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-700 truncate max-w-[120px]">{project.country}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                    >
                      {project.score}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-600 truncate max-w-[130px]">{project.lifecycle}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-600 truncate max-w-[120px]">{project.operator}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-600 truncate max-w-[130px]">{project.contractor}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-500 truncate max-w-[100px]">{project.time_horizon}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-500 truncate max-w-[100px]">{project.region}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-block text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg truncate max-w-[110px]">
                      {project.asset_type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-slate-600 truncate max-w-[110px]">{project.build_phase}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-slate-300 group-hover:text-slate-500 transition-colors text-base">›</span>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Search className="w-6 h-6 opacity-30" />
                    <p className="text-sm font-medium">No results match your filters</p>
                    <button onClick={resetAll} className="text-xs text-lime-600 font-semibold hover:underline mt-1">
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignalTable;