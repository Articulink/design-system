'use client';

import { forwardRef, useId } from 'react';

/**
 * Articulink Switch Component
 *
 * Toggle switch for on/off states.
 *
 * Usage:
 *   <Switch checked={isEnabled} onChange={setIsEnabled} />
 *   <Switch label="Enable notifications" checked={notify} onChange={setNotify} />
 *   <Switch size="lg" checked={active} onChange={setActive} />
 */

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: SwitchSize;
}

const sizeStyles: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-8 h-5',
    thumb: 'w-3.5 h-3.5',
    translate: 'translate-x-3.5',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-4.5 h-4.5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-5.5 h-5.5',
    translate: 'translate-x-7',
  },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onChange, label, description, size = 'md', disabled, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const styles = sizeStyles[size];

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${switchId}-label` : undefined}
          aria-describedby={description ? `${switchId}-description` : undefined}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex flex-shrink-0
            ${styles.track}
            rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
            ${checked ? 'bg-tide' : 'bg-mist'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span
            className={`
              ${styles.thumb}
              inline-block rounded-full bg-white shadow-sm
              transform transition-transform duration-200 ease-in-out
              ${checked ? styles.translate : 'translate-x-0.5'}
              mt-[3px] ml-0.5
            `}
          />
        </button>

        {/* Hidden input for form compatibility */}
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                id={`${switchId}-label`}
                htmlFor={switchId}
                className={`
                  block text-sm font-medium text-abyss
                  ${disabled ? 'opacity-50' : 'cursor-pointer'}
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={`${switchId}-description`}
                className={`text-sm text-lagoon ${disabled ? 'opacity-50' : ''}`}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
