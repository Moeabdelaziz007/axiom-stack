/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Full-stack Next.js configuration for Cloudflare Pages
  // No 'output: export' - we want server-side rendering capabilities
  images: {
    // Cloudflare Pages supports Next.js image optimization
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;