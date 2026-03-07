/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': 'rgb(var(--gold) / <alpha-value>)',
        'gold-light': 'rgb(var(--gold-light) / <alpha-value>)',
        'gold-dark': 'rgb(var(--gold-dark) / <alpha-value>)',
        'green-main': 'rgb(var(--green-main) / <alpha-value>)',
        'green-mid': 'rgb(var(--green-mid) / <alpha-value>)',
        'green-light': 'rgb(var(--green-light) / <alpha-value>)',
        'cream': 'rgb(var(--cream) / <alpha-value>)',
        'text-dark': 'rgb(var(--text-dark) / <alpha-value>)',
        'text-mid': 'rgb(var(--text-mid) / <alpha-value>)',
        'white': 'rgb(var(--white) / <alpha-value>)',
        'black': 'rgb(var(--black) / <alpha-value>)',
      },
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'scheherazade': ['Scheherazade New', 'serif'],
      }
    },
  },
  plugins: [],
}
