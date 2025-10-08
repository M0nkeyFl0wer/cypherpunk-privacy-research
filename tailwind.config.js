/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Web3Privacy Now Brand Colors
      // Source: web3privacy.info and github.com/web3privacy/brand
      colors: {
        brand: {
          // Background colors (dark theme)
          'bg-dark': '#171717',
          'bg-darker': '#0a0a0a',
          'bg-hover': '#27272a',
          'bg-active': '#3f3f46',

          // Text colors
          'text-primary': '#ffffff',
          'text-secondary': '#a1a1aa',
          'text-muted': '#71717a',

          // Accent colors
          'accent-red': '#ef4444',
          'accent-blue': '#3b82f6',
          'accent-green': '#22c55e',
          'accent-yellow': '#eab308',
          'accent-purple': '#a855f7',
          'accent-pink': '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
