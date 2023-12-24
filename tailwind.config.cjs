/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // https://fonts.google.com/specimen/Source+Sans+Pro?query=Source&sidebar.open=true&selection.family=Montserrat:wght@700;900|Source+Sans+Pro
    fontFamily: {
      display: ['Montserrat', 'sans-serif'],
      body: ['Source Sans Pro', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
