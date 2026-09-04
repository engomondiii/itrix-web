'use client';

import { useLocaleStore } from '@/store/localeStore';
import { commonUi } from '@/lib/i18n/siteLocale';

/** Distinctive, accessible locale control. Flags are visual cues only; text and
 * aria labels carry the language identity. Locale persistence remains owned by
 * localeStore exactly as before. */
export function SiteLocaleToggle({ compact = false }: { compact?: boolean }) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const copy = commonUi(locale);
  return (
    <div className={compact ? 'locale-toggle locale-toggle--compact' : 'locale-toggle'} role="group" aria-label={copy.language}>
      <button
        type="button"
        data-active={locale === 'en' || undefined}
        aria-pressed={locale === 'en'}
        aria-label={locale === 'ko' ? '영어로 전환' : 'Switch to English'}
        onClick={() => setLocale('en')}
      >
        <span aria-hidden="true" className="locale-toggle__flag">🇺🇸</span>
        <span className="locale-toggle__label">{copy.english}</span>
      </button>
      <button
        type="button"
        data-active={locale === 'ko' || undefined}
        aria-pressed={locale === 'ko'}
        aria-label={locale === 'ko' ? '한국어 사용 중' : '한국어로 전환'}
        onClick={() => setLocale('ko')}
      >
        <span aria-hidden="true" className="locale-toggle__flag">🇰🇷</span>
        <span className="locale-toggle__label">{copy.korean}</span>
      </button>
    </div>
  );
}
