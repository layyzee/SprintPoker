/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        table: {
          felt: '#0f3d2e',
          border: '#1a5d45',
          dark: '#08231a'
        }
      },
      animation: {
        'flip': 'flipCard 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pop': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-glow': 'pulseGlow 2s infinite'
      },
      keyframes: {
        flipCard: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' }
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.9)' }
        }
      }
    },
  },
  plugins: [],
}
