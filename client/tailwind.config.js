export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#101826",
          "navy-light": "#1c2942",
          "navy-dark": "#0a0f18"
        },
        accent: {
          DEFAULT: "#f4793a",
          dark: "#d85f22",
          light: "#ffb385"
        },
        surface: {
          DEFAULT: "#f7f5f2",
          card: "#ffffff"
        }
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        serif: ["\"Playfair Display\"", "serif"]
      },
      spacing: {
        gutter: "1.85rem",
        "gutter-lg": "2.65rem",
        section: "5.5rem",
        "section-lg": "7.25rem"
      },
      borderRadius: {
        card: "0.85rem"
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(16, 24, 38, 0.12)"
      }
    }
  },
  plugins: []
};
