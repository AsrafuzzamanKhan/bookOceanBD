/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      primary: '"Exo 2"',
    },

    extend: {
      colors: {
        body: "#1D1F23",
        primary: "#151618",
        accent: {
          DEFAULT: "#F6CD46",
          hover: "#E1B72E",
        },
      },
      backgroundImage: {
        mainSlider: "url('img/mainSlider_bg.png')",
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0,0 )" },
          "20%, 80%": { transform: "translate3d(2px, 0,0 )" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0,0 )" },
          "40%, 60%": { transform: "translate3d(4px, 0,0 )" },
        },
      },
      animation: {
        shake: "shake 1s ease-in-out",
      },
    },
  },

  plugins: [
    require("daisyui"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrokkbarcolor: "rgb(31 29 29) white",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scroolbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "white",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(31 41 55)",
            borderRadious: "20px",
            border: "1px solid white",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
