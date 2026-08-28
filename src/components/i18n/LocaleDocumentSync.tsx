'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/store/localeStore';

/** Keeps document language metadata in sync with the persisted UI locale. */
export function LocaleDocumentSync() {
  const locale = useLocaleStore((s) => s.locale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);
  return null;
}
