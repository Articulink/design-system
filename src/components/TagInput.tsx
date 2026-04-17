'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink TagInput Component
 *
 * Multi-tag input with autocomplete suggestions.
 *
 * Usage:
 *   <TagInput value={tags} onChange={setTags} />
 *   <TagInput value={tags} onChange={setTags} suggestions={['React', 'Vue', 'Angular']} />
 */

export interface TagInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  maxTags?: number;
  allowDuplicates?: boolean;
  allowCustom?: boolean;
  validateTag?: (tag: string) => boolean | string;
  renderTag?: (tag: string, onRemove: () => void) => React.ReactNode;
}

export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      value,
      onChange,
      suggestions = [],
      placeholder = 'Add tag...',
      label,
      error,
      disabled = false,
      maxTags,
      allowDuplicates = false,
      allowCustom = true,
      validateTag,
      renderTag,
      className = '',
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input
    const filteredSuggestions = suggestions.filter(
      (s) =>
        s.toLowerCase().includes(inputValue.toLowerCase()) &&
        (allowDuplicates || !value.includes(s))
    );

    // Reset highlighted index when suggestions change
    useEffect(() => {
      setHighlightedIndex(0);
    }, [filteredSuggestions.length]);

    // Close suggestions on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = useCallback(
      (tag: string) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;

        // Check max tags
        if (maxTags && value.length >= maxTags) {
          setValidationError(`Maximum ${maxTags} tags allowed`);
          return;
        }

        // Check duplicates
        if (!allowDuplicates && value.includes(trimmedTag)) {
          setValidationError('Tag already exists');
          return;
        }

        // Check if custom tags are allowed
        if (!allowCustom && !suggestions.includes(trimmedTag)) {
          setValidationError('Please select from suggestions');
          return;
        }

        // Custom validation
        if (validateTag) {
          const result = validateTag(trimmedTag);
          if (result !== true) {
            setValidationError(typeof result === 'string' ? result : 'Invalid tag');
            return;
          }
        }

        onChange([...value, trimmedTag]);
        setInputValue('');
        setValidationError(null);
        setShowSuggestions(false);
      },
      [value, onChange, maxTags, allowDuplicates, allowCustom, suggestions, validateTag]
    );

    const removeTag = useCallback(
      (index: number) => {
        if (disabled) return;
        onChange(value.filter((_, i) => i !== index));
      },
      [value, onChange, disabled]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ',':
        case 'Tab':
          e.preventDefault();
          if (showSuggestions && filteredSuggestions[highlightedIndex]) {
            addTag(filteredSuggestions[highlightedIndex]);
          } else if (inputValue && allowCustom) {
            addTag(inputValue);
          }
          break;
        case 'Backspace':
          if (!inputValue && value.length > 0) {
            removeTag(value.length - 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          setShowSuggestions(true);
          setHighlightedIndex((i) => Math.min(i + 1, filteredSuggestions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setValidationError(null);
      setShowSuggestions(true);
    };

    const handleContainerClick = () => {
      if (!disabled) {
        inputRef.current?.focus();
      }
    };

    const canAddMore = !maxTags || value.length < maxTags;

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">{label}</label>
        )}

        <div ref={containerRef} className="relative">
          <div
            onClick={handleContainerClick}
            className={`
              flex flex-wrap gap-2 p-2 min-h-[42px]
              bg-white border-2 rounded-xl
              transition-all duration-150
              ${error || validationError ? 'border-error' : isFocused ? 'border-tide' : 'border-mist'}
              ${disabled ? 'opacity-50 bg-breeze cursor-not-allowed' : 'cursor-text hover:border-bubble'}
            `}
          >
            {/* Tags */}
            {value.map((tag, index) =>
              renderTag ? (
                <span key={`${tag}-${index}`}>{renderTag(tag, () => removeTag(index))}</span>
              ) : (
                <span
                  key={`${tag}-${index}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-info-bg text-tide text-sm rounded-lg"
                >
                  {tag}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(index);
                      }}
                      className="hover:bg-tide/20 rounded p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </span>
              )
            )}

            {/* Input */}
            {canAddMore && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] px-1 py-1 text-abyss placeholder:text-lagoon/50 bg-transparent focus:outline-none"
              />
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && inputValue && (
            <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-mist rounded-xl shadow-lg py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full px-4 py-2 text-left text-sm
                    ${index === highlightedIndex ? 'bg-info-bg text-tide' : 'text-abyss hover:bg-mist/50'}
                  `}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error messages */}
        {(error || validationError) && (
          <p className="text-error text-sm mt-1.5">{error || validationError}</p>
        )}

        {/* Tag count hint */}
        {maxTags && (
          <p className="text-lagoon text-xs mt-1">
            {value.length} / {maxTags} tags
          </p>
        )}
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

export default TagInput;
