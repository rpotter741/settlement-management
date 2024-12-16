/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS/TS/React files in the src folder
    '../server/public/index.html', // Include your root HTML file (if applicable)
  ],

  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        accentTwo: 'var(--color-accent-two)',
        minor: 'var(--color-minor)',
        minorTwo: 'var(--color-minor-two)',
        background: 'var(--color-background)',
      },
    },
  },
  plugins: [],
};
