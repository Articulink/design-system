'use client';

import { forwardRef, useState, createContext, useContext, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink NavigationMenu Component
 *
 * Site navigation with dropdown menus.
 *
 * Usage:
 *   <NavigationMenu>
 *     <NavigationMenuList>
 *       <NavigationMenuItem>
 *         <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *         <NavigationMenuContent>
 *           <NavigationMenuLink href="/product-a">Product A</NavigationMenuLink>
 *           <NavigationMenuLink href="/product-b">Product B</NavigationMenuLink>
 *         </NavigationMenuContent>
 *       </NavigationMenuItem>
 *       <NavigationMenuItem>
 *         <NavigationMenuLink href="/about">About</NavigationMenuLink>
 *       </NavigationMenuItem>
 *     </NavigationMenuList>
 *   </NavigationMenu>
 */

interface NavigationMenuContextType {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextType | null>(null);

interface NavigationMenuItemContextType {
  id: string;
  isOpen: boolean;
}

const NavigationMenuItemContext = createContext<NavigationMenuItemContextType | null>(null);

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  delayDuration?: number;
}

export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(
  ({ children, delayDuration = 200, className = '', ...props }, ref) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSetActiveItem = useCallback((id: string | null) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (id === null) {
        timeoutRef.current = setTimeout(() => {
          setActiveItem(null);
        }, delayDuration);
      } else {
        setActiveItem(id);
      }
    }, [delayDuration]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <NavigationMenuContext.Provider value={{ activeItem, setActiveItem: handleSetActiveItem }}>
        <nav
          ref={ref}
          className={`relative ${className}`}
          {...props}
        >
          {children}
        </nav>
      </NavigationMenuContext.Provider>
    );
  }
);

NavigationMenu.displayName = 'NavigationMenu';

/**
 * NavigationMenuList - Container for menu items
 */
export interface NavigationMenuListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

export const NavigationMenuList = forwardRef<HTMLUListElement, NavigationMenuListProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={`flex items-center gap-1 ${className}`}
        {...props}
      >
        {children}
      </ul>
    );
  }
);

NavigationMenuList.displayName = 'NavigationMenuList';

/**
 * NavigationMenuItem - Individual menu item
 */
export interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ children, className = '', ...props }, ref) => {
    const context = useContext(NavigationMenuContext);
    if (!context) {
      throw new Error('NavigationMenuItem must be used within a NavigationMenu');
    }

    const idRef = useRef(`nav-item-${Math.random().toString(36).slice(2, 9)}`);
    const { activeItem } = context;
    const isOpen = activeItem === idRef.current;

    return (
      <NavigationMenuItemContext.Provider value={{ id: idRef.current, isOpen }}>
        <li
          ref={ref}
          className={`relative ${className}`}
          {...props}
        >
          {children}
        </li>
      </NavigationMenuItemContext.Provider>
    );
  }
);

NavigationMenuItem.displayName = 'NavigationMenuItem';

/**
 * NavigationMenuTrigger - Button that opens dropdown content
 */
export interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ children, className = '', onMouseEnter, onMouseLeave, ...props }, ref) => {
    const menuContext = useContext(NavigationMenuContext);
    const itemContext = useContext(NavigationMenuItemContext);

    if (!menuContext || !itemContext) {
      throw new Error('NavigationMenuTrigger must be used within a NavigationMenuItem');
    }

    const { setActiveItem } = menuContext;
    const { id, isOpen } = itemContext;

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setActiveItem(id);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setActiveItem(null);
      onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        className={`
          group inline-flex items-center gap-1 px-4 py-2
          text-sm font-medium text-abyss
          rounded-lg transition-colors
          hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-tide
          ${isOpen ? 'bg-mist' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
        <svg
          className={`w-4 h-4 text-lagoon transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }
);

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

/**
 * NavigationMenuContent - Dropdown content container
 */
export interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ children, className = '', onMouseEnter, onMouseLeave, ...props }, ref) => {
    const menuContext = useContext(NavigationMenuContext);
    const itemContext = useContext(NavigationMenuItemContext);

    if (!menuContext || !itemContext) {
      throw new Error('NavigationMenuContent must be used within a NavigationMenuItem');
    }

    const { setActiveItem } = menuContext;
    const { id, isOpen } = itemContext;

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setActiveItem(id);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setActiveItem(null);
      onMouseLeave?.(e);
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          absolute top-full left-0 mt-1 z-50
          min-w-[200px] p-2
          bg-white rounded-xl border border-mist shadow-lg
          animate-in fade-in-0 slide-in-from-top-2
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavigationMenuContent.displayName = 'NavigationMenuContent';

/**
 * NavigationMenuLink - Link within navigation
 */
export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  active?: boolean;
}

export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ children, active, className = '', ...props }, ref) => {
    // Check if we're inside a content dropdown or directly in the menu
    const itemContext = useContext(NavigationMenuItemContext);
    const isInDropdown = itemContext?.isOpen !== undefined;

    if (isInDropdown) {
      // Dropdown link style
      return (
        <a
          ref={ref}
          className={`
            block px-3 py-2 text-sm rounded-lg
            transition-colors
            ${active
              ? 'bg-info-bg text-tide font-medium'
              : 'text-abyss hover:bg-mist'
            }
            ${className}
          `}
          {...props}
        >
          {children}
        </a>
      );
    }

    // Top-level link style (no dropdown)
    return (
      <a
        ref={ref}
        className={`
          inline-flex items-center px-4 py-2
          text-sm font-medium rounded-lg
          transition-colors
          hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-tide
          ${active ? 'text-tide' : 'text-abyss'}
          ${className}
        `}
        {...props}
      >
        {children}
      </a>
    );
  }
);

NavigationMenuLink.displayName = 'NavigationMenuLink';

/**
 * NavigationMenuIndicator - Visual indicator for active item
 */
export interface NavigationMenuIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuIndicator = forwardRef<HTMLDivElement, NavigationMenuIndicatorProps>(
  ({ className = '', ...props }, ref) => {
    const context = useContext(NavigationMenuContext);
    if (!context) {
      throw new Error('NavigationMenuIndicator must be used within a NavigationMenu');
    }

    const { activeItem } = context;

    if (!activeItem) return null;

    return (
      <div
        ref={ref}
        className={`
          absolute bottom-0 left-0 h-0.5 bg-tide
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    );
  }
);

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

/**
 * NavigationMenuViewport - Container for animated content transitions
 */
export interface NavigationMenuViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const NavigationMenuViewport = forwardRef<HTMLDivElement, NavigationMenuViewportProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          absolute top-full left-0 w-full
          perspective-[2000px]
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NavigationMenuViewport.displayName = 'NavigationMenuViewport';

export default NavigationMenu;
