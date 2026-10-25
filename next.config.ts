
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: "http://127.0.0.1:8000/chat",
      },
      {
        source: "/api/documents/upload",
        destination: "http://127.0.0.1:8000/documents/upload",
      },
    ];
  },
};

export default nextConfig;
