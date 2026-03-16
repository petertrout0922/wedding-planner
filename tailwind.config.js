/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f7',
          100: '#e0eeef',
          200: '#c1dddf',
          300: '#9bc8ca',
          400: '#6fa9ac',
          500: '#4A7C7E',
          600: '#3d6667',
          700: '#325254',
          800: '#2b4546',
          900: '#273b3c',
        },
      },
    },
  },
  plugins: [],
};
