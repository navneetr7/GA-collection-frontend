/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // for app directory
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1A2233',
        'off-white': '#FAFAF9',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
