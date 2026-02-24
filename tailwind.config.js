/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2A9D8F',
        secondary: '#264653',
        beige: {
          50: '#F5F5F0',
          100: '#E8E6E1',
          200: '#D5D0C8',
          300: '#B8B2A7',
          400: '#2A9D8F',
          500: '#264653',
          600: '#5C4F45',
          700: '#453B34',
          800: '#2C2C2C',
          900: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};