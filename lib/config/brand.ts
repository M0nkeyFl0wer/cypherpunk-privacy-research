/**
 * Web3Privacy Now Brand Configuration
 * Sourced from web3privacy.info and brand repository
 *
 * Brand Assets: https://github.com/web3privacy/brand
 * Website: https://web3privacy.info
 */

export const web3PrivacyBrand = {
  // Brand name
  name: 'Web3Privacy Now',
  tagline: 'Building a culture of privacy in Web3',

  // Colors (from website analysis)
  colors: {
    // Primary colors
    background: {
      dark: '#171717',      // Main dark background
      darker: '#0a0a0a',    // Deeper black
    },
    text: {
      primary: '#ffffff',   // White text on dark
      secondary: '#a1a1aa', // Gray text
      muted: '#71717a',     // Muted gray
    },
    // Accent colors (from website's designation colors)
    accents: {
      red: '#ef4444',       // text-red-500
      blue: '#3b82f6',      // text-blue-500
      green: '#22c55e',     // text-green-500
      yellow: '#eab308',    // text-yellow-500
      purple: '#a855f7',    // text-purple-500
      pink: '#ec4899',      // text-pink-500
    },
    // Interactive states
    interactive: {
      hover: '#27272a',     // Subtle hover state
      active: '#3f3f46',    // Active state
    },
  },

  // Typography
  typography: {
    // Font families (will be loaded from brand assets)
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
    },
    // Font weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Brand assets paths
  assets: {
    logo: {
      white: '/brand/logo-white.svg',
      black: '/brand/logo-black.svg',
    },
    // Additional brand assets can be added as needed
  },

  // Design tokens
  tokens: {
    borderRadius: {
      sm: '0.375rem',   // 6px
      md: '0.5rem',     // 8px
      lg: '0.75rem',    // 12px
      xl: '1rem',       // 16px
    },
    spacing: {
      section: '4rem',  // 64px
      component: '2rem', // 32px
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
  },
} as const;

export type Web3PrivacyBrand = typeof web3PrivacyBrand;
