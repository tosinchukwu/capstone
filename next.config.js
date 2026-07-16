/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Polyfill 'ws' for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: require.resolve("ws"),
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ignore the @x402 packages (they cause build failures)
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@x402\//
      })
    );

    return config;
  },
};

module.exports = nextConfig;
