'use client';

import { forwardRef, ReactNode } from 'react';

/**
 * Articulink Timeline Component
 *
 * Vertical timeline for displaying chronological events.
 *
 * Usage:
 *   <Timeline>
 *     <TimelineItem
 *       date="March 15"
 *       title="Session completed"
 *       variant="success"
 *     >
 *       Details about the event...
 *     </TimelineItem>
 *   </Timeline>
 */

export type TimelineItemVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'milestone';

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`relative pl-4 ${className}`} {...props}>
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-mist" />
        <div className="space-y-4">{children}</div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

/**
 * TimelineItem - Individual timeline entry
 */
export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
  title: string;
  subtitle?: string;
  variant?: TimelineItemVariant;
  icon?: ReactNode;
  children?: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<TimelineItemVariant, { dot: string; connector: string; badge?: string }> = {
  default: {
    dot: 'bg-lagoon',
    connector: 'bg-lagoon',
  },
  success: {
    dot: 'bg-success',
    connector: 'bg-success',
    badge: 'bg-success-bg text-success-text',
  },
  warning: {
    dot: 'bg-warning',
    connector: 'bg-warning',
    badge: 'bg-warning-bg text-warning-text',
  },
  error: {
    dot: 'bg-error',
    connector: 'bg-error',
    badge: 'bg-error-bg text-error-text',
  },
  info: {
    dot: 'bg-tide',
    connector: 'bg-tide',
    badge: 'bg-info-bg text-info-text',
  },
  milestone: {
    dot: 'bg-sunshine',
    connector: 'bg-sunshine',
    badge: 'bg-warning-bg text-warning-text',
  },
};

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      date,
      title,
      subtitle,
      variant = 'default',
      icon,
      children,
      isSelected = false,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];
    const isClickable = !!onClick;

    const content = (
      <>
        {/* Dot */}
        <div
          className={`
            absolute -left-4 top-3 w-2 h-2 rounded-full z-10
            ${styles.dot}
          `}
        />

        {/* Connector line to dot */}
        <div className={`absolute -left-4 top-4 w-4 h-0.5 ${styles.connector}`} />

        {/* Content */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {subtitle && styles.badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles.badge}`}>
                  {subtitle}
                </span>
              )}
              {date && <span className="text-xs text-lagoon">{date}</span>}
            </div>
            <p className="font-medium text-abyss mt-1 truncate">{title}</p>
            {children && <div className="mt-2 text-sm text-lagoon">{children}</div>}
          </div>

          {icon && (
            <div
              className={`
                flex-shrink-0 w-10 h-10 rounded-lg
                flex items-center justify-center
                ${styles.badge || 'bg-mist text-lagoon'}
              `}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Milestone star */}
        {variant === 'milestone' && (
          <div className="absolute -left-5 top-1">
            <svg className="w-4 h-4 text-sunshine" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        )}
      </>
    );

    const baseClasses = `
      relative p-3 rounded-lg border transition-all duration-200
      ${isSelected ? 'bg-info-bg border-tide shadow-sm' : 'bg-breeze border-mist'}
      ${isClickable ? 'hover:bg-white hover:border-mist cursor-pointer' : ''}
      ${className}
    `;

    if (isClickable) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={`${baseClasses} w-full text-left`}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {content}
      </div>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';

/**
 * TimelineGroup - Group timeline items by date/period
 */
export interface TimelineGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: ReactNode;
}

export const TimelineGroup = forwardRef<HTMLDivElement, TimelineGroupProps>(
  ({ label, children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {/* Group header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3.5 h-3.5 rounded-full bg-abyss z-10" />
          <h4 className="font-semibold text-abyss">{label}</h4>
        </div>

        {/* Group items */}
        <div className="ml-7 space-y-3">{children}</div>
      </div>
    );
  }
);

TimelineGroup.displayName = 'TimelineGroup';

export default Timeline;
