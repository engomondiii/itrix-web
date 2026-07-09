import type { Config } from 'tailwindcss';

/**
 * iTrix — Mathematical Glass Intelligence (Brand Bible v1.2)  ·  Tailwind theme (Surface 1)
 *
 * Only token VALUES change from the Atelier Indigo build; the color/utility
 * NAMES (canvas, surface, indigo, sapphire, gold, ink, line, tier, chart, …)
 * are preserved so no component markup needs editing. Literals mirror the CSS
 * variables in src/styles/tokens/*.css, which remain the source of truth for
 * inline styles and charts.
 *
 * Role mapping (see colors.css header):
 *   canvas → #F8FAFC · indigo-* → #1F2937 ramp · sapphire-* → cool blue→ink scale
 *   gold-* → holographic soft-blue · ink-* → v1.2 text scale · line → slate glass
 */
const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#F8FAFC', deep: '#EAF0FF' },
        surface: { DEFAULT: '#FFFFFF', warm: '#FDFEFF', sunken: '#EAF0FF' },
        // Structural dark ramp anchored on the v1.2 #1F2937 ink.
        indigo: { 700: '#3C4A5E', 800: '#313E50', 900: '#273343', 950: '#1F2937' },
        oni: { DEFAULT: '#F8FAFC', muted: '#94A3B8' },
        // Cool blue-white action scale (restrained; emphasis via light-blue↔ink contrast).
        sapphire: { 50: '#EAF0FF', 100: '#D6E6FF', 300: '#A9C2EE', 500: '#5B6B82', 600: '#2C3A4E', 700: '#1F2937' },
        // Signature holographic soft-blue (v1.2 has no gold accent).
        gold: { 50: '#F2F6FF', 100: '#E3ECFF', 400: '#B7CBF4', 500: '#8FA8EA', 600: '#6E7CA8' },
        // Text scale (Brand Bible §3.3).
        ink: { 300: '#94A3B8', 400: '#64748B', 500: '#4B5563', 700: '#374151', 900: '#1F2937' },
        // Slate glass hairlines.
        line: { DEFAULT: 'rgba(148,163,184,0.56)', subtle: 'rgba(148,163,184,0.32)', strong: 'rgba(31,41,55,0.72)' },
        // Semantic feedback (v1.2 §8.1) — lines/icons/short text only.
        success: { DEFAULT: '#067647', text: '#067647', soft: '#ECFDF3' },
        warning: { DEFAULT: '#B54708', text: '#B54708', soft: '#FFFAEB' },
        error: { DEFAULT: '#D92D20', text: '#B42318', soft: '#FEF3F2' },
        // Lead tiers in the cool-blue / slate family.
        tier: { 1: '#2C3A4E', '1soft': '#D6E6FF', 2: '#5B6B82', '2soft': '#EAF0FF', 3: '#64748B', '3soft': '#EEF2F7', 4: '#94A3B8', '4soft': '#F2F5F9' },
        // Categorical chart palette (cool-anchored, color-blind-safe order).
        chart: { 1: '#2C3A4E', 2: '#8FA8EA', 3: '#067647', 4: '#6E7CA8', 5: '#B54708', 6: '#4A93A8' },
        // v1.2 glass helper (usable as bg-glass / border-glass).
        glass: { DEFAULT: 'rgba(248,250,252,0.72)', strong: 'rgba(248,250,252,0.88)', soft: 'rgba(234,240,255,0.56)', dark: 'rgba(31,41,55,0.72)', border: 'rgba(214,230,255,0.88)' },
      },
      fontFamily: {
        // Display = Space Grotesk (headings). Sans = Inter (UI/body). Mono = IBM Plex Mono.
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'Pretendard', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        korean: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
      },
      fontSize: {
        // Retained names, retuned to the v1.2 scale (§8.1).
        micro: ['12px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        caption: ['14px', { lineHeight: '1.4' }],
        secondary: ['14px', { lineHeight: '1.55' }],
        body: ['16px', { lineHeight: '1.55' }],
        'card-title': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        section: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'page-title': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        kpi: ['32px', { lineHeight: '1.12', fontWeight: '600' }],
        'kpi-hero': ['44px', { lineHeight: '1.12', fontWeight: '700' }],
        'web-h1': ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '600' }],
        'web-h2': ['clamp(1.75rem, 3vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '600' }],
        'web-h3': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'web-body': ['1rem', { lineHeight: '1.55' }],
        'web-lead': ['1.125rem', { lineHeight: '1.55' }],
      },
      boxShadow: {
        1: '0 18px 48px rgba(31,41,55,.08)',
        2: '0 24px 72px rgba(31,41,55,.12)',
        3: '0 28px 80px rgba(31,41,55,.16)',
        // Signature = soft-blue holographic ring (replaces gold).
        gold: '0 0 0 1px rgba(143,168,234,.35), 0 2px 12px rgba(143,168,234,.18)',
        glass: '0 18px 48px rgba(31,41,55,.08)',
      },
      borderRadius: { sm: '10px', md: '14px', lg: '20px', panel: '28px', pill: '999px' },
      backdropBlur: { glass: '18px', 'glass-sm': '10px', 'glass-lg': '28px' },
      maxWidth: { container: '1120px', 'container-xl': '1280px', reading: '68ch' },
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      transitionDuration: { fast: '160ms', base: '180ms', slow: '320ms' },
      ringColor: { DEFAULT: 'rgba(148,163,184,0.72)' },
      ringOffsetColor: { DEFAULT: '#F8FAFC' },
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
