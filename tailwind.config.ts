import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        journey: {
          black: "#050505",
          coal: "#111111",
          slate: "#1f1f1f",
          steel: "#3f3f3f",
          line: "#d8d8d8",
          mist: "#f4f4f4",
          white: "#ffffff",
          red: "#d71920",
          deepRed: "#a80f15",
        },
      },
      boxShadow: {
        premium: "0 18px 55px rgba(0, 0, 0, 0.18)",
        line: "0 0 0 1px rgba(216, 216, 216, 0.9)",
      },
    },
  },
  plugins: [],
};

export default config;
