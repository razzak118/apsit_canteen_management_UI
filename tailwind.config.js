/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <-- Add this line
  theme: {
    extend: {
      colors: {
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        accent: {
          500: '#f97316', // Orange-500
          600: '#ea580c', // Orange-600
        }
      }
    },
  },
  plugins: [],
}