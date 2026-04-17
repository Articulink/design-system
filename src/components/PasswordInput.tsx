'use client';

import { forwardRef, useState } from 'react';

/**
 * Articulink PasswordInput Component
 *
 * Password input with show/hide toggle and strength indicator.
 *
 * Usage:
 *   <PasswordInput value={password} onChange={setPassword} />
 *   <PasswordInput value={password} onChange={setPassword} showStrength />
 */

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  showStrength?: boolean;
  strengthLabels?: [string, string, string, string, string];
}

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

function calculateStrength(password: string): StrengthLevel {
  if (!password) return 0;

  let score = 0;

  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Cap at 4
  return Math.min(4, score) as StrengthLevel;
}

const strengthColors: Record<StrengthLevel, string> = {
  0: 'bg-mist',
  1: 'bg-error',
  2: 'bg-warning',
  3: 'bg-info',
  4: 'bg-success',
};

const strengthTextColors: Record<StrengthLevel, string> = {
  0: 'text-lagoon',
  1: 'text-error',
  2: 'text-warning-text',
  3: 'text-info-text',
  4: 'text-success-text',
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      hint,
      showStrength = false,
      strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'],
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const strength = calculateStrength(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">
            {label}
          </label>
        )}

        <div
          className={`
            flex items-center gap-2 px-4 py-2.5
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
          {/* Lock icon */}
          <svg
            className="w-5 h-5 text-lagoon flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className="flex-1 min-w-0 text-abyss placeholder:text-lagoon/50 bg-transparent focus:outline-none"
            {...props}
          />

          {/* Toggle visibility */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="p-1 text-lagoon hover:text-abyss transition-colors rounded"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Strength indicator */}
        {showStrength && value && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    strength >= level ? strengthColors[strength] : 'bg-mist'
                  }`}
                />
              ))}
            </div>
            {strengthLabels[strength] && (
              <p className={`text-xs ${strengthTextColors[strength]}`}>
                {strengthLabels[strength]}
              </p>
            )}
          </div>
        )}

        {/* Hint or error */}
        {(hint || error) && !showStrength && (
          <p className={`text-sm mt-1.5 ${error ? 'text-error' : 'text-lagoon'}`}>
            {error || hint}
          </p>
        )}
        {error && showStrength && (
          <p className="text-sm mt-1 text-error">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
