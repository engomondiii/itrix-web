'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalStore } from '@/store/portalStore';
import { portalApi } from '@/lib/api/portalApi';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { ClientIdentity } from '@/types/portal.types';

interface PortalAuthValue {
  client: ClientIdentity | null;
  loading: boolean;
  error: string | null;
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
      setLoading(true);
      const { data } = await portalApi.login(email, password);
      setLoading(false);
      if (data?.client) {
        setClient(data.client);
        trackEvent('portal.signed_in', { clientId: data.client.id });
        router.push(next && next.startsWith('/workspace') ? next : routes.workspaceOverview);
        return true;
      }
      setError('Those credentials did not match.');
      return false;
    },
    [router, setClient],
  );

  const signOut = useCallback(async () => {
    await portalApi.logout();
    reset();
    trackEvent('portal.signed_out', {});
    router.push(routes.portalSignIn);
  }, [reset, router]);

  return (
    <PortalAuthContext.Provider value={{ client, loading, error, signIn, signOut, refresh }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuthContext(): PortalAuthValue {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error('usePortalAuthContext must be used within a PortalAuthProvider');
  return ctx;
}
