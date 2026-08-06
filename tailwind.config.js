/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      keyframes: {
        marquee: {
            '0%': { transform: 'translate3d(0%, 0, 0)' },
            '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
      },
      animation: {
        marquee: 'marquee 12s linear infinite',
      },
    },
  },
  plugins: [],
}