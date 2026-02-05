import React, { useState, useMemo, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Score } from '../types';
import type { Project } from '../types';
import { CountryTooltip } from './CountryTooltip';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  projects: Project[];
  onCountryClick: (country: string | null) => void;
  selectedCountry: string | null;
}

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

const WorldMap: React.FC<WorldMapProps> = ({ projects, onCountryClick, selectedCountry }) => {
  const [tooltipData, setTooltipData] = useState<{
    data: { name: string; score: Score; projects: Project[] };
    position: { x: number; y: number };
  } | null>(null);

  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1
  });

  // 1. Aggregate Project Data
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

  // 2. Styling Logic - INCREASED CONTRAST
  const getFillColor = useCallback((geo: any): string => {
    const name = getCountryNameFromGeo(geo);
    const data = countryData[name];
    const isSelected = selectedCountry === name;

    if (!data) {
      // Darker grey for empty countries so they stand out from the water
      return "#e2e8f0"; // slate-200
    }

    if (isSelected) {
      return data.score === Score.HIGH ? '#15803d' : // green-700
             data.score === Score.MEDIUM ? '#ca8a04' : // yellow-600
             '#475569'; // slate-600
    }

    return data.score === Score.HIGH ? '#22c55e' : // green-500
           data.score === Score.MEDIUM ? '#eab308' : // yellow-500
           '#94a3b8'; // slate-400
  }, [countryData, selectedCountry]);

  const getStrokeColor = useCallback((geo: any): string => {
    const name = getCountryNameFromGeo(geo);
    const hasData = !!countryData[name];

    // If it has data, use white to pop against the color
    if (hasData) return "#ffffff";
    
    // If empty, use a visible grey border to define the coastline
    return "#cbd5e1"; // slate-300
  }, [countryData]);

  // 3. Event Handlers
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
        const targetPos = zoomPositions[name] || { coordinates: [0, 0], zoom: 2 };
        if (zoomPositions[name]) {
            setPosition(targetPos);
        } else {
             setPosition({ coordinates: [0, 20], zoom: 1 });
        }
      }
    } else {
      onCountryClick(null);
      setPosition({ coordinates: [0, 20], zoom: 1 });
    }
  }, [countryData, selectedCountry, onCountryClick]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden relative h-[500px]">
      <ComposableMap 
        projection="geoMercator"
        projectionConfig={{ 
          scale: 130, // Restored to 130 for perfect size
          center: [0, 20] 
        }} 
        width={800} 
        height={450}
        onMouseMove={handleMouseMove}
        className="w-full h-full bg-[#f8fafc]" // Slate-50 Water
      >
        <ZoomableGroup 
           center={position.coordinates} 
           zoom={position.zoom}
           onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) => setPosition(pos)}
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
                    onClick={() => handleClick(geo)}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: getFillColor(geo),
                        outline: "none",
                        stroke: getStrokeColor(geo),
                        strokeWidth: hasData ? 1 : 0.5,
                        transition: "all 300ms ease"
                      },
                      hover: {
                        fill: hasData ? "#1e293b" : "#cbd5e1", // dark slate vs mid slate
                        outline: "none",
                        cursor: hasData ? "pointer" : "default",
                        stroke: hasData ? "#fff" : "#94a3b8",
                        strokeWidth: hasData ? 1.5 : 0.5,
                        filter: hasData ? "brightness(1.1)" : "none"
                      },
                      pressed: {
                        fill: "#0f172a",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200 shadow-lg text-xs z-10">
        <h4 className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[10px]">Activity Levels</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></span>
            <span className="text-gray-600 font-medium">High Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm shadow-yellow-200"></span>
            <span className="text-gray-600 font-medium">Medium Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            <span className="text-gray-500">Low/Past</span>
          </div>
        </div>
      </div>

      {selectedCountry && (
        <button
          onClick={() => {
            onCountryClick(null);
            setPosition({ coordinates: [0, 20], zoom: 1 });
          }}
          className="absolute top-6 right-6 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 shadow-sm transition-colors flex items-center gap-2 z-10"
        >
          <span>Reset View</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      )}

      {tooltipData && (
        <CountryTooltip data={tooltipData.data} position={tooltipData.position} />
      )}
    </div>
  );
};

export default WorldMap;