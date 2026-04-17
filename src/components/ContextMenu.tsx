'use client';

import { forwardRef, useState, useRef, useEffect, createContext, useContext, useCallback } from 'react';

/**
 * Articulink ContextMenu Component
 *
 * Right-click context menu.
 *
 * Usage:
 *   <ContextMenu>
 *     <ContextMenuTrigger>
 *       <div>Right-click me</div>
 *     </ContextMenuTrigger>
 *     <ContextMenuContent>
 *       <ContextMenuItem onSelect={() => copy()}>Copy</ContextMenuItem>
 *       <ContextMenuItem onSelect={() => paste()}>Paste</ContextMenuItem>
 *       <ContextMenuSeparator />
 *       <ContextMenuItem onSelect={() => remove()} destructive>Delete</ContextMenuItem>
 *     </ContextMenuContent>
 *   </ContextMenu>
 */

interface ContextMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export interface ContextMenuProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function ContextMenu({ children, onOpenChange }: ContextMenuProps) {
  const [isOpen, setIsOpenState] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const setIsOpen = useCallback(
    (open: boolean) => {
      setIsOpenState(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  return (
    <ContextMenuContext.Provider value={{ isOpen, setIsOpen, position, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

ContextMenu.displayName = 'ContextMenu';

/**
 * ContextMenuTrigger - Area that responds to right-click
 */
export interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

export const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ children, disabled, className = '', onContextMenu, ...props }, ref) => {
    const context = useContext(ContextMenuContext);
    if (!context) {
      throw new Error('ContextMenuTrigger must be used within a ContextMenu');
    }

    const { setIsOpen, setPosition } = context;

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
      onContextMenu?.(e);
    };

    return (
      <div
        ref={ref}
        onContextMenu={handleContextMenu}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

/**
 * ContextMenuContent - The menu container
 */
export interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ children, className = '', ...props }, ref) => {
    const context = useContext(ContextMenuContext);
    if (!context) {
      throw new Error('ContextMenuContent must be used within a ContextMenu');
    }

    const { isOpen, setIsOpen, position } = context;
    const menuRef = useRef<HTMLDivElement>(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    // Adjust position to stay within viewport
    useEffect(() => {
      if (!isOpen || !menuRef.current) return;

      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      // Adjust if menu would overflow right
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 8;
      }

      // Adjust if menu would overflow bottom
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 8;
      }

      // Ensure minimum bounds
      x = Math.max(8, x);
      y = Math.max(8, y);

      setAdjustedPosition({ x, y });
    }, [isOpen, position]);

    // Close on click outside
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      // Close on any click (including inside to handle item selection)
      const handleClick = () => {
        setTimeout(() => setIsOpen(false), 0);
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('click', handleClick);
      };
    }, [isOpen, setIsOpen]);

    // Close on escape
    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, setIsOpen]);

    // Close on scroll
    useEffect(() => {
      if (!isOpen) return;

      const handleScroll = () => {
        setIsOpen(false);
      };

      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
      <div
        ref={menuRef}
        className={`
          fixed z-50 min-w-[160px]
          bg-white rounded-xl border border-mist shadow-lg
          py-1 overflow-hidden
          animate-in fade-in-0 zoom-in-95
          ${className}
        `}
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
        {...props}
      >
        <div ref={ref}>{children}</div>
      </div>
    );
  }
);

ContextMenuContent.displayName = 'ContextMenuContent';

/**
 * ContextMenuItem - Individual menu item
 */
export interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
}

export const ContextMenuItem = forwardRef<HTMLButtonElement, ContextMenuItemProps>(
  ({ children, onSelect, destructive, icon, shortcut, disabled, className = '', onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onSelect?.();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-2 px-3 py-2 text-left text-sm
          transition-colors
          ${destructive
            ? 'text-error hover:bg-error-bg'
            : 'text-abyss hover:bg-mist/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
        <span className="flex-1">{children}</span>
        {shortcut && (
          <span className="text-xs text-lagoon ml-auto">{shortcut}</span>
        )}
      </button>
    );
  }
);

ContextMenuItem.displayName = 'ContextMenuItem';

/**
 * ContextMenuSeparator - Divider between items
 */
export interface ContextMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenuSeparator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`my-1 h-px bg-mist ${className}`}
        role="separator"
        {...props}
      />
    );
  }
);

ContextMenuSeparator.displayName = 'ContextMenuSeparator';

/**
 * ContextMenuLabel - Label/header for menu sections
 */
export interface ContextMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ContextMenuLabel = forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-3 py-1.5 text-xs font-semibold text-lagoon uppercase tracking-wider ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContextMenuLabel.displayName = 'ContextMenuLabel';

export default ContextMenu;
