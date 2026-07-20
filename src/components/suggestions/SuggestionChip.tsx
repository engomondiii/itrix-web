'use client';

import type { Suggestion } from '@/hooks/useSuggestions';

/**
 * One generated follow-up question.
 *
 * It POPULATES the composer. It never submits (Surface 1 v5.0 §3.8). That is
 * the same contract as the example chips on the landing, and it is deliberate:
 * the visitor keeps control of when they speak.
 */
export function SuggestionChip({
  suggestion,
  onChoose,
}: {
  suggestion: Suggestion;
  onChoose: (s: Suggestion) => void;
}) {
  return (
    <button type="button" className="suggestion-chip" onClick={() => onChoose(suggestion)}>
      {suggestion.text}
    </button>
  );
}
