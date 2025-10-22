module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#eceeff',
          300: '#a88bff',
          500: '#7b61ff',
          700: '#5a3bff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'display-1': ['3.5rem', { lineHeight: '1.05', fontWeight: '700' }],
        'display-2': ['2.5rem', { lineHeight: '1.08', fontWeight: '700' }]
      },
      boxShadow: {
        'glow-md': '0 8px 30px rgba(99,102,241,0.12)'
      }
      ,
      keyframes: {
        'hm-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'hm-pop': {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'hm-fade-in': 'hm-fade-in 0.7s cubic-bezier(.4,0,.2,1) both',
        'hm-pop': 'hm-pop 0.5s cubic-bezier(.4,0,.2,1) both'
      }
    },
  },
  plugins: [],
}
