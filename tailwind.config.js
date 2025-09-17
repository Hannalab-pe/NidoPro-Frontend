/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'sans': ['Quicksand', 'Inter', 'system-ui', 'sans-serif'], // Make Quicksand the default
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
