'use client';

import { forwardRef } from 'react';

/**
 * Articulink StatCard Component
 *
 * Metric display card with label, value, and optional trend indicator.
 *
 * Usage:
 *   <StatCard label="Total Users" value={1234} />
 *   <StatCard label="Revenue" value="$12,450" trend={{ value: 12, direction: 'up' }} />
 *   <StatCard label="Sessions" value={89} icon={<CalendarIcon />} variant="primary" />
 */

export type StatCardVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface StatCardTrend {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: StatCardTrend;
  variant?: StatCardVariant;
  loading?: boolean;
}

const variantStyles: Record<StatCardVariant, { icon: string; accent: string }> = {
  default: {
    icon: 'bg-mist text-lagoon',
    accent: 'text-abyss',
  },
  primary: {
    icon: 'bg-info-bg text-tide',
    accent: 'text-tide',
  },
  success: {
    icon: 'bg-success-bg text-success',
    accent: 'text-success',
  },
  warning: {
    icon: 'bg-warning-bg text-warning',
    accent: 'text-warning',
  },
  error: {
    icon: 'bg-error-bg text-error',
    accent: 'text-error',
  },
};

const trendColors = {
  up: 'text-success',
  down: 'text-error',
  neutral: 'text-lagoon',
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      icon,
      trend,
      variant = 'default',
      loading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl border border-mist p-5
          transition-shadow duration-200
          hover:shadow-md
          ${className}
        `}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-lagoon truncate">
              {label}
            </p>

            {loading ? (
              <div className="mt-2 h-8 w-24 bg-mist rounded animate-pulse" />
            ) : (
              <p className={`mt-1 text-2xl font-bold ${styles.accent} truncate`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            )}

            {trend && !loading && (
              <div className={`mt-2 flex items-center gap-1 text-sm ${trendColors[trend.direction]}`}>
                {trend.direction === 'up' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {trend.direction === 'down' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {trend.direction === 'neutral' && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                )}
                <span className="font-medium">
                  {trend.direction !== 'neutral' && (trend.value > 0 ? '+' : '')}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-lagoon font-normal">{trend.label}</span>
                )}
              </div>
            )}
          </div>

          {icon && (
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${styles.icon}`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

/**
 * StatCardGrid - Grid container for stat cards
 */
export interface StatCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

export const StatCardGrid = forwardRef<HTMLDivElement, StatCardGridProps>(
  ({ columns = 4, children, className = '', ...props }, ref) => {
    const gridCols = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div
        ref={ref}
        className={`grid gap-4 ${gridCols[columns]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatCardGrid.displayName = 'StatCardGrid';

export default StatCard;
