import React, { useState, useMemo } from 'react';
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

// Interfaces for React Simple Maps interaction
interface GeoProperties {
  name: string;
  [key: string]: any;
}

interface GeoObject {
  rsmKey: string;
  properties: GeoProperties;
}

interface Position {
  coordinates: [number, number];
  zoom: number;
}

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

  const [position, setPosition] = useState<Position>({
    coordinates: [0, 20],
    zoom: 1
  });

  const countryData = useMemo(() => {
    const data: Record<string, { name: string; score: Score; projects: Project[] }> = {};
    
    projects.forEach(project => {
      if (!data[project.country]) {
        data[project.country] = {
          name: project.country,
          score: Score.LOW, 
          projects: []
        };
      }
      data[project.country].projects.push(project);
      
      const currentScore = data[project.country].score;
      if (project.score === Score.HIGH) {
        data[project.country].score = Score.HIGH;
      } else if (project.score === Score.MEDIUM && currentScore !== Score.HIGH) {
        data[project.country].score = Score.MEDIUM;
      }
    });
    return data;
  }, [projects]);

  const getCountryNameFromGeo = (geo: GeoObject): string => {
    const rawName = geo.properties.name;
    return mapNameMapping[rawName] || rawName;
  };

  const getFillColor = (geo: GeoObject): string => {
    const name = getCountryNameFromGeo(geo);
    const data = countryData[name];
    const isSelected = selectedCountry === name;

    if (!data) {
      return "#e2e8f0";
    }

    if (isSelected) {
      return data.score === Score.HIGH ? '#15803d' : 
             data.score === Score.MEDIUM ? '#a16207' : 
             '#4b5563';
    }

    return data.score === Score.HIGH ? '#22c55e' : 
           data.score === Score.MEDIUM ? '#facc15' : 
           '#9ca3af';
  };

  const handleMouseEnter = (geo: GeoObject, event: React.MouseEvent) => {
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

  const handleClick = (geo: GeoObject) => {
    const name = getCountryNameFromGeo(geo);
    if (countryData[name]) {
      if (selectedCountry === name) {
        onCountryClick(null);
        setPosition({ coordinates: [0, 20], zoom: 1 });
      } else {
        onCountryClick(name);
      }
    } else {
        onCountryClick(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-8 overflow-hidden relative h-[400px]">
      <ComposableMap 
        projectionConfig={{ scale: 147 }} 
        width={800} 
        height={400}
        onMouseMove={handleMouseMove}
      >
        <ZoomableGroup 
           center={position.coordinates} 
           zoom={position.zoom}
           onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) => setPosition(pos)}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(geo as GeoObject)}
                  onMouseEnter={(e: React.MouseEvent) => handleMouseEnter(geo as GeoObject, e)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: {
                      fill: getFillColor(geo as GeoObject),
                      outline: "none",
                      stroke: "#fff",
                      strokeWidth: 0.5,
                      transition: "all 250ms"
                    },
                    hover: {
                      fill: countryData[getCountryNameFromGeo(geo as GeoObject)] ? "#111827" : "#cbd5e1",
                      outline: "none",
                      cursor: countryData[getCountryNameFromGeo(geo as GeoObject)] ? "pointer" : "default"
                    },
                    pressed: {
                      fill: "#111827",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span className="text-gray-600">High Activity</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="text-gray-600">Medium Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
          <span className="text-gray-600">Low/Past</span>
        </div>
      </div>

      {tooltipData && (
        <CountryTooltip data={tooltipData.data} position={tooltipData.position} />
      )}
    </div>
  );
};

export default WorldMap;