'use client';

import { CENTER_COPY } from '@/lib/content/centerCopy';

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
}

export function CarouselControls({ index, count, onPrevious, onNext }: CarouselControlsProps) {
  return (
    <div className="prompt-carousel__controls">
      <button
        type="button"
        className="prompt-carousel__step"
        aria-label={CENTER_COPY.previousPrompt}
        onClick={onPrevious}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>

      <span aria-hidden="true" className="prompt-carousel__position">
        {index + 1} / {count}
      </span>

      <button
        type="button"
        className="prompt-carousel__step"
        aria-label={CENTER_COPY.nextPrompt}
        onClick={onNext}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10 6 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
