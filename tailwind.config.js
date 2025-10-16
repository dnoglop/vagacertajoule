/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'modal-in': {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        }
      },
      animation: {
        blob: 'blob 7s infinite',
        'spin-slow': 'spin 22s linear infinite',
        'spin-slow-reverse': 'spin-reverse 28s linear infinite',
        'spin-medium-reverse': 'spin-reverse 18s linear infinite',
        'spin-fast': 'spin 12s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'modal-in': 'modal-in 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      },
    },
  },
  plugins: [],
}