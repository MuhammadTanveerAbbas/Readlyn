import type { Metadata } from "next";
import localFont from "next/font/local";
import { PT_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

/**
 * Readlyn type system two self-hosted families, no runtime CDN calls.
 *
 *   --font-geist       Geist Sans        all UI: headings, body, nav, buttons
 *   --font-geist-mono  Geist Mono        code, JSON, shortcuts, coordinates
 *
 * Geist is Vercel's typeface and the Figma-editor default that most people
 * build against, so the app reads as a native modern product rather than a
 * monospace-inflected theme. Both are true variable fonts (100–900) in one
 * file each 52KB total for the whole system.
 *
 * The variable axis matters here: the canvas schema allows
 * `fontWeight: '900'` for the big stat numerals in generated infographics, and
 * a family topping out at 700 would fake-bold them in the exported PNG.
 */

// Variable: 100–900 in one file.
const geist = localFont({
  variable: "--font-geist",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  src: [
    {
      path: "../public/fonts/geist-latin-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const siteUrl = "https://readlyn.vercel.app";
const siteTitle = "Readlyn | AI Infographic Generator";
const siteDescription =
  "Describe any topic, plus get a stunning, data-rich infographic in seconds. Powered by Groq AI with automatic model fallback, 9 layout archetypes, 5 color themes, plus a full Fabric.js canvas editor.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Readlyn",
  },
  description: siteDescription,
  keywords: [
    "AI infographic generator",
    "infographic maker",
    "Groq AI",
    "Llama 3.3",
    "canvas editor",
    "data visualization",
    "content creation",
    "Next.js SaaS",
  ],
  authors: [{ name: "Muhammad Tanveer Abbas" }],
  creator: "Muhammad Tanveer Abbas",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Readlyn",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/Readlyn.png",
        width: 1583,
        height: 746,
        alt: "Readlyn | AI-powered infographic generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/Readlyn.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }],
    shortcut: "/favicon.svg",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
      </head>
      <body
        className={`${geist.variable} ${ptSans.variable} h-full bg-[var(--bg-base)] overflow-x-hidden font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
