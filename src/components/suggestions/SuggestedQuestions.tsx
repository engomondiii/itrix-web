'use client';

import { useId } from 'react';
import { SuggestionChip } from './SuggestionChip';
import { SUGGESTION_COPY } from '@/lib/content/suggestionCopy';
import type { Suggestion } from '@/hooks/useSuggestions';

/**
 * The suggestion group, between the transcript and the composer.
 *
 * It renders only when the backend reports the question loop open AND there are
 * chips to show. There is no empty state: a labelled box containing nothing is
 * worse than silence.
 *
 * Accessibility: the chips are buttons in a labelled group, and activating one
 * moves focus into the composer with the text inserted (the composer's
 * focusRequest handles the focus half). A visitor never has to hunt for where
 * their choice went.
 */
export interface SuggestedQuestionsProps {
  chips: Suggestion[];
  onChoose: (s: Suggestion) => void;
}

export function SuggestedQuestions({ chips, onChoose }: SuggestedQuestionsProps) {
  const uid = useId();
  const hintId = `${uid}-hint`;

  if (chips.length === 0) return null;

  return (
    <div
      className="suggestions"
      role="group"
      aria-label={SUGGESTION_COPY.groupLabel}
      aria-describedby={hintId}
    >
      <p className="suggestions__label">{SUGGESTION_COPY.groupLabel}</p>
      <p id={hintId} className="sr-only">
        {SUGGESTION_COPY.groupHint}
      </p>
      <div className="suggestions__chips">
        {chips.map((s) => (
          <SuggestionChip key={s.id} suggestion={s} onChoose={onChoose} />
        ))}
      </div>
    </div>
  );
}
