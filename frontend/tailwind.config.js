/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Role colors from design system
        'admin-blue': '#1a73e8',
        'admin-blue-light': '#e8f0fe',
        'admin-blue-dark': '#0058bd',
        'vendor-yellow': '#f9ab00',
        'vendor-yellow-light': '#fef7e0',
        'vendor-yellow-dark': '#956e00',
        'user-green': '#0f9d58',
        'user-green-light': '#e6f4ea',
        'user-green-dark': '#006e2c',

        // Category colors
        'cat-catering': '#d93025',
        'cat-catering-light': '#fce8e6',
        'cat-florist': '#0f9d58',
        'cat-florist-light': '#e6f4ea',
        'cat-decoration': '#1a73e8',
        'cat-decoration-light': '#e8f0fe',
        'cat-lighting': '#f9ab00',
        'cat-lighting-light': '#fef7e0',

        // Neutral (Google-ish)
        ink: '#202124',
        'ink-soft': '#5f6368',
        'ink-mute': '#80868b',
        line: '#e8eaed',
        'surface-soft': '#f8f9fa',
      },
      fontFamily: {
        sans: [
          'Google Sans',
          'Roboto',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        display: ['Google Sans', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,27,30,0.04), 0 4px 8px rgba(26,27,30,0.04)',
        'card-hover': '0 4px 8px rgba(26,27,30,0.08), 0 12px 24px rgba(26,27,30,0.08)',
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 300ms ease-out',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
        'slide-in-right': 'slideInRight 250ms ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
