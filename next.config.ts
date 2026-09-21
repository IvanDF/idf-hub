import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinned explicitly: Next infers the workspace root from the nearest
  // lockfile, so a stray package-lock.json further up the tree makes it pick
  // a parent directory and Turbopack then tries to scan everything under it.
  // From a home directory that means unreadable paths and an os error 13.
  turbopack: { root: path.resolve(__dirname) },
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
