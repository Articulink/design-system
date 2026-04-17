'use client';

import { forwardRef } from 'react';

/**
 * Articulink AspectRatio Component
 *
 * Container that maintains a specific aspect ratio.
 *
 * Usage:
 *   <AspectRatio ratio={16/9}>
 *     <img src="..." alt="..." className="object-cover w-full h-full" />
 *   </AspectRatio>
 *
 *   <AspectRatio ratio="4:3">
 *     <video src="..." />
 *   </AspectRatio>
 */

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio as number (e.g., 16/9) or string (e.g., "16:9") */
  ratio: number | string;
  children: React.ReactNode;
}

function parseRatio(ratio: number | string): number {
  if (typeof ratio === 'number') return ratio;

  const parts = ratio.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] !== 0) {
    return parts[0] / parts[1];
  }

  // Fallback to 1:1 if invalid
  return 1;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio, children, className = '', style, ...props }, ref) => {
    const numericRatio = parseRatio(ratio);
    const paddingBottom = `${(1 / numericRatio) * 100}%`;

    return (
      <div
        ref={ref}
        className={`relative w-full ${className}`}
        style={{ ...style, paddingBottom }}
        {...props}
      >
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

export default AspectRatio;
