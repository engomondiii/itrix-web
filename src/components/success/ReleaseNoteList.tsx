'use client';

import { useSuccessCopy } from '@/lib/i18n/successLocale';
import type { ReleaseNote } from '@/types/success.types';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/** What shipped, when, and which versions it applies to. */
export function ReleaseNoteList({ notes }: { notes: readonly ReleaseNote[] }) {
  const successCopy = useSuccessCopy();
  const copy = useCommonCopy();
  if (notes.length === 0) return null;

  return (
    <section aria-labelledby="release-notes-title" className="flex flex-col gap-3">
      <h3 id="release-notes-title" className="font-display text-web-h3 text-ink-primary">
        {successCopy.knowledge.releaseNotesTitle}
      </h3>
      <ul className="flex flex-col gap-3">
        {notes.map((n) => (
          <li key={n.id} className="rounded-lg border border-border-soft bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-card-title text-ink-primary">{n.title}</h4>
              <span className="font-mono text-micro text-ink-muted">
                {new Date(n.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1.5 max-w-reading text-caption leading-relaxed text-ink-secondary">{n.body}</p>
            {n.appliesToVersions.length > 0 ? (
              <p className="mt-2 font-mono text-micro text-ink-muted">
                {copy.appliesTo} {n.appliesToVersions.join(', ')}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
