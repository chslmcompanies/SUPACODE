import React from 'react';
import { X, Globe, Building2, HardHat, Zap, Layers, Clock, CalendarDays, AlertCircle } from 'lucide-react';
import { Score } from '../types';
import type { Project } from '../types';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

function scoreColor(score: string) {
  if (score === Score.HIGH) return { bg: '#cce594', text: 'rgb(50,80,10)', border: '#a8c870' };
  if (score === Score.MEDIUM) return { bg: '#f4df9e', text: 'rgb(100,75,10)', border: '#e0c870' };
  return { bg: '#e2e8f0', text: '#475569', border: '#cbd5e1' };
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  if (!value || value === 'Unspecified' || value === '') return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </p>
      <p className="text-sm text-slate-800 font-medium leading-snug">{value}</p>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  if (!value || value.trim() === '') return null;
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
        {value}
      </p>
    </div>
  );
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose }) => {
  if (!project) return null;

  const sc = scoreColor(project.score);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed top-0 right-0 h-full w-[480px] max-w-full bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">

        {/* ── HEADER ── */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-white">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 leading-snug mb-2 pr-2">
              {project.name}
            </h2>

            {/* Score + Build Phase + Lifecycle — one line */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
              >
                {project.score}
              </span>
              {project.build_phase && project.build_phase !== 'Unspecified' && (
                <>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {project.build_phase}
                  </span>
                </>
              )}
              {project.lifecycle && project.lifecycle !== 'Unspecified' && (
                <>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {project.lifecycle}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Key fields grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <Field
              label="Operator"
              value={project.operator}
              icon={<Building2 className="w-3 h-3" />}
            />
            <Field
              label="Primary Contractor"
              value={project.contractor}
              icon={<HardHat className="w-3 h-3" />}
            />
            <Field
              label="Region"
              value={project.region}
              icon={<Globe className="w-3 h-3" />}
            />
            <Field
              label="Asset Type"
              value={project.asset_type}
              icon={<Layers className="w-3 h-3" />}
            />
            <Field
              label="Time Horizon"
              value={project.time_horizon}
              icon={<Clock className="w-3 h-3" />}
            />
            <Field
              label="Published Date"
              value={project.published_date
                ? new Date(project.published_date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })
                : ''}
              icon={<CalendarDays className="w-3 h-3" />}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Text blocks */}
          <TextBlock label="Project Description" value={project.description} />
          <TextBlock label="Technical Trigger" value={project.technical_trigger} />

          {/* Adhesives Opportunities — highlighted */}
          {project.opportunity && project.opportunity.trim() !== '' && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3 text-lime-600" />
                Adhesives Opportunities
              </p>
              <div className="bg-lime-50 border border-lime-200 rounded-xl p-4">
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {project.opportunity}
                </p>
              </div>
            </div>
          )}

          {/* Urgency if present */}
          {project.urgency && project.urgency.trim() !== '' && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                Urgency
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-slate-800 leading-relaxed">{project.urgency}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        {project.url && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-slate-900 hover:bg-black text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              View Source →
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDrawer;