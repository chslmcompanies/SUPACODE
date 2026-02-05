import React from 'react';
import { ChevronRight, Building2, MapPin } from 'lucide-react';
import { Score } from '../types';
import type { Project } from '../types';

interface SignalTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const SignalTable: React.FC<SignalTableProps> = ({ projects, onProjectSelect }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
          Priority Signals
        </h2>
        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
          {projects.length} Active Leads
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-3 font-semibold">Project Name</th>
              <th className="px-6 py-3 font-semibold">Location</th>
              <th className="px-6 py-3 font-semibold">Stage / Value</th>
              <th className="px-6 py-3 font-semibold">Signal Score</th>
              <th className="px-6 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                onClick={() => onProjectSelect(project)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">{project.operator}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      {project.country}
                    </span>
                    <span className="text-xs text-gray-500 pl-5">{project.region}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{project.build_phase}</span>
                    <span className="text-xs text-gray-500">{project.est_value} USD</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    project.score === Score.HIGH ? 'bg-green-50 text-green-700 border-green-200' :
                    project.score === Score.MEDIUM ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {project.score}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-lime-600 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
            
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No signals found for this region.
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