'use client';

import { forwardRef } from 'react';

/**
 * Articulink Divider Component
 *
 * Horizontal or vertical separator line.
 *
 * Usage:
 *   <Divider />
 *   <Divider label="OR" />
 *   <Divider orientation="vertical" />
 */

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  label?: string;
  variant?: DividerVariant;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const spacingClasses = {
  none: '',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6',
};

const verticalSpacingClasses = {
  none: '',
  sm: 'mx-2',
  md: 'mx-4',
  lg: 'mx-6',
};

const variantClasses = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      label,
      variant = 'solid',
      spacing = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === 'horizontal';

    if (label && isHorizontal) {
      return (
        <div
          ref={ref}
          className={`
            flex items-center gap-4
            ${spacingClasses[spacing]}
            ${className}
          `}
          role="separator"
          aria-orientation={orientation}
          {...props}
        >
          <div className={`flex-1 border-t border-mist ${variantClasses[variant]}`} />
          <span className="text-sm text-lagoon font-medium px-2">{label}</span>
          <div className={`flex-1 border-t border-mist ${variantClasses[variant]}`} />
        </div>
      );
    }

    if (isHorizontal) {
      return (
        <div
          ref={ref}
          className={`
            border-t border-mist
            ${variantClasses[variant]}
            ${spacingClasses[spacing]}
            ${className}
          `}
          role="separator"
          aria-orientation={orientation}
          {...props}
        />
      );
    }

    // Vertical divider
    return (
      <div
        ref={ref}
        className={`
          border-l border-mist h-full self-stretch
          ${variantClasses[variant]}
          ${verticalSpacingClasses[spacing]}
          ${className}
        `}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
