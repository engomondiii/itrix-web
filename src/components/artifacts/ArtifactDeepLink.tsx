'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { artifactsApi } from '@/lib/api/artifactsApi';
import { ArtifactBlock } from './ArtifactBlock';
import type { Artifact } from '@/types/artifact.types';

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
 */
export function ArtifactDeepLink({ artifactId }: { artifactId: string }) {
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
        Back to your conversation
      </Link>

      {loading ? (
        <p className="artifact-page__status" role="status">
          Opening…
        </p>
      ) : artifact ? (
        <ArtifactBlock artifact={artifact} defaultOpen />
      ) : (
        <p className="artifact-page__status">
          We could not open that just now. Your conversation is still where you left it.
        </p>
      )}
    </div>
  );
}
