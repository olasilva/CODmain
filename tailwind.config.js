// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'cod-bg': '#F5F9FF',
        'cod-blue': '#1A73E8',
        'cod-blue-dark': '#0F4082',
        'cod-blue-deep': '#0A2D5C',
        'cod-pink': '#FF2E96',
        'cod-lavender': '#E8F0FB',
        'cod-lavender-deep': '#D6E4F7',
        'cod-btn': '#1A73E8',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        ebrima: ['Ebrima', 'sans-serif'],
      },
      backgroundImage: {
        'cod-gradient': 'linear-gradient(90deg, #1A73E8 0%, #FF2E96 100%)',
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        fadeIn: 'fadeIn 0.6s ease-out both',
        slideDown: 'slideDown 0.5s ease-out both',
        slideInLeft: 'slideInLeft 0.6s ease-out both',
        slideInRight: 'slideInRight 0.6s ease-out both',
        slideUp: 'slideUp 0.5s ease-out both',
        scaleIn: 'scaleIn 0.5s ease-out both',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(15px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}