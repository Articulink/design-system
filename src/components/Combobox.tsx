'use client';

import { forwardRef, useState, useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * Articulink Combobox Component
 *
 * Searchable select/autocomplete input.
 *
 * Usage:
 *   <Combobox
 *     options={[{ value: '1', label: 'Option 1' }]}
 *     value={selected}
 *     onChange={setSelected}
 *     placeholder="Select option..."
 *   />
 */

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  loading?: boolean;
  creatable?: boolean;
  onCreate?: (value: string) => void;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      onSearch,
      placeholder = 'Select...',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No options found',
      label,
      error,
      disabled = false,
      clearable = false,
      loading = false,
      creatable = false,
      onCreate,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Filter options based on query
    const filteredOptions = useMemo(() => {
      if (!query) return options;
      const lowerQuery = query.toLowerCase();
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(lowerQuery) ||
          opt.description?.toLowerCase().includes(lowerQuery)
      );
    }, [options, query]);

    // Get selected option
    const selectedOption = options.find((opt) => opt.value === value);

    // Handle search
    useEffect(() => {
      onSearch?.(query);
    }, [query, onSearch]);

    // Reset highlight when filtered options change
    useEffect(() => {
      setHighlightedIndex(0);
    }, [filteredOptions.length]);

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

    // Scroll highlighted option into view
    useEffect(() => {
      if (isOpen && listRef.current) {
        const highlighted = listRef.current.children[highlightedIndex] as HTMLElement;
        highlighted?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, isOpen]);

    const handleSelect = useCallback(
      (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setQuery('');
      },
      [onChange]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setQuery('');
      },
      [onChange]
    );

    const handleCreate = useCallback(() => {
      if (creatable && query && onCreate) {
        onCreate(query);
        setQuery('');
        setIsOpen(false);
      }
    }, [creatable, query, onCreate]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (isOpen && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          } else if (isOpen && creatable && query && filteredOptions.length === 0) {
            handleCreate();
          } else {
            setIsOpen(true);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
        case 'Tab':
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
          {/* Trigger button */}
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
            {selectedOption ? (
              <span className="flex-1 truncate text-abyss">
                {selectedOption.icon && <span className="mr-2">{selectedOption.icon}</span>}
                {selectedOption.label}
              </span>
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

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-mist rounded-xl shadow-lg overflow-hidden">
              {/* Search input */}
              <div className="p-2 border-b border-mist">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full px-3 py-2 bg-mist/50 rounded-lg text-sm text-abyss placeholder:text-lagoon/50 focus:outline-none focus:ring-2 focus:ring-tide/20"
                  autoFocus
                />
              </div>

              {/* Options list */}
              <ul
                ref={listRef}
                className="max-h-60 overflow-y-auto py-1"
                role="listbox"
              >
                {loading ? (
                  <li className="px-4 py-3 text-center text-lagoon">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-tide border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  </li>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={option.value === value}
                      className={`
                        px-4 py-2.5 cursor-pointer
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${index === highlightedIndex ? 'bg-info-bg' : 'hover:bg-mist/50'}
                        ${option.value === value ? 'text-tide font-medium' : 'text-abyss'}
                      `}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon && <span>{option.icon}</span>}
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{option.label}</p>
                          {option.description && (
                            <p className="text-xs text-lagoon truncate">{option.description}</p>
                          )}
                        </div>
                        {option.value === value && (
                          <svg className="w-5 h-5 text-tide flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </li>
                  ))
                ) : creatable && query ? (
                  <li
                    className="px-4 py-2.5 cursor-pointer hover:bg-mist/50 text-tide"
                    onClick={handleCreate}
                  >
                    Create "{query}"
                  </li>
                ) : (
                  <li className="px-4 py-3 text-center text-lagoon text-sm">
                    {emptyMessage}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {error && <p className="text-error text-sm mt-1.5">{error}</p>}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';

export default Combobox;
