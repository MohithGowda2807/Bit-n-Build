/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#030712',
          900: '#081225',
          800: '#0c1f3d',
          700: '#142d54',
          600: '#1e4074',
          500: '#2c5d9e',
          400: '#3b82f6',
          300: '#60a5fa',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4'
        },
        emerald: {
          400: '#34d399',
          500: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
