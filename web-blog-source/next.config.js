/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Configure webpack to handle server-only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle fs, path on client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
