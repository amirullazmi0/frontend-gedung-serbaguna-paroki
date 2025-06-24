import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['listingsprod.blob.core.windows.net', 'ik.imagekit.io']
  },
  output: 'standalone',
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
