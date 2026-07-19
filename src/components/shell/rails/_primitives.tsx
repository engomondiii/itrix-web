'use client';

import type { ReactNode } from 'react';

/**
 * Shared primitives for rail sections.
 *
 * Every section looks the same because every section IS the same kind of thing:
 * a small, quiet panel of relationship memory or next-step assurance. Keeping the
 * chrome here means a new section is a content decision, not a styling one — and
 * means no single section can start shouting.
 */

export function RailPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rail-panel" aria-label={title}>
      <h3 className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">{title}</h3>
      <div className="mt-2.5 flex flex-col gap-2">{children}</div>
    </section>
  );
}

export function RailText({ children }: { children: ReactNode }) {
  return <p className="text-caption leading-relaxed text-ink-secondary">{children}</p>;
}

export function RailStrong({ children }: { children: ReactNode }) {
  return <p className="text-caption font-semibold leading-relaxed text-ink-primary">{children}</p>;
}

export function RailList({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item} className="text-caption leading-relaxed text-ink-secondary">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * A rail section with nothing to say renders nothing at all.
 *
 * This is the component-level half of "a rail with no authorized sections does
 * not mount": even an authorized section stays silent until it has content, so a
 * rail never fills with empty headings.
 */
export function RailEmpty(): null {
  return null;
}
