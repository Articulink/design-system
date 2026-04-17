'use client';

import { forwardRef } from 'react';

/**
 * Articulink Textarea Component
 *
 * Multiline text input consistent with Input component.
 *
 * Usage:
 *   <Textarea label="Description" placeholder="Enter description..." />
 *   <Textarea label="Notes" rows={6} error="Required field" />
 */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', rows = 4, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-abyss mb-1.5"
          >
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          className={`
            w-full px-4 py-3 text-base
            bg-white text-abyss
            border-2 rounded-xl
            transition-all duration-150
            placeholder:text-lagoon/50
            resize-y min-h-[100px]
            focus:outline-none focus:ring-0
            ${
              hasError
                ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
                : 'border-mist focus:border-tide focus:shadow-[0_0_0_3px_rgba(3,125,228,0.12)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-breeze disabled:resize-none
            ${className}
          `}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${textareaId}-hint`} className="mt-1.5 text-sm text-lagoon">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
