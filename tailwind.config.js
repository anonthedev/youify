/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1bc257",
        "youtube-red": "#fd0000",
      },
      fontFamily: {
        raleway: ["var(--font-raleway)"],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}

