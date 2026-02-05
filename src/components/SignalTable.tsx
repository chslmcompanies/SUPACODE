import React, { useState } from 'react';
import { Project, Score } from '../types';
import { ArrowUpDown, ExternalLink } from './Icons';

interface SignalTableProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

const SignalTable: React.FC<SignalTableProps> = ({ projects, onProjectSelect }) => {
  const [filterScore, setFilterScore] = useState<string>('All');

  const filteredProjects = projects.filter(project => {
    if (filterScore === 'All') return true;
    return project.score === filterScore;
  });

  const getScoreBadge = (score: Score) => {
    switch (score) {
      case Score.HIGH:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">High</span>;
      case Score.MEDIUM:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case Score.LOW:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Low</span>;
      default:
        return null;
    }
  };

  const getAssetColor = (type: string) => {
    if (type.includes('FLNG')) return 'text-teal-600';
    if (type.includes('FPSO')) return 'text-teal-600';
    if (type.includes('Offshore')) return 'text-teal-600';
    return 'text-teal-600'; // Default to the teal brand color for assets
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Signal Breakdown</h2>
          <p className="text-sm text-gray-500">{filteredProjects.length} active signals</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-500 font-medium">Score:</label>
          <div className="relative">
            <select 
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent cursor-pointer"
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
            >
              <option value="All">All</option>
              <option value={Score.HIGH}>High</option>
              <option value={Score.MEDIUM}>Medium</option>
              <option value={Score.LOW}>Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center cursor-pointer group">
                Published Date 
                <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400 group-hover:text-gray-600" />
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProjects.map((project) => (
              <tr 
                key={project.id} 
                onClick={() => onProjectSelect(project)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.country}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getAssetColor(project.asset_type)}`}>
                  {project.asset_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getScoreBadge(project.score)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.published_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          No signals found matching criteria.
        </div>
      )}
    </div>
  );
};

export default SignalTable;