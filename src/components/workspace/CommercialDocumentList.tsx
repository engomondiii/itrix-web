import { WORKSPACE_COPY } from '@/lib/content/successCopy';
import type { CommercialDocument } from '@/types/workspace.types';

/**
 * Commercial documents in flight — State 9.
 *
 * Titles and status only. No terms, no figures, no pricing — those live in the
 * documents themselves, under the agreement that governs them, and never in a
 * list a browser has cached.
 */
export function CommercialDocumentList({ documents }: { documents: readonly CommercialDocument[] }) {
  if (documents.length === 0) return null;

  return (
    <section aria-labelledby="commercial-docs-title" className="flex flex-col gap-3">
      <h2 id="commercial-docs-title" className="font-display text-web-h3 text-ink-primary">
        {WORKSPACE_COPY.integration.documentsTitle}
      </h2>
      <ul className="flex flex-col gap-2">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border-soft bg-surface px-4 py-3"
          >
            {doc.href ? (
              <a href={doc.href} className="text-web-body text-ink-primary underline underline-offset-2">
                {doc.title}
              </a>
            ) : (
              <span className="text-web-body text-ink-primary">{doc.title}</span>
            )}
            <span className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
              {WORKSPACE_COPY.integration.documentStatus[doc.status]}
              <span className="ml-2 text-ink-muted">{new Date(doc.updatedAt).toLocaleDateString()}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
