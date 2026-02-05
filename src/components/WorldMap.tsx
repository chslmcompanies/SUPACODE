import React, { useState, useCallback, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Project, Score } from '../types';
import { ArrowLeft } from './Icons';
import { CountryTooltip } from './CountryTooltip';

// Using a standard TopoJSON file for accurate world geography
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  projects: Project[];
  onCountryClick: (country: string | null) => void;
  selectedCountry: string | null;
}

// Helper to normalize country names between Data and Map Topology
const mapNameMapping: Record<string, string> = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  "Great Britain": "United Kingdom",
  // Add others if needed
};

// Reverse mapping for zooming/selecting
const reverseNameMapping: Record<string, string> = {
  "United States": "United States of America",
  // Map topology name -> My Data Name
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

  // Aggregate project data by country
  const countryData = useMemo(() => {
    const data: Record<string, { name: string; score: Score; projects: Project[] }> = {};
    
    projects.forEach(project => {
      if (!data[project.country]) {
        data[project.country] = {
          name: project.country,
          score: Score.LOW, // Start low, upgrade if high value found
          projects: []
        };
      }
      data[project.country].projects.push(project);
      
      // Determine highest score for the country
      const currentScore = data[project.country].score;
      if (project.score === Score.HIGH) {
        data[project.country].score = Score.HIGH;
      } else if (project.score === Score.MEDIUM && currentScore !== Score.HIGH) {
        data[project.country].score = Score.MEDIUM;
      }
    });
    return data;
  }, [projects]);

  const getCountryNameFromGeo = (geo: any) => {
    const rawName = geo.properties.name;
    return mapNameMapping[rawName] || rawName;
  };

  const getFillColor = (geo: any) => {
    const name = getCountryNameFromGeo(geo);
    const data = countryData[name];
    const isSelected = selectedCountry === name;

    if (!data) {
      return "#e2e8f0"; // slate-200 for inactive
    }

    if (isSelected) {
      return data.score === Score.HIGH ? '#15803d' : // green-700
             data.score === Score.MEDIUM ? '#a16207' : // yellow-700
             '#4b5563'; // gray-600
    }

    // Default active colors
    return data.score === Score.HIGH ? '#22c55e' : // brand-green
           data.score === Score.MEDIUM ? '#facc15' : // brand-yellow
           '#9ca3af'; // gray-400
  };

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const name = getCountryNameFromGeo(geo);
    if (countryData[name]) {
      setTooltipData({
        data: countryData[name],
        position: { x: event.clientX, y: event.clientY }
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltipData) {
      setTooltipData(prev => prev ? {
        ...prev,
        position: { x: event.clientX, y: event.clientY }
      } : null);
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const handleClick = (geo: any) => {
    const name = getCountryNameFromGeo(geo);
    if (countryData[name]) {
      if (selectedCountry === name) {
        onCountryClick(null);
        setPosition({ coordinates: [0, 20], zoom: 1 });
      } else {
        onCountryClick(name);
        // Zoom Logic based on region
        // Simplified centroids for key demo regions
        const zoomConfig: Record<string, { coordinates: [number, number]; zoom: number }> = {
          "United States": { coordinates: [-95, 38], zoom: 2.5 },
          "Brazil": { coordinates: [-55, -10], zoom: 2.5 },
          "Nigeria": { coordinates: [8, 10], zoom: 4 },
          "Mozambique": { coordinates: [35, -18], zoom: 4 },
          "Australia": { coordinates: [134, -25], zoom: 2.5 },
          "United Kingdom": { coordinates: [-2, 54], zoom: 5 },
          "Norway": { coordinates: [10, 62], zoom: 4 },
        };
        setPosition(zoomConfig[name] || { coordinates: [0, 20], zoom: 1 });
      }
    } else {
        // Allow clearing selection by clicking empty ocean or non-active country?
        // Maybe better to keep selection if clicking irrelevant country
        // onCountryClick(null);
        // setPosition({ coordinates: [0, 20], zoom: 1 });
    }
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8 relative">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Global Signal Map</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedCountry ? `Viewing Region: ${selectedCountry}` : 'Interactive Visualization'}
          </p>
        </div>
        <div className="flex items-center space-x-6 text-xs font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-sm"></span>High Priority</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2 shadow-sm"></span>Medium Priority</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2 shadow-sm"></span>Low Priority</div>
        </div>
      </div>

      <div 
        className="w-full h-[450px] bg-[#f8fafc] rounded-xl overflow-hidden relative border border-gray-100"
        onMouseMove={handleMouseMove}
      >
        {selectedCountry && (
          <button 
            onClick={() => {
              onCountryClick(null);
              setPosition({ coordinates: [0, 20], zoom: 1 });
            }}
            className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center transition-all z-10 text-gray-700 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Reset View
          </button>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20]
          }}
          className="w-full h-full outline-none"
        >
          {/* Subtle Grid Pattern Background implemented via defs in svg if needed, but react-simple-maps renders svg */}
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={8}
            filterZoomEvent={(evt) => {
                // Prevent scrolling page from zooming map unexpectedly, only zoom on specific intent or if we want scroll zoom
                // Often better to disable scroll zoom in dashboards unless focused
                return true; 
            }}
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
                      fill={getFillColor(geo)}
                      stroke="#f8fafc"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 0.3s ease"
                        },
                        hover: {
                          fill: hasData ? getFillColor(geo) : "#cbd5e1",
                          stroke: hasData ? "#ffffff" : "#f8fafc",
                          strokeWidth: hasData ? 1.5 : 0.5,
                          outline: "none",
                          cursor: hasData ? "pointer" : "default",
                          filter: hasData ? "brightness(1.05)" : "none"
                        },
                        pressed: {
                          outline: "none",
                          fill: hasData ? getFillColor(geo) : "#e2e8f0"
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
    </div>
  );
};

export default WorldMap;