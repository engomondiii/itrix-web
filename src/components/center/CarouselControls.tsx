'use client';

import { useCenterCopy } from '@/lib/i18n/conversationLocale';


/**
 * Previous and next, plus a position readout.
 *
 * They are REAL BUTTONS with accessible names, ALWAYS RENDERED, and never
 * hover-only (Surface 1 v6.0 §2.3). A rotating element whose only manual control
 * appears on hover is unusable on touch and invisible to a keyboard.
 *
 * The readout is `aria-hidden`: it changes on every rotation, and announcing a
 * position nobody asked about is exactly the noise the "a carousel is not a live
 * region" rule exists to prevent.
 */
export interface CarouselControlsProps {
  index: number;
  count: number;
  onPrevious: () => void;
  onNext: () => void;
  /** Jump to one example. Supplied by the carousel; dots render only when present. */
  onSelect?: (index: number) => void;
}

export function CarouselControls({ index, count, onPrevious, onNext, onSelect }: CarouselControlsProps) {
  const centerCopy = useCenterCopy();
  return (
    <div className="prompt-carousel__controls">
      <button
        type="button"
        className="prompt-carousel__step"
        aria-label={centerCopy.previousPrompt}
        onClick={onPrevious}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>

      {/* DOTS INSTEAD OF "1 / 5" ALONE. The count was there before, but a fraction in
          small type does not read as "there are four more of these you can look at" —
          which is the thing a visitor needs to notice. Dots make the set visible at a
          glance and give each example a direct target.

          The position stays as the accessible name on the group, so nothing is lost
          for a screen reader. */}
      {onSelect ? (
        <span className="prompt-carousel__dots" role="tablist" aria-label={`${index + 1} of ${count}`}>
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Example ${i + 1} of ${count}`}
              className="prompt-carousel__dot"
              data-active={i === index ? 'true' : undefined}
              onClick={() => onSelect(i)}
            />
          ))}
        </span>
      ) : (
        <span aria-hidden="true" className="prompt-carousel__position">
          {index + 1} / {count}
        </span>
      )}

      <button
        type="button"
        className="prompt-carousel__step"
        aria-label={centerCopy.nextPrompt}
        onClick={onNext}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
