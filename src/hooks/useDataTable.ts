'use client';

import { useState, useCallback, useMemo } from 'react';
import { useFetch, UseFetchOptions } from './useFetch';

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export interface UseDataTableOptions<T, F = Record<string, unknown>> {
  /** Items per page */
  pageSize?: number;
  /** Initial filters */
  initialFilters?: F;
  /** Initial sort field */
  initialSort?: string;
  /** Initial sort direction */
  initialSortDir?: 'asc' | 'desc';
  /** Fetch options passed to useFetch */
  fetchOptions?: Omit<UseFetchOptions<PaginatedResponse<T>>, 'deps'>;
}

export interface UseDataTableResult<T, F = Record<string, unknown>> {
  /** The current page of items */
  items: T[];
  /** Total count of items */
  totalCount: number;
  /** Whether data is loading */
  isLoading: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Items per page */
  pageSize: number;
  /** Current filters */
  filters: F;
  /** Current sort field */
  sortField: string | null;
  /** Current sort direction */
  sortDir: 'asc' | 'desc';
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Update filters (merges with existing) */
  setFilters: (filters: Partial<F>) => void;
  /** Reset filters to initial state */
  resetFilters: () => void;
  /** Set sort field and direction */
  setSort: (field: string, dir?: 'asc' | 'desc') => void;
  /** Toggle sort direction for a field */
  toggleSort: (field: string) => void;
  /** Manually refetch data */
  refetch: () => Promise<void>;
  /** Search string (convenience for common filter pattern) */
  search: string;
  /** Set search string */
  setSearch: (search: string) => void;
}

/**
 * A hook for managing paginated, filterable, sortable data tables.
 *
 * @example
 * const {
 *   items,
 *   isLoading,
 *   page,
 *   totalPages,
 *   search,
 *   setSearch,
 *   goToPage,
 * } = useDataTable(
 *   (params) => api.getClients(params),
 *   { pageSize: 20 }
 * );
 */
export function useDataTable<T, F extends Record<string, unknown> = Record<string, unknown>>(
  fetcher: (params: {
    page: number;
    pageSize: number;
    filters: F;
    sortField: string | null;
    sortDir: 'asc' | 'desc';
    search: string;
  }) => Promise<PaginatedResponse<T>>,
  options: UseDataTableOptions<T, F> = {}
): UseDataTableResult<T, F> {
  const {
    pageSize: initialPageSize = 20,
    initialFilters = {} as F,
    initialSort = null,
    initialSortDir = 'asc',
    fetchOptions = {},
  } = options;

  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [filters, setFiltersState] = useState<F>(initialFilters);
  const [sortField, setSortField] = useState<string | null>(initialSort);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialSortDir);
  const [search, setSearchState] = useState('');

  // Memoize the fetcher to avoid unnecessary refetches
  const boundFetcher = useCallback(
    () => fetcher({ page, pageSize, filters, sortField, sortDir, search }),
    [fetcher, page, pageSize, filters, sortField, sortDir, search]
  );

  const { data, isLoading, error, refetch } = useFetch(boundFetcher, {
    ...fetchOptions,
    deps: [page, pageSize, filters, sortField, sortDir, search],
  });

  const items = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const setFilters = useCallback((newFilters: Partial<F>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    setPage(1);
  }, [initialFilters]);

  const setSort = useCallback((field: string, dir: 'asc' | 'desc' = 'asc') => {
    setSortField(field);
    setSortDir(dir);
    setPage(1);
  }, []);

  const toggleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }, [sortField]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPage(1);
  }, []);

  return useMemo(() => ({
    items,
    totalCount,
    isLoading,
    error,
    page,
    totalPages,
    pageSize,
    filters,
    sortField,
    sortDir,
    goToPage,
    nextPage,
    prevPage,
    setFilters,
    resetFilters,
    setSort,
    toggleSort,
    refetch,
    search,
    setSearch,
  }), [
    items,
    totalCount,
    isLoading,
    error,
    page,
    totalPages,
    pageSize,
    filters,
    sortField,
    sortDir,
    goToPage,
    nextPage,
    prevPage,
    setFilters,
    resetFilters,
    setSort,
    toggleSort,
    refetch,
    search,
    setSearch,
  ]);
}

export default useDataTable;
