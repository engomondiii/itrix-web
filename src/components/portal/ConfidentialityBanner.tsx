'use client';

import { usePortalCopy } from '@/lib/i18n/portalLocale';

/** Always-visible confidentiality banner on the documents screen (§65). */
export function ConfidentialityBanner() {
  const portalCopy = usePortalCopy();
  return (
    <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
      <p className="text-caption text-ink-secondary">{portalCopy.documents.confidentialityBanner}</p>
    </div>
  );
}
