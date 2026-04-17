'use client';

import { forwardRef } from 'react';

/**
 * Articulink EmptyState Component
 *
 * Empty state displays with icon, title, description, and action.
 *
 * Usage:
 *   <EmptyState
 *     icon={<CalendarIcon />}
 *     title="No appointments"
 *     description="You don't have any upcoming appointments."
 *     action={{ label: "Book appointment", onClick: () => {} }}
 *   />
 */

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className = '', ...props }, ref) => {
    const ActionButton = () => {
      if (!action) return null;

      const buttonClasses = `
        inline-flex items-center justify-center gap-2
        px-6 py-3
        bg-tide text-white font-semibold
        rounded-xl
        transition-all duration-150
        hover:bg-surf
        focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
      `;

      if (action.href) {
        return (
          <a href={action.href} className={buttonClasses}>
            {action.label}
          </a>
        );
      }

      return (
        <button onClick={action.onClick} className={buttonClasses}>
          {action.label}
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center justify-center
          py-12 px-6
          text-center
          ${className}
        `}
        {...props}
      >
        {icon && (
          <div className="w-16 h-16 mb-4 rounded-2xl bg-mist flex items-center justify-center text-lagoon">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-abyss mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-lagoon max-w-sm mb-6">
            {description}
          </p>
        )}
        <ActionButton />
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
