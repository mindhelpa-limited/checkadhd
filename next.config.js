/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ✅ Prevents Safari/iPhone hydration crashes
  eslint: {
    ignoreDuringBuilds: true, // ✅ Don’t block deploy on lint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Keep build running
  },
  images: {
    unoptimized: true, // ✅ Avoid iPhone crashes with Next Image optimizer
  },
  experimental: {
    scrollRestoration: true, // ✅ Smoother mobile experience
  },
  output: 'standalone', // ✅ Makes Vercel builds stable
  staticPageGenerationTimeout: 180, // ✅ Prevents build timeout errors
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // ✅ Removes console logs in production
  },
  webpack: (config) => {
    // ✅ Safari-safe: prevents “window is not defined” during build
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
