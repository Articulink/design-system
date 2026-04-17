'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFetchOptions<T> {
  /** Initial data value */
  initialData?: T;
  /** Skip the initial fetch */
  skip?: boolean;
  /** Dependencies that trigger a refetch */
  deps?: unknown[];
  /** Called on successful fetch */
  onSuccess?: (data: T) => void;
  /** Called on error */
  onError?: (error: Error) => void;
  /** Transform the response before setting state */
  transform?: (data: unknown) => T;
}

export interface UseFetchResult<T> {
  /** The fetched data */
  data: T | null;
  /** Whether the fetch is in progress */
  isLoading: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Manually trigger a refetch */
  refetch: () => Promise<void>;
  /** Reset to initial state */
  reset: () => void;
  /** Update data manually (for optimistic updates) */
  setData: (data: T | null | ((prev: T | null) => T | null)) => void;
}

/**
 * A reusable hook for data fetching with loading and error states.
 *
 * @example
 * // Basic usage
 * const { data, isLoading, error } = useFetch(
 *   () => api.getClients(),
 *   { deps: [page] }
 * );
 *
 * @example
 * // With transformation
 * const { data: clients } = useFetch(
 *   () => api.getClients(),
 *   { transform: (res) => res.results }
 * );
 *
 * @example
 * // Skip initial fetch
 * const { data, refetch } = useFetch(
 *   () => api.search(query),
 *   { skip: !query }
 * );
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const {
    initialData = null,
    skip = false,
    deps = [],
    onSuccess,
    onError,
    transform,
  } = options;

  const [data, setData] = useState<T | null>(initialData as T | null);
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted to avoid state updates after unmount
  const isMounted = useRef(true);
  // Track the current fetch to handle race conditions
  const fetchId = useRef(0);

  const fetchData = useCallback(async () => {
    const currentFetchId = ++fetchId.current;
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();

      // Only update state if this is still the latest fetch and component is mounted
      if (currentFetchId === fetchId.current && isMounted.current) {
        const transformedData = transform ? transform(result) : result;
        setData(transformedData);
        onSuccess?.(transformedData);
      }
    } catch (err) {
      if (currentFetchId === fetchId.current && isMounted.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    } finally {
      if (currentFetchId === fetchId.current && isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, transform, onSuccess, onError]);

  const reset = useCallback(() => {
    fetchId.current++;
    setData(initialData as T | null);
    setIsLoading(false);
    setError(null);
  }, [initialData]);

  useEffect(() => {
    isMounted.current = true;

    if (!skip) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    reset,
    setData,
  };
}

export default useFetch;
