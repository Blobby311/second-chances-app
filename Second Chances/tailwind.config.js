/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sage: '#E8F3E0',
        'bg-primary': '#365441',
        'dark-green': '#2C4A34',
        terracotta: '#C85E51',
      },
    },
  },
  plugins: [],
}

