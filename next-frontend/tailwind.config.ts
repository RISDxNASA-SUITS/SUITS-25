import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "white-10": "rgba(255,255,255,0.1)",
        "white-50": "rgba(255, 255, 255, 0.50)",
        "galaxy-purple": "#412D91",
        "another-purple": "#715DC1",
        "light-purple": "#9D89FF",
        "midnight-purple": "#100A28",
        "crimson-red": "rgba(255, 20, 24, 0.7)",
        "warning": "rgba(255, 21, 21, 0.25)",
        "backplate": "rgba(16, 10, 40, 0.50)",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)"]
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
