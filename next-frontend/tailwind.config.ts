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
        "galaxy-purple": "#412D91",
        "another-purple": "#715DC1",
        "light-purple": "#9D89FF",
        "midnight-purple": "#100A28"
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)"]
      }
    },
  },
  plugins: [],
} satisfies Config;
