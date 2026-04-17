'use client';

import { forwardRef, createContext, useContext, useId } from 'react';

/**
 * Articulink RadioGroup Component
 *
 * Radio button group for single selection.
 *
 * Usage:
 *   <RadioGroup value={selected} onChange={setSelected}>
 *     <RadioItem value="a" label="Option A" />
 *     <RadioItem value="b" label="Option B" />
 *     <RadioItem value="c" label="Option C" />
 *   </RadioGroup>
 */

interface RadioGroupContextType {
  value: string;
  onChange: (value: string) => void;
  name: string;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  label?: string;
  error?: string;
  disabled?: boolean;
  orientation?: RadioGroupOrientation;
  size?: 'sm' | 'md' | 'lg';
  name?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      onChange,
      children,
      label,
      error,
      disabled,
      orientation = 'vertical',
      size = 'md',
      name: providedName,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedName = useId();
    const name = providedName || generatedName;

    return (
      <div
        ref={ref}
        className={className}
        role="radiogroup"
        aria-label={label}
        {...props}
      >
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-2">{label}</label>
        )}
        <RadioGroupContext.Provider value={{ value, onChange, name, disabled, size }}>
          <div
            className={`
              ${orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-3'}
            `}
          >
            {children}
          </div>
        </RadioGroupContext.Provider>
        {error && <p className="text-error text-sm mt-2">{error}</p>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

/**
 * RadioItem - Individual radio button
 */
export interface RadioItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value: string;
  label?: string;
  description?: string;
}

const sizeClasses = {
  sm: { box: 'w-4 h-4', dot: 'w-1.5 h-1.5', text: 'text-sm', desc: 'text-xs' },
  md: { box: 'w-5 h-5', dot: 'w-2 h-2', text: 'text-base', desc: 'text-sm' },
  lg: { box: 'w-6 h-6', dot: 'w-2.5 h-2.5', text: 'text-lg', desc: 'text-base' },
};

export const RadioItem = forwardRef<HTMLInputElement, RadioItemProps>(
  ({ value, label, description, disabled: itemDisabled, className = '', id: providedId, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error('RadioItem must be used within a RadioGroup');
    }

    const generatedId = useId();
    const id = providedId || generatedId;
    const { value: groupValue, onChange, name, disabled: groupDisabled, size } = context;
    const disabled = itemDisabled || groupDisabled;
    const isChecked = groupValue === value;
    const styles = sizeClasses[size];

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={isChecked}
            onChange={() => onChange(value)}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              ${styles.box}
              rounded-full border-2 transition-all duration-150
              flex items-center justify-center
              ${isChecked ? 'border-tide' : 'border-mist'}
              ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:border-tide peer-focus-visible:ring-2 peer-focus-visible:ring-tide peer-focus-visible:ring-offset-2'
              }
            `}
            onClick={() => {
              if (!disabled) {
                onChange(value);
              }
            }}
          >
            {isChecked && (
              <div className={`${styles.dot} rounded-full bg-tide`} />
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
          </div>
        )}
      </div>
    );
  }
);

RadioItem.displayName = 'RadioItem';

/**
 * RadioCard - Card-style radio option
 */
export interface RadioCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  ({ value, label, description, icon, disabled: itemDisabled, className = '', id: providedId, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error('RadioCard must be used within a RadioGroup');
    }

    const generatedId = useId();
    const id = providedId || generatedId;
    const { value: groupValue, onChange, name, disabled: groupDisabled } = context;
    const disabled = itemDisabled || groupDisabled;
    const isChecked = groupValue === value;

    return (
      <div className={className}>
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onChange(value)}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <label
          htmlFor={id}
          className={`
            block p-4 rounded-xl border-2 transition-all duration-150
            ${isChecked
              ? 'border-tide bg-info-bg'
              : 'border-mist bg-white hover:border-bubble'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            peer-focus-visible:ring-2 peer-focus-visible:ring-tide peer-focus-visible:ring-offset-2
          `}
        >
          <div className="flex items-start gap-3">
            {icon && (
              <div className={`flex-shrink-0 ${isChecked ? 'text-tide' : 'text-lagoon'}`}>
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${isChecked ? 'text-tide' : 'text-abyss'}`}>
                {label}
              </p>
              {description && (
                <p className="text-sm text-lagoon mt-0.5">{description}</p>
              )}
            </div>
            <div
              className={`
                flex-shrink-0 w-5 h-5 rounded-full border-2
                flex items-center justify-center
                ${isChecked ? 'border-tide' : 'border-mist'}
              `}
            >
              {isChecked && <div className="w-2 h-2 rounded-full bg-tide" />}
            </div>
          </div>
        </label>
      </div>
    );
  }
);

RadioCard.displayName = 'RadioCard';

export default RadioGroup;
