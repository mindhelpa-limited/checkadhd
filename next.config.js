/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint errors on Vercel build
  },
  experimental: {
    appDir: true, // ✅ Enable Next.js App Router inside src/app
  },
};

module.exports = nextConfig;
