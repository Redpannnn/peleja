import type { NextConfig } from "next";

/**
 * Dua mode build:
 *
 * 1. Default (dev / sandbox / deploy ber-backend):
 *    `output: "standalone"` — Next.js server lengkap, API routes & database jalan.
 *
 * 2. BUILD_STATIC=1 (`bun run build:static`):
 *    `output: "export"` — hasil build berupa file statis di folder `out/`
 *    (ada index.html di root). Zip folder ini bisa langsung di-upload ke
 *    hosting static apa pun (Vercel / Netlify / Cloudflare / GitHub Pages)
 *    tanpa perlu Node.js. API routes dinonaktifkan oleh scripts/build-static.mjs
 *    dan komponen otomatis fallback ke localStorage.
 */
const isStatic = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = isStatic
  ? {
      output: "export",
      distDir: ".next-static",
      images: { unoptimized: true },
      reactStrictMode: false,
      typescript: { ignoreBuildErrors: true },
    }
  : {
      output: "standalone",
      reactStrictMode: false,
      typescript: { ignoreBuildErrors: true },
    };

export default nextConfig;
