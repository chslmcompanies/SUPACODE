import React, { useRef, useState, useEffect } from 'react';
import { Unlock, Sparkles, Layers, Flame, CalendarDays, X, ChevronDown } from 'lucide-react';
import type { Stats } from '../types';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface KPICardsProps {
  stats: Stats;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const toInputVal = (d: Date | null) => {
  if (!d) return '';
  return d.toISOString().split('T')[0];
};

const KPICards: React.FC<KPICardsProps> = ({ stats, dateRange, onDateRangeChange }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasFilter = dateRange.start || dateRange.end;

  const clearRange = () => {
    onDateRangeChange({ start: null, end: null });
    setPickerOpen(false);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onDateRangeChange({ start: val ? new Date(val) : null, end: dateRange.end });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onDateRangeChange({ start: dateRange.start, end: val ? new Date(val) : null });
  };

  const rangeSummary = () => {
    if (!dateRange.start && !dateRange.end) return 'All Time';
    if (dateRange.start && dateRange.end)
      return `${fmtDate(dateRange.start)} – ${fmtDate(dateRange.end)}`;
    if (dateRange.start) return `From ${fmtDate(dateRange.start)}`;
    if (dateRange.end) return `Until ${fmtDate(dateRange.end)}`;
    return 'All Time';
  };

  return (
    <div className="mb-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Dashboard Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Metrics update based on insight publishing date
          </p>
        </div>

        {/* Date picker */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setPickerOpen(v => !v)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
              border shadow-sm transition-all
              ${hasFilter
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-gray-200 hover:border-slate-300 hover:text-slate-800'}
            `}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Insight Published:</span>
            <span className={hasFilter ? 'text-lime-300' : 'text-slate-400'}>
              {rangeSummary()}
            </span>
            {hasFilter ? (
              <span
                role="button"
                onClick={e => { e.stopPropagation(); clearRange(); }}
                className="ml-1 text-slate-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </span>
            ) : (
              <ChevronDown className={`w-3 h-3 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {pickerOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 w-72">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Filter by published date
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">From</label>
                  <input
                    type="date"
                    value={toInputVal(dateRange.start)}
                    max={toInputVal(dateRange.end) || undefined}
                    onChange={handleStartChange}
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
                    onChange={handleEndChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-800
                               focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400
                               bg-gray-50 transition-all"
                  />
                </div>
              </div>
              {hasFilter && (
                <button
                  onClick={clearRange}
                  className="mt-4 w-full text-xs font-semibold text-slate-500 hover:text-red-500
                             py-2 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50
                             transition-all"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-lime-100 bg-lime-50 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-lime-100 shrink-0">
            <Unlock className="w-5 h-5 text-lime-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contractor Gap</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none my-1">{stats.contractor_gap}</h3>
            <p className="text-xs text-slate-400">Projects with no contractor assigned</p>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 shrink-0">
            <Sparkles className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">High Priority</p>
            <h3 className="text-3xl font-black text-slate-900 leading-none my-1">{stats.high_priority}</h3>
            <p className="text-xs text-slate-400">
              FEED or Tender stage <span className="font-semibold text-slate-500">+</span> Greenfield
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 shrink-0">
            <Layers className="w-5 h-5 text-purple-700" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Phase Breakdown</p>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FEED</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{stats.feed_count}</p>
              </div>
              <div className="w-px h-8 bg-purple-200" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tender</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{stats.tender_count}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">Early stage specification windows</p>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-100 shrink-0">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Hottest Region</p>
            <h3 className="text-xl font-black text-slate-900 leading-tight my-1">{stats.hottest_region}</h3>
            <p className="text-xs text-slate-400">{stats.hottest_region_count} signals · most active region</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICards;