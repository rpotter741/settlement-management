/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS/TS/React files in the src folder
    '../server/public/index.html', // Include your root HTML file (if applicable)
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};
