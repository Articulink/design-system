'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink ColorPicker Component
 *
 * Color selection input with presets and custom color support.
 *
 * Usage:
 *   <ColorPicker value={color} onChange={setColor} />
 *   <ColorPicker value={color} onChange={setColor} presets={['#FF0000', '#00FF00', '#0000FF']} />
 */

export interface ColorPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showInput?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
}

const DEFAULT_PRESETS = [
  // Blues
  '#037DE4', '#1E96FC', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8',
  // Greens
  '#10B981', '#34D399', '#6EE7B7', '#059669', '#047857',
  // Yellows/Oranges
  '#FCDE1E', '#F59E0B', '#FBBF24', '#F97316', '#EA580C',
  // Reds/Pinks
  '#EF4444', '#F87171', '#EC4899', '#DB2777', '#BE185D',
  // Purples
  '#8B5CF6', '#A78BFA', '#7C3AED', '#6D28D9', '#5B21B6',
  // Neutrals
  '#012A4D', '#64748B', '#94A3B8', '#CBD5E1', '#F1F5F9',
];

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value,
      onChange,
      presets = DEFAULT_PRESETS,
      showInput = true,
      disabled = false,
      label,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);
    const nativeInputRef = useRef<HTMLInputElement>(null);

    // Sync input value with prop
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // Close on click outside
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

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
    }, [isOpen]);

    const handlePresetClick = useCallback(
      (color: string) => {
        onChange(color);
        setInputValue(color);
      },
      [onChange]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Validate hex color
      if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
        onChange(newValue);
      }
    };

    const handleInputBlur = () => {
      // Reset to current value if invalid
      if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
        setInputValue(value);
      }
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.toUpperCase();
      onChange(newValue);
      setInputValue(newValue);
    };

    const openNativePicker = () => {
      if (!disabled && nativeInputRef.current) {
        nativeInputRef.current.click();
      }
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">
            {label}
          </label>
        )}

        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <div
            className={`
              flex items-center gap-2 p-2 pr-3
              border-2 rounded-xl bg-white
              transition-all duration-150
              ${error ? 'border-error' : isOpen ? 'border-tide' : 'border-mist'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-bubble'}
            `}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            {/* Color swatch */}
            <div
              className="w-8 h-8 rounded-lg border border-mist shadow-inner"
              style={{ backgroundColor: value }}
            />

            {/* Color value */}
            {showInput ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onClick={(e) => e.stopPropagation()}
                disabled={disabled}
                className="flex-1 text-sm font-mono text-abyss bg-transparent focus:outline-none uppercase"
                maxLength={7}
              />
            ) : (
              <span className="flex-1 text-sm font-mono text-abyss uppercase">
                {value}
              </span>
            )}

            {/* Native color picker (hidden) */}
            <input
              ref={nativeInputRef}
              type="color"
              value={value}
              onChange={handleNativeChange}
              disabled={disabled}
              className="sr-only"
            />

            {/* Picker icon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openNativePicker();
              }}
              disabled={disabled}
              className="p-1 hover:bg-mist rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-lagoon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </button>
          </div>

          {/* Preset dropdown */}
          {isOpen && presets.length > 0 && (
            <div className="absolute z-50 mt-1 left-0 right-0 p-3 bg-white border border-mist rounded-xl shadow-lg">
              <div className="grid grid-cols-6 gap-2">
                {presets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    className={`
                      w-8 h-8 rounded-lg border-2 transition-all
                      hover:scale-110
                      ${value.toUpperCase() === color.toUpperCase()
                        ? 'border-abyss ring-2 ring-tide ring-offset-1'
                        : 'border-transparent hover:border-mist'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-error text-sm mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
