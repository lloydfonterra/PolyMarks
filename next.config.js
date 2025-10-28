/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'polymarket.com',
      },
      {
        protocol: 'https',
        hostname: 'gamma-api.polymarket.com',
      },
    ],
  },
}

module.exports = nextConfig

