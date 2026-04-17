'use client';

import { createContext, useContext, useState, useCallback, forwardRef } from 'react';

/**
 * Articulink Tabs Component
 *
 * Tab navigation with keyboard support and accessible roles.
 *
 * Usage:
 *   <Tabs defaultValue="tab1">
 *     <TabsList>
 *       <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *       <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="tab1">Content 1</TabsContent>
 *     <TabsContent value="tab2">Content 2</TabsContent>
 *   </Tabs>
 */

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue = '', value: controlledValue, onValueChange, children, className = '', ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = useCallback((newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    }, [isControlled, onValueChange]);

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={`
          flex items-center gap-1
          p-1 bg-mist rounded-xl
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className = '', disabled, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isSelected = selectedValue === value;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const tablist = e.currentTarget.parentElement;
      if (!tablist) return;

      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLButtonElement[];
      const currentIndex = tabs.indexOf(e.currentTarget);

      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          break;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabs[nextIndex].focus();
        const nextValue = tabs[nextIndex].getAttribute('data-value');
        if (nextValue) {
          onValueChange(nextValue);
        }
      }
    };

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-controls={`panel-${value}`}
        data-value={value}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        onKeyDown={handleKeyDown}
        className={`
          flex-1 px-4 py-2
          text-sm font-medium
          rounded-lg
          transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
          ${isSelected
            ? 'bg-white text-abyss shadow-sm'
            : 'text-lagoon hover:text-abyss'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, className = '', ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const isSelected = selectedValue === value;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${value}`}
        tabIndex={0}
        className={`mt-4 focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabsContent.displayName = 'TabsContent';

export default Tabs;
