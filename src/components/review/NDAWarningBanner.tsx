'use client';

import { useReviewStore } from '@/store/reviewStore';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

export interface NDAWarningBannerProps {
  /** Force-show regardless of detection (e.g. on the result page). */
  force?: boolean;
  message?: string;
}

/** Appears when a visitor's input reaches for mechanism detail or specific numbers. */
export function NDAWarningBanner({ force, message }: NDAWarningBannerProps) {
  const ndaSensitive = useReviewStore((s) => s.immediateResponse?.ndaSensitive ?? false);
  if (!force && !ndaSensitive) return null;
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-md border px-4 py-3"
      style={{ backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning-600)', color: 'var(--warning-text)' }}
    >
      <span aria-hidden className="mt-0.5">⚠</span>
      <p className="text-secondary">{message ?? NDA_WARNINGS.benchmarks}</p>
    </div>
  );
}
