'use client';

import { forwardRef, createContext, useContext, useId } from 'react';

/**
 * Articulink Checkbox Component
 *
 * Checkbox input with label and indeterminate state support.
 *
 * Usage:
 *   <Checkbox label="Accept terms" checked={accepted} onChange={setAccepted} />
 *   <CheckboxGroup value={selected} onChange={setSelected}>
 *     <Checkbox value="a" label="Option A" />
 *     <Checkbox value="b" label="Option B" />
 *   </CheckboxGroup>
 */

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value' | 'size'> {
  label?: string;
  description?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  value?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { box: 'w-4 h-4', icon: 'w-3 h-3', text: 'text-sm', desc: 'text-xs' },
  md: { box: 'w-5 h-5', icon: 'w-3.5 h-3.5', text: 'text-base', desc: 'text-sm' },
  lg: { box: 'w-6 h-6', icon: 'w-4 h-4', text: 'text-lg', desc: 'text-base' },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      checked,
      indeterminate = false,
      onChange,
      value,
      error,
      size = 'md',
      disabled,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const groupContext = useContext(CheckboxGroupContext);
    const styles = sizeClasses[size];

    // If in a group, use group's state
    const isInGroup = groupContext !== null;
    const isChecked = isInGroup
      ? value !== undefined && groupContext.value.includes(value)
      : checked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isInGroup && value !== undefined) {
        groupContext.onChange(value, e.target.checked);
      } else {
        onChange?.(e.target.checked);
      }
    };

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            value={value}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              ${styles.box}
              rounded border-2 transition-all duration-150
              flex items-center justify-center
              ${isChecked || indeterminate
                ? 'bg-tide border-tide'
                : 'bg-white border-mist'
              }
              ${error ? 'border-error' : ''}
              ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:border-tide peer-focus-visible:ring-2 peer-focus-visible:ring-tide peer-focus-visible:ring-offset-2'
              }
            `}
            onClick={() => {
              if (!disabled) {
                const input = document.getElementById(id) as HTMLInputElement;
                input?.click();
              }
            }}
          >
            {isChecked && !indeterminate && (
              <svg
                className={`${styles.icon} text-white`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {indeterminate && (
              <svg
                className={`${styles.icon} text-white`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={id}
                className={`
                  block font-medium text-abyss ${styles.text}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={`text-lagoon ${styles.desc} mt-0.5`}>{description}</p>
            )}
            {error && <p className="text-error text-sm mt-1">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/**
 * CheckboxGroup - Group multiple checkboxes
 */
interface CheckboxGroupContextType {
  value: string[];
  onChange: (value: string, checked: boolean) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextType | null>(null);

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  children: React.ReactNode;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      value,
      onChange,
      children,
      label,
      error,
      orientation = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    const handleChange = (itemValue: string, checked: boolean) => {
      if (checked) {
        onChange([...value, itemValue]);
      } else {
        onChange(value.filter((v) => v !== itemValue));
      }
    };

    return (
      <div ref={ref} className={className} role="group" aria-label={label} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-2">{label}</label>
        )}
        <CheckboxGroupContext.Provider value={{ value, onChange: handleChange }}>
          <div
            className={`
              ${orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3'}
            `}
          >
            {children}
          </div>
        </CheckboxGroupContext.Provider>
        {error && <p className="text-error text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default Checkbox;
