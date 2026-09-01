/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cod: {
          blue: '#1D4ED8',
          'blue-dark': '#152B6B',
          'blue-deep': '#12224F',
          navy: '#0E1830',
          pink: '#EC4899',
          'pink-light': '#F472B6',
          lavender: '#F3EEFB',
          'lavender-deep': '#EDE4FB',
          // Exact brand tokens pulled from the Figma source (use these for
          // any screen built from Figma going forward — see README).
          'brand-navy': '#0F4082',
          'brand-blue': '#1A73E8',
          'brand-pink': '#FF2E96',
          'brand-green': '#34A853',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        // Figma source uses Ebrima (a Microsoft system font, not on Google
        // Fonts). Falls back to Segoe UI / system sans where unavailable.
        figma: ['"Ebrima"', '"Segoe UI"', 'ui-sans-serif', 'sans-serif'],
      },
      backgroundImage: {
        'cod-gradient': 'linear-gradient(135deg, #1D4ED8 0%, #7C3AED 55%, #EC4899 100%)',
        'cod-gradient-soft': 'linear-gradient(135deg, #EEF2FF 0%, #FCE7F3 100%)',
      },
    },
  },
  plugins: [],
}
