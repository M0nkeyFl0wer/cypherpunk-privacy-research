/**
 * Web3Privacy Now Brand Configuration
 * Sourced from Brand Posters 2025 Figma design
 *
 * Design: Stark cyberpunk/surveillance aesthetic
 * Background: Pure black (#000000) from Academy-3 poster
 * Brand Assets: https://github.com/web3privacy/brand
 * Website: https://web3privacy.info
 */

export const web3PrivacyBrand = {
  // Brand name
  name: 'Web3Privacy Now',
  tagline: 'Building a culture of privacy in Web3',

  // Colors (from Brand Posters 2025 - stark cyberpunk aesthetic)
  colors: {
    // Primary colors (pure black for high contrast)
    background: {
      dark: '#000000',      // Stark black (Academy-3 poster)
      darker: '#000000',    // Pure black
    },
    text: {
      primary: '#ffffff',   // Pure white for high contrast
      secondary: '#cccccc', // Light gray
      muted: '#999999',     // Muted gray
    },
    // Accent colors (cyberpunk palette)
    accents: {
      red: '#ff0000',       // Pure red (cyberpunk)
      blue: '#00bfff',      // Bright cyan blue
      green: '#00ff00',     // Electric green
      yellow: '#ffff00',    // Bright yellow
      purple: '#bf00ff',    // Vivid purple
      pink: '#ff00bf',      // Hot pink
    },
    // Interactive states
    interactive: {
      hover: '#1a1a1a',     // Subtle hover on black
      active: '#2a2a2a',    // Active state
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
