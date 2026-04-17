'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';

/**
 * Articulink PhoneInput Component
 *
 * Phone number input with country code selector and formatting.
 *
 * Usage:
 *   <PhoneInput value={phone} onChange={setPhone} />
 *   <PhoneInput defaultCountry="US" label="Phone Number" />
 */

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  format?: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', format: '(###) ###-####' },
  { code: 'CA', name: 'Canada', dialCode: '+1', format: '(###) ###-####' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', format: '#### ######' },
  { code: 'AU', name: 'Australia', dialCode: '+61', format: '#### ### ###' },
  { code: 'DE', name: 'Germany', dialCode: '+49', format: '#### #######' },
  { code: 'FR', name: 'France', dialCode: '+33', format: '# ## ## ## ##' },
  { code: 'IT', name: 'Italy', dialCode: '+39', format: '### ### ####' },
  { code: 'ES', name: 'Spain', dialCode: '+34', format: '### ### ###' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', format: '## #### ####' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', format: '## #####-####' },
  { code: 'IN', name: 'India', dialCode: '+91', format: '##### #####' },
  { code: 'CN', name: 'China', dialCode: '+86', format: '### #### ####' },
  { code: 'JP', name: 'Japan', dialCode: '+81', format: '##-####-####' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', format: '##-####-####' },
];

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string, country: Country) => void;
  defaultCountry?: string;
  label?: string;
  error?: string;
  hint?: string;
  countries?: Country[];
}

function formatPhoneNumber(value: string, format?: string): string {
  if (!format) return value;

  const digits = value.replace(/\D/g, '');
  let result = '';
  let digitIndex = 0;

  for (const char of format) {
    if (digitIndex >= digits.length) break;
    if (char === '#') {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

function parsePhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      defaultCountry = 'US',
      label,
      error,
      hint,
      countries = COUNTRIES,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(
      countries.find((c) => c.code === defaultCountry) || countries[0]
    );
    const [internalValue, setInternalValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internalValue;
    const formattedValue = formatPhoneNumber(parsePhoneNumber(value), selectedCountry.format);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = parsePhoneNumber(e.target.value);
      const maxDigits = selectedCountry.format?.replace(/[^#]/g, '').length || 15;
      const truncated = digits.slice(0, maxDigits);

      if (controlledValue === undefined) {
        setInternalValue(truncated);
      }
      onChange?.(truncated, selectedCountry);
    };

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      setIsOpen(false);
      onChange?.(parsePhoneNumber(value), country);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-abyss mb-1.5">{label}</label>
        )}

        <div ref={containerRef} className="relative">
          <div
            className={`
              flex rounded-xl border bg-white overflow-hidden
              transition-colors
              ${error ? 'border-error' : 'border-mist focus-within:border-tide'}
              ${disabled ? 'bg-breeze cursor-not-allowed' : ''}
              ${className}
            `}
          >
            {/* Country selector */}
            <button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className="flex items-center gap-1 px-3 py-2.5 border-r border-mist hover:bg-mist/50 transition-colors"
            >
              <span className="text-lg">{getFlagEmoji(selectedCountry.code)}</span>
              <span className="text-sm text-lagoon">{selectedCountry.dialCode}</span>
              <svg
                className={`w-4 h-4 text-lagoon transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Phone input */}
            <input
              ref={ref}
              type="tel"
              value={formattedValue}
              onChange={handleInputChange}
              disabled={disabled}
              className="flex-1 px-3 py-2.5 outline-none text-abyss placeholder:text-lagoon/50 disabled:cursor-not-allowed"
              {...props}
            />
          </div>

          {/* Country dropdown */}
          {isOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 max-h-60 bg-white border border-mist rounded-xl shadow-lg overflow-y-auto z-50">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-left
                    hover:bg-mist transition-colors
                    ${selectedCountry.code === country.code ? 'bg-info-bg' : ''}
                  `}
                >
                  <span className="text-lg">{getFlagEmoji(country.code)}</span>
                  <span className="flex-1 text-sm text-abyss truncate">{country.name}</span>
                  <span className="text-sm text-lagoon">{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p className={`mt-1.5 text-sm ${error ? 'text-error' : 'text-lagoon'}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

// Helper to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export { COUNTRIES };
export default PhoneInput;
