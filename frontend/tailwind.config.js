/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                lev: {
                    bg: '#0b0e14',
                    surface: '#131a2a',
                    card: '#172033',
                    'card-hover': '#1d2841',
                    border: '#1e2a3d',
                    text: '#e4e8ee',
                    'text-sec': '#6b7fa1',
                    'text-muted': '#3d4f6f',
                    orange: '#f7931a',
                    green: '#14f195',
                    red: '#ff5757',
                    blue: '#3b82f6',
                    purple: '#a78bfa',
                },
            },
        },
    },
    plugins: [],
};
