'use client';

import { forwardRef, createContext, useContext } from 'react';

/**
 * Articulink Toggle Component
 *
 * Button that toggles between on/off states. Useful for toolbars.
 *
 * Usage:
 *   <Toggle pressed={isBold} onPressedChange={setIsBold}>
 *     <BoldIcon />
 *   </Toggle>
 *
 *   <ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
 *     <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
 *     <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
 *     <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
 *   </ToggleGroup>
 */

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'default' | 'outline';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

const sizeClasses: Record<ToggleSize, string> = {
  sm: 'h-8 px-2 text-sm',
  md: 'h-9 px-3',
  lg: 'h-10 px-4 text-lg',
};

const variantClasses: Record<ToggleVariant, { base: string; pressed: string }> = {
  default: {
    base: 'hover:bg-mist',
    pressed: 'bg-mist text-tide',
  },
  outline: {
    base: 'border border-mist hover:bg-mist hover:border-bubble',
    pressed: 'bg-info-bg border-tide text-tide',
  },
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      size = 'md',
      variant = 'default',
      disabled,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : defaultPressed;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isControlled) {
        onPressedChange?.(!pressed);
      } else {
        onPressedChange?.(!pressed);
      }
      onClick?.(e);
    };

    const styles = variantClasses[variant];

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-pressed={pressed}
        disabled={disabled}
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center rounded-lg
          font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
          ${sizeClasses[size]}
          ${pressed ? styles.pressed : styles.base}
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

Toggle.displayName = 'Toggle';

/**
 * ToggleGroup - Group of toggles for single or multiple selection
 */
type ToggleGroupType = 'single' | 'multiple';

interface ToggleGroupContextType {
  type: ToggleGroupType;
  value: string | string[];
  onValueChange: (value: string) => void;
  size: ToggleSize;
  variant: ToggleVariant;
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextType | null>(null);

export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type: ToggleGroupType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  size?: ToggleSize;
  variant?: ToggleVariant;
  disabled?: boolean;
  children: React.ReactNode;
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type,
      value: controlledValue,
      defaultValue,
      onValueChange,
      size = 'md',
      variant = 'default',
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const value = isControlled
      ? controlledValue
      : defaultValue || (type === 'single' ? '' : []);

    const handleValueChange = (itemValue: string) => {
      if (type === 'single') {
        const newValue = value === itemValue ? '' : itemValue;
        onValueChange?.(newValue);
      } else {
        const currentValue = value as string[];
        const newValue = currentValue.includes(itemValue)
          ? currentValue.filter((v) => v !== itemValue)
          : [...currentValue, itemValue];
        onValueChange?.(newValue);
      }
    };

    return (
      <ToggleGroupContext.Provider
        value={{ type, value, onValueChange: handleValueChange, size, variant, disabled }}
      >
        <div
          ref={ref}
          role="group"
          className={`inline-flex items-center gap-1 ${className}`}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);

ToggleGroup.displayName = 'ToggleGroup';

/**
 * ToggleGroupItem - Individual toggle within a group
 */
export interface ToggleGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  children: React.ReactNode;
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, children, disabled: itemDisabled, className = '', ...props }, ref) => {
    const context = useContext(ToggleGroupContext);
    if (!context) {
      throw new Error('ToggleGroupItem must be used within a ToggleGroup');
    }

    const { type, value: groupValue, onValueChange, size, variant, disabled: groupDisabled } = context;
    const disabled = itemDisabled || groupDisabled;

    const isPressed =
      type === 'single'
        ? groupValue === value
        : (groupValue as string[]).includes(value);

    const styles = variantClasses[variant];

    return (
      <button
        ref={ref}
        type="button"
        role={type === 'single' ? 'radio' : 'checkbox'}
        aria-pressed={isPressed}
        aria-checked={isPressed}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        className={`
          inline-flex items-center justify-center rounded-lg
          font-medium transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
          ${sizeClasses[size]}
          ${isPressed ? styles.pressed : styles.base}
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

ToggleGroupItem.displayName = 'ToggleGroupItem';

export default Toggle;
