/** @type {import('tailwindcss').Config} */
export default {
  // was "media" (OS preference only, no manual override). Now class-based so
  // ThemeProvider (src/providers/ThemeProvider) can toggle Light/Dark/System
  // by adding/removing "dark" on <html> - see index.html's inline script for
  // the pre-hydration application of this that avoids a flash of wrong theme.
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
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

        spin: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        shake: "shake 1s ease-in-out",
        spin: "spin 3s linear infinite",
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

  // daisyUI's own theme engine (drives .input/.select/.textarea/.btn/etc.)
  // used to be completely disconnected from Tailwind's dark: classes - it
  // always rendered its default "light" theme regardless of OS/manual dark
  // mode, which is why so many form inputs across the dashboard either went
  // unreadable (white text forced onto daisyUI's white input bg) or had to
  // hardcode bg-white to opt out of dark mode entirely. ThemeProvider now
  // sets data-theme="light"/"dark" on <html> to match the same state as the
  // "dark" class, so both systems move together and none of those overrides
  // are needed anymore.
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
  },
};
