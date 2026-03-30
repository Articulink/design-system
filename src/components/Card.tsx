'use client';

import { forwardRef } from 'react';

/**
 * Articulink Card Component
 *
 * Consistent card styling with optional depth shadow and hover effects.
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      depth = true,
      hover = false,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-2xl border border-mist
          ${depth ? 'card-depth' : ''}
          ${hover ? 'card-depth-hover transition-all duration-200' : ''}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
