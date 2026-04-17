'use client';

import { forwardRef, ReactNode } from 'react';

/**
 * Articulink ResponsiveTable Components
 *
 * Mobile-responsive table that can switch between table and card layouts.
 *
 * Usage:
 *   // Scrollable table wrapper
 *   <ResponsiveTable>
 *     <table>...</table>
 *   </ResponsiveTable>
 *
 *   // Stackable table (switches to cards on mobile)
 *   <StackableTable headers={['Name', 'Email', 'Status']}>
 *     {data.map(item => (
 *       <StackableRow key={item.id} mobileCard={<MobileCard item={item} />}>
 *         <td>{item.name}</td>
 *         <td>{item.email}</td>
 *         <td>{item.status}</td>
 *       </StackableRow>
 *     ))}
 *   </StackableTable>
 */

export interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Wrapper for tables that need horizontal scrolling on mobile.
 */
export const ResponsiveTable = forwardRef<HTMLDivElement, ResponsiveTableProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 ${className}`}
        {...props}
      >
        <div className="inline-block min-w-full align-middle">{children}</div>
      </div>
    );
  }
);

ResponsiveTable.displayName = 'ResponsiveTable';

/**
 * StackableTable - Table that switches to cards on mobile
 */
export interface StackableTableProps extends React.HTMLAttributes<HTMLDivElement> {
  headers: string[];
  children: ReactNode;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

const breakpointClasses = {
  sm: { table: 'hidden sm:block', cards: 'sm:hidden' },
  md: { table: 'hidden md:block', cards: 'md:hidden' },
  lg: { table: 'hidden lg:block', cards: 'lg:hidden' },
};

export const StackableTable = forwardRef<HTMLDivElement, StackableTableProps>(
  ({ headers, children, mobileBreakpoint = 'sm', className = '', ...props }, ref) => {
    const bp = breakpointClasses[mobileBreakpoint];

    return (
      <div ref={ref} className={className} {...props}>
        {/* Desktop table */}
        <div className={bp.table}>
          <table className="min-w-full">
            <thead className="bg-mist/50">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-medium text-lagoon uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">{children}</tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className={`${bp.cards} space-y-3`}>{children}</div>
      </div>
    );
  }
);

StackableTable.displayName = 'StackableTable';

/**
 * StackableRow - Table row that renders differently on mobile
 */
export interface StackableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  mobileCard?: ReactNode;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

export const StackableRow = forwardRef<HTMLTableRowElement, StackableRowProps>(
  ({ children, mobileCard, mobileBreakpoint = 'sm', className = '', ...props }, ref) => {
    const bp = breakpointClasses[mobileBreakpoint];

    return (
      <>
        {/* Desktop row */}
        <tr ref={ref} className={`${bp.table} ${className}`} {...props}>
          {children}
        </tr>

        {/* Mobile card */}
        {mobileCard && <div className={bp.cards}>{mobileCard}</div>}
      </>
    );
  }
);

StackableRow.displayName = 'StackableRow';

/**
 * MobileCard - Card container for mobile table rows
 */
export interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl border border-mist p-4 space-y-2 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileCard.displayName = 'MobileCard';

/**
 * MobileCardRow - Label-value pair for mobile cards
 */
export interface MobileCardRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: ReactNode;
}

export const MobileCardRow = forwardRef<HTMLDivElement, MobileCardRowProps>(
  ({ label, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex justify-between items-start gap-4 ${className}`}
        {...props}
      >
        <span className="text-xs text-lagoon uppercase tracking-wide flex-shrink-0">
          {label}
        </span>
        <span className="text-sm text-abyss text-right">{children}</span>
      </div>
    );
  }
);

MobileCardRow.displayName = 'MobileCardRow';

export default ResponsiveTable;
