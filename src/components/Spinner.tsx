'use client';

import { forwardRef } from 'react';

/**
 * Articulink Spinner Component
 *
 * Loading spinner with customizable size and color.
 *
 * Usage:
 *   <Spinner />
 *   <Spinner size="lg" />
 *   <Spinner variant="light" />
 */

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'default' | 'primary' | 'light' | 'dark';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
  xl: 'w-16 h-16 border-4',
};

const variantClasses: Record<SpinnerVariant, string> = {
  default: 'border-mist border-t-tide',
  primary: 'border-tide/30 border-t-tide',
  light: 'border-white/30 border-t-white',
  dark: 'border-abyss/30 border-t-abyss',
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', variant = 'default', label, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || 'Loading'}
        className={`inline-flex items-center justify-center ${className}`}
        {...props}
      >
        <div
          className={`
            rounded-full animate-spin
            ${sizeClasses[size]}
            ${variantClasses[variant]}
          `}
        />
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
