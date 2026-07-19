'use client';

import { CENTER_COPY } from '@/lib/content/centerCopy';
import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import type { ExamplePrompt } from '@/lib/content/examplePrompts';

export interface ExamplePromptGridProps {
  /**
   * Called with the chosen example. The caller POPULATES the composer with
   * `example.prompt` and records `example.family` as a routing prior.
   * It must NOT submit — the visitor still decides when to begin.
   */
  onSelect: (example: ExamplePrompt) => void;
  /** The current composer value, so the active chip can be marked. */
  value?: string;
}

/**
 * The five example prompts.
 *
 * One per functional family, mapping one-to-one onto the families that organise
 * the 60-persona target-account workbook. They give a visitor who does not yet
 * know how to phrase their problem a way in — and they give us a first, honest
 * self-classification signal.
 *
 * Two rules:
 *   · Selecting a chip POPULATES the composer. It never submits (Surface 1
 *     v4.0 §2.1 #6). The visitor keeps control of when the review begins.
 *   · The family label is the VISITOR'S language. It is never the internal
 *     persona taxonomy, and the family we infer is never shown back to them
 *     (Architecture v2.5 §4.2, §9.4).
 */
export function ExamplePromptGrid({ onSelect, value = '' }: ExamplePromptGridProps) {
  const current = value.trim().toLowerCase();

  return (
    <section className="mt-9" aria-labelledby="example-title">
      <h2 id="example-title" className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
        {CENTER_COPY.examplesLabel}
      </h2>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLE_PROMPTS.map((example) => {
          const active = current === example.prompt.toLowerCase();
          return (
            <button
              key={example.index}
              type="button"
              onClick={() => onSelect(example)}
              aria-pressed={active}
              className={[
                'group flex items-start gap-3 rounded-md border p-3 text-left transition-colors duration-base',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                active
                  ? 'border-border-medium bg-soft'
                  : 'border-border-soft bg-surface-glass-soft hover:border-border-medium hover:bg-soft',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="mt-[2px] font-mono text-micro text-ink-muted transition-colors group-hover:text-ink-secondary"
              >
                {example.index}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                  {example.label}
                </span>
                <span className="text-caption leading-snug text-ink-primary">{example.prompt}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
