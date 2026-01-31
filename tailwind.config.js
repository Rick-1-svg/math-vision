/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Light mode colors
                light: {
                    bg: '#FFFFFF',
                    surface: '#F5F7FA',
                    text: '#1A1A1A',
                    textSecondary: '#666666',
                },
                // Dark mode colors
                dark: {
                    bg: '#0A0E27',
                    surface: '#141B3D',
                    text: '#E8ECF5',
                    textSecondary: '#8B92B0',
                },
                // Brand colors
                primary: '#2D5BFF',
                accent: '#00D9FF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
