/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080c14',
        foreground: '#f8fafc',
        card: {
          DEFAULT: '#0f172a',
          foreground: '#f8fafc',
        },
        primary: {
          DEFAULT: '#f59e0b',
          foreground: '#080c14',
        },
        secondary: {
          DEFAULT: '#131f37',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#1a2336',
          foreground: '#94a3b8',
        },
        border: '#1e293b',
        azure: '#38bdf8',
        malachite: '#10b981',
        'neon-green': '#34d399',
        'happy-orange': '#f59e0b',
        coral: '#fb7185',
        sand: '#111927',
        saffron: '#f59e0b',
        'india-green': '#10b981',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['"Archivo Black"', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'grand': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'grand-lg': '0 12px 35px -4px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'card': '0 2px 10px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}
