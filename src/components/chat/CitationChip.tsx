import type { Citation } from '@/types/chat.types';

/** A small, non-interactive chip showing an approved Knowledge Core citation. */
export function CitationChip({ citation }: { citation: Citation }) {
  return (
    <span className="inline-flex items-center rounded-pill border border-line-subtle bg-surface-warm px-2 py-0.5 text-micro text-ink-500">
      {citation.label ?? citation.chunkId}
    </span>
  );
}
