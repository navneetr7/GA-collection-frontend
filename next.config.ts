import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Temporary solution
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporary solution
  },
};

export default nextConfig;
