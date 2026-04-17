'use client';

import { createContext, useContext, useState, forwardRef, useId } from 'react';

/**
 * Articulink Accordion Component
 *
 * Expandable/collapsible panels for FAQs, settings, etc.
 *
 * Usage:
 *   <Accordion type="single" defaultValue="item-1">
 *     <AccordionItem value="item-1">
 *       <AccordionTrigger>Section 1</AccordionTrigger>
 *       <AccordionContent>Content here...</AccordionContent>
 *     </AccordionItem>
 *     <AccordionItem value="item-2">
 *       <AccordionTrigger>Section 2</AccordionTrigger>
 *       <AccordionContent>More content...</AccordionContent>
 *     </AccordionItem>
 *   </Accordion>
 */

type AccordionType = 'single' | 'multiple';

interface AccordionContextValue {
  type: AccordionType;
  value: string | string[];
  onValueChange: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion');
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger/Content must be used within an AccordionItem');
  }
  return context;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      defaultValue,
      value: controlledValue,
      onValueChange,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
      defaultValue ?? (type === 'multiple' ? [] : '')
    );

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = (itemValue: string) => {
      let newValue: string | string[];

      if (type === 'single') {
        newValue = value === itemValue ? '' : itemValue;
      } else {
        const currentValue = Array.isArray(value) ? value : [];
        newValue = currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue];
      }

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
        <div ref={ref} className={`divide-y divide-mist ${className}`} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = 'Accordion';

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, children, className = '', ...props }, ref) => {
    const { value: accordionValue, type } = useAccordionContext();
    const id = useId();

    const isOpen = type === 'single'
      ? accordionValue === value
      : Array.isArray(accordionValue) && accordionValue.includes(value);

    return (
      <AccordionItemContext.Provider
        value={{
          value,
          isOpen,
          triggerId: `${id}-trigger`,
          contentId: `${id}-content`,
        }}
      >
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={disabled || undefined}
          className={`${disabled ? 'opacity-50' : ''} ${className}`}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className = '', ...props }, ref) => {
    const { onValueChange } = useAccordionContext();
    const { value, isOpen, triggerId, contentId } = useAccordionItemContext();

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => onValueChange(value)}
        className={`
          flex w-full items-center justify-between py-4
          text-left text-base font-medium text-abyss
          hover:text-tide
          transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
          ${className}
        `}
        {...props}
      >
        {children}
        <svg
          className={`
            w-5 h-5 text-lagoon flex-shrink-0 ml-2
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
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

AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isOpen, triggerId, contentId } = useAccordionItemContext();

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className={`
          overflow-hidden
          transition-all duration-200 ease-in-out
          ${isOpen ? 'pb-4' : ''}
          ${className}
        `}
        {...props}
      >
        <div className="text-sm text-lagoon leading-relaxed">
          {children}
        </div>
      </div>
    );
  }
);

AccordionContent.displayName = 'AccordionContent';

export default Accordion;
