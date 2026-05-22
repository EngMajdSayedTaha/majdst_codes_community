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
    extend: {},
  },
  plugins: [],
}

