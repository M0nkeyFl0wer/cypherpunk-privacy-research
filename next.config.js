/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/web3-privacy-ethereum-cypherpunk-research' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/web3-privacy-ethereum-cypherpunk-research/' : '',
}

module.exports = nextConfig
