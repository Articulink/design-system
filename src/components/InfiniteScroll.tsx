'use client';

import { forwardRef, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink InfiniteScroll Component
 *
 * Infinite scroll wrapper that triggers loading when reaching the end.
 *
 * Usage:
 *   <InfiniteScroll
 *     onLoadMore={loadMoreItems}
 *     hasMore={hasNextPage}
 *     loading={isLoading}
 *   >
 *     {items.map(item => <ItemComponent key={item.id} {...item} />)}
 *   </InfiniteScroll>
 */

export interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  loadingComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  rootMargin?: string;
  direction?: 'down' | 'up';
}

export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      children,
      onLoadMore,
      hasMore,
      loading = false,
      threshold = 0.1,
      loadingComponent,
      endComponent,
      rootMargin = '100px',
      direction = 'down',
      className = '',
      ...props
    },
    ref
  ) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      [hasMore, loading, onLoadMore]
    );

    useEffect(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const observer = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin,
        threshold,
      });

      observer.observe(sentinel);

      return () => {
        observer.disconnect();
      };
    }, [handleIntersect, rootMargin, threshold]);

    const defaultLoadingComponent = (
      <div className="flex items-center justify-center py-4">
        <svg
          className="w-6 h-6 text-tide animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
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
        <span className="ml-2 text-lagoon">Loading...</span>
      </div>
    );

    const defaultEndComponent = (
      <div className="flex items-center justify-center py-4 text-lagoon text-sm">
        No more items to load
      </div>
    );

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`${className}`}
        {...props}
      >
        {direction === 'up' && (
          <>
            {/* Sentinel at top for reverse scroll */}
            <div ref={sentinelRef} className="h-px" />
            {loading && (loadingComponent || defaultLoadingComponent)}
          </>
        )}

        {children}

        {direction === 'down' && (
          <>
            {/* Sentinel at bottom for normal scroll */}
            <div ref={sentinelRef} className="h-px" />
            {loading && (loadingComponent || defaultLoadingComponent)}
            {!hasMore && !loading && (endComponent || defaultEndComponent)}
          </>
        )}
      </div>
    );
  }
);

InfiniteScroll.displayName = 'InfiniteScroll';

export default InfiniteScroll;
