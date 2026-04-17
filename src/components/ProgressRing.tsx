'use client';

import { forwardRef } from 'react';

/**
 * Articulink ProgressRing Component
 *
 * Circular progress indicator with percentage display.
 *
 * Usage:
 *   <ProgressRing value={75} />
 *   <ProgressRing value={50} size="lg" showValue />
 *   <ProgressRing value={100} variant="success" />
 */

export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';
export type ProgressRingVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  size?: ProgressRingSize;
  variant?: ProgressRingVariant;
  showValue?: boolean;
  strokeWidth?: number;
  label?: string;
}

const sizeConfig: Record<ProgressRingSize, { size: number; textSize: string; labelSize: string }> = {
  sm: { size: 40, textSize: 'text-xs', labelSize: 'text-[8px]' },
  md: { size: 64, textSize: 'text-sm', labelSize: 'text-[10px]' },
  lg: { size: 96, textSize: 'text-xl', labelSize: 'text-xs' },
  xl: { size: 128, textSize: 'text-2xl', labelSize: 'text-sm' },
};

const variantColors: Record<ProgressRingVariant, string> = {
  default: 'stroke-tide',
  primary: 'stroke-tide',
  success: 'stroke-success',
  warning: 'stroke-warning',
  error: 'stroke-error',
};

export const ProgressRing = forwardRef<HTMLDivElement, ProgressRingProps>(
  (
    {
      value,
      size = 'md',
      variant = 'default',
      showValue = true,
      strokeWidth,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size];
    const normalizedValue = Math.min(100, Math.max(0, value));

    // Calculate stroke width based on size if not provided
    const stroke = strokeWidth ?? Math.max(4, config.size / 12);
    const radius = (config.size - stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (normalizedValue / 100) * circumference;

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: config.size, height: config.size }}
        role="progressbar"
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `${normalizedValue}% complete`}
        {...props}
      >
        <svg
          className="transform -rotate-90"
          width={config.size}
          height={config.size}
        >
          {/* Background circle */}
          <circle
            className="stroke-mist"
            fill="none"
            strokeWidth={stroke}
            r={radius}
            cx={config.size / 2}
            cy={config.size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`${variantColors[variant]} transition-all duration-500 ease-out`}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={config.size / 2}
            cy={config.size / 2}
          />
        </svg>

        {/* Center content */}
        {(showValue || label) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {showValue && (
              <span className={`font-bold text-abyss ${config.textSize}`}>
                {Math.round(normalizedValue)}%
              </span>
            )}
            {label && (
              <span className={`text-lagoon ${config.labelSize} mt-0.5`}>
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';

/**
 * ProgressBar - Linear progress indicator
 */
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: ProgressRingVariant;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const barSizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const barVariantColors: Record<ProgressRingVariant, string> = {
  default: 'bg-tide',
  primary: 'bg-tide',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      variant = 'default',
      showValue = false,
      size = 'md',
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const normalizedValue = Math.min(100, Math.max(0, value));

    return (
      <div ref={ref} className={className} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && <span className="text-sm font-medium text-abyss">{label}</span>}
            {showValue && <span className="text-sm text-lagoon">{Math.round(normalizedValue)}%</span>}
          </div>
        )}
        <div
          className={`w-full bg-mist rounded-full overflow-hidden ${barSizes[size]}`}
          role="progressbar"
          aria-valuenow={normalizedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`${barSizes[size]} ${barVariantColors[variant]} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${normalizedValue}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressRing;
