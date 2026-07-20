'use client';

import Link from 'next/link';
import type { Artifact } from '@/types/artifact.types';

/**
 * What a visitor can do with an artifact.
 *
 *   Open        the deep-link view, for print and sharing
 *   Email/share only when the backend minted a capability token for it
 *
 * The deep link is an ALTERNATIVE view, never the only path. Every deep-link
 * page carries a way back into its thread, so an artifact can never become the
 * real interface while the conversation decays behind it
 * (Architecture v2.6 risk register).
 *
 * There is no "regenerate" and no "download raw" — both are backend-authorized
 * operations and neither belongs to the visitor.
 */
export function ArtifactActions({ artifact }: { artifact: Artifact }) {
  const shareHref = artifact.capabilityToken ? `/c/${artifact.capabilityToken}` : null;

  return (
    <div className="artifact__actions">
      <Link href={`/a/${artifact.id}`} className="artifact__action">
        Open on its own
      </Link>
      {shareHref ? (
        <Link href={shareHref} className="artifact__action">
          Get a shareable link
        </Link>
      ) : null}
    </div>
  );
}
