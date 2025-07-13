/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        primary: '#2563EB',
        accent: {
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
        },
        text: '#111827',
      }
    },
  },
  plugins: [],
}
