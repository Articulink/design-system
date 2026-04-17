'use client';

import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink TimePicker Component
 *
 * Time input with dropdown selection.
 *
 * Usage:
 *   <TimePicker value={time} onChange={setTime} />
 *   <TimePicker value={time} onChange={setTime} format="12h" />
 */

export type TimePickerFormat = '12h' | '24h';

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string | null;
  onChange: (value: string | null) => void;
  format?: TimePickerFormat;
  minuteStep?: number;
  minTime?: string;
  maxTime?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
}

function parseTime(time: string): { hours: number; minutes: number } | null {
  const match = time.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

function formatTime(hours: number, minutes: number, format: TimePickerFormat): string {
  if (format === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function timeToMinutes(time: string): number {
  const parsed = parseTime(time);
  if (!parsed) return 0;
  return parsed.hours * 60 + parsed.minutes;
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      format = '12h',
      minuteStep = 15,
      minTime,
      maxTime,
      placeholder = 'Select time',
      label,
      error,
      disabled = false,
      clearable = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Generate time options
    const timeOptions = useCallback(() => {
      const options: string[] = [];
      const minMinutes = minTime ? timeToMinutes(minTime) : 0;
      const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1;

      for (let minutes = 0; minutes < 24 * 60; minutes += minuteStep) {
        if (minutes >= minMinutes && minutes <= maxMinutes) {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          options.push(formatTime(hours, mins, format));
        }
      }
      return options;
    }, [format, minuteStep, minTime, maxTime]);

    const options = timeOptions();

    // Find current value index
    const currentIndex = value ? options.findIndex(opt => opt === value) : -1;

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

    // Scroll to highlighted option
    useEffect(() => {
      if (isOpen && listRef.current) {
        const highlighted = listRef.current.children[highlightedIndex] as HTMLElement;
        highlighted?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, isOpen]);

    // Set initial highlight to current value or noon
    useEffect(() => {
      if (isOpen) {
        if (currentIndex >= 0) {
          setHighlightedIndex(currentIndex);
        } else {
          // Default to noon
          const noonIndex = options.findIndex(opt => opt.includes('12:00'));
          setHighlightedIndex(noonIndex >= 0 ? noonIndex : Math.floor(options.length / 2));
        }
      }
    }, [isOpen, currentIndex, options]);

    const handleSelect = (time: string) => {
      onChange(time);
      setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(i => Math.min(i + 1, options.length - 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex(i => Math.max(i - 1, 0));
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (isOpen && options[highlightedIndex]) {
            handleSelect(options[highlightedIndex]);
          } else {
            setIsOpen(true);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">{label}</label>
        )}

        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
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
            {/* Clock icon */}
            <svg className="w-5 h-5 text-lagoon flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            {value ? (
              <span className="flex-1 truncate text-abyss">{value}</span>
            ) : (
              <span className="flex-1 text-lagoon/50">{placeholder}</span>
            )}

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

          {/* Dropdown */}
          {isOpen && (
            <div
              ref={listRef}
              className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-mist rounded-xl shadow-lg py-1"
            >
              {options.map((time, index) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleSelect(time)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full px-4 py-2 text-left text-sm
                    ${index === highlightedIndex ? 'bg-info-bg' : 'hover:bg-mist/50'}
                    ${time === value ? 'text-tide font-medium' : 'text-abyss'}
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-error text-sm mt-1.5">{error}</p>}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

export default TimePicker;
