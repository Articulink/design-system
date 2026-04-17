'use client';

import { forwardRef, useEffect, useCallback, useRef } from 'react';

/**
 * Articulink Drawer Component
 *
 * Slide-in panel from edge of screen.
 *
 * Usage:
 *   <Drawer isOpen={open} onClose={() => setOpen(false)} title="Filters">
 *     <DrawerContent>...</DrawerContent>
 *     <DrawerFooter>...</DrawerFooter>
 *   </Drawer>
 */

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  size?: DrawerSize;
  title?: string;
  description?: string;
  showOverlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

const sizeClasses: Record<DrawerPosition, Record<DrawerSize, string>> = {
  left: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[28rem]',
    full: 'w-full',
  },
  right: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    xl: 'w-[28rem]',
    full: 'w-full',
  },
  top: {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96',
    full: 'h-full',
  },
  bottom: {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96',
    full: 'h-full',
  },
};

const positionClasses: Record<DrawerPosition, { container: string; open: string; closed: string }> = {
  left: {
    container: 'left-0 top-0 h-full',
    open: 'translate-x-0',
    closed: '-translate-x-full',
  },
  right: {
    container: 'right-0 top-0 h-full',
    open: 'translate-x-0',
    closed: 'translate-x-full',
  },
  top: {
    container: 'top-0 left-0 w-full',
    open: 'translate-y-0',
    closed: '-translate-y-full',
  },
  bottom: {
    container: 'bottom-0 left-0 w-full',
    open: 'translate-y-0',
    closed: 'translate-y-full',
  },
};

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      position = 'right',
      size = 'md',
      title,
      description,
      showOverlay = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const posStyles = positionClasses[position];
    const sizeClass = sizeClasses[position][size];

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Lock body scroll when open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    // Focus trap
    useEffect(() => {
      if (!isOpen) return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusableElements = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      drawer.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => drawer.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlayClick) {
        onClose();
      }
    }, [closeOnOverlayClick, onClose]);

    if (!isOpen) return null;

    return (
      <div ref={ref} className={`fixed inset-0 z-50 ${className}`} {...props}>
        {/* Overlay */}
        {showOverlay && (
          <div
            className={`
              absolute inset-0 bg-black/50 backdrop-blur-sm
              transition-opacity duration-300
              ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Drawer panel */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          aria-describedby={description ? 'drawer-description' : undefined}
          className={`
            fixed ${posStyles.container} ${sizeClass}
            bg-white shadow-xl
            flex flex-col
            transform transition-transform duration-300 ease-out
            ${isOpen ? posStyles.open : posStyles.closed}
          `}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex-shrink-0 px-6 py-4 border-b border-mist">
              <div className="flex items-start justify-between">
                <div>
                  {title && (
                    <h2 id="drawer-title" className="text-lg font-semibold text-abyss">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="drawer-description" className="text-sm text-lagoon mt-1">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -mr-2 text-lagoon hover:text-abyss hover:bg-mist rounded-lg transition-colors"
                  aria-label="Close drawer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  }
);

Drawer.displayName = 'Drawer';

/**
 * DrawerContent - Main content area
 */
export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`px-6 py-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

DrawerContent.displayName = 'DrawerContent';

/**
 * DrawerFooter - Footer with actions
 */
export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex-shrink-0 px-6 py-4 border-t border-mist bg-breeze ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DrawerFooter.displayName = 'DrawerFooter';

export default Drawer;
