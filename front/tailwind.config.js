/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'luckiest': ['"Luckiest Guy"', 'cursive'],
        'alexandria': ['Alexandria', 'sans-serif'],
        'manjari': ['Manjari', 'sans-serif'], // Add Manjari font
      },
      colors: {
        customPurple: '#3A0CA3',
        navHoverPurple: '#8151EE',
      },
      screens: {
        'xlg': '1440px',
      },
      backgroundImage: {
        // 'custom-bg': "url('src/assets/bg_gaame.svg')",
      },
    },
  },
  plugins: [],
}
