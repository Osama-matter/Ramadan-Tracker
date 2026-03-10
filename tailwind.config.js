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
        // ── الألوان الأساسية (تقرأ من CSS variables) ──────────────────
        gold: {
          DEFAULT: 'rgb(var(--gold))',
          light: 'rgb(var(--gold-light))',
          dark: 'rgb(var(--gold-dark))',
        },
        green: {
          main: 'rgb(var(--green-main))',
          mid: 'rgb(var(--green-mid))',
          light: 'rgb(var(--green-light))',
        },
        cream: 'rgb(var(--cream))',
        surface: 'rgb(var(--surface))',

        // ── ألوان النص ──────────────────────────────────────────────────
        // text-text-dark → النص الرئيسي (غامق في الفاتح، فاتح في المظلم)
        // text-text-mid  → النص الثانوي
        'text-dark': 'rgb(var(--text-dark))',
        'text-mid': 'rgb(var(--text-mid))',
      },

      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        scheherazade: ['"Scheherazade New"', 'serif'],
        amiri: ['Amiri', 'serif'],
      },

      borderColor: {
        // ✅ الحل: border افتراضي شفاف — يمنع الخطوط البيضاء
        DEFAULT: 'transparent',
      },

      boxShadow: {
        card: '0 8px 32px rgba(0,0,0,0.08)',
        gold: '0 4px 20px rgba(201,168,76,0.25)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};