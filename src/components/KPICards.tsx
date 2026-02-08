import React from 'react';
import { Target, TrendingUp, Activity, Globe } from 'lucide-react';
import type { Stats } from '../types';

interface KPICardsProps {
  stats: Stats;
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card 1 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Early Stage Opportunities</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.early_stage_count}</h3>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            +12% vs last month
          </span>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Target className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Top Contractor (EPC)</p>
          <h3 className="text-lg font-bold text-gray-900 truncate max-w-[140px]" title={stats.top_epc_name}>
            {stats.top_epc_name}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Value: {stats.top_epc_value}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      {/* Cards 3 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Regions</p>
          <h3 className="text-2xl font-bold text-gray-900">{stats.active_regions}</h3>
          <span className="text-xs text-gray-400 mt-2 inline-block">Global Coverage</span>
        </div>
        <div className="p-3 bg-amber-50 rounded-lg">
          <Globe className="w-6 h-6 text-amber-600" />
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Signal Intensity</p>
          <h3 className="text-2xl font-bold text-gray-900">High</h3>
          <span className="text-xs text-lime-600 bg-lime-50 px-2 py-0.5 rounded-full mt-2 inline-block">
            Optimal Engagement
          </span>
        </div>
        <div className="p-3 bg-lime-50 rounded-lg">
          <Activity className="w-6 h-6 text-lime-600" />
        </div>
      </div>
    </div>
  );
};

export default KPICards;