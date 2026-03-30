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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-abyss mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={`
            w-full px-4 py-3 text-base
            bg-white text-abyss
            border-2 rounded-xl
            transition-all duration-150
            placeholder:text-lagoon/50
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
        />
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
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-lagoon">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
