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
      // Source: Brand Posters 2025 - Stark cyberpunk/surveillance aesthetic
      colors: {
        brand: {
          // Background colors (stark black theme)
          'bg-dark': '#000000',
          'bg-darker': '#000000',
          'bg-hover': '#1a1a1a',
          'bg-active': '#2a2a2a',

          // Text colors (high contrast)
          'text-primary': '#ffffff',
          'text-secondary': '#cccccc',
          'text-muted': '#999999',

          // Accent colors (cyberpunk palette)
          'accent-red': '#ff0000',
          'accent-blue': '#00bfff',
          'accent-green': '#00ff00',
          'accent-yellow': '#ffff00',
          'accent-purple': '#bf00ff',
          'accent-pink': '#ff00bf',
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
