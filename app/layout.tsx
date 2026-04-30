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

export const metadata: Metadata = {
  title: "Readlyn",
  description:
    "Readlyn platform: marketing and protected app in one Next.js project.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
    shortcut: "/favicon.svg",
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
