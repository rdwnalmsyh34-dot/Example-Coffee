/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'kopi-primary': '#6B4423',
                'kopi-secondary': '#8B5E3C',
                'kopi-accent': '#D4A574',
                'kopi-cream': '#F5E6D3',
                'kopi-dark': '#3E2723',
                'kopi-highlight': '#FFB74D',
            },
            fontFamily: {
                display: ['Playfair Display', 'serif'],
            },
            boxShadow: {
                'premium': '0 10px 40px rgb(107 68 35 / 0.15)',
                'premium-lg': '0 20px 60px rgb(107 68 35 / 0.25)',
            },
        },
    },
    plugins: [],
}
