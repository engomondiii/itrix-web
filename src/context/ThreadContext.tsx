'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useThread } from '@/hooks/useThread';
import type { UseThreadResult } from '@/hooks/useThread';

/**
 * The active conversation, shared by the sidebar, the header and the column.
 *
 * It exists so the thread list is fetched ONCE per mount rather than once per
 * consumer, and so every part of the shell agrees on which conversation is open.
 * It holds no authority: the backend owns threads, and nothing here decides what
 * a thread may contain.
 *
 * Outside a provider it returns a safe empty result rather than throwing. The
 * shell mounts on every public route, and most of them have no conversation at
 * all — that is the normal case, not an error.
 */
const ThreadContext = createContext<UseThreadResult | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const thread = useThread();
  const value = useMemo(() => thread, [thread]);
  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>;
}

const FALLBACK: UseThreadResult = {
  threads: [],
  activeThreadId: null,
  select: () => {},
  startNew: () => {},
  rename: () => {},
  remove: () => {},
  refresh: () => {},
};

export function useThreadContext(): UseThreadResult {
  return useContext(ThreadContext) ?? FALLBACK;
}
