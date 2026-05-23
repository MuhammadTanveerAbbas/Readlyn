import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  src: [
    { path: "../public/fonts/space-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/space-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/space-grotesk-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const ibmPlexMono = localFont({
  variable: "--font-ibm-plex-mono",
  display: "swap",
  fallback: ["monospace"],
  src: [
    { path: "../public/fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/ibm-plex-mono-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const siteUrl = "https://readlyn.vercel.app";
const siteTitle = "Readlyn | AI Infographic Generator";
const siteDescription =
  "Describe any topic and get a stunning, data-rich infographic in seconds. Powered by Groq AI (Llama 3.3 70B) with 9 layout archetypes, 5 color themes, and a full Fabric.js canvas editor.";

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
  authors: [{ name: "Muhammad Tanveer Abbas", url: "https://themvpguy.vercel.app" }],
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
    site: "@themvpguy",
    creator: "@themvpguy",
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
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full bg-[#080808] overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
