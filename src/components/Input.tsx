'use client';

import { forwardRef } from 'react';

/**
 * Articulink Input Component
 *
 * Accessible form input with brand styling.
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** A decorative icon shown inside the field, on the left. */
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-navy mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex text-blue-800"
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={`
            w-full ${icon ? 'pl-12 pr-4' : 'px-4'} py-3 text-base
            bg-white text-navy
            border-2 rounded-xl
            transition-all duration-150
            placeholder:text-blue-800/50
            focus:outline-none focus:ring-0
            ${
              hasError
                ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
                : 'border-surface-tint focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(3,125,228,0.12)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-subtle
            ${className}
          `}
          {...props}
        />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-blue-800">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
