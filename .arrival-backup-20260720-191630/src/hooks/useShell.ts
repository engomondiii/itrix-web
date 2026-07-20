'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { shellApi } from '@/lib/api/shellApi';
import { sectionsFromContract } from '@/lib/journey/sidebarSections';
import { composerLabelForState, stateLabelFor, HEADER_COPY } from '@/lib/content/composerCopy';
import type { ShellContract, ShellContractPayload } from '@/types/shell.types';

/**
 * Subscribe to the shell contract — what the backend authorizes this surface to
 * render.
 *
 * REPLACES useRails. There is no `left`/`right` any more: the right value rail is
 * retired and the left rail became navigation, so the contract now names sidebar
 * sections, the conversation header and the composer label
 * (Architecture v2.6 §11.6, §11.7).
 *
 * Two things this hook will not do, both deliberate:
 *
 *   · It never DERIVES authorization. `sidebarSections` comes from the backend
 *     verbatim; the only thing added locally is the five BASE sections, which
 *     are orientation and policy access rather than entitlements. A visitor
 *     cannot reach a section by editing a URL, because nothing here computes
 *     entitlement from anything the visitor controls.
 *
 *   · It never fails open. When the contract cannot be fetched it falls back to
 *     the base sections only — the most restrictive sidebar there is. If the
 *     backend is down or the vocabularies drift, the visitor sees LESS than they
 *     were entitled to, never more.
 *
 * Surface 1 v5.0 §3.2 · Backend v6.0 §3.1
 */

const POLL_MS = 20000;

export interface UseShellResult extends ShellContract {
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Build a complete contract from a partial payload, filling only safe defaults. */
export function normalizeShellContract(
  payload: ShellContractPayload | null,
  threadId: string | null,
): ShellContract {
  const journeyState = payload?.journeyState ?? null;

  return {
    threadId: payload?.threadId ?? threadId,
    journeyState,
    stateKey: payload?.stateKey ?? 'arrival',
    identityState: payload?.identityState ?? 'anonymous',
    disclosureCeiling: payload?.disclosureCeiling ?? 'public',
    valueDelivered: Boolean(payload?.valueDelivered),
    composerLabel: payload?.composerLabel ?? composerLabelForState(journeyState),
    questionLoopOpen: Boolean(payload?.questionLoopOpen),
    attachmentsEnabled: Boolean(payload?.attachmentsEnabled),
    sidebarSections: sectionsFromContract(payload?.sidebarSections, journeyState),
    conversationHeader:
      payload?.conversationHeader ??
      (threadId
        ? {
            title: HEADER_COPY.untitled,
            stateLabel: stateLabelFor(journeyState),
            humanOwner: null,
            supportSla: null,
            /* No named owner yet means no one to reach, so quick help stays off
               until identification. R30 begins at identification, not before. */
            quickHelp: false,
          }
        : null),
  };
}

export function useShell(threadId: string | null): UseShellResult {
  const [payload, setPayload] = useState<ShellContractPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  /* Which thread the current payload describes. Loading is DERIVED from this
     rather than held as effect state: writing a boolean in the effect body just
     to read it back on the next render is a cascading render for no gain. */
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(undefined);

  const fetchOnce = useCallback(async () => {
    const { data, error: err } = await shellApi.get(threadId);
    if (data) {
      setPayload(data);
      setError(null);
    } else if (err) {
      /* Keep the last good contract rather than collapsing the sidebar mid-use.
         If there was never one, `normalizeShellContract` already resolves to the
         base sections, so the fallback is restrictive either way. */
      setError(err);
    }
    setLoadedFor(threadId);
  }, [threadId]);

  const refresh = useCallback(() => void fetchOnce(), [fetchOnce]);

  useEffect(() => {
    let cancelled = false;

    /* An async fetch that resolves into setState is the canonical legitimate
       effect: every write happens in a promise callback, never synchronously in
       the effect body. The rule cannot see across the promise boundary, so it is
       suppressed here exactly as useJourney.ts already does for the same case. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchOnce();

    const timer = setInterval(() => {
      if (!cancelled) void fetchOnce();
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [fetchOnce]);

  const contract = useMemo(
    () => normalizeShellContract(payload, threadId),
    [payload, threadId],
  );

  /* Derived: we are loading whenever the payload we hold does not yet describe
     the thread we were asked about. */
  return { ...contract, loading: loadedFor !== threadId, error, refresh };
}
