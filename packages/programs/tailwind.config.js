/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable-based colors for easy theming
        primary: 'hsl(var(--primary))',
        'primary-hover': 'hsl(var(--primary-hover))',
        secondary: 'hsl(var(--secondary))',
        'secondary-hover': 'hsl(var(--secondary-hover))',
        accent: 'hsl(var(--accent))',
        
        // Brand-specific colors
        brand: {
          primary: '#3B82F6',    // Blue-500
          secondary: '#1F2937',  // Gray-800
          accent: '#6366F1',     // Indigo-500
        },
      },
      backgroundColor: {
        card: 'hsl(var(--card-bg))',
        'card-hover': 'hsl(var(--card-bg-hover))',
      },
      borderColor: {
        card: 'hsl(var(--border))',
      },
    },
  },
  plugins: [],
}