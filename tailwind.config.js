/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Tambahkan semua file yang pakai Tailwind
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'kopi-primary': '#1A1A1A', // Dark Grey / Black
        'kopi-secondary': '#4A4A4A', // Medium Grey
        'kopi-accent': '#808080', // Grey
        'kopi-cream': '#F5F5F5', // Off-white / Light Grey
        'kopi-dark': '#000000', // Black
        'kopi-highlight': '#D3D3D3', // Light Grey
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.5s ease-out',
        'slideInRight': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'premium-lg': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'linear-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'linear-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'linear-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'linear-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}