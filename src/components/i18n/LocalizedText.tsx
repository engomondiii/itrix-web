'use client';

import type { ReactNode } from 'react';
import { useLocaleStore } from '@/store/localeStore';

/** Small client boundary that lets server pages retain static metadata and English fallback. */
export function LocalizedText({ en, ko }: { en: ReactNode; ko: ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);
  return <>{locale === 'ko' ? ko : en}</>;
}
