/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(-16rem)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 200ms linear',
      },
    },
  },
  plugins: [],
};
