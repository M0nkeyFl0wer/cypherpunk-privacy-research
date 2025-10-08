/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true // Required for static export
  },
  // GitHub Pages subdirectory (if needed)
  // basePath: '/web3-privacy-ethereum-cypherpunk-research',
  // assetPrefix: '/web3-privacy-ethereum-cypherpunk-research/',
}

// Bundle analyzer for optimization
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
