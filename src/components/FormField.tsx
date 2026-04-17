'use client';

import { forwardRef, useId } from 'react';

/**
 * Articulink FormField Component
 *
 * Wrapper component that provides consistent label, error, and hint styling for form inputs.
 * Use this to wrap custom inputs or third-party components that don't use our Input/Textarea.
 *
 * Usage:
 *   <FormField label="Email" error={errors.email} required>
 *     <input type="email" className="..." />
 *   </FormField>
 *
 *   <FormField label="Bio" hint="Max 500 characters">
 *     <CustomTextarea />
 *   </FormField>
 */

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, hint, required, htmlFor, children, className = '', ...props }, ref) => {
    const generatedId = useId();
    const fieldId = htmlFor || generatedId;
    const hasError = !!error;

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-semibold text-abyss mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}

        {children}

        {error && (
          <p
            id={`${fieldId}-error`}
            className="mt-1.5 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${fieldId}-hint`} className="mt-1.5 text-sm text-lagoon">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

/**
 * FormSection - Groups related form fields with a heading
 */
export interface FormSectionProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection = forwardRef<HTMLFieldSetElement, FormSectionProps>(
  ({ title, description, children, className = '', ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={`border-0 p-0 m-0 ${className}`}
        {...props}
      >
        <legend className="text-base font-semibold text-abyss mb-1">
          {title}
        </legend>
        {description && (
          <p className="text-sm text-lagoon mb-4">
            {description}
          </p>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </fieldset>
    );
  }
);

FormSection.displayName = 'FormSection';

/**
 * FormActions - Container for form submit/cancel buttons
 */
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(
  ({ children, align = 'right', className = '', ...props }, ref) => {
    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-3 pt-4
          border-t border-mist mt-6
          ${alignStyles[align]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormActions.displayName = 'FormActions';

export default FormField;
