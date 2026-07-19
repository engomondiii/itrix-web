'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { EMPTY_RAILS } from '@/lib/api/railsApi';
import { renderableSections } from '@/lib/journey/railSections';
import type { RailsPayload } from '@/types/journey.types';

interface RailsContextValue {
  /** Exactly what the backend authorized. */
  rails: RailsPayload;
  /** The subset this build can actually draw — what the rails mount from. */
  left: string[];
  right: string[];
  loading: boolean;
  error: string | null;
}

const RailsContext = createContext<RailsContextValue | null>(null);

/**
 * Exposes the authorized rail sections to the shell.
 *
 * Two lists, deliberately: `rails` is the backend's answer, and `left`/`right`
 * are the subset this build has components for. Keeping them separate means a
 * section the backend authorizes but this release cannot draw yet is a missing
 * panel — not a crash, and not a placeholder that implies content exists.
 *
 * The provider is safe to mount anywhere. Outside it, `useRailsContext` returns
 * empty rails rather than throwing, because the public shell mounts on every
 * route and most routes have no journey token at all.
 */
export function RailsProvider({
  rails,
  loading = false,
  error = null,
  children,
}: {
  rails: RailsPayload;
  loading?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  const value = useMemo<RailsContextValue>(() => {
    const safe = rails ?? EMPTY_RAILS;
    return {
      rails: safe,
      left: renderableSections(safe.left),
      right: renderableSections(safe.right),
      loading,
      error,
    };
  }, [rails, loading, error]);

  return <RailsContext.Provider value={value}>{children}</RailsContext.Provider>;
}

const FALLBACK: RailsContextValue = {
  rails: EMPTY_RAILS,
  left: [],
  right: [],
  loading: false,
  error: null,
};

export function useRailsContext(): RailsContextValue {
  return useContext(RailsContext) ?? FALLBACK;
}
