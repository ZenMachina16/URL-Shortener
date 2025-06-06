import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during production builds to avoid issues with generated files
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Add experimental features if needed
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
