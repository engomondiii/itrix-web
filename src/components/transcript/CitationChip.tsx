'use client';

/**
 * A grounding citation on a settled turn.
 *
 * Every agent answer traces to retrieved, approved Knowledge Core content
 * (Architecture v2.6 §00.1). This is the visitor-facing half of that: the
 * SOURCE TITLE only.
 *
 * What it must never expose: chunk ids, retrieval scores, the internal document
 * path, or the disclosure tier the chunk came from. Those are internal fields
 * and are absent from client-plane payloads by construction (§10.5) — this
 * component simply has nothing else to render.
 */
export interface CitationChipProps {
  label: string;
  href?: string | null;
}

export function CitationChip({ label, href = null }: CitationChipProps) {
  if (href) {
    return (
      <a className="citation-chip" href={href}>
        {label}
      </a>
    );
  }
  return <span className="citation-chip">{label}</span>;
}
