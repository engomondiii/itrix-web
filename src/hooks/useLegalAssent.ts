'use client';

import { useCallback, useEffect, useState } from 'react';
import { legalApi, type LegalInstrumentVersion } from '@/lib/api/legalApi';
import { LEGAL_INSTRUMENTS } from '@/lib/content/legalCopy';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * AFFIRMATIVE ASSENT, TAKEN ONCE (Architecture v2.7 §19.10, R44).
 *
 * ── WHERE IT IS TAKEN, AND WHERE IT IS NOT ──────────────────────────────────
 * At WORKSPACE CREATION, where the visitor is already choosing to create an account.
 * NOT at the first sentence: gating the composer behind a click-wrap would ask for a
 * commitment before anything has been given, which breaks the one rule the whole
 * surface is built on. Browsing and the first turn are governed by NOTICE — the pinned
 * legal strip and the confidentiality line.
 *
 * ── THE RECORD STORES VERSIONS, NOT A BOOLEAN ───────────────────────────────
 * `versions()` returns what this build RENDERED, and those are what get recorded. It
 * must always be answerable what a given customer actually agreed to, and a boolean
 * stops being able to answer that the first time the Terms change.
 *
 * ── AND IT WARNS WHEN THE TWO SIDES DISAGREE ────────────────────────────────
 * In development it compares the rendered versions against the backend's. A silent
 * mismatch is the quiet failure worth catching: if the backend has moved to Terms v1.1
 * and this build still shows v1.0, every assent recorded here is attached to a version
 * the visitor never read. It warns rather than adapting, because reconciling that is a
 * human decision.
 */

export interface UseLegalAssentResult {
  /** The versions on screen — recorded verbatim on accept. */
  versions: LegalInstrumentVersion[];
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
  /** Record it. Returns true only when the record actually landed. */
  record: (token?: string) => Promise<boolean>;
  recording: boolean;
  error: string | null;
}

export function useLegalAssent(): UseLegalAssentResult {
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
              'knowledge_docs/public/legal/ before taking assent (Architecture v2.7 §19.10).',
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

      /* Flag off: the gate is still honest — the visitor ticked a real box and cannot
         proceed without it — but there is no backend to record against yet, so nothing
         is POSTed and nothing is claimed to have been recorded. */
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
    [accepted, versions],
  );

  return { versions, accepted, setAccepted, record, recording, error };
}
