import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['listingsprod.blob.core.windows.net']
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

export default nextConfig;
