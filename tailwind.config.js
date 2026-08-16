/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cod: {
          blue: {
            DEFAULT: "#1E4FD9",
            dark: "#0B2A8A",
            light: "#3D6BEE",
          },
          pink: {
            DEFAULT: "#E91E8C",
            light: "#EC4899",
          },
          bg: "#F1F4FC",
        },
      },
      backgroundImage: {
        "cod-panel": "linear-gradient(180deg, #2E5CF0 0%, #0B2A8A 100%)",
        "cod-btn": "linear-gradient(90deg, #2E5CF0 0%, #E91E8C 100%)",
        "cod-hero": "linear-gradient(120deg, #0B2A8A 0%, #1E4FD9 55%, #2E63F5 100%)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        scaleIn: {
          "0%": { opacity: 0, transform: "scale(0.96)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        fadeIn: "fadeIn 0.6s ease-out forwards",
        scaleIn: "scaleIn 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
