/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ngen: {
          green: '#1e3126',
          darkgreen: '#15241b',
          lightgreen: '#284133',
          cream: '#fbf8f3',
          linen: '#f4efe6',
          peach: '#ff8c69',
          peachHover: '#fa7b55',
          lime: '#d4e867',
        },
        botanical: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c5dcd0',
          300: '#9ec2b1',
          400: '#71a38e',
          500: '#4e8670',
          600: '#3c6c59',
          700: '#315749',
          800: '#29463b',
          900: '#152920',
          950: '#0b1611',
        },
        terracotta: {
          50: '#fdf7f4',
          100: '#f9eee7',
          200: '#f3dacf',
          300: '#e9bead',
          400: '#dc9982',
          500: '#cb7457',
          600: '#be5e41',
          700: '#9e4a33',
          800: '#833f2d',
          900: '#6d3729',
          950: '#3b1a13',
        },
        sand: {
          50: '#faf8f5',
          100: '#f4efe6',
          200: '#eae3d2',
          300: '#dcd1b9',
          400: '#c7b79a',
          500: '#b29e7e',
          600: '#9b8466',
          700: '#7d6951',
          800: '#665644',
          900: '#544739',
          950: '#2d251d',
        }
      },
      fontFamily: {
        display: ['"Figtree"', '"Plus Jakarta Sans"', 'sans-serif'],
        figtree: ['"Figtree"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Figtree"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
