/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pinkish: 'hsl(295,67%,30%)',
        orangish: 'hsl(30,21%,40%)',
      },
    },
  },
  plugins: [],
};
