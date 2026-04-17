'use client';

import { forwardRef, Children, isValidElement, cloneElement } from 'react';
import Link from 'next/link';

/**
 * Articulink Breadcrumb Component
 *
 * Navigation breadcrumbs showing current location.
 *
 * Usage:
 *   <Breadcrumb>
 *     <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *     <BreadcrumbItem href="/clients">Clients</BreadcrumbItem>
 *     <BreadcrumbItem>John Doe</BreadcrumbItem>
 *   </Breadcrumb>
 */

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  separator?: React.ReactNode;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      children,
      separator,
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 2,
      className = '',
      ...props
    },
    ref
  ) => {
    const childArray = Children.toArray(children).filter(isValidElement);
    const totalItems = childArray.length;

    // Determine if we need to collapse
    const shouldCollapse = maxItems !== undefined && totalItems > maxItems;

    let displayedItems = childArray;

    if (shouldCollapse) {
      const beforeItems = childArray.slice(0, itemsBeforeCollapse);
      const afterItems = childArray.slice(totalItems - itemsAfterCollapse);

      displayedItems = [
        ...beforeItems,
        <BreadcrumbEllipsis key="ellipsis" />,
        ...afterItems,
      ];
    }

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center flex-wrap gap-1">
          {displayedItems.map((child, index) => {
            const isLast = index === displayedItems.length - 1;

            return (
              <li key={index} className="flex items-center gap-1">
                {isValidElement(child) && cloneElement(child as React.ReactElement<{ isLast?: boolean }>, { isLast })}
                {!isLast && (
                  <span className="text-lagoon/50 mx-1" aria-hidden="true">
                    {separator || <DefaultSeparator />}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

/**
 * BreadcrumbItem - Individual breadcrumb link or text
 */
export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  href?: string;
  icon?: React.ReactNode;
  isLast?: boolean;
  children: React.ReactNode;
}

export const BreadcrumbItem = forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  ({ href, icon, isLast, children, className = '', ...props }, ref) => {
    const content = (
      <>
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </>
    );

    if (href && !isLast) {
      return (
        <span ref={ref} className={className} {...props}>
          <Link
            href={href}
            className="text-sm text-lagoon hover:text-tide transition-colors flex items-center"
          >
            {content}
          </Link>
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={`text-sm ${isLast ? 'text-abyss font-medium' : 'text-lagoon'} flex items-center ${className}`}
        aria-current={isLast ? 'page' : undefined}
        {...props}
      >
        {content}
      </span>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * BreadcrumbEllipsis - Collapse indicator
 */
export interface BreadcrumbEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`text-lagoon/50 px-1 ${className}`}
        role="presentation"
        {...props}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </span>
    );
  }
);

BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

/**
 * BreadcrumbSeparator - Custom separator
 */
export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`text-lagoon/50 ${className}`}
        role="presentation"
        aria-hidden="true"
        {...props}
      >
        {children || <DefaultSeparator />}
      </span>
    );
  }
);

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

// Default separator icon
function DefaultSeparator() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default Breadcrumb;
