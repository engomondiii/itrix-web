'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalStore } from '@/store/portalStore';
import { portalApi } from '@/lib/api/portalApi';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { navigateAfterAuth } from '@/lib/navigation/afterAuth';
import type { ClientIdentity } from '@/types/portal.types';

interface PortalAuthValue {
  client: ClientIdentity | null;
  loading: boolean;
  error: string | null;
  /**
   * v7.0 Phase 4. Seconds to wait when the backend rate-limited the attempt (R55).
   *
   * Exposed here rather than discovered by a second fetch, so there stays exactly ONE
   * credential path. A form that silently stops working teaches people to retry harder,
   * which is the traffic the limit exists to stop.
   */
  retryAfterSeconds: number | null;
  signIn: (email: string, password: string, next?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthValue | null>(null);

/**
 * Client identity + client-JWT lifecycle for the (portal) route group only.
 *
 * The token itself is never held here — it lives in an httpOnly cookie the server
 * manages. This context resolves the *profile* (GET /api/portal/auth/me) and exposes
 * sign-in / sign-out. It's mounted by the portal layout, so public pages never carry
 * client identity.
 */
export function PortalAuthProvider({
  children,
  initialClient = null,
}: {
  children: ReactNode;
  initialClient?: ClientIdentity | null;
}) {
  const router = useRouter();
  const client = usePortalStore((s) => s.client);
  const setClient = usePortalStore((s) => s.setClient);
  const reset = usePortalStore((s) => s.reset);
  const [loading, setLoading] = useState<boolean>(initialClient === null);
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfter] = useState<number | null>(null);

  useEffect(() => {
    if (initialClient) setClient(initialClient);
  }, [initialClient, setClient]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await portalApi.me();
    if (data) setClient(data);
    else setClient(null);
    setLoading(false);
  }, [setClient]);

  useEffect(() => {
    if (!initialClient) void refresh();
  }, [initialClient, refresh]);

  const signIn = useCallback(
    async (email: string, password: string, next?: string) => {
      setError(null);
      setRetryAfter(null);
      setLoading(true);
      const { data, error: err } = await portalApi.login(email, password);
      setLoading(false);

      /* A rate limit is a fact about the request, not about the account, so it is the one
         failure the surface may report specifically. The proxy carries the wait in its
         detail string. */
      const wait = err ? /(\d+)/.exec(err.includes('429') || /too many/i.test(err) ? err : '')?.[1] : null;
      if (wait) setRetryAfter(Number.parseInt(wait, 10));

      if (data?.client) {
        setClient(data.client);
        trackEvent('portal.signed_in', { clientId: data.client.id });
        /* HARD navigation, not router.push(). The cookie this login just created is
           httpOnly and therefore invisible to Next's client router cache, which may still
           hold the pre-login entry for /workspace -- the middleware redirect back to
           /sign-in. A soft push replays it and lands the visitor on sign-in holding a
           valid session. See lib/navigation/afterAuth.ts. */
        navigateAfterAuth(next);
        return true;
      }
      /* ONE message for a wrong password and for an address we have never seen (R54).
         `useSignIn` renders the approved copy; this string is the fallback for any caller
         that reads `error` directly, and it is deliberately just as generic. */
      setError('Those details did not match. Please check your email and password.');
      return false;
    },
    [setClient],
  );

  const signOut = useCallback(async () => {
    await portalApi.logout();
    reset();
    trackEvent('portal.signed_out', {});
    router.push(routes.portalSignIn);
  }, [reset, router]);

  return (
    <PortalAuthContext.Provider
      value={{ client, loading, error, retryAfterSeconds, signIn, signOut, refresh }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuthContext(): PortalAuthValue {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error('usePortalAuthContext must be used within a PortalAuthProvider');
  return ctx;
}
