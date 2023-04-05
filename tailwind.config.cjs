/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 8px rgba(255, 255, 255, 0.4)',
      },
      backgroundColor: {
        'dark': 'rgb(22, 24, 28)',
      }
    },
  },
  plugins: [],
};

module.exports = config;