"use client";

import { useState } from "react";
import type { VenueMapDef } from "../data/venueMaps";

interface VenueMapProps {
  mapDef: VenueMapDef;
  selectedSectionId: string | null;
  onSectionSelect: (sectionId: string) => void;
}

export default function VenueMap({ mapDef, selectedSectionId, onSectionSelect }: VenueMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <svg viewBox={mapDef.viewBox} className="w-full h-auto" style={{ maxHeight: "340px" }}>
        <defs>
          {mapDef.sections.map((section) => (
            <radialGradient
              key={section.sectionId}
              id={`grad-${section.sectionId}`}
              cx="50%" cy="50%" r="60%"
            >
              <stop offset="0%" stopColor={section.color} stopOpacity="1" />
              <stop offset="100%" stopColor={section.color} stopOpacity="0.55" />
            </radialGradient>
          ))}

          {/* 選択時の強グロー */}
          <filter id="glow-strong" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* ホバー時のソフトグロー */}
          <filter id="glow-soft" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="ring-grad" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="100%" height="100%" fill="#09090b" />

        {/* 外周境界線 */}
        {mapDef.boundaryPath && (
          <path
            d={mapDef.boundaryPath}
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="pointer-events-none"
          />
        )}

        {mapDef.sections.map((section) => {
          const isSelected = section.sectionId === selectedSectionId;
          const isHovered = section.sectionId === hoveredId && !isSelected;
          return (
            <g
              key={section.sectionId}
              onClick={() => onSectionSelect(section.sectionId)}
              onMouseEnter={() => setHoveredId(section.sectionId)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer"
              style={{
                filter: isSelected
                  ? "url(#glow-strong)"
                  : isHovered
                  ? "url(#glow-soft)"
                  : "none",
              }}
            >
              {section.paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill={isSelected ? `url(#grad-${section.sectionId})` : section.color}
                  fillOpacity={isSelected ? 1 : isHovered ? 0.48 : 0.22}
                  fillRule={section.fillRule ?? "nonzero"}
                  stroke={section.color}
                  strokeWidth={isSelected ? 2 : isHovered ? 1.2 : 0.5}
                  strokeOpacity={isSelected ? 1 : isHovered ? 0.75 : 0.4}
                  style={{
                    transition:
                      "fill-opacity 0.18s ease, stroke-width 0.18s ease, stroke-opacity 0.18s ease",
                  }}
                />
              ))}
              {/* セクションラベル */}
              {section.labelX !== undefined && section.labelY !== undefined && (
                <text
                  x={section.labelX}
                  y={section.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontWeight={isSelected ? "700" : "400"}
                  fill={isSelected ? "#fff" : section.color}
                  fillOpacity={isSelected ? 1 : isHovered ? 0.9 : 0.55}
                  fontFamily="sans-serif"
                  className="pointer-events-none select-none"
                  style={{ transition: "fill-opacity 0.18s ease" }}
                >
                  {section.label}
                </text>
              )}
            </g>
          );
        })}

        <path
          d={mapDef.ringPath}
          fill="url(#ring-grad)"
          stroke="#475569"
          strokeWidth="1.5"
          className="pointer-events-none"
        />
        <text
          x={mapDef.cx}
          y={mapDef.cy + 4}
          textAnchor="middle"
          fontSize="8"
          fill="#64748b"
          fontFamily="sans-serif"
          letterSpacing="2"
          className="pointer-events-none select-none"
        >
          RING
        </text>
      </svg>

      {/* セクションボタン */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {mapDef.sections.map((section) => {
          const isSelected = section.sectionId === selectedSectionId;
          return (
            <button
              key={section.sectionId}
              onClick={() => onSectionSelect(section.sectionId)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: isSelected ? section.color : "transparent",
                color: isSelected ? "#fff" : section.color,
                border: `1.5px solid ${section.color}`,
                opacity: isSelected ? 1 : 0.6,
                boxShadow: isSelected ? `0 0 14px ${section.color}70, 0 0 4px ${section.color}40` : "none",
                transform: isSelected ? "scale(1.06)" : undefined,
              }}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
