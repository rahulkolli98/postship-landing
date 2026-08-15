import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from "node:path";

// Content Security Policy.
//
// What runs in the browser on the landing page:
//   - Next.js bundles from /_next/static/*  (self)
//   - Cloudflare Turnstile widget from
//     https://challenges.cloudflare.com/turnstile/v0/api.js
//   - Convex WebSocket + HTTPS queries against *.convex.cloud
//   - All other resources (images, fonts, styles) come from self.
//
// `style-src 'self' 'unsafe-inline'` is needed because Next.js + Tailwind v4
// inject some inline styles for things like `next/font` CSS variables and
// shadcn/ui. Switching to nonces would require middleware plumbing we don't
// have here, so we accept the trade-off for Phase 0.
//
// `connect-src` allows self + the Convex deployment (any *.convex.cloud
// subdomain, since the deployment URL is build-time-substituted and we may
// point at staging/prod interchangeably). WebSocket explicitly listed.
//
// `frame-src` is empty (DENY via frame-ancestors below) — no embeds.
//
// `object-src 'none'` — no <object>, <embed>, <applet>.
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  // HSTS — 2 years, include subdomains. We leave `preload` off so this
  // doesn't get added to browser preload lists without an explicit
  // submission at hstspreload.org (preload is hard to back out of).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Stop MIME-type sniffing — defense in depth against content confusion.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking — page refuses to render inside an iframe.
  { key: "X-Frame-Options", value: "DENY" },
  // Match the metadata.referrer setting so it's consistent at the header layer.
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  // Permissions Policy — disable features we don't use and never want any
  // embedded resource to be able to invoke (camera, mic, geolocation, etc.).
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
  // The actual CSP.
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  // Next.js 16 picks up multiple lockfiles (root postship + landing).
  // Lock turbopack root to this app so it doesn't traverse upward.
  turbopack: {
    root: path.join(__dirname),
  },

  // Security headers. Applied via Next.js's headers() API so the
  // OpenNext Cloudflare adapter bakes them into the worker response at
  // build time (no runtime overhead).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

// Required by @opennextjs/cloudflare — wires local dev bindings so the
// Next.js dev server can talk to wrangler dev / opennextjs-cloudflare preview
// in the same runtime as production. This call has no effect on `next build`
// itself; it's purely a dev-time wiring.
initOpenNextCloudflareForDev();

export default nextConfig;