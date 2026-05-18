const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          blue: "#0079f2",
          green: "#30D158",
          red: "#FF453A",
          gray: "#8E8E93",
          darkGray: "#1C1C1E",
        }
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#000000",
            foreground: "#ffffff",
            primary: {
              DEFAULT: "#0A84FF",
              foreground: "#ffffff",
            },
            focus: "#0A84FF",
          },
        },
      },
    }),
  ],
};
