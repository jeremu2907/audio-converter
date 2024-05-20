/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                encodeSans: ['Encode Sans Expanded', 'sans-serif'],
            },
            colors: {
                gray: {
                    100: '#31363F',
                    200: '#222831',
                },
                teal: {
                    10: '#DAFFFB',
                    50: '#76ABAE',
                    100: '#659a9d',
                    200: '#64CCC5',
                },
                white: {
                    100: '#EEEEEE',
                },
                blue: {
                    50: '#287C98',
                    100: '#176B87',
                    200: '#04364A',
                },
            },
        },
    },
    plugins: [],
};
