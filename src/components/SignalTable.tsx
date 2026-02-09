import React, { useState, useMemo } from 'react';
import { ChevronRight, Building2, MapPin, Search, FilterX } from 'lucide-react';
import { Score } from '../types';
import type { Project } from '../types';

interface SignalTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const SignalTable: React.FC<SignalTableProps> = ({ projects, onProjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filter Logic: Checks if the search term matches Name, Country, or Operator
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.country.toLowerCase().includes(searchLower) ||
        project.operator.toLowerCase().includes(searchLower)
      );
    });
  }, [projects, searchTerm]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* HEADER & SEARCH BAR */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
            Priority Signals
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
            {filteredProjects.length} Result{filteredProjects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search projects, countries..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FilterX size={14} />
            </button>
          )}
        </div>
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
            {filteredProjects.map((project) => (
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
            
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Search size={24} className="opacity-20" />
                    <p className="text-sm">No results found for "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="text-xs text-lime-600 font-semibold hover:underline"
                    >
                      Clear search
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