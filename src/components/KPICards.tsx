import React from 'react';
import { ClipboardList, Building2, Globe } from './Icons';
import { Stats } from '../types';

interface KPICardsProps {
  stats: Stats;
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Planning / Feed */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Planning / Feed</h3>
          <div className="text-4xl font-bold text-gray-900 mb-1">{stats.early_stage_count}</div>
          <p className="text-gray-500 text-sm">Projects in early stage</p>
        </div>
        <div className="bg-lime-50 p-3 rounded-lg">
          <ClipboardList className="w-6 h-6 text-lime-500" />
        </div>
      </div>

      {/* Card 2: Top EPC */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Top EPC</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.top_epc}</div>
          <p className="text-gray-500 text-sm">{stats.top_epc_desc}</p>
        </div>
        <div className="bg-teal-50 p-3 rounded-lg">
          <Building2 className="w-6 h-6 text-teal-500" />
        </div>
      </div>

      {/* Card 3: Lead Region */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Lead Region</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.lead_region}</div>
          <p className="text-gray-500 text-sm">{stats.lead_region_desc}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <Globe className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default KPICards;