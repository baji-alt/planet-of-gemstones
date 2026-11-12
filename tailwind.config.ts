import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './plugins/**/*.ts',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: '#7A1F3D', 50: '#FBF1F4', 100: '#F3D9E1', 300: '#C2647F', 500: '#9A2A4F', 700: '#7A1F3D', 800: '#5E1730', 900: '#3F0F20' },
        gold: { DEFAULT: '#C9A24B', light: '#E6CB86', pale: '#F1E2B8', deep: '#7A5C1A' },
        cream: { DEFAULT: '#F5EDE6', 50: '#FBF7F3', 200: '#EFE3D8' },
        blush: { DEFAULT: '#EAD9D2', dark: '#D9C0B6' },
        ink: { DEFAULT: '#0E0E12', 800: '#18171E', 700: '#24222B', soft: '#3A3640' },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Amiri', 'Georgia', 'serif'],
        sans: ['Inter', '"Noto Kufi Arabic"', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', '"Noto Kufi Arabic"', 'serif'],
        kufi: ['"Noto Kufi Arabic"', 'Inter', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.28em' },
      boxShadow: {
        soft: '0 20px 50px -24px rgba(122,31,61,0.28)',
        gold: '0 0 0 1px rgba(201,162,75,0.45), 0 18px 40px -22px rgba(122,31,61,0.35)',
      },
      keyframes: {
        twinkle: { '0%,100%': { opacity: '0.25', transform: 'scale(0.8)' }, '50%': { opacity: '1', transform: 'scale(1)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        twinkle: 'twinkle 3.2s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
}
