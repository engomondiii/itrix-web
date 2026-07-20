'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useShell, normalizeShellContract } from '@/hooks/useShell';
import type { UseShellResult } from '@/hooks/useShell';
import { useThreadContext } from '@/context/ThreadContext';

/**
 * The shell contract — what the backend authorizes this surface to render.
 *
 * REPLACES RailsContext. There is no `left`/`right` here and no rails payload:
 * the right value rail is retired and the left rail became navigation
 * (Architecture v2.6 §11.6).
 *
 * The provider keys off the active thread, because the contract is per-subject
 * and the subject is identified by the conversation they are in. Splitting the
 * two is how a UI ends up showing State 4's sidebar beside a State 2 thread.
 *
 * Outside the provider the fallback is the MOST RESTRICTIVE contract there is:
 * anonymous, public ceiling, base sections only, no owner, no quick help. The
 * failure mode is always "the visitor sees less than they were entitled to".
 */
const ShellContext = createContext<UseShellResult | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const { activeThreadId } = useThreadContext();
  const shell = useShell(activeThreadId);
  const value = useMemo(() => shell, [shell]);
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

const FALLBACK: UseShellResult = {
  ...normalizeShellContract(null, null),
  loading: false,
  error: null,
  refresh: () => {},
};

export function useShellContext(): UseShellResult {
  return useContext(ShellContext) ?? FALLBACK;
}
