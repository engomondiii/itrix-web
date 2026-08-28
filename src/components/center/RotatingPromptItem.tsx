'use client';

import { EXAMPLE_ICON } from '@/lib/content/exampleIcons';
import type { ExamplePrompt } from '@/lib/content/examplePrompts';

/**
 * One example prompt, as a button.
 *
 * Extracted so the rotating view and the `Show all five` static list render the
 * SAME control. Two copies of a chip is how one of them quietly stops recording
 * the a hidden routing signal, or stops populating and starts submitting.
 *
 * TWO RULES, both inherited unchanged from the retired ExamplePromptGrid:
 *   · Selecting it POPULATES the composer and moves focus into it. IT NEVER
 *     SUBMITS. The visitor keeps control of when the review begins, and the
 *     generated suggestion chips behave identically so the interaction is learned
 *     once.
 *   · The label is visitor-facing guidance only. It does not imply an internal persona,
 *     qualification result or relationship state.
 */
export interface RotatingPromptItemProps {
  example: ExamplePrompt;
  active: boolean;
  onSelect: (example: ExamplePrompt) => void;
}

export function RotatingPromptItem({ example, active, onSelect }: RotatingPromptItemProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className="prompt-card"
      onClick={() => onSelect(example)}
    >
      <span aria-hidden="true" className="prompt-card__glyph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d={EXAMPLE_ICON[example.category]} />
        </svg>
        <span className="prompt-card__index">{example.index}</span>
      </span>
      <span className="prompt-card__label">{example.label}</span>
      <span className="prompt-card__text">{example.prompt}</span>
    </button>
  );
}
