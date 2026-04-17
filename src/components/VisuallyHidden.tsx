'use client';

import { forwardRef } from 'react';

/**
 * Articulink VisuallyHidden Component
 *
 * Content that is hidden visually but accessible to screen readers.
 *
 * Usage:
 *   <button>
 *     <Icon />
 *     <VisuallyHidden>Close dialog</VisuallyHidden>
 *   </button>
 *
 *   <VisuallyHidden as="h1">Page title for screen readers</VisuallyHidden>
 */

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** HTML element to render (default: span) */
  as?: React.ElementType;
  /** When true, becomes visible when focused (useful for skip links) */
  focusable?: boolean;
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ children, as: Component = 'span', focusable = false, className = '', ...props }, ref) => {
    const baseStyles = `
      absolute w-px h-px p-0 -m-px overflow-hidden
      whitespace-nowrap border-0
      [clip:rect(0,0,0,0)]
    `;

    const focusableStyles = focusable
      ? `
        focus:relative focus:w-auto focus:h-auto focus:m-0
        focus:overflow-visible focus:whitespace-normal
        focus:[clip:auto]
      `
      : '';

    const ElementComponent = Component;

    return (
      <ElementComponent
        ref={ref}
        className={`${baseStyles} ${focusableStyles} ${className}`.trim()}
        {...props}
      >
        {children}
      </ElementComponent>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

export default VisuallyHidden;
