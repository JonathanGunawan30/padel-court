import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        padel: {
          neon: "#d9f116",
          dark: "#0a0a0a",
          secondary: "#1a1a1a",
          accent: "#222222",
        },
      },
      fontFamily: {
        poppins: ["var(--font-geist-sans)", "sans-serif"], // Placeholder for now
      },
    },
  },
  plugins: [],
};
export default config;
