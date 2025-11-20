import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static export for Cloudflare Pages

  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
  },

  transpilePackages: ['@solana/web3.js', '@noble/curves', '@noble/hashes'],

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.axiomid.app',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://ws.axiomid.app',
  },

  // Turbopack configuration is now handled automatically
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       // Add any necessary aliases here
  //     }
  //   }
  // },

  // Remove webpack config to avoid conflict with Turbopack
  // Webpack optimizations are now handled by Turbopack

  // Transpile packages to fix @noble/curves resolution issues
  // Note: These are already defined in transpilePackages above, but ensuring clarity
  // transpilePackages: ['@solana/web3.js', '@noble/curves', '@noble/hashes'], // Removed duplicate
};

export default nextConfig;