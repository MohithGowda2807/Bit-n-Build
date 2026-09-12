/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OceanSentinel system (design/DESIGN.md)
        os: {
          void: '#0e1012',
          // Aliases used by the Phase 2 components; they resolve to the system surfaces above and below.
          deep: '#0e1012',
          card: '#15171b',
          'card-hover': '#1c1f24',
          surface: '#1c1f24',
          border: '#333943',
          panel: '#15171b',
          raised: '#1c1f24',
          overlay: '#23262d',
          fog: '#a0aaba',
          ash: '#8b96aa',
          slate: '#566171',
          steel: '#333943',
          pewter: '#444d5a',
          silver: '#bbc2ce',
          signal: '#007afc',
          'signal-hover': '#3d9bff',
          'signal-deep': '#0062ca',
          clear: '#2fae6e',
        },
        risk: {
          low: '#a0aaba',
          moderate: '#e2a33a',
          elevated: '#f0873a',
          high: '#f2643e',
          critical: '#f0483e',
        },
        // Phase 1 palette, kept so the logistics page renders unchanged
        ocean: {
          950: '#030712',
          900: '#081225',
          800: '#0c1f3d',
          700: '#142d54',
          600: '#1e4074',
          500: '#2c5d9e',
          400: '#3b82f6',
          300: '#60a5fa',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4'
        },
        emerald: {
          400: '#34d399',
          500: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        badge: '4px',
        input: '6px',
        row: '12px',
        panel: '24px',
        pill: '100px',
      },
      letterSpacing: {
        eyebrow: '1px',
      },
    },
  },
  plugins: [],
}
