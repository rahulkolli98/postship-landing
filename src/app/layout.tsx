import type { Metadata, Viewport } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

// Newsreader for display + h1 (per design3.md — picked over Fraunces/Instrument
// Serif, the LLM-favorite serifs that design-taste marks as banned).
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  // Optical-size: explicit (Newsreader ships 6..72 optical axis).
  // Weight 500 = medium. We load just one weight to keep the bundle small.
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://postship.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ─── Title ───────────────────────────────────────────────
  // Using absolute title for the landing page (no template inheritance
  // since this is the final segment). Per founder direction, the canonical
  // tagline is "Stop rewriting. Start shipping." — that becomes the title.
  title: {
    default: "Postship — Stop rewriting. Start shipping.",
    template: "%s | Postship",
    absolute: "Postship — Stop rewriting. Start shipping.",
  },

  // ─── Core metadata ──────────────────────────────────────
  description:
    "One master description. Six platform-native captions. One click ships to YouTube, LinkedIn, X, Threads, Instagram, and TikTok. Pre-launch — join the waitlist.",
  keywords: [
    "social media automation",
    "content distribution",
    "post generator",
    "AI copywriting",
    "YouTube",
    "LinkedIn",
    "X (Twitter)",
    "Threads",
    "Instagram",
    "TikTok",
    "creator tools",
    "indie creators",
    "Postship",
  ],
  applicationName: "Postship",
  authors: [{ name: "Postship", url: SITE_URL }],
  creator: "Postship",
  publisher: "Postship",
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // ─── Open Graph ─────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Postship",
    title: "Postship — Stop rewriting. Start shipping.",
    description:
      "One master description. Six platform-native captions. One click ships to YouTube, LinkedIn, X, Threads, Instagram, and TikTok.",
    // OG image is rendered per-request via the OpenNext Image Optimizer
    // binding (Cloudflare). For now, use a placeholder; will be wired up
    // when the founder provides a real OG image asset.
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Postship — Stop rewriting. Start shipping.",
      },
    ],
  },

  // ─── Twitter / X ────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Postship — Stop rewriting. Start shipping.",
    description:
      "One master description. Six platform-native captions. One click ships to YouTube, LinkedIn, X, Threads, Instagram, and TikTok.",
    images: ["/og-image.png"],
    // creator: "@postship" — would be set when the founder reserves the X handle.
  },

  // ─── Robots ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Canonical ──────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ─── Icons ──────────────────────────────────────────────
  // Use the file-based icons where available. Right now we only have the
  // generic favicon.ico, but the convention is in place for future
  // dedicated icon files.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },

  // ─── Manifest ───────────────────────────────────────────
  // Use a relative path so it resolves to whatever origin the page is
  // served from (workers.dev during the Cloudflare preview, postship.app
  // once the custom domain is attached). Avoids the cross-origin fetch
  // that caused CORS errors during Phase 0 deploys.
  manifest: "/site.webmanifest",

  // ─── Apple Web App (iOS PWA metadata) ────────────────────
  appleWebApp: {
    title: "Postship",
    statusBarStyle: "default",
    capable: true,
  },
};

// ─── Viewport (separated from metadata in Next.js 14+) ──────
// Per the Next.js docs, `themeColor` and `colorScheme` are deprecated in
// metadata. They live in the `viewport` export now.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e0c" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}