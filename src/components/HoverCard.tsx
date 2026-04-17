'use client';

import { forwardRef, useState, useRef, useEffect, createContext, useContext, useCallback } from 'react';

/**
 * Articulink HoverCard Component
 *
 * Content preview that appears on hover.
 *
 * Usage:
 *   <HoverCard>
 *     <HoverCardTrigger>
 *       <a href="/user/123">@username</a>
 *     </HoverCardTrigger>
 *     <HoverCardContent>
 *       <UserPreview userId="123" />
 *     </HoverCardContent>
 *   </HoverCard>
 */

export type HoverCardSide = 'top' | 'bottom' | 'left' | 'right';
export type HoverCardAlign = 'start' | 'center' | 'end';

interface HoverCardContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  openDelay: number;
  closeDelay: number;
}

const HoverCardContext = createContext<HoverCardContextType | null>(null);

export interface HoverCardProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

export function HoverCard({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  openDelay = 200,
  closeDelay = 300,
}: HoverCardProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement>(null);

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

  return (
    <HoverCardContext.Provider value={{ isOpen, setIsOpen, triggerRef, openDelay, closeDelay }}>
      <div className="relative inline-block">{children}</div>
    </HoverCardContext.Provider>
  );
}

HoverCard.displayName = 'HoverCard';

/**
 * HoverCardTrigger - Element that triggers the hover card
 */
export interface HoverCardTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export const HoverCardTrigger = forwardRef<HTMLElement, HoverCardTriggerProps>(
  ({ children, asChild = true }, _ref) => {
    const context = useContext(HoverCardContext);
    if (!context) {
      throw new Error('HoverCardTrigger must be used within a HoverCard');
    }

    const { setIsOpen, triggerRef, openDelay, closeDelay } = context;
    const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      openTimerRef.current = setTimeout(() => setIsOpen(true), openDelay);
    };

    const handleMouseLeave = () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      closeTimerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
    };

    useEffect(() => {
      return () => {
        if (openTimerRef.current) clearTimeout(openTimerRef.current);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      };
    }, []);

    if (asChild && children) {
      return (
        <span
          ref={triggerRef as React.RefObject<HTMLSpanElement>}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          {children}
        </span>
      );
    }

    return (
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </span>
    );
  }
);

HoverCardTrigger.displayName = 'HoverCardTrigger';

/**
 * HoverCardContent - The floating content
 */
export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  side?: HoverCardSide;
  align?: HoverCardAlign;
  sideOffset?: number;
}

const sidePositionClasses: Record<HoverCardSide, string> = {
  top: 'bottom-full mb-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
  right: 'left-full ml-2',
};

const alignClasses: Record<HoverCardSide, Record<HoverCardAlign, string>> = {
  top: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  bottom: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  left: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
  right: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
};

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  (
    {
      children,
      side = 'bottom',
      align = 'center',
      sideOffset,
      className = '',
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const context = useContext(HoverCardContext);
    if (!context) {
      throw new Error('HoverCardContent must be used within a HoverCard');
    }

    const { isOpen, setIsOpen, closeDelay } = context;
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      closeTimerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
      onMouseLeave?.(e);
    };

    useEffect(() => {
      return () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      };
    }, []);

    if (!isOpen) return null;

    const offsetStyle = sideOffset
      ? {
          ...style,
          ...(side === 'top' && { marginBottom: sideOffset }),
          ...(side === 'bottom' && { marginTop: sideOffset }),
          ...(side === 'left' && { marginRight: sideOffset }),
          ...(side === 'right' && { marginLeft: sideOffset }),
        }
      : style;

    return (
      <div
        ref={ref}
        className={`
          absolute z-50
          ${sidePositionClasses[side]}
          ${alignClasses[side][align]}
          bg-white rounded-xl border border-mist shadow-lg
          animate-in fade-in-0 zoom-in-95
          ${className}
        `}
        style={offsetStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HoverCardContent.displayName = 'HoverCardContent';

export default HoverCard;
