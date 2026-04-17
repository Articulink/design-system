'use client';

import { forwardRef, useState, createContext, useContext, useRef, useEffect } from 'react';

/**
 * Articulink Collapsible Component
 *
 * Animated expand/collapse container.
 *
 * Usage:
 *   <Collapsible>
 *     <CollapsibleTrigger>
 *       <Button>Toggle</Button>
 *     </CollapsibleTrigger>
 *     <CollapsibleContent>
 *       Hidden content here
 *     </CollapsibleContent>
 *   </Collapsible>
 */

interface CollapsibleContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const contentId = useRef(`collapsible-${Math.random().toString(36).slice(2, 9)}`).current;

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

    const setIsOpen = (open: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      onOpenChange?.(open);
    };

    return (
      <CollapsibleContext.Provider value={{ isOpen, setIsOpen, contentId }}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          className={className}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);

Collapsible.displayName = 'Collapsible';

/**
 * CollapsibleTrigger - Button that toggles the collapsible
 */
export interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, asChild = false, className = '', onClick, ...props }, ref) => {
    const context = useContext(CollapsibleContext);
    if (!context) {
      throw new Error('CollapsibleTrigger must be used within a Collapsible');
    }

    const { isOpen, setIsOpen, contentId } = context;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsOpen(!isOpen);
      onClick?.(e);
    };

    if (asChild && children) {
      return (
        <span
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          {children}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

/**
 * CollapsibleContent - The collapsible content
 */
export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  forceMount?: boolean;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, forceMount = false, className = '', style, ...props }, ref) => {
    const context = useContext(CollapsibleContext);
    if (!context) {
      throw new Error('CollapsibleContent must be used within a Collapsible');
    }

    const { isOpen, contentId } = context;
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState(false);

    // Measure content height for animation
    useEffect(() => {
      if (contentRef.current) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setHeight(entry.contentRect.height);
          }
        });

        resizeObserver.observe(contentRef.current);
        return () => resizeObserver.disconnect();
      }
    }, []);

    // Track animation state
    useEffect(() => {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isOpen && !forceMount && !isAnimating) {
      return null;
    }

    return (
      <div
        id={contentId}
        data-state={isOpen ? 'open' : 'closed'}
        className={`overflow-hidden transition-all duration-200 ease-out ${className}`}
        style={{
          ...style,
          height: isOpen ? height : 0,
          opacity: isOpen ? 1 : 0,
        }}
        {...props}
      >
        <div ref={contentRef}>
          <div ref={ref}>{children}</div>
        </div>
      </div>
    );
  }
);

CollapsibleContent.displayName = 'CollapsibleContent';

export default Collapsible;
