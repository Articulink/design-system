'use client';

import { forwardRef, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

/**
 * Articulink USMap Component
 *
 * Interactive US state choropleth map using d3-geo for proper projections.
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
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

// FIPS code to state abbreviation mapping
const FIPS_TO_STATE: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO',
  '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI',
  '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
  '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
  '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
  '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
  '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
  '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
  '54': 'WV', '55': 'WI', '56': 'WY',
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

interface StateFeature extends Feature<Geometry> {
  id: string;
  properties: Record<string, unknown>;
}

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
    const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load TopoJSON data
    useEffect(() => {
      const loadGeoData = async () => {
        try {
          const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
          const topology = await response.json() as Topology<{ states: GeometryCollection }>;
          const states = feature(topology, topology.objects.states) as FeatureCollection;
          setGeoData(states);
        } catch (error) {
          console.error('Failed to load US map data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadGeoData();
    }, []);

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

    // Set up projection and path generator
    const width = 960;
    const height = 600;
    const projection = useMemo(() =>
      geoAlbersUsa().scale(1280).translate([width / 2, height / 2]),
      []
    );
    const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

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

    if (isLoading) {
      return (
        <div ref={ref} className={`relative ${className}`} {...props}>
          {(title || subtitle) && (
            <div className="mb-4">
              {title && <h3 className="font-semibold text-abyss">{title}</h3>}
              {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
            </div>
          )}
          <div
            className="flex items-center justify-center bg-slate-50 rounded-lg"
            style={{ minHeight }}
          >
            <div className="animate-pulse text-lagoon">Loading map...</div>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="font-semibold text-abyss">{title}</h3>}
            {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div ref={containerRef} className="flex-1" style={{ minHeight }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full"
              onMouseMove={handleMouseMove}
              preserveAspectRatio="xMidYMid meet"
            >
              <g>
                {geoData?.features.map((feature) => {
                  const stateFeature = feature as StateFeature;
                  const fipsCode = String(stateFeature.id).padStart(2, '0');
                  const stateCode = FIPS_TO_STATE[fipsCode];

                  if (!stateCode) return null;

                  const stateData = dataMap.get(stateCode);
                  const value = stateData?.value ?? 0;
                  const isSelected = selectedState === stateCode;
                  const isHighlighted = highlightStates.includes(stateCode);
                  const isHovered = hoveredState === stateCode;

                  let fill = emptyColor;
                  if (value > 0) {
                    fill = getColorForValue(value, min, max, colors);
                  }

                  const path = pathGenerator(feature);
                  if (!path) return null;

                  return (
                    <path
                      key={stateCode}
                      d={path}
                      fill={fill}
                      stroke={isSelected || isHighlighted ? '#037DE4' : '#94A3B8'}
                      strokeWidth={isSelected ? 2 : isHighlighted ? 1.5 : 0.5}
                      className={`transition-colors duration-150 ${
                        onStateClick ? 'cursor-pointer' : ''
                      }`}
                      style={{
                        filter: isHovered ? 'brightness(0.92)' : undefined,
                      }}
                      onMouseEnter={() => setHoveredState(stateCode)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(stateCode)}
                    />
                  );
                })}
              </g>
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
            <div className="font-medium">{STATE_NAMES[hoveredState] || hoveredState}</div>
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
