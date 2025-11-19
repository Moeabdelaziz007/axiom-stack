/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        axiom: {
          dark: '#05050A',       // Deep Void Black
          panel: '#0F111A',      // Dark Glass Panel
          primary: '#00F0FF',    // Cyber Cyan (Neon Blue)
          secondary: '#7000FF',  // Electric Purple
          accent: '#FF003C',     // Error/Alert Red
          success: '#00FF94',    // Matrix Green
          warning: '#FCEE0A',    // Cyber Yellow
        }
      }
    },
  },
  plugins: [],
}

