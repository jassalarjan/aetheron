/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		fontFamily: {
		  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
		},
		colors: {
		  primary: {
			50: '#f5f3ff',
			100: '#ede9fe',
			200: '#ddd6fe',
			300: '#c4b5fd',
			400: '#a78bfa',
			500: '#8b5cf6',
			600: '#7c3aed',
			700: '#6d28d9',
			800: '#5b21b6',
			900: '#4c1d95',
			950: '#2e1065',
		  },
		  accent: {
			50: '#ecfeff',
			100: '#cffafe',
			200: '#a5f3fc',
			300: '#67e8f9',
			400: '#22d3ee',
			500: '#06b6d4',
			600: '#0891b2',
			700: '#0e7490',
			800: '#155e75',
			900: '#164e63',
			950: '#083344',
		  },
		  dark: {
			50: '#f8fafc',
			100: '#f1f5f9',
			200: '#e2e8f0',
			300: '#cbd5e1',
			400: '#94a3b8',
			500: '#64748b',
			600: '#475569',
			700: '#334155',
			800: '#1e293b',
			900: '#0f172a',
			950: '#020617',
		  },
		},
		animation: {
		  'glow': 'glow 4s ease-in-out infinite alternate',
		  'float': 'float 6s ease-in-out infinite',
		  'pulse-slow': 'pulse 6s infinite cubic-bezier(0.4, 0, 0.6, 1)',
		},
		keyframes: {
		  glow: {
			'0%': { textShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
			'100%': { textShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(6, 182, 212, 0.6)' }
		  },
		  float: {
			'0%, 100%': { transform: 'translateY(0)' },
			'50%': { transform: 'translateY(-10px)' },
		  },
		},
		backgroundImage: {
		  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
		  'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
		},
		backdropBlur: {
		  xs: '2px',
		},
	  },
	},
	plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar-hide")],

  }