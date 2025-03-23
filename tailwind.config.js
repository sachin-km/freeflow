/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // New modern color scheme
        'sage': '#EEF1DA',          // Main background
        'lavender': '#ADB2D4',      // Primary accent
        'soft-teal': '#C7D9DD',     // Secondary accent
        'mint': '#D5E5D5',          // Tertiary accent
        'text': '#4A4A4A',          // Primary text color
        
        // Legacy colors (kept for backward compatibility)
        'primary-deep': '#0A1929',
        'primary-rich-blue': '#1A365D',
        'primary-mid-blue': '#132F4C',
        'accent-blue-1': '#2C5282',
        'accent-blue-2': '#4299E1',
        'highlight-blue-1': '#90CDF4',
        'highlight-blue-2': '#BEE3F8',
        'highlight-silver': '#E2E8F0',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'standard': '8px',
      },
    },
  },
  plugins: [],
} 