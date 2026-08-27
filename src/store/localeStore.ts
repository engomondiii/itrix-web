'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLocale = 'en' | 'ko';

interface LocaleState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => {
        if (typeof document !== 'undefined') document.documentElement.lang = locale;
        set({ locale });
      },
    }),
    {
      name: 'itrix-locale',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') document.documentElement.lang = state.locale;
      },
    },
  ),
);
