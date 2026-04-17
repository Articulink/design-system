'use client';

import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';

/**
 * Articulink SearchInput Component
 *
 * Search input with icon, clear button, and optional debounce.
 *
 * Usage:
 *   <SearchInput
 *     value={query}
 *     onChange={setQuery}
 *     placeholder="Search..."
 *   />
 *
 *   <SearchInput
 *     value={search}
 *     onChange={setSearch}
 *     onSearch={handleSearch}
 *     debounce={300}
 *   />
 */

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  debounce?: number;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    input: 'pl-9 pr-8 py-2 text-sm',
    icon: 'left-3 w-4 h-4',
    clear: 'right-2 w-4 h-4',
  },
  md: {
    input: 'pl-10 pr-9 py-2.5 text-base',
    icon: 'left-3 w-5 h-5',
    clear: 'right-3 w-5 h-5',
  },
  lg: {
    input: 'pl-12 pr-10 py-3 text-lg',
    icon: 'left-4 w-6 h-6',
    clear: 'right-3 w-6 h-6',
  },
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onSearch,
      debounce = 0,
      loading = false,
      size = 'md',
      placeholder = 'Search...',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const styles = sizeStyles[size];

    // Sync internal value with external value
    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange(newValue);

      if (onSearch) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        if (debounce > 0) {
          debounceRef.current = setTimeout(() => {
            onSearch(newValue);
          }, debounce);
        } else {
          onSearch(newValue);
        }
      }
    }, [onChange, onSearch, debounce]);

    const handleClear = useCallback(() => {
      setInternalValue('');
      onChange('');
      onSearch?.('');

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    }, [onChange, onSearch]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        onSearch(internalValue);
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    }, [onSearch, internalValue, handleClear]);

    // Cleanup debounce on unmount
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <div className={`relative ${className}`}>
        {/* Search icon */}
        <div className={`absolute ${styles.icon} top-1/2 -translate-y-1/2 text-lagoon pointer-events-none`}>
          {loading ? (
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full
            ${styles.input}
            bg-white text-abyss
            border-2 border-mist rounded-xl
            placeholder:text-lagoon/50
            transition-all duration-150
            focus:outline-none focus:border-tide focus:shadow-[0_0_0_3px_rgba(3,125,228,0.12)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-breeze
          `}
          {...props}
        />

        {/* Clear button */}
        {internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`
              absolute ${styles.clear} top-1/2 -translate-y-1/2
              text-lagoon hover:text-abyss
              transition-colors
              focus:outline-none
            `}
            aria-label="Clear search"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
