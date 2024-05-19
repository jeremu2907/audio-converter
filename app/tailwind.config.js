/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                gray: {
                    100: "#31363F",
                    200: "#222831",
                },
                teal: {
                    10: "#DAFFFB",
                    50: "#76ABAE",
                    100: "#659a9d",
                    200: "#64CCC5"
                },
                white: {
                    100: "#EEEEEE"
                },
                blue: {
                    50: "#287C98",
                    100: "#176B87",
                    200: "#04364A",
                }
            },
        },
    },
    plugins: [],
};
