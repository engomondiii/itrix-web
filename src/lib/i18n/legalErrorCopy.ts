'use client';

import { useLocaleStore } from '@/store/localeStore';

export const LEGAL_ERROR_COPY = {
  en: {
    termsChanged:
      'The legal terms changed while you were reviewing them. Please review the latest version before continuing.',
    refreshFailed:
      'The legal terms changed, but we could not load the latest version just now. Please try again before continuing.',
  },
  ko: {
    termsChanged:
      '검토하시는 동안 법적 약관이 변경되었습니다. 계속하기 전에 최신 버전을 다시 확인해 주세요.',
    refreshFailed:
      '법적 약관이 변경되었지만 지금은 최신 버전을 불러올 수 없습니다. 계속하기 전에 다시 시도해 주세요.',
  },
} as const;

export function useLegalErrorCopy() {
  const locale = useLocaleStore((state) => state.locale);
  return locale === 'ko' ? LEGAL_ERROR_COPY.ko : LEGAL_ERROR_COPY.en;
}
