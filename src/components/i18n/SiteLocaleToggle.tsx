'use client';

import { useLocaleStore } from '@/store/localeStore';
import { commonUi } from '@/lib/i18n/siteLocale';

export function SiteLocaleToggle({ compact = false }: { compact?: boolean }) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const copy = commonUi(locale);
  return (
    <div className={compact ? 'locale-toggle locale-toggle--compact' : 'locale-toggle'} role="group" aria-label={copy.language}>
      <button type="button" data-active={locale === 'en' || undefined} aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>{copy.english}</button>
      <button type="button" data-active={locale === 'ko' || undefined} aria-pressed={locale === 'ko'} onClick={() => setLocale('ko')}>{copy.korean}</button>
    </div>
  );
}
