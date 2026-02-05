import React from 'react';
import { X, Building, Calendar, DollarSign, Globe, Briefcase, Activity } from 'lucide-react';
import type { Project } from '../types';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
           <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
             {project.asset_type}
           </span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
          <Globe size={16} />
          <span>{project.country}, {project.region}</span>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Building size={16} />
              <span className="text-xs font-medium">Operator</span>
            </div>
            <p className="font-semibold text-gray-900">{project.operator}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Briefcase size={16} />
              <span className="text-xs font-medium">Contractor</span>
            </div>
            <p className="font-semibold text-gray-900">{project.contractor}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DollarSign size={16} />
              <span className="text-xs font-medium">Est. Value</span>
            </div>
            <p className="font-semibold text-gray-900">{project.est_value}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
             <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar size={16} />
              <span className="text-xs font-medium">Phase</span>
            </div>
            <p className="font-semibold text-gray-900">{project.build_phase}</p>
          </div>
        </div>

        {/* Intelligence Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              Project Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-white border border-gray-100 p-4 rounded-lg">
              {project.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Activity size={16} className="text-lime-600" />
              Sales Opportunity
            </h3>
            <div className="bg-[#f0fdf4] border border-green-100 p-4 rounded-lg">
              <p className="text-gray-800 text-sm font-medium">
                {project.opportunity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/30">
        <button className="w-full bg-[#111827] text-white font-semibold py-3 px-4 rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
          Unlock Full Report
          <span className="bg-white/20 text-xs px-2 py-0.5 rounded text-white ml-2">Premium</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectDrawer;