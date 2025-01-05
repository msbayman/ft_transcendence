import fluid, { extract, screens, fontSize } from "fluid-tailwind";
/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    extract,
  },
  theme: {
    screens,
    fontSize,
    extend: {
      fontFamily: {
        luckiest: ['"Luckiest Guy"', "cursive"],
        alexandria: ["Alexandria", "sans-serif"],
      },
      colors: {
        customPurple: "#3A0CA3",
        navHoverPurple: "#8151EE",
      },
      screens: {
        xlg: "1440px",
      },
      backgroundImage: {
        "custom-bg": "url('src/assets/bg_gaame.svg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), fluid],
};