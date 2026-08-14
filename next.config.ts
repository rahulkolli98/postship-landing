import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "node:path";

const nextConfig: NextConfig = {
  // Next.js 16 picks up multiple lockfiles (root postship + landing).
  // Lock turbopack root to this app so it doesn't traverse upward.
  turbopack: {
    root: path.join(__dirname),
  },
};

// Required by @opennextjs/cloudflare — wires local dev bindings so the
// Next.js dev server can talk to wrangler dev / opennextjs-cloudflare preview
// in the same runtime as production. This call has no effect on `next build`
// itself; it's purely a dev-time wiring.
initOpenNextCloudflareForDev();

export default nextConfig;