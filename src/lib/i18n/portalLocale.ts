'use client';
import { useLocaleStore } from '@/store/localeStore';
import { PORTAL_COPY, PORTAL_COPY_KO } from '@/lib/content/portalCopy';
export function usePortalCopy() {
  const locale = useLocaleStore((s) => s.locale);
  return locale === 'ko' ? PORTAL_COPY_KO : PORTAL_COPY;
}
