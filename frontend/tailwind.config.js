/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slot-indigo': '#27205F',
        'slot-yellow': '#FFC94A',
        'slot-orange': '#F59A3D',
        'slot-cream': '#F7F3EA',
        'slot-charcoal': '#202020',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        hand: ['Kalam', 'cursive'],
      },
      boxShadow: {
        'paper': '0 4px 6px -1px rgba(39, 32, 95, 0.1), 0 2px 4px -1px rgba(39, 32, 95, 0.06)',
        'paper-hover': '0 10px 15px -3px rgba(39, 32, 95, 0.1), 0 4px 6px -2px rgba(39, 32, 95, 0.05)',
      }
    },
  },
  plugins: [],
}
