/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add custom dark theme colors from the screenshot
      colors: {
        gray: {
          950: '#0F1115', // Main background
          900: '#13171C', // Component background
          800: '#1F242C', // Border
          700: '#3A424E', // Hover
          500: '#8491A3', // Text light
          400: '#67768B', // Text muted
        },
      },
      fontFamily: {
        // Use a modern sans-serif font
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

