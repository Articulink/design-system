'use client';

import { forwardRef, useState, useCallback } from 'react';

/**
 * Articulink CopyButton Component
 *
 * Button that copies text to clipboard with feedback.
 *
 * Usage:
 *   <CopyButton text="Hello World" />
 *   <CopyButton text={codeSnippet} label="Copy code" />
 */

export type CopyButtonSize = 'sm' | 'md' | 'lg';
export type CopyButtonVariant = 'default' | 'ghost' | 'outline';

export interface CopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  text: string;
  label?: string;
  copiedLabel?: string;
  size?: CopyButtonSize;
  variant?: CopyButtonVariant;
  showLabel?: boolean;
  onCopy?: () => void;
  onCopyError?: (error: Error) => void;
  resetDelay?: number;
}

const sizeClasses: Record<CopyButtonSize, { button: string; icon: string }> = {
  sm: { button: 'h-7 px-2 text-xs gap-1', icon: 'w-3.5 h-3.5' },
  md: { button: 'h-8 px-3 text-sm gap-1.5', icon: 'w-4 h-4' },
  lg: { button: 'h-10 px-4 text-base gap-2', icon: 'w-5 h-5' },
};

const variantClasses: Record<CopyButtonVariant, string> = {
  default: 'bg-mist hover:bg-bubble text-abyss',
  ghost: 'hover:bg-mist text-lagoon hover:text-abyss',
  outline: 'border border-mist hover:border-bubble hover:bg-mist/50 text-abyss',
};

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      text,
      label = 'Copy',
      copiedLabel = 'Copied!',
      size = 'md',
      variant = 'default',
      showLabel = false,
      onCopy,
      onCopyError,
      resetDelay = 2000,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);
    const styles = sizeClasses[size];

    const handleCopy = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopy?.();

        setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (err) {
        onCopyError?.(err instanceof Error ? err : new Error('Failed to copy'));
      }
    }, [text, onCopy, onCopyError, resetDelay]);

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center rounded-lg
          font-medium transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-1
          ${styles.button}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${copied ? 'text-success' : ''}
          ${className}
        `}
        title={label}
        {...props}
      >
        {copied ? (
          <>
            <svg
              className={`${styles.icon} text-success`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {showLabel && <span>{copiedLabel}</span>}
          </>
        ) : (
          <>
            <svg
              className={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {showLabel && <span>{label}</span>}
          </>
        )}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';

export default CopyButton;
