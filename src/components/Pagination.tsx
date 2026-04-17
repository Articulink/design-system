'use client';

/**
 * Articulink Pagination Component
 *
 * Pagination controls with page numbers and navigation.
 *
 * Usage:
 *   <Pagination
 *     currentPage={1}
 *     totalPages={10}
 *     onPageChange={(page) => setPage(page)}
 *   />
 */

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}: PaginationProps) {
  // Generate page numbers with ellipsis
  const generatePages = (): (number | 'ellipsis')[] => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

    // If total pages fit, show all
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, 'ellipsis', ...rightRange];
    }

    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
    }

    return range(1, totalPages);
  };

  const pages = generatePages();

  if (totalPages <= 1) return null;

  const buttonBase = `
    inline-flex items-center justify-center
    min-w-[40px] h-10 px-3
    text-sm font-medium
    rounded-xl
    transition-all duration-150
    focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
  `;

  const activeStyles = 'bg-tide text-white shadow-md';
  const inactiveStyles = 'bg-white text-abyss border-2 border-mist hover:border-tide hover:text-tide';
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBase} ${inactiveStyles} ${currentPage === 1 ? disabledStyles : ''}`}
        aria-label="Go to previous page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-lagoon"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${buttonBase} ${isActive ? activeStyles : inactiveStyles}`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonBase} ${inactiveStyles} ${currentPage === totalPages ? disabledStyles : ''}`}
        aria-label="Go to next page"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
