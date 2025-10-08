/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Base path for GitHub Pages (repository name)
  // This ensures all assets load correctly
  basePath: process.env.NODE_ENV === 'production'
    ? '/web3-privacy-ethereum-cypherpunk-research'
    : '',

  // Asset prefix for proper resource loading
  assetPrefix: process.env.NODE_ENV === 'production'
    ? '/web3-privacy-ethereum-cypherpunk-research/'
    : '',

  // Trailing slash for compatibility
  trailingSlash: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Strict mode for better development experience
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Environment variables available to the browser
  env: {
    SITE_URL: process.env.NODE_ENV === 'production'
      ? 'https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research'
      : 'http://localhost:3000',
  },
};

module.exports = nextConfig;
