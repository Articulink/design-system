'use client';

import { forwardRef } from 'react';

/**
 * Articulink Callout Component
 *
 * Highlighted information boxes for tips, warnings, notes.
 *
 * Usage:
 *   <Callout title="Note">Important information here.</Callout>
 *   <Callout variant="warning" title="Warning">Be careful!</Callout>
 */

export type CalloutVariant = 'info' | 'success' | 'warning' | 'error' | 'tip';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<CalloutVariant, { bg: string; border: string; icon: string; title: string }> = {
  info: {
    bg: 'bg-info-bg',
    border: 'border-info',
    icon: 'text-info',
    title: 'text-info-text',
  },
  success: {
    bg: 'bg-success-bg',
    border: 'border-success',
    icon: 'text-success',
    title: 'text-success-text',
  },
  warning: {
    bg: 'bg-warning-bg',
    border: 'border-warning',
    icon: 'text-warning',
    title: 'text-warning-text',
  },
  error: {
    bg: 'bg-error-bg',
    border: 'border-error',
    icon: 'text-error',
    title: 'text-error-text',
  },
  tip: {
    bg: 'bg-breeze',
    border: 'border-tide',
    icon: 'text-tide',
    title: 'text-tide',
  },
};

const defaultIcons: Record<CalloutVariant, React.ReactNode> = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tip: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = 'info', title, icon, children, className = '', ...props }, ref) => {
    const styles = variantStyles[variant];
    const displayIcon = icon ?? defaultIcons[variant];

    return (
      <div
        ref={ref}
        className={`
          flex gap-3 p-4 rounded-xl border-l-4
          ${styles.bg} ${styles.border}
          ${className}
        `}
        role="note"
        {...props}
      >
        {displayIcon && (
          <span className={`flex-shrink-0 ${styles.icon}`}>{displayIcon}</span>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-semibold mb-1 ${styles.title}`}>{title}</p>
          )}
          <div className="text-sm text-abyss">{children}</div>
        </div>
      </div>
    );
  }
);

Callout.displayName = 'Callout';

export default Callout;
