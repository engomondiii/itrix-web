'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { artifactsApi } from '@/lib/api/artifactsApi';
import { ArtifactBlock } from './ArtifactBlock';
import { Composer } from '@/components/composer/Composer';
import type { Artifact } from '@/types/artifact.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * The deep-link view of one artifact.
 *
 * THE WAY BACK IS NOT OPTIONAL. A deep link that leaves someone stranded turns
 * the artifact into the real interface while the conversation decays behind it —
 * which is exactly the risk the architecture flags. So the return affordance
 * renders before the content, not after it.
 *
 * When the fetch fails there is no error page: the visitor is offered their
 * conversation instead. An artifact they may no longer be authorized to see
 * should not announce itself as forbidden.
 *
 * ── v6.0 PHASE 2: THE COMPOSER TRAVELS WITH IT ──────────────────────────────
 * Surface 1 v6.0 §05 asks for this page to render with the composer beneath, and the
 * reason is the same one that governs the whole surface: a visitor reading a brief
 * usually wants to react to a specific part of it, and the alternative is that they
 * go back, scroll to find where they were, and then type. One composer, present
 * wherever a visitor might have something to say.
 *
 * It is the SAME component at the same state, so the confidentiality notice, the
 * attach control and the Ask-itriX contract all come with it — nothing about this
 * page is a special case.
 */
export function ArtifactDeepLink({ artifactId }: { artifactId: string }) {
  const copy = useCommonCopy();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data } = await artifactsApi.get(artifactId);
      if (cancelled) return;
      setArtifact(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [artifactId]);

  const backHref = artifact ? `/review/${artifact.threadId}` : '/';

  return (
    <div className="artifact-page">
      <Link href={backHref} className="artifact-page__back">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        {copy.backConversation}
      </Link>

      {loading ? (
        <p className="artifact-page__status" role="status">
          {copy.opening}
        </p>
      ) : artifact ? (
        <ArtifactBlock artifact={artifact} defaultOpen />
      ) : (
        <p className="artifact-page__status">
          {copy.artifactOpenError}
        </p>
      )}

      {/* Only once something is on screen. A composer under a spinner invites a reply
          to an artifact the visitor has not read yet. */}
      {artifact ? (
        <div className="artifact-page__composer">
          <Composer variant="docked" />
        </div>
      ) : null}
    </div>
  );
}
