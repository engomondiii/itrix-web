'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { routes } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

/**
 * Receives only the short-lived, browser-bound ONE-TIME exchange code from a reveal.
 * The code is never placed in a URL and is never persisted. An explicit click exchanges
 * it through the Next.js BFF; only the resulting httpOnly cookie can open `/c`.
 */
export interface UseClientPageRevealResult {
  ready: boolean;
  opening: boolean;
  error: string | null;
  open: () => Promise<void>;
}

function readAccessCode(reveal: unknown): string {
  if (!reveal || typeof reveal !== 'object') return '';
  const r = reveal as Record<string, unknown>;
  for (const key of ['accessCode', 'access_code']) {
    const value = r[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function readSurface(payload: Record<string, unknown>): string {
  const reveal = payload.reveal as Record<string, unknown> | undefined;
  return (
    (reveal && typeof reveal.surface === 'string' ? reveal.surface : '') ||
    (typeof payload.surface === 'string' ? payload.surface : '') ||
    (typeof payload.authorizedSurface === 'string' ? payload.authorizedSurface : '')
  );
}

export function useClientPageReveal(threadId: string | null): UseClientPageRevealResult {
  const router = useRouter();
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enabled = siteConfig.featureFlags.realtime && Boolean(threadId);

  useSocket({
    url: threadId ? wsUrls.review(threadId) : null,
    enabled,
    handlers: {
      'journey.reveal': (p) => {
        const payload = p as unknown as Record<string, unknown>;
        if (readSurface(payload) !== 'client_page') return;
        const seen = readAccessCode(payload.reveal) || readAccessCode(payload);
        if (seen) setAccessCode((prev) => prev ?? seen);
      },
    },
  });

  const open = useCallback(async () => {
    if (!accessCode || opening) return;
    setOpening(true);
    setError(null);
    try {
      const res = await fetch('/api/client-page/access/exchange', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });
      if (!res.ok) {
        setError(copy.accessExpired);
        return;
      }
      setAccessCode(null);
      router.push(routes.clientPage);
    } catch {
      setError(copy.accessOpenError);
    } finally {
      setOpening(false);
    }
  }, [accessCode, opening, router, copy.accessExpired, copy.accessOpenError]);

  return { ready: accessCode !== null, opening, error, open };
}
