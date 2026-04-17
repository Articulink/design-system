'use client';

import { forwardRef } from 'react';

/**
 * Articulink StatusIndicator Component
 *
 * Unified status indicators for connection states, sync status, review status, etc.
 *
 * Usage:
 *   <StatusIndicator status="online" />
 *   <StatusIndicator status="syncing" label="Syncing..." />
 *   <StatusIndicator status="error" label="Connection lost" size="lg" />
 */

export type StatusIndicatorStatus =
  | 'online'
  | 'offline'
  | 'syncing'
  | 'pending'
  | 'success'
  | 'error'
  | 'warning'
  | 'idle';

export type StatusIndicatorSize = 'sm' | 'md' | 'lg';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusIndicatorStatus;
  label?: string;
  size?: StatusIndicatorSize;
  pulse?: boolean;
  showDot?: boolean;
}

const statusStyles: Record<StatusIndicatorStatus, { dot: string; text: string; bg: string }> = {
  online: {
    dot: 'bg-success',
    text: 'text-success-text',
    bg: 'bg-success-bg',
  },
  offline: {
    dot: 'bg-lagoon',
    text: 'text-lagoon',
    bg: 'bg-mist',
  },
  syncing: {
    dot: 'bg-info',
    text: 'text-info-text',
    bg: 'bg-info-bg',
  },
  pending: {
    dot: 'bg-warning',
    text: 'text-warning-text',
    bg: 'bg-warning-bg',
  },
  success: {
    dot: 'bg-success',
    text: 'text-success-text',
    bg: 'bg-success-bg',
  },
  error: {
    dot: 'bg-error',
    text: 'text-error-text',
    bg: 'bg-error-bg',
  },
  warning: {
    dot: 'bg-warning',
    text: 'text-warning-text',
    bg: 'bg-warning-bg',
  },
  idle: {
    dot: 'bg-lagoon',
    text: 'text-lagoon',
    bg: 'bg-breeze',
  },
};

const sizeStyles: Record<StatusIndicatorSize, { dot: string; text: string; padding: string }> = {
  sm: {
    dot: 'w-2 h-2',
    text: 'text-xs',
    padding: 'px-2 py-0.5',
  },
  md: {
    dot: 'w-2.5 h-2.5',
    text: 'text-sm',
    padding: 'px-2.5 py-1',
  },
  lg: {
    dot: 'w-3 h-3',
    text: 'text-base',
    padding: 'px-3 py-1.5',
  },
};

const defaultLabels: Record<StatusIndicatorStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  syncing: 'Syncing',
  pending: 'Pending',
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  idle: 'Idle',
};

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    {
      status,
      label,
      size = 'md',
      pulse,
      showDot = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const statusStyle = statusStyles[status];
    const sizeStyle = sizeStyles[size];
    const displayLabel = label ?? defaultLabels[status];

    // Auto-pulse for syncing status
    const shouldPulse = pulse ?? status === 'syncing';

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center gap-2
          rounded-full
          font-medium
          ${statusStyle.bg}
          ${statusStyle.text}
          ${sizeStyle.text}
          ${sizeStyle.padding}
          ${className}
        `}
        role="status"
        aria-label={displayLabel}
        {...props}
      >
        {showDot && (
          <span
            className={`
              ${sizeStyle.dot}
              ${statusStyle.dot}
              rounded-full
              flex-shrink-0
              ${shouldPulse ? 'animate-pulse' : ''}
            `}
            aria-hidden="true"
          />
        )}
        {displayLabel}
      </div>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';

/**
 * Simple dot-only indicator without label
 */
export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusIndicatorStatus;
  size?: StatusIndicatorSize;
  pulse?: boolean;
}

export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ status, size = 'md', pulse, className = '', ...props }, ref) => {
    const statusStyle = statusStyles[status];
    const sizeStyle = sizeStyles[size];
    const shouldPulse = pulse ?? status === 'syncing';

    return (
      <span
        ref={ref}
        className={`
          inline-block
          ${sizeStyle.dot}
          ${statusStyle.dot}
          rounded-full
          ${shouldPulse ? 'animate-pulse' : ''}
          ${className}
        `}
        role="status"
        aria-label={defaultLabels[status]}
        {...props}
      />
    );
  }
);

StatusDot.displayName = 'StatusDot';

export default StatusIndicator;
