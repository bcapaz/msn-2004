/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        msn: {
          blue: '#86b9e0',
          dark: '#235d81',
          light: '#eef5fb',
          border: '#a5c3d9',
        }
      },
    },
  },
  plugins: [],
}
