import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { PortalDocument } from '@/types/portal.types';

/** A folder of documents (§65). Locked items render without a link. */
export function DocumentFolder({ folder, documents }: { folder: string; documents: PortalDocument[] }) {
  return (
    <Card variant="default" className="flex flex-col gap-3">
      <SectionLabel withRule={false}>{folder}</SectionLabel>
      {documents.length === 0 ? (
        <p className="text-secondary text-ink-secondary">Nothing here yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border-soft">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-body text-ink-primary">{doc.title}</span>
              {doc.href ? (
                <a
                  href={doc.href}
                  className="text-secondary font-medium text-ink-primary hover:text-ink-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open →
                </a>
              ) : (
                <span className="rounded-pill bg-soft px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.08em] text-structure-600">
                  NDA
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
