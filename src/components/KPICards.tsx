import React from 'react';
import { Unlock, Sparkles, Layers, Flame } from 'lucide-react';
import type { Stats } from '../types';

interface KPICardsProps {
  stats: Stats;
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

      {/* Card 1 — Contractor Gap */}
      <div className="rounded-2xl border border-lime-100 bg-lime-50 shadow-sm p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-lime-100 shrink-0">
          <Unlock className="w-5 h-5 text-lime-700" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Contractor Gap
          </p>
          <h3 className="text-3xl font-black text-slate-900 leading-none my-1">
            {stats.contractor_gap}
          </h3>
          <p className="text-xs text-slate-400">
            Projects with no contractor assigned
          </p>
        </div>
      </div>

      {/* Card 2 — High Priority */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 shadow-sm p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-100 shrink-0">
          <Sparkles className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            High Priority
          </p>
          <h3 className="text-3xl font-black text-slate-900 leading-none my-1">
            {stats.high_priority}
          </h3>
          <p className="text-xs text-slate-400">
            FEED, Tender stage or Greenfield
          </p>
        </div>
      </div>

      {/* Card 3 — Phase Breakdown */}
      <div className="rounded-2xl border border-purple-100 bg-purple-50 shadow-sm p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-purple-100 shrink-0">
          <Layers className="w-5 h-5 text-purple-700" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Phase Breakdown
          </p>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                FEED
              </p>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {stats.feed_count}
              </p>
            </div>
            <div className="w-px h-8 bg-purple-200" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tender
              </p>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {stats.tender_count}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Early stage specification windows
          </p>
        </div>
      </div>

      {/* Card 4 — Hottest Region */}
      <div className="rounded-2xl border border-orange-100 bg-orange-50 shadow-sm p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-orange-100 shrink-0">
          <Flame className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Hottest Region
          </p>
          <h3 className="text-xl font-black text-slate-900 leading-tight my-1">
            {stats.hottest_region}
          </h3>
          <p className="text-xs text-slate-400">
            {stats.hottest_region_count} signals · most active region
          </p>
        </div>
      </div>

    </div>
  );
};

export default KPICards;