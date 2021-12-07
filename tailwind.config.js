module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // boxShadow: {
    //   DEFAULT: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    //   none: "none",
    // },
    extend: {
      colors: {
        primary: {
          100: "#dae3e1",
          200: "#b5c7c3",
          300: "#91aca4",
          400: "#6c9086",
          500: "#477468",
          600: "#395d53",
          700: "#2b463e",
          800: "#1c2e2a",
          900: "#0e1715",
        },
        danger: {
          100: "#eed2d2",
          200: "#dda5a5",
          300: "#cd7777",
          400: "#bc4a4a",
          500: "#ab1d1d",
          600: "#891717",
          700: "#671111",
          800: "#440c0c",
          900: "#220606",
        },
      },
      fontFamily: {
        display: "'Damion', sans-serif",
        body: "'Nunito', sans-serif",
      },
      minHeight: {
        24: "6rem",
        40: "10rem",
      },
      maxWidth: {
        container: "480px",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["active"],
    },
  },
  plugins: [],
  important: true,
};
