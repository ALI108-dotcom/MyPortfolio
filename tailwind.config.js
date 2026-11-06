/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050206',
        foreground: '#f8fafc',
        card: {
          DEFAULT: '#0d0612',
          foreground: '#f8fafc',
        },
        primary: {
          DEFAULT: '#f59e0b',
          foreground: '#050206',
        },
        secondary: {
          DEFAULT: '#120719',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#190a24',
          foreground: '#94a3b8',
        },
        border: 'rgba(245, 158, 11, 0.22)',
        azure: '#00f0ff',
        malachite: '#10b981',
        'neon-green': '#34d399',
        'happy-orange': '#f59e0b',
        coral: '#fbbf24',
        sand: '#0d0514',
        saffron: '#f59e0b',
        'india-green': '#10b981',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['"Archivo Black"', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'grand': '0 4px 25px -2px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(245, 158, 11, 0.18)',
        'grand-lg': '0 12px 40px -4px rgba(0, 0, 0, 0.9), 0 0 1px 1px rgba(245, 158, 11, 0.22)',
        'card': '0 2px 10px -2px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(245, 158, 11, 0.15)',
      },
    },
  },
  plugins: [],
}
