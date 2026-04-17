'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink InputOTP Component
 *
 * One-time password input with individual character slots.
 *
 * Usage:
 *   <InputOTP length={6} value={otp} onChange={setOtp} />
 *   <InputOTP length={4} value={pin} onChange={setPin} type="password" />
 */

export type InputOTPSize = 'sm' | 'md' | 'lg';

export interface InputOTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  type?: 'text' | 'password';
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
  size?: InputOTPSize;
  separator?: number;
}

const sizeClasses: Record<InputOTPSize, { slot: string; text: string }> = {
  sm: { slot: 'w-8 h-10', text: 'text-lg' },
  md: { slot: 'w-10 h-12', text: 'text-xl' },
  lg: { slot: 'w-12 h-14', text: 'text-2xl' },
};

export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      value,
      onChange,
      length = 6,
      type = 'text',
      disabled = false,
      error = false,
      autoFocus = false,
      onComplete,
      size = 'md',
      separator,
      className = '',
      ...props
    },
    ref
  ) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const styles = sizeClasses[size];

    // Initialize refs array
    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    // Auto-focus first input
    useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus]);

    // Call onComplete when all slots are filled
    useEffect(() => {
      if (value.length === length && onComplete) {
        onComplete(value);
      }
    }, [value, length, onComplete]);

    const focusInput = useCallback((index: number) => {
      const input = inputRefs.current[index];
      if (input) {
        input.focus();
        input.select();
      }
    }, []);

    const handleChange = useCallback(
      (index: number, char: string) => {
        // Only accept single characters
        const newChar = char.slice(-1);

        // Build new value
        const chars = value.split('');
        chars[index] = newChar;
        const newValue = chars.join('').slice(0, length);

        onChange(newValue);

        // Move to next input if character was entered
        if (newChar && index < length - 1) {
          focusInput(index + 1);
        }
      },
      [value, length, onChange, focusInput]
    );

    const handleKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case 'Backspace':
            e.preventDefault();
            if (value[index]) {
              // Clear current slot
              const chars = value.split('');
              chars[index] = '';
              onChange(chars.join(''));
            } else if (index > 0) {
              // Move to previous slot and clear it
              focusInput(index - 1);
              const chars = value.split('');
              chars[index - 1] = '';
              onChange(chars.join(''));
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (index > 0) focusInput(index - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (index < length - 1) focusInput(index + 1);
            break;
          case 'Delete':
            e.preventDefault();
            const chars = value.split('');
            chars[index] = '';
            onChange(chars.join(''));
            break;
        }
      },
      [value, length, onChange, focusInput]
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, length);
        onChange(pastedData);

        // Focus the next empty slot or last slot
        const nextIndex = Math.min(pastedData.length, length - 1);
        focusInput(nextIndex);
      },
      [length, onChange, focusInput]
    );

    const handleFocus = (index: number) => {
      setFocusedIndex(index);
    };

    const handleBlur = () => {
      setFocusedIndex(null);
    };

    // Render slots
    const slots = [];
    for (let i = 0; i < length; i++) {
      const char = value[i] || '';
      const isFocused = focusedIndex === i;
      const hasValue = !!char;

      // Add separator if needed
      if (separator && i > 0 && i % separator === 0) {
        slots.push(
          <div
            key={`sep-${i}`}
            className="flex items-center justify-center w-4 text-lagoon"
          >
            -
          </div>
        );
      }

      slots.push(
        <div key={i} className="relative">
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type={type === 'password' ? 'password' : 'text'}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(i)}
            onBlur={handleBlur}
            disabled={disabled}
            autoComplete="one-time-code"
            className={`
              ${styles.slot} ${styles.text}
              text-center font-mono font-semibold
              border-2 rounded-lg bg-white
              transition-all duration-150
              focus:outline-none
              ${error
                ? 'border-error text-error'
                : isFocused
                  ? 'border-tide shadow-[0_0_0_3px_rgba(3,125,228,0.12)]'
                  : hasValue
                    ? 'border-tide/50'
                    : 'border-mist'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-breeze' : ''}
            `}
          />
          {/* Cursor animation when focused and empty */}
          {isFocused && !hasValue && !disabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-0.5 h-6 bg-tide animate-pulse" />
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`inline-flex items-center gap-2 ${className}`}
        {...props}
      >
        {slots}
      </div>
    );
  }
);

InputOTP.displayName = 'InputOTP';

export default InputOTP;
