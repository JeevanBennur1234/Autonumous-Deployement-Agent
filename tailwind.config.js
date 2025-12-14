/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      scale: {
        '102': '1.02',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  safelist: [
    'bg-emerald-100', 'bg-emerald-500', 'bg-red-100', 'bg-red-500', 'bg-blue-100', 'bg-blue-500', 'bg-purple-100', 'bg-purple-500',
    'text-emerald-600', 'text-emerald-700', 'text-red-600', 'text-red-700', 'text-blue-600', 'text-blue-700', 'text-purple-600', 'text-purple-700',
    'border-emerald-200', 'border-emerald-300', 'border-red-200', 'border-red-300', 'border-blue-200', 'border-blue-300', 'border-purple-200', 'border-purple-300',
    'shadow-emerald-200', 'shadow-red-200', 'shadow-blue-200', 'shadow-purple-200',
    'hover:border-emerald-300', 'hover:border-red-300', 'hover:border-blue-300', 'hover:border-purple-300'
  ],
  plugins: [],
}