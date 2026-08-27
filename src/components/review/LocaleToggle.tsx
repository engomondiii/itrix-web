'use client';

import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

export function LocaleToggle() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const copy = reviewCopy(locale);
  return (
    <div className="locale-toggle" role="group" aria-label={copy.language}>
      <button type="button" data-active={locale === 'en' || undefined} onClick={() => setLocale('en')}>{copy.english}</button>
      <button type="button" data-active={locale === 'ko' || undefined} onClick={() => setLocale('ko')}>{copy.korean}</button>
    </div>
  );
}
