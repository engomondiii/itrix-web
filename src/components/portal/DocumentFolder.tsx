'use client';

import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import type { PortalDocument } from '@/types/portal.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';
import { useLocaleStore } from '@/store/localeStore';

/** A folder of documents (§65). Locked items render without a link. */
export function DocumentFolder({ folder, documents }: { folder: string; documents: PortalDocument[] }) {
  const copy = useCommonCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return (
    <Card variant="default" className="flex flex-col gap-3">
      <SectionLabel withRule={false}>{folder}</SectionLabel>
      {documents.length === 0 ? (
        <p className="text-secondary text-ink-secondary">{copy.nothingHere}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border-soft">
          {(documents ?? []).map((doc, index) => (
            <li key={doc.id ?? `${doc.title}-${index}`} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-body text-ink-primary">{doc.title}</span>
              {!doc.locked && doc.href ? (
                <a
                  href={doc.href}
                  className="text-secondary font-medium text-ink-primary hover:text-ink-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.openArrow}
                </a>
              ) : (
                <span className="rounded-pill bg-soft px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.08em] text-structure-600">
                  {doc.locked ? (ko ? '승인되지 않음' : 'Not authorized') : (ko ? '승인됨' : 'Authorized')}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
