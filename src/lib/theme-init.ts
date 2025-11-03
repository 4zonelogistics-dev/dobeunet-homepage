/**
 * Theme Initialization Script
 *
 * CRITICAL: This script must run BEFORE any content renders to prevent
 * Flash of Unstyled Content (FOUC). It should be inlined in the HTML head.
 *
 * Features:
 * - Detects system preference via prefers-color-scheme
 * - Reads stored user preference from localStorage
 * - Applies theme immediately to prevent flicker
 * - Handles localStorage unavailability gracefully
 * - Works without JavaScript (falls back to system preference via CSS)
 */

export const THEME_STORAGE_KEY = 'dobeu-theme-preference';
export type Theme = 'light' | 'dark' | 'system';

/**
 * Gets the inline script that initializes theme before page renders
 * This prevents FOUC by applying theme synchronously
 */
export function getThemeInitScript(): string {
  return `
    (function() {
      'use strict';

      // Theme storage key - must match application constant
      var STORAGE_KEY = '${THEME_STORAGE_KEY}';

      /**
       * Detects if user's system prefers dark mode
       * @returns {boolean} True if dark mode is preferred
       */
      function getSystemPreference() {
        if (typeof window === 'undefined') return false;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      /**
       * Safely reads from localStorage with error handling
       * @param {string} key - Storage key to read
       * @returns {string|null} Stored value or null
       */
      function safeLocalStorageGet(key) {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          // localStorage may be unavailable (private browsing, etc.)
          console.warn('localStorage unavailable:', e);
          return null;
        }
      }

      /**
       * Determines which theme to apply based on user preference and system settings
       * Priority: User preference > System preference > Light mode default
       * @returns {'light'|'dark'} Theme to apply
       */
      function resolveTheme() {
        var stored = safeLocalStorageGet(STORAGE_KEY);

        // User has explicit preference
        if (stored === 'light') return 'light';
        if (stored === 'dark') return 'dark';

        // No preference or 'system' - use system setting
        return getSystemPreference() ? 'dark' : 'light';
      }

      /**
       * Applies theme to document root element
       * Sets data-theme attribute which CSS uses for styling
       * @param {'light'|'dark'} theme - Theme to apply
       */
      function applyTheme(theme) {
        var root = document.documentElement;

        if (theme === 'dark') {
          root.setAttribute('data-theme', 'dark');
          root.style.colorScheme = 'dark';
        } else {
          root.setAttribute('data-theme', 'light');
          root.style.colorScheme = 'light';
        }
      }

      // Apply theme immediately to prevent flash
      var theme = resolveTheme();
      applyTheme(theme);

      // Add class to indicate JS is available
      document.documentElement.classList.add('js-enabled');
    })();
  `;
}

/**
 * Gets the current theme from localStorage or system preference
 * Used by React components after hydration
 */
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'system';

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return stored || 'system';
  } catch (e) {
    console.warn('Could not read theme preference:', e);
    return 'system';
  }
}

/**
 * Gets the resolved theme (light or dark) based on current preference
 */
export function getResolvedTheme(): 'light' | 'dark' {
  const theme = getCurrentTheme();

  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  return theme;
}

/**
 * Sets the theme preference and applies it
 * @param theme - Theme to set ('light', 'dark', or 'system')
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Could not save theme preference:', e);
  }

  applyTheme(theme);
}

/**
 * Applies theme to the document
 * @param theme - Theme to apply
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const resolvedTheme = theme === 'system' ? getResolvedTheme() : theme;

  if (resolvedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

/**
 * Toggles between light and dark mode
 * Returns the new theme
 */
export function toggleTheme(): 'light' | 'dark' {
  const current = getResolvedTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Listens for system theme changes and updates if user preference is 'system'
 * Returns cleanup function
 */
export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    const currentPreference = getCurrentTheme();
    if (currentPreference === 'system') {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme('system');
      callback(newTheme);
    }
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  // Legacy browsers
  if (mediaQuery.addListener) {
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }

  return () => {};
}
