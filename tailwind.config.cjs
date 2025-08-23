/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { background: '#0b0f1a', surface: '#0f172a', card: '#111827', border: '#1f2937', text: '#e5e7eb', muted: '#9ca3af', brand: '#22c55e' },
      boxShadow: { soft: '0 8px 30px rgba(0,0,0,0.25)' },
      borderRadius: { xxl: '1.25rem' }
    },
  },
  plugins: [],
}