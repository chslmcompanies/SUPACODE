import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Globe, RotateCcw } from "lucide-react";
import { Score } from '../types';
import type { Project } from '../types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  projects: Project[];
  onCountryClick: (country: string | null) => void;
  selectedCountry: string | null;
}

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

const mapNameMapping: Record<string, string> = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  "Great Britain": "United Kingdom",
};

interface TooltipData {
  name: string;
  score: string;
  projects: Project[];
  position: { x: number; y: number };
}

export function WorldMap({ projects, onCountryClick, selectedCountry }: WorldMapProps) {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  });

  const countryData = useMemo(() => {
    const data: Record<string, { name: string; score: string; projects: Project[]; count: number }> = {};
    projects.forEach((project) => {
      const key = project.country;
      if (!data[key]) {
        data[key] = { name: key, score: Score.LOW, projects: [], count: 0 };
      }
      data[key].projects.push(project);
      data[key].count++;
      if (project.score === Score.HIGH) data[key].score = Score.HIGH;
      else if (project.score === Score.MEDIUM && data[key].score !== Score.HIGH)
        data[key].score = Score.MEDIUM;
    });
    return data;
  }, [projects]);

  const getCountryNameFromGeo = (geo: { properties: { name: string } }): string => {
    const rawName = geo.properties.name;
    return mapNameMapping[rawName] || rawName;
  };

  const getFillColor = useCallback(
    (geo: { properties: { name: string } }): string => {
      const name = getCountryNameFromGeo(geo);
      const data = countryData[name];
      const isSelected = selectedCountry === name;
      if (!data) return "hsl(220, 14%, 91%)";
      switch (data.score) {
        case Score.HIGH:
          return isSelected ? "#b8d980" : "#cce594";
        case Score.MEDIUM:
          return isSelected ? "#e8cf7a" : "#f4df9e";
        default:
          return isSelected ? "hsl(220, 14%, 58%)" : "hsl(220, 14%, 68%)";
      }
    },
    [countryData, selectedCountry]
  );

  const showTooltip = useCallback(
    (name: string, data: { score: string; projects: Project[]; count: number }, event: React.MouseEvent) => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      setTooltipData({ name, score: data.score, projects: data.projects, position: { x: event.clientX, y: event.clientY } });
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (tooltipData) {
        setTooltipData((prev) =>
          prev ? { ...prev, position: { x: event.clientX, y: event.clientY } } : null
        );
      }
    },
    [tooltipData]
  );

  const hideTooltip = useCallback(() => {
    tooltipTimeout.current = setTimeout(() => setTooltipData(null), 180);
  }, []);

  const handleGeoClick = useCallback(
    (geo: { properties: { name: string } }) => {
      const name = getCountryNameFromGeo(geo);
      if (countryData[name]) {
        if (selectedCountry === name) {
          onCountryClick(null);
          setPosition({ coordinates: [0, 20], zoom: 1 });
        } else {
          onCountryClick(name);
          setPosition(zoomPositions[name] || { coordinates: [0, 20], zoom: 2 });
        }
      } else {
        onCountryClick(null);
        setPosition({ coordinates: [0, 20], zoom: 1 });
      }
    },
    [countryData, selectedCountry, onCountryClick]
  );

  const handleResetView = useCallback(() => {
    onCountryClick(null);
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }, [onCountryClick]);

  const handleMoveEnd = useCallback(
    (pos: { coordinates: [number, number]; zoom: number }) => setPosition(pos),
    []
  );

  return (
    <div className="mb-8">
      <div
        className="relative w-full h-[460px] bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-visible border border-slate-200/70 shadow-sm"
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 85%, rgba(14,165,233,0.08) 0%, transparent 55%), radial-gradient(ellipse at 85% 15%, rgba(99,102,241,0.06) 0%, transparent 55%)",
          }}
        />

        {/* TOP LEFT */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-sm">
          <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">Global Signal Map</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Click a country to filter signals</p>
          </div>
        </div>

        {/* TOP RIGHT */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <div className="flex items-center gap-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: '#cce594' }} />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#cce594' }} />
              </span>
              <span className="text-[11px] font-semibold text-slate-600">High</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#f4df9e' }} />
              <span className="text-[11px] font-semibold text-slate-600">Medium</span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
              <span className="text-[11px] font-semibold text-slate-600">Low</span>
            </div>
          </div>

          {selectedCountry && (
            <button
              onClick={handleResetView}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50/80 transition-all shadow-sm group"
            >
              <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" />
              Reset · <span className="text-slate-400 font-medium">{selectedCountry}</span>
            </button>
          )}
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 130, center: [0, 20] }}
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
                          stroke: "hsl(220,13%,84%)",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "fill 0.2s ease",
                        },
                        hover: {
                          fill: hasData ? getFillColor(geo) : "hsl(220,14%,87%)",
                          stroke: hasData ? "hsl(174,60%,42%)" : "hsl(220,13%,84%)",
                          strokeWidth: hasData ? 1.5 : 0.5,
                          outline: "none",
                          cursor: hasData ? "pointer" : "default",
                          filter: hasData ? "brightness(1.06)" : "none",
                        },
                        pressed: { fill: getFillColor(geo), outline: "none" },
                      }}
                      onMouseEnter={(e) => hasData && showTooltip(name, countryData[name], e)}
                      onMouseLeave={hideTooltip}
                      onClick={() => handleGeoClick(geo)}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* TOOLTIP */}
        {tooltipData && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltipData.position.x + 16, top: tooltipData.position.y - 12 }}
          >
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-64">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{tooltipData.name}</p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-700"
                  style={{
                    backgroundColor:
                      tooltipData.score === Score.HIGH ? "#cce594"
                      : tooltipData.score === Score.MEDIUM ? "#f4df9e"
                      : "#e2e8f0",
                  }}
                >
                  {tooltipData.score}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                  <p className="text-lg font-black text-slate-900 leading-none">{tooltipData.projects.length}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">signals</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-lg font-black text-slate-900 leading-none">
                    {tooltipData.projects.filter((p) => p.score === Score.HIGH).length}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">high priority</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-lg font-black text-slate-900 leading-none">
                    {new Set(tooltipData.projects.map((p) => p.asset_type)).size}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">asset types</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {tooltipData.projects.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-start justify-between gap-2">
                    <p className="text-xs text-slate-700 font-medium truncate flex-1">{p.name}</p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{p.build_phase}</span>
                  </div>
                ))}
                {tooltipData.projects.length > 3 && (
                  <p className="text-[10px] text-slate-400 font-medium pt-1">
                    +{tooltipData.projects.length - 3} more · click to filter
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}