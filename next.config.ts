import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // This repository is a GitHub Pages user site (`<username>.github.io`), which is served from
  // the domain root. Keep both `basePath` and `assetPrefix` unset so public assets and links
  // remain root-relative in local development and production.
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    cssChunking: true,
    inlineCss: true,
  },
};

export default nextConfig;
