'use client';

import { forwardRef, useState } from 'react';

/**
 * Articulink Alert Component
 *
 * Inline feedback banners with semantic variants and optional dismiss.
 *
 * Usage:
 *   <Alert variant="success" title="Saved!" />
 *   <Alert variant="error" title="Error" description="Something went wrong." />
 *   <Alert variant="warning" dismissible onDismiss={() => {}} />
 */

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> = {
  success: {
    container: 'bg-success-bg border-success text-success-text',
    icon: 'text-success',
  },
  warning: {
    container: 'bg-warning-bg border-warning text-warning-text',
    icon: 'text-warning',
  },
  error: {
    container: 'bg-error-bg border-error text-error-text',
    icon: 'text-error',
  },
  info: {
    container: 'bg-info-bg border-info text-info-text',
    icon: 'text-info',
  },
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
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
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      description,
      icon,
      dismissible = false,
      onDismiss,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    const styles = variantStyles[variant];
    const displayIcon = icon ?? defaultIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={`
          flex items-start gap-3
          p-4 rounded-xl border
          ${styles.container}
          ${className}
        `}
        {...props}
      >
        {displayIcon && (
          <div className={`flex-shrink-0 ${styles.icon}`}>
            {displayIcon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm">
              {title}
            </h4>
          )}
          {description && (
            <p className={`text-sm ${title ? 'mt-1' : ''}`}>
              {description}
            </p>
          )}
          {children}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Dismiss alert"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
