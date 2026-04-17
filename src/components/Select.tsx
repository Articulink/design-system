'use client';

import { forwardRef } from 'react';

/**
 * Articulink Select Component
 *
 * Styled dropdown select consistent with Input component.
 *
 * Usage:
 *   <Select label="Country" value={country} onChange={setCountry}>
 *     <option value="">Select a country</option>
 *     <option value="us">United States</option>
 *     <option value="ca">Canada</option>
 *   </Select>
 */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className = '', children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-abyss mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
            }
            className={`
              w-full px-4 py-3 text-base
              bg-white text-abyss
              border-2 rounded-xl
              transition-all duration-150
              appearance-none cursor-pointer
              focus:outline-none focus:ring-0
              ${
                hasError
                  ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
                  : 'border-mist focus:border-tide focus:shadow-[0_0_0_3px_rgba(3,125,228,0.12)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-breeze
              ${className}
            `}
            {...props}
          >
            {children}
          </select>
          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-lagoon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${selectId}-hint`} className="mt-1.5 text-sm text-lagoon">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
