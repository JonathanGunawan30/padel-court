import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "library"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
