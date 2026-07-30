'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { shellApi } from '@/lib/api/shellApi';
import { railSectionsFromContract } from '@/lib/journey/railSections';
import { shellModeFromContract } from '@/lib/journey/shellModes';
import { composerLabelForState, stateLabelFor, HEADER_COPY } from '@/lib/content/composerCopy';
import type { ShellContract, ShellContractPayload } from '@/types/shell.types';

/**
 * Subscribe to the shell contract — what the backend authorizes this surface to
 * render.
 *
 * v6.0 CHANGES. The contract now carries `shellMode` and splits the zone
 * vocabulary into `conversationRailSections` and `contentPaneSections`
 * (Architecture v2.7 §11.6). `sidebarSections` is read only as a one-release
 * fallback for a backend that has not migrated.
 *
 * Two things this hook will not do, both deliberate:
 *
 *   · It never DERIVES authorization. The rail order comes from the backend; the
 *     only thing added locally is the three rail sections, which are orientation
 *     rather than entitlement — a visitor with no relationship still needs a way
 *     to start a conversation. A visitor cannot reach a section by editing a URL,
 *     because nothing here computes entitlement from anything they control.
 *
 *   · It never fails open. When the contract cannot be fetched, `shellMode` stays
 *     null and the rail falls back to the three sections — the most restrictive
 *     shell there is. If the backend is down or the vocabularies drift, the
 *     visitor sees LESS than they were entitled to, never more.
 *
 * Surface 1 v6.0 §3.1 · Backend v7.0 §4.1
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
    /* NULL, not 'arrival'. A guessed mode is worse than an absent one: the caller
       has a local threshold it can fall back to, and it should know it is using
       it (Surface 1 v6.0 §3.1). */
    shellMode: shellModeFromContract(payload?.shellMode),
    journeyState,
    stateKey: payload?.stateKey ?? 'arrival',
    identityState: payload?.identityState ?? 'anonymous',
    disclosureCeiling: payload?.disclosureCeiling ?? 'public',
    valueDelivered: Boolean(payload?.valueDelivered),
    composerLabel: payload?.composerLabel ?? composerLabelForState(journeyState),
    questionLoopOpen: Boolean(payload?.questionLoopOpen),
    /* DEFAULT ON. The composer offers the attach control unless the backend
       explicitly withholds it — the visitor should be able to hand us a document
       from the first screen. Uploading is still authorized server-side, and a
       refusal surfaces as a specific, recoverable message rather than a control
       that was never there. Only an explicit `false` hides it. */
    attachmentsEnabled: payload?.attachmentsEnabled !== false,
    conversationRailSections: railSectionsFromContract(
      payload?.conversationRailSections,
      payload?.sidebarSections,
    ),
    contentPaneSections: Array.isArray(payload?.contentPaneSections)
      ? payload.contentPaneSections.filter((s) => typeof s === 'string')
      : [],
    contentPaneDefaultArtifactId: payload?.contentPaneDefaultArtifactId ?? null,
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
      /* Keep the last good contract rather than collapsing the rail mid-use. If
         there was never one, `normalizeShellContract` already resolves to the
         three rail sections, so the fallback is restrictive either way. */
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
