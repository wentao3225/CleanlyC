import { defineConfig, presetWind, presetIcons, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  transformers: [transformerDirectives()],
  shortcuts: {
    'glass': 'bg-white/70 backdrop-blur-xl border border-white/30 shadow-sm dark:bg-gray-900/70 dark:border-gray-700/30',
    'glass-strong': 'bg-white/85 backdrop-blur-2xl border border-white/40 shadow-md dark:bg-gray-900/85 dark:border-gray-700/40',
    'card': 'rounded-2xl',
    'btn': 'inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-medium transition-all duration-250 cursor-pointer select-none active:scale-97',
    'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-500/25 dark:bg-blue-600 dark:hover:bg-blue-500',
    'btn-secondary': 'btn glass hover:bg-white/90 dark:hover:bg-gray-800/90',
    'btn-danger': 'btn bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/15 dark:text-red-400',
    'btn-ghost': 'btn hover:bg-black/5 dark:hover:bg-white/5',
    'btn-icon': 'btn p-2.5 rounded-xl',
    'text-accent': 'text-blue-600 dark:text-blue-400',
    'nav-item': 'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium',
    'nav-item-active': 'nav-item bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    'nav-item-inactive': 'nav-item text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/60'
  },
  theme: {
    colors: {
      brand: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a'
      }
    },
    borderRadius: {
      xs: '0.375rem',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem'
    }
  }
})
