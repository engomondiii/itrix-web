'use client';

import Link from 'next/link';
import type { Artifact } from '@/types/artifact.types';

/** Artifact deep links remain available. Private-review bearer/share links do not. */
export function ArtifactActions({ artifact }: { artifact: Artifact }) {
  return (
    <div className="artifact__actions">
      <Link href={`/a/${artifact.id}`} className="artifact__action">
        Open on its own
      </Link>
    </div>
  );
}
