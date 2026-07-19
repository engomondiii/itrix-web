import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { ReleaseNote } from '@/types/success.types';

/** What shipped, when, and which versions it applies to. */
export function ReleaseNoteList({ notes }: { notes: readonly ReleaseNote[] }) {
  if (notes.length === 0) return null;

  return (
    <section aria-labelledby="release-notes-title" className="flex flex-col gap-3">
      <h3 id="release-notes-title" className="font-display text-web-h3 text-ink-primary">
        {SUCCESS_COPY.knowledge.releaseNotesTitle}
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
                Applies to {n.appliesToVersions.join(', ')}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
