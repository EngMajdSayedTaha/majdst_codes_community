/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to avoid conflicting with existing globals.css
  },
  theme: {
    extend: {
      colors: {
        primary: '#F9E400',
        'admin-dark': '#0d0d1a',
        'admin-surface': '#141428',
        'admin-border': '#1e1e38',
      },
    },
  },
  plugins: [],
}

