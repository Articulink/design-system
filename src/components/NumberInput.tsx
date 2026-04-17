'use client';

import { forwardRef, useState, useRef, useCallback } from 'react';

/**
 * Articulink NumberInput Component
 *
 * Numeric input with increment/decrement controls.
 *
 * Usage:
 *   <NumberInput value={quantity} onChange={setQuantity} min={0} max={100} />
 *   <NumberInput value={price} onChange={setPrice} step={0.01} prefix="$" />
 */

export type NumberInputSize = 'sm' | 'md' | 'lg';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'size' | 'type'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: NumberInputSize;
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  showControls?: boolean;
  allowMouseWheel?: boolean;
}

const sizeClasses: Record<NumberInputSize, { input: string; button: string; icon: string }> = {
  sm: { input: 'h-8 text-sm px-2', button: 'w-6', icon: 'w-3 h-3' },
  md: { input: 'h-10 text-base px-3', button: 'w-8', icon: 'w-4 h-4' },
  lg: { input: 'h-12 text-lg px-4', button: 'w-10', icon: 'w-5 h-5' },
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      precision,
      size = 'md',
      label,
      error,
      hint,
      prefix,
      suffix,
      showControls = true,
      allowMouseWheel = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const styles = sizeClasses[size];

    // Determine precision from step if not explicitly set
    const effectivePrecision = precision ?? (step.toString().split('.')[1]?.length || 0);

    const clamp = useCallback(
      (val: number): number => {
        const clamped = Math.min(max, Math.max(min, val));
        return Number(clamped.toFixed(effectivePrecision));
      },
      [min, max, effectivePrecision]
    );

    const increment = useCallback(() => {
      if (disabled) return;
      onChange(clamp(value + step));
    }, [value, step, clamp, onChange, disabled]);

    const decrement = useCallback(() => {
      if (disabled) return;
      onChange(clamp(value - step));
    }, [value, step, clamp, onChange, disabled]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty input temporarily
      if (inputValue === '' || inputValue === '-') {
        return;
      }

      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        onChange(clamp(parsed));
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Ensure value is clamped on blur
      onChange(clamp(value));
      props.onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
      props.onKeyDown?.(e);
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (!allowMouseWheel || !isFocused || disabled) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        increment();
      } else {
        decrement();
      }
    };

    const displayValue = effectivePrecision > 0
      ? value.toFixed(effectivePrecision)
      : value.toString();

    const canDecrement = value > min;
    const canIncrement = value < max;

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">
            {label}
          </label>
        )}

        <div
          className={`
            flex items-center
            border-2 rounded-xl bg-white
            transition-all duration-150
            ${error
              ? 'border-error'
              : isFocused
                ? 'border-tide shadow-[0_0_0_3px_rgba(3,125,228,0.12)]'
                : 'border-mist hover:border-bubble'
            }
            ${disabled ? 'opacity-50 bg-breeze' : ''}
          `}
        >
          {/* Decrement button */}
          {showControls && (
            <button
              type="button"
              onClick={decrement}
              disabled={disabled || !canDecrement}
              tabIndex={-1}
              className={`
                ${styles.button} flex-shrink-0
                flex items-center justify-center
                text-lagoon hover:text-abyss hover:bg-mist
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors rounded-l-lg
              `}
            >
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
          )}

          {/* Prefix */}
          {prefix && (
            <span className="text-lagoon pl-2">{prefix}</span>
          )}

          {/* Input */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            disabled={disabled}
            className={`
              ${styles.input}
              flex-1 min-w-0 text-center
              text-abyss placeholder:text-lagoon/50
              bg-transparent border-0
              focus:outline-none
            `}
            {...props}
          />

          {/* Suffix */}
          {suffix && (
            <span className="text-lagoon pr-2">{suffix}</span>
          )}

          {/* Increment button */}
          {showControls && (
            <button
              type="button"
              onClick={increment}
              disabled={disabled || !canIncrement}
              tabIndex={-1}
              className={`
                ${styles.button} flex-shrink-0
                flex items-center justify-center
                text-lagoon hover:text-abyss hover:bg-mist
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors rounded-r-lg
              `}
            >
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Hint or error message */}
        {(hint || error) && (
          <p className={`text-sm mt-1.5 ${error ? 'text-error' : 'text-lagoon'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
