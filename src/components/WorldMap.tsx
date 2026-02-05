import React, { useState, useMemo, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Globe, RotateCcw, Activity } from "lucide-react";
import { Score } from '../types';
import type { Project } from '../types';
import { CountryTooltip } from './CountryTooltip';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  projects: Project[];
  onCountryClick: (country: string | null) => void;
  selectedCountry: string | null;
}

// --- 1. CONFIGURATION ---

// Map configuration for "Smart Zoom"
const zoomPositions: Record<string, { coordinates: [number, number]; zoom: number }> = {
  "Nigeria": { coordinates: [8, 10], zoom: 4 },
  "Brazil": { coordinates: [-55, -10], zoom: 3 },
  "United States of America": { coordinates: [-100, 40], zoom: 3 },
  "United States": { coordinates: [-100, 40], zoom: 3 },
  "Guyana": { coordinates: [-59, 5], zoom: 5 },
  "United Kingdom": { coordinates: [-2, 54], zoom: 5 },
  "Mozambique": { coordinates: [35, -18], zoom: 4 },
  "Kazakhstan": { coordinates: [67, 48], zoom: 3 },
  "Australia": { coordinates: [134, -25], zoom: 3 },
  "Norway": { coordinates: [10, 62], zoom: 4 },
  "Ghana": { coordinates: [-1, 8], zoom: 5 },
  "Azerbaijan": { coordinates: [48, 40], zoom: 5 },
  "Argentina": { coordinates: [-64, -34], zoom: 3 },
  "Namibia": { coordinates: [17, -23], zoom: 5 },
  "Indonesia": { coordinates: [118, -2], zoom: 3 },
  "Canada": { coordinates: [-100, 60], zoom: 3 },
  "Falkland Islands": { coordinates: [-59, -51], zoom: 6 },
};

// Handle name mismatches between DB and Map
const mapNameMapping: Record<string, string> = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  "Great Britain": "United Kingdom",
};

export function WorldMap({ projects, onCountryClick, selectedCountry }: WorldMapProps) {
  // --- 2. STATE & DATA AGGREGATION ---
  
  const [tooltipData, setTooltipData] = useState<{
    data: { name: string; score: Score; projects: Project[] };
    position: { x: number; y: number };
  } | null>(null);

  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1
  });

  // Aggregate Project Data
  const countryData = useMemo(() => {
    const data: Record<string, { name: string; score: Score; projects: Project[] }> = {};
    
    projects.forEach(project => {
      const countryKey = project.country; 
      
      if (!data[countryKey]) {
        data[countryKey] = {
          name: countryKey,
          score: Score.LOW, 
          projects: []
        };
      }
      data[countryKey].projects.push(project);
      
      const currentScore = data[countryKey].score;
      if (project.score === Score.HIGH) {
        data[countryKey].score = Score.HIGH;
      } else if (project.score === Score.MEDIUM && currentScore !== Score.HIGH) {
        data[countryKey].score = Score.MEDIUM;
      }
    });
    return data;
  }, [projects]);

  const getCountryNameFromGeo = (geo: any): string => {
    const rawName = geo.properties.name;
    return mapNameMapping[rawName] || rawName;
  };

  // --- 3. STYLING LOGIC ---

  const getFillColor = useCallback((geo: any): string => {
    const name = getCountryNameFromGeo(geo);
    const data = countryData[name];
    const isSelected = selectedCountry === name;

    if (!data) {
      return "hsl(220, 14%, 92%)"; // Default muted color for empty countries
    }

    // Colors matched to the new Header Legend (Emerald/Amber/Slate)
    switch (data.score) {
      case Score.HIGH:
        return isSelected ? "hsl(142, 71%, 45%)" : "hsl(142, 71%, 50%)"; // Emerald
      case Score.MEDIUM:
        return isSelected ? "hsl(45, 93%, 50%)" : "hsl(45, 93%, 55%)";   // Amber
      case Score.LOW:
      default:
        return isSelected ? "hsl(220, 14%, 60%)" : "hsl(220, 14%, 70%)"; // Slate
    }
  }, [countryData, selectedCountry]);

  // --- 4. EVENT HANDLERS ---

  const handleMouseEnter = useCallback((geo: any, event: React.MouseEvent) => {
    const name = getCountryNameFromGeo(geo);
    if (countryData[name]) {
      setTooltipData({
        data: countryData[name],
        position: { x: event.clientX, y: event.clientY }
      });
    }
  }, [countryData]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (tooltipData) {
      setTooltipData(prev => prev ? {
        ...prev,
        position: { x: event.clientX, y: event.clientY }
      } : null);
    }
  }, [tooltipData]);

  const handleMouseLeave = useCallback(() => {
    setTooltipData(null);
  }, []);

  const handleClick = useCallback((geo: any) => {
    const name = getCountryNameFromGeo(geo);
    
    if (countryData[name]) {
      if (selectedCountry === name) {
        onCountryClick(null);
        setPosition({ coordinates: [0, 20], zoom: 1 });
      } else {
        onCountryClick(name);
        // Use your smart zoom positions
        const targetPos = zoomPositions[name] || { coordinates: [0, 0], zoom: 2 };
        if (zoomPositions[name]) {
            setPosition(targetPos);
        } else {
             setPosition({ coordinates: [0, 20], zoom: 1 });
        }
      }
    } else {
      // Allow clicking empty oceans/countries to reset
      onCountryClick(null);
      setPosition({ coordinates: [0, 20], zoom: 1 });
    }
  }, [countryData, selectedCountry, onCountryClick]);

  const handleResetView = useCallback(() => {
    onCountryClick(null);
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }, [onCountryClick]);

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  }, []);

  // --- 5. RENDER ---

  return (
    <div className="relative w-full h-[500px] bg-slate-50/50 rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm mb-8" onMouseMove={handleMouseMove}>
      
      {/* --- Floating Glass Header --- */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        
        {/* Left: Title & Context */}
        <div className="glass-card px-4 py-3 flex items-center gap-3 pointer-events-auto shadow-sm bg-white/80 backdrop-blur-md rounded-xl border border-white/20">
          <div className="p-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              Global Activity
              <Activity className="w-3 h-3 text-slate-400" />
            </h3>
            <p className="text-[11px] font-medium text-slate-500">Real-time project distribution</p>
          </div>
        </div>

        {/* Right: Legend & Controls */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Legend Bar */}
          <div className="glass-card px-5 py-2.5 flex items-center gap-6 shadow-sm bg-white/80 backdrop-blur-md rounded-xl border border-white/20">
             <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-600">High</span>
             </div>
             <div className="w-px h-3 bg-slate-200" /> {/* Divider */}
             <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 border border-amber-400/50"></span>
                <span className="text-xs font-medium text-slate-600">Medium</span>
             </div>
             <div className="w-px h-3 bg-slate-200" /> {/* Divider */}
             <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400 border border-slate-400/50"></span>
                <span className="text-xs font-medium text-slate-600">Low</span>
             </div>
          </div>

          {/* Conditional Reset Button */}
          {selectedCountry && (
            <button
              onClick={handleResetView}
              className="glass-card px-4 py-2 flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/80 hover:border-red-200 transition-all duration-300 group shadow-sm bg-white/80 backdrop-blur-md rounded-xl border border-white/20"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" />
              Reset View
            </button>
          )}
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = getCountryNameFromGeo(geo);
                const hasData = !!countryData[name];
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: getFillColor(geo),
                        stroke: "hsl(220, 13%, 85%)",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 0.2s ease"
                      },
                      hover: {
                        fill: hasData ? getFillColor(geo) : "hsl(220, 14%, 88%)",
                        stroke: hasData ? "hsl(174, 60%, 51%)" : "hsl(220, 13%, 85%)",
                        strokeWidth: hasData ? 1.5 : 0.5,
                        outline: "none",
                        cursor: hasData ? "pointer" : "default",
                        filter: hasData ? "brightness(1.05)" : "none"
                      },
                      pressed: {
                        fill: getFillColor(geo),
                        outline: "none"
                      }
                    }}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(geo)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      
      {tooltipData && (
        <CountryTooltip data={tooltipData.data} position={tooltipData.position} />
      )}
      
    </div>
  );
}