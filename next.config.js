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

    const webpack = require('webpack');
    
    // Ignore @x402 packages (Coinbase SDK)
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@x402\//
      })
    );

    // Ignore React Native modules (MetaMask SDK)
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@react-native-async-storage\/async-storage$/
      })
    );

    return config;
  },
};

module.exports = nextConfig;
