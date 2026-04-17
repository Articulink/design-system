'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';
import { Calendar, CalendarMode } from './Calendar';

/**
 * Articulink DatePicker Component
 *
 * Date input with calendar dropdown.
 *
 * Usage:
 *   <DatePicker value={date} onChange={setDate} />
 *   <DatePicker value={range} onChange={setRange} mode="range" />
 */

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | [Date, Date] | null;
  onChange?: (value: Date | [Date, Date] | null) => void;
  mode?: 'single' | 'range';
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  format?: (date: Date) => string;
  numberOfMonths?: number;
}

const defaultFormat = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      mode = 'single',
      minDate,
      maxDate,
      disabledDates,
      placeholder = 'Select date',
      label,
      error,
      disabled = false,
      clearable = false,
      format = defaultFormat,
      numberOfMonths = mode === 'range' ? 2 : 1,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on escape
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleSelect = (selected: Date | Date[] | [Date, Date] | null) => {
      if (mode === 'single') {
        onChange?.(selected as Date | null);
        setIsOpen(false);
      } else if (mode === 'range' && Array.isArray(selected) && selected.length === 2) {
        onChange?.(selected as [Date, Date]);
        setIsOpen(false);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(null);
    };

    const getDisplayValue = (): string => {
      if (!value) return '';

      if (mode === 'single' && value instanceof Date) {
        return format(value);
      }

      if (mode === 'range' && Array.isArray(value) && value.length === 2) {
        return `${format(value[0])} - ${format(value[1])}`;
      }

      return '';
    };

    const displayValue = getDisplayValue();

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">{label}</label>
        )}

        <div ref={containerRef} className="relative">
          {/* Trigger button */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
              w-full flex items-center gap-2 px-4 py-2.5
              bg-white border-2 rounded-xl text-left
              transition-all duration-150
              ${error ? 'border-error' : isOpen ? 'border-tide' : 'border-mist'}
              ${disabled ? 'opacity-50 cursor-not-allowed bg-breeze' : 'cursor-pointer hover:border-bubble'}
              focus:outline-none focus:border-tide focus:shadow-[0_0_0_3px_rgba(3,125,228,0.12)]
            `}
          >
            {/* Calendar icon */}
            <svg className="w-5 h-5 text-lagoon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

            {displayValue ? (
              <span className="flex-1 truncate text-abyss">{displayValue}</span>
            ) : (
              <span className="flex-1 text-lagoon/50">{placeholder}</span>
            )}

            {/* Clear button */}
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-mist rounded transition-colors"
              >
                <svg className="w-4 h-4 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Chevron */}
            <svg
              className={`w-5 h-5 text-lagoon transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Calendar dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-1 left-0">
              <Calendar
                value={value}
                onChange={handleSelect}
                mode={mode as CalendarMode}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                numberOfMonths={numberOfMonths}
              />
            </div>
          )}
        </div>

        {error && <p className="text-error text-sm mt-1.5">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
