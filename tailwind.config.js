/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'light-white': 'rgba(255,255,255,0.17)',
        'btn-blue': '#004385' // Replace with your desired color code
      },
    },
  },
  plugins: [],
}

