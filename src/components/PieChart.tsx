'use client';

import { forwardRef, useMemo, useState } from 'react';

/**
 * Articulink PieChart / DonutChart Component
 *
 * Simple SVG-based pie/donut chart.
 *
 * Usage:
 *   <PieChart data={[{ label: 'A', value: 30 }, { label: 'B', value: 70 }]} />
 *   <PieChart data={data} variant="donut" />
 */

export interface PieChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PieChartDataPoint[];
  variant?: 'pie' | 'donut';
  size?: number;
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showLabels?: boolean;
  showPercentages?: boolean;
  centerLabel?: string;
  centerValue?: string;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#037DE4', // tide
  '#22C55E', // success
  '#F59E0B', // warning
  '#EF4444', // error
  '#8B5CF6', // purple
  '#1E96FC', // surf
  '#EC4899', // pink
  '#14B8A6', // teal
];

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', x, y,
    'Z',
  ].join(' ');
}

function describeDonutArc(
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
  const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);
  const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
  const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', outerStart.x, outerStart.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, outerEnd.x, outerEnd.y,
    'L', innerEnd.x, innerEnd.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
    'Z',
  ].join(' ');
}

export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      variant = 'pie',
      size = 200,
      title,
      subtitle,
      showLegend = true,
      showLabels = false,
      showPercentages = true,
      centerLabel,
      centerValue,
      colors = DEFAULT_COLORS,
      className = '',
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

    const segments = useMemo(() => {
      let currentAngle = 0;
      return data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        return {
          ...item,
          color: item.color || colors[index % colors.length],
          percentage,
          startAngle,
          endAngle,
          midAngle: startAngle + angle / 2,
        };
      });
    }, [data, total, colors]);

    const center = size / 2;
    const outerRadius = size / 2 - 10;
    const innerRadius = variant === 'donut' ? outerRadius * 0.6 : 0;

    return (
      <div ref={ref} className={`flex flex-col items-center ${className}`} {...props}>
        {(title || subtitle) && (
          <div className="mb-4 text-center">
            {title && <h3 className="font-semibold text-abyss">{title}</h3>}
            {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
          </div>
        )}

        <div className="flex items-center gap-8">
          {/* Chart */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((segment, index) => {
              const isHovered = hoveredIndex === index;
              const scale = isHovered ? 1.05 : 1;

              // Handle full circle (single item with 100%)
              if (segment.endAngle - segment.startAngle >= 359.9) {
                return variant === 'donut' ? (
                  <circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={(outerRadius + innerRadius) / 2}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={outerRadius - innerRadius}
                    className="transition-all duration-200"
                    style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ) : (
                  <circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    fill={segment.color}
                    className="transition-all duration-200"
                    style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              }

              const path =
                variant === 'donut'
                  ? describeDonutArc(center, center, outerRadius, innerRadius, segment.startAngle, segment.endAngle)
                  : describeArc(center, center, outerRadius, segment.startAngle, segment.endAngle);

              return (
                <path
                  key={index}
                  d={path}
                  fill={segment.color}
                  className="transition-all duration-200 cursor-pointer"
                  style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}

            {/* Labels on segments */}
            {showLabels &&
              segments.map((segment, index) => {
                if (segment.percentage < 5) return null;
                const labelRadius = variant === 'donut' ? (outerRadius + innerRadius) / 2 : outerRadius * 0.7;
                const pos = polarToCartesian(center, center, labelRadius, segment.midAngle);

                return (
                  <text
                    key={`label-${index}`}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-xs font-medium pointer-events-none"
                  >
                    {showPercentages ? `${Math.round(segment.percentage)}%` : segment.label}
                  </text>
                );
              })}

            {/* Center label for donut */}
            {variant === 'donut' && (centerLabel || centerValue) && (
              <g>
                {centerValue && (
                  <text
                    x={center}
                    y={center - (centerLabel ? 8 : 0)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-abyss text-2xl font-bold"
                  >
                    {centerValue}
                  </text>
                )}
                {centerLabel && (
                  <text
                    x={center}
                    y={center + (centerValue ? 12 : 0)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-lagoon text-sm"
                  >
                    {centerLabel}
                  </text>
                )}
              </g>
            )}
          </svg>

          {/* Legend */}
          {showLegend && (
            <div className="space-y-2">
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    hoveredIndex === index ? 'opacity-100' : hoveredIndex !== null ? 'opacity-50' : ''
                  } transition-opacity cursor-pointer`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm text-abyss">{segment.label}</span>
                  {showPercentages && (
                    <span className="text-sm text-lagoon ml-auto">
                      {Math.round(segment.percentage)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PieChart.displayName = 'PieChart';

export default PieChart;
