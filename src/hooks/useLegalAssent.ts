'use client';

import { useCallback, useEffect, useState } from 'react';
import { legalApi, type LegalInstrumentVersion } from '@/lib/api/legalApi';
import { LEGAL_INSTRUMENTS, LEGAL_PUBLISHED } from '@/lib/content/legalCopy';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics/trackEvent';

export type AssentTransport = 'server' | 'in_payload';

export interface UseLegalAssentResult {
  /** The versions currently displayed beside the assent gate. */
  versions: LegalInstrumentVersion[];
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
  /** Refetch authoritative publication metadata and reset assent. */
  refreshVersions: () => Promise<boolean>;
  record: (token?: string) => Promise<boolean>;
  recording: boolean;
  error: string | null;
  transport: AssentTransport;
}

const RENDERED_VERSIONS: LegalInstrumentVersion[] = LEGAL_INSTRUMENTS.map((i) => ({
  slug: i.slug,
  version: i.version,
  effective: i.effective,
}));

export function useLegalAssent(options?: { transport?: AssentTransport }): UseLegalAssentResult {
  const transport: AssentTransport = options?.transport ?? 'server';
  const [versions, setVersions] = useState<LegalInstrumentVersion[]>(RENDERED_VERSIONS);
  const [accepted, setAccepted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshVersions = useCallback(async (): Promise<boolean> => {
    // The caller uses this only after the server reports LEGAL_TERMS_CHANGED. The stale
    // checkbox is invalid immediately, even if the refresh itself cannot complete.
    setAccepted(false);
    setError(null);
    const { data, error: err } = await legalApi.instruments();
    if (!data?.instruments?.length) {
      setError(err ?? 'The latest legal instrument metadata is unavailable.');
      return false;
    }
    setVersions(data.instruments);
    return true;
  }, []);

  /* Development-only reconciliation. Never silently adapts before a server race tells us
     the rendered versions are stale; that would make the recorded version differ from what
     the visitor originally saw. */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    let cancelled = false;
    void (async () => {
      const { data } = await legalApi.instruments();
      if (cancelled || !data || data.instruments.length === 0) return;
      for (const theirs of data.instruments) {
        const ours = RENDERED_VERSIONS.find((v) => v.slug === theirs.slug);
        if (ours && theirs.version && ours.version !== theirs.version) {
          console.warn(
            `[legal] "${theirs.slug}" is v${theirs.version} on the backend but this build ` +
              `renders v${ours.version}. Reconcile the published legal content before taking assent.`,
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const record = useCallback(
    async (token?: string): Promise<boolean> => {
      if (!accepted) {
        setError(
          LEGAL_PUBLISHED
            ? 'Please accept the Terms and the Privacy Policy to continue.'
            : 'The current legal instruments are not published, so assent is temporarily unavailable.',
        );
        return false;
      }

      if (transport === 'in_payload') {
        trackEvent('assent.recorded', { transport: 'in_payload', instruments: versions.length });
        return true;
      }

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
        setError(err ?? 'We could not record that just now. Please try again.');
        return false;
      }

      trackEvent('assent.recorded', { transport: 'server', instruments: versions.length });
      return true;
    },
    [accepted, transport, versions],
  );

  return {
    versions,
    accepted,
    setAccepted,
    refreshVersions,
    record,
    recording,
    error,
    transport,
  };
}
