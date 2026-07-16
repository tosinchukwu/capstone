/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Needed for viem/wagmi to work with polyfills
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      ...config.resolve.fallback,
    };
    return config;
  },
};

module.exports = nextConfig;
