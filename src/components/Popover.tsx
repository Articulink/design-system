'use client';

import { forwardRef, useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';

/**
 * Articulink Popover Component
 *
 * Floating content panel triggered by click.
 *
 * Usage:
 *   <Popover>
 *     <PopoverTrigger>
 *       <Button>Open</Button>
 *     </PopoverTrigger>
 *     <PopoverContent>
 *       Popover content here
 *     </PopoverContent>
 *   </Popover>
 */

export type PopoverAlign = 'start' | 'center' | 'end';
export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

interface PopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextType | null>(null);

export interface PopoverProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !contentRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setIsOpen]);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

Popover.displayName = 'Popover';

/**
 * PopoverTrigger - Element that triggers the popover
 */
export interface PopoverTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ children, asChild = true }, _ref) => {
    const context = useContext(PopoverContext);
    if (!context) {
      throw new Error('PopoverTrigger must be used within a Popover');
    }

    const { isOpen, setIsOpen, triggerRef } = context;

    const handleClick = () => {
      setIsOpen(!isOpen);
    };

    if (asChild && children) {
      return (
        <span
          ref={triggerRef as React.RefObject<HTMLSpanElement>}
          onClick={handleClick}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {children}
        </span>
      );
    }

    return (
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {children}
      </button>
    );
  }
);

PopoverTrigger.displayName = 'PopoverTrigger';

/**
 * PopoverContent - The floating content
 */
export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
}

const sidePositionClasses: Record<PopoverSide, string> = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

const alignClasses: Record<PopoverSide, Record<PopoverAlign, string>> = {
  top: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  bottom: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  left: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
  right: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      children,
      side = 'bottom',
      align = 'center',
      sideOffset,
      alignOffset,
      className = '',
      style,
      ...props
    },
    _ref
  ) => {
    const context = useContext(PopoverContext);
    if (!context) {
      throw new Error('PopoverContent must be used within a Popover');
    }

    const { isOpen, contentRef } = context;

    if (!isOpen) return null;

    const offsetStyle = {
      ...style,
      ...(sideOffset !== undefined && (side === 'top' || side === 'bottom')
        ? { marginTop: side === 'bottom' ? sideOffset : undefined, marginBottom: side === 'top' ? sideOffset : undefined }
        : {}),
      ...(sideOffset !== undefined && (side === 'left' || side === 'right')
        ? { marginLeft: side === 'right' ? sideOffset : undefined, marginRight: side === 'left' ? sideOffset : undefined }
        : {}),
      ...(alignOffset !== undefined && (side === 'top' || side === 'bottom')
        ? { marginLeft: alignOffset, marginRight: -alignOffset }
        : {}),
    };

    return (
      <div
        ref={contentRef}
        role="dialog"
        className={`
          absolute z-50
          ${sidePositionClasses[side]}
          ${alignClasses[side][align]}
          bg-white rounded-xl border border-mist shadow-lg
          animate-in fade-in-0 zoom-in-95
          ${className}
        `}
        style={offsetStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PopoverContent.displayName = 'PopoverContent';

/**
 * PopoverHeader - Header section
 */
export interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`px-4 py-3 border-b border-mist ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

PopoverHeader.displayName = 'PopoverHeader';

/**
 * PopoverBody - Main content area
 */
export interface PopoverBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`px-4 py-3 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

PopoverBody.displayName = 'PopoverBody';

/**
 * PopoverFooter - Footer section
 */
export interface PopoverFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PopoverFooter = forwardRef<HTMLDivElement, PopoverFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`px-4 py-3 border-t border-mist bg-breeze rounded-b-xl ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

PopoverFooter.displayName = 'PopoverFooter';

/**
 * PopoverClose - Button to close popover
 */
export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ children, className = '', onClick, ...props }, ref) => {
    const context = useContext(PopoverContext);
    if (!context) {
      throw new Error('PopoverClose must be used within a Popover');
    }

    const { setIsOpen } = context;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(false);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={`p-1 text-lagoon hover:text-abyss hover:bg-mist rounded transition-colors ${className}`}
        {...props}
      >
        {children || (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    );
  }
);

PopoverClose.displayName = 'PopoverClose';

export default Popover;
