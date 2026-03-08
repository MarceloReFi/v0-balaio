/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  serverExternalPackages: [
    '@coinbase/cdp-sdk',
    '@base-org/account',
    '@solana/kit',
    '@solana-program/system',
    '@solana-program/token',
    'axios'
  ]
}

export default nextConfig
