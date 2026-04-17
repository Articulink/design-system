'use client';

import { forwardRef, useMemo } from 'react';

/**
 * Articulink BarChart Component
 *
 * Simple SVG-based bar chart.
 *
 * Usage:
 *   <BarChart data={[{ label: 'Jan', value: 100 }]} />
 *   <BarChart data={data} orientation="horizontal" />
 */

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartDataPoint[];
  orientation?: 'vertical' | 'horizontal';
  title?: string;
  subtitle?: string;
  showValues?: boolean;
  showLabels?: boolean;
  height?: number;
  barColor?: string;
  formatValue?: (value: number) => string;
  maxValue?: number;
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      orientation = 'vertical',
      title,
      subtitle,
      showValues = true,
      showLabels = true,
      height = 300,
      barColor = '#037DE4',
      formatValue = (v) => v.toLocaleString(),
      maxValue: customMaxValue,
      className = '',
      ...props
    },
    ref
  ) => {
    const maxValue = customMaxValue ?? Math.max(...data.map((d) => d.value), 1);

    const padding = { top: 20, right: 20, bottom: showLabels ? 60 : 20, left: showValues ? 60 : 20 };
    const chartWidth = 100; // Percentage
    const chartHeight = height - padding.top - padding.bottom;

    if (orientation === 'horizontal') {
      return (
        <div ref={ref} className={className} {...props}>
          {(title || subtitle) && (
            <div className="mb-4">
              {title && <h3 className="font-semibold text-abyss">{title}</h3>}
              {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
            </div>
          )}

          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = (item.value / maxValue) * 100;
              const color = item.color || barColor;

              return (
                <div key={index}>
                  {showLabels && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-abyss">{item.label}</span>
                      {showValues && <span className="text-lagoon">{formatValue(item.value)}</span>}
                    </div>
                  )}
                  <div className="h-6 bg-mist rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Vertical bar chart
    const barWidth = Math.min(60, (chartWidth - data.length * 8) / data.length);
    const barGap = 8;

    return (
      <div ref={ref} className={className} {...props}>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="font-semibold text-abyss">{title}</h3>}
            {subtitle && <p className="text-sm text-lagoon">{subtitle}</p>}
          </div>
        )}

        <svg
          viewBox={`0 0 ${data.length * (barWidth + barGap) + padding.left + padding.right} ${height}`}
          className="w-full"
          style={{ maxHeight: height }}
        >
          {/* Y-axis gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = padding.top + chartHeight * (1 - tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={data.length * (barWidth + barGap) + padding.left}
                  y2={y}
                  stroke="#E4F2FE"
                  strokeWidth={1}
                />
                {showValues && (
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-lagoon text-xs"
                  >
                    {formatValue(maxValue * tick)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding.left + index * (barWidth + barGap) + barGap / 2;
            const y = padding.top + chartHeight - barHeight;
            const color = item.color || barColor;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx={4}
                  className="transition-all duration-500"
                />
                {showLabels && (
                  <text
                    x={x + barWidth / 2}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    className="fill-lagoon text-xs"
                    transform={`rotate(-45, ${x + barWidth / 2}, ${height - padding.bottom + 20})`}
                  >
                    {item.label}
                  </text>
                )}
                {showValues && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="fill-abyss text-xs font-medium"
                  >
                    {formatValue(item.value)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

BarChart.displayName = 'BarChart';

export default BarChart;
