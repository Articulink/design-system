'use client';

import { forwardRef, createContext, useContext, useState, useCallback } from 'react';

/**
 * Articulink Sidebar Component
 *
 * Collapsible sidebar navigation.
 *
 * Usage:
 *   <Sidebar>
 *     <SidebarHeader>Logo</SidebarHeader>
 *     <SidebarContent>
 *       <SidebarGroup title="Main">
 *         <SidebarItem href="/" icon={<HomeIcon />}>Home</SidebarItem>
 *         <SidebarItem href="/settings" icon={<SettingsIcon />}>Settings</SidebarItem>
 *       </SidebarGroup>
 *     </SidebarContent>
 *     <SidebarFooter>Footer content</SidebarFooter>
 *   </Sidebar>
 */

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar');
  }
  return context;
};

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  width?: number;
  collapsedWidth?: number;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      children,
      defaultCollapsed = false,
      collapsible = true,
      width = 256,
      collapsedWidth = 64,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const currentWidth = isCollapsed ? collapsedWidth : width;

    return (
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }}>
        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-abyss/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          ref={ref}
          className={`
            fixed top-0 left-0 z-50 h-full
            bg-white border-r border-mist
            flex flex-col
            transition-all duration-200
            lg:relative lg:z-auto
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${className}
          `}
          style={{ width: currentWidth }}
          {...props}
        >
          {children}

          {/* Collapse toggle */}
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 items-center justify-center bg-white border border-mist rounded-full shadow-sm hover:bg-mist transition-colors"
            >
              <svg
                className={`w-4 h-4 text-lagoon transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </aside>
      </SidebarContext.Provider>
    );
  }
);

Sidebar.displayName = 'Sidebar';

/**
 * SidebarHeader
 */
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div
        ref={ref}
        className={`flex-shrink-0 p-4 border-b border-mist ${className}`}
        {...props}
      >
        <div className={`${isCollapsed ? 'flex justify-center' : ''}`}>{children}</div>
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';

/**
 * SidebarContent
 */
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex-1 overflow-y-auto py-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

/**
 * SidebarFooter
 */
export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div
        ref={ref}
        className={`flex-shrink-0 p-4 border-t border-mist ${className}`}
        {...props}
      >
        <div className={`${isCollapsed ? 'flex justify-center' : ''}`}>{children}</div>
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';

/**
 * SidebarGroup
 */
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ title, children, className = '', ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div ref={ref} className={`mb-4 ${className}`} {...props}>
        {title && !isCollapsed && (
          <h3 className="px-4 mb-2 text-xs font-semibold text-lagoon uppercase tracking-wider">
            {title}
          </h3>
        )}
        <nav className="space-y-1">{children}</nav>
      </div>
    );
  }
);

SidebarGroup.displayName = 'SidebarGroup';

/**
 * SidebarItem
 */
export interface SidebarItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(
  ({ href, icon, active, disabled, badge, children, className = '', onClick, ...props }, ref) => {
    const { isCollapsed, setIsMobileOpen } = useSidebar();

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      setIsMobileOpen(false);
      onClick?.(e);
    };

    const content = (
      <>
        {icon && (
          <span className={`flex-shrink-0 ${active ? 'text-tide' : 'text-lagoon'}`}>{icon}</span>
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{children}</span>
            {badge && <span className="flex-shrink-0">{badge}</span>}
          </>
        )}
      </>
    );

    const itemClasses = `
      flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
      transition-colors
      ${active ? 'bg-info-bg text-tide font-medium' : 'text-abyss hover:bg-mist'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${isCollapsed ? 'justify-center' : ''}
      ${className}
    `;

    if (href && !disabled) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={itemClasses}
          onClick={handleClick}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        className={itemClasses}
        onClick={handleClick}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

/**
 * SidebarTrigger - Mobile menu trigger
 */
export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className = '', ...props }, ref) => {
    const { setIsMobileOpen } = useSidebar();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={`lg:hidden p-2 hover:bg-mist rounded-lg transition-colors ${className}`}
        {...props}
      >
        <svg className="w-6 h-6 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }
);

SidebarTrigger.displayName = 'SidebarTrigger';

export default Sidebar;
