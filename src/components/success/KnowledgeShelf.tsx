import { SUCCESS_COPY } from '@/lib/content/successCopy';
import type { KnowledgeItem } from '@/types/success.types';

const KIND_LABEL: Record<KnowledgeItem['kind'], string> = {
  training: 'Training',
  documentation: 'Documentation',
  practice: 'Recommended practice',
};

/**
 * Role-based training, documentation and recommended practices.
 *
 * Grouped by kind rather than by product, because a customer arriving here is
 * looking for "how do I learn this" or "where is the reference", not for a
 * catalogue of what itriX has written.
 */
export function KnowledgeShelf({ items }: { items: readonly KnowledgeItem[] }) {
  if (items.length === 0) return <p className="text-web-body text-ink-secondary">{SUCCESS_COPY.knowledge.empty}</p>;

  const kinds: KnowledgeItem['kind'][] = ['training', 'documentation', 'practice'];

  return (
    <div className="flex flex-col gap-6">
      {kinds.map((kind) => {
        const group = items.filter((i) => i.kind === kind);
        if (group.length === 0) return null;
        return (
          <section key={kind} aria-labelledby={`kn-${kind}`}>
            <h3 id={`kn-${kind}`} className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
              {KIND_LABEL[kind]}
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {group.map((item) => (
                <li key={item.id} className="rounded-lg border border-border-soft bg-surface px-4 py-3">
                  {item.href ? (
                    <a href={item.href} className="text-web-body text-ink-primary underline underline-offset-2">
                      {item.title}
                    </a>
                  ) : (
                    <span className="text-web-body text-ink-primary">{item.title}</span>
                  )}
                  <p className="mt-1 text-caption text-ink-secondary">
                    {item.audience ? `For ${item.audience}` : 'For everyone'}
                    {item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
