import React from 'react';
import { Score } from '../types';
import type { Project } from '../types';

interface CountryTooltipProps {
  data: {
    name: string;
    score: Score;
    projects: Project[];
  };
  position: {
    x: number;
    y: number;
  };
}

export const CountryTooltip: React.FC<CountryTooltipProps> = ({ data, position }) => {
  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-100 p-4 w-72 pointer-events-none"
      style={{ 
        left: position.x + 20, 
        top: position.y - 20,
      }}
    >
      <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
        <h3 className="font-bold text-gray-900">{data.name}</h3>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          data.score === Score.HIGH ? 'bg-green-100 text-green-700' :
          data.score === Score.MEDIUM ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-600'
        }`}>
          {data.score} Activity
        </span>
      </div>
      
      <div className="space-y-3">
        {data.projects.slice(0, 3).map(project => (
          <div key={project.id} className="text-sm">
            <div className="font-medium text-gray-800 mb-0.5">{project.name}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{project.est_value}</span>
              <span>{project.asset_type}</span>
            </div>
          </div>
        ))}
        {data.projects.length > 3 && (
          <div className="text-xs text-gray-400 font-medium pt-1">
            + {data.projects.length - 3} more projects
          </div>
        )}
      </div>
    </div>
  );
};