'use client';

import { ArtifactBackedSection } from './ArtifactBackedSection';
import { PANE_SECTION_EMPTY } from '@/lib/content/paneCopy';

/** Documents shared under the current disclosure ceiling. */
export function DocumentsPaneSection() {
  return (
    <ArtifactBackedSection
      section="documents"
      types={['document']}
      emptyMessage={PANE_SECTION_EMPTY.documents}
    />
  );
}
