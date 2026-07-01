import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Always-visible confidentiality banner on the documents screen (§65). */
export function ConfidentialityBanner() {
  return (
    <div className="rounded-md border border-line-subtle bg-surface-warm px-4 py-3">
      <p className="text-caption text-ink-500">{PORTAL_COPY.documents.confidentialityBanner}</p>
    </div>
  );
}
