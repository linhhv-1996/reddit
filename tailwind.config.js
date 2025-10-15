/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'bg-banana/80',
    'border-banana',
    'font-semibold',
    'bg-mint/80',
    'border-mint',
    'font-bold',
    'text-ink',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: "#0f172a",
        banana: "#FFE66D",
        bubble: "#93C5FD",
        mint: "#A7F3D0",
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 24px rgba(15,23,42,0.06)',
      },
      maxWidth: {
        '5xl': '56rem', // override lại giá trị mặc định
      },
    },
  },
  plugins: [],
}
