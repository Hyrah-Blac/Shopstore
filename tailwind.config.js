/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#646cff",
        secondary: "#535bf2",
        background: "#121212",
        lightBackground: "#ffffff",
        darkBackground: "#1a1a1a",
        hoverBackground: "#2a2a2a",
        textColorLight: "rgba(255, 255, 255, 0.87)",
        glassBg: "rgba(255, 255, 255, 0.05)",
        glassBorder: "rgba(255, 255, 255, 0.15)",
        neonPrimary: "#646cff",
        neonSecondary: "#535bf2",
      },
      fontFamily: {
        sans: ["Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 10px #646cff, 0 0 20px #646cff",
      },
      animation: {
        "neon-pulse": "neonPulse 3s ease-in-out infinite",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": {
            textShadow: "0 0 5px #646cff, 0 0 10px #646cff, 0 0 20px #646cff",
          },
          "50%": {
            textShadow: "0 0 10px #646cff, 0 0 20px #646cff, 0 0 30px #646cff",
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
