'use client';

import { forwardRef } from 'react';

/**
 * Articulink Button Component
 *
 * Duolingo-style 3D press effect button with brand styling.
 *
 * WCAG 2.1 Compliance:
 * - 2.4.7 Focus Visible: Clear focus indicators
 * - 1.4.3 Contrast: Sufficient color contrast
 * - 4.1.2 Name, Role, Value: Proper semantic HTML
 */

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-tide border-b-4 border-tide-deep text-white font-bold uppercase tracking-wide hover:bg-surf active:border-b-0 active:translate-y-[2px]',
  secondary:
    'bg-white border-2 border-mist border-b-4 text-tide font-bold uppercase tracking-wide hover:bg-breeze active:border-b-2 active:translate-y-[2px]',
  accent:
    'bg-sunshine border-b-4 border-sunshine-deep text-abyss font-bold uppercase tracking-wide hover:brightness-105 active:border-b-0 active:translate-y-[2px]',
  ghost:
    'bg-transparent border-2 border-mist border-b-4 text-tide font-bold uppercase tracking-wide hover:bg-breeze hover:border-bubble active:border-b-2 active:translate-y-[2px]',
  danger:
    'bg-error border-b-4 border-[#dc2626] text-white font-bold uppercase tracking-wide hover:bg-[#dc2626] active:border-b-0 active:translate-y-[2px]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-xs rounded-xl border-b-[3px]',
  md: 'px-8 py-3 text-sm rounded-2xl',
  lg: 'px-10 py-4 text-base rounded-2xl border-b-[5px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2
          transition-all duration-100
          focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:border-b-0
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          <>
            {icon && <span aria-hidden="true">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
