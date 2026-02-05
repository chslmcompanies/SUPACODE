import React from 'react';
import { Score, Project } from '../types';

interface CountryTooltipProps {
  data: {
    name: string;
    score: Score;
    projects: Project[];
  };
  position: { x: number; y: number };
}

export const CountryTooltip: React.FC<CountryTooltipProps> = ({ data, position }) => {
  const isHigh = data.score === Score.HIGH;
  const isMedium = data.score === Score.MEDIUM;
  
  const badgeColor = isHigh 
    ? 'bg-green-100 text-green-800' 
    : isMedium 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-gray-100 text-gray-800';

  return (
    <div 
      className="fixed z-50 pointer-events-none glass-card rounded-lg p-3 w-64"
      style={{ 
        left: position.x + 10, 
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-900">{data.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
          {data.score}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-500 uppercase font-semibold">Active Projects ({data.projects.length})</div>
        <ul className="space-y-1">
          {data.projects.slice(0, 3).map(p => (
            <li key={p.id} className="text-sm text-gray-700 truncate">
              • {p.name}
            </li>
          ))}
          {data.projects.length > 3 && (
            <li className="text-xs text-gray-400 italic">
              + {data.projects.length - 3} more...
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};