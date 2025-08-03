/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint errors on Vercel build
  },
};

module.exports = nextConfig;
