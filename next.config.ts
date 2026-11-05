
import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,

  experimental: {
    proxyTimeout: 120_000,
  },

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
        destination: `${backendUrl}/chat`,
      },
      {
        source: "/api/documents/upload",
        destination: `${backendUrl}/documents/upload`,
      },
      {
        source: "/api/documents/upload/batch",
        destination: `${backendUrl}/documents/upload/batch`,
      },
    ];
  },
};

export default nextConfig;
