import React from 'react';
import { Project, Score } from '../types';
import { X, ExternalLink, MapPin, Building2, HardHat, Factory } from './Icons';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose }) => {
  // Styles based on the boolean existence of 'project' are handled in parent or via css transform
  // Here we just render the content if project exists
  
  if (!project) return null;

  return (
    <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Project Details</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Title Section */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              project.score === Score.HIGH ? 'bg-green-100 text-green-800' :
              project.score === Score.MEDIUM ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {project.score}
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {project.country}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Est. Value</div>
            <div className="text-lg font-bold text-gray-900">{project.est_value}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-xs text-gray-500 font-semibold uppercase mb-1 flex items-center">
              <Factory className="w-3 h-3 mr-1" />
              Build Phase
            </div>
            <div className="text-lg font-bold text-teal-600">{project.build_phase}</div>
          </div>
        </div>

        {/* Operator */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-xs text-gray-500 font-semibold uppercase mb-2 flex items-center">
            <Building2 className="w-3 h-3 mr-1" />
            Operator
          </div>
          <div className="text-base font-bold text-gray-900">{project.operator}</div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs text-gray-500 font-bold uppercase mb-2">Project Description</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Opportunities Box */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <h4 className="text-xs text-yellow-700 font-bold uppercase mb-2">Adhesives Opportunities</h4>
          <p className="text-sm text-yellow-900 leading-relaxed">
            {project.opportunity}
          </p>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center"><HardHat className="w-4 h-4 mr-2" /> Primary Contractor</span>
            <span className="font-medium text-gray-900">{project.contractor}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Published Date</span>
            <span className="font-medium text-gray-900">{project.published_date}</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-[#bef264] hover:bg-[#a3e635] text-lime-950 font-semibold py-3 px-4 rounded-lg shadow-sm flex items-center justify-center transition-colors">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Full Report
        </button>
      </div>
    </div>
  );
};

export default ProjectDrawer;