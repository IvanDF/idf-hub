import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinned explicitly: Next infers the workspace root from the nearest
  // lockfile, so a stray package-lock.json further up the tree makes it pick
  // a parent directory and Turbopack then tries to scan everything under it.
  // From a home directory that means unreadable paths and an os error 13.
  turbopack: { root: path.resolve(__dirname) },
  devIndicators: false,

  /**
   * Projects that earned a page of their own still answer on their /lab/
   * address, so older links and shared URLs land somewhere.
   *
   * `redirect()` inside the route handles this too, but on a prerendered page
   * Next ships it as a client-side hop: a 200 with the redirect in the
   * payload. Browsers follow it; crawlers see a page that is not there. This
   * makes it a real 308 before the request reaches the route.
   *
   * Keep in step with `detailHref` in src/data/projects.ts — a test asserts
   * the two agree, because nothing else would notice them drifting apart.
   */
  async redirects() {
    return [
      { source: "/lab/yggdrasil", destination: "/yggdrasil", permanent: true },
    ];
  },
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
