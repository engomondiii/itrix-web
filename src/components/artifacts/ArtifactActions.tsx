'use client';

import Link from 'next/link';
import type { Artifact } from '@/types/artifact.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/** Artifact deep links remain available. Private-review bearer/share links do not. */
export function ArtifactActions({ artifact }: { artifact: Artifact }) {
  const copy = useCommonCopy();
  return (
    <div className="artifact__actions">
      <Link href={`/a/${artifact.id}`} className="artifact__action">
        {copy.openStandalone}
      </Link>
    </div>
  );
}
