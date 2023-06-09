/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        chomsky: ['chomsky', 'sans-serif'],
        gruppo: ['gruppo', 'sans-serif'],
        playfair: ['playfair', 'serif'],
        rubik: ['rubik', 'cursive'],
      },
    },
  },
  plugins: [],
}
