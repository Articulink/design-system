'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';

/**
 * Articulink Tooltip Component
 *
 * Hover tooltips for additional context on elements.
 *
 * Usage:
 *   <Tooltip content="More information">
 *     <button>Hover me</button>
 *   </Tooltip>
 *
 *   <Tooltip content="Click to copy" position="bottom">
 *     <span>Copy link</span>
 *   </Tooltip>
 */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-abyss border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-abyss border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-abyss border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-abyss border-y-transparent border-l-transparent',
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, position = 'top', delay = 200, children, className = '' }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsVisible(false);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={ref || containerRef}
        className={`relative inline-flex ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
        {isVisible && (
          <div
            role="tooltip"
            className={`
              absolute z-50
              px-3 py-1.5
              text-xs font-medium text-white
              bg-abyss rounded-lg
              whitespace-nowrap
              pointer-events-none
              animate-in fade-in-0 zoom-in-95 duration-150
              ${positionStyles[position]}
            `}
          >
            {content}
            <div
              className={`
                absolute w-0 h-0
                border-4
                ${arrowStyles[position]}
              `}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
