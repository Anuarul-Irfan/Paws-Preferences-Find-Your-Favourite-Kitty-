/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['cataas.com'],
  },
  // Fix filesystem watching issues
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/dist/**',
          '**/build/**'
        ]
      }
    }
    return config
  },
  // Disable filesystem watching for problematic paths
  experimental: {
    esmExternals: true
  }
}

module.exports = nextConfig
