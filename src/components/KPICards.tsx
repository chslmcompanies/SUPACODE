import React, { useState } from 'react';
import { Target, Sparkles, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Project, Stats } from '../types';

interface KPICardsProps {
  stats: Stats;
  projects: Project[];
}

const KPICards: React.FC<KPICardsProps> = ({ stats, projects }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getCardDetails = (id: string) => {
    if (id === 'planning') {
      return projects.filter(p => (p.build_phase || '').toLowerCase().includes('planning') || (p.build_phase || '').toLowerCase().includes('feed')).slice(0, 3);
    }
    if (id === 'new') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return projects.filter(p => new Date(p.published_date) >= sevenDaysAgo).slice(0, 3);
    }
    if (id === 'open') {
      return projects.filter(p => !p.contractor || p.contractor.toLowerCase() === 'unspecified').slice(0, 3);
    }
    return [];
  };

  const cards = [
    { id: 'planning', label: 'Planning & FEED', value: stats.early_stage_count, icon: <Target className="w-5 h-5 text-lime-700" />, color: 'bg-lime-50 border-lime-100' },
    { id: 'new', label: 'New This Week', value: stats.active_regions, icon: <Sparkles className="w-5 h-5 text-blue-700" />, color: 'bg-blue-50 border-blue-100' },
    { id: 'open', label: 'Open Opportunities', value: stats.top_epc_value, icon: <UserPlus className="w-5 h-5 text-purple-700" />, color: 'bg-purple-50 border-purple-100' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
      {cards.map((card) => {
        const isExpanded = expandedCard === card.id;
        const details = getCardDetails(card.id);

        return (
          <div key={card.id} className={`rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all ${card.color}`}>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">{card.icon}</div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">{card.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{card.value}</h3>
                </div>
              </div>
              <button onClick={() => setExpandedCard(isExpanded ? null : card.id)} className="p-1 hover:bg-white/50 rounded-full">
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {isExpanded && (
              <div className="px-5 pb-5 pt-2 space-y-3 bg-white/40 border-t border-black/5">
                {details.map((p) => (
                  <div key={p.id} className="flex flex-col border-l-2 border-slate-300 pl-3">
                    <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500">{p.operator}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;