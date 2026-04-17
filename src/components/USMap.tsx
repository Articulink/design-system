'use client';

import { forwardRef, useMemo, useState, useCallback } from 'react';

/**
 * Articulink USMap Component
 *
 * Interactive US state choropleth map for visualizing geographic data.
 * Uses Albers USA projection with properly positioned state paths.
 */

export interface USMapDataPoint {
  state: string;
  value: number;
  label?: string;
}

export interface USMapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  data: USMapDataPoint[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  colorScale?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  emptyColor?: string;
  onStateClick?: (state: string, data?: USMapDataPoint) => void;
  selectedState?: string;
  highlightStates?: string[];
  minHeight?: number;
}

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'Washington D.C.',
};

// State coordinates for a simplified grid-based US map
// This creates a clean, recognizable layout without complex SVG paths
const STATE_GRID: Record<string, { row: number; col: number; width?: number; height?: number }> = {
  // Row 0
  AK: { row: 0, col: 0 },
  // Row 1
  WA: { row: 1, col: 1 },
  MT: { row: 1, col: 2 },
  ND: { row: 1, col: 3 },
  MN: { row: 1, col: 4 },
  WI: { row: 1, col: 5 },
  MI: { row: 1, col: 7 },
  // Row 2
  OR: { row: 2, col: 1 },
  ID: { row: 2, col: 2 },
  SD: { row: 2, col: 3 },
  IA: { row: 2, col: 4 },
  IL: { row: 2, col: 5 },
  IN: { row: 2, col: 6 },
  OH: { row: 2, col: 7 },
  PA: { row: 2, col: 8 },
  NY: { row: 2, col: 9 },
  VT: { row: 1, col: 9 },
  NH: { row: 1, col: 10 },
  ME: { row: 0, col: 10 },
  MA: { row: 2, col: 10 },
  RI: { row: 3, col: 10 },
  CT: { row: 3, col: 9 },
  // Row 3
  NV: { row: 3, col: 1 },
  WY: { row: 3, col: 2 },
  NE: { row: 3, col: 3 },
  MO: { row: 3, col: 4 },
  KY: { row: 3, col: 6 },
  WV: { row: 3, col: 7 },
  VA: { row: 3, col: 8 },
  NJ: { row: 3, col: 8.5 },
  MD: { row: 4, col: 8.5 },
  DE: { row: 4, col: 9 },
  // Row 4
  CA: { row: 4, col: 0 },
  UT: { row: 4, col: 1 },
  CO: { row: 4, col: 2 },
  KS: { row: 4, col: 3 },
  AR: { row: 4, col: 4 },
  TN: { row: 4, col: 5 },
  NC: { row: 4, col: 7 },
  SC: { row: 5, col: 7.5 },
  // Row 5
  AZ: { row: 5, col: 1 },
  NM: { row: 5, col: 2 },
  OK: { row: 5, col: 3 },
  LA: { row: 5, col: 4 },
  MS: { row: 5, col: 5 },
  AL: { row: 5, col: 6 },
  GA: { row: 5, col: 7 },
  // Row 6
  HI: { row: 6, col: 0 },
  TX: { row: 6, col: 2, width: 1.5, height: 1.5 },
  FL: { row: 6, col: 7 },
  DC: { row: 4, col: 8 },
};

const COLOR_SCALES: Record<string, string[]> = {
  blue: ['#EFF6FF', '#BFDBFE', '#60A5FA', '#2563EB', '#1E40AF'],
  green: ['#ECFDF5', '#A7F3D0', '#34D399', '#059669', '#047857'],
  orange: ['#FFF7ED', '#FED7AA', '#FB923C', '#EA580C', '#C2410C'],
  red: ['#FEF2F2', '#FECACA', '#F87171', '#DC2626', '#991B1B'],
  purple: ['#FAF5FF', '#E9D5FF', '#A855F7', '#7C3AED', '#5B21B6'],
};

function getColorForValue(value: number, min: number, max: number, colorScale: string[]): string {
  if (value === 0) return colorScale[0];
  if (max === min) return colorScale[Math.floor(colorScale.length / 2)];
  const normalized = (value - min) / (max - min);
  const index = Math.min(Math.floor(normalized * (colorScale.length - 1)) + 1, colorScale.length - 1);
  return colorScale[index];
}

const CELL_SIZE = 50;
const CELL_GAP = 4;
const PADDING = 20;

export const USMap = forwardRef<HTMLDivElement, USMapProps>(
  (
    {
      data,
      title,
      subtitle,
      showLegend = true,
      showTooltip = true,
      colorScale = 'blue',
      emptyColor = '#F1F5F9',
      onStateClick,
      selectedState,
      highlightStates = [],
      minHeight = 400,
      className = '',
      ...props
    },
    ref
  ) => {
    const [hoveredState, setHoveredState] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const dataMap = useMemo(() => {
      const map = new Map<string, USMapDataPoint>();
      data.forEach((d) => map.set(d.state.toUpperCase(), d));
      return map;
    }, [data]);

    const { min, max } = useMemo(() => {
      const values = data.map((d) => d.value).filter((v) => v > 0);
      return {
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 1,
      };
    }, [data]);

    const colors = COLOR_SCALES[colorScale] || COLOR_SCALES.blue;

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }, []);

    const handleStateClick = useCallback(
      (stateCode: string) => {
        if (onStateClick) {
          onStateClick(stateCode, dataMap.get(stateCode));
        }
      },
      [onStateClick, dataMap]
    );

    const hoveredData = hoveredState ? dataMap.get(hoveredState) : null;

    // Calculate SVG dimensions
    const maxCol = Math.max(...Object.values(STATE_GRID).map(s => s.col + (s.width || 1)));
    const maxRow = Math.max(...Object.values(STATE_GRID).map(s => s.row + (s.height || 1)));
    const svgWidth = maxCol * (CELL_SIZE + CELL_GAP) + PADDING * 2;
    const svgHeight = maxRow * (CELL_SIZE + CELL_GAP) + PADDING * 2;

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="font-semibold text-abyss">{title}</h3>}
            {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1" style={{ minHeight }}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full"
              onMouseMove={handleMouseMove}
              style={{ maxHeight: minHeight }}
            >
              {Object.entries(STATE_GRID).map(([stateCode, pos]) => {
                const stateData = dataMap.get(stateCode);
                const value = stateData?.value ?? 0;
                const isSelected = selectedState === stateCode;
                const isHighlighted = highlightStates.includes(stateCode);
                const isHovered = hoveredState === stateCode;

                let fill = emptyColor;
                if (value > 0) {
                  fill = getColorForValue(value, min, max, colors);
                }

                const x = PADDING + pos.col * (CELL_SIZE + CELL_GAP);
                const y = PADDING + pos.row * (CELL_SIZE + CELL_GAP);
                const width = (pos.width || 1) * CELL_SIZE + ((pos.width || 1) - 1) * CELL_GAP;
                const height = (pos.height || 1) * CELL_SIZE + ((pos.height || 1) - 1) * CELL_GAP;

                return (
                  <g key={stateCode}>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={4}
                      fill={fill}
                      stroke={isSelected || isHighlighted ? '#037DE4' : '#CBD5E1'}
                      strokeWidth={isSelected ? 2.5 : isHighlighted ? 2 : 1}
                      className={`transition-all duration-150 ${
                        onStateClick ? 'cursor-pointer' : ''
                      }`}
                      style={{
                        filter: isHovered ? 'brightness(0.92)' : undefined,
                      }}
                      onMouseEnter={() => setHoveredState(stateCode)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(stateCode)}
                    />
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                      fontWeight={500}
                      fill={value > 0 && value > (max - min) / 2 ? '#FFFFFF' : '#334155'}
                      className="pointer-events-none select-none"
                    >
                      {stateCode}
                    </text>
                    {value > 0 && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 14}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={10}
                        fill={value > (max - min) / 2 ? '#E2E8F0' : '#64748B'}
                        className="pointer-events-none select-none"
                      >
                        {value}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {showLegend && (
            <div className="flex-shrink-0 lg:w-32">
              <div className="text-sm font-medium text-abyss mb-3">Legend</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded border border-slate-300"
                    style={{ backgroundColor: emptyColor }}
                  />
                  <span className="text-sm text-lagoon">No data</span>
                </div>
                {colors.slice(1).map((color, index) => {
                  const step = max > min ? (max - min) / (colors.length - 1) : 1;
                  const rangeStart = index === 0 ? 1 : Math.ceil(min + step * index);
                  const rangeEnd = Math.ceil(min + step * (index + 1));
                  const label = max === min
                    ? '1+'
                    : rangeStart === rangeEnd
                      ? `${rangeStart}`
                      : `${rangeStart}-${rangeEnd}`;
                  return (
                    <div key={color} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded border border-slate-300"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-lagoon">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {showTooltip && hoveredState && (
          <div
            className="fixed z-50 px-3 py-2 bg-abyss text-white text-sm rounded-lg shadow-lg pointer-events-none"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y + 12,
            }}
          >
            <div className="font-medium">{STATE_NAMES[hoveredState]}</div>
            {hoveredData ? (
              <div className="text-slate-300">
                {hoveredData.label || `${hoveredData.value} ${hoveredData.value === 1 ? 'family' : 'families'}`}
              </div>
            ) : (
              <div className="text-slate-400">No waitlist entries</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

USMap.displayName = 'USMap';

export default USMap;
