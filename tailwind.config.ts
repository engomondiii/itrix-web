import type { Config } from 'tailwindcss';

/**
 * iTrix — Atelier Indigo v2.0  ·  Tailwind theme (Surface 1)
 * Color literals mirror the CSS variables in src/styles/tokens/*.css,
 * which remain the single source of truth for inline styles and charts.
 */
const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#FAF8F5', deep: '#F4F1EC' },
        surface: { DEFAULT: '#FFFFFF', warm: '#FDFCFA', sunken: '#F0EDE7' },
        indigo: { 700: '#2E3D6B', 800: '#243056', 900: '#1B2444', 950: '#131A33' },
        oni: { DEFAULT: '#F5F3EE', muted: '#9AA3BF' },
        sapphire: { 50: '#EDF1FC', 100: '#DCE4F9', 300: '#8FA8EA', 500: '#3D63D9', 600: '#2950C8', 700: '#1E3FA8' },
        gold: { 50: '#FAF4E8', 100: '#F3E8D3', 400: '#D9AC5C', 500: '#C9943A', 600: '#B07D2E' },
        ink: { 300: '#B4B9C7', 400: '#8E94A6', 500: '#6B7186', 700: '#3D4458', 900: '#1F2433' },
        line: { DEFAULT: '#E5E1D8', subtle: '#EFECE4', strong: '#D8D3C9' },
        success: { DEFAULT: '#1A7F5C', text: '#15694C', soft: '#E5F3ED' },
        warning: { DEFAULT: '#B45309', text: '#92450B', soft: '#FCF1E3' },
        error: { DEFAULT: '#BE3D3D', text: '#9E3030', soft: '#FAE9E9' },
        tier: { 1: '#2950C8', '1soft': '#EDF1FC', 2: '#5B7FD9', '2soft': '#EFF3FC', 3: '#6B7186', '3soft': '#F0F1F4', 4: '#A39B8B', '4soft': '#F4F2ED' },
        chart: { 1: '#2950C8', 2: '#C9943A', 3: '#1A7F5C', 4: '#7C5CBF', 5: '#C46A4A', 6: '#4A93A8' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        micro: ['11px', { lineHeight: '1.3', letterSpacing: '0.06em' }],
        caption: ['12px', { lineHeight: '1.4' }],
        secondary: ['13px', { lineHeight: '1.5' }],
        body: ['14px', { lineHeight: '1.55' }],
        'card-title': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
        section: ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'page-title': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        kpi: ['24px', { lineHeight: '1.1', fontWeight: '600' }],
        'kpi-hero': ['30px', { lineHeight: '1.1', fontWeight: '700' }],
        'web-h1': ['clamp(2rem, 4vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'web-h2': ['1.625rem', { lineHeight: '1.2', fontWeight: '650' }],
        'web-h3': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'web-body': ['1rem', { lineHeight: '1.65' }],
        'web-lead': ['1.125rem', { lineHeight: '1.6' }],
      },
      boxShadow: {
        1: '0 1px 2px rgba(46,38,23,.05), 0 1px 3px rgba(46,38,23,.07)',
        2: '0 4px 12px rgba(46,38,23,.08), 0 2px 4px rgba(46,38,23,.05)',
        3: '0 12px 32px rgba(46,38,23,.12), 0 4px 8px rgba(46,38,23,.06)',
        gold: '0 0 0 1px rgba(201,148,58,.25), 0 2px 8px rgba(201,148,58,.12)',
      },
      borderRadius: { sm: '6px', md: '8px', lg: '12px', pill: '999px' },
      maxWidth: { container: '1200px', reading: '68ch' },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      transitionDuration: { fast: '120ms', base: '200ms', slow: '320ms' },
      ringColor: { DEFAULT: '#2950C8' },
      ringOffsetColor: { DEFAULT: '#FAF8F5' },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.98)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'slide-down': { from: { opacity: '0', transform: 'translateY(-6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        'draw-line': { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out both',
        'fade-up': 'fade-up 320ms cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scale-in 200ms cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slide-down 160ms ease-out both',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
