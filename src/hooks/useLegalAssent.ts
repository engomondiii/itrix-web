'use client';

import { useCallback, useEffect, useState } from 'react';
import { legalApi, type LegalInstrumentVersion } from '@/lib/api/legalApi';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * AFFIRMATIVE ASSENT, TAKEN ONCE (Architecture v2.9 §19.10, R44, R62).
 *
 * ── WHERE IT IS TAKEN, AND WHERE IT IS NOT ──────────────────────────────────
 * On EVERY path that creates a Client — self-serve registration, an invitation code, and
 * the emailed capability link. NOT at the first sentence: gating the composer behind a
 * click-wrap would ask for a commitment before anything has been given, which breaks the
 * one rule the whole surface is built on. Browsing and the first turn are governed by
 * NOTICE — the pinned legal strip and the confidentiality line.
 *
 * Opening registration to everyone does not move that line. It puts the same gate on a
 * wider door.
 *
 * ── TWO TRANSPORTS, AND ONLY ONE OF THEM POSTS (v8.0) ───────────────────────
 *
 *   transport: 'in_payload'   the versions are handed to the caller, which sends them WITH
 *                             the credentials. The backend writes the record inside the
 *                             transaction that creates the Client. `record()` is a
 *                             satisfied no-op.
 *   transport: 'server'       the default, and now used for exactly one case: the
 *                             RE-PROMPT after a material version change, where the Client
 *                             already exists and is authenticated.
 *
 * The split is not a refactor for tidiness. `/api/legal/assent` proxies to
 * `portal/legal/assent/`, which authenticates on the CLIENT plane — so on a registration
 * there is neither a client-JWT nor a Client for a record to attach to, and the POST
 * cannot succeed. On the invite path it COULD succeed, and that was worse: `claim_invite()`
 * has written the record in-transaction since Backend v7.1 Phase 3, so the page's separate
 * POST produced a SECOND record for one act of consent.
 *
 * ── THE RECORD STORES VERSIONS, NOT A BOOLEAN ───────────────────────────────
 * `versions` is what this build RENDERED, and those are what get sent. It must always be
 * answerable what a given customer actually agreed to, and a boolean stops being able to
 * answer that the first time the Terms change.
 *
 * ── AND IT WARNS WHEN THE TWO SIDES DISAGREE ────────────────────────────────
 * In development it compares the rendered versions against the backend's. A silent
 * mismatch is the quiet failure worth catching: if the backend has moved to Terms v1.2 and
 * this build still shows v1.1, every assent recorded here is attached to a version the
 * visitor never read. It warns rather than adapting, because reconciling that is a human
 * decision.
 */

export type AssentTransport = 'server' | 'in_payload';

export interface UseLegalAssentResult {
  /** The versions on screen — sent verbatim on accept. */
  versions: LegalInstrumentVersion[];
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
  /**
   * Record it.
   *
   * With `transport: 'in_payload'` this does NOT post: it confirms the gate was satisfied
   * and returns true, and the caller is responsible for sending `versions` with whatever
   * request creates the account.
   */
  record: (token?: string) => Promise<boolean>;
  recording: boolean;
  error: string | null;
  transport: AssentTransport;
}

export function useLegalAssent(options?: { transport?: AssentTransport }): UseLegalAssentResult {
  const transport: AssentTransport = options?.transport ?? 'server';
  const [accepted, setAccepted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const versions: LegalInstrumentVersion[] = LEGAL_INSTRUMENTS.map((i) => ({
    slug: i.slug,
    version: i.version,
    effective: i.effective,
  }));

  /* Development-only reconciliation. Never adapts what is displayed. */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    let cancelled = false;
    void (async () => {
      const { data } = await legalApi.instruments();
      if (cancelled || !data || data.instruments.length === 0) return;
      for (const theirs of data.instruments) {
        const ours = versions.find((v) => v.slug === theirs.slug);
        if (ours && theirs.version && ours.version !== theirs.version) {
          console.warn(
            `[legal] "${theirs.slug}" is v${theirs.version} on the backend but this build ` +
              `renders v${ours.version}. Any assent recorded now would be attached to a ` +
              'version the visitor did not read. Reconcile lib/content/legalCopy.ts with ' +
              'knowledge_docs/public/legal/ before taking assent (Architecture v2.9 §19.10).',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    /* The rendered versions are compile-time constants; comparing on every render would
       re-fetch forever. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const record = useCallback(
    async (token?: string): Promise<boolean> => {
      if (!accepted) {
        setError('Please accept the Terms and the Privacy Policy to continue.');
        return false;
      }

      /* The account-creating paths. The gate is real — the visitor ticked a real box and
         cannot proceed without it — and the RECORD is written by the transaction that
         creates the Client. Nothing is posted here, and nothing is claimed to have been
         posted. */
      if (transport === 'in_payload') {
        trackEvent('assent.recorded', { transport: 'in_payload', instruments: versions.length });
        return true;
      }

      /* Flag off: the gate is still honest but there is no backend to record against yet,
         so nothing is POSTed and nothing is claimed to have been recorded. */
      if (!siteConfig.featureFlags.legalAssent) {
        trackEvent('assent.recorded', { transport: 'local_only', instruments: versions.length });
        return true;
      }

      setRecording(true);
      setError(null);
      const { data, error: err } = await legalApi.record({
        token,
        instruments: versions,
        acceptedAt: new Date().toISOString(),
      });
      setRecording(false);

      if (!data?.recorded) {
        /* Visible, not swallowed. An account created without a recorded assent is the
           state §19.10 exists to prevent. */
        setError(err ?? 'We could not record that just now. Please try again.');
        return false;
      }

      trackEvent('assent.recorded', { transport: 'server', instruments: versions.length });
      return true;
    },
    [accepted, transport, versions],
  );

  return { versions, accepted, setAccepted, record, recording, error, transport };
}
