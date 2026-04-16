import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD600",
        orange: "#FF6B35",
        bgPrimary: "#0A0A0A",
        textLight: "#F5F5F0",
        textGray: "#888888",
        textMuted: "#555555",
        textDim: "#444444",
        borderDark: "#2D2D2D",
        borderSubtle: "#1D1D1D",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "0px",
        DEFAULT: "0px",
      },
    },
  },
};

export default config;
