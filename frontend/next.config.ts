import type { NextConfig } from "next";
import path from "node:path";

const repositoryRoot = path.resolve(__dirname, "..");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: repositoryRoot },
  outputFileTracingRoot: repositoryRoot,
  experimental: {
    // Bilingual 404 for URLs outside /en and /es (the root layout lives in app/[lang]).
    globalNotFound: true,
  },
  images: {
    // The brand imagery is soft at its source resolution; 90 keeps it faithful.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
