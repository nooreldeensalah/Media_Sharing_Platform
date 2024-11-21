/** @type {import('tailwindcss').Config} */
export default {
  content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}', // Include all component files in the src directory
  ],
  theme: {
      extend: {
          colors: {
              'primary': '#2563eb', // Custom blue for branding
              'secondary': '#6b7280', // Neutral gray
          },
          fontFamily: {
              sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Use Inter or fallback to system fonts
          },
          container: {
              center: true,
              padding: '1rem',
          },
      },
  },
  plugins: [],
};
