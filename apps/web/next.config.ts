import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    ppr: "incremental",
  },
  images: {
    remotePatterns: [new URL("https://img.clerk.com/**")],
  },
  /* config options here */
};

export default nextConfig;
