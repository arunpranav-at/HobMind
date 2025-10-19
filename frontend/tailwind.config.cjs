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
    },
  },
  plugins: [],
}
