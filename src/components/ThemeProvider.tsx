'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Articulink ThemeProvider Component
 *
 * Theme context for dark mode and custom theming.
 *
 * Usage:
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 *
 *   // In components:
 *   const { theme, setTheme, toggleTheme } = useTheme();
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: 'class' | 'data-theme';
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'articulink-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Get resolved theme
  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? systemTheme : theme;

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load theme from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setThemeState(stored);
      }
    } catch {
      // localStorage not available
    }
    setMounted(true);
  }, [storageKey]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Disable transitions temporarily
    if (disableTransitionOnChange) {
      root.style.setProperty('--transition-duration', '0s');
    }

    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);
    } else {
      root.setAttribute('data-theme', resolvedTheme);
    }

    // Re-enable transitions
    if (disableTransitionOnChange) {
      requestAnimationFrame(() => {
        root.style.removeProperty('--transition-duration');
      });
    }
  }, [resolvedTheme, attribute, disableTransitionOnChange, mounted]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // localStorage not available
      }
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * ThemeToggle - Button to toggle theme
 */
export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeToggle({ size = 'md', className = '', ...props }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-lg bg-mist hover:bg-mist/80
        transition-colors
        ${className}
      `}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      {...props}
    >
      {resolvedTheme === 'light' ? (
        <svg
          className={`${iconSizes[size]} text-abyss`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className={`${iconSizes[size]} text-sunshine`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * ThemeSelect - Dropdown to select theme
 */
export interface ThemeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onChange?: (theme: Theme) => void;
}

export function ThemeSelect({ onChange, className = '', ...props }: ThemeSelectProps) {
  const { theme, setTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as Theme;
    setTheme(newTheme);
    onChange?.(newTheme);
  };

  return (
    <select
      value={theme}
      onChange={handleChange}
      className={`
        px-3 py-2 rounded-lg border border-mist bg-white
        text-abyss text-sm
        focus:outline-none focus:ring-2 focus:ring-tide focus:border-transparent
        ${className}
      `}
      {...props}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

export default ThemeProvider;
