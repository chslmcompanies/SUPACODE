import React, { useEffect, useState } from 'react';
import KPICards from './components/KPICards';
import WorldMap from './components/WorldMap';
import SignalTable from './components/SignalTable';
import ProjectDrawer from './components/ProjectDrawer';
import type { Project, Stats } from './types';
import { fetchProjects, fetchStats } from './services/supabaseService';
import { Search } from './components/Icons';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, statsData] = await Promise.all([
          fetchProjects(),
          fetchStats()
        ]);
        setProjects(projectsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter projects based on map selection
  const displayedProjects = filterCountry 
    ? projects.filter(p => p.country === filterCountry)
    : projects;

  const handleCountryClick = (country: string | null) => {
    setFilterCountry(country);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative">
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Logo Icon */}
            <div className="bg-[#bef264] p-2.5 rounded-xl shadow-sm border border-lime-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 font-bold text-lg leading-tight tracking-tight">Early Lead Signal Radar</h1>
              <span className="text-gray-500 text-xs font-medium mt-0.5">Oil & Gas Global Intelligence Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#bef264]"></span>
            </span>
            <span className="text-xs font-semibold text-gray-600">Live Data</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
          </div>
        ) : (
          <>
            {stats && <KPICards stats={stats} />}
            <WorldMap 
              projects={projects} 
              onCountryClick={handleCountryClick} 
              selectedCountry={filterCountry}
            />
            <SignalTable 
              projects={displayedProjects}
              onProjectSelect={handleProjectSelect}
            />
          </>
        )}
      </main>

      {/* Slide Over Drawer */}
      {/* Overlay */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSelectedProject(null)}
        />
      )}
      
      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${selectedProject ? 'translate-x-0' : 'translate-x-full'}`}>
        <ProjectDrawer 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </div>

    </div>
  );
};

export default App;