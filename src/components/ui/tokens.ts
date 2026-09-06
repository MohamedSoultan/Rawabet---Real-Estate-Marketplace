/**
 * Rawabet Design System Tokens
 * Centralized design tokens ensuring visual harmony and eliminating arbitrary values.
 */

export const colors = {
  primary: {
    50: '#f0faf0',
    100: '#f2f7f2',
    200: '#d7eed7',
    500: '#14a800', // Rawabet Primary Brand Green
    600: '#108a00', // Hover state
    700: '#0d6f00', // Active state
    900: '#001e00', // Rawabet Deep Green / Text Primary
  },
  neutral: {
    50: '#f9f9f9',
    100: '#f3f4f6',
    200: '#e4ebe4', // Standard border
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  surface: {
    bg: '#f9f9f9',
    card: '#ffffff',
    border: '#e4ebe4',
    subtle: '#f2f7f2',
  },
  feedback: {
    success: {
      text: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
    },
    warning: {
      text: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    danger: {
      text: '#e11d48',
      bg: '#fff1f2',
      border: '#fecdd3',
    },
    info: {
      text: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
    },
  },
} as const;

export const spacing = {
  none: '0px',
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
} as const;

export const radius = {
  none: 'rounded-none',
  sm: 'rounded-md',     // 6px
  md: 'rounded-lg',     // 8px
  lg: 'rounded-xl',     // 12px
  xl: 'rounded-2xl',    // 16px
  full: 'rounded-full',
} as const;

export const typography = {
  fontFamily: {
    sans: "'IBM Plex Sans Arabic', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Alexandria', 'IBM Plex Sans Arabic', system-ui, sans-serif",
  },
  sizes: {
    xs: 'text-xs',      // 12px
    sm: 'text-sm',      // 14px
    base: 'text-base',  // 16px
    lg: 'text-lg',      // 18px
    xl: 'text-xl',      // 20px
    '2xl': 'text-2xl',  // 24px
    '3xl': 'text-3xl',  // 30px
  },
} as const;

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
};
