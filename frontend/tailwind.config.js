/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',        // Clean white - main background
        secondary: '#000000',      // Black - text and accents
        accent: '#1F2937',         // Dark gray - subtle accents
        danger: '#EF4444',
        'dark-bg': '#FFFFFF',      // White background
        'card-bg': '#F9FAFB',      // Off-white for cards
        'gold-light': '#F3F3F3',   // Very light gray
        'emerald-accent': '#000000', // Black for elements
        'sapphire': '#E5E5E5',     // Light gray
        'vibrant-purple': '#6B7280', // Gray
        'vibrant-green': '#000000', // Black
        'vibrant-orange': '#000000', // Black
        'vibrant-red': '#374151',   // Dark gray
        'vibrant-pink': '#4B5563', // Charcoal gray
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'premium': '0 20px 60px rgba(0,0,0,0.1)',
        'premium-sm': '0 10px 30px rgba(0,0,0,0.05)',
        'vibrant': '0 0 20px rgba(0, 0, 0, 0.1)',
        'vibrant-blue': '0 0 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

