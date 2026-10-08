import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
        className={`${openSans.variable} h-full bg-[var(--surface-sunken)] overflow-x-hidden font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
