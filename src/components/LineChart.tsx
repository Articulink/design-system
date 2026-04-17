'use client';

import { forwardRef, useMemo } from 'react';

/**
 * Articulink LineChart Component
 *
 * Simple SVG-based line chart for time series data.
 *
 * Usage:
 *   <LineChart
 *     data={[{ x: '2024-01', y: 50 }, { x: '2024-02', y: 75 }]}
 *     xLabel="Date"
 *     yLabel="Score"
 *   />
 */

export interface LineChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
}

export interface LineChartLine {
  value: number;
  label: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'muted';
  dashed?: boolean;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: LineChartDataPoint[];
  xLabel?: string;
  yLabel?: string;
  title?: string;
  subtitle?: string;
  height?: number;
  showDots?: boolean;
  showGrid?: boolean;
  referenceLines?: LineChartLine[];
  lineColor?: string;
  formatX?: (value: string | number | Date) => string;
  formatY?: (value: number) => string;
  emptyMessage?: string;
}

const lineColors: Record<string, string> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  info: 'var(--info)',
  muted: 'var(--mist)',
};

const lineTextColors: Record<string, string> = {
  success: 'fill-success',
  warning: 'fill-warning',
  error: 'fill-error',
  info: 'fill-info',
  muted: 'fill-lagoon',
};

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      xLabel,
      yLabel,
      title,
      subtitle,
      height = 200,
      showDots = true,
      showGrid = true,
      referenceLines = [],
      lineColor = 'var(--tide)',
      formatX,
      formatY = (v) => `${v}`,
      emptyMessage = 'No data available',
      className = '',
      ...props
    },
    ref
  ) => {
    const width = 400;
    const padding = { top: 20, right: 60, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate bounds
    const { minY, maxY, range, points, pathD } = useMemo(() => {
      if (data.length === 0) {
        return { minY: 0, maxY: 100, range: 100, points: [], pathD: '' };
      }

      const yValues = data.map((d) => d.y);
      const refValues = referenceLines.map((l) => l.value);
      const allValues = [...yValues, ...refValues];

      const calculatedMin = Math.min(...allValues);
      const calculatedMax = Math.max(...allValues);
      const buffer = (calculatedMax - calculatedMin) * 0.1 || 10;

      const minY = Math.max(0, calculatedMin - buffer);
      const maxY = calculatedMax + buffer;
      const range = maxY - minY;

      const points = data.map((d, index) => {
        const x = padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.y - minY) / range) * chartHeight;
        return { x, y, data: d };
      });

      const pathD = points
        .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
        .join(' ');

      return { minY, maxY, range, points, pathD };
    }, [data, referenceLines, chartWidth, chartHeight, padding.left, padding.top]);

    const getY = (value: number) => {
      return padding.top + chartHeight - ((value - minY) / range) * chartHeight;
    };

    // Generate Y-axis ticks
    const yTicks = useMemo(() => {
      const ticks: number[] = [];
      const step = range / 4;
      for (let i = 0; i <= 4; i++) {
        ticks.push(minY + step * i);
      }
      return ticks;
    }, [minY, range]);

    if (data.length === 0) {
      return (
        <div
          ref={ref}
          className={`bg-mist/50 rounded-xl p-6 text-center ${className}`}
          {...props}
        >
          <p className="text-lagoon text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl border border-mist p-4 ${className}`}
        {...props}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h4 className="font-semibold text-abyss">{title}</h4>}
            {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
          </div>
        )}

        {/* Chart */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {showGrid &&
            yTicks.map((tick, i) => {
              const y = getY(tick);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="var(--mist)"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-lagoon text-[10px]"
                  >
                    {formatY(tick)}
                  </text>
                </g>
              );
            })}

          {/* Reference lines */}
          {referenceLines.map((line, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={getY(line.value)}
                x2={width - padding.right}
                y2={getY(line.value)}
                stroke={lineColors[line.color]}
                strokeWidth={2}
                strokeDasharray={line.dashed ? '6,4' : undefined}
              />
              <text
                x={width - padding.right + 4}
                y={getY(line.value) + 4}
                className={`${lineTextColors[line.color]} text-[10px] font-medium`}
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* Data line */}
          {data.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data points */}
          {showDots &&
            points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={6}
                  fill={lineColor}
                  stroke="white"
                  strokeWidth={2}
                />
              </g>
            ))}

          {/* X-axis labels */}
          {data.length > 0 && (
            <>
              <text
                x={padding.left}
                y={height - 10}
                textAnchor="start"
                className="fill-lagoon text-[10px]"
              >
                {formatX ? formatX(data[0].x) : String(data[0].x)}
              </text>
              {data.length > 1 && (
                <text
                  x={width - padding.right}
                  y={height - 10}
                  textAnchor="end"
                  className="fill-lagoon text-[10px]"
                >
                  {formatX ? formatX(data[data.length - 1].x) : String(data[data.length - 1].x)}
                </text>
              )}
            </>
          )}

          {/* Axis labels */}
          {yLabel && (
            <text
              x={12}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90, 12, ${height / 2})`}
              className="fill-lagoon text-[10px]"
            >
              {yLabel}
            </text>
          )}
          {xLabel && (
            <text
              x={width / 2}
              y={height - 2}
              textAnchor="middle"
              className="fill-lagoon text-[10px]"
            >
              {xLabel}
            </text>
          )}
        </svg>
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';

export default LineChart;
