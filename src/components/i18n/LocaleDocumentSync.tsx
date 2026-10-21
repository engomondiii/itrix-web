'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useLocaleStore } from '@/store/localeStore';

/** Keeps document language metadata in sync with the persisted UI locale. */
export function LocaleDocumentSync() {
  const path = usePathname();
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    const publicPage = ['/', '/astop', '/poc', '/contact', '/privacy', '/terms', '/unsubscribe', '/maintenance'].includes(path) || path === '/en' || path.startsWith('/en/');
    const selected = publicPage ? (path.startsWith('/en') ? 'en' : 'ko') : locale;
    document.documentElement.lang = selected;
    document.documentElement.dataset.locale = selected;
  }, [locale, path]);
  return null;
}
