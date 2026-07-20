'use client';

import type { Artifact } from '@/types/artifact.types';

/**
 * A document made available in the thread.
 *
 * It renders a NAME, a DESCRIPTION and a DOWNLOAD LINK — never the contents.
 * Two reasons, and both are load-bearing:
 *
 *   1. Rendering a document inline would mean rendering bytes we did not
 *      generate on our own origin. Downloads go through the audited endpoint
 *      with Content-Disposition: attachment (Backend v6.0 §4.4).
 *   2. Authorization is re-checked on the fetch, not on the render. A document
 *      whose ceiling a customer no longer meets must fail at the download, which
 *      it cannot do if we already inlined it.
 *
 * `disclosureLabel` is the plain-language tier — "Available after your NDA" —
 * never the internal tier string.
 */
interface DocumentPayload {
  name?: string;
  description?: string;
  downloadUrl?: string;
  disclosureLabel?: string;
  sizeLabel?: string;
}

export function DocumentArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as DocumentPayload;

  return (
    <div className="artifact__body">
      {p.description ? <p className="artifact__lead">{p.description}</p> : null}

      <div className="artifact__document">
        <div>
          <p className="artifact__document-name">{p.name ?? 'Document'}</p>
          <p className="artifact__document-meta">
            {p.sizeLabel ? <span>{p.sizeLabel}</span> : null}
            {p.disclosureLabel ? <span>{p.disclosureLabel}</span> : null}
          </p>
        </div>

        {p.downloadUrl ? (
          <a className="artifact__action" href={p.downloadUrl}>
            Download
          </a>
        ) : null}
      </div>
    </div>
  );
}
