'use client';

import React, { useState, useCallback, useMemo } from 'react';

export interface Column<T> {
  /** Unique key for the column */
  key: string;
  /** Column header label */
  header: string;
  /** Render function for cell content */
  render: (item: T) => React.ReactNode;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Column width class (e.g., 'w-32', 'w-48') */
  width?: string;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Hide on mobile */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  /** Data items to display */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key extractor */
  keyExtractor: (item: T) => string | number;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Enable row selection */
  selectable?: boolean;
  /** Currently selected keys */
  selectedKeys?: Set<string | number>;
  /** Selection change handler */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Current sort field */
  sortField?: string | null;
  /** Current sort direction */
  sortDir?: 'asc' | 'desc';
  /** Sort change handler */
  onSort?: (field: string, dir: 'asc' | 'desc') => void;
  /** Row click handler */
  onRowClick?: (item: T) => void;
  /** Custom row class name */
  rowClassName?: (item: T) => string;
  /** Pagination - current page (1-indexed) */
  page?: number;
  /** Pagination - total pages */
  totalPages?: number;
  /** Pagination - page change handler */
  onPageChange?: (page: number) => void;
  /** Pagination - total count for display */
  totalCount?: number;
  /** Items per page for display */
  pageSize?: number;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tide"></div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-abyss/50">
      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p>{message}</p>
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) {
  return (
    <svg
      className={`w-4 h-4 ml-1 inline-block transition-colors ${active ? 'text-tide' : 'text-gray-400'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  );
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data found',
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  sortField,
  sortDir = 'asc',
  onSort,
  onRowClick,
  rowClassName,
  page,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
}: DataTableProps<T>) {
  const allKeys = useMemo(() => new Set(data.map(keyExtractor)), [data, keyExtractor]);
  const allSelected = data.length > 0 && selectedKeys.size === data.length;
  const someSelected = selectedKeys.size > 0 && selectedKeys.size < data.length;

  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(allKeys);
    }
  }, [allSelected, allKeys, onSelectionChange]);

  const handleSelectRow = useCallback((key: string | number) => {
    if (!onSelectionChange) return;
    const newSelection = new Set(selectedKeys);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange(newSelection);
  }, [selectedKeys, onSelectionChange]);

  const handleSort = useCallback((field: string) => {
    if (!onSort) return;
    const newDir = sortField === field && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(field, newDir);
  }, [sortField, sortDir, onSort]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <LoadingSpinner />
      </div>
    );
  }

  const showPagination = totalPages !== undefined && totalPages > 1 && onPageChange;
  const startItem = page && pageSize ? (page - 1) * pageSize + 1 : 1;
  const endItem = page && pageSize && totalCount ? Math.min(page * pageSize, totalCount) : data.length;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-tide rounded border-gray-300 focus:ring-tide"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                    ${column.width || ''}
                    ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                    ${column.sortable && onSort ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                  `}
                  onClick={column.sortable && onSort ? () => handleSort(column.key) : undefined}
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    {column.sortable && onSort && (
                      <SortIcon
                        active={sortField === column.key}
                        direction={sortField === column.key ? sortDir : 'asc'}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                const isSelected = selectedKeys.has(key);
                return (
                  <tr
                    key={key}
                    className={`
                      hover:bg-gray-50 transition-colors
                      ${isSelected ? 'bg-tide/5' : ''}
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${rowClassName ? rowClassName(item) : ''}
                    `}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {selectable && (
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          className="w-4 h-4 text-tide rounded border-gray-300 focus:ring-tide"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`
                          px-6 py-4 whitespace-nowrap
                          ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}
                          ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                        `}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {totalCount !== undefined && (
              <>
                Showing {startItem} to {endItem} of {totalCount} results
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page! - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page! <= 3) {
                  pageNum = i + 1;
                } else if (page! >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page! - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`
                      w-8 h-8 text-sm font-medium rounded-lg
                      ${page === pageNum
                        ? 'bg-tide text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(page! + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
