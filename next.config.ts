import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export static HTML for Cloudflare Pages
  output: "export",

  // If you use Next.js Image component, disable optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
