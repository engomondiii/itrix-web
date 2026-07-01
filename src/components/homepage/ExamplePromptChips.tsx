'use client';

import { PRESSURE_SIGNALS } from '@/config/review.config';

/**
 * Soft, tappable example prompts (Playbook §10 pressure cards). Selecting one fills
 * the prompt window — a gentle way to begin without pushing product. Wording is the
 * visitor-facing pressure phrasing.
 */
const EXAMPLES: string[] = [
  ...PRESSURE_SIGNALS.map((p) => p.prompt),
  'I want to understand the idea behind itriX.',
];

export function ExamplePromptChips({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-ink-400">If useful, begin from one of these:</span>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onPick(text)}
            className="rounded-pill border border-line bg-surface px-3 py-1.5 text-secondary text-ink-700 transition-colors hover:border-sapphire-300 hover:bg-sapphire-50 hover:text-sapphire-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
