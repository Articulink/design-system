'use client';

import { useState, useRef, useEffect, forwardRef, createContext, useContext } from 'react';

/**
 * Articulink Dropdown Component
 *
 * Dropdown menus with keyboard navigation and accessible roles.
 *
 * Usage:
 *   <Dropdown>
 *     <DropdownTrigger>
 *       <button>Options</button>
 *     </DropdownTrigger>
 *     <DropdownMenu>
 *       <DropdownItem onClick={() => {}}>Edit</DropdownItem>
 *       <DropdownItem onClick={() => {}}>Delete</DropdownItem>
 *       <DropdownDivider />
 *       <DropdownItem disabled>Archived</DropdownItem>
 *     </DropdownMenu>
 *   </Dropdown>
 */

interface DropdownContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown provider');
  }
  return context;
}

export interface DropdownProps {
  children: React.ReactNode;
  className?: string;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, className = '' }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
          triggerRef.current?.querySelector('button')?.focus();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen]);

    return (
      <DropdownContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
        <div ref={ref || containerRef} className={`relative inline-block ${className}`}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export interface DropdownTriggerProps {
  children: React.ReactElement;
}

export const DropdownTrigger = forwardRef<HTMLDivElement, DropdownTriggerProps>(
  ({ children }, ref) => {
    const { isOpen, setIsOpen, triggerRef } = useDropdownContext();

    const handleClick = () => {
      setIsOpen(!isOpen);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    return (
      <div
        ref={ref || triggerRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {children}
      </div>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';

export type DropdownMenuAlign = 'start' | 'end';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: DropdownMenuAlign;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, align = 'start', className = '', ...props }, ref) => {
    const { isOpen, setIsOpen } = useDropdownContext();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isOpen && menuRef.current) {
        const firstItem = menuRef.current.querySelector('[role="menuitem"]:not([aria-disabled="true"])') as HTMLElement;
        firstItem?.focus();
      }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const items = Array.from(
        menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])') || []
      ) as HTMLElement[];
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          items[(currentIndex + 1) % items.length]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    };

    if (!isOpen) return null;

    const alignStyles = align === 'end' ? 'right-0' : 'left-0';

    return (
      <div
        ref={ref || menuRef}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`
          absolute z-50 mt-2
          min-w-[180px] py-1
          bg-white rounded-xl
          border border-mist
          shadow-lg
          animate-in fade-in-0 zoom-in-95 duration-150
          ${alignStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
  icon?: React.ReactNode;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ children, destructive = false, disabled, icon, className = '', onClick, ...props }, ref) => {
    const { setIsOpen } = useDropdownContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onClick?.(e);
        setIsOpen(false);
      }
    };

    return (
      <button
        ref={ref}
        role="menuitem"
        type="button"
        aria-disabled={disabled}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 px-4 py-2
          text-sm text-left
          transition-colors duration-100
          focus:outline-none
          ${disabled
            ? 'opacity-50 cursor-not-allowed text-lagoon'
            : destructive
              ? 'text-error hover:bg-error-bg focus:bg-error-bg'
              : 'text-abyss hover:bg-breeze focus:bg-breeze'
          }
          ${className}
        `}
        {...props}
      >
        {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

DropdownItem.displayName = 'DropdownItem';

export interface DropdownDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownDivider = forwardRef<HTMLDivElement, DropdownDividerProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={`my-1 h-px bg-mist ${className}`}
        {...props}
      />
    );
  }
);

DropdownDivider.displayName = 'DropdownDivider';

export default Dropdown;
