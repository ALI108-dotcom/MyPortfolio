/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fafbfe',
        foreground: '#141432',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#141432',
        },
        primary: {
          DEFAULT: '#ff9f43',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#092c4c',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#6f7a93',
        },
        border: '#e2e8f0',
        azure: '#3676d1',
        malachite: '#03c03c',
        'neon-green': '#42de5c',
        'happy-orange': '#ffae41',
        coral: '#ff8439',
        sand: '#fff4e5',
        saffron: '#ffae41',
        'india-green': '#03c03c',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['"Archivo Black"', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'grand': '0 1px 0 rgba(20, 20, 50, 0.1), 0 18px 40px -28px rgba(54, 118, 209, 0.5), 0 36px 80px -60px rgba(20, 20, 50, 0.5)',
        'grand-lg': '0 2px 0 rgba(20, 20, 50, 0.1), 0 28px 60px -34px rgba(54, 118, 209, 0.55), 0 60px 120px -70px rgba(20, 20, 50, 0.6)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.07), 0 8px 24px -8px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
