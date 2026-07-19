import type { Config } from 'tailwindcss';

/**
 * itriX · Brand Manual v1.5 EN — Tailwind theme (Surface 1 v4.0, Phase 1)
 *
 * Atelier Indigo is retired by NAME as well as by value. The utility vocabulary
 * is now the Brand Manual's own:
 *
 *   canvas · soft · tint · surface(+glass)
 *   ink-primary / ink-secondary / ink-muted / ink-inverse
 *   border-glass / border-soft / border-medium / border-strong
 *   accent / accent-soft / accent-line
 *   structure-600..900
 *
 * The retired names (indigo-*, sapphire-*, gold-*, oni, canvas-deep,
 * surface-warm, surface-sunken, line, ink-900/700/500/400/300) are GONE. The
 * `no-atelier-tokens` ESLint rule fails the build if one reappears, so the CSS
 * can never again say "gold" while rendering soft-blue.
 *
 * Literals mirror src/styles/tokens/brand.css, which stays the source of truth
 * for inline styles and charts.
 */
const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Foundations */
        canvas: '#F8FAFC',
        soft: '#EAF0FF',
        tint: '#D6E6FF',
        surface: {
          DEFAULT: '#FFFFFF',
          glass: 'rgba(248,250,252,0.72)',
          'glass-strong': 'rgba(248,250,252,0.88)',
          'glass-soft': 'rgba(234,240,255,0.56)',
          'dark-glass': 'rgba(31,41,55,0.72)',
        },

        /* Ink — see the accessibility contract in brand.css.
           `muted` is placeholders / disabled / dividers only on light grounds. */
        ink: {
          primary: '#1F2937',
          secondary: '#4B5563',
          muted: '#94A3B8',
          inverse: '#F8FAFC',
        },

        /* Structure — the restrained dark ramp for dark sections and footers */
        structure: { 600: '#3C4A5E', 700: '#313E50', 800: '#273343', 900: '#1F2937' },

        /* Borders — slate glass hairlines */
        border: {
          glass: 'rgba(214,230,255,0.88)',
          soft: 'rgba(148,163,184,0.32)',
          medium: 'rgba(148,163,184,0.56)',
          strong: 'rgba(31,41,55,0.72)',
        },

        /* Accent — restrained holographic soft-blue, under 5% of a screen */
        accent: {
          DEFAULT: '#8FA8EA',
          soft: '#B7CBF4',
          line: 'rgba(148,163,184,0.48)',
        },

        /* Semantic feedback — lines, icons and short text only */
        success: { DEFAULT: '#067647', surface: '#ECFDF3' },
        warning: { DEFAULT: '#B54708', surface: '#FFFAEB' },
        error: { DEFAULT: '#B42318', border: '#D92D20', surface: '#FEF3F2' },

        /* Internal surfaces only — never rendered to a visitor */
        tier: {
          1: '#2C3A4E', '1soft': '#D6E6FF',
          2: '#5B6B82', '2soft': '#EAF0FF',
          3: '#64748B', '3soft': '#EEF2F7',
          4: '#94A3B8', '4soft': '#F2F5F9',
        },
        chart: { 1: '#2C3A4E', 2: '#8FA8EA', 3: '#067647', 4: '#6E7CA8', 5: '#B54708', 6: '#4A93A8' },
      },

      fontFamily: {
        /* Display = Space Grotesk (headings only). Sans = Inter (all UI/body).
           Mono = IBM Plex Mono (technical labels). Korean falls back to
           Pretendard automatically because Space Grotesk is Latin-only. */
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'Pretendard', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        korean: ['Pretendard', 'Noto Sans KR', 'sans-serif'],
      },

      fontSize: {
        /* Brand Manual §4.2. Hero 56px desktop / 32px mobile; body 16–18px. */
        micro: ['12px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        caption: ['14px', { lineHeight: '1.4' }],
        secondary: ['14px', { lineHeight: '1.55' }],
        body: ['16px', { lineHeight: '1.55' }],
        'card-title': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        section: ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'page-title': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        kpi: ['32px', { lineHeight: '1.12', fontWeight: '600' }],
        'kpi-hero': ['44px', { lineHeight: '1.12', fontWeight: '700' }],
        /* Hero: 32px at 360px → 56px at ≥1280px, exactly per §4.2 */
        'web-h1': ['clamp(2rem, 1.05rem + 4.2vw, 3.5rem)', { lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '700' }],
        'web-h2': ['clamp(1.75rem, 1.3rem + 2vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '600' }],
        'web-h3': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'web-body': ['1rem', { lineHeight: '1.55' }],
        'web-lead': ['1.125rem', { lineHeight: '1.55' }],
        'web-question': ['clamp(1.25rem, 0.95rem + 1.3vw, 1.75rem)', { lineHeight: '1.3', fontWeight: '500' }],
      },

      boxShadow: {
        1: '0 18px 48px rgba(31,41,55,.08)',
        2: '0 24px 72px rgba(31,41,55,.12)',
        3: '0 28px 80px rgba(31,41,55,.16)',
        glass: '0 18px 48px rgba(31,41,55,.08)',
        /* The signature ring — holographic soft-blue, replaces the retired gold */
        signature: '0 0 0 1px rgba(143,168,234,.35), 0 2px 12px rgba(143,168,234,.18)',
      },

      /* Brand Manual §8.1 — buttons/inputs 14, cards 20, panels 28 */
      borderRadius: { sm: '10px', md: '14px', lg: '20px', panel: '28px', pill: '999px' },
      backdropBlur: { glass: '18px', 'glass-sm': '10px', 'glass-lg': '28px' },
      maxWidth: { container: '1120px', 'container-xl': '1280px', reading: '68ch' },

      /* §9.2 — 180ms component, 240ms rail expansion / state morph */
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      transitionDuration: { fast: '160ms', base: '180ms', rail: '240ms', slow: '320ms' },

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
