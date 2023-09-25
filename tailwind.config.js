/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorPrimary: "#151827",
        colorSecondary: "#EB6B09",
        colorBlack: "#000000",
        colorWhite: "#FFFFFF",
        colorStone: "#544E5D",
        colorPale: "#F9F9FA",
        colorGrey: "#F0F0F0",
        colorTransparent: "transparent",
        colorGreen: "#29977E",
        background: "#E9E9E9",
        buttonBackground: "#151827",
        backgroundColor: "rgba(0,0,0,0.7)",
      },
    },
    fontFamily: {
      Nova: "Proxima Nova",
    },
  },
  plugins: [],
};
