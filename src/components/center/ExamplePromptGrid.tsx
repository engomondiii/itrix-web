'use client';

import { CENTER_COPY } from '@/lib/content/centerCopy';
import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import { useComposerStore } from '@/store/composerStore';
import { EXAMPLE_ICON } from '@/lib/content/exampleIcons';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * The five example prompts.
 *
 * One per functional family, mapping one-to-one onto the families that organise
 * the 60-persona target-account workbook. They give a visitor who does not yet
 * know how to phrase their problem a way in — and they give us a first, honest
 * self-classification signal.
 *
 * Two rules:
 *   · Selecting a chip POPULATES the composer and moves focus into it. IT NEVER
 *     SUBMITS (§2.1 element 6). The visitor keeps control of when the review
 *     begins. From Phase 2 the generated suggestion chips behave identically, so
 *     the interaction is learned once.
 *   · The family label is the VISITOR'S language. It is never the internal
 *     persona taxonomy, and the family we infer is never shown back to them.
 *
 * v5.0 CHANGE: it writes to composerStore rather than taking an `onSelect` prop.
 * That is what lets the landing render as a server component while the composer
 * and the chips stay in sync without being siblings.
 */
export function ExamplePromptGrid() {
  const value = useComposerStore((s) => s.value);
  const populate = useComposerStore((s) => s.populate);

  const current = value.trim().toLowerCase();

  return (
    <section className="example-grid-wrap" aria-labelledby="example-title">
      <h2 id="example-title" className="example-grid__label">
        {CENTER_COPY.examplesLabel}
      </h2>

      <div className="example-grid">
        {EXAMPLE_PROMPTS.map((example) => {
          const active = current === example.prompt.toLowerCase();
          return (
            <button
              key={example.index}
              type="button"
              aria-pressed={active}
              className="example-card"
              onClick={() => {
                populate(example.prompt, example.family);
                trackEvent('center.example_selected', {
                  family: example.family,
                  index: example.index,
                });
              }}
            >
              {/* The approved prototype pairs each card with a small tinted
                  glyph tile. The two-digit index from the approved copy sits
                  beside it, so the card carries both. */}
              <span aria-hidden="true" className="example-card__glyph">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={EXAMPLE_ICON[example.family]} />
                </svg>
                <span className="example-card__index">{example.index}</span>
              </span>
              <span className="example-card__label">{example.label}</span>
              <span className="example-card__text">{example.prompt}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
