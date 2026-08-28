'use client';
import { useLocaleStore } from '@/store/localeStore';
import { AUTH_COPY, AUTH_COPY_KO, KEEP_WORK_COPY, KEEP_WORK_COPY_KO } from '@/lib/content/authCopy';

export function useAuthCopy() {
  const locale = useLocaleStore((s) => s.locale);
  return locale === 'ko' ? AUTH_COPY_KO : AUTH_COPY;
}
export function useKeepWorkCopy() {
  const locale = useLocaleStore((s) => s.locale);
  return locale === 'ko' ? KEEP_WORK_COPY_KO : KEEP_WORK_COPY;
}
