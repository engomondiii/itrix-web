'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { threadsApi } from '@/lib/api/threadsApi';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { Artifact, InlineCard } from '@/types/artifact.types';

/**
 * The artifacts and inline cards belonging to a thread.
 *
 * Both are APPENDED to the conversation and stay there — they are the visitor's
 * record (Architecture v2.6 §2.5, law 3). Neither is a page the visitor is sent
 * to, which is why `artifact.ready` triggers a fetch-and-append rather than a
 * navigation.
 *
 * Regeneration SUPERSEDES rather than overwrites: a higher `version` for the
 * same id replaces the entry, and the audit trail lives on the backend.
 *
 * The commitment gate is enforced on the payload by the backend serializer. A
 * card that has been suppressed simply is not in the response — this hook never
 * filters, softens or explains a suppression, because doing so would leak the
 * fact that something was withheld.
 */
export interface UseArtifactsResult {
  artifacts: Artifact[];
  cards: InlineCard[];
  refresh: () => void;
}

/**
 * State is KEYED BY THREAD rather than reset when the thread changes.
 *
 * Holding the owning thread alongside the data means switching conversations
 * needs no clearing effect: the previous thread's artifacts are simply not
 * returned, because the key does not match. Writing empty arrays in an effect
 * just to read them back on the next render is a cascading render for no gain —
 * and, worse, it briefly shows an empty thread that then repopulates.
 */
interface ArtifactState {
  threadId: string | null;
  artifacts: Artifact[];
  cards: InlineCard[];
}

const EMPTY: ArtifactState = { threadId: null, artifacts: [], cards: [] };

export function useArtifacts(threadId: string | null): UseArtifactsResult {
  const [state, setState] = useState<ArtifactState>(EMPTY);

  const refresh = useCallback(() => {
    if (!threadId) return;
    void (async () => {
      const { data } = await threadsApi.get(threadId);
      if (!data) return;
      const payload = data as unknown as { artifacts?: Artifact[]; cards?: InlineCard[] };
      setState({
        threadId,
        artifacts: payload.artifacts ?? [],
        cards: payload.cards ?? [],
      });
    })();
  }, [threadId]);

  useEffect(() => {
    /* Every write happens in a promise callback inside refresh(), never
       synchronously in this effect body. */
    refresh();
  }, [refresh]);

  useSocket({
    url: threadId ? wsUrls.review(threadId) : null,
    enabled: siteConfig.featureFlags.realtime && Boolean(threadId),
    handlers: {
      'artifact.ready': (p) => {
        /* The event carries only a reference. Fetching it means the server
           re-authorizes the read — the socket never delivers content that
           bypassed the disclosure check. */
        trackEvent('artifact.delivered', { type: p.type });
        refresh();
      },
    },
  });

  /* Derived: data from a previous thread is never returned for a new one. */
  const current = state.threadId === threadId ? state : EMPTY;
  return { artifacts: current.artifacts, cards: current.cards, refresh };
}
