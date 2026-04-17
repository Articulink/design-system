'use client';

import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink ScrollArea Component
 *
 * Custom scrollbar container for consistent cross-browser scrolling.
 *
 * Usage:
 *   <ScrollArea className="h-72">
 *     <div className="p-4">
 *       Long content here...
 *     </div>
 *   </ScrollArea>
 */

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: ScrollAreaOrientation;
  scrollbarSize?: 'thin' | 'default';
  hideScrollbar?: boolean;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      orientation = 'vertical',
      scrollbarSize = 'default',
      hideScrollbar = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [showVertical, setShowVertical] = useState(false);
    const [showHorizontal, setShowHorizontal] = useState(false);
    const [verticalThumbHeight, setVerticalThumbHeight] = useState(0);
    const [verticalThumbTop, setVerticalThumbTop] = useState(0);
    const [horizontalThumbWidth, setHorizontalThumbWidth] = useState(0);
    const [horizontalThumbLeft, setHorizontalThumbLeft] = useState(0);
    const [isDragging, setIsDragging] = useState<'vertical' | 'horizontal' | null>(null);

    const scrollbarWidth = scrollbarSize === 'thin' ? 6 : 10;

    // Update scrollbar visibility and thumb dimensions
    const updateScrollbars = useCallback(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const { scrollHeight, clientHeight, scrollWidth, clientWidth, scrollTop, scrollLeft } = viewport;

      // Vertical scrollbar
      if (orientation === 'vertical' || orientation === 'both') {
        const needsVertical = scrollHeight > clientHeight;
        setShowVertical(needsVertical);

        if (needsVertical) {
          const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
          const maxScroll = scrollHeight - clientHeight;
          const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * (clientHeight - thumbHeight) : 0;
          setVerticalThumbHeight(thumbHeight);
          setVerticalThumbTop(thumbTop);
        }
      }

      // Horizontal scrollbar
      if (orientation === 'horizontal' || orientation === 'both') {
        const needsHorizontal = scrollWidth > clientWidth;
        setShowHorizontal(needsHorizontal);

        if (needsHorizontal) {
          const thumbWidth = Math.max((clientWidth / scrollWidth) * clientWidth, 30);
          const maxScroll = scrollWidth - clientWidth;
          const thumbLeft = maxScroll > 0 ? (scrollLeft / maxScroll) * (clientWidth - thumbWidth) : 0;
          setHorizontalThumbWidth(thumbWidth);
          setHorizontalThumbLeft(thumbLeft);
        }
      }
    }, [orientation]);

    // Initialize and observe for changes
    useEffect(() => {
      updateScrollbars();

      const viewport = viewportRef.current;
      if (!viewport) return;

      const resizeObserver = new ResizeObserver(updateScrollbars);
      resizeObserver.observe(viewport);

      // Also observe content changes
      const mutationObserver = new MutationObserver(updateScrollbars);
      mutationObserver.observe(viewport, { childList: true, subtree: true });

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, [updateScrollbars]);

    // Handle scroll events
    const handleScroll = () => {
      updateScrollbars();
    };

    // Handle thumb drag
    const handleVerticalThumbMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging('vertical');
      const startY = e.clientY;
      const startTop = verticalThumbTop;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const deltaY = moveEvent.clientY - startY;
        const { clientHeight, scrollHeight } = viewport;
        const maxThumbTop = clientHeight - verticalThumbHeight;
        const newThumbTop = Math.max(0, Math.min(maxThumbTop, startTop + deltaY));
        const scrollRatio = newThumbTop / maxThumbTop;
        viewport.scrollTop = scrollRatio * (scrollHeight - clientHeight);
      };

      const handleMouseUp = () => {
        setIsDragging(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleHorizontalThumbMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging('horizontal');
      const startX = e.clientX;
      const startLeft = horizontalThumbLeft;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const deltaX = moveEvent.clientX - startX;
        const { clientWidth, scrollWidth } = viewport;
        const maxThumbLeft = clientWidth - horizontalThumbWidth;
        const newThumbLeft = Math.max(0, Math.min(maxThumbLeft, startLeft + deltaX));
        const scrollRatio = newThumbLeft / maxThumbLeft;
        viewport.scrollLeft = scrollRatio * (scrollWidth - clientWidth);
      };

      const handleMouseUp = () => {
        setIsDragging(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle track click (jump to position)
    const handleVerticalTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;
      if (!viewport || e.target !== e.currentTarget) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const { clientHeight, scrollHeight } = viewport;
      const scrollRatio = clickY / clientHeight;
      viewport.scrollTop = scrollRatio * (scrollHeight - clientHeight);
    };

    const handleHorizontalTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const viewport = viewportRef.current;
      if (!viewport || e.target !== e.currentTarget) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const { clientWidth, scrollWidth } = viewport;
      const scrollRatio = clickX / clientWidth;
      viewport.scrollLeft = scrollRatio * (scrollWidth - clientWidth);
    };

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        {...props}
      >
        {/* Viewport */}
        <div
          ref={viewportRef}
          onScroll={handleScroll}
          className="h-full w-full overflow-auto scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>

        {/* Vertical scrollbar */}
        {!hideScrollbar && showVertical && (
          <div
            className={`
              absolute top-0 right-0 bottom-0 transition-opacity
              ${isDragging === 'vertical' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
            `}
            style={{ width: scrollbarWidth }}
            onClick={handleVerticalTrackClick}
          >
            <div className="absolute inset-0 bg-mist/50 rounded-full" />
            <div
              className="absolute right-0 left-0 bg-lagoon/60 hover:bg-lagoon rounded-full cursor-pointer transition-colors"
              style={{
                height: verticalThumbHeight,
                top: verticalThumbTop,
              }}
              onMouseDown={handleVerticalThumbMouseDown}
            />
          </div>
        )}

        {/* Horizontal scrollbar */}
        {!hideScrollbar && showHorizontal && (
          <div
            className={`
              absolute left-0 right-0 bottom-0 transition-opacity
              ${isDragging === 'horizontal' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
            `}
            style={{ height: scrollbarWidth }}
            onClick={handleHorizontalTrackClick}
          >
            <div className="absolute inset-0 bg-mist/50 rounded-full" />
            <div
              className="absolute top-0 bottom-0 bg-lagoon/60 hover:bg-lagoon rounded-full cursor-pointer transition-colors"
              style={{
                width: horizontalThumbWidth,
                left: horizontalThumbLeft,
              }}
              onMouseDown={handleHorizontalThumbMouseDown}
            />
          </div>
        )}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
