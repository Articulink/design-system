'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink VirtualList Component
 *
 * Virtualized list for efficient rendering of large datasets.
 *
 * Usage:
 *   <VirtualList
 *     items={items}
 *     itemHeight={50}
 *     renderItem={(item, index) => <div>{item.name}</div>}
 *   />
 */

export interface VirtualListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  height?: number;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

function VirtualListInner<T>(
  {
    items,
    itemHeight,
    renderItem,
    height = 400,
    overscan = 5,
    onEndReached,
    endReachedThreshold = 200,
    loading = false,
    loadingComponent,
    emptyComponent,
    className = '',
    ...props
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const endReachedRef = useRef(false);

  // Calculate item height
  const getItemHeight = useCallback(
    (item: T, index: number): number => {
      return typeof itemHeight === 'function' ? itemHeight(item, index) : itemHeight;
    },
    [itemHeight]
  );

  // Calculate total height and item positions
  const { totalHeight, itemPositions } = (() => {
    let total = 0;
    const positions: { top: number; height: number }[] = [];

    items.forEach((item, index) => {
      const h = getItemHeight(item, index);
      positions.push({ top: total, height: h });
      total += h;
    });

    return { totalHeight: total, itemPositions: positions };
  })();

  // Find visible range
  const getVisibleRange = useCallback(() => {
    if (items.length === 0) return { start: 0, end: 0 };

    // Binary search for start
    let start = 0;
    let end = items.length - 1;
    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (itemPositions[mid].top + itemPositions[mid].height < scrollTop) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }
    const startIndex = Math.max(0, start - overscan);

    // Find end
    const viewportBottom = scrollTop + height;
    let endIndex = startIndex;
    while (endIndex < items.length && itemPositions[endIndex].top < viewportBottom) {
      endIndex++;
    }
    endIndex = Math.min(items.length - 1, endIndex + overscan);

    return { start: startIndex, end: endIndex };
  }, [items.length, itemPositions, scrollTop, height, overscan]);

  const { start, end } = getVisibleRange();

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);

      // Check for end reached
      const distanceFromEnd = totalHeight - (target.scrollTop + target.clientHeight);
      if (distanceFromEnd < endReachedThreshold && !endReachedRef.current && onEndReached) {
        endReachedRef.current = true;
        onEndReached();
      } else if (distanceFromEnd >= endReachedThreshold) {
        endReachedRef.current = false;
      }
    },
    [totalHeight, endReachedThreshold, onEndReached]
  );

  // Reset end reached when items change
  useEffect(() => {
    endReachedRef.current = false;
  }, [items.length]);

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
        {...props}
      >
        {emptyComponent || (
          <p className="text-lagoon">No items to display</p>
        )}
      </div>
    );
  }

  // Render visible items
  const visibleItems = [];
  for (let i = start; i <= end && i < items.length; i++) {
    const item = items[i];
    const position = itemPositions[i];

    visibleItems.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: position.top,
          left: 0,
          right: 0,
          height: position.height,
        }}
      >
        {renderItem(item, i)}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
      {...props}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: totalHeight,
          width: '100%',
        }}
      >
        {visibleItems}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="sticky bottom-0 left-0 right-0 py-3 flex justify-center bg-gradient-to-t from-white to-transparent">
          {loadingComponent || (
            <div className="flex items-center gap-2 text-lagoon">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ForwardRef with generic type
export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof VirtualListInner>;

export default VirtualList;
