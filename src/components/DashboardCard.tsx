'use client';

import { forwardRef } from 'react';

/**
 * Articulink DashboardCard Component
 *
 * Widget card for dashboard displays with gradient header, icon, and content areas.
 *
 * Usage:
 *   <DashboardCard
 *     title="Practice Streak"
 *     icon={<FireIcon />}
 *     gradient="primary"
 *     action={{ label: "View all", onClick: () => {} }}
 *   >
 *     <p>7 day streak!</p>
 *   </DashboardCard>
 */

export type DashboardCardGradient = 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'neutral';

export interface DashboardCardAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: DashboardCardGradient;
  action?: DashboardCardAction;
  loading?: boolean;
  children: React.ReactNode;
}

const gradientStyles: Record<DashboardCardGradient, { header: string; icon: string }> = {
  primary: {
    header: 'bg-gradient-to-r from-tide to-surf',
    icon: 'bg-white/20 text-white',
  },
  success: {
    header: 'bg-gradient-to-r from-success to-emerald-400',
    icon: 'bg-white/20 text-white',
  },
  warning: {
    header: 'bg-gradient-to-r from-warning to-amber-400',
    icon: 'bg-white/20 text-abyss',
  },
  info: {
    header: 'bg-gradient-to-r from-info to-sky-400',
    icon: 'bg-white/20 text-white',
  },
  purple: {
    header: 'bg-gradient-to-r from-purple-500 to-purple-400',
    icon: 'bg-white/20 text-white',
  },
  neutral: {
    header: 'bg-gradient-to-r from-lagoon to-abyss',
    icon: 'bg-white/20 text-white',
  },
};

export const DashboardCard = forwardRef<HTMLDivElement, DashboardCardProps>(
  (
    {
      title,
      subtitle,
      icon,
      gradient = 'primary',
      action,
      loading = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = gradientStyles[gradient];

    const ActionElement = () => {
      if (!action) return null;

      const actionClasses = `
        text-sm font-medium text-tide
        hover:text-surf
        transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
        rounded
      `;

      if (action.href) {
        return (
          <a href={action.href} className={actionClasses}>
            {action.label} &rarr;
          </a>
        );
      }

      return (
        <button onClick={action.onClick} className={actionClasses}>
          {action.label} &rarr;
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-2xl overflow-hidden
          border border-mist
          shadow-sm hover:shadow-md
          transition-shadow duration-200
          ${className}
        `}
        {...props}
      >
        {/* Header */}
        <div className={`${styles.header} px-5 py-4`}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.icon}`}>
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-white/80 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-mist rounded animate-pulse w-3/4" />
              <div className="h-4 bg-mist rounded animate-pulse w-1/2" />
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {action && (
          <div className="px-5 pb-4 pt-0">
            <ActionElement />
          </div>
        )}
      </div>
    );
  }
);

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
