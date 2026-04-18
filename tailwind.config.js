import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        holy: "#d4af77",     // gold
        darkbg: "#0a0a0a",
      },
    },
  },
  plugins: [],
};
export default config;
