import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 Enable static export
  images: {
    unoptimized: true, // 👈 Required for static hosting
  },
};

export default nextConfig;
