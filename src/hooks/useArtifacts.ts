'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { threadsApi } from '@/lib/api/threadsApi';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useContentPaneStore } from '@/store/contentPaneStore';
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
  /* Written directly rather than through useContentPane, which CALLS THIS HOOK — a
     mutual import would be a cycle. The store is the shared surface between them,
     which is what stores are for. */
  const setActiveArtifact = useContentPaneStore((s) => s.setActiveArtifact);

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

        /* v6.0 PHASE 2: make it the pane's focused artifact so a visitor who has the
           pane open reads the new brief rather than the previous one.
           WHAT THIS DELIBERATELY DOES NOT DO is open anything. It sets which artifact
           is focused; it does not un-collapse the pane and it does not open the
           mobile sheet. A reveal must never force a panel open on a narrow breakpoint
           (Architecture v2.7 §11.5) — the reference card in the transcript is what
           makes the artifact reachable there, and it is appended regardless (R35). */
        if (threadId && p.artifactId) setActiveArtifact(threadId, p.artifactId);
      },
    },
  });

  /* Derived: data from a previous thread is never returned for a new one. */
  const current = state.threadId === threadId ? state : EMPTY;
  return { artifacts: current.artifacts, cards: current.cards, refresh };
}
