'use client';

import { forwardRef } from 'react';

/**
 * Articulink Kbd Component
 *
 * Keyboard key display for shortcuts and instructions.
 *
 * Usage:
 *   <Kbd>⌘</Kbd><Kbd>K</Kbd>
 *   <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
 *   <KbdShortcut keys={['⌘', 'Shift', 'P']} />
 */

export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  size?: KbdSize;
}

const sizeClasses: Record<KbdSize, string> = {
  sm: 'text-xs px-1 py-0.5 min-w-[18px]',
  md: 'text-xs px-1.5 py-1 min-w-[22px]',
  lg: 'text-sm px-2 py-1 min-w-[26px]',
};

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ children, size = 'md', className = '', ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-sans font-medium
          bg-mist text-lagoon
          border border-mist/80 rounded
          shadow-[0_1px_0_1px_rgba(0,0,0,0.05)]
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = 'Kbd';

/**
 * KbdShortcut - Display a keyboard shortcut with multiple keys
 */
export interface KbdShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[];
  separator?: string;
  size?: KbdSize;
}

export const KbdShortcut = forwardRef<HTMLSpanElement, KbdShortcutProps>(
  ({ keys, separator = '', size = 'md', className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-0.5 ${className}`}
        {...props}
      >
        {keys.map((key, index) => (
          <span key={index} className="inline-flex items-center gap-0.5">
            <Kbd size={size}>{key}</Kbd>
            {separator && index < keys.length - 1 && (
              <span className="text-lagoon text-xs mx-0.5">{separator}</span>
            )}
          </span>
        ))}
      </span>
    );
  }
);

KbdShortcut.displayName = 'KbdShortcut';

export default Kbd;
