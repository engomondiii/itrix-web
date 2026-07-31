'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { routes } from '@/constants/routes';
import { siteConfig } from '@/config/site.config';

/**
 * SURFACE THE CLIENT-PAGE REVEAL AS A "VIEW YOUR PAGE" AFFORDANCE.
 *
 * When the conversation reaches the point where the backend mints the personalised
 * client page, it broadcasts `journey.reveal` (surface `client_page`, carrying the
 * capability token) to the THREAD's socket group — the group the anonymous visitor is
 * subscribed to. This hook listens for that event and exposes the token so the
 * conversation can show a "View your page" button. It does NOT navigate on its own —
 * the visitor decides when to open the page.
 *
 * WHY IT DOES NOT AUTO-NAVIGATE
 * Jumping the visitor out of the conversation the instant the event lands is jarring
 * and takes the choice away from them. A button lets them finish reading the reply and
 * open the page when ready. (It also keeps this hook well clear of the transcript's
 * "never navigate on a turn" invariant — `useComposer`;
 * tests/e2e/no-navigation-on-submit.spec.ts — because navigation now happens only from
 * an explicit button click.)
 *
 * SAFETY
 *   · Captures the token at most once (state is only set when empty), so a duplicate or
 *     replayed reveal cannot flip it.
 *   · Only acts on the `client_page` surface with a non-empty token; any other reveal
 *     is ignored here (other surfaces have their own handling).
 *   · Reads the token defensively (camelCase or snake_case) so it does not depend on
 *     wire-casing details of this one event.
 *   · No-op when realtime is disabled or there is no thread yet.
 *
 * The link appended to the reply remains as the transport-independent fallback: if
 * realtime is off, or the event is missed, the visitor still has the link in the reply.
 */
export interface UseClientPageRevealResult {
  /** The client-page token once the reveal has been seen; null until then. */
  token: string | null;
  /** True once a client-page reveal has arrived for this thread. */
  ready: boolean;
  /** Navigate to the personalised page. No-op until a token has been seen. */
  open: () => void;
}

function readToken(reveal: unknown): string {
  if (!reveal || typeof reveal !== 'object') return '';
  const r = reveal as Record<string, unknown>;
  const camel = typeof r.capabilityToken === 'string' ? r.capabilityToken : '';
  const snake = typeof r.capability_token === 'string' ? r.capability_token : '';
  return camel || snake;
}

function readSurface(payload: Record<string, unknown>): string {
  const reveal = payload.reveal as Record<string, unknown> | undefined;
  const fromReveal = reveal && typeof reveal.surface === 'string' ? reveal.surface : '';
  const fromTop = typeof payload.surface === 'string' ? (payload.surface as string) : '';
  const fromAuthorized =
    typeof payload.authorizedSurface === 'string' ? (payload.authorizedSurface as string) : '';
  return fromReveal || fromTop || fromAuthorized;
}

export function useClientPageReveal(threadId: string | null): UseClientPageRevealResult {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const enabled = siteConfig.featureFlags.realtime && Boolean(threadId);

  useSocket({
    url: threadId ? wsUrls.review(threadId) : null,
    enabled,
    handlers: {
      'journey.reveal': (p) => {
        // Read defensively via `unknown` — the event is typed, but we also tolerate
        // wire-casing (snake vs camel) for the token without depending on it.
        const payload = p as unknown as Record<string, unknown>;
        if (readSurface(payload) !== 'client_page') return;

        const seen = readToken(payload.reveal) || readToken(payload);
        if (!seen) return;

        // Capture once — the first client-page reveal for this thread wins.
        setToken((prev) => prev ?? seen);
      },
    },
  });

  const open = useCallback(() => {
    if (token) router.push(routes.clientPage(token));
  }, [router, token]);

  return { token, ready: token !== null, open };
}
