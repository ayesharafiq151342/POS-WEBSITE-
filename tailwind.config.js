/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        accent: "#8B5CF6",
        blacks: "#EEF2FF",
        textDark: "#1E1B4B",
        card: "#FFFFFF",
        border: "#E0E7FF",
      },
      borderRadius: {
        base: "0.5rem",
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
