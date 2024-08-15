/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {

    extend: {

      screens: {
        '3xl': '1920px',
      },
     
     
      fontFamily: {
        'grotesk': ['grotesk-regular', 'sans-serif'],
        'groteskBold': ['grotesk-bold', 'sans-serif'],
        'dharma': ['dharma-gothic-e', 'sans-serif'],
      },
      colors: {
        'massyellow': '#FEED00',
        'massblue': '#0038FF',
        'massgrey': '#EAEAEA',
      },
      transitionProperty: {
        'color-border': 'background-color, border-color',
      },
    },
  },
  plugins: [],
}
