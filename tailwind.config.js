module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '0px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
    extend: {
      fontFamily: {
        mateSc: ["Mate SC, serif"],
        mate: ["Mate, serif"],
        GowunBatang: ['Gowun Batang, system-ui'],
      },
      backgroundImage: {
        'Background': "url('../src/assets/Images/HomeBg.png')",
        'hero-pattern': "url('../src/Assets/hero-pattern.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}
